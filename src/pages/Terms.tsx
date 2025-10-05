import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Button variant="ghost" asChild>
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Tillbaka
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Användarvillkor</h1>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Godkännande av villkor</h2>
            <p className="text-muted-foreground">
              Genom att använda Spotlight accepterar du dessa användarvillkor. Om du inte godkänner 
              villkoren ska du inte använda tjänsten.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Tjänstebeskrivning</h2>
            <p className="text-muted-foreground">
              Spotlight är en SaaS-plattform som hjälper företag att upptäcka lokala evenemang och 
              skapa marknadsföringskampanjer. Vi förbehåller oss rätten att ändra eller uppdatera 
              tjänsten när som helst.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Konto och registrering</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Du måste vara minst 18 år för att skapa ett konto</li>
              <li>Du ansvarar för att hålla dina inloggningsuppgifter säkra</li>
              <li>Du ansvarar för all aktivitet som sker under ditt konto</li>
              <li>Du får inte dela ditt konto med andra</li>
              <li>Du måste tillhandahålla korrekta och fullständiga uppgifter</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Betalning och prenumeration</h2>
            <p className="text-muted-foreground mb-2">
              Betalningsvillkor:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Alla priser anges i svenska kronor (SEK) exklusive moms</li>
              <li>Betalning sker månadsvis i förskott</li>
              <li>Du kan avsluta din prenumeration när som helst</li>
              <li>Ingen återbetalning sker för outnyttjad tjänstetid</li>
              <li>Vi förbehåller oss rätten att ändra priser med 30 dagars varsel</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Acceptabel användning</h2>
            <p className="text-muted-foreground mb-2">
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
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Immateriella rättigheter</h2>
            <p className="text-muted-foreground">
              Alla rättigheter till Spotlight-plattformen, inklusive design, kod och innehåll, 
              tillhör Spotlight AB. Du får en begränsad, icke-exklusiv licens att använda tjänsten 
              enligt dessa villkor.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Uppsägning</h2>
            <p className="text-muted-foreground">
              Vi förbehåller oss rätten att när som helst stänga av eller avsluta ditt konto om du 
              bryter mot dessa villkor. Du kan själv avsluta ditt konto via inställningar.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Ansvarsbegränsning</h2>
            <p className="text-muted-foreground">
              Tjänsten tillhandahålls "som den är" utan garantier. Vi ansvarar inte för indirekta 
              skador, förlorad vinst eller dataförlust som uppstår vid användning av tjänsten.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Ändringar av villkoren</h2>
            <p className="text-muted-foreground">
              Vi kan uppdatera dessa villkor från tid till annan. Väsentliga ändringar meddelas 
              via e-post minst 30 dagar innan de träder i kraft.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Tillämplig lag</h2>
            <p className="text-muted-foreground">
              Dessa villkor regleras av svensk lag. Tvister ska i första hand lösas genom förhandling, 
              annars ska de avgöras av svensk domstol.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Kontakt</h2>
            <p className="text-muted-foreground">
              För frågor om dessa villkor, kontakta oss på:
              <a href="mailto:support@spotlight.se" className="text-primary hover:underline ml-1">
                support@spotlight.se
              </a>
            </p>
          </section>

          <section>
            <p className="text-sm text-muted-foreground">
              Senast uppdaterad: {new Date().toLocaleDateString('sv-SE')}
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Terms;
