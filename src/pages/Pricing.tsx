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
      "Upp till 10 sparade kampanjer",
      "Upptäck lokala evenemang i ditt område",
      "AI-genererad kampanjtext",
      "Grundläggande kampanjvy",
      "Redigera och anpassa AI-förslag",
      "Event-notifikationer via email",
      "Mobilanpassad dashboard",
      "Standard support (email)",
      "1 användare",
      "Kampanjhistorik (30 dagar)"
    ],
    notIncluded: [
      "PDF-export av kampanjer",
      "Dela kampanjer via länk",
      "Analytics & ROI-tracking",
      "AI-genererade visuella mockups",
      "A/B-testning",
      "Prioriterad support",
      "Team-samarbete",
      "API-access"
    ]
  },
  {
    name: "Professional",
    monthlyPrice: "$49",
    yearlyPrice: "$359",
    yearlyDiscount: "Spara $229",
    description: "För växande företag med högre ambitioner",
    features: [
      "Obegränsat antal kampanjer",
      "Alla funktioner från Starter",
      "AI Live Support-chatt",
      "PDF-export med professionell design",
      "Dela kampanjer via säker länk (lösenordsskydd)",
      "Skicka kampanjer via email direkt från plattformen",
      "Avancerad Analytics & ROI-tracking",
      "AI-genererade visuella annonsmockups",
      "Flerspråksstöd (EN, SV, NO, DK)",
      "A/B-testning av kampanjer",
      "Kommentarer och feedback från klienter",
      "Event-kalender med prognoser",
      "Prioriterad email-support",
      "Kampanjhistorik (obegränsad)",
      "Upp till 5 användare",
      "Team-samarbetsfunktioner",
      "Export till sociala medier"
    ],
    notIncluded: [
      "Dedikerad Account Manager",
      "White-label lösning",
      "API-access",
      "Anpassade integrationer"
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
      "Allt i Professional",
      "Obegränsat antal användare",
      "Dedikerad Account Manager",
      "Prioriterad support med SLA (99.9% uptime)",
      "Support via telefon, email och chatt",
      "Anpassade AI-modeller för ditt företag",
      "White-label lösning (din egen branding)",
      "Anpassade integrationer (CRM, Marketing Automation)",
      "API-access för utvecklare",
      "Avancerad rollhantering & behörigheter",
      "SSO (Single Sign-On)",
      "Dedikerad serverinstans",
      "Custom event-källor",
      "Månatliga strategimöten",
      "On-boarding och utbildning för team",
      "Anpassade rapporter och dashboards"
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
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Zap className="h-6 w-6 text-accent" fill="currentColor" />
            <span className="text-xl font-bold">Spotlight</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:inline">
              Hem
            </Link>
            <Link to="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:inline">
              Kontakt
            </Link>
            <LanguageSwitch />
            <ThemeToggle />
            <Button onClick={() => setShowAuthDialog(true)} className="bg-accent hover:bg-accent-dark text-accent-foreground">
              Logga in
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-32 lg:py-40">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div className="space-y-8">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight">
              Enkel prissättning för{" "}
              <span className="text-primary">alla</span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transparent prissättning anpassad för företag i alla storlekar
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 pt-4">
            <div className="flex items-center gap-2 text-base">
              <Check className="h-5 w-5 text-primary" />
              <span>14 dagars gratis</span>
            </div>
            <div className="flex items-center gap-2 text-base">
              <Check className="h-5 w-5 text-primary" />
              <span>Ingen bindningstid</span>
            </div>
            <div className="flex items-center gap-2 text-base">
              <Check className="h-5 w-5 text-primary" />
              <span>Avbryt när som helst</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Instantly.ai Style */}
      <section className="py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-4 mb-20">
            <span className={`text-lg font-medium transition-colors ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Månadsvis
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-12 h-6 p-0 border-2"
            >
              <div className={`absolute h-4 w-4 rounded-full bg-primary transition-all ${isYearly ? 'right-1' : 'left-1'}`} />
            </Button>
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

                <Button 
                  onClick={() => plan.name === "Enterprise" ? null : setShowAuthDialog(true)}
                  className={`w-full h-14 rounded-xl text-base font-semibold mb-8 ${
                    plan.popular 
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                      : ''
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  asChild={plan.name === "Enterprise"}
                >
                  {plan.name === "Enterprise" ? (
                    <Link to="/contact">Kontakta oss</Link>
                  ) : (
                    "Starta gratis"
                  )}
                </Button>

                <div className="space-y-4">
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
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-muted-foreground">
              Alla planer inkluderar 14 dagars gratis provperiod • Inget kreditkort krävs
            </p>
          </div>
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
