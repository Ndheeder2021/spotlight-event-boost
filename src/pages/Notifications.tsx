import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

interface NotificationRule {
  id: string;
  min_attendance: number;
  radius_km: number;
  channel: string;
  enabled: boolean;
  last_fired_at: string | null;
}

export default function Notifications() {
  const [rules, setRules] = useState<NotificationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [locationId, setLocationId] = useState<string | null>(null);
  const [newRule, setNewRule] = useState<{
    min_attendance: number;
    radius_km: number;
    channel: "email" | "inapp";
    enabled: boolean;
  }>({
    min_attendance: 1000,
    radius_km: 2.0,
    channel: "email",
    enabled: true,
  });

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: userRole } = await supabase
        .from("user_roles")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

      if (!userRole) throw new Error("No tenant found");
      setTenantId(userRole.tenant_id);

      const { data: location } = await supabase
        .from("locations")
        .select("id")
        .eq("tenant_id", userRole.tenant_id)
        .single();

      if (location) setLocationId(location.id);

      const { data, error } = await supabase
        .from("notification_rules")
        .select("*")
        .eq("tenant_id", userRole.tenant_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRules(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRule = async () => {
    if (!tenantId || !locationId) return;

    try {
      const { error } = await supabase.from("notification_rules").insert([{
        tenant_id: tenantId,
        location_id: locationId,
        ...newRule,
      }]);

      if (error) throw error;
      toast.success("Notifieringsregel skapad!");
      loadRules();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleToggleRule = async (id: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from("notification_rules")
        .update({ enabled })
        .eq("id", id);

      if (error) throw error;
      setRules(rules.map((r) => (r.id === id ? { ...r, enabled } : r)));
      toast.success(enabled ? "Regel aktiverad" : "Regel inaktiverad");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (!confirm("Är du säker på att du vill ta bort denna regel?")) return;

    try {
      const { error } = await supabase.from("notification_rules").delete().eq("id", id);
      if (error) throw error;
      setRules(rules.filter((r) => r.id !== id));
      toast.success("Regel raderad");
    } catch (error: any) {
      toast.error(error.message);
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
        <h1 className="text-3xl font-bold mb-2">Notifieringar</h1>
        <p className="text-muted-foreground">Konfigurera automatiska notifieringar för stora events</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Ny notifieringsregel
          </CardTitle>
          <CardDescription>
            Få meddelanden när stora events sker nära din verksamhet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min_attendance">Minsta antal deltagare</Label>
              <Input
                id="min_attendance"
                type="number"
                value={newRule.min_attendance}
                onChange={(e) => setNewRule({ ...newRule, min_attendance: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="radius">Radie (km)</Label>
              <Input
                id="radius"
                type="number"
                step="0.5"
                value={newRule.radius_km}
                onChange={(e) => setNewRule({ ...newRule, radius_km: parseFloat(e.target.value) })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="channel">Kanal</Label>
            <Select value={newRule.channel} onValueChange={(value: "email" | "inapp") => setNewRule({ ...newRule, channel: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">E-post</SelectItem>
                <SelectItem value="inapp">In-app</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAddRule} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Skapa regel
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Aktiva regler</h2>
        {rules.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Inga notifieringsregler än</p>
            </CardContent>
          </Card>
        ) : (
          rules.map((rule) => (
            <Card key={rule.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex-1">
                  <p className="font-medium">
                    Events med {rule.min_attendance.toLocaleString()}+ deltagare inom {rule.radius_km} km
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Kanal: {rule.channel === "email" ? "E-post" : "In-app"}
                    {rule.last_fired_at && ` • Senast utlöst: ${new Date(rule.last_fired_at).toLocaleDateString("sv")}`}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Switch checked={rule.enabled} onCheckedChange={(checked) => handleToggleRule(rule.id, checked)} />
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteRule(rule.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
