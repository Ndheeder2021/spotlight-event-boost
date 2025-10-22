import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown, Sparkles, Zap, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
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
    monthlyPrice: "$29/mån",
    yearlyPrice: "$329/år",
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
    monthlyPrice: "$49/mån",
    yearlyPrice: "$359/år",
    yearlyDiscount: "Spara $229",
    monthlyPriceId: "price_1SKecbAixmGbMRBl0jqqEjby",
    yearlyPriceId: "price_1SKecoAixmGbMRBlzgFiVNUw",
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
    monthlyPriceId: null,
    yearlyPriceId: null,
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
  const { t } = useTranslation();
  const [updating, setUpdating] = useState<PlanType | null>(null);
  const [stripeSubscription, setStripeSubscription] = useState<StripeSubscription | null>(null);
  const [loadingStripe, setLoadingStripe] = useState(true);
  const [isYearly, setIsYearly] = useState(false);

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
      toast.info(t('contactUsForEnterprise'));
      return;
    }

    setUpdating(newPlan);
    try {
      const priceId = isYearly ? planDetails[newPlan].yearlyPriceId : planDetails[newPlan].monthlyPriceId;
      if (!priceId) throw new Error(t('priceIdMissing'));

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId }
      });

      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
        toast.success(t('openingStripeCheckout'));
      }
    } catch (error: any) {
      toast.error(t('couldNotOpenCheckout') + error.message);
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
        toast.success(t('openingStripePortal'));
      }
    } catch (error: any) {
      toast.error(t('couldNotOpenPortal') + error.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Billing Period Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center gap-4 p-1 rounded-full bg-muted">
          <button
            onClick={() => setIsYearly(false)}
            className={`px-6 py-2 rounded-full transition-all ${
              !isYearly ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground'
            }`}
          >
            {t('monthly')}
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${
              isYearly ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground'
            }`}
          >
            {t('yearly')}
            <span className="relative px-3 py-1.5 bg-gradient-to-r from-accent to-accent-glow text-primary-foreground text-xs font-bold rounded-full animate-pulse shadow-glow hover-scale">
              <span className="relative z-10 flex items-center gap-1">
                💰 {t('saveMoney')}
              </span>
              <span className="absolute inset-0 rounded-full bg-accent/30 animate-[ping_2s_ease-in-out_infinite]"></span>
            </span>
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">{t('yourCurrentSubscription')}</h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold capitalize">{planDetails[currentPlan].name}</p>
            {currentPlan !== "starter" && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-accent to-accent-glow text-primary-foreground text-sm font-bold shadow-glow animate-pulse border-2 border-accent/50">
                <Crown className="h-4 w-4 animate-[spin_3s_ease-in-out_infinite]" />
                {t('premium')}
              </div>
            )}
          </div>
          
          {!loadingStripe && stripeSubscription && (
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              {stripeSubscription.trial && (
                <p className="text-accent font-medium">
                  🎉 {t('trialActiveUntil', { date: stripeSubscription.trial_end ? new Date(stripeSubscription.trial_end).toLocaleDateString(t('locale')) : 'N/A' })}
                </p>
              )}
              {stripeSubscription.subscribed && !stripeSubscription.trial && (
                <p>
                  {t('nextPayment')}: {stripeSubscription.subscription_end ? new Date(stripeSubscription.subscription_end).toLocaleDateString(t('locale')) : 'N/A'}
                </p>
              )}
              {stripeSubscription.subscribed && (
                <Button 
                  onClick={handleManageSubscription}
                  variant="default" 
                  size="lg"
                  className="w-full mt-4 bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-all hover-scale group"
                >
                  <ExternalLink className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                  {t('manageSubscriptionButton')}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {(Object.keys(planDetails) as PlanType[]).map((plan) => {
          const details = planDetails[plan];
          const Icon = details.icon;
          const isCurrent = plan === currentPlan;
          const isHigherTier = 
            (currentPlan === "starter" && (plan === "professional" || plan === "enterprise")) ||
            (currentPlan === "professional" && plan === "enterprise");

          return (
            <Card
              key={plan}
              className={`flex flex-col glass-card transition-all hover:scale-105 ${
                isCurrent
                  ? "border-2 border-accent shadow-glow premium-glow-lg"
                  : plan === "professional"
                  ? "border-2 border-accent/50 premium-glow"
                  : "border-2 hover:border-accent/30 premium-glow"
              }`}
            >
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-accent to-accent-glow text-primary-foreground text-xs font-bold rounded-full">
                  {t('currentPlanBadge')}
                </div>
              )}
              {plan === "professional" && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-accent to-accent-glow text-primary-foreground text-xs font-bold rounded-full">
                  {t('mostPopular')}
                </div>
              )}
              <CardHeader className="text-center pb-6">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Icon className={`h-7 w-7 ${plan === "professional" ? "text-accent" : ""}`} />
                  <CardTitle className="text-2xl">{details.name}</CardTitle>
                </div>
                <div className="pt-2">
                  {isYearly && details.yearlyPrice ? (
                    <>
                      <div className="mb-2">
                        <span className="text-4xl font-bold">{details.yearlyPrice.replace('/år', '')}</span>
                        <span className="text-muted-foreground text-lg ml-1">/år</span>
                      </div>
                      {details.yearlyDiscount && (
                        <div className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-accent via-accent-glow to-accent text-primary-foreground text-base font-extrabold shadow-glow animate-pulse border-2 border-accent/70 hover-scale">
                          <span className="text-xl">💰</span>
                          <span className="relative z-10">{details.yearlyDiscount}</span>
                          <span className="absolute inset-0 rounded-full bg-accent/40 animate-[ping_2s_ease-in-out_infinite]"></span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div>
                      <span className="text-4xl font-bold">{details.monthlyPrice.replace('/mån', '')}</span>
                      <span className="text-muted-foreground text-lg ml-1">/mån</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <div className="space-y-3 flex-grow">
                  {details.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-6 mt-auto">
                  {!isCurrent && plan !== "enterprise" && (
                    <Button
                      onClick={() => handlePlanChange(plan)}
                      disabled={updating !== null || loadingStripe}
                      variant={plan === "professional" ? "default" : "outline"}
                      size="lg"
                      className="w-full"
                    >
                      {updating === plan ? (
                        t('opening')
                      ) : (
                        <>
                          <Crown className="h-4 w-4 mr-2" />
                          {t('tryFree')}
                        </>
                      )}
                    </Button>
                  )}
                  {plan === "enterprise" && (
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      onClick={() => toast.info(t('contactUsForEnterpriseEmail'))}
                    >
                      {t('contactUsButton')}
                    </Button>
                  )}
                  {isCurrent && plan !== "enterprise" && stripeSubscription?.subscribed && (
                    <Button
                      onClick={handleManageSubscription}
                      variant="outline"
                      size="lg"
                      className="w-full"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {t('manage')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
