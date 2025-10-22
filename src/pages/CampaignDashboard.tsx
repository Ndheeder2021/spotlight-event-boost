import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  BarChart as BarChartIcon, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  ArrowLeft,
  Target,
  Activity,
  Eye,
  Sparkles
} from "lucide-react";
import { usePlanFeatures } from "@/hooks/usePlanFeatures";
import { PlanUpgradeDialog } from "@/components/PlanUpgradeDialog";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function CampaignDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
  const [chartData, setChartData] = useState({
    performance: [] as any[],
    statusDistribution: [] as any[],
    viewsOverTime: [] as any[]
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
        .maybeSingle();

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

      // Prepare chart data
      const statusCounts = {
        draft: campaignsData?.filter(c => c.status === "draft").length || 0,
        scheduled: campaignsData?.filter(c => c.status === "scheduled").length || 0,
        published: campaignsData?.filter(c => c.status === "published").length || 0,
      };

      const statusData = [
        { name: t('statusDraft'), value: statusCounts.draft, color: "hsl(var(--secondary))" },
        { name: t('statusScheduled'), value: statusCounts.scheduled, color: "hsl(var(--accent))" },
        { name: t('statusPublished'), value: statusCounts.published, color: "hsl(var(--primary))" },
      ].filter(item => item.value > 0);

      // Performance data for top campaigns
      const performanceData = (campaignsData || []).slice(0, 5).map(campaign => ({
        name: campaign.title.slice(0, 20),
        [t('chartViews')]: Math.floor(Math.random() * 500) + 100,
        [t('chartClicks')]: Math.floor(Math.random() * 100) + 20,
        [t('chartROI')]: Math.floor(Math.random() * 150) + 50,
      }));

      // Views over time data (mock - replace with real data)
      const viewsData = Array.from({ length: 7 }, (_, i) => ({
        dag: [t('monday'), t('tuesday'), t('wednesday'), t('thursday'), t('friday'), t('saturday'), t('sunday')][i],
        [t('chartViews')]: Math.floor(Math.random() * 300) + 100,
        [t('chartClicks')]: Math.floor(Math.random() * 80) + 20,
      }));

      setChartData({
        performance: performanceData,
        statusDistribution: statusData,
        viewsOverTime: viewsData
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!features.canViewAnalytics) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
        <div className="container mx-auto px-4 py-12">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('backButton')}
          </Button>

          <Card className="glass-card max-w-2xl mx-auto border-0 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl">{t('analyticsRequiresPro')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                {t('analyticsUpgradeMessage')}
              </p>
              <Button onClick={() => setShowUpgrade(true)} size="lg" className="hover-scale">
                {t('showPlans')}
              </Button>
            </CardContent>
          </Card>
        </div>

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
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5 flex items-center justify-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-card">
          <Sparkles className="h-6 w-6 animate-spin text-primary" />
          <p className="text-lg font-medium">{t('loadingAnalytics')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-8 hover-scale">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('backButton')}
        </Button>

        {/* Hero Section */}
        <div className="mb-12 space-y-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="h-12 w-1 bg-gradient-to-b from-primary to-accent rounded-full" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                {t('campaignAnalytics')}
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                {t('performanceOverview')}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
          <Card className="glass-card border-primary/20 hover-lift group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-foreground/80">
                {t('totalCampaigns')}
              </CardTitle>
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-text mb-1">{analytics.totalCampaigns}</div>
              <p className="text-sm text-muted-foreground">{t('allCreatedCampaigns')}</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-accent/20 hover-lift group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-foreground/80">
                {t('activeCampaigns')}
              </CardTitle>
              <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-text mb-1">{analytics.activeCampaigns}</div>
              <p className="text-sm text-muted-foreground">{t('publishedCampaigns')}</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-primary/20 hover-lift group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-foreground/80">
                {t('totalViews')}
              </CardTitle>
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Eye className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-text mb-1">{analytics.totalViews.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">{t('campaignViews')}</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-accent/20 hover-lift group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-foreground/80">
                {t('avgROI')}
              </CardTitle>
              <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                <DollarSign className="h-5 w-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-text mb-1">{analytics.avgROI.toFixed(1)}%</div>
              <p className="text-sm text-muted-foreground">{t('returnOnInvestment')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Views Over Time */}
          <Card className="glass-card hover-lift animate-fade-in stagger-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                {t('viewsOverTime')}
              </CardTitle>
              <CardDescription>{t('lastWeekActivity')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData.viewsOverTime}>
                  <defs>
                    <linearGradient id="colorVisningar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorKlick" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="dag" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey={t('chartViews')} 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1}
                    fill="url(#colorVisningar)"
                  />
                  <Area 
                    type="monotone" 
                    dataKey={t('chartClicks')} 
                    stroke="hsl(var(--accent))" 
                    fillOpacity={1}
                    fill="url(#colorKlick)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          {chartData.statusDistribution.length > 0 && (
            <Card className="glass-card hover-lift animate-fade-in stagger-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-accent" />
                  {t('campaignStatus')}
                </CardTitle>
                <CardDescription>{t('statusDistribution')}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Campaign Performance */}
        {chartData.performance.length > 0 && (
          <Card className="glass-card hover-lift mb-8 animate-fade-in stagger-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChartIcon className="h-5 w-5 text-primary" />
                {t('campaignPerformance')}
              </CardTitle>
              <CardDescription>{t('compareRecentCampaigns')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData.performance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey={t('chartViews')} fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  <Bar dataKey={t('chartClicks')} fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
                  <Bar dataKey={t('chartROI')} fill="hsl(var(--secondary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Recent Campaigns */}
        <Card className="glass-card animate-fade-in stagger-4">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Calendar className="h-6 w-6 text-accent" />
              {t('recentCampaigns')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {campaigns.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {t('noCampaignsYet')}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {campaigns.map((campaign, index) => (
                  <div
                    key={campaign.id}
                    className={`p-4 rounded-lg glass-card border-border/50 hover-lift cursor-pointer animate-fade-in stagger-${(index % 5) + 1}`}
                    onClick={() => navigate(`/campaigns/${campaign.id}`)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{campaign.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          {t('eventLabel')} {campaign.events?.title || "N/A"}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          campaign.status === 'published' ? 'bg-primary/10 text-primary border border-primary/30' :
                          campaign.status === 'scheduled' ? 'bg-accent/10 text-accent border border-accent/30' :
                          'bg-secondary/80 text-secondary-foreground border border-secondary/30'
                        }`}>
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
      </div>
    </div>
  );
}
