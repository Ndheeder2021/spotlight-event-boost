import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Check, X, ArrowRight, Shield, Sparkles, TrendingUp, Bell, BarChart, Target } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AuthForm } from "@/components/AuthForm";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitch } from "@/components/LanguageSwitch";

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
    yearlyDiscount: "Spara $229",
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

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Priser - Spotlight Event Marketing"
        description="Välj den plan som passar ditt företag bäst. Alla planer inkluderar 14 dagars gratis testperiod. Från $29/mån. Ingen bindningstid."
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
              "price": "29",
              "priceCurrency": "USD",
              "priceValidUntil": "2025-12-31"
            },
            {
              "@type": "Offer",
              "name": "Professional",
              "price": "49",
              "priceCurrency": "USD",
              "priceValidUntil": "2025-12-31"
            }
          ]
        }}
      />
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 z-50">
        <div className="container mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Zap className="h-6 w-6 sm:h-7 sm:w-7 text-accent" fill="currentColor" />
            <span className="text-xl sm:text-2xl font-bold gradient-text">Spotlight</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors hidden sm:inline">
              Hem
            </Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors hidden sm:inline">
              Kontakt
            </Link>
            <LanguageSwitch />
            <ThemeToggle />
            <Button onClick={() => setShowAuthDialog(true)} size="lg" className="bg-gradient-to-r from-accent to-accent-glow">
              Logga in
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-20 md:py-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse premium-glow" />
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 grid-pattern opacity-30 -z-10" />
        
        <div className="max-w-5xl mx-auto text-center space-y-8 relative">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Enkel prissättning för
            <br />
            <span className="gradient-text-animated">alla företag</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Transparent prissättning anpassad för företag i alla storlekar. Du vet alltid vad du betalar.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 pt-4">
            <div className="flex items-center gap-2 text-lg">
              <Shield className="h-6 w-6 text-accent" />
              <span className="font-semibold">30 dagars pengarna tillbaka</span>
            </div>
            <div className="flex items-center gap-2 text-lg">
              <Check className="h-6 w-6 text-accent" />
              <span>14 dagars gratis testperiod</span>
            </div>
            <div className="flex items-center gap-2 text-lg">
              <X className="h-6 w-6 text-accent" />
              <span>Ingen bindningstid</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Toggle */}
      <section className="container mx-auto px-4 pb-16">
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 p-2 rounded-full glass-card border-2">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-8 py-3 rounded-full transition-all ${
                !isYearly ? 'bg-accent text-accent-foreground shadow-lg font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Månadsvis
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-8 py-3 rounded-full transition-all flex items-center gap-2 ${
                isYearly ? 'bg-accent text-accent-foreground shadow-lg font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Årsvis
              <span className="px-3 py-1 bg-accent-foreground/20 text-accent-foreground text-xs font-bold rounded-full animate-pulse">
                💰 Spara 20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-24">
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const getPlanIcon = (name: string) => {
              switch(name) {
                case "Starter": return Sparkles;
                case "Professional": return TrendingUp;
                case "Enterprise": return Target;
                default: return Zap;
              }
            };
            const Icon = getPlanIcon(plan.name);
            
            return (
              <Card 
                key={plan.name} 
                className={`flex flex-col transition-all hover:scale-[1.02] ${
                  plan.popular 
                    ? "border-2 border-accent shadow-2xl lg:scale-105 relative premium-glow-lg" 
                    : "border-2 border-border hover:border-accent/50 premium-glow glass-card"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-accent to-accent-glow text-accent-foreground text-sm font-bold rounded-full shadow-lg animate-pulse">
                    MEST POPULÄR
                  </div>
                )}
                <CardHeader className="text-center pb-8 pt-8">
                  <div className={`mx-auto mb-4 w-14 h-14 rounded-2xl flex items-center justify-center ${
                    plan.popular ? 'bg-gradient-to-br from-accent to-accent-glow' : 'bg-accent/10'
                  }`}>
                    <Icon className={`h-7 w-7 ${plan.popular ? 'text-accent-foreground' : 'text-accent'}`} />
                  </div>
                  <CardTitle className="text-2xl mb-3">{plan.name}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">{plan.description}</CardDescription>
                  <div className="pt-8">
                    {isYearly && plan.yearlyPrice ? (
                      <>
                        <div className="mb-3">
                          <span className="text-6xl font-bold gradient-text">{plan.yearlyPrice}</span>
                          <span className="text-muted-foreground text-lg ml-2">/år</span>
                        </div>
                        {plan.yearlyDiscount && (
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-bold border border-accent/30">
                            💰 {plan.yearlyDiscount}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="mb-3">
                        <span className="text-6xl font-bold gradient-text">{plan.monthlyPrice}</span>
                        {plan.name !== "Enterprise" && (
                          <span className="text-muted-foreground text-lg ml-2">/mån</span>
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow px-6">
                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="rounded-full bg-accent/10 p-1 flex-shrink-0">
                          <Check className="h-4 w-4 text-accent" />
                        </div>
                        <span className="text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                    {plan.notIncluded.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 opacity-50">
                        <div className="rounded-full bg-muted p-1 flex-shrink-0">
                          <X className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="text-sm text-muted-foreground leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-6 px-6 pb-6">
                  <Button 
                    className={`w-full h-12 text-base font-semibold ${
                      plan.popular ? 'bg-gradient-to-r from-accent to-accent-glow hover:opacity-90' : ''
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                    onClick={() => plan.name === "Enterprise" ? null : setShowAuthDialog(true)}
                    asChild={plan.name === "Enterprise"}
                  >
                    {plan.name === "Enterprise" ? (
                      <Link to="/contact" className="flex items-center justify-center gap-2">
                        Kontakta oss
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    ) : (
                      <>
                        Kom igång gratis
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>

      {/* What You Get Section */}
      <section className="container mx-auto px-4 py-24 bg-gradient-to-b from-background to-accent/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Vad får du med <span className="gradient-text">Spotlight</span>?
            </h2>
            <p className="text-xl text-muted-foreground">
              Kraftfulla verktyg för att maximera din marknadsföring
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass-card border-2 hover:border-accent/50 transition-all p-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Smarta Notifieringar</h3>
              <p className="text-muted-foreground">
                Få realtidsvarningar när relevanta evenemang planeras i ditt område. Missa aldrig en möjlighet.
              </p>
            </Card>
            
            <Card className="glass-card border-2 hover:border-accent/50 transition-all p-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI-Genererad Kampanjtext</h3>
              <p className="text-muted-foreground">
                Låt AI skapa professionella kampanjtexter anpassade för ditt företag och evenemang.
              </p>
            </Card>
            
            <Card className="glass-card border-2 hover:border-accent/50 transition-all p-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Analytics & ROI Tracking</h3>
              <p className="text-muted-foreground">
                Mät effekten av dina kampanjer med detaljerade analyser och ROI-spårning.
              </p>
            </Card>
            
            <Card className="glass-card border-2 hover:border-accent/50 transition-all p-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Visuella Mockups</h3>
              <p className="text-muted-foreground">
                Skapa professionella annonsmockups med AI för snabb visualisering av kampanjer.
              </p>
            </Card>
            
            <Card className="glass-card border-2 hover:border-accent/50 transition-all p-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">A/B Testing</h3>
              <p className="text-muted-foreground">
                Testa olika kampanjvarianter och optimera för bästa resultat automatiskt.
              </p>
            </Card>
            
            <Card className="glass-card border-2 hover:border-accent/50 transition-all p-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Snabb & Enkel</h3>
              <p className="text-muted-foreground">
                Från event-notis till färdig kampanj på under 5 minuter. Spara tid och öka effektiviteten.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Money Back Guarantee Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="glass-card border-2 border-accent/50 premium-glow-lg p-8 md:p-12 text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center mb-6">
              <Shield className="h-10 w-10 text-accent-foreground" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              30 Dagars <span className="gradient-text">Pengarna Tillbaka Garanti</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-6">
              Vi är så övertygade om att du kommer älska Spotlight att vi erbjuder en fullständig pengarna-tillbaka-garanti.
            </p>
            <p className="text-lg text-muted-foreground">
              Om du av någon anledning inte är nöjd inom de första 30 dagarna, kontakta oss så återbetalar vi din betalning utan krångel. Inga frågor ställs.
            </p>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Vanliga frågor om priser</h2>
          </div>
          <div className="space-y-6">
            <Card className="p-6 glass-card border-2 hover:border-accent/30 transition-all group">
              <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">Kan jag byta plan senare?</h3>
              <p className="text-muted-foreground">
                Ja, du kan när som helst uppgradera eller nedgradera din plan. Ändringar träder i kraft omedelbart och vi justerar faktureringen proportionellt.
              </p>
            </Card>
            <Card className="p-6 glass-card border-2 hover:border-accent/30 transition-all group">
              <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">Finns det någon bindningstid?</h3>
              <p className="text-muted-foreground">
                Nej, vi har inga bindningstider. Du kan när som helst avsluta ditt abonnemang från inställningar i din dashboard.
              </p>
            </Card>
            <Card className="p-6 glass-card border-2 hover:border-accent/30 transition-all group">
              <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">Vad händer efter gratisperioden?</h3>
              <p className="text-muted-foreground">
                Efter 14 dagar övergår du automatiskt till den valda betalplanen. Du kan när som helst avsluta innan gratisperioden är slut utan att betala något.
              </p>
            </Card>
            <Card className="p-6 glass-card border-2 hover:border-accent/30 transition-all group">
              <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">Vilka betalmetoder accepterar ni?</h3>
              <p className="text-muted-foreground">
                Vi accepterar alla större kreditkort (Visa, Mastercard, American Express) samt Swish och faktura för årsabonnemang.
              </p>
            </Card>
            <Card className="p-6 glass-card border-2 hover:border-accent/30 transition-all group">
              <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">Får jag en faktura?</h3>
              <p className="text-muted-foreground">
                Ja, du får automatiskt en faktura via email efter varje betalning. Du kan också ladda ner alla dina fakturor från din dashboard.
              </p>
            </Card>
            <Card className="p-6 glass-card border-2 hover:border-accent/30 transition-all group">
              <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">Hur fungerar pengarna tillbaka garantin?</h3>
              <p className="text-muted-foreground">
                Om du inte är nöjd inom 30 dagar från köpet, kontakta oss via support@spotlightevents.online så återbetalar vi hela beloppet omedelbart.
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
            Redo att öka din försäljning med<br />
            <span className="gradient-text-animated">smarta kampanjer</span>?
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Börja din 14-dagars gratisperiod idag. Inget kreditkort krävs. Avsluta när som helst.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              className="text-lg px-10 h-14 bg-gradient-to-r from-accent to-accent-glow hover:opacity-90 transition-all text-accent-foreground font-semibold" 
              onClick={() => setShowAuthDialog(true)}
            >
              Starta gratis idag
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-10 h-14 border-2" 
              asChild
            >
              <Link to="/contact">Kontakta oss</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground pt-4">
            ✓ 14 dagars gratis provperiod  •  ✓ 30 dagars pengarna tillbaka  •  ✓ Ingen bindningstid
          </p>
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
          <AuthForm onSuccess={() => setShowAuthDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
