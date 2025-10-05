import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { AuthForm } from "@/components/AuthForm";
import { OnboardingForm } from "@/components/OnboardingForm";
import { Zap, TrendingUp, Bell, BarChart, Check, X, Star, Users, Target, ArrowRight } from "lucide-react";
import { Session, User } from "@supabase/supabase-js";

const testimonials = [
  {
    name: "Anna Svensson",
    role: "Ägare, Café Bröd & Salt",
    content: "Spotlight har ökat vår försäljning med 40% under lokala evenemang. Vi vet alltid när det händer något i området och kan snabbt sätta igång kampanjer.",
    rating: 5,
  },
  {
    name: "Erik Lundberg",
    role: "Marknadsansvarig, Restaurant Smak",
    content: "AI-funktionen sparar oss timmar varje vecka. Kampanjerna känns personliga och träffsäkra. Bästa investeringen vi gjort!",
    rating: 5,
  },
  {
    name: "Maria Andersson",
    role: "VD, Urban Bar & Grill",
    content: "Professionell, användarvänlig och resultatrik. Vi har fördubblat vårt antal kampanjer utan att öka arbetstiden.",
    rating: 5,
  },
];

const stats = [
  { value: "500+", label: "Nöjda företag" },
  { value: "10,000+", label: "Kampanjer skapade" },
  { value: "40%", label: "Genomsnittlig försäljningsökning" },
  { value: "15min", label: "Sparad tid per kampanj" },
];

const plans = [
  {
    name: "Starter",
    monthlyPrice: "299 kr",
    yearlyPrice: "3 229 kr",
    yearlyDiscount: "10% rabatt",
    description: "Perfekt för små företag som vill komma igång",
    features: [
      "Spara kampanjer till databasen",
      "Grundläggande kampanjvy",
      "Redigera kampanjförslag",
      "Upp till 10 kampanjer"
    ],
    notIncluded: [
      "PDF-export",
      "Dela kampanjer",
      "Analytics & ROI-tracking",
      "AI-genererade visuella mockups"
    ]
  },
  {
    name: "Professional",
    monthlyPrice: "499 kr",
    yearlyPrice: "3 592 kr",
    yearlyDiscount: "40% rabatt",
    description: "För växande företag med högre ambitioner",
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
      "Obegränsat antal kampanjer"
    ],
    notIncluded: [
      "Dedikerad support"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    monthlyPrice: "Kontakta oss",
    yearlyPrice: null,
    yearlyDiscount: null,
    description: "För stora organisationer med specialbehov",
    features: [
      "Alla Professional-funktioner",
      "Dedikerad support",
      "Anpassade integrationer",
      "White-label lösning",
      "Avancerad rollhantering",
      "SLA-garantier"
    ],
    notIncluded: []
  }
];

const faqs = [
  {
    question: "Vad är Spotlight?",
    answer: "Spotlight är en AI-driven plattform som hjälper lokala företag att upptäcka närliggande evenemang och automatiskt skapa marknadsföringskampanjer för att dra nytta av det ökade kundflödet."
  },
  {
    question: "Hur fungerar det?",
    answer: "Vi övervakar kontinuerligt lokala evenemang i ditt område och skickar notifieringar när relevanta evenemang hittas. Du kan sedan använda vår AI för att generera kampanjtext eller skapa egna kampanjer. Allt i en enkel dashboard."
  },
  {
    question: "Vilka typer av evenemang täcker ni?",
    answer: "Vi täcker allt från konserter, sportevenemang, festivaler, mässor till kulturella evenemang. Vår databas uppdateras kontinuerligt med nya evenemang från olika källor."
  },
  {
    question: "Kan jag testa Spotlight gratis?",
    answer: "Ja! Vi erbjuder en 14-dagars gratis testperiod där du får full tillgång till alla funktioner i din valda plan. Inget kreditkort krävs för att komma igång."
  },
  {
    question: "Hur avbokar jag mitt abonnemang?",
    answer: "Du kan när som helst avboka ditt abonnemang från inställningar i din dashboard. Abonnemanget fortsätter till slutet av din betalningsperiod."
  },
  {
    question: "Kan jag byta plan senare?",
    answer: "Absolut! Du kan uppgradera eller nedgradera din plan när som helst. Ändringar träder i kraft omedelbart och vi justerar faktureringen proportionellt."
  }
];

const Index = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isYearly, setIsYearly] = useState(false);

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    featuresSection?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll animations
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    });

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [loading]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      checkProfile(session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkProfile = async (user: User | null | undefined) => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("locations")
        .select("name")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      if (!data?.name || data.name === "My Business") {
        setNeedsOnboarding(true);
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setNeedsOnboarding(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      checkProfile(session?.user);
    });
  };

  const handleOnboardingComplete = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex items-center gap-2">
          <Zap className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">Spotlight</span>
        </div>
      </div>
    );
  }

  if (user && needsOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <OnboardingForm userId={user.id} onComplete={handleOnboardingComplete} />
        </div>
      </div>
    );
  }

  if (user) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" fill="currentColor" />
            <span className="text-xl font-bold">Spotlight</span>
          </div>
          <Button onClick={() => setShowAuthDialog(true)}>
            Logga in
          </Button>
        </div>
      </header>

      {/* Hero Section with Premium Gradient */}
      <section className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-background to-background pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-glow" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container relative mx-auto px-4 py-24 md:py-32 text-center">
          <div className="max-w-4xl mx-auto space-y-8 animate-on-scroll">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <Star className="h-4 w-4 text-accent fill-accent" />
              <span className="text-sm font-medium">Lita på av 500+ lokala företag</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              Förvandla lokala evenemang till{" "}
              <span className="gradient-text">ökad försäljning</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Spotlight hjälper ditt företag att automatiskt upptäcka närliggande evenemang och skapa effektiva marknadsföringskampanjer för att dra nytta av det ökade kundflödet.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button size="lg" className="text-lg px-8 h-14 shadow-premium hover:shadow-glow transition-all duration-300" onClick={() => setShowAuthDialog(true)}>
                Kom igång gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 h-14" onClick={scrollToFeatures}>
                Se hur det fungerar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16 animate-on-scroll">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Varför välja Spotlight?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Vi ger dig verktygen för att ligga steget före konkurrenterna och maximera din försäljning vid lokala evenemang.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="glass-card hover:shadow-premium transition-all duration-300 animate-on-scroll group">
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bell className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-xl">Smarta Notifieringar</CardTitle>
              <CardDescription>
                Få varningar om relevanta evenemang i ditt område automatiskt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Vi övervakar kontinuerligt lokala evenemang och meddelar dig när det finns möjligheter att nå fler kunder.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-premium transition-all duration-300 animate-on-scroll group">
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-xl">AI-genererade Kampanjer</CardTitle>
              <CardDescription>
                Skapa professionella kampanjer på sekunder
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Vår AI hjälper dig att skapa engagerande marknadsföringstext anpassad för varje evenemang och din målgrupp.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-premium transition-all duration-300 animate-on-scroll group">
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-xl">Detaljerad Analys</CardTitle>
              <CardDescription>
                Följ resultat och optimera dina kampanjer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Se vilka kampanjer som fungerar bäst och få insikter för att kontinuerligt förbättra dina resultat.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative container mx-auto px-4 py-20">
        <div className="text-center mb-12 animate-on-scroll">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Välj rätt plan för ditt företag</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Alla planer inkluderar 14 dagars gratis testperiod. Inget kreditkort krävs.
          </p>
          
          {/* Pricing Toggle */}
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
              <span className="px-2 py-0.5 bg-accent/20 text-accent text-xs font-bold rounded-full">
                Spara upp till 40%
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name} 
              className={`glass-card hover:shadow-premium transition-all duration-300 animate-on-scroll ${
                plan.popular ? "border-2 border-accent shadow-glow scale-105" : ""
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.popular && (
                <div className="bg-gradient-to-r from-accent to-accent-glow text-primary-foreground text-center py-2 text-sm font-bold">
                  MEST POPULÄR
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                <div className="pt-6 space-y-2">
                  {isYearly && plan.yearlyPrice ? (
                    <>
                      <div>
                        <span className="text-5xl font-bold">{plan.yearlyPrice.split(' ')[0]}</span>
                        <span className="text-muted-foreground text-lg ml-1">/år</span>
                      </div>
                      {plan.yearlyDiscount && (
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-bold">
                          💰 {plan.yearlyDiscount}
                        </div>
                      )}
                      <div className="text-sm text-muted-foreground">
                        {Math.round(parseInt(plan.yearlyPrice.replace(/\D/g, '')) / 12)} kr/månad
                      </div>
                    </>
                  ) : (
                    <div>
                      <span className="text-5xl font-bold">{plan.monthlyPrice.split(' ')[0]}</span>
                      <span className="text-muted-foreground text-lg ml-1">
                        {plan.monthlyPrice === "Kontakta oss" ? "" : "/månad"}
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature) => (
                    <div key={feature} className="flex items-start gap-3 text-muted-foreground/60">
                      <X className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full h-12 text-base font-medium" 
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => setShowAuthDialog(true)}
                >
                  {plan.monthlyPrice === "Kontakta oss" ? "Kontakta oss" : "Starta gratis test"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Vad våra kunder säger</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Över 500 lokala företag litar på Spotlight för att öka sin försäljning
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="glass-card hover:shadow-premium transition-all duration-300 animate-on-scroll">
              <CardHeader>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-accent fill-accent" />
                  ))}
                </div>
                <CardDescription className="text-base leading-relaxed text-foreground">
                  "{testimonial.content}"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Vanliga frågor</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hittar du inte svar på din fråga? Kontakta oss gärna!
          </p>
        </div>

        <div className="max-w-3xl mx-auto animate-on-scroll">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="glass-card rounded-lg px-6 border-0">
                <AccordionTrigger className="text-left font-medium hover:no-underline text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8 relative overflow-hidden rounded-3xl p-12 md:p-16 animate-on-scroll">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-background to-background" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/30 rounded-full blur-3xl animate-glow" />
          
          <div className="relative z-10 space-y-6">
            <Target className="h-16 w-16 text-accent mx-auto" />
            <h2 className="text-4xl md:text-5xl font-bold">
              Redo att öka din försäljning?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Gå med 500+ företag som redan använder Spotlight för att dra nytta av lokala evenemang.
            </p>
            <Button 
              size="lg" 
              className="text-lg px-10 h-14 shadow-premium hover:shadow-glow transition-all duration-300" 
              onClick={() => setShowAuthDialog(true)}
            >
              Kom igång idag - helt gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Spotlight. Alla rättigheter reserverade.
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <Button variant="link" className="text-sm text-muted-foreground h-auto p-0" asChild>
                <a href="/privacy">Integritetspolicy</a>
              </Button>
              <Button variant="link" className="text-sm text-muted-foreground h-auto p-0" asChild>
                <a href="/gdpr">GDPR</a>
              </Button>
              <Button variant="link" className="text-sm text-muted-foreground h-auto p-0" asChild>
                <a href="/terms">Användarvillkor</a>
              </Button>
              <Button variant="link" className="text-sm text-muted-foreground h-auto p-0" asChild>
                <a href="/cookies">Cookies</a>
              </Button>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Spotlight
            </DialogTitle>
            <DialogDescription>
              Logga in eller skapa ett konto för att komma igång
            </DialogDescription>
          </DialogHeader>
          <AuthForm onSuccess={handleAuthSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
