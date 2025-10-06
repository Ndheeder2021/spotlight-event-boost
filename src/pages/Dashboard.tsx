import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { EventCard } from "@/components/EventCard";
import { EventMap } from "@/components/EventMap";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogOut, Sparkles } from "lucide-react";
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
  const [loading, setLoading] = useState(true);
  const [bigEvent, setBigEvent] = useState<Event | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

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

      const { data: location, error: locationError } = await supabase
        .from("locations")
        .select("lat, lon")
        .eq("id", user.id)
        .single();

      if (locationError) throw locationError;

      setUserLocation({ lat: location.lat, lon: location.lon });

      const { data: allEvents, error: eventsError } = await supabase
        .from("events")
        .select("*")
        .order("start_time", { ascending: true });

      if (eventsError) throw eventsError;

      // Filter events within 10km radius
      const nearbyEvents = allEvents?.filter(event => {
        const distance = calculateDistance(
          location.lat,
          location.lon,
          event.venue_lat,
          event.venue_lon
        );
        return distance <= 10;
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Spotlight</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logga ut
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
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
            Event i närheten av din verksamhet (inom 10 km)
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
            {userLocation && (
              <div className="mb-6">
                <EventMap 
                  events={events}
                  userLocation={userLocation}
                  onEventClick={(eventId) => navigate(`/events/${eventId}`)}
                />
              </div>
            )}
            
            <div className="mb-4">
              <h3 className="text-xl font-semibold">Alla event</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => navigate(`/events/${event.id}`)}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}