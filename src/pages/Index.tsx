import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { AuthForm } from "@/components/AuthForm";
import { OnboardingForm } from "@/components/OnboardingForm";
import { Footer } from "@/components/Footer";
import { Zap, TrendingUp, Bell, BarChart, Check, X, Star, Users, Target, ArrowRight, HelpCircle, Sparkles } from "lucide-react";
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
      "AI Live Support",
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
      "AI Live Support",
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

  // Scroll animations - trigger immediately on mount
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
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
    }, 100);

    return () => clearTimeout(timer);
  }, []);

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
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Zap className="h-6 w-6 text-primary" fill="currentColor" />
            <span className="text-xl font-bold">Spotlight</span>
          </Link>
          <div className="flex items-center gap-4">
            <a href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Kontakt
            </a>
            <Button onClick={() => setShowAuthDialog(true)}>
              Logga in
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section with Premium Gradient */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-accent/5 to-background">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="max-w-5xl mx-auto">
            {/* Badge */}
            <div className="flex justify-center mb-8 animate-on-scroll">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/10 border-2 border-accent/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all hover:scale-105">
                <Star className="h-5 w-5 text-accent fill-accent animate-pulse" />
                <span className="text-sm font-semibold bg-gradient-to-r from-accent to-accent-glow bg-clip-text text-transparent">
                  Betrodd av 500+ lokala företag
                </span>
              </div>
            </div>
            
            {/* Main Heading */}
            <div className="text-center space-y-6 animate-on-scroll">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.1]">
                Förvandla lokala
                <br />
                evenemang till{" "}
                <span className="relative inline-block">
                  <span className="gradient-text">ökad försäljning</span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 8 Q50 12, 100 8 T200 8" stroke="currentColor" strokeWidth="3" fill="none" className="text-accent/50" />
                  </svg>
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light">
                Spotlight hjälper ditt företag att <span className="text-foreground font-medium">automatiskt upptäcka</span> närliggande evenemang och <span className="text-foreground font-medium">skapa effektiva kampanjer</span> för att dra nytta av det ökade kundflödet.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-10 animate-on-scroll">
              <Button 
                size="lg" 
                className="text-lg px-10 h-16 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-accent to-accent-glow" 
                onClick={() => setShowAuthDialog(true)}
              >
                <Zap className="mr-2 h-5 w-5" fill="currentColor" />
                Kom igång gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-10 h-16 border-2 hover:bg-accent/10 hover:border-accent transition-all duration-300 hover:scale-105" 
                onClick={scrollToFeatures}
              >
                Se hur det fungerar
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 mt-16 pt-8 border-t border-border/50 animate-on-scroll">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-5 w-5 text-accent" />
                <span className="text-sm">Ingen bindningstid</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-5 w-5 text-accent" />
                <span className="text-sm">14 dagar gratis</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-5 w-5 text-accent" />
                <span className="text-sm">Inget kreditkort krävs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20 animate-on-scroll">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center space-y-3 p-6 rounded-2xl hover:bg-accent/5 transition-all duration-300 hover:scale-105 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-5xl md:text-6xl font-extrabold gradient-text group-hover:scale-110 transition-transform">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-24 bg-gradient-to-b from-background to-accent/5">
        <div className="text-center mb-20 animate-on-scroll">
          <div className="inline-block px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <span className="text-sm font-semibold text-accent">Våra Funktioner</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Varför välja <span className="gradient-text">Spotlight</span>?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Vi ger dig verktygen för att ligga steget före konkurrenterna och maximera din försäljning vid lokala evenemang.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <Card className="glass-card hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-on-scroll group border-2 hover:border-accent/50">
            <CardHeader>
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <Bell className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-2xl mb-3">Smarta Notifieringar</CardTitle>
              <CardDescription className="text-base">
                Få varningar om relevanta evenemang i ditt område automatiskt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Vi övervakar kontinuerligt lokala evenemang och meddelar dig när det finns möjligheter att nå fler kunder.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-on-scroll group border-2 hover:border-accent/50" style={{ animationDelay: '100ms' }}>
            <CardHeader>
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-2xl mb-3">AI-genererade Kampanjer</CardTitle>
              <CardDescription className="text-base">
                Skapa professionella kampanjer på sekunder
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Vår AI hjälper dig att skapa engagerande marknadsföringstext anpassad för varje evenemang och din målgrupp.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-on-scroll group border-2 hover:border-accent/50" style={{ animationDelay: '200ms' }}>
            <CardHeader>
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <BarChart className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-2xl mb-3">Detaljerad Analys</CardTitle>
              <CardDescription className="text-base">
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
      <section className="relative container mx-auto px-4 py-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="text-center mb-16 animate-on-scroll">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-4">
              <HelpCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Vanliga frågor</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 gradient-text">
              Frågor & Svar
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hittar du inte svar på din fråga? <a href="/contact" className="text-primary hover:underline">Kontakta oss gärna!</a>
            </p>
          </div>

          <div className="max-w-3xl mx-auto animate-on-scroll">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`} 
                  className="glass-card rounded-xl px-6 border-0 group hover:shadow-premium transition-all duration-300"
                >
                  <AccordionTrigger className="text-left font-semibold hover:no-underline text-base py-6 group-hover:text-primary transition-colors">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 mt-0.5 text-accent group-hover:text-primary transition-colors flex-shrink-0" />
                      <span>{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-6 pl-8">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
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
      <Footer />

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
