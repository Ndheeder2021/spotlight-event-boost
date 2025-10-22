import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, MapPin, Users, Sparkles, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { sv, enUS } from "date-fns/locale";
import { toast } from "sonner";
import { CampaignActions } from "@/components/CampaignActions";
import { useTranslation } from "react-i18next";

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
  const { t, i18n } = useTranslation();
  const [event, setEvent] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignIds, setCampaignIds] = useState<{ [key: number]: string }>({});
  const [campaignMockups, setCampaignMockups] = useState<{ [key: string]: any[] }>({});
  const [eventContact, setEventContact] = useState<EventContact | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const locale = i18n.language === 'sv' ? sv : enUS;

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
      toast.error(t('errorLoadingData'));
    } finally {
      setLoading(false);
    }
  };

  const loadMockupsForCampaign = async (campaignId: string) => {
    try {
      const { data, error } = await supabase
        .from("campaign_attachments")
        .select("*")
        .eq("campaign_id", campaignId)
        .eq("file_type", "image")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setCampaignMockups(prev => ({
        ...prev,
        [campaignId]: data || []
      }));
    } catch (error: any) {
      console.error("Load mockups error:", error);
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
      toast.success(t('campaignsGenerated'));
    } catch (error: any) {
      console.error("Campaign generation error:", error);
      toast.error(error.message || t('errorGeneratingCampaigns'));
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          <span className="text-lg font-medium">{t('loadingEventDetails')}</span>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t('eventNotFound')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="border-b glass-card sticky top-0 z-10 border-primary/10">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="hover-lift">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('back')}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <Card className="mb-8 glass-card premium-glow-lg animate-fade-in border-2 border-primary/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-primary-glow/20 opacity-20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardHeader className="relative pb-8">
            <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-accent/20 to-accent-glow/20 text-accent border border-accent/30 text-sm font-semibold mb-3 w-fit premium-glow">
              {event.category}
            </div>
            <CardTitle className="text-4xl font-bold tracking-tight gradient-text">
              {event.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 relative">
            <div className="flex items-center gap-3 p-3 rounded-lg glass-card hover-lift">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 premium-glow">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <span className="font-medium">{format(new Date(event.start_time), "PPP", { locale })}</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg glass-card hover-lift">
              <div className="p-2 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 premium-glow">
                <MapPin className="h-5 w-5 text-accent" />
              </div>
              <span className="font-medium">{event.venue_name}</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg glass-card hover-lift">
              <div className="p-2 rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/10 premium-glow">
                <Users className="h-5 w-5 text-secondary" />
              </div>
              <span className="font-medium">{event.expected_attendance.toLocaleString()} {t('expectedGuests')}</span>
            </div>
          </CardContent>
        </Card>

        <div className="relative mb-10 animate-fade-in stagger-2">
          <Button
            onClick={generateCampaigns}
            disabled={generating || campaigns.length > 0}
            className="w-full relative overflow-hidden group bg-gradient-to-r from-primary to-primary-glow hover:shadow-elegant premium-glow-lg transition-all duration-300 hover-lift"
            size="lg"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 text-lg font-semibold">
              {generating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{t('generatingCampaigns')}</span>
                </>
              ) : campaigns.length > 0 ? (
                <>
                  <Sparkles className="h-5 w-5 animate-pulse" />
                  <span>{t('campaignsGenerated')}</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>{t('generateAICampaigns')}</span>
                </>
              )}
            </span>
          </Button>
        </div>

        {campaigns.length > 0 && (
          <div className="space-y-8 animate-fade-in stagger-3">
            {eventContact && (
              <Card className="glass-card border-2 border-accent/30 premium-glow-lg hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl gradient-text">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 premium-glow">
                      <Users className="h-6 w-6 text-accent" />
                    </div>
                    {t('eventContactInfo')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg glass-card hover-lift">
                      <span className="text-sm text-muted-foreground">{t('event')}</span>
                      <p className="font-semibold mt-1">{eventContact.title}</p>
                    </div>
                    <div className="p-3 rounded-lg glass-card hover-lift">
                      <span className="text-sm text-muted-foreground">{t('venue')}</span>
                      <p className="font-semibold mt-1">{eventContact.venue}</p>
                    </div>
                    <div className="p-3 rounded-lg glass-card hover-lift">
                      <span className="text-sm text-muted-foreground">{t('date')}</span>
                      <p className="font-semibold mt-1">{format(new Date(eventContact.date), "PPP", { locale })}</p>
                    </div>
                    <div className="p-3 rounded-lg glass-card hover-lift">
                      <span className="text-sm text-muted-foreground">{t('expectedVisitors')}</span>
                      <p className="font-semibold mt-1">{eventContact.expected_attendance.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg glass-card">
                    <span className="text-sm text-muted-foreground">{t('description')}</span>
                    <p className="mt-2 leading-relaxed">{eventContact.description}</p>
                  </div>
                  {eventContact.event_url && (
                    <Button
                      variant="outline"
                      className="w-full hover-lift glass-card border-accent/30"
                      onClick={() => window.open(eventContact.event_url!, '_blank')}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      {t('visitEventPage')}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
              <h3 className="text-3xl font-bold gradient-text">
                {t('aiGeneratedCampaigns')}
              </h3>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
            </div>
            {campaigns.map((campaign, idx) => (
              <Card 
                key={idx} 
                className={`glass-card border-2 border-primary/20 premium-glow-lg hover-lift animate-fade-in stagger-${(idx % 5) + 1} overflow-hidden relative`}
              >
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-primary-glow/10 opacity-50 blur-3xl -translate-y-1/2 translate-x-1/2" />
                <CardHeader className="relative border-b glass-card pb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-accent/20 to-accent-glow/20 border border-accent/30 text-accent text-sm font-semibold mb-3 w-fit premium-glow">
                    <Sparkles className="h-3.5 w-3.5" />
                    {t('campaignNumber', { number: idx + 1 })}
                  </div>
                  <CardTitle className="text-2xl font-bold leading-tight gradient-text">{campaign.title}</CardTitle>
                  <CardDescription className="text-base mt-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {campaign.target_audience}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6 relative">
                  <div className="p-4 rounded-lg glass-card border border-primary/10">
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-primary">
                      <div className="w-1 h-4 bg-gradient-to-b from-primary to-primary-glow rounded-full" />
                      {t('descriptionLabel')}
                    </h4>
                    <p className="leading-relaxed">{campaign.description}</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg glass-card border border-accent/10 hover-lift">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-gradient-to-br from-accent/20 to-accent/10">
                          <Calendar className="h-4 w-4 text-accent" />
                        </div>
                        {t('timing')}
                      </h4>
                      <p className="text-sm leading-relaxed">{campaign.recommended_timing}</p>
                    </div>
                    <div className="p-4 rounded-lg glass-card border border-accent/10 hover-lift">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-gradient-to-br from-secondary/20 to-secondary/10">
                          <MapPin className="h-4 w-4 text-secondary" />
                        </div>
                        {t('channels')}
                      </h4>
                      <p className="text-sm leading-relaxed">{campaign.channels}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg glass-card border border-accent/20 premium-glow">
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-accent">
                      <div className="w-1 h-4 bg-gradient-to-b from-accent to-accent-glow rounded-full" />
                      {t('expectedResults')}
                    </h4>
                    <p className="text-sm leading-relaxed">{campaign.expected_outcome}</p>
                  </div>

                  <div className="p-4 rounded-lg border-2 border-dashed border-primary/20 glass-card">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-primary-glow/20 text-primary text-xs font-bold premium-glow">
                        ✓
                      </div>
                      {t('implementationSteps')}
                    </h4>
                    <ol className="space-y-2">
                      {campaign.action_steps.map((step, stepIdx) => (
                        <li key={stepIdx} className="flex gap-3 text-sm hover-lift">
                          <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-accent/20 to-accent-glow/20 text-accent font-semibold text-xs premium-glow">
                            {stepIdx + 1}
                          </span>
                          <span className="leading-relaxed pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Campaign Actions */}
                  <div className="mb-6">
                    <CampaignActions 
                      campaign={campaign} 
                      eventId={event.id} 
                      campaignId={campaignIds[idx]}
                      onCampaignSaved={(id) => {
                        setCampaignIds(prev => ({ ...prev, [idx]: id }));
                        loadMockupsForCampaign(id);
                      }}
                      onMockupGenerated={() => campaignIds[idx] && loadMockupsForCampaign(campaignIds[idx])}
                    />
                  </div>

                  {/* Generated Mockups */}
                  {campaignIds[idx] && campaignMockups[campaignIds[idx]]?.length > 0 && (
                    <div className="mt-6 p-4 rounded-lg glass-card border border-accent/20 premium-glow">
                      <h4 className="font-bold mb-4 text-lg flex items-center gap-2 gradient-text">
                        <Sparkles className="h-5 w-5 text-accent" />
                        {t('generatedMockups')}
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {campaignMockups[campaignIds[idx]].map((mockup, mIdx) => (
                          <div key={mIdx} className={`group relative rounded-lg overflow-hidden border-2 border-primary/20 hover:border-accent/40 transition-all hover-lift premium-glow stagger-${(mIdx % 5) + 1}`}>
                            <img 
                              src={mockup.file_data} 
                              alt={mockup.file_name}
                              className="w-full h-auto cursor-pointer transition-transform group-hover:scale-105"
                              onClick={() => {
                                const win = window.open("", "_blank");
                                if (win) {
                                  win.document.write(`
                                    <html>
                                      <head><title>${mockup.file_name}</title></head>
                                      <body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#000;">
                                        <img src="${mockup.file_data}" style="max-width:100%;max-height:100vh;object-fit:contain;" />
                                      </body>
                                    </html>
                                  `);
                                  win.document.close();
                                }
                              }}
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3">
                              <p className="text-white text-sm font-semibold">{mockup.metadata?.platform || t('mockup')}</p>
                              <p className="text-white/70 text-xs mt-1">{new Date(mockup.created_at).toLocaleDateString(i18n.language === 'sv' ? 'sv-SE' : 'en-US')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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