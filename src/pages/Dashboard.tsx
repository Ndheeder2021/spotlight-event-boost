import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { EventCard } from "@/components/EventCard";
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

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("start_time", { ascending: true });

      if (error) throw error;

      setEvents(data || []);
      
      const large = data?.find(e => e.expected_attendance > 1000);
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
          <h2 className="text-3xl font-bold mb-2">Kommande event</h2>
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => navigate(`/event/${event.id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}