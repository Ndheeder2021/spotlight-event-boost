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

      const [locationRes, tenantRes] = await Promise.all([
        supabase.from("locations").select("*").eq("tenant_id", userRole.tenant_id).single(),
        supabase.from("tenants").select("*").eq("id", userRole.tenant_id).single(),
      ]);

      if (locationRes.data) setLocation(locationRes.data);
      if (tenantRes.data) setTenant(tenantRes.data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLocation = async () => {
    if (!location) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("locations")
        .update({
          name: location.name,
          business_type: location.business_type,
          address_line: location.address_line,
          city: location.city,
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
                    <Input
                      id="address"
                      value={location.address_line || ""}
                      onChange={(e) => setLocation({ ...location, address_line: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Stad</Label>
                    <Input
                      id="city"
                      value={location.city || ""}
                      onChange={(e) => setLocation({ ...location, city: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="radius">Sökradie (km)</Label>
                    <Input
                      id="radius"
                      type="number"
                      step="0.5"
                      value={location.radius_km || 2}
                      onChange={(e) => setLocation({ ...location, radius_km: parseFloat(e.target.value) })}
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
              <CardTitle>Integrationer</CardTitle>
              <CardDescription>Koppla externa tjänster</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Integrationer för Eventbrite, Google Maps och fler kommer snart
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
