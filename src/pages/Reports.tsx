import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, TrendingUp, Users, Calendar, DollarSign, Target, Activity, Lock, Download, MapPin, TestTube2, Sparkles } from "lucide-react";
import { usePlanFeatures } from "@/hooks/usePlanFeatures";
import { PlanUpgradeDialog } from "@/components/PlanUpgradeDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, subDays, startOfDay } from "date-fns";
import { sv } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  eventsByCategory: Record<string, number>;
  eventsByCity: Record<string, number>;
  topCampaigns: Array<{
    id: string;
    title: string;
    status: string;
    eventCount: number;
  }>;
}

export default function Reports() {
  const { features, loading } = usePlanFeatures();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalEvents: 0,
    eventsThisWeek: 0,
    campaignsByStatus: {},
    recentActivity: [],
    eventsByCategory: {},
    eventsByCity: {},
    topCampaigns: [],
  });
  const [loadingData, setLoadingData] = useState(true);
  const [roiCost, setRoiCost] = useState("");
  const [roiRevenue, setRoiRevenue] = useState("");
  const [calculatedROI, setCalculatedROI] = useState<number | null>(null);

  useEffect(() => {
    console.log("[Reports] features loading:", loading, "canViewAnalytics:", features.canViewAnalytics);
    if (!loading && features.canViewAnalytics) {
      loadAnalytics();
    } else if (!loading && !features.canViewAnalytics) {
      setLoadingData(false);
    }
  }, [loading, features.canViewAnalytics]);

  const loadAnalytics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("[Reports] user:", user?.id);
      if (!user) { 
        setLoadingData(false);
        return;
      }

      const { data: userRole } = await supabase
        .from("user_roles")
        .select("tenant_id")
        .eq("user_id", user.id)
        .maybeSingle();
      console.log("[Reports] userRole:", userRole);

      if (!userRole) {
        toast.error("Kunde inte hitta din organisation. Kontakta support.");
        setLoadingData(false);
        return;
      }

      const { data: location } = await supabase
        .from("locations")
        .select("lat, lon, radius_km")
        .eq("tenant_id", userRole.tenant_id)
        .maybeSingle();
      console.log("[Reports] location:", location);

      if (!location) {
        toast.error("Du behöver ställa in din plats i inställningar först.");
        setLoadingData(false);
        return;
      }

      // Get campaigns data
      const { data: campaigns } = await supabase
        .from("campaigns")
        .select("*")
        .eq("tenant_id", userRole.tenant_id);
      console.log("[Reports] campaigns count:", campaigns?.length || 0);

      // Get events data
      const { data: events } = await supabase
        .from("events")
        .select("*");
      console.log("[Reports] events count:", events?.length || 0);

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

      // Group events by category
      const eventsByCategory = nearbyEvents.reduce((acc, event) => {
        acc[event.category] = (acc[event.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Group events by city
      const eventsByCity = nearbyEvents.reduce((acc, event) => {
        const city = event.city || "Okänd";
        acc[city] = (acc[city] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Get top campaigns with event count
      const topCampaigns = campaigns?.map(campaign => ({
        id: campaign.id,
        title: campaign.title,
        status: campaign.status,
        eventCount: 1,
      })).slice(0, 5) || [];

      setAnalyticsData({
        totalCampaigns: campaigns?.length || 0,
        activeCampaigns: campaigns?.filter(c => c.status === 'published').length || 0,
        totalEvents: nearbyEvents.length,
        eventsThisWeek,
        campaignsByStatus,
        recentActivity,
        eventsByCategory,
        eventsByCity,
        topCampaigns,
      });
    } catch (error: any) {
      console.error("Error loading analytics:", error);
      toast.error("Kunde inte ladda analytics-data");
      setLoadingData(false);
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

  const calculateROI = () => {
    const cost = parseFloat(roiCost);
    const revenue = parseFloat(roiRevenue);
    if (!isNaN(cost) && !isNaN(revenue) && cost > 0) {
      const roi = ((revenue - cost) / cost) * 100;
      setCalculatedROI(roi);
    }
  };

  const exportToExcel = () => {
    if (!analyticsData) return;

    const csvData = [
      ["Analytics Rapport", ""],
      ["Genererad", format(new Date(), "PPP", { locale: sv })],
      ["", ""],
      ["Översikt", ""],
      ["Totalt Kampanjer", analyticsData.totalCampaigns],
      ["Aktiva Kampanjer", analyticsData.activeCampaigns],
      ["Totalt Events", analyticsData.totalEvents],
      ["Events Denna Vecka", analyticsData.eventsThisWeek],
      ["", ""],
      ["Kampanjer per Status", ""],
      ...Object.entries(analyticsData.campaignsByStatus).map(([status, count]) => [status, count]),
      ["", ""],
      ["Events per Kategori", ""],
      ...Object.entries(analyticsData.eventsByCategory).map(([cat, count]) => [cat, count]),
      ["", ""],
      ["Events per Stad", ""],
      ...Object.entries(analyticsData.eventsByCity).map(([city, count]) => [city, count]),
    ];

    const csvContent = csvData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `analytics-rapport-${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Rapport exporterad!");
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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5 relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6 mb-12 animate-on-scroll">
            <h1 className="text-5xl sm:text-6xl font-bold gradient-text">
              Analytics & Rapporter
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Översikt och statistik för dina kampanjer och events
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="glass-card hover-lift premium-glow animate-on-scroll stagger-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-accent" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold gradient-text">{analyticsData.totalCampaigns}</p>
                <p className="text-sm text-muted-foreground mt-2">Totalt Kampanjer</p>
              </CardContent>
            </Card>

            <Card className="glass-card hover-lift premium-glow animate-on-scroll stagger-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-green-500" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-green-600">{analyticsData.activeCampaigns}</p>
                <p className="text-sm text-muted-foreground mt-2">Aktiva Kampanjer</p>
              </CardContent>
            </Card>

            <Card className="glass-card hover-lift premium-glow animate-on-scroll stagger-3">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-500" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-blue-600">{analyticsData.eventsThisWeek}</p>
                <p className="text-sm text-muted-foreground mt-2">Events Denna Vecka</p>
              </CardContent>
            </Card>

            <Card className="glass-card hover-lift premium-glow animate-on-scroll stagger-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-purple-500" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-purple-600">{analyticsData.totalEvents}</p>
                <p className="text-sm text-muted-foreground mt-2">Totalt Events</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Analytics Content */}
      <div className="container mx-auto px-4 max-w-6xl relative z-10 pb-16">
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="glass-card hover-lift premium-glow animate-on-scroll">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <BarChart className="h-5 w-5 text-accent" />
                </div>
                Kampanjer per Status
              </CardTitle>
              <CardDescription>Fördelning av kampanjstatus</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(analyticsData.campaignsByStatus).map(([status, count]) => {
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
                {Object.keys(analyticsData.campaignsByStatus).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">Ingen data tillgänglig</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift premium-glow animate-on-scroll">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
                Aktivitet Senaste 7 Dagarna
              </CardTitle>
              <CardDescription>Skapade kampanjer och nya events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.recentActivity.map((day, idx) => (
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

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="glass-card hover-lift premium-glow animate-on-scroll">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-accent" />
                </div>
                ROI-beräkning
              </CardTitle>
              <CardDescription>Beräkna avkastning på kampanjer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cost">Kampanjkostnad (SEK)</Label>
                <Input
                  id="cost"
                  type="number"
                  placeholder="ex. 5000"
                  value={roiCost}
                  onChange={(e) => setRoiCost(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="revenue">Intäkter/Värde (SEK)</Label>
                <Input
                  id="revenue"
                  type="number"
                  placeholder="ex. 15000"
                  value={roiRevenue}
                  onChange={(e) => setRoiRevenue(e.target.value)}
                />
              </div>
              <Button onClick={calculateROI} className="w-full">
                Beräkna ROI
              </Button>
              {calculatedROI !== null && (
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground mb-1">Beräknad ROI</p>
                  <p className={`text-3xl font-bold ${calculatedROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {calculatedROI.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {calculatedROI >= 0 
                      ? `Du fick tillbaka ${(calculatedROI / 100 + 1).toFixed(2)}x din investering`
                      : 'Negativ avkastning - justera din strategi'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift premium-glow animate-on-scroll">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-accent" />
                </div>
                Kampanjprestanda
              </CardTitle>
              <CardDescription>Jämför dina kampanjer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.topCampaigns.map((campaign, idx) => {
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
                    <div key={campaign.id} className="p-3 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">#{idx + 1} {campaign.title}</span>
                        <div className={`px-2 py-1 rounded text-xs text-white ${statusColors[campaign.status]}`}>
                          {statusLabels[campaign.status]}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Events: {campaign.eventCount}</span>
                      </div>
                    </div>
                  );
                })}
                {analyticsData.topCampaigns.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">Ingen kampanjdata tillgänglig</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="glass-card hover-lift premium-glow animate-on-scroll">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-accent" />
                </div>
                Events per Kategori
              </CardTitle>
              <CardDescription>Fördelning av evenemangskategorier</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(analyticsData.eventsByCategory)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 6)
                  .map(([category, count]) => {
                    const total = analyticsData.totalEvents || 1;
                    const percentage = ((count / total) * 100).toFixed(0);
                    return (
                      <div key={category} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium capitalize">{category}</span>
                          <span className="text-muted-foreground">{count} ({percentage}%)</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-accent rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                {Object.keys(analyticsData.eventsByCategory).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">Ingen kategoridata tillgänglig</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift premium-glow animate-on-scroll">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-accent" />
                </div>
                Geografisk Fördelning
              </CardTitle>
              <CardDescription>Events per stad</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(analyticsData.eventsByCity)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 6)
                  .map(([city, count]) => (
                    <div key={city} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{city}</span>
                      </div>
                      <span className="text-sm font-semibold text-accent">{count} events</span>
                    </div>
                  ))}
                {Object.keys(analyticsData.eventsByCity).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">Ingen geografisk data tillgänglig</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card hover-lift premium-glow animate-on-scroll">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Download className="h-5 w-5 text-accent" />
              </div>
              Exportera Data
            </CardTitle>
            <CardDescription>Ladda ner din analytics-rapport som CSV</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1">Excel/CSV Export</p>
                <p className="text-xs text-muted-foreground">
                  Exportera all analytics-data till en CSV-fil som kan öppnas i Excel
                </p>
              </div>
              <Button onClick={exportToExcel} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportera
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
