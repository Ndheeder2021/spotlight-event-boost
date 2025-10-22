import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { MapPin, Building2, Circle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import mapAddressRadius from "@/assets/map-address-radius.jpg";
import mapCityArea from "@/assets/map-city-area.jpg";

interface LocationMapSelectorProps {
  location: any;
  onChange: (updates: Partial<any>) => void;
  onAddressChange: (address: string, coordinates?: { lat: number; lon: number }) => void;
}

export function LocationMapSelector({ location, onChange, onAddressChange }: LocationMapSelectorProps) {
  const { t } = useTranslation();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const circle = useRef<any>(null);
  const [locationType, setLocationType] = useState<"address" | "city">("address");
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);

  // Fetch Mapbox token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        if (error) throw error;
        if (data?.token) {
          setMapboxToken(data.token);
        }
      } catch (error) {
        console.error('Error fetching Mapbox token:', error);
      }
    };
    fetchToken();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [location?.lon || 18.0686, location?.lat || 59.3293], // Stockholm default
      zoom: 12,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  // Update map when location changes
  useEffect(() => {
    if (!map.current || !location?.lat || !location?.lon) return;

    // Remove old marker and circle
    if (marker.current) marker.current.remove();
    if (map.current.getLayer('radius-circle-outline')) {
      map.current.removeLayer('radius-circle-outline');
    }
    if (map.current.getLayer('radius-circle')) {
      map.current.removeLayer('radius-circle');
    }
    if (map.current.getSource('radius-circle')) {
      map.current.removeSource('radius-circle');
    }

    // Add new marker
    marker.current = new mapboxgl.Marker({ color: '#FF1654' })
      .setLngLat([location.lon, location.lat])
      .addTo(map.current);

    // Add radius circle if in address mode
    if (locationType === "address" && location.radius_km) {
      const radiusInMeters = location.radius_km * 1000;
      
      // Create circle using simple circle calculation
      const center = [location.lon, location.lat];
      const points = [];
      const distanceX = radiusInMeters / (111320 * Math.cos((location.lat * Math.PI) / 180));
      const distanceY = radiusInMeters / 110540;

      for (let i = 0; i <= 360; i += 5) {
        const angle = (i * Math.PI) / 180;
        points.push([
          center[0] + distanceX * Math.cos(angle),
          center[1] + distanceY * Math.sin(angle),
        ]);
      }

      // Wait for map to be fully loaded before adding layers
      const addCircle = () => {
        if (!map.current) return;

        map.current.addSource('radius-circle', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [points],
            },
            properties: {},
          },
        });

        map.current.addLayer({
          id: 'radius-circle',
          type: 'fill',
          source: 'radius-circle',
          paint: {
            'fill-color': '#FF1654',
            'fill-opacity': 0.15,
          },
        });

        map.current.addLayer({
          id: 'radius-circle-outline',
          type: 'line',
          source: 'radius-circle',
          paint: {
            'line-color': '#FF1654',
            'line-width': 3,
          },
        });
      };

      if (map.current.isStyleLoaded()) {
        addCircle();
      } else {
        map.current.once('load', addCircle);
      }
    }

    // Fit map to show the radius
    if (location.radius_km && locationType === "address") {
      const radiusInMeters = location.radius_km * 1000;
      const bounds = new mapboxgl.LngLatBounds();
      const center = [location.lon, location.lat];
      const distanceX = radiusInMeters / (111320 * Math.cos((location.lat * Math.PI) / 180));
      const distanceY = radiusInMeters / 110540;

      bounds.extend([center[0] - distanceX, center[1] - distanceY]);
      bounds.extend([center[0] + distanceX, center[1] + distanceY]);

      map.current.fitBounds(bounds, { padding: 50 });
    } else {
      map.current.flyTo({ center: [location.lon, location.lat], zoom: 12 });
    }
  }, [location?.lat, location?.lon, location?.radius_km, locationType]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left side - Form */}
      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="text-base font-semibold">{t('locationType')}</Label>
          <RadioGroup
            value={locationType}
            onValueChange={(value) => setLocationType(value as "address" | "city")}
            className="grid grid-cols-2 gap-4"
          >
            <div
              className={`relative flex flex-col items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                locationType === "address"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => setLocationType("address")}
            >
              <RadioGroupItem value="address" id="address" className="sr-only" />
              <div className="w-full aspect-video rounded-md overflow-hidden relative">
                <img 
                  src={mapAddressRadius} 
                  alt="Street address with radius" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <p className="font-medium">{t('streetAddressRadius')}</p>
                <p className="text-xs text-muted-foreground">{t('streetAddressExample')}</p>
              </div>
            </div>

            <div
              className={`relative flex flex-col items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                locationType === "city"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => setLocationType("city")}
            >
              <RadioGroupItem value="city" id="city" className="sr-only" />
              <div className="w-full aspect-video rounded-md overflow-hidden relative">
                <img 
                  src={mapCityArea} 
                  alt="City area" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <p className="font-medium">{t('cityCountryEtc')}</p>
                <p className="text-xs text-muted-foreground">{t('cityExample')}</p>
              </div>
            </div>
          </RadioGroup>
        </div>

        {locationType === "address" ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="address">{t('streetAddress')}</Label>
              <AddressAutocomplete
                value={location?.address_line ?? location?.address ?? ""}
                onChange={onAddressChange}
                placeholder={t('searchStreetAddress')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="radius" className="text-sm font-medium">{t('searchRadius')}</Label>
              <div className="relative">
                <Circle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="radius"
                  type="number"
                  step="1"
                  min="1"
                  max="100"
                  value={location?.radius_km || 20}
                  onChange={(e) => onChange({ radius_km: parseFloat(e.target.value) })}
                  className="pl-10 h-11 glass-card border-border/50 hover:border-primary/50 focus:border-primary transition-all shadow-sm hover:shadow-md focus:shadow-glow"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">km</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {t('radiusRecommendation')}
              </p>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="city-search">{t('cityOrArea')}</Label>
            <AddressAutocomplete
              value={location?.city ?? ""}
              onChange={(address, coordinates) => {
                onChange({
                  city: address,
                  address_line: null,
                  lat: coordinates?.lat,
                  lon: coordinates?.lon,
                  radius_km: null,
                });
              }}
              placeholder={t('searchCityOrArea')}
              required
            />
            <p className="text-xs text-muted-foreground">
              {t('searchCityDescription')}
            </p>
          </div>
        )}
      </div>

      {/* Right side - Map */}
      <div className="lg:sticky lg:top-6 h-[400px] lg:h-[600px]">
        {!mapboxToken ? (
          <div className="w-full h-full rounded-lg border shadow-lg flex items-center justify-center bg-muted">
            <p className="text-muted-foreground">{t('loadingMap')}</p>
          </div>
        ) : (
          <div ref={mapContainer} className="w-full h-full rounded-lg border shadow-lg" />
        )}
      </div>
    </div>
  );
}
