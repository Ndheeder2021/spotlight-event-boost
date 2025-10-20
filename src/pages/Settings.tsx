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
import { LocationMapSelector } from "@/components/LocationMapSelector";

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
            <CardContent className="space-y-6">
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
                        <SelectItem value="hotel">Hotell</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Plats och sökområde</h3>
                    <LocationMapSelector
                      location={location}
                      onChange={(updates) => setLocation({ ...location, ...updates })}
                      onAddressChange={handleAddressChange}
                    />
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
              <CardTitle>Automatisk Event-import</CardTitle>
              <CardDescription>Events importeras automatiskt varje dag</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4 p-4 border rounded-lg bg-muted/30">
                <div className="flex-1 space-y-2">
                  <h4 className="font-semibold">Automatisk daglig uppdatering</h4>
                  <p className="text-sm text-muted-foreground">
                    Spotlight hämtar automatiskt nya events varje dag baserat på din verksamhets plats och sökradie. 
                    Events läggs till i din kalender utan att du behöver göra något.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>✓ Konserter, sportevenemang & festivaler</span>
                    <span>•</span>
                    <span>✓ Datum, tid & förväntad publik</span>
                    <span>•</span>
                    <span>✓ Uppdateras varje natt kl. 02:00</span>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground p-4 bg-accent/5 rounded-lg">
                <strong>Info:</strong> Events importeras automatiskt baserat på din konfigurerade plats och radie. 
                Dubbletter filtreras automatiskt bort. Systemet hämtar events för de kommande 90 dagarna.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
