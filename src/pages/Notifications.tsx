import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Plus, Trash2, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";

interface NotificationRule {
  id: string;
  min_attendance: number;
  radius_km: number;
  channel: string;
  enabled: boolean;
  last_fired_at: string | null;
}

export default function Notifications() {
  const { t } = useTranslation();
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
      toast.success(t('ruleCreated'));
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
      toast.success(enabled ? t('ruleEnabled') : t('ruleDisabled'));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (!confirm(t('confirmDeleteRule'))) return;

    try {
      const { error } = await supabase.from("notification_rules").delete().eq("id", id);
      if (error) throw error;
      setRules(rules.filter((r) => r.id !== id));
      toast.success(t('ruleDeleted'));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5 flex items-center justify-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-card">
          <Sparkles className="h-6 w-6 animate-spin text-primary" />
          <p className="text-lg font-medium">{t('loadingNotifications')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="mb-12 space-y-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="h-12 w-1 bg-gradient-to-b from-primary to-accent rounded-full" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                {t('notificationsTitle')}
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                {t('notificationsDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* New Rule Card */}
        <Card className="mb-8 glass-card premium-glow border-primary/20 hover-lift animate-fade-in">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold gradient-text">
                  {t('newNotificationRule')}
                </CardTitle>
                <CardDescription className="text-base">
                  {t('newNotificationRuleDesc')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min_attendance" className="text-sm font-medium flex items-center gap-2">
                  <span>{t('minAttendance')}</span>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                    {newRule.min_attendance.toLocaleString()}
                  </Badge>
                </Label>
                <Input
                  id="min_attendance"
                  type="number"
                  value={newRule.min_attendance}
                  onChange={(e) => setNewRule({ ...newRule, min_attendance: parseInt(e.target.value) })}
                  className="h-11 glass-card border-border/50 hover:border-primary/50 focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="radius" className="text-sm font-medium flex items-center gap-2">
                  <span>{t('radiusKm')}</span>
                  <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20 text-xs">
                    {newRule.radius_km} km
                  </Badge>
                </Label>
                <Input
                  id="radius"
                  type="number"
                  step="0.5"
                  value={newRule.radius_km}
                  onChange={(e) => setNewRule({ ...newRule, radius_km: parseFloat(e.target.value) })}
                  className="h-11 glass-card border-border/50 hover:border-accent/50 focus:border-accent transition-colors"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="channel" className="text-sm font-medium">{t('channel')}</Label>
              <Select value={newRule.channel} onValueChange={(value: "email" | "inapp") => setNewRule({ ...newRule, channel: value })}>
                <SelectTrigger className="h-11 glass-card border-border/50 hover:border-primary/50 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card">
                  <SelectItem value="email">{t('email')}</SelectItem>
                  <SelectItem value="inapp">{t('inApp')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddRule} className="w-full h-11 hover-scale">
              <Save className="h-4 w-4 mr-2" />
              {t('createRule')}
            </Button>
          </CardContent>
        </Card>

        {/* Active Rules Section */}
        <div className="space-y-4 animate-fade-in stagger-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold gradient-text">{t('activeRules')}</h2>
            {rules.length > 0 && (
              <Badge className="bg-primary/10 text-primary border-primary/30">
                {rules.length}
              </Badge>
            )}
          </div>
          
          {rules.length === 0 ? (
            <Card className="glass-card border-0">
              <CardContent className="flex flex-col items-center justify-center py-20">
                <div className="p-4 rounded-2xl bg-primary/10 mb-6">
                  <Bell className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{t('noRulesYet')}</h3>
                <p className="text-muted-foreground text-center text-lg max-w-md">
                  {t('noRulesDesc')}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {rules.map((rule, index) => (
                <Card key={rule.id} className={`glass-card border-border/50 hover:border-primary/50 hover-lift transition-all animate-fade-in stagger-${(index % 5) + 1}`}>
                  <CardContent className="flex items-center justify-between py-5 px-6">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">
                          {t('eventsWithAttendance', { attendance: rule.min_attendance.toLocaleString(), radius: rule.radius_km })}
                        </p>
                        {!rule.enabled && (
                          <Badge variant="secondary" className="bg-muted text-muted-foreground">
                            {t('inactive')}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline" className="border-primary/30 text-primary">
                          {rule.channel === "email" ? t('email') : t('inApp')}
                        </Badge>
                        {rule.last_fired_at && (
                          <>
                            <span>•</span>
                            <span>{t('lastTriggered')}: {new Date(rule.last_fired_at).toLocaleDateString("sv")}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Switch 
                        checked={rule.enabled} 
                        onCheckedChange={(checked) => handleToggleRule(rule.id, checked)}
                        className="data-[state=checked]:bg-primary"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteRule(rule.id)}
                        className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
