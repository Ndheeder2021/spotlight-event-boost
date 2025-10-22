import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Sparkles, Settings as SettingsIcon, Users, Plug } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { SubscriptionManager } from "@/components/SubscriptionManager";
import { LocationMapSelector } from "@/components/LocationMapSelector";
import { TeamManagement } from "@/components/TeamManagement";
import { Badge } from "@/components/ui/badge";

export default function Settings() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [location, setLocation] = useState<any>(null);
  const [tenant, setTenant] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: userRole } = await supabase
        .from("user_roles")
        .select("tenant_id, role")
        .eq("user_id", user.id)
        .single();

      if (!userRole) throw new Error("No tenant found");
      
      // Check if user is admin
      setIsAdmin(userRole.role === 'admin');

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
      toast.error(t('businessNameRequired'));
      return;
    }
    
    // If address_line exists, it's address mode - require full address
    // If only city exists, it's city mode - only require city
    if (location.address_line && !location.address_line.trim()) {
      toast.error(t('addressRequired'));
      return;
    }
    
    if (!location.address_line && !location.city?.trim()) {
      toast.error(t('cityRequired'));
      return;
    }
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("locations")
        .update({
          name: location.name,
          business_type: location.business_type,
          address_line: location.address_line || null,
          address: location.address_line || location.city,
          city: location.city,
          lat: location.lat,
          lon: location.lon,
          radius_km: location.radius_km,
        })
        .eq("id", location.id);

      if (error) throw error;
      toast.success(t('settingsSaved'));
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
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5 flex items-center justify-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-card">
          <Sparkles className="h-6 w-6 animate-spin text-primary" />
          <p className="text-lg font-medium">{t('loadingSettings')}</p>
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
                {t('settingsTitle')}
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                {t('manageBusinessIntegrations')}
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="location" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 glass-card p-1 h-auto">
            <TabsTrigger 
              value="location" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2 h-11"
            >
              <SettingsIcon className="h-4 w-4" />
              <span className="hidden sm:inline">{t('businessTab')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="team" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2 h-11"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">{t('teamSubscriptionTab')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="integrations" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2 h-11"
            >
              <Plug className="h-4 w-4" />
              <span className="hidden sm:inline">{t('integrationsTab')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="location" className="animate-fade-in">
            <Card className="glass-card border-primary/20 premium-glow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary via-primary-glow to-primary/50 shadow-glow animate-pulse">
                    <SettingsIcon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold gradient-text">
                      {t('businessInfo')}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {t('updateBusinessInfo')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {location && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        {t('businessName')}
                      </Label>
                      <Input
                        id="name"
                        value={location.name || ""}
                        onChange={(e) => setLocation({ ...location, name: e.target.value })}
                        className="h-11 glass-card border-border/50 hover:border-primary/50 focus:border-primary transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="business_type" className="text-sm font-medium">
                        {t('businessType')}
                      </Label>
                      <Select
                        value={location.business_type}
                        onValueChange={(value) => setLocation({ ...location, business_type: value })}
                      >
                        <SelectTrigger className="h-11 glass-card border-border/50 hover:border-primary/50 transition-colors">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-card">
                          <SelectItem value="cafe">{t('cafe')}</SelectItem>
                          <SelectItem value="bar">{t('bar')}</SelectItem>
                          <SelectItem value="restaurant">{t('restaurant')}</SelectItem>
                          <SelectItem value="hotel">{t('hotel')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="border-t border-border/50 pt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-lg font-semibold gradient-text">{t('locationSearchArea')}</h3>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                          {location.radius_km} km
                        </Badge>
                      </div>
                      <LocationMapSelector
                        location={location}
                        onChange={(updates) => setLocation({ ...location, ...updates })}
                        onAddressChange={handleAddressChange}
                      />
                    </div>

                    <Button 
                      onClick={handleSaveLocation} 
                      disabled={saving} 
                      className="w-full h-11 hover-scale"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? t('saving') : t('saveChanges')}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="animate-fade-in">
            <div className="space-y-6">
              {tenant && (
                <>
                  <TeamManagement
                    currentPlan={tenant.plan}
                    tenantId={tenant.id}
                  />
                  
                  <Card className="glass-card border-accent/20 hover-lift">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-accent via-accent-glow to-accent/50 shadow-glow animate-pulse">
                          <Users className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold gradient-text">
                            {t('subscription')}
                          </CardTitle>
                          <CardDescription className="text-base">
                            {t('manageSubscription')}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <SubscriptionManager
                        currentPlan={tenant.plan}
                        tenantId={tenant.id}
                        onPlanChange={loadData}
                      />
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="integrations" className="animate-fade-in">
            <Card className="glass-card border-primary/20 premium-glow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary via-primary-glow to-primary/50 shadow-glow animate-pulse">
                    <Plug className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold gradient-text">
                      {t('autoEventImport')}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {t('eventsImportedDaily')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4 p-4 glass-card border-border/50 rounded-lg">
                  <div className="flex-1 space-y-3">
                    <h4 className="font-semibold text-foreground">{t('autoDailyUpdate')}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t('autoUpdateDesc')}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      {t('importFeatures').split('•').map((feature, i) => (
                        <Badge key={i} variant="outline" className="border-primary/30 text-primary">
                          {feature.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                {isAdmin && (
                  <div className="flex items-start gap-4 p-4 glass-card border-primary/50 rounded-lg bg-primary/5">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-primary">{t('adminManualImport')}</h4>
                        <Badge className="bg-primary text-primary-foreground">Admin</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t('adminManualImportDesc')}
                      </p>
                    </div>
                    <Button
                      onClick={async () => {
                        if (!location) {
                          toast.error(t('noLocationConfigured'));
                          return;
                        }

                        setImporting(true);
                        toast.loading(t('importingEvents'));

                        try {
                          const lat = location.lat;
                          const lon = location.lon;
                          const effectiveRadius = Number(location.radius_km) || 50;

                          console.log(`Importerar från: lat=${lat}, lon=${lon}, radius=${effectiveRadius}km`);

                          const { data, error } = await supabase.functions.invoke(
                            'import-eventbrite-events',
                            {
                              body: {
                                latitude: lat,
                                longitude: lon,
                                radius: effectiveRadius,
                                startDate: new Date().toISOString(),
                                endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
                              },
                            }
                          );
                        
                          if (error) throw error;

                          if (data?.imported === 0) {
                            toast.info(t('noEventsFoundImport'));
                          } else {
                            toast.success(t('importSuccess', { count: data.imported }));
                          }
                        } catch (error) {
                          console.error('Import error:', error);
                          toast.error(error instanceof Error ? error.message : t('importError'));
                        } finally {
                          setImporting(false);
                        }
                      }}
                      disabled={importing}
                      className="whitespace-nowrap h-11 hover-scale"
                    >
                      {importing ? t('importing') : t('importNow')}
                    </Button>
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground p-4 glass-card border-accent/30 rounded-lg bg-accent/5">
                  <strong>Info:</strong> {t('importInfo')}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
