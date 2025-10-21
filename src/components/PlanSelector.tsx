import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Check, Crown, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

interface PlanSelectorProps {
  onSuccess: () => void;
}

const planDetails = {
  starter: {
    name: "Starter",
    icon: Sparkles,
    monthlyPrice: "$29",
    yearlyPrice: "$329",
    yearlyDiscount: "Spara $19",
    monthlyPriceId: "price_1SKebgAixmGbMRBlFvakW9uF",
    yearlyPriceId: "price_1SKebwAixmGbMRBlzOkLO82t",
    features: [
      "14 dagars gratis provperiod",
      "Spara kampanjer till databasen",
      "Grundläggande kampanjvy",
      "Redigera kampanjförslag",
      "Upp till 10 kampanjer",
    ],
  },
  professional: {
    name: "Professional",
    icon: Crown,
    monthlyPrice: "$49",
    yearlyPrice: "$359",
    yearlyDiscount: "Spara $229",
    monthlyPriceId: "price_1SKecbAixmGbMRBl0jqqEjby",
    yearlyPriceId: "price_1SKecoAixmGbMRBlzgFiVNUw",
    features: [
      "14 dagars gratis provperiod",
      "Alla Starter-funktioner",
      "Upp till 3 användare",
      "PDF-export med professionell design",
      "Dela kampanjer via länk",
      "Analytics & ROI-tracking",
      "AI-genererade visuella mockups",
      "Flerspråksstöd",
      "A/B-testning",
      "Obegränsat antal kampanjer",
    ],
  },
};

export function PlanSelector({ onSuccess }: PlanSelectorProps) {
  const [isYearly, setIsYearly] = useState(false);
  const [selecting, setSelecting] = useState<"starter" | "professional" | null>(null);

  const handleSelectPlan = async (plan: "starter" | "professional") => {
    setSelecting(plan);
    try {
      const priceId = isYearly 
        ? planDetails[plan].yearlyPriceId 
        : planDetails[plan].monthlyPriceId;

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId }
      });

      if (error) throw error;

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      }
    } catch (error: any) {
      toast.error("Kunde inte starta checkout: " + error.message);
      setSelecting(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-5xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-block px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-2">
            <span className="text-sm font-semibold text-accent">Välj ditt abonnemang</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">
            Välkommen till <span className="gradient-text">Spotlight</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Välj den plan som passar ditt företag bäst. 
            <strong className="text-foreground"> Alla planer inkluderar 14 dagars gratis provperiod.</strong>
          </p>
        </div>

        {/* Billing Period Toggle */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-4 p-1 rounded-full bg-muted">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-full transition-all ${
                !isYearly ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground'
              }`}
            >
              Månadsvis
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${
                isYearly ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground'
              }`}
            >
              Årsvis
              <span className="px-2 py-1 bg-accent/20 text-accent text-xs font-bold rounded-full">
                Spara pengar
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6">
          {(Object.keys(planDetails) as Array<keyof typeof planDetails>).map((plan) => {
            const details = planDetails[plan];
            const Icon = details.icon;
            const isPopular = plan === "professional";

            return (
              <Card
                key={plan}
                className={`flex flex-col glass-card transition-all hover:scale-105 ${
                  isPopular
                    ? "border-2 border-accent shadow-glow premium-glow-lg"
                    : "border-2 hover:border-accent/30 premium-glow"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-accent to-accent-glow text-primary-foreground text-xs font-bold rounded-full">
                    MEST POPULÄR
                  </div>
                )}
                <CardHeader className="text-center pb-6">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Icon className={`h-7 w-7 ${isPopular ? "text-accent" : ""}`} />
                    <CardTitle className="text-2xl">{details.name}</CardTitle>
                  </div>
                  <div className="pt-2">
                    {isYearly && details.yearlyPrice ? (
                      <>
                        <div className="mb-2">
                          <span className="text-4xl font-bold">{details.yearlyPrice}</span>
                          <span className="text-muted-foreground text-lg ml-1">/år</span>
                        </div>
                        {details.yearlyDiscount && (
                          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-bold">
                            💰 {details.yearlyDiscount}
                          </div>
                        )}
                      </>
                    ) : (
                      <div>
                        <span className="text-4xl font-bold">{details.monthlyPrice}</span>
                        <span className="text-muted-foreground text-lg ml-1">/mån</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <div className="space-y-3 min-h-[300px]">
                    {details.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={selecting !== null}
                    variant={isPopular ? "default" : "outline"}
                    size="lg"
                    className="w-full"
                  >
                    {selecting === plan ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Öppnar checkout...
                      </>
                    ) : (
                      <>
                        <Crown className="h-4 w-4 mr-2" />
                        Välj {details.name}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Trust indicators */}
        <div className="text-center space-y-2 pt-6">
          <p className="text-sm text-muted-foreground">
            ✓ Ingen bindningstid • ✓ Avsluta när du vill • ✓ Säker betalning via Stripe
          </p>
          <p className="text-xs text-muted-foreground">
            Du kommer inte debiteras under provperioden på 14 dagar
          </p>
        </div>
      </div>
    </div>
  );
}