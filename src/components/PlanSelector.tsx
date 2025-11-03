import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Check, Crown, Sparkles, Loader2, ArrowRight, LogOut } from "lucide-react";
import { toast } from "sonner";
import { GlassRadioToggle } from "./ui/glass-radio-toggle";

interface PlanSelectorProps {
  onSuccess: () => void;
}


export function PlanSelector({ onSuccess }: PlanSelectorProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);
  const [selecting, setSelecting] = useState<"starter" | "professional" | null>(null);
  const currency = i18n.language === 'sv' ? 'sek' : 'usd';

  const planDetails = {
    starter: {
      name: t("planSelector.plans.starter.name"),
      icon: Sparkles,
      usd: {
        monthlyPrice: 29,
        yearlyPrice: 329,
        monthlyPriceId: "price_1SKebgAixmGbMRBlFvakW9uF",
        yearlyPriceId: "price_1SKebwAixmGbMRBlzOkLO82t",
        currency: "USD",
        yearlyDiscount: t("planSelector.plans.starter.yearlyDiscount")
      },
      sek: {
        monthlyPrice: 299,
        yearlyPrice: 3290,
        monthlyPriceId: "price_1SKe8WAixmGbMRBldRF4WL0H",
        yearlyPriceId: "price_1SKe8WAixmGbMRBldRF4WL0H",
        currency: "SEK",
        yearlyDiscount: t("planSelector.plans.starter.yearlyDiscount")
      },
      features: [
        t("planSelector.plans.starter.features.0"),
        t("planSelector.plans.starter.features.1"),
        t("planSelector.plans.starter.features.2"),
        t("planSelector.plans.starter.features.3"),
        t("planSelector.plans.starter.features.4"),
      ],
    },
    professional: {
      name: t("planSelector.plans.professional.name"),
      icon: Crown,
      usd: {
        monthlyPrice: 49,
        yearlyPrice: 359,
        monthlyPriceId: "price_1SKecbAixmGbMRBl0jqqEjby",
        yearlyPriceId: "price_1SKecoAixmGbMRBlzgFiVNUw",
        currency: "USD",
        yearlyDiscount: t("planSelector.plans.professional.yearlyDiscount")
      },
      sek: {
        monthlyPrice: 499,
        yearlyPrice: 4990,
        monthlyPriceId: "price_1SKe8zAixmGbMRBlNtiGg3Cj",
        yearlyPriceId: "price_1SKe8zAixmGbMRBlNtiGg3Cj",
        currency: "SEK",
        yearlyDiscount: t("planSelector.plans.professional.yearlyDiscount")
      },
      features: [
        t("planSelector.plans.professional.features.0"),
        t("planSelector.plans.professional.features.1"),
        t("planSelector.plans.professional.features.2"),
        t("planSelector.plans.professional.features.3"),
        t("planSelector.plans.professional.features.4"),
        t("planSelector.plans.professional.features.5"),
        t("planSelector.plans.professional.features.6"),
        t("planSelector.plans.professional.features.7"),
        t("planSelector.plans.professional.features.8"),
        t("planSelector.plans.professional.features.9"),
      ],
    },
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleSelectPlan = async (plan: "starter" | "professional") => {
    setSelecting(plan);
    try {
      const currencyPrices = planDetails[plan][currency];
      const priceId = isYearly 
        ? currencyPrices.yearlyPriceId 
        : currencyPrices.monthlyPriceId;

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId, language: i18n.language }
      });

      if (error) throw error;

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      }
    } catch (error: any) {
      toast.error(t("planSelector.errors.checkout") + error.message);
      setSelecting(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-5xl space-y-8">
        {/* Logout Button */}
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            {t("planSelector.logout")}
          </Button>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-block px-6 py-2.5 rounded-full bg-accent/20 border-2 border-accent/40 mb-2 shadow-lg shadow-accent/10">
            <span className="text-base font-bold text-primary">{t("planSelector.header.badge")}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">
            {t("planSelector.header.title")} <span className="gradient-text">Spotlight</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("planSelector.header.subtitle")}{" "}
            <strong className="text-foreground">{t("planSelector.header.trial")}</strong>
          </p>
        </div>

        {/* Billing Period Toggle */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-4">
            <GlassRadioToggle
              options={[
                { id: "monthly-plan", label: t("planSelector.billing.monthly"), value: false },
                { id: "yearly-plan", label: t("planSelector.billing.yearly"), value: true }
              ]}
              selected={isYearly}
              onChange={setIsYearly}
            />
            {isYearly && (
              <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-accent/20 text-accent">
                ✨ {t("planSelector.billing.save")}
              </span>
            )}
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
                    {t("planSelector.popular")}
                  </div>
                )}
                <CardHeader className="text-center pb-6">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Icon className={`h-7 w-7 ${isPopular ? "text-accent" : ""}`} />
                    <CardTitle className="text-2xl">{details.name}</CardTitle>
                  </div>
                  <div className="pt-2">
                    {isYearly && details[currency].yearlyPrice ? (
                      <>
                        <div className="mb-2">
                          <span className="text-4xl font-bold">
                            {currency === 'sek' ? `${details[currency].yearlyPrice} kr` : `$${details[currency].yearlyPrice}`}
                          </span>
                          <span className="text-muted-foreground text-lg ml-1">{t("planSelector.billing.yearSuffix")}</span>
                        </div>
                        {details[currency].yearlyDiscount && (
                          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-bold">
                            💰 {details[currency].yearlyDiscount}
                          </div>
                        )}
                      </>
                    ) : (
                      <div>
                        <span className="text-4xl font-bold">
                          {currency === 'sek' ? `${details[currency].monthlyPrice} kr` : `$${details[currency].monthlyPrice}`}
                        </span>
                        <span className="text-muted-foreground text-lg ml-1">{t("planSelector.billing.monthSuffix")}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between space-y-4">
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
                    className="w-full mt-auto"
                  >
                    {selecting === plan ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("planSelector.buttons.opening")}
                      </>
                    ) : (
                      <>
                        <Crown className="h-4 w-4 mr-2" />
                        {t("planSelector.buttons.select")} {details.name}
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
            {t("planSelector.trust.features")}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("planSelector.trust.noCharge")}
          </p>
        </div>
      </div>
    </div>
  );
}