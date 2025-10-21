import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { OnboardingForm } from "@/components/OnboardingForm";
import { PlanSelector } from "@/components/PlanSelector";
import { Footer } from "@/components/Footer";
import { GlobalHeader } from "@/components/GlobalHeader";
import { LogoCarousel } from "@/components/LogoCarousel";
import { SEO } from "@/components/SEO";
import { SkipToContent } from "@/components/SkipToContent";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { LiveChatSupport } from "@/components/LiveChatSupport";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { InteractiveProductTour } from "@/components/InteractiveProductTour";
import { StickyCTABar } from "@/components/StickyCTABar";
import { ROICalculator } from "@/components/ROICalculator";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { AnimatedHeroBackground } from "@/components/AnimatedHeroBackground";
import { TrustBadges } from "@/components/TrustBadges";
import { Zap, TrendingUp, Bell, BarChart, Check, X, Star, Users, Target, ArrowRight, HelpCircle, Sparkles } from "lucide-react";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";
import reviewAnna from "@/assets/review-anna.jpg";
import reviewErik from "@/assets/review-erik.jpg";
import reviewMaria from "@/assets/review-maria.jpg";
import featureAnalytics from "@/assets/feature-analytics-new.png";
import featureAiCampaign from "@/assets/feature-ai-campaign-new.png";
import featureEvents from "@/assets/feature-event-radar-new.png";

const testimonials = [
  {
    name: "Anna Svensson",
    role: "Ägare, Café Bröd & Salt",
    content: "Spotlight har ökat vår försäljning med 40% under lokala evenemang. Vi vet alltid när det händer något i området och kan snabbt sätta igång kampanjer.",
    rating: 5,
    image: reviewAnna,
  },
  {
    name: "Erik Lundberg",
    role: "Marknadsansvarig, Restaurant Smak",
    content: "AI-funktionen sparar oss timmar varje vecka. Kampanjerna känns personliga och träffsäkra. Bästa investeringen vi gjort!",
    rating: 5,
    image: reviewErik,
  },
  {
    name: "Maria Andersson",
    role: "VD, Urban Bar & Grill",
    content: "Professionell, användarvänlig och resultatrik. Vi har fördubblat vårt antal kampanjer utan att öka arbetstiden.",
    rating: 5,
    image: reviewMaria,
  },
];

const featureShowcase = [
  {
    title: "Kraftfull Analytics",
    description: "Följ dina kampanjers prestanda i realtid med detaljerade insikter och ROI-tracking.",
    image: featureAnalytics,
  },
  {
    title: "AI-Driven Kampanjer",
    description: "Låt AI skapa skräddarsydda kampanjer baserade på lokala evenemang och din målgrupp.",
    image: featureAiCampaign,
  },
  {
    title: "Event Discovery",
    description: "Upptäck automatiskt alla relevanta lokala evenemang i ditt område.",
    image: featureEvents,
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
    monthlyPrice: "$29",
    yearlyPrice: "$329",
    yearlyDiscount: "Spara $19",
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
    monthlyPrice: "$49",
    yearlyPrice: "$359",
    yearlyDiscount: "Spara 40%",
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
    answer: "Vi övervakar kontinuerligt lokala evenemang i ditt området och skickar notifieringar när relevanta evenemang hittas. Du kan sedan använda vår AI för att generera professionell kampanjtext eller skapa egna kampanjer. Allt samlas i en enkel och intuitiv dashboard."
  },
  {
    question: "Vilka typer av evenemang täcker ni?",
    answer: "Vi täcker allt från konserter, sportevenemang, festivaler, mässor till kulturella evenemang och lokala aktiviteter. Vår databas uppdateras kontinuerligt med nya evenemang från olika källor."
  },
  {
    question: "Kan jag testa Spotlight gratis?",
    answer: "Ja! Vi erbjuder en 14-dagars gratis testperiod där du får full tillgång till alla funktioner i din valda plan. Inget kreditkort krävs för att starta testperioden."
  },
  {
    question: "Hur avbokar jag mitt abonnemang?",
    answer: "Du kan när som helst avboka ditt abonnemang från inställningar i din dashboard. Abonnemanget fortsätter till slutet av din betalningsperiod, och du behåller tillgång till alla funktioner fram till dess."
  },
  {
    question: "Kan jag byta plan senare?",
    answer: "Absolut! Du kan uppgradera eller nedgradera din plan när som helst. Ändringar träder i kraft omedelbart och vi justerar faktureringen proportionellt."
  },
  {
    question: "Hur exakt är event-upptäckten?",
    answer: "Vår AI-drivna teknologi söker igenom flera datakällor och filtrerar evenemang baserat på din plats och bransch. Vi har en noggrannhet på över 95% och uppdaterar händelser i realtid."
  },
  {
    question: "Kan jag använda Spotlight för flera platser?",
    answer: "Ja, på Professional och Enterprise-planerna kan du övervaka evenemang för flera platser samtidigt. Detta är perfekt för företag med flera verksamheter."
  },
  {
    question: "Hur hanteras mina kampanjer?",
    answer: "Du kan spara, redigera, dela och exportera dina kampanjer. På Professional-planen får du även tillgång till PDF-export, delning via lösenordsskyddade länkar och möjlighet att skicka kampanjer direkt via email."
  },
  {
    question: "Är mina data säkra?",
    answer: "Ja, vi tar datasäkerhet på största allvar. All data krypteras både vid överföring och lagring. Vi följer GDPR och lagrar data i säkra datacenter i EU. Du äger alltid dina egna data."
  },
  {
    question: "Vilken support får jag?",
    answer: "Alla planer inkluderar email-support. Professional-planen får tillgång till AI Live Support för snabbare svar. Enterprise-kunder får dedikerad support med garanterad svarstid."
  },
  {
    question: "Kan jag integrera Spotlight med andra verktyg?",
    answer: "Ja! Vi erbjuder integrationer med populära marknadsföringsverktyg, CRM-system och sociala medier. Enterprise-planen inkluderar även anpassade integrationer för dina specifika behov."
  }
];

const Index = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [needsSubscription, setNeedsSubscription] = useState(false);
  const [loading, setLoading] = useState(true);
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
      <StickyCTABar />
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
            "priceCurrency": "USD",
            "lowPrice": "29",
            "highPrice": "49"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5",
            "ratingCount": "3"
          }
        }}
      />

      <GlobalHeader />

      {/* Hero Section - Instantly.ai Style */}
      <section className="relative overflow-hidden bg-background">
        <AnimatedHeroBackground />
        <div className="container relative mx-auto px-4 sm:px-6 pt-32 lg:pt-40 pb-24 lg:pb-32 z-10">
          <div className="max-w-5xl mx-auto text-center space-y-12">
            <div className="space-y-8">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight">
                Förvandla lokala evenemang till{" "}
                <span className="text-primary">försäljning</span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                AI-driven plattform som automatiskt upptäcker evenemang och skapar kampanjer
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link to="/auth">
                <Button 
                  variant="animated"
                  size="xl"
                >
                  Kom igång gratis 
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <InteractiveProductTour />
            </div>
            
            {/* Live Stats Counter */}
            <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 justify-center pt-12">
              <div className="flex flex-col items-center gap-2">
                <div className="text-4xl sm:text-5xl font-bold text-primary">
                  <AnimatedCounter end={2547} suffix="+" />
                </div>
                <div className="text-sm sm:text-base text-muted-foreground">
                  Företag använder Spotlight
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <div className="text-4xl sm:text-5xl font-bold text-primary">
                  <AnimatedCounter end={12349} suffix="+" />
                </div>
                <div className="text-sm sm:text-base text-muted-foreground">
                  Kampanjer skapade denna månad
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <div className="text-4xl sm:text-5xl font-bold text-primary">
                  <AnimatedCounter end={98} suffix="%" />
                </div>
                <div className="text-sm sm:text-base text-muted-foreground">
                  Kundnöjdhet
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-8 justify-center pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Ingen bindningstid</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>14 dagar gratis</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Social Proof */}
      <section className="py-16 border-y">
        <div className="container mx-auto px-4 sm:px-6">
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Över <span className="font-semibold text-foreground">500+ företag</span> använder Spotlight
          </p>
          <LogoCarousel />
        </div>
      </section>

      {/* Feature Showcase with Images */}
      <section className="py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-bold mb-6">Allt du behöver på ett ställe</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Kraftfulla verktyg för moderna marknadsförare
            </p>
          </div>

          <div className="space-y-32 max-w-7xl mx-auto">
            {featureShowcase.map((feature, index) => (
              <div 
                key={index} 
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <h3 className="text-4xl font-bold">{feature.title}</h3>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  <Link to="/auth">
                    <Button 
                      variant="animated"
                      size="xl"
                    >
                      Läs mer 
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="rounded-2xl overflow-hidden border shadow-2xl">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-auto"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Features Grid */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Bell className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Automatisk bevakning</h3>
              <p className="text-muted-foreground leading-relaxed">
                Vi övervakar kontinuerligt lokala evenemang och notifierar dig omedelbart.
              </p>
            </div>

            <div className="space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">AI-kampanjer</h3>
              <p className="text-muted-foreground leading-relaxed">
                Skräddarsydda kampanjtexter genererade av avancerad AI-teknologi.
              </p>
            </div>

            <div className="space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <BarChart className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">ROI-tracking</h3>
              <p className="text-muted-foreground leading-relaxed">
                Följ resultat i realtid och optimera för maximal avkastning.
              </p>
            </div>
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

      {/* Comparison Tables */}
      <section className="py-24 bg-gradient-to-b from-background via-accent/5 to-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto space-y-16">
            {/* Spotlight vs Traditional Marketing */}
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <Badge variant="outline" className="border-primary/30 bg-primary/5">
                  Jämförelse
                </Badge>
                <h2 className="text-4xl sm:text-5xl font-bold">
                  Spotlight vs Traditionell Marknadsföring
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Se skillnaden mellan manuellt arbete och AI-driven automation
                </p>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-[600px] bg-card border rounded-2xl shadow-lg overflow-hidden">
                  <div className="grid grid-cols-3">
                    <div className="p-6 bg-accent/30 border-b border-r">
                      <h3 className="font-semibold text-lg">Funktion</h3>
                    </div>
                    <div className="p-6 bg-primary/5 border-b border-r">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        Spotlight
                      </h3>
                    </div>
                    <div className="p-6 bg-accent/10 border-b">
                      <h3 className="font-semibold text-lg text-muted-foreground">
                        Traditionell marknadsföring
                      </h3>
                    </div>
                  </div>

                  {[
                    {
                      feature: "Hitta relevanta evenemang",
                      spotlight: "Automatisk bevakning 24/7",
                      traditional: "Manuell sökning varje vecka"
                    },
                    {
                      feature: "Skapa kampanjtext",
                      spotlight: "AI-genererad på 60 sekunder",
                      traditional: "2-4 timmar per kampanj"
                    },
                    {
                      feature: "Analytics & ROI",
                      spotlight: "Real-time dashboard",
                      traditional: "Manuell uppföljning i Excel"
                    },
                    {
                      feature: "A/B-testning",
                      spotlight: "Inbyggt & automatiserat",
                      traditional: "Svårt och tidskrävande"
                    },
                    {
                      feature: "Kostnad per månad",
                      spotlight: "Från €29",
                      traditional: "€500+ (timkostnad)"
                    }
                  ].map((row, index) => (
                    <div key={index} className="grid grid-cols-3">
                      <div className="p-4 border-b border-r bg-background">
                        <p className="font-medium">{row.feature}</p>
                      </div>
                      <div className="p-4 border-b border-r bg-primary/5">
                        <div className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <p className="text-sm">{row.spotlight}</p>
                        </div>
                      </div>
                      <div className="p-4 border-b bg-accent/10">
                        <div className="flex items-start gap-2">
                          <X className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-muted-foreground">{row.traditional}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Spotlight vs Competitors */}
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-4xl sm:text-5xl font-bold">
                  Spotlight vs Konkurrenter
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Varför våra kunder väljer oss
                </p>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-[600px] bg-card border rounded-2xl shadow-lg overflow-hidden">
                  <div className="grid grid-cols-3">
                    <div className="p-6 bg-accent/30 border-b border-r">
                      <h3 className="font-semibold text-lg">Funktion</h3>
                    </div>
                    <div className="p-6 bg-primary/5 border-b border-r">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        Spotlight
                      </h3>
                    </div>
                    <div className="p-6 bg-accent/10 border-b">
                      <h3 className="font-semibold text-lg text-muted-foreground">
                        Konkurrent
                      </h3>
                    </div>
                  </div>

                  {[
                    {
                      feature: "AI-genererad kampanjtext",
                      spotlight: true,
                      competitor: false
                    },
                    {
                      feature: "Automatisk eventbevakning",
                      spotlight: true,
                      competitor: true
                    },
                    {
                      feature: "Real-time analytics",
                      spotlight: true,
                      competitor: false
                    },
                    {
                      feature: "A/B-testning",
                      spotlight: true,
                      competitor: false
                    },
                    {
                      feature: "Flerspråksstöd",
                      spotlight: true,
                      competitor: false
                    },
                    {
                      feature: "PDF-export",
                      spotlight: true,
                      competitor: true
                    },
                    {
                      feature: "14 dagars gratis trial",
                      spotlight: true,
                      competitor: false
                    },
                    {
                      feature: "Startpris/månad",
                      spotlight: "€29",
                      competitor: "€79"
                    }
                  ].map((row, index) => (
                    <div key={index} className="grid grid-cols-3">
                      <div className="p-4 border-b border-r bg-background">
                        <p className="font-medium text-sm">{row.feature}</p>
                      </div>
                      <div className="p-4 border-b border-r bg-primary/5">
                        <div className="flex items-center justify-center">
                          {typeof row.spotlight === 'boolean' ? (
                            row.spotlight ? (
                              <Check className="h-6 w-6 text-primary" />
                            ) : (
                              <X className="h-6 w-6 text-muted-foreground" />
                            )
                          ) : (
                            <span className="font-semibold text-primary">{row.spotlight}</span>
                          )}
                        </div>
                      </div>
                      <div className="p-4 border-b bg-accent/10">
                        <div className="flex items-center justify-center">
                          {typeof row.competitor === 'boolean' ? (
                            row.competitor ? (
                              <Check className="h-6 w-6 text-muted-foreground/50" />
                            ) : (
                              <X className="h-6 w-6 text-muted-foreground/30" />
                            )
                          ) : (
                            <span className="text-sm text-muted-foreground">{row.competitor}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center pt-8">
                <Link to="/auth">
                  <Button variant="animated" size="xl">
                    Prova Spotlight gratis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <ROICalculator />

      {/* Reviews with Real Photos */}
      <section className="py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-bold mb-6">Kundberättelser</h2>
            <p className="text-xl text-muted-foreground">Se vad våra kunder tycker</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((t, i) => (
              <Card key={i} className="border hover:shadow-xl transition-shadow">
                <CardContent className="pt-8 pb-8">
                  <div className="flex gap-1 mb-6">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-lg mb-8 leading-relaxed text-foreground">
                    "{t.content}"
                  </p>
                  <div className="flex items-center gap-4 pt-6 border-t">
                    <img 
                      src={t.image} 
                      alt={t.name}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-foreground">{t.name}</p>
                      <p className="text-sm text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - Instantly.ai Style */}
      <section className="py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              Enkla och transparenta priser
            </h2>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Välj den plan som passar ditt företag bäst. Ingen bindningstid, avbryt när som helst.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 mb-16">
            <span className={`text-lg font-medium transition-colors ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Månadsvis
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={`text-lg font-medium transition-colors ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Årsvis
            </span>
            {isYearly && (
              <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-primary/10 text-primary">
                Spara 20%
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
                      Mest populär
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
                    {plan.monthlyPrice !== "Kontakta oss" && (
                      <span className="text-muted-foreground text-lg">
                        /{isYearly ? "år" : "mån"}
                      </span>
                    )}
                  </div>
                  {isYearly && plan.yearlyDiscount && (
                    <p className="text-sm text-primary font-medium mt-2">{plan.yearlyDiscount}</p>
                  )}
                </div>

                <div className="space-y-4 mb-8">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    Inkluderat:
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

                {plan.name === "Enterprise" ? (
                  <Link to="/contact" className="w-full">
                    <Button 
                      variant="animatedOutline"
                      className="w-full"
                      size="xl"
                    >
                      Kontakta oss
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </Link>
                ) : (
                  <Link to="/auth" className="w-full">
                    <Button 
                      variant={plan.popular ? "animated" : "animatedOutline"}
                      className="w-full"
                      size="xl"
                    >
                      Starta gratis
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-muted-foreground">
              Alla planer inkluderar 14 dagars gratis provperiod
            </p>
          </div>
        </div>
      </section>

      {/* FAQ - Enhanced with Animations */}
      <section className="py-32 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-20 animate-on-scroll">
            <Badge className="mb-6 text-base px-4 py-2">FAQ</Badge>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              Vanliga frågor
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Allt du behöver veta om Spotlight. Hittar du inte svaret du söker? Kontakta oss gärna!
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem 
                  key={i} 
                  value={`item-${i}`} 
                  className="bg-card border-2 border-border rounded-2xl px-8 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover-lift animate-on-scroll group"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <AccordionTrigger className="text-left text-xl font-semibold hover:no-underline py-7 transition-colors duration-300 group-hover:text-primary">
                    <div className="flex items-start gap-4">
                      <HelpCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                      <span className="pr-4">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-lg text-muted-foreground pb-7 pl-10 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* CTA for more help */}
            <div className="mt-16 text-center p-8 bg-gradient-to-br from-primary/5 to-primary-glow/5 rounded-2xl border-2 border-primary/20 animate-on-scroll">
              <h3 className="text-2xl font-bold mb-3">Har du fler frågor?</h3>
              <p className="text-muted-foreground mb-6">
                Vårt supportteam är här för att hjälpa dig. Tveka inte att höra av dig!
              </p>
              <Link to="/contact">
                <Button size="lg" variant="animated">
                  Kontakta support
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Instantly.ai Style */}
      <section className="py-32 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto text-center space-y-14">
            <div className="space-y-8">
              <h2 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-[1.1]">
                Börja idag
              </h2>
              <p className="text-2xl sm:text-3xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Gå med i hundratals företag som redan ökar sin försäljning med Spotlight
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center pt-6">
              <Link to="/auth">
                <Button 
                  variant="animated"
                  size="xl"
                >
                  Starta gratis 
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button 
                variant="animatedOutline"
                size="xl"
                onClick={() => navigate('/contact')}
              >
                Kontakta oss
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 justify-center pt-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <span className="text-base text-muted-foreground">14 dagars gratis provperiod</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <span className="text-base text-muted-foreground">Ingen bindningstid</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <span className="text-base text-muted-foreground">Inget kreditkort behövs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Få event marketing tips varje vecka
            </h2>
            <p className="text-lg text-muted-foreground">
              Få insikter, strategier och tips direkt i din inkorg. Gratis.
            </p>
            <NewsletterSignup />
            <p className="text-sm text-muted-foreground">
              Vi respekterar din integritet. Avsluta prenumerationen när som helst.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      <Footer />
      
      {/* Live Chat Support */}
      <LiveChatSupport />
      
      {/* Exit Intent Popup */}
      <ExitIntentPopup />
    </div>
  );
};

export default Index;

