import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GlobalHeader } from "@/components/GlobalHeader";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SkeletonCaseStudyCard, SkeletonHero } from "@/components/ui/skeleton-card";
import { caseStudies, getCaseStudyById, type CaseStudy } from "@/data/caseStudiesData";
import { ArrowRight, Building2, MapPin, TrendingUp, Target, Lightbulb, CheckCircle2, Quote, Star, Award, Rocket, Heart, Sparkles } from "lucide-react";
import { TrustBadges } from "@/components/TrustBadges";
import { AnimatedCounter } from "@/components/AnimatedCounter";

const CaseStudyCard = ({ study, index = 0 }: { study: CaseStudy; index?: number }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as 'sv' | 'en';
  const isEven = index % 2 === 0;
  
  return (
  <Card 
    className="group hover-lift hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 hover:border-primary/50 premium-glow animate-in fade-in"
    style={{ 
      animationDelay: `${index * 100}ms`,
      transform: `rotate(${isEven ? '-0.5deg' : '0.5deg'})`
    }}
  >
    <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary-glow/10 relative overflow-hidden hover-zoom-image">
      <img 
        src={study.heroImage} 
        alt={study.company}
        className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-all duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
      <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground hover-glow transition-all duration-300 hover:scale-105">
        {study.industry[currentLang]}
      </Badge>
      <div className="absolute top-4 right-4 text-3xl animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>
        {index === 0 ? "🏆" : index === 1 ? "⭐" : "🚀"}
      </div>
    </div>
    <CardHeader className="pb-3">
      <CardTitle className="text-2xl group-hover:text-primary transition-colors duration-300 leading-tight">
        {study.title[currentLang]}
      </CardTitle>
      <CardDescription className="text-base leading-relaxed">
        {study.subtitle[currentLang]}
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1 hover:text-foreground transition-colors duration-300">
          <Building2 className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
          <span className="font-medium">{study.company}</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1 hover:text-foreground transition-colors duration-300">
          <MapPin className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
          <span>{study.location}</span>
        </div>
      </div>
      
      {/* Results - Outside card, more readable */}
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4">
          {study.results.slice(0, 2).map((result, idx) => (
            <div key={idx} className="text-center transition-all duration-300 hover:scale-105">
              <div className="text-3xl font-bold gradient-text mb-1">
                {result.value}
              </div>
              <div className="text-xs text-foreground font-medium leading-tight">
                {result.metric[currentLang]}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Link to={`/case-studies/${study.id}`}>
        <Button variant="animatedOutline" className="w-full group-hover:scale-105 transition-transform duration-300">
          {t("caseStudiesReadFull")}
          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </Link>
    </CardContent>
  </Card>
  );
};

const CaseStudyDetail = ({ study }: { study: CaseStudy }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as 'sv' | 'en';
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      });

      document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        observer.observe(el);
      });

      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${study.title[currentLang]} - Spotlight Case Study`}
        description={study.subtitle[currentLang]}
        keywords={`case study, ${study.industry[currentLang]}, event marketing, ${study.company}`}
      />
      <GlobalHeader />

      {isLoading ? (
        <div className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <SkeletonHero />
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Hero Section - More Playful */}
          <section className="relative py-20 lg:py-32 overflow-hidden animate-fade-in">
            {/* Doodle decorations */}
            <div className="absolute top-10 left-10 text-primary/10 hidden lg:block animate-float" style={{ transform: 'rotate(-20deg)' }}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                <path d="M20 40 Q40 20, 60 40 T100 40" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                <circle cx="40" cy="25" r="5" fill="currentColor" />
              </svg>
            </div>
            <div className="absolute bottom-20 right-10 text-accent/10 hidden lg:block animate-float" style={{ animationDelay: '1s', transform: 'rotate(15deg)' }}>
              <svg width="60" height="60" viewBox="0 0 60 60">
                <rect x="15" y="15" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="5,5" />
              </svg>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary-glow/5" />
            <div className="container relative mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <div className="inline-block relative">
                  <Badge className="px-6 py-2 text-base" style={{ transform: 'rotate(-2deg)' }}>
                    {study.industry[currentLang]}
                  </Badge>
                  <svg className="absolute inset-0 w-full h-full -z-10 pointer-events-none" viewBox="0 0 150 50">
                    <ellipse cx="75" cy="25" rx="73" ry="23" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.2" />
                  </svg>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="gradient-text relative inline-block">
                    {study.title[currentLang]}
                    <svg className="absolute -bottom-4 left-0 w-full h-4" viewBox="0 0 600 12" preserveAspectRatio="none">
                      <path d="M0 6 Q 150 2, 300 6 T 600 6" stroke="hsl(var(--primary))" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4" />
                    </svg>
                  </span>
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  {study.subtitle[currentLang]}
                </p>
                
                <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <span className="font-medium">{study.company}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>{study.location}</span>
                  </div>
                </div>
                
                {/* Trust indicators */}
                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                    <Award className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Verifierad case study</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
                    <Star className="h-4 w-4 text-blue-500 fill-blue-500" />
                    <span className="text-sm font-medium">Verkliga resultat</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

    {/* Results Section - More Readable */}
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-on-scroll">
              Resultat som <span className="gradient-text">imponerar</span> 🎯
            </h2>
            <p className="text-lg text-muted-foreground">
              Detta är vad {study.company} uppnådde med Spotlight
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {study.results.map((result, idx) => (
              <Card 
                key={idx} 
                className="text-center border-2 hover:border-primary/50 transition-all duration-500 hover-lift hover:shadow-2xl group animate-on-scroll premium-glow" 
                style={{ 
                  animationDelay: `${idx * 100}ms`,
                  transform: `rotate(${idx % 2 === 0 ? '-0.5deg' : '0.5deg'})`
                }}
              >
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="text-5xl mb-3 transition-transform duration-300 group-hover:scale-110">
                    {idx === 0 ? "🚀" : idx === 1 ? "💰" : idx === 2 ? "📈" : "⭐"}
                  </div>
                  <div className="text-5xl font-bold gradient-text mb-3 transition-transform duration-300 group-hover:scale-110">
                    {result.value}
                  </div>
                  <div className="text-base font-bold mb-2 text-foreground transition-colors duration-300 group-hover:text-primary">
                    {result.metric[currentLang]}
                  </div>
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    {result.description[currentLang]}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Challenge Section - More Human */}
    <section className="py-20 animate-on-scroll">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center hover:scale-110 transition-transform">
              <Target className="h-7 w-7 text-primary hover-glow transition-all duration-300" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">🎯 {t("caseStudiesChallenge")}</h2>
              <p className="text-sm text-muted-foreground">Vad var problemet?</p>
            </div>
          </div>
          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all p-8" style={{ transform: 'rotate(-0.5deg)' }}>
            <p className="text-lg text-foreground leading-relaxed">
              {study.challenge[currentLang]}
            </p>
          </Card>
        </div>
      </div>
    </section>

    <Separator className="max-w-4xl mx-auto" />

    {/* Solution Section - More Human */}
    <section className="py-20 animate-on-scroll">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center hover:scale-110 transition-transform">
              <Lightbulb className="h-7 w-7 text-accent hover-glow transition-all duration-300" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">💡 {t("caseStudiesSolution")}</h2>
              <p className="text-sm text-muted-foreground">Hur löste vi det?</p>
            </div>
          </div>
          <Card className="border-2 border-accent/20 hover:border-accent/40 transition-all p-8" style={{ transform: 'rotate(0.5deg)' }}>
            <p className="text-lg text-foreground leading-relaxed">
              {study.solution[currentLang]}
            </p>
          </Card>
        </div>
      </div>
    </section>

    {/* Implementation Section - More Visual */}
    <section className="py-20 bg-gradient-to-b from-accent/5 to-background animate-on-scroll">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-12 text-center justify-center">
            <div className="text-6xl">📋</div>
            <div>
              <h2 className="text-3xl font-bold">
                <TrendingUp className="h-7 w-7 text-primary inline mr-2" />
                {t("caseStudiesImplementation")}
              </h2>
              <p className="text-sm text-muted-foreground">Så här gick det till</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {study.implementation[currentLang].map((step, idx) => (
              <Card 
                key={idx} 
                className="border-l-4 border-l-primary hover:shadow-xl transition-all duration-300 hover:translate-x-2 p-6"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-primary">{idx + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg text-foreground leading-relaxed">{step}</p>
                  </div>
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1 transition-all duration-300 hover:scale-125 hover:rotate-12" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Testimonial Section - More Festive */}
    <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/5 animate-on-scroll">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-3xl font-bold mb-2">
              Vad säger kunden? 🎤
            </h2>
            <p className="text-muted-foreground">Äkta feedback från riktiga människor</p>
          </div>
          
          <Card className="border-2 border-primary/30 overflow-hidden hover-lift transition-all duration-500 premium-glow" style={{ transform: 'rotate(-0.5deg)' }}>
            <CardContent className="p-8 md:p-12 relative">
              <Quote className="absolute top-8 left-8 h-24 w-24 text-primary/10 rotate-slow" />
              <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                
                <p className="text-xl md:text-2xl font-medium leading-relaxed text-center">
                  "{study.testimonial.quote[currentLang]}"
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 border-t border-border/50">
                  <div className="h-20 w-20 rounded-full bg-primary/10 overflow-hidden hover-zoom-image ring-4 ring-primary/20">
                    <img 
                      src={study.testimonial.image} 
                      alt={study.testimonial.author}
                      className="w-full h-full object-cover transition-transform duration-500"
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="font-bold text-xl hover:text-primary transition-colors duration-300 mb-1">
                      {study.testimonial.author}
                    </div>
                    <div className="text-muted-foreground text-base">
                      {study.testimonial.role[currentLang]}
                    </div>
                    <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                      <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                      <span className="text-sm text-muted-foreground">Verifierad kund</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    {/* Key Takeaways Section - More Readable */}
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">💡</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Viktiga <span className="gradient-text">lärdomar</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Detta kan du lära dig från detta case
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {study.keyTakeaways[currentLang].map((takeaway, idx) => (
              <Card 
                key={idx} 
                className="border-2 border-l-4 border-l-accent hover:border-accent/50 hover:shadow-xl transition-all duration-300 hover:scale-105" 
                style={{ transform: `rotate(${idx % 2 === 0 ? '-0.5deg' : '0.5deg'})` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-accent" />
                    </div>
                    <p className="text-foreground leading-relaxed font-medium">{takeaway}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* CTA Section - More Festive */}
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      
      {/* Celebration decorations */}
      <div className="absolute top-10 left-10 text-6xl animate-bounce hidden lg:block" style={{ animationDelay: '0.5s' }}>
        🎉
      </div>
      <div className="absolute top-20 right-20 text-6xl animate-bounce hidden lg:block" style={{ animationDelay: '1s' }}>
        🚀
      </div>
      <div className="absolute bottom-10 left-1/4 text-6xl animate-bounce hidden lg:block" style={{ animationDelay: '1.5s' }}>
        ⭐
      </div>
      
      <div className="container relative mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8 glass-card p-12 rounded-3xl border-2 premium-glow-lg" style={{ transform: 'rotate(-0.5deg)' }}>
          <div className="text-6xl mb-4">💪</div>
          
          <h2 className="text-3xl md:text-4xl font-bold">
            {t("caseStudiesCtaTitle")}
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("caseStudiesCtaDesc")}
          </p>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>14 dagar gratis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Ingen bindningstid</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Support på svenska</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/auth">
              <Button size="xl" variant="animated" className="group">
                {t("caseStudiesCtaBtn1")}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/case-studies">
              <Button size="xl" variant="animatedOutline">
                {t("caseStudiesCtaBtn2")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>

        <TrustBadges />
        <Footer />
        </>
      )}
    </div>
  );
};

const CaseStudiesOverview = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      });

      document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        observer.observe(el);
      });

      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${t("caseStudies")} - Spotlight`}
        description={t("caseStudiesHeroDesc")}
        keywords="case studies, success stories, event marketing, ROI, kundberättelser"
      />
      <GlobalHeader />

      {isLoading ? (
        <>
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <SkeletonHero />
              </div>
            </div>
          </section>
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {[1, 2, 3].map((i) => (
                  <SkeletonCaseStudyCard key={i} />
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Hero Section - More Playful */}
          <section className="relative py-20 lg:py-32 overflow-hidden animate-fade-in">
            {/* Doodle decorations */}
            <div className="absolute top-10 left-10 text-primary/10 hidden lg:block animate-float" style={{ transform: 'rotate(-15deg)' }}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="30" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="5,5" />
                <path d="M25 40 L55 40 M40 25 L40 55" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <div className="absolute bottom-20 right-10 text-accent/10 hidden lg:block animate-float" style={{ animationDelay: '1s', transform: 'rotate(20deg)' }}>
              <svg width="60" height="60" viewBox="0 0 60 60">
                <path d="M10 30 Q30 10, 50 30 T90 30" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary-glow/5" />
            <div className="container relative mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <div className="inline-block relative">
                  <Badge className="px-6 py-2 text-base" style={{ transform: 'rotate(-2deg)' }}>
                    {t("caseStudiesBadge")}
                  </Badge>
                  <svg className="absolute inset-0 w-full h-full -z-10 pointer-events-none" viewBox="0 0 200 50">
                    <ellipse cx="100" cy="25" rx="98" ry="23" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.2" />
                  </svg>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="gradient-text relative inline-block">
                    {t("caseStudiesHero")}
                    <svg className="absolute -bottom-4 left-0 w-full h-4" viewBox="0 0 600 12" preserveAspectRatio="none">
                      <path d="M0 6 Q 150 2, 300 6 T 600 6" stroke="hsl(var(--primary))" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4" />
                    </svg>
                  </span>
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  {t("caseStudiesHeroDesc")}
                </p>
                
                {/* Trust indicators */}
                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                    <Rocket className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">{caseStudies.length} Success Stories</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
                    <Star className="h-4 w-4 text-blue-500 fill-blue-500" />
                    <span className="text-sm font-medium">Verifierade resultat</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
                    <Heart className="h-4 w-4 text-purple-500 fill-purple-500" />
                    <span className="text-sm font-medium">Riktiga kunder</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

      {/* Case Studies Grid */}
      <section className="py-20 bg-gradient-to-b from-muted/20 to-background animate-fade-in">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-5xl mb-4">📚</div>
            <h2 className="text-3xl font-bold mb-4">
              Utforska våra <span className="gradient-text">framgångshistorier</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Lär dig från riktiga företag som lyckats med Spotlight
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {caseStudies.map((study, index) => (
              <CaseStudyCard key={study.id} study={study} index={index} />
            ))}
          </div>
        </div>
      </section>

    {/* CTA Section */}
    <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-primary-glow/10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            {t("caseStudiesOverviewCtaTitle")}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t("caseStudiesOverviewCtaDesc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/auth">
              <Button size="xl" variant="animated">
                {t("caseStudiesCtaBtn1")}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="xl" variant="animatedOutline">
                {t("caseStudiesContactUs")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>

      <TrustBadges />
      <Footer />
      </>
      )}
    </div>
  );
};

const CaseStudies = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  
  if (id) {
    const study = getCaseStudyById(id);
    if (!study) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">{t("caseStudiesNotFound")}</h1>
            <Link to="/case-studies">
              <Button>{t("caseStudiesBackBtn")}</Button>
            </Link>
          </div>
        </div>
      );
    }
    return <CaseStudyDetail study={study} />;
  }

  return <CaseStudiesOverview />;
};

export default CaseStudies;
