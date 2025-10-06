import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Download, Bell } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, addMonths, subMonths, differenceInHours } from "date-fns";
import { sv } from "date-fns/locale";
import { toast } from "sonner";
import { AddInternalEventDialog } from "@/components/AddInternalEventDialog";
import { EventDetailsDialog } from "@/components/EventDetailsDialog";

interface Event {
  id: string;
  title: string;
  start_time: string;
  end_time?: string;
  category: string;
}

interface Campaign {
  id: string;
  title: string;
  description: string;
  recommended_start: string;
  status: string;
}

interface InternalEvent {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  event_type: string;
  color: string;
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [internalEvents, setInternalEvents] = useState<InternalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "events" | "campaigns" | "internal">("all");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<"event" | "campaign" | "internal">("event");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [currentDate]);

  useEffect(() => {
    checkUpcomingEvents();
  }, [events, campaigns]);

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

      const [eventsRes, campaignsRes, internalRes] = await Promise.all([
        supabase
          .from("events")
          .select("*")
          .gte("start_time", monthStart.toISOString())
          .lte("start_time", monthEnd.toISOString()),
        supabase
          .from("campaigns")
          .select("*")
          .eq("tenant_id", userRole.tenant_id)
          .gte("recommended_start", monthStart.toISOString())
          .lte("recommended_start", monthEnd.toISOString()),
        supabase
          .from("internal_events")
          .select("*")
          .eq("tenant_id", userRole.tenant_id)
          .gte("start_time", monthStart.toISOString())
          .lte("start_time", monthEnd.toISOString()),
      ]);

      if (eventsRes.error) throw eventsRes.error;
      if (campaignsRes.error) throw campaignsRes.error;
      if (internalRes.error) throw internalRes.error;

      setEvents(eventsRes.data || []);
      setCampaigns(campaignsRes.data || []);
      setInternalEvents(internalRes.data || []);
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

  const checkUpcomingEvents = () => {
    const now = new Date();
    events.forEach((event) => {
      const eventDate = parseISO(event.start_time);
      const hoursDiff = differenceInHours(eventDate, now);
      
      if (hoursDiff > 0 && hoursDiff <= 24) {
        const campaign = campaigns.find(c => c.id === event.id);
        if (campaign) {
          toast.info(`Din kampanj för ${event.title} startar inom 24 timmar!`, {
            duration: 10000,
          });
        }
      }
    });
  };

  const getItemsForDay = (day: Date) => {
    const dayEvents = filter === "all" || filter === "events" 
      ? events.filter((e) => isSameDay(parseISO(e.start_time), day))
      : [];
    const dayCampaigns = filter === "all" || filter === "campaigns"
      ? campaigns.filter((c) => isSameDay(parseISO(c.recommended_start), day))
      : [];
    const dayInternal = filter === "all" || filter === "internal"
      ? internalEvents.filter((i) => isSameDay(parseISO(i.start_time), day))
      : [];
    return { events: dayEvents, campaigns: dayCampaigns, internal: dayInternal };
  };

  const handleItemClick = (item: any, type: "event" | "campaign" | "internal") => {
    setSelectedItem(item);
    setSelectedType(type);
    setDialogOpen(true);
  };

  const exportToICS = () => {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Event Calendar//EN\n";

    events.forEach((event) => {
      const start = parseISO(event.start_time);
      const end = event.end_time ? parseISO(event.end_time) : start;
      icsContent += `BEGIN:VEVENT\nUID:${event.id}\nDTSTART:${format(start, "yyyyMMdd'T'HHmmss")}\nDTEND:${format(end, "yyyyMMdd'T'HHmmss")}\nSUMMARY:${event.title}\nEND:VEVENT\n`;
    });

    campaigns.forEach((campaign) => {
      const start = parseISO(campaign.recommended_start);
      icsContent += `BEGIN:VEVENT\nUID:${campaign.id}\nDTSTART:${format(start, "yyyyMMdd'T'HHmmss")}\nSUMMARY:📢 ${campaign.title}\nEND:VEVENT\n`;
    });

    internalEvents.forEach((internal) => {
      const start = parseISO(internal.start_time);
      const end = parseISO(internal.end_time);
      icsContent += `BEGIN:VEVENT\nUID:${internal.id}\nDTSTART:${format(start, "yyyyMMdd'T'HHmmss")}\nDTEND:${format(end, "yyyyMMdd'T'HHmmss")}\nSUMMARY:${internal.title}\nEND:VEVENT\n`;
    });

    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "calendar.ics";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Kalenderfil nedladdad!");
  };

  const exportToGoogleCalendar = () => {
    let start: Date;
    let title: string;

    if (events.length > 0) {
      start = parseISO(events[0].start_time);
      title = encodeURIComponent(events[0].title);
    } else if (campaigns.length > 0) {
      start = parseISO(campaigns[0].recommended_start);
      title = encodeURIComponent(campaigns[0].title);
    } else {
      toast.error("Inga events att exportera");
      return;
    }
    
    const dates = `${format(start, "yyyyMMdd'T'HHmmss")}/${format(start, "yyyyMMdd'T'HHmmss")}`;
    
    window.open(
      `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}`,
      "_blank"
    );
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Kalender</h1>
          <p className="text-muted-foreground">Översikt över events och kampanjer</p>
        </div>
        <div className="flex gap-2">
          <AddInternalEventDialog onEventAdded={loadData} />
        </div>
      </div>

      <div className="grid gap-6 mb-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Publika Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Mina Kampanjer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Interna Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{internalEvents.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {format(currentDate, "MMMM yyyy", { locale: sv })}
              </CardTitle>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alla</SelectItem>
                  <SelectItem value="events">Publika Events</SelectItem>
                  <SelectItem value="campaigns">Mina Kampanjer</SelectItem>
                  <SelectItem value="internal">Interna Events</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={exportToICS} title="Exportera ICS">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={exportToGoogleCalendar} title="Lägg till i Google Calendar">
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            Klicka på ett event för att se detaljer eller skapa kampanj
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"].map((day) => (
              <div key={day} className="text-center font-semibold text-sm text-muted-foreground p-2">
                {day}
              </div>
            ))}
            {days.map((day) => {
              const { events: dayEvents, campaigns: dayCampaigns, internal: dayInternal } = getItemsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-28 p-2 border rounded-lg ${
                    isCurrentMonth ? "bg-background" : "bg-muted/50"
                  } ${isToday ? "ring-2 ring-primary" : ""}`}
                >
                  <div className="text-sm font-medium mb-1">{format(day, "d")}</div>
                  <div className="space-y-1">
                    {dayEvents.map((event) => (
                      <Badge
                        key={event.id}
                        variant="default"
                        className="text-xs block truncate cursor-pointer hover:opacity-80"
                        onClick={() => handleItemClick(event, "event")}
                      >
                        {event.title}
                      </Badge>
                    ))}
                    {dayCampaigns.map((campaign) => (
                      <Badge
                        key={campaign.id}
                        variant="secondary"
                        className="text-xs block truncate cursor-pointer hover:opacity-80"
                        onClick={() => handleItemClick(campaign, "campaign")}
                      >
                        📢 {campaign.title}
                      </Badge>
                    ))}
                    {dayInternal.map((internal) => (
                      <Badge
                        key={internal.id}
                        style={{ backgroundColor: internal.color }}
                        className="text-xs block truncate cursor-pointer hover:opacity-80"
                        onClick={() => handleItemClick(internal, "internal")}
                      >
                        {internal.event_type === "live_band" ? "🎵" : "🎉"} {internal.title}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary rounded"></div>
          <span>Publika events</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-secondary rounded"></div>
          <span>Kampanjer</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "#FFD700" }}></div>
          <span>Interna events</span>
        </div>
      </div>

      <EventDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={selectedItem}
        type={selectedType}
      />
    </div>
  );
}
