import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Zap, Bell, Sparkles, Send, BarChart, Check, ArrowRight, Star, Rocket, Clock, TrendingUp, Users, Target, Heart, CheckCircle2 } from "lucide-react";
import { Footer } from "@/components/Footer";
import { GlobalHeader } from "@/components/GlobalHeader";
import { TrustBadges } from "@/components/TrustBadges";
import { AnimatedCounter } from "@/components/AnimatedCounter";

export default function HowItWorks() {
  const { t } = useTranslation();
  
  const steps = [
    {
      number: 1,
      emoji: "📍",
      icon: Bell,
      title: t('howItWorksStep1Title'),
      desc: t('howItWorksStep1Desc'),
      features: [
        t('howItWorksStep1Feature1'),
        t('howItWorksStep1Feature2'),
        t('howItWorksStep1Feature3')
      ]
    },
    {
      number: 2,
      emoji: "✨",
      icon: Sparkles,
      title: t('howItWorksStep2Title'),
      desc: t('howItWorksStep2Desc'),
      features: [
        t('howItWorksStep2Feature1'),
        t('howItWorksStep2Feature2'),
        t('howItWorksStep2Feature3')
      ]
    },
    {
      number: 3,
      emoji: "🚀",
      icon: Send,
      title: t('howItWorksStep3Title'),
      desc: t('howItWorksStep3Desc'),
      features: [
        t('howItWorksStep3Feature1'),
        t('howItWorksStep3Feature2'),
        t('howItWorksStep3Feature3')
      ]
    },
    {
      number: 4,
      emoji: "📊",
      icon: BarChart,
      title: t('howItWorksStep4Title'),
      desc: t('howItWorksStep4Desc'),
      features: [
        t('howItWorksStep4Feature1'),
        t('howItWorksStep4Feature2'),
        t('howItWorksStep4Feature3')
      ]
    }
  ];
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <GlobalHeader />

      {/* Hero - More Playful */}
      <section className="relative container mx-auto px-4 sm:px-6 py-32 lg:py-40 overflow-hidden">
        {/* Doodle decorations */}
        <div className="absolute top-10 left-10 text-primary/10 hidden lg:block animate-float" style={{ transform: 'rotate(-20deg)' }}>
          <svg width="80" height="80" viewBox="0 0 80 80">
            <path d="M20 40 L60 40 M40 20 L40 60" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <circle cx="40" cy="40" r="25" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="5,5" />
          </svg>
        </div>
        <div className="absolute bottom-10 right-20 text-accent/10 hidden lg:block animate-float" style={{ animationDelay: '1s', transform: 'rotate(30deg)' }}>
          <svg width="60" height="60" viewBox="0 0 60 60">
            <path d="M10 30 Q30 10, 50 30" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="30" cy="15" r="4" fill="currentColor" />
          </svg>
        </div>
        
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-block relative animate-in fade-in duration-500">
            <Badge variant="outline" className="border-primary/30 bg-primary/5 px-6 py-2 text-base" style={{ transform: 'rotate(-2deg)' }}>
              🎯 {t('howItWorksBadge') || "Enklare än du tror"}
            </Badge>
            <svg className="absolute inset-0 w-full h-full -z-10 pointer-events-none" viewBox="0 0 200 50">
              <ellipse cx="100" cy="25" rx="98" ry="23" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.2" />
            </svg>
          </div>
          
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight animate-in fade-in duration-700 delay-100">
            {t('howItWorksHero')}
            <br />
            <span className="gradient-text relative inline-block">
              {t('howItWorksHeroHighlight')}
              <svg className="absolute -bottom-4 left-0 w-full h-4" viewBox="0 0 400 12" preserveAspectRatio="none">
                <path d="M0 6 Q 100 2, 200 6 T 400 6" stroke="hsl(var(--primary))" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4" />
              </svg>
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto animate-in fade-in duration-700 delay-200">
            {t('howItWorksHeroDesc')}
          </p>
          
          {/* Fun stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 animate-in fade-in duration-700 delay-300">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-accent" />
              <span className="font-semibold">10 minuter</span>
              <span className="text-muted-foreground">att sätta upp</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Rocket className="h-4 w-4 text-primary" />
              <span className="font-semibold">Ingen kodning</span>
              <span className="text-muted-foreground">krävs</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
              <span className="font-semibold">100%</span>
              <span className="text-muted-foreground">användarvänligt</span>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps - More Human */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-muted/20 to-background">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-6xl mb-4">👇</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Så här <span className="gradient-text">enkelt</span> är det
            </h2>
            <p className="text-lg text-muted-foreground">
              Från nybörjare till expert på 4 steg
            </p>
          </div>
          
          <div className="space-y-16">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div 
                  key={step.number}
                  className="relative animate-in fade-in duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Connection line - hidden on mobile */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-8 top-24 bottom-[-4rem] w-0.5 bg-gradient-to-b from-accent via-accent/50 to-transparent hidden md:block" />
                  )}
                  
                  <div className="grid md:grid-cols-[auto,1fr] gap-8 items-start">
                    {/* Step number with emoji */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-lg hover:scale-110 transition-transform">
                          {step.number}
                        </div>
                        <div className="absolute -top-2 -right-2 text-3xl animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>
                          {step.emoji}
                        </div>
                      </div>
                    </div>
                    
                    {/* Step content */}
                    <Card 
                      className="p-8 border-2 glass-card hover:border-accent/50 transition-all duration-300 hover:shadow-2xl premium-glow group cursor-pointer"
                      style={{ transform: `rotate(${isEven ? '-0.5deg' : '0.5deg'})` }}
                    >
                      <div className="flex items-start gap-4 mb-6">
                        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform group-hover:rotate-6">
                          <StepIcon className="h-7 w-7 text-accent" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold mb-3 group-hover:text-accent transition-colors">
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground text-lg leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                      
                      {/* Features */}
                      <div className="mt-6 pl-[4.5rem] space-y-4">
                        {step.features.map((feature, i) => (
                          <div 
                            key={i}
                            className="flex items-start gap-3 animate-in fade-in duration-300"
                            style={{ animationDelay: `${(index * 100) + (i * 50)}ms` }}
                          >
                            <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="h-4 w-4 text-accent" />
                            </div>
                            <span className="text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Fun fact for each step */}
                      <div className="mt-6 pl-[4.5rem]">
                        <div className="inline-block bg-primary/5 border border-primary/20 rounded-lg px-4 py-2" style={{ transform: 'rotate(-1deg)' }}>
                          <p className="text-xs text-muted-foreground">
                            💡 <span className="font-semibold text-foreground">
                              {index === 0 && "Tar mindre än 2 minuter"}
                              {index === 1 && "AI gör 95% av jobbet"}
                              {index === 2 && "Leverans inom sekunder"}
                              {index === 3 && "Se resultat i realtid"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="border-primary/30 bg-primary/5 px-6 py-2 mb-6" style={{ transform: 'rotate(1deg)' }}>
              📈 Snabba siffror
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Resultat som <span className="gradient-text">imponerar</span> ⚡
            </h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center p-8 border-2 glass-card hover:border-accent/50 transition-all duration-300 hover:scale-110 premium-glow group cursor-pointer" style={{ transform: 'rotate(-1deg)' }}>
              <div className="text-5xl mb-3">⏱️</div>
              <div className="text-4xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform">
                <AnimatedCounter end={10} suffix=" min" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">Genomsnittlig setup-tid</p>
            </Card>
            
            <Card className="text-center p-8 border-2 glass-card hover:border-accent/50 transition-all duration-300 hover:scale-110 premium-glow group cursor-pointer">
              <div className="text-5xl mb-3">🎯</div>
              <div className="text-4xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform">
                <AnimatedCounter end={95} suffix="%" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">Automatisering</p>
            </Card>
            
            <Card className="text-center p-8 border-2 glass-card hover:border-accent/50 transition-all duration-300 hover:scale-110 premium-glow group cursor-pointer" style={{ transform: 'rotate(1deg)' }}>
              <div className="text-5xl mb-3">💰</div>
              <div className="text-4xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform">
                <AnimatedCounter end={40} suffix="%" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">Högre försäljning</p>
            </Card>
            
            <Card className="text-center p-8 border-2 glass-card hover:border-accent/50 transition-all duration-300 hover:scale-110 premium-glow group cursor-pointer" style={{ transform: 'rotate(-1deg)' }}>
              <div className="text-5xl mb-3">😊</div>
              <div className="text-4xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform">
                <AnimatedCounter end={98} suffix="%" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">Nöjda kunder</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid - More Playful */}
      <section className="relative container mx-auto px-4 py-20 bg-gradient-to-b from-accent/5 to-background overflow-hidden">
        {/* Doodle decoration */}
        <div className="absolute top-20 right-10 text-muted/10 hidden lg:block" style={{ transform: 'rotate(15deg)' }}>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="10,5" />
            <path d="M30 50 L70 50 M50 30 L50 70" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('howItWorksFeaturesTitle')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('howItWorksFeaturesDesc')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card 
                key={i}
                className="p-6 border-2 glass-card hover:border-accent/50 transition-all duration-300 hover:scale-105 hover:shadow-xl premium-glow group cursor-pointer animate-in fade-in"
                style={{ 
                  animationDelay: `${i * 50}ms`,
                  transform: `rotate(${i % 2 === 0 ? '-0.5deg' : '0.5deg'})`
                }}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {i === 1 && "🎯"}
                  {i === 2 && "⚡"}
                  {i === 3 && "🤖"}
                  {i === 4 && "📊"}
                  {i === 5 && "🔔"}
                  {i === 6 && "💡"}
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">
                  {t(`howItWorksFeature${i}Title`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`howItWorksFeature${i}Desc`)}
                </p>
              </Card>
            ))}
          </div>
          
          {/* Fun achievement badges */}
          <div className="mt-16 flex flex-wrap justify-center gap-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
              <Star className="h-4 w-4 text-green-500 fill-green-500" />
              <span className="text-sm font-medium">500+ företag litar på oss</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">40% högre ROI i snitt</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
              <Users className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">10 000+ kampanjer skapade</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - More Festive */}
      <section className="relative container mx-auto px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-accent/5 -z-10" />
        
        {/* Celebration decorations */}
        <div className="absolute top-10 left-10 text-6xl animate-bounce hidden lg:block" style={{ animationDelay: '0.5s' }}>
          🎉
        </div>
        <div className="absolute top-20 right-20 text-6xl animate-bounce hidden lg:block" style={{ animationDelay: '1s' }}>
          🎊
        </div>
        <div className="absolute bottom-10 left-1/4 text-6xl animate-bounce hidden lg:block" style={{ animationDelay: '1.5s' }}>
          ⭐
        </div>
        <div className="absolute bottom-10 right-1/4 text-6xl animate-bounce hidden lg:block" style={{ animationDelay: '2s' }}>
          ✨
        </div>
        
        <div className="max-w-4xl mx-auto text-center space-y-8 glass-card p-12 rounded-3xl border-2 premium-glow-lg relative" style={{ transform: 'rotate(-0.5deg)' }}>
          <div className="text-6xl mb-4 animate-bounce">🚀</div>
          
          <h2 className="text-4xl md:text-5xl font-bold">
            {t('howItWorksCtaTitle')} <span className="gradient-text">{t('howItWorksCtaHighlight')}</span>?
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('howItWorksCtaDesc')}
          </p>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>14 dagar gratis prova-på</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Inget kreditkort behövs</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Avsluta när du vill</span>
            </div>
          </div>
          
          <div className="pt-4">
            <Button 
              variant="animated" 
              size="xl" 
              className="group relative" 
              asChild
            >
              <Link to="/auth" className="flex items-center gap-2">
                {t('howItWorksCtaBtn')}
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          {/* Small testimonial snippet */}
          <div className="pt-8 border-t border-border/50">
            <div className="flex items-center justify-center gap-2 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground italic">
              "Bästa marknadsföringsverktyget jag använt. Sparar mig 15 timmar i veckan!"
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              — Anna S., Café Bröd & Salt
            </p>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Footer */}
      <Footer />
    </div>
  );
}
