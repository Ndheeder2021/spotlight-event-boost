import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { EventCard } from "@/components/EventCard";
import { EventMap } from "@/components/EventMap";
import { EventFilters } from "@/components/EventFilters";
import { EventMetrics } from "@/components/EventMetrics";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  category: string;
  start_time: string;
  end_time: string;
  venue_name: string;
  venue_lat: number;
  venue_lon: number;
  expected_attendance: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [bigEvent, setBigEvent] = useState<Event | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [savedEvents, setSavedEvents] = useState<string[]>([]);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [distanceFilter, setDistanceFilter] = useState(10);
  const [minAttendanceFilter, setMinAttendanceFilter] = useState(0);

  useEffect(() => {
    loadEvents();
    loadSavedEvents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [events, searchQuery, categoryFilter, distanceFilter, minAttendanceFilter, userLocation]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const loadEvents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/");
        return;
      }

      // Get user's tenant_id
      const { data: userRole, error: roleError } = await supabase
        .from("user_roles")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

      if (roleError) throw roleError;

      // Get location based on tenant_id
      const { data: location, error: locationError } = await supabase
        .from("locations")
        .select("lat, lon, radius_km")
        .eq("tenant_id", userRole.tenant_id)
        .single();

      if (locationError) throw locationError;

      setUserLocation({ lat: location.lat, lon: location.lon });

      const { data: allEvents, error: eventsError } = await supabase
        .from("events")
        .select("*")
        .order("start_time", { ascending: true });

      if (eventsError) throw eventsError;

      // Filter events within radius from location settings (or 20km default)
      const radiusKm = location.radius_km || 20;
      const nearbyEvents = allEvents?.filter(event => {
        const distance = calculateDistance(
          location.lat,
          location.lon,
          event.venue_lat,
          event.venue_lon
        );
        return distance <= radiusKm;
      }) || [];

      setEvents(nearbyEvents);
      
      const large = nearbyEvents.find(e => e.expected_attendance > 1000);
      if (large) setBigEvent(large);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedEvents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's tenant_id
      const { data: userRole } = await supabase
        .from("user_roles")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

      if (!userRole) return;

      const { data } = await supabase
        .from("campaigns")
        .select("event_id")
        .eq("tenant_id", userRole.tenant_id);

      if (data) {
        setSavedEvents(data.map((c: any) => c.event_id));
      }
    } catch (error: any) {
      console.error("Error loading saved events:", error);
    }
  };

  const applyFilters = () => {
    if (!userLocation) {
      setFilteredEvents(events);
      return;
    }

    let filtered = events.filter(event => {
      // Distance filter
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lon,
        event.venue_lat,
        event.venue_lon
      );
      if (distance > distanceFilter) return false;

      // Search filter
      if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Category filter
      if (categoryFilter !== "all" && event.category.toLowerCase() !== categoryFilter) {
        return false;
      }

      // Attendance filter
      if (event.expected_attendance < minAttendanceFilter) {
        return false;
      }

      return true;
    });

    setFilteredEvents(filtered);
  };

  const handleGenerateCampaign = async (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const handleSaveEvent = async (eventId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Du måste vara inloggad");
        return;
      }

      // Get user's tenant_id
      const { data: userRole } = await supabase
        .from("user_roles")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

      if (!userRole) {
        toast.error("Kunde inte hitta användarinfo");
        return;
      }

      // Check if event is already saved
      if (savedEvents.includes(eventId)) {
        // Remove saved event (delete campaign)
        const { error } = await supabase
          .from("campaigns")
          .delete()
          .eq("event_id", eventId)
          .eq("tenant_id", userRole.tenant_id);

        if (error) throw error;

        setSavedEvents(savedEvents.filter(id => id !== eventId));
        toast.success("Event borttaget från sparade");
      } else {
        // Save event (create campaign)
        const event = events.find(e => e.id === eventId);
        if (!event) return;

        const { error } = await supabase
          .from("campaigns")
          .insert({
            event_id: eventId,
            tenant_id: userRole.tenant_id,
            title: event.title,
            description: `Kampanj för ${event.title}`,
            recommended_start: event.start_time,
            recommended_end: event.end_time || event.start_time,
            status: 'draft'
          });

        if (error) throw error;

        setSavedEvents([...savedEvents, eventId]);
        toast.success("Event sparat!");
      }
    } catch (error: any) {
      toast.error("Kunde inte spara/ta bort event");
      console.error("Error:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
        {bigEvent && (
          <Alert className="mb-6 border-primary bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
            <AlertDescription>
              <strong>Stort event!</strong> {bigEvent.title} med {bigEvent.expected_attendance.toLocaleString()} gäster närmar sig!
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">Event Radar</h2>
          <p className="text-muted-foreground">
            Event i närheten av din verksamhet
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Laddar event...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Inga event hittades</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <EventMetrics events={filteredEvents} />
            </div>

            <div className="mb-6">
              <EventFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                category={categoryFilter}
                onCategoryChange={setCategoryFilter}
                distance={distanceFilter}
                onDistanceChange={setDistanceFilter}
                minAttendance={minAttendanceFilter}
                onMinAttendanceChange={setMinAttendanceFilter}
              />
            </div>

            {userLocation && (
              <div className="mb-6">
                <EventMap 
                  events={filteredEvents}
                  userLocation={userLocation}
                  onEventClick={(eventId) => navigate(`/events/${eventId}`)}
                />
              </div>
            )}
            
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                Alla event ({filteredEvents.length})
              </h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => navigate(`/events/${event.id}`)}
                  onGenerateCampaign={handleGenerateCampaign}
                  onSaveEvent={handleSaveEvent}
                  isSaved={savedEvents.includes(event.id)}
                />
              ))}
            </div>
          </>
        )}
    </div>
  );
}