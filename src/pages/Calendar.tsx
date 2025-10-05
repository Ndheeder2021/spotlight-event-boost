import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from "date-fns";
import { sv } from "date-fns/locale";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  start_time: string;
  category: string;
}

interface Campaign {
  id: string;
  title: string;
  recommended_start: string;
  status: string;
}

export default function Calendar() {
  const [currentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: userRole } = await supabase
        .from("user_roles")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

      if (!userRole) throw new Error("No tenant found");

      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);

      const [eventsRes, campaignsRes] = await Promise.all([
        supabase
          .from("events")
          .select("id, title, start_time, category")
          .gte("start_time", monthStart.toISOString())
          .lte("start_time", monthEnd.toISOString()),
        supabase
          .from("campaigns")
          .select("id, title, recommended_start, status")
          .eq("tenant_id", userRole.tenant_id)
          .gte("recommended_start", monthStart.toISOString())
          .lte("recommended_start", monthEnd.toISOString()),
      ]);

      if (eventsRes.error) throw eventsRes.error;
      if (campaignsRes.error) throw campaignsRes.error;

      setEvents(eventsRes.data || []);
      setCampaigns(campaignsRes.data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const getItemsForDay = (day: Date) => {
    const dayEvents = events.filter((e) => isSameDay(parseISO(e.start_time), day));
    const dayCampaigns = campaigns.filter((c) => isSameDay(parseISO(c.recommended_start), day));
    return { events: dayEvents, campaigns: dayCampaigns };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse">Laddar...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Kalender</h1>
        <p className="text-muted-foreground">Översikt över events och kampanjer</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {format(currentDate, "MMMM yyyy", { locale: sv })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"].map((day) => (
              <div key={day} className="text-center font-semibold text-sm text-muted-foreground p-2">
                {day}
              </div>
            ))}
            {days.map((day) => {
              const { events: dayEvents, campaigns: dayCampaigns } = getItemsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentDate);

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-24 p-2 border rounded-lg ${
                    isCurrentMonth ? "bg-background" : "bg-muted/50"
                  }`}
                >
                  <div className="text-sm font-medium mb-1">{format(day, "d")}</div>
                  <div className="space-y-1">
                    {dayEvents.map((event) => (
                      <Badge key={event.id} variant="default" className="text-xs block truncate">
                        {event.title}
                      </Badge>
                    ))}
                    {dayCampaigns.map((campaign) => (
                      <Badge key={campaign.id} variant="secondary" className="text-xs block truncate">
                        📢 {campaign.title}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
