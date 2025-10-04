import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, MapPin, Users, Sparkles, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { toast } from "sonner";

interface Campaign {
  title: string;
  description: string;
  recommended_time_window: string;
}

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const [eventRes, profileRes] = await Promise.all([
        supabase.from("events").select("*").eq("id", id).single(),
        supabase.from("profiles").select("*").eq("id", user.id).single(),
      ]);

      if (eventRes.error) throw eventRes.error;
      if (profileRes.error) throw profileRes.error;

      setEvent(eventRes.data);
      setProfile(profileRes.data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateCampaigns = async () => {
    if (!event || !profile) return;
    
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-campaign", {
        body: {
          eventId: event.id,
          eventTitle: event.title,
          businessType: profile.business_type,
          expectedAttendance: event.expected_attendance,
        },
      });

      if (error) throw error;

      setCampaigns(data.campaigns);
      
      for (const camp of data.campaigns) {
        const { error: insertError } = await supabase.from("campaigns").insert({
          user_id: profile.id,
          event_id: event.id,
          title: camp.title,
          description: camp.description,
          recommended_start: new Date(event.start_time).toISOString(),
          recommended_end: new Date(event.end_time).toISOString(),
        });
        if (insertError) console.error(insertError);
      }

      toast.success("Kampanjer genererade!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Event hittades inte</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tillbaka
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl">{event.title}</CardTitle>
            <CardDescription className="text-lg">{event.category}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>{format(new Date(event.start_time), "PPP", { locale: sv })}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span>{event.venue_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span>{event.expected_attendance.toLocaleString()} förväntade gäster</span>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={generateCampaigns}
          disabled={generating || campaigns.length > 0}
          className="w-full mb-6"
          size="lg"
        >
          {generating ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-5 w-5" />
          )}
          {campaigns.length > 0 ? "Kampanjer genererade" : "Generera kampanjidéer"}
        </Button>

        {campaigns.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">AI-genererade kampanjidéer</h3>
            {campaigns.map((campaign, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle>{campaign.title}</CardTitle>
                  <CardDescription>{campaign.recommended_time_window}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{campaign.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}