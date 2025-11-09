import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Check, X, ArrowRight, Shield, Sparkles, TrendingUp, Bell, BarChart, Target, Star } from "lucide-react";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { TrustBadges } from "@/components/TrustBadges";
import { GlobalHeader } from "@/components/GlobalHeader";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Switch } from "@/components/ui/switch";

export default function Pricing() {
  const { t } = useTranslation();
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: t('pricingPlanStarter'),
      monthlyPrice: t('pricingStarterMonthly'),
      yearlyPrice: t('pricingStarterYearly'),
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
      monthlyPrice: t('pricingProfessionalMonthly'),
      yearlyPrice: t('pricingProfessionalYearly'),
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
              "price": i18n.language === 'sv' ? "299" : "29",
              "priceCurrency": i18n.language === 'sv' ? "SEK" : "USD",
              "priceValidUntil": "2025-12-31"
            },
            {
              "@type": "Offer",
              "name": "Professional",
              "price": i18n.language === 'sv' ? "499" : "49",
              "priceCurrency": i18n.language === 'sv' ? "SEK" : "USD",
              "priceValidUntil": "2025-12-31"
            }
          ]
        }}
      />
      <GlobalHeader />

      {/* Hero Section - Playful & Human */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden">
        {/* Playful decorations */}
        <div className="absolute top-10 left-10 text-primary/10 hidden lg:block" style={{ transform: 'rotate(-15deg)' }}>
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="30" stroke="currentColor" strokeWidth="3" strokeDasharray="5 5" fill="none" />
          </svg>
        </div>
        <div className="absolute bottom-10 right-10 text-primary/10 hidden lg:block" style={{ transform: 'rotate(20deg)' }}>
          <svg width="60" height="60" viewBox="0 0 60 60">
            <path d="M10 30 L50 30 M30 10 L30 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            {/* Fun badge with emojis */}
            <div className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-border/50 shadow-lg animate-fade-in" style={{ transform: 'rotate(-1deg)' }}>
              <span className="text-2xl">💰</span>
              <span className="text-sm font-semibold text-foreground">Transparent Pricing</span>
              <span className="text-2xl">✨</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight relative inline-block">
              {t('pricingHero')}{" "}
              <span className="text-primary">{t('pricingHeroHighlight')}</span>
              {/* Hand-drawn underline */}
              <div className="absolute -bottom-2 left-0 right-0 flex justify-center">
                <svg width="300" height="20" viewBox="0 0 300 20" className="text-primary/40">
                  <path d="M10 15 Q 75 10, 150 13 T 290 15" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </div>
            </h1>
            
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
              {t('pricingHeroDesc')}
            </p>
            
            {/* Fun stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-8">
              {[
                { icon: "🎁", label: t('pricingFeature1'), rotate: "-2deg" },
                { icon: "🚀", label: t('pricingFeature2'), rotate: "1deg" },
                { icon: "💎", label: t('pricingFeature3'), rotate: "-1.5deg" }
              ].map((item, i) => (
                <div 
                  key={i} 
                  className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border-2 border-border/50 hover:border-primary/40 transition-all duration-300 hover:scale-105" 
                  style={{ transform: `rotate(${item.rotate})` }}
                >
                  <div className="text-3xl mb-2 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}>
                    {item.icon}
                  </div>
                  <p className="text-sm font-semibold">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards - Same Design as Homepage */}
      <section className="py-16 px-4 sm:px-6">
        <div className="container mx-auto">
          {/* Billing Toggle with Fun Badge */}
          <div className="flex flex-col items-center justify-center gap-4 mb-16">
            <div className="flex items-center gap-4">
              <span className={`text-lg font-medium transition-colors ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
                {t('pricingMonthly')}
              </span>
              <Switch 
                checked={isYearly} 
                onCheckedChange={setIsYearly}
              />
              <span className={`text-lg font-medium transition-colors ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
                {t('pricingYearly')}
              </span>
            </div>
            {isYearly && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-primary/10 text-primary border-2 border-primary/20 animate-bounce" style={{ animationDuration: '2s' }}>
                <Sparkles className="h-4 w-4" />
                {t('pricingSave')}
                <Sparkles className="h-4 w-4" />
              </div>
            )}
          </div>

          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="md:hidden overflow-x-auto pb-8 -mx-4 px-4">
            <div className="flex gap-6 min-w-max">
              {plans.map((plan, index) => (
                <div 
                  key={plan.name} 
                  className={`group relative rounded-[20px] border-2 p-7 transition-all duration-500 ease-out overflow-visible w-[85vw] max-w-[400px] min-h-[600px] flex-shrink-0 ${
                    index === 0 ? 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900' : 
                    index === 1 ? 'bg-gradient-to-br from-primary/10 to-primary/5' : 
                    'bg-gradient-to-br from-yellow-100 to-amber-200 dark:from-yellow-900/30 dark:to-amber-900/20'
                  } ${plan.popular ? 'border-primary shadow-lg' : 'border-border hover:border-primary hover:shadow-[0_4px_18px_0_rgba(0,0,0,0.25)]'}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <span className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-wide flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        {t('pricingMostPopular')}
                      </span>
                    </div>
                  )}
                  
                  <div className="h-full flex flex-col">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <p className="text-muted-foreground text-sm">{plan.description}</p>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold">
                          {isYearly ? (plan.yearlyPrice || plan.monthlyPrice) : plan.monthlyPrice}
                        </span>
                        {plan.monthlyPrice !== t('pricingContactUs') && (
                          <span className="text-muted-foreground text-sm">
                            /{isYearly ? t('pricingPerYear') : t('pricingPerMonth')}
                          </span>
                        )}
                      </div>
                      {isYearly && plan.yearlyDiscount && (
                        <p className="text-xs text-primary font-medium mt-2">{plan.yearlyDiscount}</p>
                      )}
                    </div>

                    <div className="space-y-3 mb-20 flex-grow">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        {t('pricingIncluded')}
                      </p>
                      {plan.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-xs">{f}</span>
                        </div>
                      ))}
                      {plan.notIncluded.length > 0 && plan.notIncluded.map((f, i) => (
                        <div key={i} className="flex items-start gap-2 opacity-30">
                          <X className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-muted-foreground">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {plan.name === t('pricingPlanEnterprise') ? (
                    <Link to="/contact" className="absolute left-1/2 bottom-0 w-[70%] -translate-x-1/2 translate-y-[125%] rounded-2xl bg-primary text-primary-foreground text-sm text-center px-4 py-3 font-medium opacity-0 transition-all duration-300 ease-out group-hover:translate-y-[50%] group-hover:opacity-100 flex items-center justify-center gap-2">
                      {t('pricingContactUs')}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <Link to="/auth" className="absolute left-1/2 bottom-0 w-[70%] -translate-x-1/2 translate-y-[125%] rounded-2xl bg-primary text-primary-foreground text-sm text-center px-4 py-3 font-medium opacity-0 transition-all duration-300 ease-out group-hover:translate-y-[50%] group-hover:opacity-100 flex items-center justify-center gap-2">
                      {t('pricingStartFree')}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Desktop grid layout */}
          <div className="hidden md:grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <div 
                key={plan.name} 
                className={`group relative rounded-[20px] border-2 p-7 transition-all duration-500 ease-out overflow-visible min-h-[600px] ${
                  index === 0 ? 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900' : 
                  index === 1 ? 'bg-gradient-to-br from-primary/10 to-primary/5' : 
                  'bg-gradient-to-br from-yellow-100 to-amber-200 dark:from-yellow-900/30 dark:to-amber-900/20'
                } ${plan.popular ? 'border-primary shadow-lg' : 'border-border hover:border-primary hover:shadow-[0_4px_18px_0_rgba(0,0,0,0.25)]'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-wide flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      {t('pricingMostPopular')}
                    </span>
                  </div>
                )}
                
                <div className="h-full flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm">{plan.description}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">
                        {isYearly ? (plan.yearlyPrice || plan.monthlyPrice) : plan.monthlyPrice}
                      </span>
                      {plan.monthlyPrice !== t('pricingContactUs') && (
                        <span className="text-muted-foreground text-sm">
                          /{isYearly ? t('pricingPerYear') : t('pricingPerMonth')}
                        </span>
                      )}
                    </div>
                    {isYearly && plan.yearlyDiscount && (
                      <p className="text-xs text-primary font-medium mt-2">{plan.yearlyDiscount}</p>
                    )}
                  </div>

                  <div className="space-y-3 mb-20 flex-grow">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      {t('pricingIncluded')}
                    </p>
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-xs">{f}</span>
                      </div>
                    ))}
                    {plan.notIncluded.length > 0 && plan.notIncluded.map((f, i) => (
                      <div key={i} className="flex items-start gap-2 opacity-30">
                        <X className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-muted-foreground">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {plan.name === t('pricingPlanEnterprise') ? (
                  <Link to="/contact" className="absolute left-1/2 bottom-0 w-[70%] -translate-x-1/2 translate-y-[125%] rounded-2xl bg-primary text-primary-foreground text-sm text-center px-4 py-3 font-medium opacity-0 transition-all duration-300 ease-out group-hover:translate-y-[50%] group-hover:opacity-100 flex items-center justify-center gap-2">
                    {t('pricingContactUs')}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <Link to="/auth" className="absolute left-1/2 bottom-0 w-[70%] -translate-x-1/2 translate-y-[125%] rounded-2xl bg-primary text-primary-foreground text-sm text-center px-4 py-3 font-medium opacity-0 transition-all duration-300 ease-out group-hover:translate-y-[50%] group-hover:opacity-100 flex items-center justify-center gap-2">
                    {t('pricingStartFree')}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Trust line with emojis */}
          <div className="text-center mt-16 space-y-4">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <span className="text-2xl">✨</span>
              <p className="text-base">{t('pricingAllPlansInclude')}</p>
              <span className="text-2xl">🎁</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section - More Playful */}
      <section className="py-20 px-4 sm:px-6 bg-muted/20 relative overflow-hidden">
        {/* Playful decorations */}
        <div className="absolute top-10 right-10 text-primary/10 hidden lg:block animate-pulse" style={{ animationDuration: '3s' }}>
          <span className="text-9xl">✨</span>
        </div>
        <div className="absolute bottom-10 left-10 text-primary/10 hidden lg:block animate-pulse" style={{ animationDuration: '2.5s' }}>
          <span className="text-9xl">🎯</span>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-5xl mx-auto text-center mb-16">
            {/* Fun badge */}
            <div className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-border/50 shadow-lg mb-6" style={{ transform: 'rotate(1deg)' }}>
              <span className="text-xl">🌟</span>
              <span className="text-base font-bold">Why Choose Us</span>
              <span className="text-xl">💪</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 relative inline-block">
              {t('pricingWhatYouGet')} <span className="text-primary">Spotlight</span>?
              {/* Wavy underline */}
              <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 400 8" preserveAspectRatio="none">
                <path d="M0 4 Q 100 2, 200 4 T 400 4" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.3" />
              </svg>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('pricingWhatYouGetDesc')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Bell,
                emoji: "🔔",
                title: t('pricingBenefit1Title'),
                description: t('pricingBenefit1Desc'),
                rotate: "-1deg"
              },
              {
                icon: Sparkles,
                emoji: "✨",
                title: t('pricingBenefit2Title'),
                description: t('pricingBenefit2Desc'),
                rotate: "1.5deg"
              },
              {
                icon: BarChart,
                emoji: "📊",
                title: t('pricingBenefit3Title'),
                description: t('pricingBenefit3Desc'),
                rotate: "-0.5deg"
              },
              {
                icon: Target,
                emoji: "🎯",
                title: t('pricingBenefit4Title'),
                description: t('pricingBenefit4Desc'),
                rotate: "1deg"
              },
              {
                icon: TrendingUp,
                emoji: "📈",
                title: t('pricingBenefit5Title'),
                description: t('pricingBenefit5Desc'),
                rotate: "-1.2deg"
              },
              {
                icon: Zap,
                emoji: "⚡",
                title: t('pricingBenefit6Title'),
                description: t('pricingBenefit6Desc'),
                rotate: "0.8deg"
              }
            ].map((benefit, i) => (
              <div 
                key={i} 
                className="group relative p-8 rounded-3xl bg-card border-2 border-border hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-xl" 
                style={{ transform: `rotate(${benefit.rotate})` }}
              >
                {/* Animated emoji */}
                <div className="text-6xl mb-6 text-center animate-bounce group-hover:scale-125 transition-transform duration-300" style={{ animationDelay: `${i * 0.2}s` }}>
                  {benefit.emoji}
                </div>
                
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
                
                {/* Decorative corner */}
                <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-primary/20 rounded-tr-xl" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Money-Back Guarantee - More Fun */}
      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="relative p-10 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/5 border-2 border-primary/30 shadow-2xl" style={{ transform: 'rotate(-0.5deg)' }}>
              {/* Decorative elements */}
              <div className="absolute -top-6 -left-6 text-6xl animate-bounce" style={{ animationDuration: '2s' }}>
                💰
              </div>
              <div className="absolute -top-6 -right-6 text-6xl animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.3s' }}>
                ✨
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-6xl animate-bounce" style={{ animationDuration: '2.2s', animationDelay: '0.6s' }}>
                🎉
              </div>
              
              <div className="text-center relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 border-4 border-primary/30 mb-6 animate-pulse">
                  <Shield className="h-10 w-10 text-primary" />
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 relative inline-block">
                  {t('pricingGuaranteeTitle')} <span className="text-primary">{t('pricingGuaranteeHighlight')}</span>
                  {/* Hand-drawn circle */}
                  <svg className="absolute inset-0 w-full h-full -z-10 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <ellipse cx="50" cy="50" rx="48" ry="20" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.2" />
                  </svg>
                </h2>
                
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                  {t('pricingGuaranteeDesc')}
                </p>
                
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/20 border-2 border-primary/40">
                  <span className="text-2xl">🛡️</span>
                  <span className="font-bold text-lg">{t('pricingGuaranteeText')}</span>
                  <span className="text-2xl">🛡️</span>
                </div>
              </div>
            </div>
          </div>
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
    </div>
  );
}
