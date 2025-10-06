import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, DollarSign, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trafikprognos
          </CardTitle>
          <CardDescription>
            Baserat på eventdensitet och kampanjer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {highTrafficDays.length}
              </div>
              <div className="text-xs text-muted-foreground">
                Högtrafik-dagar
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {totalProjectedRevenue.toLocaleString()} kr
              </div>
              <div className="text-xs text-muted-foreground">
                Prognostiserad intäkt
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {Math.max(...topDays.map(d => d.metrics.staff))}
              </div>
              <div className="text-xs text-muted-foreground">
                Max personal behov
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Personalplanering
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {highTrafficDays.map((day) => (
              <div
                key={day.date.toISOString()}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div>
                  <div className="font-medium">
                    {format(day.date, "EEEE d MMMM", { locale: sv })}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {day.metrics.traffic} förväntade besökare
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={day.metrics.staff > 4 ? "destructive" : "secondary"}
                  >
                    <Users className="h-3 w-3 mr-1" />
                    {day.metrics.staff} personal
                  </Badge>
                  {day.metrics.staff > 4 && (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Bästa Kampanjdagar
          </CardTitle>
          <CardDescription>
            Dagar med högst intäktspotential
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topDays.map((day, index) => (
              <div
                key={day.date.toISOString()}
                className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-muted-foreground">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      {format(day.date, "EEE d MMM", { locale: sv })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {day.events.length} events
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-primary">
                    {day.metrics.revenue.toLocaleString()} kr
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ~{day.metrics.traffic} besökare
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
