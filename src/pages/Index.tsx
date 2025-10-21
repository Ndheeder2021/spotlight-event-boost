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
import { PlanSelector } from "@/components/PlanSelector";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { LogoCarousel } from "@/components/LogoCarousel";
import { SEO } from "@/components/SEO";
import { SkipToContent } from "@/components/SkipToContent";
import { Zap, TrendingUp, Bell, BarChart, Check, X, Star, Users, Target, ArrowRight, HelpCircle, Sparkles, Menu } from "lucide-react";
import { Session, User } from "@supabase/supabase-js";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";

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
  const [needsSubscription, setNeedsSubscription] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);
  const [isYearly, setIsYearly] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    // Check for successful checkout
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('checkout') === 'success') {
      toast.success("Tack för din betalning! Din 14-dagars provperiod har startat.");
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    return () => subscription.unsubscribe();
  }, []);

  const checkProfile = async (user: User | null | undefined) => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Check if profile exists
      const { data: locationData, error: locationError } = await supabase
        .from("locations")
        .select("name")
        .eq("id", user.id)
        .single();

      if (locationError) throw locationError;

      if (!locationData?.name || locationData.name === "My Business") {
        setNeedsOnboarding(true);
        setLoading(false);
        return;
      }

      // Check subscription status
      const { data: subData, error: subError } = await supabase.functions.invoke('check-subscription');
      
      if (subError) {
        console.error("Subscription check error:", subError);
        setNeedsSubscription(true);
        setLoading(false);
        return;
      }

      if (!subData?.subscribed) {
        setNeedsSubscription(true);
        setLoading(false);
        return;
      }

      // Everything is good, redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Profile check error:", error);
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
    setNeedsOnboarding(false);
    setNeedsSubscription(true);
  };

  const handleSubscriptionComplete = () => {
    setNeedsSubscription(false);
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

  if (user && needsSubscription) {
    return <PlanSelector onSuccess={handleSubscriptionComplete} />;
  }

  if (user) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <SkipToContent />
      <SEO
        title="Spotlight - AI-Driven Event Marketing för Lokala Företag"
        description="Förvandla lokala evenemang till ökad försäljning med AI. Spotlight hjälper dig automatiskt upptäcka närliggande evenemang och skapa datadrivna kampanjer som maximerar ditt kundflöde."
        keywords="event marketing, AI marknadsföring, lokala evenemang, kampanjverktyg, automatiserad marknadsföring"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Spotlight",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "SEK",
            "lowPrice": "299",
            "highPrice": "499"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5",
            "ratingCount": "3"
          }
        }}
      />
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 z-50">
        <div className="container mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Zap className="h-6 w-6 sm:h-7 sm:w-7 text-accent" fill="currentColor" />
            <span className="text-xl sm:text-2xl font-bold gradient-text">Spotlight</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <a href="/contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Kontakt
            </a>
            <LanguageSwitch />
            <ThemeToggle />
            <Button 
              onClick={() => {
                setAuthMode("login");
                setShowAuthDialog(true);
              }}
              variant="outline"
              size="lg"
            >
              Logga in
            </Button>
            <Button 
              onClick={() => {
                setAuthMode("signup");
                setShowAuthDialog(true);
              }}
              size="lg"
              className="premium-glow bg-gradient-to-r from-accent to-accent-glow hover:opacity-90 transition-all"
            >
              Kom igång →
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitch />
            <ThemeToggle />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  aria-label="Öppna meny"
                  className="h-11 w-11"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col gap-2 mt-8 mobile-stack">
                  <Link
                    to="/contact" 
                    className="mobile-menu-item text-lg font-medium text-muted-foreground hover:text-primary transition-colors px-3 py-3 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Kontakt
                  </Link>
                  <Button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAuthMode("login");
                      setShowAuthDialog(true);
                    }}
                    variant="outline"
                    size="lg"
                    className="w-full h-12"
                  >
                    Logga in
                  </Button>
                  <Button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAuthMode("signup");
                      setShowAuthDialog(true);
                    }}
                    size="lg"
                    className="premium-glow bg-gradient-to-r from-accent to-accent-glow hover:opacity-90 transition-all w-full h-12"
                  >
                    Kom igång →
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Section with Premium Gradient */}
      <section id="main-content" className="relative overflow-hidden bg-gradient-to-b from-background via-background to-accent/5">
        {/* Grid Pattern Background */}
        <div className="absolute inset-0 grid-pattern opacity-30" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse premium-glow" />
          <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="container relative mx-auto px-6 py-32 md:py-40">
          <div className="max-w-5xl mx-auto">
            {/* Badge */}
            <div className="flex justify-center mb-10 animate-on-scroll">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card/80 backdrop-blur-xl border border-accent/30 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                <Sparkles className="h-5 w-5 text-accent fill-accent animate-pulse" />
                <span className="text-sm font-semibold gradient-text">
                  Få 40% mer kunder vid lokala evenemang
                </span>
              </div>
            </div>
            
            {/* Main Heading with Questions */}
            <div className="text-center space-y-8 animate-on-scroll">
              <div className="space-y-4 mb-8">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-muted-foreground">
                  Vill du{" "}
                  <span className="text-foreground gradient-text">öka omsättningen med 40%</span>
                  {" "}vid nästa stora event?
                </h2>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-muted-foreground">
                  Vill du{" "}
                  <span className="text-foreground gradient-text">aldrig missa ett tillfälle</span>
                  {" "}att attrahera nya kunder?
                </h2>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-display tracking-tight leading-[1.05]">
                <span className="relative inline-block">
                  <span className="gradient-text">Spotlight</span>
                  <div className="absolute -bottom-3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
                </span>
                {" "}gör det möjligt
              </h1>
              
              <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light">
                Låt vår <span className="text-foreground font-semibold">AI automatiskt</span> upptäcka närliggande evenemang och skapa <span className="text-foreground font-semibold">kampanjer som konverterar</span> – medan du fokuserar på dina gäster.
              </p>

              {/* Urgency element */}
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-destructive/10 border border-destructive/30 mt-6">
                <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                <span className="text-sm font-semibold text-destructive">
                  Över 50 företag startade denna vecka – missa inte nästa event!
                </span>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-12 animate-on-scroll">
              <Button 
                size="lg" 
                className="text-base sm:text-lg px-8 sm:px-12 h-14 sm:h-16 shadow-2xl hover:shadow-accent/50 transition-all duration-300 hover:scale-105 bg-gradient-to-r from-accent via-accent-glow to-accent text-primary-foreground font-semibold premium-glow-lg" 
                onClick={() => {
                  setAuthMode("signup");
                  setShowAuthDialog(true);
                }}
              >
                <Zap className="mr-2 h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" />
                Starta gratis – 14 dagar
                <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-base sm:text-lg px-8 sm:px-12 h-14 sm:h-16 border-2 border-border hover:bg-accent/10 hover:border-accent transition-all duration-300 hover:scale-105 backdrop-blur-xl bg-card/50 font-semibold" 
                onClick={scrollToFeatures}
              >
                Se hur det fungerar
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-10 mt-20 pt-10 border-t border-border/50 animate-on-scroll">
              <div className="flex items-center gap-3 text-muted-foreground group hover:text-foreground transition-colors">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Check className="h-5 w-5 text-accent" />
                </div>
                <span className="text-base font-medium">Ingen bindningstid</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground group hover:text-foreground transition-colors">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Check className="h-5 w-5 text-accent" />
                </div>
                <span className="text-base font-medium">14 dagar gratis</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground group hover:text-foreground transition-colors">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Check className="h-5 w-5 text-accent" />
                </div>
                <span className="text-base font-medium">Inget kreditkort krävs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Carousel */}
      <LogoCarousel />

      {/* Problem/Pain Point Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-accent/5 to-background py-24">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="container relative mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 animate-on-scroll">
              <div className="inline-block px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 mb-6">
                <span className="text-sm font-semibold text-destructive">Sluta förlora kunder</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Varje evenemang du missar är{" "}
                <span className="gradient-text">pengar du förlorar</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Medan dina konkurrenter aktivt marknadsför sig vid lokala evenemang, försvinner potentiella kunder förbi din dörr.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12 animate-on-scroll">
              <Card className="border-destructive/20 bg-card/80 backdrop-blur-xl hover:scale-105 transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <X className="h-6 w-6" />
                    Utan Spotlight
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    <X className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                    Missar 80% av lokala evenemang
                  </p>
                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    <X className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                    Spenderar timmar på att skapa kampanjer manuellt
                  </p>
                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    <X className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                    Ingen koll på vad som faktiskt fungerar
                  </p>
                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    <X className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                    Konkurrenterna tar dina kunder
                  </p>
                </CardContent>
              </Card>

              <Card className="border-accent/50 bg-gradient-to-br from-accent/5 to-accent/10 backdrop-blur-xl hover:scale-105 transition-all md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-accent">
                    <Check className="h-6 w-6" />
                    Med Spotlight
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-3">
                    <p className="text-sm flex items-start gap-2">
                      <Check className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                      <span><strong>Automatisk övervakning</strong> av alla lokala evenemang 24/7</span>
                    </p>
                    <p className="text-sm flex items-start gap-2">
                      <Check className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                      <span><strong>AI skapar kampanjer</strong> på 30 sekunder</span>
                    </p>
                    <p className="text-sm flex items-start gap-2">
                      <Check className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                      <span><strong>Detaljerad analytics</strong> visar exakt vad som fungerar</span>
                    </p>
                    <p className="text-sm flex items-start gap-2">
                      <Check className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                      <span><strong>40% mer kunder</strong> vid varje evenemang</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center animate-on-scroll">
              <Button 
                size="lg" 
                className="text-lg px-12 h-16 shadow-2xl hover:shadow-accent/50 transition-all duration-300 hover:scale-105 bg-gradient-to-r from-accent via-accent-glow to-accent text-primary-foreground font-semibold premium-glow-lg" 
                onClick={() => {
                  setAuthMode("signup");
                  setShowAuthDialog(true);
                }}
              >
                <Zap className="mr-2 h-6 w-6" fill="currentColor" />
                Sluta förlora kunder – Starta nu
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Ingen bindningstid • 14 dagar gratis • Inget kreditkort
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-24 animate-on-scroll">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center space-y-4 p-8 rounded-3xl hover:bg-accent/5 transition-all duration-300 hover:scale-105 group border border-transparent hover:border-accent/20"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-6xl md:text-7xl font-bold text-primary group-hover:gradient-text-animated group-hover:scale-110 transition-all duration-300 font-display drop-shadow-sm">
                {stat.value}
              </div>
              <div className="text-base md:text-lg text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative container mx-auto px-4 py-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background" />
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative z-10">
          <div className="text-center mb-20 animate-on-scroll">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30 mb-6 shadow-lg backdrop-blur-sm">
              <Sparkles className="h-5 w-5 text-accent fill-accent animate-pulse" />
              <span className="text-sm font-bold gradient-text">Våra Kraftfulla Funktioner</span>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 font-display">
              Varför välja <span className="gradient-text">Spotlight</span>?
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Vi ger dig verktygen för att <span className="text-foreground font-semibold">ligga steget före konkurrenterna</span> och maximera din försäljning vid lokala evenemang.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <Card className="group relative overflow-hidden bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-xl border-2 border-accent/20 hover:border-accent/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 animate-on-scroll">
              {/* Card Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="relative z-10">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-accent/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                  <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-accent via-accent-glow to-accent/80 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Bell className="h-10 w-10 text-primary-foreground" />
                  </div>
                </div>
                <CardTitle className="text-2xl md:text-3xl mb-4 group-hover:gradient-text transition-all duration-300">
                  Smarta Notifieringar
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Få varningar om relevanta evenemang i ditt område automatiskt
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Vi övervakar kontinuerligt lokala evenemang och meddelar dig när det finns möjligheter att nå fler kunder.
                </p>
                <div className="mt-6 pt-6 border-t border-accent/20">
                  <div className="flex items-center gap-2 text-accent font-semibold text-sm">
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    Aldrig missa ett tillfälle
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-xl border-2 border-accent/20 hover:border-accent/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 animate-on-scroll" style={{ animationDelay: '100ms' }}>
              {/* Premium Badge */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-accent/20 backdrop-blur-sm border border-accent/30 z-20">
                <span className="text-xs font-bold text-accent">AI-DRIVEN</span>
              </div>
              
              {/* Card Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="relative z-10">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-accent/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                  <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-accent via-accent-glow to-accent/80 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <TrendingUp className="h-10 w-10 text-primary-foreground" />
                  </div>
                </div>
                <CardTitle className="text-2xl md:text-3xl mb-4 group-hover:gradient-text transition-all duration-300">
                  AI-genererade Kampanjer
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Skapa professionella kampanjer på 30 sekunder
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Vår AI hjälper dig att skapa engagerande marknadsföringstext anpassad för varje evenemang och din målgrupp.
                </p>
                <div className="mt-6 pt-6 border-t border-accent/20">
                  <div className="flex items-center gap-2 text-accent font-semibold text-sm">
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    Spara timmar varje vecka
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-xl border-2 border-accent/20 hover:border-accent/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 animate-on-scroll" style={{ animationDelay: '200ms' }}>
              {/* Card Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="relative z-10">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-accent/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                  <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-accent via-accent-glow to-accent/80 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <BarChart className="h-10 w-10 text-primary-foreground" />
                  </div>
                </div>
                <CardTitle className="text-2xl md:text-3xl mb-4 group-hover:gradient-text transition-all duration-300">
                  Detaljerad Analys
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Följ resultat och optimera dina kampanjer
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Se vilka kampanjer som fungerar bäst och få insikter för att kontinuerligt förbättra dina resultat.
                </p>
                <div className="mt-6 pt-6 border-t border-accent/20">
                  <div className="flex items-center gap-2 text-accent font-semibold text-sm">
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    Maximera din ROI
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Urgency Section - What if you wait? */}
      <section className="relative overflow-hidden bg-gradient-to-b from-destructive/5 via-background to-background py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 animate-on-scroll">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-destructive/10 border border-destructive/30 mb-6">
                <HelpCircle className="h-5 w-5 text-destructive" />
                <span className="text-sm font-semibold text-destructive">Tänk efter innan du stänger denna sida</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Vad händer om du{" "}
                <span className="text-destructive">väntar</span>?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12 animate-on-scroll">
              <Card className="bg-destructive/5 border-destructive/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <X className="h-5 w-5 text-destructive" />
                    Nästa vecka
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Ett stort evenemang händer i ditt område. Dina konkurrenter har redan lagt upp kampanjer. 
                    Du missar <strong className="text-foreground">hundratals potentiella kunder</strong>.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-destructive/5 border-destructive/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <X className="h-5 w-5 text-destructive" />
                    Om en månad
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Festivaler, konserter och sportevenemang har kommit och gått. 
                    <strong className="text-foreground">Tusentals kronor i förlorad omsättning</strong> som du aldrig får tillbaka.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-destructive/5 border-destructive/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <X className="h-5 w-5 text-destructive" />
                    Om tre månader
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Konkurrenterna har byggt upp en lojal kundbas från evenemang du missade. 
                    <strong className="text-foreground">De växer medan du står still</strong>.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-accent/10 border-accent/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-accent">
                    <Check className="h-5 w-5" />
                    Eller... börja idag
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground font-medium">
                    Fånga varje möjlighet. Få varningar om alla lokala evenemang. 
                    Skapa kampanjer på 30 sekunder. <strong>Se din omsättning öka med 40%</strong>.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center space-y-6 animate-on-scroll">
              <Button 
                size="lg" 
                className="text-lg px-12 h-16 shadow-2xl hover:shadow-accent/50 transition-all duration-300 hover:scale-105 bg-gradient-to-r from-accent via-accent-glow to-accent text-primary-foreground font-semibold premium-glow-lg" 
                onClick={() => {
                  setAuthMode("signup");
                  setShowAuthDialog(true);
                }}
              >
                <Target className="mr-2 h-6 w-6" />
                Ja, jag vill inte missa fler tillfällen
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
              <p className="text-sm text-muted-foreground">
                Gå med de <strong className="text-foreground">500+ företag</strong> som redan växer med Spotlight
              </p>
            </div>
          </div>
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
                        <span className="text-5xl font-bold">{plan.yearlyPrice.replace(' kr', '')}</span>
                        <span className="text-muted-foreground text-lg ml-1"> kr/år</span>
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
                  onClick={() => {
                    if (plan.monthlyPrice === "Kontakta oss") {
                      navigate("/contact");
                    } else {
                      setAuthMode("signup");
                      setShowAuthDialog(true);
                    }
                  }}
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
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Star className="h-5 w-5 text-accent fill-accent" />
            <span className="text-sm font-semibold text-accent">Verifierade resultat från riktiga kunder</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Företag som dig får <span className="gradient-text">verkliga resultat</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Över 500 lokala företag litar på Spotlight – se vad de har uppnått
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="glass-card hover:shadow-premium transition-all duration-300 animate-on-scroll group border-2 hover:border-accent/30">
              <CardHeader>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-accent fill-accent" />
                  ))}
                </div>
                <CardDescription className="text-base leading-relaxed text-foreground font-medium">
                  "{testimonial.content}"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
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

        {/* Social Proof Stats */}
        <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-border animate-on-scroll">
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-2">98%</div>
            <div className="text-sm text-muted-foreground">Nöjda kunder</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-2">10,000+</div>
            <div className="text-sm text-muted-foreground">Kampanjer skapade</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-2">500+</div>
            <div className="text-sm text-muted-foreground">Aktiva företag</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-2">15min</div>
            <div className="text-sm text-muted-foreground">Sparad tid/kampanj</div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative container mx-auto px-4 py-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="text-center mb-20 animate-on-scroll">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30 mb-6 shadow-lg backdrop-blur-sm">
              <HelpCircle className="h-5 w-5 text-accent" />
              <span className="text-sm font-bold gradient-text">Vanliga Frågor</span>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-8">
              Frågor & <span className="gradient-text">Svar</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Hittar du inte svar på din fråga? <a href="/contact" className="text-accent hover:text-accent-glow transition-colors font-semibold underline decoration-accent/30 hover:decoration-accent">Kontakta oss gärna!</a>
            </p>
          </div>

          <div className="max-w-4xl mx-auto animate-on-scroll">
            <Accordion type="single" collapsible className="space-y-6">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`} 
                  className="group relative overflow-hidden bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-xl border-2 border-accent/10 hover:border-accent/30 rounded-2xl px-8 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/10 hover:scale-[1.02]"
                >
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <AccordionTrigger className="relative z-10 text-left font-bold hover:no-underline text-base md:text-lg py-8 group-hover:text-accent transition-colors">
                    <div className="flex items-start gap-4 w-full">
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md">
                          <Sparkles className="h-5 w-5 text-accent group-hover:fill-accent transition-all" />
                        </div>
                      </div>
                      <span className="flex-1 leading-relaxed">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="relative z-10 text-muted-foreground leading-relaxed pb-8 pl-14 text-base">
                    <div className="p-6 rounded-xl bg-accent/5 border border-accent/10">
                      {faq.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16 animate-on-scroll">
            <p className="text-lg text-muted-foreground mb-6">
              Fortfarande osäker? Testa gratis i 14 dagar!
            </p>
            <Button 
              size="lg" 
              className="text-base px-10 h-14 shadow-xl hover:shadow-accent/30 transition-all duration-300 hover:scale-105 bg-gradient-to-r from-accent via-accent-glow to-accent text-primary-foreground font-semibold" 
              onClick={() => {
                setAuthMode("signup");
                setShowAuthDialog(true);
              }}
            >
              Kom igång nu
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
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
              onClick={() => {
                setAuthMode("signup");
                setShowAuthDialog(true);
              }}
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
      <Dialog open={showAuthDialog} onOpenChange={(open) => {
        setShowAuthDialog(open);
        if (!open) setAuthMode(null);
      }}>
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
          {!authMode ? (
            <div className="space-y-3 pt-2">
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => setAuthMode("login")}
              >
                Logga in
              </Button>
              <Button 
                className="w-full" 
                variant="outline" 
                size="lg"
                onClick={() => setAuthMode("signup")}
              >
                Skapa konto
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Button 
                variant="ghost" 
                onClick={() => setAuthMode(null)}
                className="px-0"
              >
                ← Tillbaka
              </Button>
              <AuthForm 
                onSuccess={handleAuthSuccess} 
                initialMode={authMode}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
