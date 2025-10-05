import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  BarChart, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  ArrowLeft 
} from "lucide-react";
import { usePlanFeatures } from "@/hooks/usePlanFeatures";
import { PlanUpgradeDialog } from "@/components/PlanUpgradeDialog";
import { toast } from "sonner";

export default function CampaignDashboard() {
  const navigate = useNavigate();
  const { features } = usePlanFeatures();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalViews: 0,
    avgROI: 0,
  });

  useEffect(() => {
    if (!features.canViewAnalytics) {
      setShowUpgrade(true);
    } else {
      loadDashboard();
    }
  }, [features]);

  const loadDashboard = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userRole } = await supabase
        .from("user_roles")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

      if (!userRole) return;

      // Load campaigns
      const { data: campaignsData } = await supabase
        .from("campaigns")
        .select("*, events(title)")
        .eq("tenant_id", userRole.tenant_id)
        .order("created_at", { ascending: false });

      setCampaigns(campaignsData || []);

      // Load analytics
      const { data: analyticsData } = await supabase
        .from("campaign_analytics")
        .select("*")
        .eq("tenant_id", userRole.tenant_id);

      const viewMetrics = analyticsData?.filter(a => a.metric_type === "view") || [];
      const roiMetrics = analyticsData?.filter(a => a.metric_type === "roi") || [];

      setAnalytics({
        totalCampaigns: campaignsData?.length || 0,
        activeCampaigns: campaignsData?.filter(c => c.status === "published").length || 0,
        totalViews: viewMetrics.reduce((sum, m) => sum + Number(m.metric_value), 0),
        avgROI: roiMetrics.length > 0 
          ? roiMetrics.reduce((sum, m) => sum + Number(m.metric_value), 0) / roiMetrics.length 
          : 0,
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!features.canViewAnalytics) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <header className="border-b bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tillbaka
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto shadow-premium">
            <CardHeader>
              <CardTitle className="text-2xl">Analytics kräver Professional-paketet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                För att se kampanjanalytics och ROI-tracking behöver du uppgradera till Professional-paketet.
              </p>
              <Button onClick={() => setShowUpgrade(true)}>
                Visa paket
              </Button>
            </CardContent>
          </Card>
        </main>

        <PlanUpgradeDialog
          open={showUpgrade}
          onOpenChange={setShowUpgrade}
          featureName="Analytics"
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tillbaka
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-premium bg-clip-text text-transparent mb-2">
            Kampanj Analytics
          </h1>
          <p className="text-muted-foreground">Översikt över dina kampanjers prestanda</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card hover:shadow-premium transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Totalt antal kampanjer
              </CardTitle>
              <Calendar className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.totalCampaigns}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-premium transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Aktiva kampanjer
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.activeCampaigns}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-premium transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Totala visningar
              </CardTitle>
              <Users className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.totalViews.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-premium transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Genomsnittlig ROI
              </CardTitle>
              <DollarSign className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.avgROI.toFixed(1)}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Campaigns */}
        <Card className="shadow-premium">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <BarChart className="h-6 w-6 text-accent" />
              Senaste kampanjer
            </CardTitle>
          </CardHeader>
          <CardContent>
            {campaigns.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Inga kampanjer än. Skapa din första kampanj!
              </p>
            ) : (
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="p-4 rounded-lg border border-accent/10 hover:border-accent/30 transition-all cursor-pointer"
                    onClick={() => navigate(`/campaigns/${campaign.id}`)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{campaign.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Event: {campaign.events?.title || "N/A"}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="inline-flex items-center px-2 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold">
                          {campaign.status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}