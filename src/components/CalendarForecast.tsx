import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, DollarSign, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { useTranslation } from "react-i18next";

interface Event {
  id: string;
  title: string;
  start_time: string;
  expected_attendance: number;
  venue_lat: number;
  venue_lon: number;
}

interface Campaign {
  id: string;
  title: string;
  recommended_start: string;
}

interface ForecastData {
  date: Date;
  trafficScore: number;
  revenueEstimate: number;
  staffNeeded: number;
  events: Event[];
  campaigns: Campaign[];
}

interface CalendarForecastProps {
  forecastData: ForecastData[];
  locationLat: number;
  locationLon: number;
}

export const CalendarForecast = ({ forecastData, locationLat, locationLon }: CalendarForecastProps) => {
  const { t } = useTranslation();
  
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculateDayMetrics = (day: ForecastData) => {
    let totalTraffic = 0;
    let estimatedRevenue = 0;

    day.events.forEach((event) => {
      const distance = calculateDistance(locationLat, locationLon, event.venue_lat, event.venue_lon);
      
      // Traffic score based on distance and attendance
      let trafficMultiplier = 0;
      if (distance <= 0.5) trafficMultiplier = 0.15;
      else if (distance <= 1) trafficMultiplier = 0.10;
      else if (distance <= 2) trafficMultiplier = 0.05;
      else if (distance <= 5) trafficMultiplier = 0.02;
      else trafficMultiplier = 0.01;

      const expectedTraffic = event.expected_attendance * trafficMultiplier;
      totalTraffic += expectedTraffic;

      // Estimated revenue (assuming 150 SEK average per customer)
      estimatedRevenue += expectedTraffic * 150;
    });

    // Campaign boost
    if (day.campaigns.length > 0) {
      totalTraffic *= 1.3; // 30% increase with active campaign
      estimatedRevenue *= 1.3;
    }

    // Staff needed (1 staff per 30 customers)
    const baseStaff = 2;
    const extraStaff = Math.ceil(totalTraffic / 30);
    const totalStaff = baseStaff + extraStaff;

    return {
      traffic: Math.round(totalTraffic),
      revenue: Math.round(estimatedRevenue),
      staff: totalStaff,
    };
  };

  // Get top 5 days by revenue
  const topDays = [...forecastData]
    .map(day => ({
      ...day,
      metrics: calculateDayMetrics(day),
    }))
    .sort((a, b) => b.metrics.revenue - a.metrics.revenue)
    .slice(0, 5);

  const highTrafficDays = topDays.filter(d => d.metrics.traffic > 100);
  const totalProjectedRevenue = topDays.reduce((sum, d) => sum + d.metrics.revenue, 0);

  return (
    <div className="space-y-4">
      <Card className="glass-card border-primary/20 hover-lift group animate-fade-in">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-all">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold gradient-text">
                {t('trafficForecast')}
              </CardTitle>
              <CardDescription className="text-sm">
                Baserat på eventdensitet och kampanjer
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg glass-card border-border/50 hover:border-primary/50 transition-colors">
              <div className="text-2xl font-bold gradient-text mb-1">
                {highTrafficDays.length}
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                Högtrafik-dagar
              </div>
            </div>
            <div className="text-center p-3 rounded-lg glass-card border-border/50 hover:border-accent/50 transition-colors">
              <div className="text-2xl font-bold gradient-text mb-1">
                {totalProjectedRevenue.toLocaleString()} kr
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                Prognostiserad intäkt
              </div>
            </div>
            <div className="text-center p-3 rounded-lg glass-card border-border/50 hover:border-primary/50 transition-colors">
              <div className="text-2xl font-bold gradient-text mb-1">
                {Math.max(...topDays.map(d => d.metrics.staff))}
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                Max personal behov
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-accent/20 hover-lift group animate-fade-in stagger-1">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 group-hover:from-accent/30 group-hover:to-accent/20 transition-all">
              <Users className="h-5 w-5 text-accent" />
            </div>
            <CardTitle className="text-lg font-bold gradient-text">
              {t('staffPlanning')}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {highTrafficDays.map((day, index) => (
              <div
                key={day.date.toISOString()}
                className={`flex items-center justify-between p-3 glass-card border-border/50 rounded-lg hover:border-accent/50 transition-all hover-scale animate-fade-in stagger-${index + 1}`}
              >
                <div className="flex-1">
                  <div className="font-semibold text-sm text-foreground">
                    {format(day.date, "EEEE d MMMM", { locale: sv })}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {day.metrics.traffic} förväntade besökare
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={day.metrics.staff > 4 ? "destructive" : "secondary"}
                    className={day.metrics.staff > 4 ? "bg-destructive/10 text-destructive border-destructive/30" : "bg-primary/10 text-primary border-primary/30"}
                  >
                    <Users className="h-3 w-3 mr-1" />
                    {day.metrics.staff}
                  </Badge>
                  {day.metrics.staff > 4 && (
                    <div className="p-1 rounded-lg bg-destructive/10">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-primary/20 premium-glow hover-lift group animate-fade-in stagger-2">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-all">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold gradient-text">
                {t('bestCampaignDays')}
              </CardTitle>
              <CardDescription className="text-sm">
                Dagar med högst intäktspotential
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topDays.map((day, index) => (
              <div
                key={day.date.toISOString()}
                className={`flex items-center justify-between p-3 glass-card border-border/50 rounded-lg hover:border-primary/50 transition-all hover-scale animate-fade-in stagger-${index + 1}`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 text-lg font-bold gradient-text">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-foreground">
                      {format(day.date, "EEE d MMM", { locale: sv })}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="inline-flex items-center">
                        {day.events.length} events
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm gradient-text">
                    {day.metrics.revenue.toLocaleString()} kr
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                    <Users className="h-3 w-3" />
                    ~{day.metrics.traffic}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
