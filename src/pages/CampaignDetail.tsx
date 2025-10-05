import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse">Laddar...</div>
      </div>
    );
  }

  if (!campaign) return null;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Button variant="ghost" onClick={() => navigate("/campaigns")} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Tillbaka till kampanjer
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Redigera kampanj</CardTitle>
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

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-2">Event information</h3>
            <p className="text-sm text-muted-foreground">
              {campaign.events?.title} - {campaign.events?.venue_name}
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} disabled={saving} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Sparar..." : "Spara"}
            </Button>
            <Button variant="outline" onClick={handleCopyText}>
              <Copy className="h-4 w-4 mr-2" />
              Kopiera text
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
