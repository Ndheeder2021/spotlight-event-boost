import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { SubscriptionManager } from "@/components/SubscriptionManager";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [location, setLocation] = useState<any>(null);
  const [tenant, setTenant] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: userRole } = await supabase
        .from("user_roles")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

      if (!userRole) throw new Error("No tenant found");

      const { data: locationByTenant, error: locByTenantErr } = await supabase
        .from("locations")
        .select("*")
        .eq("tenant_id", userRole.tenant_id)
        .maybeSingle();

      let resolvedLocation = locationByTenant;
      if (!resolvedLocation) {
        // Fallback: vissa konton har location-id = user-id
        const { data: locationByUser } = await supabase
          .from("locations")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();
        resolvedLocation = locationByUser || null;
      }

      // Prefill address_line från address om tom
      if (resolvedLocation && !resolvedLocation.address_line && resolvedLocation.address) {
        resolvedLocation = { ...resolvedLocation, address_line: resolvedLocation.address };
      }

      if (resolvedLocation) setLocation(resolvedLocation);

      const { data: tenantData } = await supabase
        .from("tenants")
        .select("*")
        .eq("id", userRole.tenant_id)
        .single();
      if (tenantData) setTenant(tenantData);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLocation = async () => {
    if (!location) return;
    
    // Validation
    if (!location.name?.trim()) {
      toast.error("Verksamhetens namn krävs");
      return;
    }
    if (!location.address_line?.trim()) {
      toast.error("Adress krävs");
      return;
    }
    if (!location.city?.trim()) {
      toast.error("Stad krävs");
      return;
    }
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("locations")
        .update({
          name: location.name,
          business_type: location.business_type,
          address_line: location.address_line,
          address: location.address_line, // Update main address field too
          city: location.city,
          lat: location.lat,
          lon: location.lon,
          radius_km: location.radius_km,
        })
        .eq("id", location.id);

      if (error) throw error;
      toast.success("Inställningar sparade!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddressChange = (address: string, coordinates?: { lat: number; lon: number }) => {
    if (!location) return;
    
    // Extract city from address (usually after first comma)
    const addressParts = address.split(',');
    const city = addressParts.length > 1 ? addressParts[1].trim() : location.city || '';
    
    setLocation({
      ...location,
      address_line: address,
      address: address,
      city: city,
      lat: coordinates?.lat || location.lat,
      lon: coordinates?.lon || location.lon,
    });

    // Autospara direkt när en adress valts
    setTimeout(() => {
      handleSaveLocation();
    }, 300);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse">Laddar...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Inställningar</h1>
        <p className="text-muted-foreground">Hantera din verksamhet och integrationer</p>
      </div>

      <Tabs defaultValue="location">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="location">Verksamhet</TabsTrigger>
          <TabsTrigger value="team">Team & Abonnemang</TabsTrigger>
          <TabsTrigger value="integrations">Integrationer</TabsTrigger>
        </TabsList>

        <TabsContent value="location">
          <Card>
            <CardHeader>
              <CardTitle>Verksamhetsinformation</CardTitle>
              <CardDescription>Uppdatera information om din verksamhet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {location && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Verksamhetens namn</Label>
                    <Input
                      id="name"
                      value={location.name || ""}
                      onChange={(e) => setLocation({ ...location, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business_type">Typ av verksamhet</Label>
                    <Select
                      value={location.business_type}
                      onValueChange={(value) => setLocation({ ...location, business_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cafe">Café</SelectItem>
                        <SelectItem value="bar">Bar</SelectItem>
                        <SelectItem value="restaurant">Restaurang</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Adress</Label>
                    <AddressAutocomplete
                      value={location.address_line ?? location.address ?? ""}
                      onChange={handleAddressChange}
                      placeholder="Sök adress..."
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Börja skriva för att söka adress. Staden uppdateras automatiskt.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Stad</Label>
                    <Input
                      id="city"
                      value={location.city || ""}
                      onChange={(e) => setLocation({ ...location, city: e.target.value })}
                      placeholder="Uppdateras automatiskt när du väljer adress"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="radius">Sökradie (km)</Label>
                    <Input
                      id="radius"
                      type="number"
                      step="5"
                      min="5"
                      max="100"
                      value={location.radius_km || 10}
                      onChange={(e) => setLocation({ ...location, radius_km: parseFloat(e.target.value) })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Större radie ger fler events (rekommenderat: 10-20 km)
                    </p>
                  </div>

                  <Button onClick={handleSaveLocation} disabled={saving} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Sparar..." : "Spara ändringar"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Team & Abonnemang</CardTitle>
              <CardDescription>Hantera ditt abonnemang och välj rätt plan för dina behov</CardDescription>
            </CardHeader>
            <CardContent>
              {tenant && (
                <SubscriptionManager
                  currentPlan={tenant.plan}
                  tenantId={tenant.id}
                  onPlanChange={loadData}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Ticketmaster Integration</CardTitle>
              <CardDescription>Importera events från Ticketmaster till din eventkalender</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4 p-4 border rounded-lg bg-muted/30">
                <div className="flex-1 space-y-2">
                  <h4 className="font-semibold">Hämta Events från Ticketmaster</h4>
                  <p className="text-sm text-muted-foreground">
                    Importera konserter, sportevenemang, festivaler och mer baserat på din affärs plats och radius. 
                    Events kommer att läggas till i din kalender automatiskt.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>✓ Eventnamn och kategori</span>
                    <span>•</span>
                    <span>✓ Datum & tid</span>
                    <span>•</span>
                    <span>✓ Plats och förväntad publik</span>
                  </div>
                </div>
                <Button
                  onClick={async () => {
                    if (!location) {
                      toast.error("Ingen plats konfigurerad. Vänligen ställ in din affärs plats först");
                      return;
                    }

                    // Säkerställ en minsta radie vid import för bättre träffar
                    const effectiveRadius = Math.max(Number(location.radius_km) || 10, 15);

                    toast.loading("Importerar events från PredictHQ...");

                    try {
                      const { data, error } = await supabase.functions.invoke(
                        'import-eventbrite-events',
                        {
                          body: {
                            latitude: location.lat,
                            longitude: location.lon,
                            radius: effectiveRadius,
                            startDate: new Date().toISOString(),
                            endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ahead
                          },
                        }
                      );

                      if (error) throw error;

                      if (data?.imported === 0) {
                        toast.info(`0 events hittades. Vi använde ${effectiveRadius} km. Öka gärna radien till 20–50 km för fler träffar.`);
                      } else {
                        toast.success(`✓ Import lyckades! ${data.imported} events importerades från PredictHQ`);
                      }
                    } catch (error) {
                      console.error('Import error:', error);
                      toast.error(error instanceof Error ? error.message : "Ett fel uppstod vid import");
                    }
                  }}
                  className="whitespace-nowrap"
                >
                  Importera Events
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground p-4 bg-accent/5 rounded-lg">
                <strong>Tips:</strong> Events importeras baserat på din konfigurerade plats och radius. 
                Dubbletter filtreras automatiskt bort. Du kan köra importen när som helst för att hämta nya events.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
