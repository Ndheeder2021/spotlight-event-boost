import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import type { PlanType } from "@/hooks/usePlanFeatures";

interface SubscriptionManagerProps {
  currentPlan: PlanType;
  tenantId: string;
  onPlanChange: () => void;
}

const planDetails = {
  starter: {
    name: "Starter",
    icon: Sparkles,
    monthlyPrice: "299 kr/mån",
    yearlyPrice: "3 229 kr/år",
    yearlyDiscount: "10% rabatt",
    features: [
      "Spara kampanjer till databasen",
      "Grundläggande kampanjvy",
      "Redigera kampanjförslag",
      "Upp till 10 kampanjer",
    ],
  },
  professional: {
    name: "Professional",
    icon: Crown,
    monthlyPrice: "499 kr/mån",
    yearlyPrice: "3 592 kr/år",
    yearlyDiscount: "40% rabatt",
    features: [
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
    ],
  },
  enterprise: {
    name: "Enterprise",
    icon: Zap,
    monthlyPrice: "Kontakta oss",
    yearlyPrice: null,
    yearlyDiscount: null,
    features: [
      "Alla Professional-funktioner",
      "Dedikerad support",
      "Anpassade integrationer",
      "White-label lösning",
      "Avancerad rollhantering",
      "SLA-garantier",
    ],
  },
};

export function SubscriptionManager({ currentPlan, tenantId, onPlanChange }: SubscriptionManagerProps) {
  const [updating, setUpdating] = useState<PlanType | null>(null);

  const handlePlanChange = async (newPlan: PlanType) => {
    if (newPlan === currentPlan) return;

    setUpdating(newPlan);
    try {
      const { error } = await supabase
        .from("tenants")
        .update({ plan: newPlan })
        .eq("id", tenantId);

      if (error) throw error;

      toast.success(`Abonnemang ändrat till ${planDetails[newPlan].name}!`);
      onPlanChange();
    } catch (error: any) {
      toast.error("Kunde inte ändra abonnemang: " + error.message);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Ditt nuvarande abonnemang</h3>
        <div className="flex items-center gap-2">
          <p className="text-2xl font-bold capitalize">{planDetails[currentPlan].name}</p>
          {currentPlan !== "starter" && (
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold">
              <Crown className="h-3 w-3" />
              PREMIUM
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {(Object.keys(planDetails) as PlanType[]).map((plan) => {
          const details = planDetails[plan];
          const Icon = details.icon;
          const isCurrent = plan === currentPlan;
          const isHigherTier = 
            (currentPlan === "starter" && (plan === "professional" || plan === "enterprise")) ||
            (currentPlan === "professional" && plan === "enterprise");
          const isLowerTier = 
            (currentPlan === "enterprise" && (plan === "professional" || plan === "starter")) ||
            (currentPlan === "professional" && plan === "starter");

          return (
            <Card
              key={plan}
              className={`relative ${
                isCurrent
                  ? "border-2 border-accent shadow-glow"
                  : plan === "professional"
                  ? "border-accent/50"
                  : ""
              }`}
            >
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-full">
                  NUVARANDE PLAN
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-6 w-6 ${plan === "professional" ? "text-accent" : ""}`} />
                  <CardTitle>{details.name}</CardTitle>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">
                    {details.monthlyPrice}
                  </div>
                  {details.yearlyPrice && (
                    <div className="space-y-1">
                      <div className="text-lg font-semibold text-muted-foreground">
                        {details.yearlyPrice}
                      </div>
                      {details.yearlyDiscount && (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-bold">
                          {details.yearlyDiscount}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 min-h-[300px]">
                  {details.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                {!isCurrent && (
                  <Button
                    onClick={() => handlePlanChange(plan)}
                    disabled={updating !== null}
                    variant={isHigherTier ? "default" : "outline"}
                    className="w-full"
                  >
                    {updating === plan ? (
                      "Uppdaterar..."
                    ) : isHigherTier ? (
                      <>
                        <Crown className="h-4 w-4 mr-2" />
                        Uppgradera
                      </>
                    ) : isLowerTier ? (
                      "Nedgradera"
                    ) : null}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
