import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, TrendingUp, Bell, Target, Users, BarChart, MapPin, Calendar, Sparkles, ArrowRight, Star, CheckCircle2, Heart } from "lucide-react";
import { Footer } from "@/components/Footer";
import { GlobalHeader } from "@/components/GlobalHeader";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { TrustBadges } from "@/components/TrustBadges";
import { ROICalculator } from "@/components/ROICalculator";
import reviewAnna from "@/assets/review-anna.jpg";
import reviewErik from "@/assets/review-erik.jpg";
import reviewMaria from "@/assets/review-maria.jpg";

export default function Solution() {
  const { t } = useTranslation();
  
  const testimonials = [
    {
      name: "Anna Svensson",
      role: "Ägare, Café Bröd & Salt",
      content: "Spotlight har ökat vår försäljning med 40% under lokala evenemang. Vi vet alltid när det händer något i området och kan snabbt sätta igång kampanjer.",
      rating: 5,
      image: reviewAnna
    },
    {
      name: "Erik Lundberg",
      role: "Marknadsansvarig, Restaurant Smak",
      content: "AI-funktionen sparar oss timmar varje vecka. Kampanjerna känns personliga och träffsäkra. Bästa investeringen vi gjort!",
      rating: 5,
      image: reviewErik
    },
    {
      name: "Maria Andersson",
      role: "VD, Urban Bar & Grill",
      content: "Professionell, användarvänlig och resultatrik. Vi har fördubblat vårt antal kampanjer utan att öka arbetstiden.",
      rating: 5,
      image: reviewMaria
    }
  ];
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <GlobalHeader />

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 sm:px-6 py-32 lg:py-40 overflow-hidden">
        {/* Doodle decorations */}
        <div className="absolute top-20 left-10 text-primary/10 hidden lg:block animate-float" style={{ transform: 'rotate(-15deg)' }}>
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="30" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="5,5" />
            <path d="M25 40 L55 40 M40 25 L40 55" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
        <div className="absolute bottom-20 right-10 text-accent/10 hidden lg:block animate-float" style={{ animationDelay: '1s', transform: 'rotate(25deg)' }}>
          <svg width="60" height="60" viewBox="0 0 60 60">
            <path d="M10 30 Q30 10, 50 30 T90 30" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="30" cy="30" r="5" fill="currentColor" />
          </svg>
        </div>
        
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-block relative animate-in fade-in duration-500">
            <Badge variant="outline" className="border-primary/30 bg-primary/5 px-6 py-2 text-base" style={{ transform: 'rotate(-2deg)' }}>
              ✨ {t("solutionPage.hero.badge") || "Din kompletta lösning"}
            </Badge>
            <svg className="absolute inset-0 w-full h-full -z-10 pointer-events-none" viewBox="0 0 150 50">
              <ellipse cx="75" cy="25" rx="73" ry="23" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.2" />
            </svg>
          </div>
          
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight animate-in fade-in duration-700 delay-100">
            {t("solutionPage.hero.title1")}
            <br />
            <span className="gradient-text relative inline-block">
              {t("solutionPage.hero.title2")}
              <svg className="absolute -bottom-4 left-0 w-full h-4" viewBox="0 0 400 12" preserveAspectRatio="none">
                <path d="M0 6 Q 100 2, 200 6 T 400 6" stroke="hsl(var(--primary))" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4" />
              </svg>
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto animate-in fade-in duration-700 delay-200">
            {t("solutionPage.hero.description")}
          </p>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 animate-in fade-in duration-700 delay-300">
            <div className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold">4.9/5</span>
              <span className="text-muted-foreground">(500+ recensioner)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
              <span className="font-semibold">98%</span>
              <span className="text-muted-foreground">nöjda kunder</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section - More Human */}
      <section className="relative container mx-auto px-4 py-20 bg-gradient-to-b from-muted/30 to-background overflow-hidden">
        {/* Playful decoration */}
        <div className="absolute top-10 right-20 text-muted/20 hidden lg:block">
          <span className="text-6xl">😰</span>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 relative">
            <div className="inline-block relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block">
                🤔 {t("solutionPage.problem.title")}
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("solutionPage.problem.subtitle")}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[0, 1, 2].map((index) => (
              <Card 
                key={index}
                className="border-2 glass-card hover:border-accent/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl group cursor-pointer animate-in fade-in duration-500"
                style={{ animationDelay: `${index * 100}ms`, transform: `rotate(${index % 2 === 0 ? '-1deg' : '1deg'})` }}
              >
                <CardHeader>
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    {index === 0 ? "⏰" : index === 1 ? "💸" : "😓"}
                  </div>
                  <CardTitle className="text-xl group-hover:text-accent transition-colors">
                    {t(`solutionPage.problem.cards.${index}.title`)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t(`solutionPage.problem.cards.${index}.description`)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Fun fact */}
          <div className="mt-12 text-center">
            <div className="inline-block bg-accent/5 border-2 border-accent/20 rounded-2xl px-8 py-4" style={{ transform: 'rotate(-1deg)' }}>
              <p className="text-sm font-medium">
                💡 <span className="text-accent font-bold">Visste du att</span> företag i genomsnitt spenderar <span className="text-primary font-bold">15+ timmar/vecka</span> på marknadsföring?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("solutionPage.howItWorks.title")}</h2>
            <p className="text-lg text-muted-foreground">
              {t("solutionPage.howItWorks.subtitle")}
            </p>
          </div>

          <div className="space-y-16">
            {/* Step 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-bold mb-4">
                  {t("solutionPage.howItWorks.step1.badge")}
                </div>
                <h3 className="text-3xl font-bold mb-4 flex items-center gap-3">
                  <MapPin className="h-8 w-8 text-accent" />
                  {t("solutionPage.howItWorks.step1.title")}
                </h3>
                <p className="text-lg text-muted-foreground mb-6">
                  {t("solutionPage.howItWorks.step1.description")}
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground">{t("solutionPage.howItWorks.step1.features.0")}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground">{t("solutionPage.howItWorks.step1.features.1")}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground">{t("solutionPage.howItWorks.step1.features.2")}</span>
                  </li>
                </ul>
              </div>
              <div className="order-1 md:order-2">
                <div className="glass-card p-8 rounded-2xl border-2 border-accent/20 premium-glow hover:scale-105 transition-all">
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent/10 rounded-full blur-2xl" />
                    <Bell className="h-16 w-16 text-accent mb-4 mx-auto relative animate-pulse" />
                  </div>
                  <p className="text-center text-muted-foreground">
                    {t("solutionPage.howItWorks.step1.card")}
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="glass-card p-8 rounded-2xl border-2 border-accent/20 premium-glow hover:scale-105 transition-all">
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent/10 rounded-full blur-2xl" />
                    <Sparkles className="h-16 w-16 text-accent mb-4 mx-auto relative animate-pulse" />
                  </div>
                  <p className="text-center text-muted-foreground">
                    {t("solutionPage.howItWorks.step2.card")}
                  </p>
                </div>
              </div>
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-bold mb-4">
                  {t("solutionPage.howItWorks.step2.badge")}
                </div>
                <h3 className="text-3xl font-bold mb-4 flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-accent" />
                  {t("solutionPage.howItWorks.step2.title")}
                </h3>
                <p className="text-lg text-muted-foreground mb-6">
                  {t("solutionPage.howItWorks.step2.description")}
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground">{t("solutionPage.howItWorks.step2.features.0")}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground">{t("solutionPage.howItWorks.step2.features.1")}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground">{t("solutionPage.howItWorks.step2.features.2")}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-bold mb-4">
                  {t("solutionPage.howItWorks.step3.badge")}
                </div>
                <h3 className="text-3xl font-bold mb-4 flex items-center gap-3">
                  <BarChart className="h-8 w-8 text-accent" />
                  {t("solutionPage.howItWorks.step3.title")}
                </h3>
                <p className="text-lg text-muted-foreground mb-6">
                  {t("solutionPage.howItWorks.step3.description")}
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground">{t("solutionPage.howItWorks.step3.features.0")}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground">{t("solutionPage.howItWorks.step3.features.1")}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground">{t("solutionPage.howItWorks.step3.features.2")}</span>
                  </li>
                </ul>
              </div>
              <div className="order-1 md:order-2">
                <div className="glass-card p-8 rounded-2xl border-2 border-accent/20 premium-glow hover:scale-105 transition-all">
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent/10 rounded-full blur-2xl" />
                    <Target className="h-16 w-16 text-accent mb-4 mx-auto relative animate-pulse" />
                  </div>
                  <p className="text-center text-muted-foreground">
                    {t("solutionPage.howItWorks.step3.card")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section - Animated Stats */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-accent/5 to-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-primary/30 bg-primary/5 px-6 py-2 mb-6" style={{ transform: 'rotate(1deg)' }}>
              📊 Resultat som talar för sig själva
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ✨ {t("solutionPage.benefits.title")}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center p-8 border-2 glass-card hover:border-accent/50 transition-all duration-300 hover:scale-110 premium-glow group cursor-pointer" style={{ transform: 'rotate(-1deg)' }}>
              <div className="text-6xl mb-4">🚀</div>
              <div className="text-5xl font-bold gradient-text mb-3 group-hover:scale-110 transition-transform">
                <AnimatedCounter end={40} suffix="%" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">{t("solutionPage.benefits.stats.0")}</p>
            </Card>
            
            <Card className="text-center p-8 border-2 glass-card hover:border-accent/50 transition-all duration-300 hover:scale-110 premium-glow group cursor-pointer">
              <div className="text-6xl mb-4">⚡</div>
              <div className="text-5xl font-bold gradient-text mb-3 group-hover:scale-110 transition-transform">
                <AnimatedCounter end={15} suffix="min" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">{t("solutionPage.benefits.stats.1")}</p>
            </Card>
            
            <Card className="text-center p-8 border-2 glass-card hover:border-accent/50 transition-all duration-300 hover:scale-110 premium-glow group cursor-pointer" style={{ transform: 'rotate(1deg)' }}>
              <div className="text-6xl mb-4">📈</div>
              <div className="text-5xl font-bold gradient-text mb-3 group-hover:scale-110 transition-transform">
                <AnimatedCounter end={3} suffix="x" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">{t("solutionPage.benefits.stats.2")}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-primary/30 bg-primary/5 px-6 py-2 mb-6" style={{ transform: 'rotate(-1deg)' }}>
              💬 Hör vad kunderna säger
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ❤️ Älskade av företag i hela Sverige
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index}
                className="glass-card border-2 hover:border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{ transform: `rotate(${index % 2 === 0 ? '-1deg' : '1deg'})` }}
              >
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                    />
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="border-primary/30 bg-primary/5 px-6 py-2 mb-6">
              🧮 Räkna ut din potential
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Hur mycket kan <span className="gradient-text">DU</span> tjäna? 💰
            </h2>
            <p className="text-lg text-muted-foreground">
              Se din potentiella ROI med Spotlight
            </p>
          </div>
          
          <ROICalculator />
        </div>
      </section>

      {/* CTA Section - More Playful */}
      <section className="relative container mx-auto px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-accent/5 -z-10" />
        
        {/* Celebration decorations */}
        <div className="absolute top-10 left-10 text-6xl animate-bounce hidden lg:block" style={{ animationDelay: '0.5s' }}>
          🎉
        </div>
        <div className="absolute top-20 right-20 text-6xl animate-bounce hidden lg:block" style={{ animationDelay: '1s' }}>
          🎊
        </div>
        <div className="absolute bottom-10 left-20 text-6xl animate-bounce hidden lg:block" style={{ animationDelay: '1.5s' }}>
          ✨
        </div>
        
        <div className="max-w-4xl mx-auto text-center space-y-8 glass-card p-12 rounded-3xl border-2 premium-glow-lg relative" style={{ transform: 'rotate(-0.5deg)' }}>
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-4xl md:text-5xl font-bold">
            {t("solutionPage.cta.title1")} <span className="gradient-text">{t("solutionPage.cta.title2")}</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("solutionPage.cta.description")}
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Ingen bindningstid</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>14 dagar gratis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Support på svenska</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              variant="animated"
              size="xl"
              asChild
              className="group"
            >
              <Link to="/auth">
                {t("solutionPage.cta.buttons.start")}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button 
              variant="animatedOutline"
              size="xl"
              asChild
              className="group"
            >
              <Link to="/contact">
                {t("solutionPage.cta.buttons.contact")}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
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
