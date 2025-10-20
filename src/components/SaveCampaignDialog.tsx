import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

interface SaveCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: any;
  eventId: string;
  onSaved?: () => void;
}

export function SaveCampaignDialog({ open, onOpenChange, campaign, eventId, onSaved }: SaveCampaignDialogProps) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(campaign.title);
  const [description, setDescription] = useState(campaign.description);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: userRole, error: roleError } = await supabase
        .from("user_roles")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

      if (roleError || !userRole) throw new Error("No tenant found");

      const { data: location, error: locationError } = await supabase
        .from("locations")
        .select("id")
        .eq("tenant_id", userRole.tenant_id)
        .limit(1)
        .single();

      if (locationError) {
        console.error("Location error:", locationError);
      }

      const { error } = await supabase.from("campaigns").insert({
        tenant_id: userRole.tenant_id,
        location_id: location?.id || null,
        event_id: eventId,
        title,
        description,
        status: "draft",
        recommended_start: new Date().toISOString(),
        recommended_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        ai_generated_data: campaign as any,
        user_edited_data: { title, description } as any,
      });

      if (error) throw error;

      toast.success("Kampanj sparad!");
      onOpenChange(false);
      onSaved?.();
    } catch (error: any) {
      console.error("Save campaign error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Save className="h-6 w-6 text-accent" />
            Spara kampanj
          </DialogTitle>
          <DialogDescription>
            Redigera kampanjinformationen innan du sparar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Kampanjnamn</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ange kampanjnamn..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Beskrivning</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Beskriv kampanjen..."
              rows={4}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="flex-1"
          >
            Avbryt
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || !title}
            className="flex-1"
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Save className="h-4 w-4 mr-2" />
            Spara kampanj
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}