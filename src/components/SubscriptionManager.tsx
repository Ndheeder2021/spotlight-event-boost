import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown, Sparkles, Zap, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import type { PlanType } from "@/hooks/usePlanFeatures";

interface SubscriptionManagerProps {
  currentPlan: PlanType;
  tenantId: string;
  onPlanChange: () => void;
}

interface StripeSubscription {
  subscribed: boolean;
  plan?: string;
  trial?: boolean;
  trial_end?: string;
  subscription_end?: string;
  status?: string;
}

const planDetails = {
  starter: {
    name: "Starter",
    icon: Sparkles,
    monthlyPrice: "299 kr/mån",
    yearlyPrice: "3 229 kr/år",
    yearlyDiscount: "10% rabatt",
    priceId: "price_1SKe8WAixmGbMRBldRF4WL0H",
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
    monthlyPrice: "499 kr/mån",
    yearlyPrice: "3 592 kr/år",
    yearlyDiscount: "40% rabatt",
    priceId: "price_1SKe8zAixmGbMRBlNtiGg3Cj",
    features: [
      "14 dagars gratis provperiod",
      "Alla Starter-funktioner",
      "Upp till 3 användare",
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
    priceId: null,
    features: [
      "Alla Professional-funktioner",
      "Upp till 10 användare",
      "AI-livesupport 24/7",
      "White-label branding",
      "Avancerad rollhantering",
      "API-åtkomst för integrationer",
      "Anpassad webhook-integration",
      "Prioriterad support",
    ],
  },
};

export function SubscriptionManager({ currentPlan, tenantId, onPlanChange }: SubscriptionManagerProps) {
  const [updating, setUpdating] = useState<PlanType | null>(null);
  const [stripeSubscription, setStripeSubscription] = useState<StripeSubscription | null>(null);
  const [loadingStripe, setLoadingStripe] = useState(true);

  useEffect(() => {
    checkStripeSubscription();
  }, []);

  const checkStripeSubscription = async () => {
    try {
      setLoadingStripe(true);
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) throw error;
      setStripeSubscription(data);
    } catch (error: any) {
      console.error("Error checking Stripe subscription:", error);
    } finally {
      setLoadingStripe(false);
    }
  };

  const handlePlanChange = async (newPlan: PlanType) => {
    if (newPlan === currentPlan) return;
    if (newPlan === "enterprise") {
      toast.info("Kontakta oss för Enterprise-planen");
      return;
    }

    setUpdating(newPlan);
    try {
      const priceId = planDetails[newPlan].priceId;
      if (!priceId) throw new Error("Pris-ID saknas");

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId }
      });

      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
        toast.success("Öppnar Stripe Checkout i ny flik...");
      }
    } catch (error: any) {
      toast.error("Kunde inte öppna checkout: " + error.message);
    } finally {
      setUpdating(null);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
        toast.success("Öppnar Stripe Customer Portal...");
      }
    } catch (error: any) {
      toast.error("Kunde inte öppna portalen: " + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Ditt nuvarande abonnemang</h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold capitalize">{planDetails[currentPlan].name}</p>
            {currentPlan !== "starter" && (
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold">
                <Crown className="h-3 w-3" />
                PREMIUM
              </div>
            )}
          </div>
          
          {!loadingStripe && stripeSubscription && (
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              {stripeSubscription.trial && (
                <p className="text-accent font-medium">
                  🎉 Provperiod aktiv till {stripeSubscription.trial_end ? new Date(stripeSubscription.trial_end).toLocaleDateString('sv-SE') : 'N/A'}
                </p>
              )}
              {stripeSubscription.subscribed && !stripeSubscription.trial && (
                <p>
                  Nästa betalning: {stripeSubscription.subscription_end ? new Date(stripeSubscription.subscription_end).toLocaleDateString('sv-SE') : 'N/A'}
                </p>
              )}
              {stripeSubscription.subscribed && (
                <Button 
                  onClick={handleManageSubscription}
                  variant="outline" 
                  size="sm"
                  className="w-fit mt-2"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Hantera prenumeration
                </Button>
              )}
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
                {!isCurrent && plan !== "enterprise" && (
                  <Button
                    onClick={() => handlePlanChange(plan)}
                    disabled={updating !== null || loadingStripe}
                    variant={isHigherTier ? "default" : "outline"}
                    className="w-full"
                  >
                    {updating === plan ? (
                      "Öppnar checkout..."
                    ) : (
                      <>
                        <Crown className="h-4 w-4 mr-2" />
                        Starta 14 dagars gratis provperiod
                      </>
                    )}
                  </Button>
                )}
                {!isCurrent && plan === "enterprise" && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => toast.info("Kontakta oss på info@spotlight.se för Enterprise-planen")}
                  >
                    Kontakta oss
                  </Button>
                )}
                {isCurrent && stripeSubscription?.subscribed && (
                  <Button
                    onClick={handleManageSubscription}
                    variant="outline"
                    className="w-full"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Hantera prenumeration
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
