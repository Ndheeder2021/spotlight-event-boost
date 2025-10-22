import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Check, X, ArrowRight, Shield, Sparkles, TrendingUp, Bell, BarChart, Target } from "lucide-react";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { LiveChatSupport } from "@/components/LiveChatSupport";
import { TrustBadges } from "@/components/TrustBadges";

export default function Pricing() {
  const { t } = useTranslation();
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: t('pricingPlanStarter'),
      monthlyPrice: "$29",
      yearlyPrice: "$329",
      yearlyDiscount: t('pricingSaveAmount'),
      description: t('pricingPlanStarterDesc'),
      features: [
        t('pricingStarterFeature1'),
        t('pricingStarterFeature2'),
        t('pricingStarterFeature3'),
        t('pricingStarterFeature4'),
        t('pricingStarterFeature5'),
        t('pricingStarterFeature6'),
        t('pricingStarterFeature7'),
        t('pricingStarterFeature8'),
        t('pricingStarterFeature9'),
        t('pricingStarterFeature10'),
      ],
      notIncluded: [
        t('pricingStarterNotIncluded1'),
        t('pricingStarterNotIncluded2'),
        t('pricingStarterNotIncluded3'),
        t('pricingStarterNotIncluded4'),
        t('pricingStarterNotIncluded5'),
        t('pricingStarterNotIncluded6'),
        t('pricingStarterNotIncluded7'),
        t('pricingStarterNotIncluded8'),
      ]
    },
    {
      name: t('pricingPlanProfessional'),
      monthlyPrice: "$49",
      yearlyPrice: "$359",
      yearlyDiscount: t('pricingSaveAmountPro'),
      description: t('pricingPlanProfessionalDesc'),
      features: [
        t('pricingProFeature1'),
        t('pricingProFeature2'),
        t('pricingProFeature3'),
        t('pricingProFeature4'),
        t('pricingProFeature5'),
        t('pricingProFeature6'),
        t('pricingProFeature7'),
        t('pricingProFeature8'),
        t('pricingProFeature9'),
        t('pricingProFeature10'),
        t('pricingProFeature11'),
        t('pricingProFeature12'),
        t('pricingProFeature13'),
        t('pricingProFeature14'),
        t('pricingProFeature15'),
        t('pricingProFeature16'),
        t('pricingProFeature17'),
      ],
      notIncluded: [
        t('pricingProNotIncluded1'),
        t('pricingProNotIncluded2'),
        t('pricingProNotIncluded3'),
        t('pricingProNotIncluded4'),
      ],
      popular: true
    },
    {
      name: t('pricingPlanEnterprise'),
      monthlyPrice: t('pricingContactUs'),
      yearlyPrice: null,
      yearlyDiscount: null,
      description: t('pricingPlanEnterpriseDesc'),
      features: [
        t('pricingEnterpriseFeature1'),
        t('pricingEnterpriseFeature2'),
        t('pricingEnterpriseFeature3'),
        t('pricingEnterpriseFeature4'),
        t('pricingEnterpriseFeature5'),
        t('pricingEnterpriseFeature6'),
        t('pricingEnterpriseFeature7'),
        t('pricingEnterpriseFeature8'),
        t('pricingEnterpriseFeature9'),
        t('pricingEnterpriseFeature10'),
        t('pricingEnterpriseFeature11'),
        t('pricingEnterpriseFeature12'),
        t('pricingEnterpriseFeature13'),
        t('pricingEnterpriseFeature14'),
        t('pricingEnterpriseFeature15'),
        t('pricingEnterpriseFeature16'),
      ],
      notIncluded: []
    }
  ];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${t('pricing')} - Spotlight Event Marketing`}
        description={t('pricingHeroDesc')}
        keywords="priser, abonnemang, event marketing pris, kampanjverktyg kostnad"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "Spotlight Professional Plan",
          "description": "AI-driven event marketing plattform",
          "offers": [
            {
              "@type": "Offer",
              "name": "Starter",
              "price": "29",
              "priceCurrency": "USD",
              "priceValidUntil": "2025-12-31"
            },
            {
              "@type": "Offer",
              "name": "Professional",
              "price": "49",
              "priceCurrency": "USD",
              "priceValidUntil": "2025-12-31"
            }
          ]
        }}
      />
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Zap className="h-6 w-6 text-primary" fill="currentColor" />
            <span className="text-xl font-bold">Spotlight</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:inline">
              {t('home')}
            </Link>
            <Link to="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:inline">
              {t('contact')}
            </Link>
            <LanguageSwitch />
            <ThemeToggle />
            <Link to="/auth">
              <Button className="bg-accent hover:bg-accent-dark text-accent-foreground">
                {t('login')}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-32 lg:py-40">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div className="space-y-8">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight">
              {t('pricingHero')}{" "}
              <span className="text-primary">{t('pricingHeroHighlight')}</span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('pricingHeroDesc')}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 pt-4">
            <div className="flex items-center gap-2 text-base">
              <Check className="h-5 w-5 text-primary" />
              <span>{t('pricingFeature1')}</span>
            </div>
            <div className="flex items-center gap-2 text-base">
              <Check className="h-5 w-5 text-primary" />
              <span>{t('pricingFeature2')}</span>
            </div>
            <div className="flex items-center gap-2 text-base">
              <Check className="h-5 w-5 text-primary" />
              <span>{t('pricingFeature3')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Instantly.ai Style */}
      <section className="py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-4 mb-20">
            <span className={`text-lg font-medium transition-colors ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              {t('pricingMonthly')}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-12 h-6 p-0 border-2"
            >
              <div className={`absolute h-4 w-4 rounded-full bg-primary transition-all ${isYearly ? 'right-1' : 'left-1'}`} />
            </Button>
            <span className={`text-lg font-medium transition-colors ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              {t('pricingYearly')}
            </span>
            {isYearly && (
              <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-primary/10 text-primary">
                {t('pricingSave')}
              </span>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {plans.map((plan) => (
              <div 
                key={plan.name} 
                className={`relative p-8 rounded-2xl transition-all ${
                  plan.popular 
                    ? 'bg-primary/5 border-2 border-primary shadow-lg' 
                    : 'bg-card border border-border hover:border-muted-foreground/30'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-wide">
                      {t('pricingMostPopular')}
                    </span>
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl sm:text-6xl font-bold">
                      {isYearly ? (plan.yearlyPrice || plan.monthlyPrice) : plan.monthlyPrice}
                    </span>
                    {plan.monthlyPrice !== t('pricingContactUs') && (
                      <span className="text-muted-foreground text-lg">
                        /{isYearly ? t('pricingPerYear') : t('pricingPerMonth')}
                      </span>
                    )}
                  </div>
                  {isYearly && plan.yearlyDiscount && (
                    <p className="text-sm text-primary font-medium mt-2">{plan.yearlyDiscount}</p>
                  )}
                </div>

                {plan.name === t('pricingPlanEnterprise') ? (
                  <Button 
                    variant="animatedOutline"
                    className="w-full mb-8"
                    size="xl"
                    asChild
                  >
                    <Link to="/contact">
                      {t('pricingContactUs')}
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </Button>
                ) : (
                  <Button 
                    variant={plan.popular ? "animated" : "animatedOutline"}
                    className="w-full mb-8"
                    size="xl"
                    asChild
                  >
                    <Link to="/auth">
                      {t('pricingStartFree')}
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </Button>
                )}

                <div className="space-y-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    {t('pricingIncluded')}
                  </p>
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{f}</span>
                    </div>
                  ))}
                  {plan.notIncluded.length > 0 && plan.notIncluded.map((f, i) => (
                    <div key={i} className="flex items-start gap-3 opacity-30">
                      <X className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-muted-foreground">
              {t('pricingAllPlansInclude')}
            </p>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="container mx-auto px-4 py-24 bg-gradient-to-b from-background to-accent/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t('pricingWhatYouGet')} <span className="gradient-text">Spotlight</span>?
            </h2>
            <p className="text-xl text-muted-foreground">
              {t('pricingWhatYouGetDesc')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass-card border-2 hover:border-accent/50 transition-all p-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t('pricingBenefit1Title')}</h3>
              <p className="text-muted-foreground">
                {t('pricingBenefit1Desc')}
              </p>
            </Card>
            
            <Card className="glass-card border-2 hover:border-accent/50 transition-all p-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t('pricingBenefit2Title')}</h3>
              <p className="text-muted-foreground">
                {t('pricingBenefit2Desc')}
              </p>
            </Card>
            
            <Card className="glass-card border-2 hover:border-accent/50 transition-all p-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t('pricingBenefit3Title')}</h3>
              <p className="text-muted-foreground">
                {t('pricingBenefit3Desc')}
              </p>
            </Card>
            
            <Card className="glass-card border-2 hover:border-accent/50 transition-all p-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t('pricingBenefit4Title')}</h3>
              <p className="text-muted-foreground">
                {t('pricingBenefit4Desc')}
              </p>
            </Card>
            
            <Card className="glass-card border-2 hover:border-accent/50 transition-all p-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t('pricingBenefit5Title')}</h3>
              <p className="text-muted-foreground">
                {t('pricingBenefit5Desc')}
              </p>
            </Card>
            
            <Card className="glass-card border-2 hover:border-accent/50 transition-all p-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t('pricingBenefit6Title')}</h3>
              <p className="text-muted-foreground">
                {t('pricingBenefit6Desc')}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Money Back Guarantee Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="glass-card border-2 border-accent/50 premium-glow-lg p-8 md:p-12 text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center mb-6">
              <Shield className="h-10 w-10 text-accent-foreground" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('pricingGuaranteeTitle')} <span className="gradient-text">{t('pricingGuaranteeHighlight')}</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-6">
              {t('pricingGuaranteeDesc')}
            </p>
            <p className="text-lg text-muted-foreground">
              {t('pricingGuaranteeText')}
            </p>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('pricingFaqTitle')}</h2>
          </div>
          <div className="space-y-6">
            <Card className="p-6 glass-card border-2 hover:border-accent/30 transition-all group">
              <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">{t('pricingFaq1Question')}</h3>
              <p className="text-muted-foreground">
                {t('pricingFaq1Answer')}
              </p>
            </Card>
            <Card className="p-6 glass-card border-2 hover:border-accent/30 transition-all group">
              <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">{t('pricingFaq2Question')}</h3>
              <p className="text-muted-foreground">
                {t('pricingFaq2Answer')}
              </p>
            </Card>
            <Card className="p-6 glass-card border-2 hover:border-accent/30 transition-all group">
              <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">{t('pricingFaq3Question')}</h3>
              <p className="text-muted-foreground">
                {t('pricingFaq3Answer')}
              </p>
            </Card>
            <Card className="p-6 glass-card border-2 hover:border-accent/30 transition-all group">
              <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">{t('pricingFaq4Question')}</h3>
              <p className="text-muted-foreground">
                {t('pricingFaq4Answer')}
              </p>
            </Card>
            <Card className="p-6 glass-card border-2 hover:border-accent/30 transition-all group">
              <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">{t('pricingFaq5Question')}</h3>
              <p className="text-muted-foreground">
                {t('pricingFaq5Answer')}
              </p>
            </Card>
            <Card className="p-6 glass-card border-2 hover:border-accent/30 transition-all group">
              <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">{t('pricingFaq6Question')}</h3>
              <p className="text-muted-foreground">
                {t('pricingFaq6Answer')}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative container mx-auto px-4 py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/10 to-background -z-10" />
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center space-y-8 glass-card p-12 md:p-16 rounded-3xl border-2 premium-glow-lg">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            {t('pricingCtaTitle')}<br />
            <span className="gradient-text-animated">{t('pricingCtaHighlight')}</span>?
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            {t('pricingCtaDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              variant="animated"
              size="xl"
              asChild
            >
              <Link to="/auth">
                {t('pricingCtaBtn1')}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button 
              variant="animatedOutline"
              size="xl"
              asChild
            >
              <Link to="/contact">
                {t('pricingCtaBtn2')}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground pt-4">
            {t('pricingCtaFeatures')}
          </p>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Footer */}
      <Footer />
      
      {/* Live Chat Support */}
      <LiveChatSupport />
    </div>
  );
}
