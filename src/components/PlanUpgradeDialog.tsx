import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PlanUpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featureName: string;
}

export function PlanUpgradeDialog({ open, onOpenChange, featureName }: PlanUpgradeDialogProps) {
  const navigate = useNavigate();

  const starterFeatures = [
    "Spara kampanjer till databasen",
    "Grundläggande kampanjvy",
    "Redigera kampanjförslag",
    "Upp till 10 kampanjer",
  ];

  const professionalFeatures = [
    "Alla Starter-funktioner",
    "PDF-export med professionell design",
    "Dela kampanjer via länk (lösenordsskydd)",
    "Skicka kampanjer via email",
    "Analytics & ROI-tracking",
    "AI-genererade visuella mockups",
    "Flerspråksstöd",
    "A/B-testning",
    "Kommentarer från klienter",
    "Obegränsat antal kampanjer",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold bg-gradient-premium bg-clip-text text-transparent">
            Uppgradera för att använda {featureName}
          </DialogTitle>
          <DialogDescription className="text-lg">
            Välj det paket som passar dina behov bäst
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Starter Plan */}
          <div className="border-2 border-accent/20 rounded-lg p-6 bg-gradient-subtle">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-accent" />
              <h3 className="text-2xl font-bold">Starter</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Perfekt för små verksamheter som vill komma igång
            </p>
            <div className="space-y-3 mb-6">
              {starterFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                onOpenChange(false);
                navigate("/settings");
              }}
            >
              Ditt nuvarande paket
            </Button>
          </div>

          {/* Professional Plan */}
          <div className="border-2 border-accent rounded-lg p-6 bg-gradient-to-br from-accent/5 to-accent/10 relative overflow-hidden shadow-premium">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-premium opacity-20 blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-bold mb-4">
                <Crown className="h-4 w-4" />
                REKOMMENDERAS
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Crown className="h-6 w-6 text-accent" />
                <h3 className="text-2xl font-bold">Professional</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Komplett lösning för seriösa marknadsförare
              </p>
              <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto">
                {professionalFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
              <Button 
                className="w-full shadow-glow hover:shadow-premium transition-all duration-300"
                onClick={() => {
                  onOpenChange(false);
                  navigate("/settings");
                }}
              >
                <Crown className="h-4 w-4 mr-2" />
                Uppgradera till Professional
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}