import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, TrendingUp, Users, Calendar, DollarSign, Target, Activity, Lock } from "lucide-react";
import { usePlanFeatures } from "@/hooks/usePlanFeatures";
import { PlanUpgradeDialog } from "@/components/PlanUpgradeDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, subDays, startOfDay } from "date-fns";
import { sv } from "date-fns/locale";
import { Button } from "@/components/ui/button";

interface AnalyticsData {
  totalCampaigns: number;
  activeCampaigns: number;
  totalEvents: number;
  eventsThisWeek: number;
  campaignsByStatus: Record<string, number>;
  recentActivity: Array<{
    date: string;
    campaigns: number;
    events: number;
  }>;
}

export default function Reports() {
  const { features, loading } = usePlanFeatures();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && features.canViewAnalytics) {
      loadAnalytics();
    } else {
      setLoadingData(false);
    }
  }, [loading, features.canViewAnalytics]);

  const loadAnalytics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userRole } = await supabase
        .from("user_roles")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

      if (!userRole) return;

      const { data: location } = await supabase
        .from("locations")
        .select("lat, lon, radius_km")
        .eq("tenant_id", userRole.tenant_id)
        .single();

      if (!location) return;

      // Get campaigns data
      const { data: campaigns } = await supabase
        .from("campaigns")
        .select("*")
        .eq("tenant_id", userRole.tenant_id);

      // Get events data
      const { data: events } = await supabase
        .from("events")
        .select("*");

      // Filter events within radius
      const radiusKm = location.radius_km || 20;
      const nearbyEvents = events?.filter(event => {
        const distance = calculateDistance(
          location.lat,
          location.lon,
          event.venue_lat,
          event.venue_lon
        );
        return distance <= radiusKm;
      }) || [];

      // Calculate events this week
      const weekAgo = subDays(new Date(), 7);
      const eventsThisWeek = nearbyEvents.filter(event => 
        new Date(event.start_time) >= weekAgo
      ).length;

      // Group campaigns by status
      const campaignsByStatus = campaigns?.reduce((acc, campaign) => {
        acc[campaign.status] = (acc[campaign.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Calculate recent activity (last 7 days)
      const recentActivity = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        const dayStart = startOfDay(date);
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

        const dayCampaigns = campaigns?.filter(c => {
          const created = new Date(c.created_at);
          return created >= dayStart && created < dayEnd;
        }).length || 0;

        const dayEvents = nearbyEvents.filter(e => {
          const start = new Date(e.start_time);
          return start >= dayStart && start < dayEnd;
        }).length || 0;

        return {
          date: format(date, "EEE", { locale: sv }),
          campaigns: dayCampaigns,
          events: dayEvents,
        };
      });

      setAnalyticsData({
        totalCampaigns: campaigns?.length || 0,
        activeCampaigns: campaigns?.filter(c => c.status === 'published').length || 0,
        totalEvents: nearbyEvents.length,
        eventsThisWeek,
        campaignsByStatus,
        recentActivity,
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoadingData(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  if (loading || loadingData) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="text-center py-12">
          <Activity className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Laddar analytics...</p>
        </div>
      </div>
    );
  }

  if (!features.canViewAnalytics) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Analytics & Rapporter</h1>
          <p className="text-muted-foreground">Detaljerad statistik och insikter</p>
        </div>

        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 rounded-full bg-muted mb-4">
              <Lock className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Analytics kräver Professional</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Uppgradera till Professional eller Enterprise för att få tillgång till detaljerad analytics, grafer och insikter om dina kampanjer och events.
            </p>
            <Button onClick={() => setShowUpgrade(true)} size="lg">
              <TrendingUp className="h-4 w-4 mr-2" />
              Uppgradera nu
            </Button>
          </CardContent>
        </Card>

        <PlanUpgradeDialog
          open={showUpgrade}
          onOpenChange={setShowUpgrade}
          featureName="Analytics"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Analytics & Rapporter</h1>
        <p className="text-muted-foreground">Översikt och statistik för dina kampanjer och events</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-accent" />
              Totalt Kampanjer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analyticsData?.totalCampaigns || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Alla skapade kampanjer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              Aktiva Kampanjer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{analyticsData?.activeCampaigns || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Publicerade kampanjer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              Events Denna Vecka
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{analyticsData?.eventsThisWeek || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">I ditt område</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-500" />
              Totalt Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">{analyticsData?.totalEvents || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Närliggande events</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-accent" />
              Kampanjer per Status
            </CardTitle>
            <CardDescription>Fördelning av kampanjstatus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analyticsData?.campaignsByStatus || {}).map(([status, count]) => {
                const statusLabels: Record<string, string> = {
                  draft: "Utkast",
                  scheduled: "Schemalagd",
                  published: "Publicerad",
                };
                const statusColors: Record<string, string> = {
                  draft: "bg-gray-500",
                  scheduled: "bg-yellow-500",
                  published: "bg-green-500",
                };
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${statusColors[status] || 'bg-gray-500'}`} />
                      <span className="text-sm">{statusLabels[status] || status}</span>
                    </div>
                    <span className="text-sm font-semibold">{count}</span>
                  </div>
                );
              })}
              {Object.keys(analyticsData?.campaignsByStatus || {}).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Ingen data tillgänglig</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Aktivitet Senaste 7 Dagarna
            </CardTitle>
            <CardDescription>Skapade kampanjer och nya events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData?.recentActivity.map((day, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{day.date}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      {day.campaigns} kampanjer
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      {day.events} events
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-accent" />
            Kommande Features
          </CardTitle>
          <CardDescription>Fler analytics-funktioner under utveckling</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="p-3 rounded-lg bg-muted/50">
              <h4 className="font-semibold text-sm mb-1">ROI-beräkning</h4>
              <p className="text-xs text-muted-foreground">Beräkna avkastning på kampanjer</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <h4 className="font-semibold text-sm mb-1">A/B Test-resultat</h4>
              <p className="text-xs text-muted-foreground">Jämför kampanjvarianter</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <h4 className="font-semibold text-sm mb-1">Målgruppsinsikter</h4>
              <p className="text-xs text-muted-foreground">Demografisk och geografisk data</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <h4 className="font-semibold text-sm mb-1">Export till Excel</h4>
              <p className="text-xs text-muted-foreground">Ladda ner rapporter</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
