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
  target_audience: string;
  recommended_timing: string;
  channels: string;
  expected_outcome: string;
  action_steps: string[];
}

interface EventContact {
  title: string;
  venue: string;
  date: string;
  expected_attendance: number;
  description: string;
}

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [eventContact, setEventContact] = useState<EventContact | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const [eventRes, locationRes] = await Promise.all([
        supabase.from("events").select("*").eq("id", id).single(),
        supabase.from("locations").select("*").eq("id", user.id).single(),
      ]);

      if (eventRes.error) throw eventRes.error;
      if (locationRes.error) throw locationRes.error;

      setEvent(eventRes.data);
      setProfile(locationRes.data);
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get user's tenant_id
      const { data: userRole } = await supabase
        .from("user_roles")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

      if (!userRole) throw new Error("No tenant found");

      const { data, error } = await supabase.functions.invoke("generate-campaign", {
        body: {
          eventId: event.id,
          locationId: profile.id,
        },
      });

      if (error) throw error;

      setCampaigns(data.campaigns);
      setEventContact(data.event_contact);
      toast.success("Kampanjer genererade!");
    } catch (error: any) {
      console.error("Campaign generation error:", error);
      toast.error(error.message || "Kunde inte generera kampanjer");
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
          <div className="space-y-6">
            {eventContact && (
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Event-kontakt & Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="font-semibold">Event:</span> {eventContact.title}
                  </div>
                  <div>
                    <span className="font-semibold">Plats:</span> {eventContact.venue}
                  </div>
                  <div>
                    <span className="font-semibold">Datum:</span> {format(new Date(eventContact.date), "PPP", { locale: sv })}
                  </div>
                  <div>
                    <span className="font-semibold">Förväntade besökare:</span> {eventContact.expected_attendance.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-semibold">Beskrivning:</span> {eventContact.description}
                  </div>
                </CardContent>
              </Card>
            )}

            <h3 className="text-2xl font-bold">AI-genererade kampanjidéer</h3>
            {campaigns.map((campaign, idx) => (
              <Card key={idx} className="border-2">
                <CardHeader>
                  <CardTitle className="text-xl">{campaign.title}</CardTitle>
                  <CardDescription className="text-base">{campaign.target_audience}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-1">Beskrivning</h4>
                    <p className="text-muted-foreground">{campaign.description}</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-1">Timing</h4>
                      <p className="text-sm text-muted-foreground">{campaign.recommended_timing}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Kanaler</h4>
                      <p className="text-sm text-muted-foreground">{campaign.channels}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1">Förväntade resultat</h4>
                    <p className="text-sm text-muted-foreground">{campaign.expected_outcome}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Genomförande (steg-för-steg)</h4>
                    <ol className="list-decimal list-inside space-y-1">
                      {campaign.action_steps.map((step, stepIdx) => (
                        <li key={stepIdx} className="text-sm text-muted-foreground">{step}</li>
                      ))}
                    </ol>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}