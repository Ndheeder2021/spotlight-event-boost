import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Check, X, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AuthForm } from "@/components/AuthForm";
import { Footer } from "@/components/Footer";

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

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

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
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Hem
            </Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Kontakt
            </Link>
            <Button onClick={() => setShowAuthDialog(true)}>
              Logga in
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-block px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4">
            <span className="text-sm font-semibold text-accent">Priser</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold">
            Enkel, transparent
            <br />
            <span className="gradient-text">prismodell</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Välj den plan som passar ditt företag bäst. Alla planer inkluderar 14 dagars gratis testperiod.
          </p>
        </div>
      </section>

      {/* Pricing Toggle */}
      <section className="container mx-auto px-4 pb-12">
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-4 p-1 rounded-full bg-muted">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-8 py-3 rounded-full transition-all ${
                !isYearly ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground'
              }`}
            >
              Månadsvis
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-8 py-3 rounded-full transition-all flex items-center gap-2 ${
                isYearly ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground'
              }`}
            >
              Årsvis
              <span className="px-3 py-1 bg-accent/20 text-accent text-xs font-bold rounded-full">
                Spara upp till 40%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name} 
              className={`flex flex-col ${
                plan.popular ? "border-2 border-accent shadow-xl scale-105 relative" : "border-2"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-accent to-accent-glow text-primary-foreground text-sm font-bold rounded-full">
                  MEST POPULÄR
                </div>
              )}
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                <div className="pt-6">
                  {isYearly && plan.yearlyPrice ? (
                    <>
                      <div className="mb-2">
                        <span className="text-5xl font-bold">{plan.yearlyPrice.split(' ')[0]}</span>
                        <span className="text-muted-foreground text-lg ml-1">/år</span>
                      </div>
                      {plan.yearlyDiscount && (
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-bold">
                          💰 {plan.yearlyDiscount}
                        </div>
                      )}
                    </>
                  ) : (
                    <div>
                      <span className="text-5xl font-bold">{plan.monthlyPrice.split(' ')[0]}</span>
                      {plan.monthlyPrice.includes('kr') && (
                        <span className="text-muted-foreground text-lg ml-1">/mån</span>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <X className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                  onClick={() => plan.name === "Enterprise" ? null : setShowAuthDialog(true)}
                  asChild={plan.name === "Enterprise"}
                >
                  {plan.name === "Enterprise" ? (
                    <Link to="/contact">Kontakta oss</Link>
                  ) : (
                    <>
                      Kom igång gratis
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Vanliga frågor om priser</h2>
          </div>
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-2">Kan jag byta plan senare?</h3>
              <p className="text-muted-foreground">
                Ja, du kan när som helst uppgradera eller nedgradera din plan. Ändringar träder i kraft omedelbart och vi justerar faktureringen proportionellt.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-2">Finns det någon bindningstid?</h3>
              <p className="text-muted-foreground">
                Nej, vi har inga bindningstider. Du kan när som helst avsluta ditt abonnemang från inställningar i din dashboard.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-2">Vad händer efter gratisperioden?</h3>
              <p className="text-muted-foreground">
                Efter 14 dagar övergår du automatiskt till den valda betalplanen. Du kan när som helst avsluta innan gratisperioden är slut utan att betala något.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-2">Vilka betalmetoder accepterar ni?</h3>
              <p className="text-muted-foreground">
                Vi accepterar alla större kreditkort (Visa, Mastercard, American Express) samt Swish och faktura för årsabonnemang.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-2">Får jag en faktura?</h3>
              <p className="text-muted-foreground">
                Ja, du får automatiskt en faktura via email efter varje betalning. Du kan också ladda ner alla dina fakturor från din dashboard.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8 glass-card p-12 rounded-3xl border-2">
          <h2 className="text-4xl md:text-5xl font-bold">
            Redo att komma igång?
          </h2>
          <p className="text-xl text-muted-foreground">
            Prova Spotlight gratis i 14 dagar. Inget kreditkort krävs.
          </p>
          <Button size="lg" className="text-lg px-8 h-14" onClick={() => setShowAuthDialog(true)}>
            Starta din gratisperiod
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
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
