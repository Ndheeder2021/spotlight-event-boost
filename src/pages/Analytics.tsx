import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, CalendarIcon, TrendingUp, Users, Eye, MousePointerClick } from "lucide-react";
import { format, subDays } from "date-fns";
import { sv } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default function Analytics() {
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      // Import the analytics tool dynamically
      const { default: readProjectAnalytics } = await import("@/lib/analytics");
      
      const data = await readProjectAnalytics(
        format(startDate, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd"),
        "daily"
      );
      
      setAnalytics(data);
      toast({
        title: "Statistik hämtad",
        description: `Data från ${format(startDate, "d MMM", { locale: sv })} till ${format(endDate, "d MMM", { locale: sv })}`,
      });
    } catch (error: any) {
      console.error("Error fetching analytics:", error);
      toast({
        title: "Kunde inte hämta statistik",
        description: error.message || "Ett fel uppstod",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = (field: string) => {
    if (!analytics?.data) return 0;
    return analytics.data.reduce((sum: number, day: any) => sum + (day[field] || 0), 0);
  };

  const totalVisits = calculateTotal("visits");
  const totalPageViews = calculateTotal("pageviews");
  const totalUniqueVisitors = calculateTotal("unique_visitors");

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
          <BarChart3 className="h-8 w-8" />
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground">
          Övervaka besökare och aktivitet på din webbplats
        </p>
      </div>

      <div className="grid gap-6">
        {/* Date Range Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Välj tidsperiod</CardTitle>
            <CardDescription>
              Hämta statistik för vald tidsperiod
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium">Från datum</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP", { locale: sv }) : "Välj datum"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Till datum</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP", { locale: sv }) : "Välj datum"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => date && setEndDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button 
                onClick={fetchAnalytics}
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? "Hämtar..." : "Hämta statistik"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        {analytics && (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Totalt Besök
                  </CardTitle>
                  <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalVisits.toLocaleString('sv-SE')}</div>
                  <p className="text-xs text-muted-foreground">
                    Antal sessioner på webbplatsen
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Sidvisningar
                  </CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalPageViews.toLocaleString('sv-SE')}</div>
                  <p className="text-xs text-muted-foreground">
                    Totalt antal sidvisningar
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Unika Besökare
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalUniqueVisitors.toLocaleString('sv-SE')}</div>
                  <p className="text-xs text-muted-foreground">
                    Antal unika användare
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Daily Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Daglig statistik</CardTitle>
                <CardDescription>
                  Detaljerad översikt per dag
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.data?.map((day: any, index: number) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">
                            {format(new Date(day.date || day.timestamp), "d MMMM yyyy", { locale: sv })}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {day.visits || 0} besök • {day.pageviews || 0} sidvisningar
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">{day.unique_visitors || 0}</p>
                        <p className="text-sm text-muted-foreground">unika</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Email Campaign Tracking Info */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary-glow/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MousePointerClick className="h-5 w-5" />
              Email Campaign Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              Alla utskickade marknadsföringsmails innehåller automatisk tracking via UTM-parametrar:
            </p>
            <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
              <li><strong>utm_source:</strong> email</li>
              <li><strong>utm_medium:</strong> marketing</li>
              <li><strong>utm_campaign:</strong> bulk_outreach</li>
            </ul>
            <div className="pt-2 border-t">
              <p className="text-muted-foreground">
                💡 <strong>Tips:</strong> Besökare som klickar på länkar i dina mail kommer att synas i statistiken ovan och kan spåras via UTM-parametrarna.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
