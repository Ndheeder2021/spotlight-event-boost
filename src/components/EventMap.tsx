import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface Event {
  id: string;
  title: string;
  category: string;
  venue_lat: number;
  venue_lon: number;
  venue_name: string;
  expected_attendance: number;
}

interface EventMapProps {
  events: Event[];
  userLocation: { lat: number; lon: number };
  onEventClick?: (eventId: string) => void;
}

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    music: "#9b87f5",
    sport: "#22c55e",
    festival: "#f97316",
    conference: "#3b82f6",
  };
  return colors[category.toLowerCase()] || "#6b7280";
};

export const EventMap = ({ events, userLocation, onEventClick }: EventMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken =
      "pk.eyJ1IjoibmRoZWVkZXIyMDIxIiwiYSI6ImNtZ2ZhdXI2aDA0am8ycnIxdTJnYmlkY2oifQ.J7VcCTr_bcW8lK6m4qudAA"; // User needs to add this

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [userLocation.lon, userLocation.lat],
      zoom: 11,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add user location marker
    new mapboxgl.Marker({ color: "#0EA5E9" })
      .setLngLat([userLocation.lon, userLocation.lat])
      .setPopup(new mapboxgl.Popup().setHTML("<strong>Din plats</strong>"))
      .addTo(map.current);

    return () => {
      markers.current.forEach((marker) => marker.remove());
      map.current?.remove();
    };
  }, [userLocation]);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing event markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Add event markers
    events.forEach((event) => {
      const el = document.createElement("div");
      el.className = "event-marker";
      el.style.backgroundColor = getCategoryColor(event.category);
      el.style.width = "24px";
      el.style.height = "24px";
      el.style.borderRadius = "50%";
      el.style.border = "2px solid white";
      el.style.cursor = "pointer";
      el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";

      const marker = new mapboxgl.Marker(el)
        .setLngLat([event.venue_lon, event.venue_lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div style="padding: 8px;">
              <strong>${event.title}</strong><br/>
              <span style="color: #666; font-size: 12px;">${event.venue_name}</span><br/>
              <span style="color: #666; font-size: 12px;">${event.expected_attendance.toLocaleString()} gäster</span>
            </div>`,
          ),
        )
        .addTo(map.current!);

      if (onEventClick) {
        el.addEventListener("click", () => onEventClick(event.id));
      }

      markers.current.push(marker);
    });

    // Fit map to show all markers
    if (events.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend([userLocation.lon, userLocation.lat]);
      events.forEach((event) => {
        bounds.extend([event.venue_lon, event.venue_lat]);
      });
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 13 });
    }
  }, [events, onEventClick, userLocation]);

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden border">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur p-3 rounded-lg shadow-lg">
        <div className="text-sm font-semibold mb-2">Kategorier</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#9b87f5" }}></div>
            <span>Musik</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#22c55e" }}></div>
            <span>Sport</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#f97316" }}></div>
            <span>Festival</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#3b82f6" }}></div>
            <span>Konferens</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Din plats</span>
          </div>
        </div>
      </div>
    </div>
  );
};
