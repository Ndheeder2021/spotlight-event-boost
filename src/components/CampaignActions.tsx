import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Save, 
  FileText, 
  Share2, 
  Mail, 
  Sparkles,
  BarChart,
  MessageSquare,
  Copy,
  Check
} from "lucide-react";
import { usePlanFeatures } from "@/hooks/usePlanFeatures";
import { PlanUpgradeDialog } from "./PlanUpgradeDialog";
import { SaveCampaignDialog } from "./SaveCampaignDialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CampaignActionsProps {
  campaign: any;
  eventId: string;
  campaignId?: string;
  onCampaignSaved?: (campaignId: string) => void;
}

export function CampaignActions({ campaign, eventId, campaignId, onCampaignSaved }: CampaignActionsProps) {
  const { features, loading } = usePlanFeatures();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [email, setEmail] = useState("");

  const handleFeatureClick = (featureName: string, canUse: boolean, action: () => void) => {
    if (!canUse) {
      setUpgradeFeature(featureName);
      setShowUpgrade(true);
    } else {
      action();
    }
  };

  const handleGeneratePDF = async () => {
    if (!campaignId) {
      toast.error("Spara kampanjen först för att generera PDF");
      return;
    }

    setGenerating("pdf");
    try {
      const { error } = await supabase.functions.invoke("generate-pdf", {
        body: { campaignId },
      });

      if (error) throw error;
      toast.success("PDF genererad!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setGenerating(null);
    }
  };

  const handleGenerateMockup = async (adIdea: any) => {
    if (!campaignId) {
      toast.error("Spara kampanjen först för att generera mockup");
      return;
    }

    setGenerating("mockup");
    try {
      const { data, error } = await supabase.functions.invoke("generate-ad-mockup", {
        body: { adIdea, campaignId },
      });

      if (error) throw error;
      toast.success("Mockup genererad!");
      return data;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setGenerating(null);
    }
  };

  const handleShare = async () => {
    if (!campaignId) {
      toast.error("Spara kampanjen först för att dela");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: userRole } = await supabase
        .from("user_roles")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

      if (!userRole) throw new Error("No tenant found");

      // Generate unique share token
      const shareToken = crypto.randomUUID();

      // Create share link (expires in 30 days)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      const { error } = await supabase
        .from("campaign_shares")
        .insert({
          campaign_id: campaignId,
          tenant_id: userRole.tenant_id,
          share_token: shareToken,
          expires_at: expiresAt.toISOString(),
          created_by: user.id,
        });

      if (error) throw error;

      const link = `${window.location.origin}/campaigns/shared/${shareToken}`;
      setShareLink(link);
      setShowShareDialog(true);
      toast.success("Delningslänk skapad!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    toast.success("Länk kopierad!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmail = async () => {
    if (!campaignId) {
      toast.error("Spara kampanjen först för att skicka via email");
      return;
    }

    if (!email || !email.includes("@")) {
      toast.error("Ange en giltig email-adress");
      return;
    }

    setGenerating("email");
    try {
      const { error } = await supabase.functions.invoke("send-campaign-email", {
        body: { 
          campaignId, 
          recipientEmail: email,
          campaign 
        },
      });

      if (error) throw error;
      toast.success("Email skickad!");
      setShowEmailDialog(false);
      setEmail("");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setGenerating(null);
    }
  };

  if (loading) return null;

  return (
    <>
      <div className="flex flex-wrap gap-2 p-4 bg-muted/30 rounded-lg border border-accent/10">
        <Button
          size="sm"
          onClick={() => handleFeatureClick("Spara kampanj", features.canSaveCampaigns, () => setShowSaveDialog(true))}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Spara kampanj
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => handleFeatureClick("PDF-export", features.canExportPDF, handleGeneratePDF)}
          disabled={generating === "pdf"}
        >
          <FileText className="h-4 w-4 mr-2" />
          Exportera PDF
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => handleFeatureClick("Dela kampanj", features.canShareCampaigns, handleShare)}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Dela
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => handleFeatureClick("Skicka via email", features.canSendEmail, () => setShowEmailDialog(true))}
          disabled={generating === "email"}
        >
          <Mail className="h-4 w-4 mr-2" />
          Skicka
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => handleFeatureClick("Generera mockup", features.canGenerateImages, () => handleGenerateMockup(campaign.ad_ideas?.[0]))}
          disabled={generating === "mockup" || !campaign.ad_ideas?.length}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Generera mockup
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => handleFeatureClick("Analytics", features.canViewAnalytics, () => toast.info("Analytics kommer snart"))}
        >
          <BarChart className="h-4 w-4 mr-2" />
          Analytics
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => handleFeatureClick("Kommentarer", features.canAddComments, () => toast.info("Kommentarer kommer snart"))}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Kommentarer
        </Button>
      </div>

      <PlanUpgradeDialog
        open={showUpgrade}
        onOpenChange={setShowUpgrade}
        featureName={upgradeFeature}
      />

      <SaveCampaignDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        campaign={campaign}
        eventId={eventId}
        onSaved={onCampaignSaved}
      />

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dela kampanj</DialogTitle>
            <DialogDescription>
              Kopiera länken nedan för att dela kampanjen. Länken är giltig i 30 dagar.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={shareLink}
                readOnly
                className="flex-1"
              />
              <Button
                onClick={handleCopyLink}
                size="icon"
                variant="outline"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Skicka kampanj via email</DialogTitle>
            <DialogDescription>
              Ange email-adressen du vill skicka kampanjen till
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email-adress</Label>
              <Input
                id="email"
                type="email"
                placeholder="exempel@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendEmail()}
              />
            </div>
            <Button
              onClick={handleSendEmail}
              disabled={generating === "email"}
              className="w-full"
            >
              {generating === "email" ? "Skickar..." : "Skicka email"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}