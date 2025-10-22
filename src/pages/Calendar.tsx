import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Download, Bell, Users, Sparkles } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, addMonths, subMonths, differenceInHours } from "date-fns";
import { sv } from "date-fns/locale";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { AddInternalEventDialog } from "@/components/AddInternalEventDialog";
import { EventDetailsDialog } from "@/components/EventDetailsDialog";
import { CalendarForecast } from "@/components/CalendarForecast";

interface Event {
  id: string;
  title: string;
  start_time: string;
  end_time?: string;
  category: string;
  expected_attendance: number;
  venue_lat: number;
  venue_lon: number;
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
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [internalEvents, setInternalEvents] = useState<InternalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "events" | "campaigns" | "internal">("all");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<"event" | "campaign" | "internal">("event");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number }>({ lat: 59.3293, lon: 18.0686 });

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

      // Load user location with radius
      const { data: locationData } = await supabase
        .from("locations")
        .select("lat, lon, radius_km")
        .eq("tenant_id", userRole.tenant_id)
        .limit(1)
        .single();

      if (locationData) {
        setUserLocation({ lat: locationData.lat, lon: locationData.lon });
      }

      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);

      // Fetch all events first, then filter by location and date
      const [allEventsRes, campaignsRes, internalRes] = await Promise.all([
        supabase
          .from("events")
          .select("*")
          .order("start_time", { ascending: true }),
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

      if (allEventsRes.error) throw allEventsRes.error;
      if (campaignsRes.error) throw campaignsRes.error;
      if (internalRes.error) throw internalRes.error;

      // Filter events by location radius and date range
      const radiusKm = locationData?.radius_km || 20;
      const filteredEvents = allEventsRes.data?.filter(event => {
        // Check if event is within the radius
        const distance = calculateDistance(
          locationData?.lat || 59.3293,
          locationData?.lon || 18.0686,
          event.venue_lat,
          event.venue_lon
        );
        
        // Check if event is within the current month
        const eventDate = parseISO(event.start_time);
        const isInMonth = eventDate >= monthStart && eventDate <= monthEnd;
        
        return distance <= radiusKm && isInMonth;
      }) || [];

      setEvents(filteredEvents);
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
          toast.info(t('campaignStartsIn24Hours', { title: event.title }), {
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

  const calculateDayHeatmap = (day: Date) => {
    const { events: dayEvents, campaigns: dayCampaigns } = getItemsForDay(day);
    
    let score = 0;
    dayEvents.forEach((event) => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lon,
        event.venue_lat,
        event.venue_lon
      );
      
      // Score based on distance and attendance
      let multiplier = 0;
      if (distance <= 0.5) multiplier = 0.15;
      else if (distance <= 1) multiplier = 0.10;
      else if (distance <= 2) multiplier = 0.05;
      else multiplier = 0.02;
      
      score += (event.expected_attendance * multiplier) / 100;
    });

    // Campaign boost
    if (dayCampaigns.length > 0) {
      score *= 1.3;
    }

    // Return color based on score
    if (score >= 15) return "bg-red-500/20 border-red-500";
    if (score >= 10) return "bg-orange-500/20 border-orange-500";
    if (score >= 5) return "bg-yellow-500/20 border-yellow-500";
    if (score >= 2) return "bg-green-500/20 border-green-500";
    return "";
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const forecastData = days.map(day => {
    const { events: dayEvents, campaigns: dayCampaigns } = getItemsForDay(day);
    return {
      date: day,
      trafficScore: 0,
      revenueEstimate: 0,
      staffNeeded: 0,
      events: dayEvents,
      campaigns: dayCampaigns,
    };
  });

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
    toast.success(t('calendarFileDownloaded'));
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
      toast.error(t('noEventsToExport'));
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
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5 flex items-center justify-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-card">
          <Sparkles className="h-6 w-6 animate-spin text-primary" />
          <p className="text-lg font-medium">{t('loadingEvents')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="mb-12 space-y-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="h-12 w-1 bg-gradient-to-b from-primary to-accent rounded-full" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                {t('calendarForecast')}
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                {t('overviewEvents')}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <AddInternalEventDialog onEventAdded={loadData} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Main Calendar - Takes 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-6 mb-6 md:grid-cols-3 animate-fade-in">
              <Card className="glass-card border-primary/20 hover-lift group">
                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium text-foreground/80">{t('publicEvents')}</CardTitle>
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold gradient-text">{events.length}</div>
                </CardContent>
              </Card>
              <Card className="glass-card border-accent/20 hover-lift group">
                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium text-foreground/80">{t('myCampaigns')}</CardTitle>
                  <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <Sparkles className="h-4 w-4 text-accent" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold gradient-text">{campaigns.length}</div>
                </CardContent>
              </Card>
              <Card className="glass-card border-primary/20 hover-lift group">
                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium text-foreground/80">{t('internalEvents')}</CardTitle>
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Bell className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold gradient-text">{internalEvents.length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Calendar Card */}
            <Card className="glass-card premium-glow animate-fade-in stagger-1">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                      className="hover-scale"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <CalendarIcon className="h-6 w-6 text-primary" />
                      {format(currentDate, "MMMM yyyy", { locale: sv })}
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                      className="hover-scale"
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
                        <SelectItem value="all">{t('all')}</SelectItem>
                        <SelectItem value="events">{t('publicEventsFilter')}</SelectItem>
                        <SelectItem value="campaigns">{t('myCampaignsFilter')}</SelectItem>
                        <SelectItem value="internal">{t('internalEventsFilter')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" onClick={exportToICS} title={t('exportICS')} className="hover-scale">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={exportToGoogleCalendar} title={t('addToGoogleCal')} className="hover-scale">
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="text-base">
                  {t('colorCoding')}
                </CardDescription>
              </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {[t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat'), t('sun')].map((day) => (
                  <div key={day} className="text-center font-semibold text-sm text-muted-foreground p-2">
                    {day}
                  </div>
                ))}
                {days.map((day) => {
                  const { events: dayEvents, campaigns: dayCampaigns, internal: dayInternal } = getItemsForDay(day);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const isToday = isSameDay(day, new Date());
                  const heatmapColor = calculateDayHeatmap(day);

                  // Calculate staff needs
                  let staffNeeded = 2; // Base staff
                  dayEvents.forEach((event) => {
                    const distance = calculateDistance(
                      userLocation.lat,
                      userLocation.lon,
                      event.venue_lat,
                      event.venue_lon
                    );
                    if (distance <= 2) {
                      staffNeeded += Math.ceil((event.expected_attendance * 0.05) / 30);
                    }
                  });

                  return (
                    <div
                      key={day.toISOString()}
                      className={`min-h-32 p-2 border-2 rounded-lg relative ${
                        isCurrentMonth ? "bg-background" : "bg-muted/50"
                      } ${isToday ? "ring-2 ring-primary" : ""} ${heatmapColor}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium">{format(day, "d")}</div>
                        {staffNeeded > 4 && (
                          <Badge variant="destructive" className="text-[10px] px-1">
                            <Users className="h-2 w-2 mr-0.5" />
                            {staffNeeded}
                          </Badge>
                        )}
                      </div>
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

          <div className="flex items-center gap-4 text-sm text-muted-foreground animate-fade-in stagger-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary rounded"></div>
              <span>{t('publicEvents')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-secondary rounded"></div>
              <span>{t('campaigns')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: "#FFD700" }}></div>
              <span>{t('internalEvents')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-destructive" />
              <span>{t('staffMarker')}</span>
            </div>
          </div>
        </div>

        {/* Forecast Sidebar - Takes 1 column */}
        <div className="lg:col-span-1 animate-fade-in stagger-3">
          <CalendarForecast
            forecastData={forecastData}
            locationLat={userLocation.lat}
            locationLon={userLocation.lon}
          />
        </div>
      </div>

      <EventDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={selectedItem}
        type={selectedType}
      />
    </div>
  </div>
  );
}
