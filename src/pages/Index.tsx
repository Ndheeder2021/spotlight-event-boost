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
      
      // Send purchase confirmation email
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (session?.user) {
          try {
            const { data: subData } = await supabase.functions.invoke('check-subscription');
            const planName = subData?.product_id?.includes('starter') ? 'Starter' : 'Professional';
            const amount = subData?.product_id?.includes('starter') ? '$29/månad' : '$49/månad';
            
            await supabase.functions.invoke('send-purchase-email', {
              body: {
                email: session.user.email,
                name: session.user.user_metadata?.business_name || session.user.email?.split('@')[0] || 'där',
                planName,
                amount,
                billingPeriod: 'Månatlig'
              }
            });
          } catch (error) {
            console.error("Failed to send purchase email:", error);
          }
        }
      });
      
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

  const handleOnboardingComplete = async () => {
    setNeedsOnboarding(false);
    setNeedsSubscription(true);
    
    // Send welcome email
    try {
      const session = await supabase.auth.getSession();
      if (session.data.session?.user) {
        await supabase.functions.invoke('send-welcome-email', {
          body: {
            email: session.data.session.user.email,
            name: session.data.session.user.user_metadata?.business_name || session.data.session.user.email?.split('@')[0] || 'där'
          }
        });
      }
    } catch (error) {
      console.error("Failed to send welcome email:", error);
      // Don't block the flow if email fails
    }
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
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Zap className="h-6 w-6 text-accent" fill="currentColor" />
            <span className="text-xl font-bold">Spotlight</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Priser
            </Link>
            <Link to="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Kontakt
            </Link>
            <LanguageSwitch />
            <ThemeToggle />
            <Button 
              onClick={() => {
                setAuthMode("login");
                setShowAuthDialog(true);
              }}
              variant="outline"
            >
              Logga in
            </Button>
            <Button 
              onClick={() => {
                setAuthMode("signup");
                setShowAuthDialog(true);
              }}
              className="bg-accent hover:bg-accent-dark text-accent-foreground"
            >
              Kom igång
            </Button>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitch />
            <ThemeToggle />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 mt-8">
                  <Link to="/pricing" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Priser
                  </Link>
                  <Link to="/contact" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Kontakt
                  </Link>
                  <Button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAuthMode("login");
                      setShowAuthDialog(true);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Logga in
                  </Button>
                  <Button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAuthMode("signup");
                      setShowAuthDialog(true);
                    }}
                    className="bg-accent hover:bg-accent-dark text-accent-foreground w-full"
                  >
                    Kom igång
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        
        <div className="container relative mx-auto px-4 sm:px-6 pt-20 lg:pt-32 pb-20 lg:pb-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
              Förvandla lokala <span className="text-accent">evenemang</span> till ökad försäljning
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              AI-driven plattform som automatiskt upptäcker närliggande evenemang och skapar datadrivna kampanjer för ditt företag.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg"
                onClick={() => {
                  setAuthMode("signup");
                  setShowAuthDialog(true);
                }}
                className="h-14 px-8 text-lg bg-accent hover:bg-accent-dark text-accent-foreground"
              >
                Kom igång gratis
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-6 justify-center pt-4">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-accent" />
                <span className="text-sm">Ingen bindningstid</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-accent" />
                <span className="text-sm">14 dagar gratis</span>
              </div>
            </div>
          </div>

          <div className="pt-16 border-t mt-16">
            <p className="text-center text-lg mb-8">
              <span className="font-semibold">500+</span> företag får fler kunder med Spotlight
            </p>
            <LogoCarousel />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Varför välja Spotlight?</h2>
            <p className="text-xl text-muted-foreground">Allt du behöver för att skapa framgångsrika kampanjer</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Bell className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Automatisk eventbevakning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Vi övervakar kontinuerligt lokala evenemang och notifierar dig när relevanta möjligheter dyker upp.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>AI-genererade kampanjer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Vår AI skapar skräddarsydda kampanjtexter baserade på ditt företag och evenemanget.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-chart-3/10 flex items-center justify-center mb-4">
                  <BarChart className="h-6 w-6 text-chart-3" />
                </div>
                <CardTitle>ROI-tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Följ resultat i realtid och optimera dina kampanjer för maximal avkastning.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Vad våra kunder säger</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((t, i) => (
              <Card key={i} className="border-2">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="h-5 w-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-lg mb-6">"{t.content}"</p>
                  <div className="border-t pt-4">
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Transparenta priser</h2>
            <p className="text-xl text-muted-foreground mb-8">14 dagars gratis provperiod. Ingen bindningstid.</p>

            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={`text-lg font-medium ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>Månadsvis</span>
              <Switch checked={isYearly} onCheckedChange={setIsYearly} />
              <span className={`text-lg font-medium ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>Årsvis</span>
              {isYearly && <span className="px-3 py-1 rounded-full text-sm font-semibold bg-accent/10 text-accent">Spara 20%</span>}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card key={plan.name} className={`relative ${plan.popular ? 'border-accent border-2 shadow-xl' : 'border-2'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-accent text-accent-foreground text-sm font-bold rounded-full">MEST POPULÄR</span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="pt-6">
                    <div className="text-5xl font-bold mb-2">
                      {isYearly ? (plan.yearlyPrice || plan.monthlyPrice) : plan.monthlyPrice}
                    </div>
                    {plan.monthlyPrice !== "Kontakta oss" && (
                      <div className="text-sm text-muted-foreground">{isYearly ? "per år" : "per månad"}</div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((f, i) => (
                    <div key={i} className="flex items-start gap-3 opacity-40">
                      <X className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{f}</span>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => {
                      setAuthMode("signup");
                      setShowAuthDialog(true);
                    }}
                    className={`w-full h-12 ${plan.popular ? 'bg-accent hover:bg-accent-dark text-accent-foreground' : ''}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.name === "Enterprise" ? "Kontakta oss" : "Kom igång gratis"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Vanliga frågor</h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="bg-card border-2 rounded-lg px-6">
                  <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Börja växa ditt företag idag</h2>
            <p className="text-xl text-muted-foreground mb-10">
              Gå med i hundratals företag som använder Spotlight för att skapa framgångsrika kampanjer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg"
                onClick={() => {
                  setAuthMode("signup");
                  setShowAuthDialog(true);
                }}
                className="h-14 px-8 text-lg bg-accent hover:bg-accent-dark text-accent-foreground"
              >
                Kom igång gratis
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/contact')}
                className="h-14 px-8 text-lg"
              >
                Kontakta oss
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 justify-center">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-accent" />
                <span>14 dagars gratis</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-accent" />
                <span>Ingen bindningstid</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-accent" />
                <span>Inget kreditkort behövs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

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
              {authMode === "login" ? "Logga in på ditt konto" : "Skapa ett nytt konto"}
            </DialogDescription>
          </DialogHeader>
          <AuthForm initialMode={authMode || "login"} onSuccess={handleAuthSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;

