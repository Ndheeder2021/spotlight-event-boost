import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { InteractiveProductTour } from "@/components/InteractiveProductTour";
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


const Plans = ({ t, i18n }: { t: any; i18n: any }) => [
  {
    name: t('planStarterName'),
    monthlyPrice: t('pricingStarterMonthly'),
    yearlyPrice: t('pricingStarterYearly'),
    yearlyDiscount: t('planStarterYearlyDiscount'),
    description: t('planStarterDesc'),
    features: [
      t('planStarterFeature1'),
      t('planStarterFeature2'),
      t('planStarterFeature3'),
      t('planStarterFeature4')
    ],
    notIncluded: [
      t('planStarterNotIncluded1'),
      t('planStarterNotIncluded2'),
      t('planStarterNotIncluded3'),
      t('planStarterNotIncluded4')
    ]
  },
  {
    name: t('planProfessionalName'),
    monthlyPrice: t('pricingProfessionalMonthly'),
    yearlyPrice: t('pricingProfessionalYearly'),
    yearlyDiscount: t('planProfessionalYearlyDiscount'),
    description: t('planProfessionalDesc'),
    features: [
      t('planProfessionalFeature1'),
      t('planProfessionalFeature2'),
      t('planProfessionalFeature3'),
      t('planProfessionalFeature4'),
      t('planProfessionalFeature5'),
      t('planProfessionalFeature6'),
      t('planProfessionalFeature7'),
      t('planProfessionalFeature8'),
      t('planProfessionalFeature9'),
      t('planProfessionalFeature10'),
      t('planProfessionalFeature11')
    ],
    notIncluded: [
      t('planProfessionalNotIncluded1')
    ],
    popular: true
  },
  {
    name: t('planEnterpriseName'),
    monthlyPrice: t('plansContactUs'),
    yearlyPrice: null,
    yearlyDiscount: null,
    description: t('planEnterpriseDesc'),
    features: [
      t('planEnterpriseFeature1'),
      t('planEnterpriseFeature2'),
      t('planEnterpriseFeature3'),
      t('planEnterpriseFeature4'),
      t('planEnterpriseFeature5'),
      t('planEnterpriseFeature6'),
      t('planEnterpriseFeature7')
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
  const { t, i18n } = useTranslation();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [needsSubscription, setNeedsSubscription] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const plans = Plans({ t, i18n });
  const [isYearly, setIsYearly] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const featureShowcaseData = [
    {
      title: t('featureAnalytics'),
      description: t('featureAnalyticsDesc'),
      image: featureAnalytics,
    },
    {
      title: t('featureAi'),
      description: t('featureAiDesc'),
      image: featureAiCampaign,
    },
    {
      title: t('featureEvents'),
      description: t('featureEventsDesc'),
      image: featureEvents,
    },
  ];

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
        <div className="container relative mx-auto px-4 sm:px-6 pt-20 sm:pt-28 lg:pt-40 pb-16 sm:pb-20 lg:pb-32 z-10">
          <div className="max-w-5xl mx-auto text-center space-y-8 sm:space-y-12">
            <div className="space-y-6 sm:space-y-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.15] sm:leading-[1.1] tracking-tight px-2">
                {t('heroTitle')}
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
                {t('heroSubtitle')}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch pt-6 sm:pt-8 px-4">
              <Link to="/auth" className="w-full sm:w-auto">
                <Button 
                  variant="animated"
                  size="xl"
                  className="w-full h-14 text-base sm:text-lg"
                >
                  {t('heroCtaPrimary')}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <InteractiveProductTour />
            </div>
            
            {/* Live Stats Counter */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 lg:gap-12 justify-center pt-8 sm:pt-12 px-4">
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">
                  <AnimatedCounter end={2547} suffix="+" />
                </div>
                <div className="text-xs sm:text-sm lg:text-base text-muted-foreground">
                  {t('companiesUsingSpotlight')}
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <div className="text-4xl sm:text-5xl font-bold text-primary">
                  <AnimatedCounter end={12349} suffix="+" />
                </div>
                <div className="text-sm sm:text-base text-muted-foreground">
                  {t('campaignsThisMonth')}
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <div className="text-4xl sm:text-5xl font-bold text-primary">
                  <AnimatedCounter end={98} suffix="%" />
                </div>
                <div className="text-sm sm:text-base text-muted-foreground">
                  {t('customerSatisfaction')}
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-8 justify-center pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>{t('noCommitment')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>{t('daysFree')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Social Proof */}
      <section className="py-16 border-y">
        <div className="container mx-auto px-4 sm:px-6">
          <p className="text-center text-muted-foreground mb-12 text-lg">
            {t('over')} <span className="font-semibold text-foreground">{t('companiesCount')}</span> {t('companiesUsing')}
          </p>
          <LogoCarousel />
        </div>
      </section>

      {/* Feature Showcase with Images */}
      <section className="py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-bold mb-6">{t('featuresTitle')}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('featuresSubtitle')}
            </p>
          </div>

          <div className="space-y-32 max-w-7xl mx-auto">
            {featureShowcaseData.map((feature, index) => (
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
                      {t('readMore')}
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
              <h3 className="text-2xl font-bold">{t('autoMonitoring')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('autoMonitoringDesc')}
              </p>
            </div>

            <div className="space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">{t('aiCampaigns')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('aiCampaignsDesc')}
              </p>
            </div>

            <div className="space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <BarChart className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">{t('roiTracking')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('roiTrackingDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* User Ratings Section */}
      <section className="py-32 bg-gradient-to-b from-primary/5 via-accent/10 to-background relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16 animate-on-scroll">
            <Badge className="mb-6 text-base px-6 py-2 bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30">
              {t('customerSatisfactionBadge')}
            </Badge>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              {t('ratingsTitle')}
            </h2>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
              {t('seeUserExperience')}
            </p>
          </div>

          {/* Overall Rating */}
          <div className="max-w-2xl mx-auto mb-20 animate-on-scroll">
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="pt-12 pb-12 text-center">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="text-8xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-pulse">
                    4.9
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="h-8 w-8 fill-primary text-primary animate-bounce" 
                          style={{ animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                    <p className="text-lg font-semibold text-muted-foreground">
                      {t('basedOnReviews')}
                    </p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-primary">
                  96% {t('recommendSpotlight')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Rating Categories */}
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            {[
              {
                category: t('ratingsEaseOfUse'),
                rating: 98,
                icon: Target,
                color: "from-blue-500 to-cyan-500",
                bgColor: "from-blue-500/10 to-cyan-500/10"
              },
              {
                category: t('ratingsSupport'),
                rating: 97,
                icon: Users,
                color: "from-purple-500 to-pink-500",
                bgColor: "from-purple-500/10 to-pink-500/10"
              },
              {
                category: t('ratingsRoi'),
                rating: 95,
                icon: TrendingUp,
                color: "from-green-500 to-emerald-500",
                bgColor: "from-green-500/10 to-emerald-500/10"
              },
              {
                category: t('ratingsFeatures'),
                rating: 96,
                icon: Sparkles,
                color: "from-amber-500 to-orange-500",
                bgColor: "from-amber-500/10 to-orange-500/10"
              }
            ].map((item, index) => (
              <Card 
                key={index} 
                className="border-2 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:scale-105 animate-on-scroll bg-card/80 backdrop-blur-sm"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="pt-8 pb-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${item.bgColor}`}>
                        <item.icon className={`h-8 w-8 bg-gradient-to-r ${item.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text', backgroundClip: 'text' }} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-1">{item.category}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`text-3xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                            {item.rating}%
                          </span>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Animated Progress Bar */}
                  <div className="relative w-full h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`absolute top-0 left-0 h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 ease-out animate-shimmer`}
                      style={{ 
                        width: `${item.rating}%`,
                        animationDelay: `${index * 0.2}s`
                      }}
                    />
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-4">
                    {item.rating >= 97 
                      ? t('exceptionallyHighRating') 
                      : item.rating >= 95 
                        ? t('veryHighRating') 
                        : t('highRating')
                    } {t('fromOurUsers')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: "👍", value: "98%", label: t('ratingsHappyCustomers') },
              { icon: "🚀", value: "10min", label: t('ratingsQuickSetup') },
              { icon: "💡", value: "24/7", label: t('ratingsFreeSupport') },
              { icon: "🎯", value: "500+", label: t('happyCompanies') }
            ].map((stat, i) => (
              <div 
                key={i} 
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 hover:from-primary/10 hover:to-accent/10 transition-all duration-300 hover:scale-110 animate-on-scroll"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-4xl mb-3 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
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
                  {t('comparisonTitle')}
                </Badge>
                <h2 className="text-4xl sm:text-5xl font-bold">
                  {t('comparisonTitle')}
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  {t('comparisonSubtitle')}
                </p>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-[600px] bg-card border rounded-2xl shadow-lg overflow-hidden">
                  <div className="grid grid-cols-3">
                    <div className="p-6 bg-accent/30 border-b border-r">
                      <h3 className="font-semibold text-lg">{t('feature')}</h3>
                    </div>
                    <div className="p-6 bg-primary/5 border-b border-r">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        Spotlight
                      </h3>
                    </div>
                    <div className="p-6 bg-accent/10 border-b">
                      <h3 className="font-semibold text-lg text-muted-foreground">
                        {t('traditionalMarketing')}
                      </h3>
                    </div>
                  </div>

                  {[
                    {
                      feature: t('findEvents'),
                      spotlight: t('autoMonitoring247'),
                      traditional: t('manualSearchWeekly')
                    },
                    {
                      feature: t('createCampaignText'),
                      spotlight: t('aiGenerated60s'),
                      traditional: t('manual24hours')
                    },
                    {
                      feature: t('analyticsRoi'),
                      spotlight: t('realtimeDashboard'),
                      traditional: t('manualExcel')
                    },
                    {
                      feature: t('abTesting'),
                      spotlight: t('builtInAutomated'),
                      traditional: t('difficultTimeConsuming')
                    },
                    {
                      feature: t('costPerMonth'),
                      spotlight: t('fromEuro29'),
                      traditional: t('euro500Plus')
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
                  {t('vsCompetitorsTitle')}
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  {t('vsCompetitorsSubtitle')}
                </p>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-[600px] bg-card border rounded-2xl shadow-lg overflow-hidden">
                  <div className="grid grid-cols-3">
                    <div className="p-6 bg-accent/30 border-b border-r">
                      <h3 className="font-semibold text-lg">{t('feature')}</h3>
                    </div>
                    <div className="p-6 bg-primary/5 border-b border-r">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        Spotlight
                      </h3>
                    </div>
                    <div className="p-6 bg-accent/10 border-b">
                      <h3 className="font-semibold text-lg text-muted-foreground">
                        {t('competitor')}
                      </h3>
                    </div>
                  </div>

                  {[
                    {
                      feature: t('featureAi'),
                      spotlight: true,
                      competitor: false
                    },
                    {
                      feature: t('autoMonitoring'),
                      spotlight: true,
                      competitor: true
                    },
                    {
                      feature: t('realtimeDashboard'),
                      spotlight: true,
                      competitor: false
                    },
                    {
                      feature: t('abTesting'),
                      spotlight: true,
                      competitor: false
                    },
                    {
                      feature: t('swedishSupport'),
                      spotlight: true,
                      competitor: false
                    },
                    {
                      feature: t('pdfExport'),
                      spotlight: true,
                      competitor: true
                    },
                    {
                      feature: t('freeTrial14Days'),
                      spotlight: true,
                      competitor: false
                    },
                    {
                      feature: t('startingPriceMonth'),
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
                    {t('trySpotlightFree')}
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
            <h2 className="text-5xl sm:text-6xl font-bold mb-6">{t('testimonialsTitle')}</h2>
            <p className="text-xl text-muted-foreground">{t('testimonialsSubtitle')}</p>
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
              {t('plansTitle')}
            </h2>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
              {t('plansSubtitle')}
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 mb-16">
            <span className={`text-lg font-medium transition-colors ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              {t('plansBillingMonthly')}
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={`text-lg font-medium transition-colors ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              {t('plansBillingYearly')}
            </span>
            {isYearly && (
              <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-primary/10 text-primary">
                {t('plansSave20')}
              </span>
            )}
          </div>

          {/* Horizontal scroll container on mobile, grid on desktop */}
          <div className="md:hidden overflow-x-auto pb-8 -mx-4 px-4">
            <div className="flex gap-6 min-w-max">
              {plans.map((plan) => (
                <div 
                  key={plan.name} 
                  className={`relative p-8 rounded-2xl transition-all w-[85vw] max-w-[400px] flex-shrink-0 ${
                    plan.popular 
                      ? 'bg-primary/5 border-2 border-primary shadow-lg' 
                      : 'bg-card border border-border hover:border-muted-foreground/30'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-wide">
                        {t('plansMostPopular')}
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
                    {plan.monthlyPrice !== t('plansContactUs') && (
                      <span className="text-muted-foreground text-lg">
                        {isYearly ? t('plansPerYear') : t('plansPerMonth')}
                      </span>
                    )}
                    </div>
                    {isYearly && plan.yearlyDiscount && (
                      <p className="text-sm text-primary font-medium mt-2">{plan.yearlyDiscount}</p>
                    )}
                  </div>

                  <div className="space-y-4 mb-8">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                      {t('plansIncluded')}
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

                  {plan.name === t('planEnterpriseName') ? (
                    <Link to="/contact" className="w-full">
                      <Button 
                        variant="animatedOutline"
                        className="w-full"
                        size="xl"
                      >
                        {t('plansContactUs')}
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
                        {t('plansStartFree')}
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Desktop grid layout */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
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
                      {t('plansMostPopular')}
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
                    {plan.monthlyPrice !== t('plansContactUs') && (
                      <span className="text-muted-foreground text-lg">
                        {isYearly ? t('plansPerYear') : t('plansPerMonth')}
                      </span>
                    )}
                  </div>
                  {isYearly && plan.yearlyDiscount && (
                    <p className="text-sm text-primary font-medium mt-2">{plan.yearlyDiscount}</p>
                  )}
                </div>

                <div className="space-y-4 mb-8">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    {t('plansIncluded')}
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

                {plan.name === t('planEnterpriseName') ? (
                  <Link to="/contact" className="w-full">
                    <Button 
                      variant="animatedOutline"
                      className="w-full"
                      size="xl"
                    >
                      {t('plansContactUs')}
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
                      {t('plansStartFree')}
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-muted-foreground">
              {t('allPlansInclude')}
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
              {t('faqTitle')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('faqSubtitle')}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {[
                { question: t('faq1Q'), answer: t('faq1A') },
                { question: t('faq2Q'), answer: t('faq2A') },
                { question: t('faq3Q'), answer: t('faq3A') },
                { question: t('faq4Q'), answer: t('faq4A') },
                { question: t('faq5Q'), answer: t('faq5A') },
                { question: t('faq6Q'), answer: t('faq6A') },
                { question: t('faq7Q'), answer: t('faq7A') },
                { question: t('faq8Q'), answer: t('faq8A') },
                { question: t('faq9Q'), answer: t('faq9A') },
                { question: t('faq10Q'), answer: t('faq10A') },
                { question: t('faq11Q'), answer: t('faq11A') },
                { question: t('faq12Q'), answer: t('faq12A') },
              ].map((faq, i) => (
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
              <h3 className="text-2xl font-bold mb-3">{t('moreQuestions')}</h3>
              <p className="text-muted-foreground mb-6">
                {t('supportTeamHelp')}
              </p>
              <Link to="/contact">
                <Button size="lg" variant="animated">
                  {t('contactSupport')}
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
                {t('startToday')}
              </h2>
              <p className="text-2xl sm:text-3xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {t('joinHundreds')}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center pt-6">
              <Link to="/auth">
                <Button 
                  variant="animated"
                  size="xl"
                >
                  {t('ctaButton')}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button 
                variant="animatedOutline"
                size="xl"
                onClick={() => navigate('/contact')}
              >
                {t('contactUs')}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 justify-center pt-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <span className="text-base text-muted-foreground">{t('daysFree')}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <span className="text-base text-muted-foreground">{t('noCommitment')}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <span className="text-base text-muted-foreground">{t('noCreditCard')}</span>
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
              {t('newsletterIndexMainTitle')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('newsletterIndexTitle')}
            </p>
            <NewsletterSignup />
            <p className="text-sm text-muted-foreground">
              {t('newsletterIndexDisclaimer')}
            </p>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      <Footer />
      
      {/* Exit Intent Popup */}
      <ExitIntentPopup />
    </div>
  );
};

export default Index;

