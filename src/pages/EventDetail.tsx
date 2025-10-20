import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, MapPin, Users, Sparkles, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { toast } from "sonner";
import { CampaignActions } from "@/components/CampaignActions";

interface AdIdea {
  platform: "Meta" | "TikTok";
  ad_copy: string;
  visual_concept: string;
  cta: string;
  targeting: string;
  budget_recommendation: string;
}

interface Campaign {
  title: string;
  description: string;
  target_audience: string;
  recommended_timing: string;
  channels: string;
  expected_outcome: string;
  action_steps: string[];
  ad_ideas: AdIdea[];
}

interface EventContact {
  title: string;
  venue: string;
  date: string;
  expected_attendance: number;
  description: string;
  event_url: string | null;
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

      // Get user's tenant_id
      const { data: userRole, error: roleError } = await supabase
        .from("user_roles")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

      if (roleError || !userRole) throw new Error("No tenant found");

      const [eventRes, locationRes] = await Promise.all([
        supabase.from("events").select("*").eq("id", id).single(),
        supabase.from("locations").select("*").eq("tenant_id", userRole.tenant_id).limit(1).single(),
      ]);

      if (eventRes.error) throw eventRes.error;
      if (locationRes.error) throw locationRes.error;

      setEvent(eventRes.data);
      setProfile(locationRes.data);
    } catch (error: any) {
      console.error("Load data error:", error);
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
    <div className="min-h-screen bg-gradient-subtle">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="hover:bg-accent/10">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tillbaka
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <Card className="mb-8 shadow-premium border-2 border-accent/20 animate-fade-in overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-premium opacity-5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardHeader className="relative pb-8">
            <div className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-3 w-fit">
              {event.category}
            </div>
            <CardTitle className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              {event.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 relative">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="p-2 rounded-md bg-accent/10">
                <Calendar className="h-5 w-5 text-accent" />
              </div>
              <span className="font-medium">{format(new Date(event.start_time), "PPP", { locale: sv })}</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="p-2 rounded-md bg-accent/10">
                <MapPin className="h-5 w-5 text-accent" />
              </div>
              <span className="font-medium">{event.venue_name}</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="p-2 rounded-md bg-accent/10">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <span className="font-medium">{event.expected_attendance.toLocaleString()} förväntade gäster</span>
            </div>
          </CardContent>
        </Card>

        <div className="relative mb-10 animate-fade-in-up">
          <Button
            onClick={generateCampaigns}
            disabled={generating || campaigns.length > 0}
            className="w-full relative overflow-hidden group shadow-glow hover:shadow-premium transition-all duration-300"
            size="lg"
          >
            <div className="absolute inset-0 bg-gradient-premium opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center justify-center gap-2 text-lg font-semibold">
              {generating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Genererar magiska kampanjidéer...</span>
                </>
              ) : campaigns.length > 0 ? (
                <>
                  <Sparkles className="h-5 w-5 animate-glow" />
                  <span>Kampanjer genererade</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Generera AI-drivna kampanjidéer</span>
                </>
              )}
            </span>
          </Button>
        </div>

        {campaigns.length > 0 && (
          <div className="space-y-8 animate-fade-in">
            {eventContact && (
              <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-2 border-accent/30 shadow-card hover:shadow-premium transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-2 rounded-lg bg-accent/20">
                      <Users className="h-6 w-6 text-accent" />
                    </div>
                    Event-kontakt & Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-card">
                      <span className="text-sm text-muted-foreground">Event</span>
                      <p className="font-semibold mt-1">{eventContact.title}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-card">
                      <span className="text-sm text-muted-foreground">Plats</span>
                      <p className="font-semibold mt-1">{eventContact.venue}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-card">
                      <span className="text-sm text-muted-foreground">Datum</span>
                      <p className="font-semibold mt-1">{format(new Date(eventContact.date), "PPP", { locale: sv })}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-card">
                      <span className="text-sm text-muted-foreground">Förväntade besökare</span>
                      <p className="font-semibold mt-1">{eventContact.expected_attendance.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-card">
                    <span className="text-sm text-muted-foreground">Beskrivning</span>
                    <p className="mt-2 leading-relaxed">{eventContact.description}</p>
                  </div>
                  {eventContact.event_url && (
                    <Button
                      variant="outline"
                      className="w-full border-accent/30 hover:bg-accent/10 hover:border-accent transition-all duration-300"
                      onClick={() => window.open(eventContact.event_url!, '_blank')}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Besök eventsidan
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
              <h3 className="text-3xl font-bold bg-gradient-premium bg-clip-text text-transparent">
                AI-genererade kampanjidéer
              </h3>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
            </div>
            {campaigns.map((campaign, idx) => (
              <Card 
                key={idx} 
                className="border-2 border-accent/20 shadow-card hover:shadow-premium transition-all duration-500 hover:border-accent/40 group animate-scale-in overflow-hidden"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-premium opacity-0 group-hover:opacity-5 blur-3xl transition-opacity duration-700 -translate-y-1/2 translate-x-1/2" />
                <CardHeader className="relative border-b bg-gradient-subtle pb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-3 w-fit">
                    <Sparkles className="h-3.5 w-3.5" />
                    Kampanj #{idx + 1}
                  </div>
                  <CardTitle className="text-2xl font-bold leading-tight">{campaign.title}</CardTitle>
                  <CardDescription className="text-base mt-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {campaign.target_audience}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6 relative">
                  <div className="p-4 rounded-lg bg-muted/50 border border-accent/10">
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-accent">
                      <div className="w-1 h-4 bg-accent rounded-full" />
                      Beskrivning
                    </h4>
                    <p className="leading-relaxed">{campaign.description}</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-gradient-to-br from-accent/5 to-transparent border border-accent/10">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-accent" />
                        Timing
                      </h4>
                      <p className="text-sm leading-relaxed">{campaign.recommended_timing}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-br from-accent/5 to-transparent border border-accent/10">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-accent" />
                        Kanaler
                      </h4>
                      <p className="text-sm leading-relaxed">{campaign.channels}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-accent">
                      <div className="w-1 h-4 bg-accent rounded-full" />
                      Förväntade resultat
                    </h4>
                    <p className="text-sm leading-relaxed">{campaign.expected_outcome}</p>
                  </div>

                  <div className="p-4 rounded-lg border-2 border-dashed border-accent/20 bg-card">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold">
                        ✓
                      </div>
                      Genomförande (steg-för-steg)
                    </h4>
                    <ol className="space-y-2">
                      {campaign.action_steps.map((step, stepIdx) => (
                        <li key={stepIdx} className="flex gap-3 text-sm">
                          <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent font-semibold text-xs">
                            {stepIdx + 1}
                          </span>
                          <span className="leading-relaxed pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Campaign Actions */}
                  <div className="mb-6">
                    <CampaignActions campaign={campaign} eventId={event.id} />
                  </div>

                  <div className="border-t-2 border-accent/10 pt-6 mt-6">
                    <h4 className="font-bold mb-4 text-xl flex items-center gap-2">
                      <span className="text-2xl">📱</span>
                      Annonsidéer för Sociala Medier
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {campaign.ad_ideas.map((ad, adIdx) => (
                        <Card 
                          key={adIdx} 
                          className={`border-2 shadow-card hover:shadow-premium transition-all duration-300 ${
                            ad.platform === "Meta" 
                              ? "border-blue-300 bg-gradient-to-br from-blue-50/80 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/10" 
                              : "border-pink-300 bg-gradient-to-br from-pink-50/80 to-pink-100/30 dark:from-pink-950/30 dark:to-pink-900/10"
                          }`}
                        >
                          <CardHeader className="pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <span className="text-2xl">{ad.platform === "Meta" ? "📘" : "🎵"}</span>
                              <span className="font-bold">{ad.platform}</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4 text-sm">
                            <div className="p-3 rounded-lg bg-card/80 backdrop-blur-sm">
                              <span className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">Annonstext</span>
                              <p className="italic mt-2 leading-relaxed">"{ad.ad_copy}"</p>
                            </div>
                            <div className="p-3 rounded-lg bg-card/80 backdrop-blur-sm">
                              <span className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">Visuellt koncept</span>
                              <p className="mt-2 leading-relaxed">{ad.visual_concept}</p>
                            </div>
                            <div>
                              <span className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">Call-to-action</span>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className={`mt-2 w-full font-semibold ${
                                  ad.platform === "Meta"
                                    ? "border-blue-400 hover:bg-blue-500 hover:text-white"
                                    : "border-pink-400 hover:bg-pink-500 hover:text-white"
                                }`}
                              >
                                {ad.cta}
                              </Button>
                            </div>
                            <div className="p-3 rounded-lg bg-card/80 backdrop-blur-sm">
                              <span className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">Målgrupp</span>
                              <p className="mt-2 leading-relaxed">{ad.targeting}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                              <span className="font-semibold text-xs uppercase tracking-wide text-accent">Budget Rekommendation</span>
                              <p className="mt-2 font-bold text-base">{ad.budget_recommendation}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
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