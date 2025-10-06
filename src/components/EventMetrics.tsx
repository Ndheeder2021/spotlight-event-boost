import { Calendar, Users, TrendingUp, MapPin } from "lucide-react";
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Event denna vecka</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{eventsThisWeek.length}</div>
          <p className="text-xs text-muted-foreground">Inom 10 km</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Totalt kommande</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{events.length}</div>
          <p className="text-xs text-muted-foreground">Event totalt</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Förväntad publik</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalExpectedAttendance.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">Totalt denna vecka</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Största eventet</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {biggestEvent?.expected_attendance?.toLocaleString() || 0}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {biggestEvent?.title || "Inget event"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
