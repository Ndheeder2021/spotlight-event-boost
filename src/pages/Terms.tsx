import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Zap className="h-6 w-6 text-accent" fill="currentColor" />
            <span className="text-xl font-bold">Spotlight</span>
          </Link>
          <Button variant="ghost" asChild>
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Tillbaka
            </Link>
          </Button>
        </div>
      </header>

      <section className="container mx-auto px-4 sm:px-6 py-32 lg:py-40">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight">
            <span className="text-primary">Användarvillkor</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed">
            Läs igenom våra användarvillkor för att förstå dina rättigheter och skyldigheter
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 pb-16 max-w-4xl">
        <div className="space-y-6">
          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">1.</span> Godkännande av villkor
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Genom att använda Spotlight accepterar du dessa användarvillkor. Om du inte godkänner 
              villkoren ska du inte använda tjänsten.
            </p>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">2.</span> Tjänstebeskrivning
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Spotlight är en SaaS-plattform som hjälper företag att upptäcka lokala evenemang och 
              skapa marknadsföringskampanjer. Vi förbehåller oss rätten att ändra eller uppdatera 
              tjänsten när som helst.
            </p>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">3.</span> Konto och registrering
            </h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Du måste vara minst 18 år för att skapa ett konto</li>
              <li>Du ansvarar för att hålla dina inloggningsuppgifter säkra</li>
              <li>Du ansvarar för all aktivitet som sker under ditt konto</li>
              <li>Du får inte dela ditt konto med andra</li>
              <li>Du måste tillhandahålla korrekta och fullständiga uppgifter</li>
            </ul>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">4.</span> Betalning och prenumeration
            </h2>
            <p className="text-muted-foreground mb-4">
              Betalningsvillkor:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Alla priser anges i svenska kronor (SEK) exklusive moms</li>
              <li>Betalning sker månadsvis i förskott</li>
              <li>Du kan avsluta din prenumeration när som helst</li>
              <li>Ingen återbetalning sker för outnyttjad tjänstetid</li>
              <li>Vi förbehåller oss rätten att ändra priser med 30 dagars varsel</li>
            </ul>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">5.</span> Acceptabel användning
            </h2>
            <p className="text-muted-foreground mb-4">
              Du får inte använda tjänsten för att:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Bryta mot gällande lagar eller förordningar</li>
              <li>Skicka spam eller oönskad marknadsföring</li>
              <li>Sprida skadlig kod eller virus</li>
              <li>Försöka få obehörig åtkomst till tjänsten</li>
              <li>Missbruka eller överbelasta systemet</li>
              <li>Använda tjänsten för att skada andra</li>
            </ul>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">6.</span> Immateriella rättigheter
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Alla rättigheter till Spotlight-plattformen, inklusive design, kod och innehåll, 
              tillhör Spotlight AB. Du får en begränsad, icke-exklusiv licens att använda tjänsten 
              enligt dessa villkor.
            </p>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">7.</span> Uppsägning
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Vi förbehåller oss rätten att när som helst stänga av eller avsluta ditt konto om du 
              bryter mot dessa villkor. Du kan själv avsluta ditt konto via inställningar.
            </p>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">8.</span> Ansvarsbegränsning
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Spotlight tillhandahålls "som det är" utan garantier. Vi ansvarar inte för indirekta skador 
              eller förlorad vinst till följd av användning av tjänsten.
            </p>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">9.</span> Ändringar av villkoren
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Vi kan när som helst uppdatera dessa villkor. Betydande ändringar meddelas via e-post eller 
              genom plattformen. Fortsatt användning efter ändringar innebär att du accepterar de nya villkoren.
            </p>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">10.</span> Kontakt
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              För frågor om dessa villkor, kontakta oss på: 
              <a href="mailto:legal@spotlightevents.online" className="text-accent hover:underline font-semibold ml-1">
                legal@spotlightevents.online
              </a>
            </p>
            <p className="text-sm text-muted-foreground mt-6">
              Senast uppdaterad: {new Date().toLocaleDateString('sv-SE')}
            </p>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
