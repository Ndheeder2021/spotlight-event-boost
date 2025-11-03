import { Calendar, Users, TrendingUp, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface Event {
  id: string;
  title: string;
  expected_attendance: number;
  start_time: string;
}

interface EventMetricsProps {
  events: Event[];
}

export const EventMetrics = ({ events }: EventMetricsProps) => {
  const { t } = useTranslation();
  const now = new Date();
  const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const eventsThisWeek = events.filter(
    (e) => new Date(e.start_time) <= oneWeekFromNow && new Date(e.start_time) >= now
  );

  const totalExpectedAttendance = events.reduce(
    (sum, e) => sum + e.expected_attendance,
    0
  );

  const biggestEvent = events.reduce(
    (max, e) => (e.expected_attendance > (max?.expected_attendance || 0) ? e : max),
    events[0]
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="glass-premium border-primary/30 hover-lift hover-glow group relative overflow-hidden transition-all duration-300 shadow-lg hover:shadow-primary/20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
          <CardTitle className="text-sm font-semibold text-foreground leading-tight">
            {t('eventsThisWeek')}
          </CardTitle>
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300 group-hover:scale-110 shadow-sm">
            <Calendar className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-4xl font-bold text-primary mb-2 group-hover:scale-105 transition-transform duration-300">
            {eventsThisWeek.length}
          </div>
          <p className="text-sm text-muted-foreground leading-snug font-medium">{t('withinRadius')}</p>
        </CardContent>
      </Card>

      <Card className="glass-premium border-accent/30 hover-lift hover-glow group relative overflow-hidden transition-all duration-300 shadow-lg hover:shadow-accent/20">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
          <CardTitle className="text-sm font-semibold text-foreground leading-tight">
            {t('totalUpcoming')}
          </CardTitle>
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 group-hover:from-accent/30 group-hover:to-accent/20 transition-all duration-300 group-hover:scale-110 shadow-sm">
            <MapPin className="h-5 w-5 text-accent group-hover:scale-110 transition-transform duration-300" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-4xl font-bold text-accent mb-2 group-hover:scale-105 transition-transform duration-300">
            {events.length}
          </div>
          <p className="text-sm text-muted-foreground leading-snug font-medium">{t('eventsTotal')}</p>
        </CardContent>
      </Card>

      <Card className="glass-premium border-primary/30 hover-lift hover-glow group relative overflow-hidden transition-all duration-300 shadow-lg hover:shadow-primary/20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
          <CardTitle className="text-sm font-semibold text-foreground leading-tight">
            {t('expectedAudience')}
          </CardTitle>
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300 group-hover:scale-110 shadow-sm">
            <Users className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-4xl font-bold text-primary mb-2 group-hover:scale-105 transition-transform duration-300">
            {totalExpectedAttendance.toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground leading-snug font-medium">{t('totalThisWeek')}</p>
        </CardContent>
      </Card>

      <Card className="glass-premium border-accent/30 hover-lift hover-glow group relative overflow-hidden transition-all duration-300 shadow-lg hover:shadow-accent/20">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
          <CardTitle className="text-sm font-semibold text-foreground leading-tight">
            {t('biggestEvent')}
          </CardTitle>
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 group-hover:from-accent/30 group-hover:to-accent/20 transition-all duration-300 group-hover:scale-110 shadow-sm">
            <TrendingUp className="h-5 w-5 text-accent group-hover:scale-110 transition-transform duration-300" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-4xl font-bold text-accent mb-2 group-hover:scale-105 transition-transform duration-300">
            {biggestEvent?.expected_attendance?.toLocaleString() || 0}
          </div>
          <p className="text-sm text-muted-foreground truncate leading-snug font-medium">
            {biggestEvent?.title || t('noEvent')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
