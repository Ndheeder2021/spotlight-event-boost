import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Save, 
  FileText, 
  Share2, 
  Mail, 
  Sparkles,
  BarChart,
  MessageSquare 
} from "lucide-react";
import { usePlanFeatures } from "@/hooks/usePlanFeatures";
import { PlanUpgradeDialog } from "./PlanUpgradeDialog";
import { SaveCampaignDialog } from "./SaveCampaignDialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CampaignActionsProps {
  campaign: any;
  eventId: string;
  campaignId?: string;
}

export function CampaignActions({ campaign, eventId, campaignId }: CampaignActionsProps) {
  const { features, loading } = usePlanFeatures();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);

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
          onClick={() => handleFeatureClick("Dela kampanj", features.canShareCampaigns, () => toast.info("Delningsfunktion kommer snart"))}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Dela
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => handleFeatureClick("Skicka via email", features.canSendEmail, () => toast.info("Email-funktion kommer snart"))}
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
      />
    </>
  );
}