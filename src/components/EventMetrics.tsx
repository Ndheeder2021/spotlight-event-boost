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
      <Card className="glass-card border-primary/20 hover-lift group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-foreground/80">{t('eventsThisWeek')}</CardTitle>
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold gradient-text mb-1">{eventsThisWeek.length}</div>
          <p className="text-sm text-muted-foreground">{t('withinRadius')}</p>
        </CardContent>
      </Card>

      <Card className="glass-card border-accent/20 hover-lift group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-foreground/80">{t('totalUpcoming')}</CardTitle>
          <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
            <MapPin className="h-5 w-5 text-accent" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold gradient-text mb-1">{events.length}</div>
          <p className="text-sm text-muted-foreground">{t('eventsTotal')}</p>
        </CardContent>
      </Card>

      <Card className="glass-card border-primary/20 hover-lift group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-foreground/80">{t('expectedAudience')}</CardTitle>
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Users className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold gradient-text mb-1">
            {totalExpectedAttendance.toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground">{t('totalThisWeek')}</p>
        </CardContent>
      </Card>

      <Card className="glass-card border-accent/20 hover-lift group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-foreground/80">{t('biggestEvent')}</CardTitle>
          <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
            <TrendingUp className="h-5 w-5 text-accent" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold gradient-text mb-1">
            {biggestEvent?.expected_attendance?.toLocaleString() || 0}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {biggestEvent?.title || t('noEvent')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
