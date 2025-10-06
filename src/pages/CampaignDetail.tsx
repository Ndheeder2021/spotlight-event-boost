import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Copy, Trash2, Mail, Share2, FileDown, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [campaign, setCampaign] = useState<any>(null);

  useEffect(() => {
    loadCampaign();
  }, [id]);

  const loadCampaign = async () => {
    try {
      const { data, error } = await supabase
        .from("campaigns")
        .select(`
          *,
          events:event_id (
            title,
            venue_name,
            start_time
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      setCampaign(data);
    } catch (error: any) {
      toast.error(error.message);
      navigate("/campaigns");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("campaigns")
        .update({
          title: campaign.title,
          description: campaign.description,
          status: campaign.status,
          recommended_start: campaign.recommended_start,
          recommended_end: campaign.recommended_end,
        })
        .eq("id", id);

      if (error) throw error;
      toast.success("Kampanj sparad!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(campaign.description);
    toast.success("Text kopierad!");
  };

  const handleDelete = async () => {
    if (!confirm("Är du säker på att du vill ta bort denna kampanj?")) return;

    try {
      const { error } = await supabase.from("campaigns").delete().eq("id", id);
      if (error) throw error;
      toast.success("Kampanj raderad");
      navigate("/campaigns");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-campaign", {
        body: {
          eventId: campaign.event_id,
          locationId: campaign.location_id,
        },
      });

      if (error) throw error;

      if (data.campaigns && data.campaigns.length > 0) {
        const newCampaign = data.campaigns[0];
        setCampaign({
          ...campaign,
          ai_generated_data: newCampaign,
        });
        toast.success("Nya AI-förslag genererade!");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setRegenerating(false);
    }
  };

  const exportAsEmail = () => {
    const emailContent = `
Kampanjtitel: ${campaign.title}

Beskrivning:
${campaign.description}

Målgrupp: ${campaign.ai_generated_data?.target_audience || "Ej specificerad"}
Timing: ${campaign.ai_generated_data?.recommended_timing || "Ej specificerad"}
Kanaler: ${campaign.ai_generated_data?.channels || "Ej specificerad"}

Förväntade resultat:
${campaign.ai_generated_data?.expected_outcome || "Ej specificerad"}

Genomförandesteg:
${campaign.ai_generated_data?.action_steps?.map((step: string, i: number) => `${i + 1}. ${step}`).join("\n") || "Inga steg"}
    `.trim();

    const mailto = `mailto:?subject=${encodeURIComponent(campaign.title)}&body=${encodeURIComponent(emailContent)}`;
    window.open(mailto);
  };

  const exportAsSocialPost = (platform: "Meta" | "TikTok") => {
    const adIdea = campaign.ai_generated_data?.ad_ideas?.find(
      (ad: any) => ad.platform === platform
    );

    if (!adIdea) {
      toast.error(`Ingen ${platform}-annons hittades`);
      return;
    }

    const postText = `
🎯 ${campaign.title}

${adIdea.ad_copy}

${adIdea.cta}

#event #marknadsföring #${platform.toLowerCase()}
    `.trim();

    navigator.clipboard.writeText(postText);
    toast.success(`${platform}-inlägg kopierat!`);
  };

  const exportAsPDF = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("generate-pdf", {
        body: {
          campaign: {
            title: campaign.title,
            description: campaign.description,
            ...campaign.ai_generated_data,
          },
        },
      });

      if (error) throw error;

      // Open HTML in new window for printing
      const htmlContent = atob(data.pdf);
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
        }, 250);
        toast.success("PDF-förhandsgranskning öppnad - använd Skriv ut för att spara som PDF");
      }
    } catch (error: any) {
      toast.error("Kunde inte generera PDF");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse">Laddar...</div>
      </div>
    );
  }

  if (!campaign) return null;

  const adIdeas = campaign?.ai_generated_data?.ad_ideas || [];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Button variant="ghost" onClick={() => navigate("/campaigns")} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Tillbaka till kampanjer
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Redigera kampanj</CardTitle>
                <Button
                  variant="outline"
                  onClick={handleRegenerate}
                  disabled={regenerating}
                >
                  {regenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Genererar...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Nya AI-förslag
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Titel</Label>
                <Input
                  id="title"
                  value={campaign.title}
                  onChange={(e) => setCampaign({ ...campaign, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Beskrivning</Label>
                <Textarea
                  id="description"
                  value={campaign.description}
                  onChange={(e) => setCampaign({ ...campaign, description: e.target.value })}
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={campaign.status}
                  onValueChange={(value) => setCampaign({ ...campaign, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Utkast</SelectItem>
                    <SelectItem value="scheduled">Schemalagd</SelectItem>
                    <SelectItem value="published">Publicerad</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start">Rekommenderad start</Label>
                  <Input
                    id="start"
                    type="datetime-local"
                    value={campaign.recommended_start?.slice(0, 16)}
                    onChange={(e) =>
                      setCampaign({ ...campaign, recommended_start: new Date(e.target.value).toISOString() })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end">Rekommenderad slut</Label>
                  <Input
                    id="end"
                    type="datetime-local"
                    value={campaign.recommended_end?.slice(0, 16)}
                    onChange={(e) =>
                      setCampaign({ ...campaign, recommended_end: new Date(e.target.value).toISOString() })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Generated Data */}
          {campaign.ai_generated_data && (
            <Card>
              <CardHeader>
                <CardTitle>AI-Genererat innehåll</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="details">Detaljer</TabsTrigger>
                    <TabsTrigger value="meta">Meta-annons</TabsTrigger>
                    <TabsTrigger value="tiktok">TikTok-annons</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-4">
                    <div>
                      <Label className="text-sm font-semibold">Målgrupp</Label>
                      <p className="text-sm text-muted-foreground">
                        {campaign.ai_generated_data.target_audience}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Timing</Label>
                      <p className="text-sm text-muted-foreground">
                        {campaign.ai_generated_data.recommended_timing}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Kanaler</Label>
                      <p className="text-sm text-muted-foreground">
                        {campaign.ai_generated_data.channels}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Förväntade resultat</Label>
                      <p className="text-sm text-muted-foreground">
                        {campaign.ai_generated_data.expected_outcome}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Genomförandesteg</Label>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                        {campaign.ai_generated_data.action_steps?.map((step: string, i: number) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </TabsContent>

                  <TabsContent value="meta" className="space-y-4">
                    {adIdeas.find((ad: any) => ad.platform === "Meta") ? (
                      <>
                        <div>
                          <Label className="text-sm font-semibold">Annonstext</Label>
                          <p className="text-sm text-muted-foreground">
                            {adIdeas.find((ad: any) => ad.platform === "Meta").ad_copy}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold">Visuellt koncept</Label>
                          <p className="text-sm text-muted-foreground">
                            {adIdeas.find((ad: any) => ad.platform === "Meta").visual_concept}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold">Call-to-Action</Label>
                          <Badge>{adIdeas.find((ad: any) => ad.platform === "Meta").cta}</Badge>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold">Målgrupp</Label>
                          <p className="text-sm text-muted-foreground">
                            {adIdeas.find((ad: any) => ad.platform === "Meta").targeting}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold">Budget</Label>
                          <p className="text-sm text-muted-foreground">
                            {adIdeas.find((ad: any) => ad.platform === "Meta").budget_recommendation}
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">Ingen Meta-annons genererad</p>
                    )}
                  </TabsContent>

                  <TabsContent value="tiktok" className="space-y-4">
                    {adIdeas.find((ad: any) => ad.platform === "TikTok") ? (
                      <>
                        <div>
                          <Label className="text-sm font-semibold">Annonstext</Label>
                          <p className="text-sm text-muted-foreground">
                            {adIdeas.find((ad: any) => ad.platform === "TikTok").ad_copy}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold">Visuellt koncept</Label>
                          <p className="text-sm text-muted-foreground">
                            {adIdeas.find((ad: any) => ad.platform === "TikTok").visual_concept}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold">Call-to-Action</Label>
                          <Badge>{adIdeas.find((ad: any) => ad.platform === "TikTok").cta}</Badge>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold">Målgrupp</Label>
                          <p className="text-sm text-muted-foreground">
                            {adIdeas.find((ad: any) => ad.platform === "TikTok").targeting}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold">Budget</Label>
                          <p className="text-sm text-muted-foreground">
                            {adIdeas.find((ad: any) => ad.platform === "TikTok").budget_recommendation}
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">Ingen TikTok-annons genererad</p>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Åtgärder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={handleSave} disabled={saving} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Sparar..." : "Spara ändringar"}
              </Button>
              <Button variant="outline" onClick={handleCopyText} className="w-full">
                <Copy className="h-4 w-4 mr-2" />
                Kopiera text
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Exportera</CardTitle>
              <CardDescription>Exportera kampanjen i olika format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" onClick={exportAsEmail} className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                E-postmall
              </Button>
              <Button variant="outline" onClick={() => exportAsSocialPost("Meta")} className="w-full">
                <Share2 className="h-4 w-4 mr-2" />
                Meta-inlägg
              </Button>
              <Button variant="outline" onClick={() => exportAsSocialPost("TikTok")} className="w-full">
                <Share2 className="h-4 w-4 mr-2" />
                TikTok-inlägg
              </Button>
              <Button variant="outline" onClick={exportAsPDF} className="w-full">
                <FileDown className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Event</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <Label className="text-xs text-muted-foreground">Titel</Label>
                  <p>{campaign.events?.title}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Plats</Label>
                  <p>{campaign.events?.venue_name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-destructive">Raderingszon</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={handleDelete} className="w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                Radera kampanj
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
