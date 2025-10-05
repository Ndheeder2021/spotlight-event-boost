import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Privacy = () => {
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
        <h1 className="text-4xl font-bold mb-8">Integritetspolicy</h1>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Inledning</h2>
            <p className="text-muted-foreground">
              Spotlight värnar om din integritet och är engagerade i att skydda dina personuppgifter. 
              Denna integritetspolicy förklarar hur vi samlar in, använder och skyddar din information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Vilka uppgifter samlar vi in?</h2>
            <p className="text-muted-foreground mb-2">
              Vi samlar in följande typer av personuppgifter:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Kontaktinformation (namn, e-postadress, telefonnummer)</li>
              <li>Företagsinformation (företagsnamn, adress, organisationsnummer)</li>
              <li>Användningsdata (hur du använder vår plattform)</li>
              <li>Teknisk information (IP-adress, webbläsartyp, enhetsinformation)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Hur använder vi dina uppgifter?</h2>
            <p className="text-muted-foreground mb-2">
              Vi använder dina personuppgifter för att:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Tillhandahålla och förbättra våra tjänster</li>
              <li>Hantera ditt konto och prenumeration</li>
              <li>Skicka viktig information om tjänsten</li>
              <li>Ge support och besvara dina frågor</li>
              <li>Analysera och förbättra användarupplevelsen</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Delning av uppgifter</h2>
            <p className="text-muted-foreground">
              Vi säljer aldrig dina personuppgifter. Vi kan dela information med betrodda tredjepartsleverantörer 
              som hjälper oss att driva vår verksamhet, såsom hosting-tjänster och betalningsprocessorer. 
              Dessa parter är bundna av sekretessavtal.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Säkerhet</h2>
            <p className="text-muted-foreground">
              Vi implementerar lämpliga tekniska och organisatoriska säkerhetsåtgärder för att skydda 
              dina personuppgifter mot obehörig åtkomst, förlust eller missbruk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Dina rättigheter</h2>
            <p className="text-muted-foreground mb-2">
              Du har rätt att:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Få tillgång till dina personuppgifter</li>
              <li>Rätta felaktiga uppgifter</li>
              <li>Radera dina uppgifter</li>
              <li>Invända mot behandling</li>
              <li>Begära dataportabilitet</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Kontakt</h2>
            <p className="text-muted-foreground">
              För frågor om denna integritetspolicy eller för att utöva dina rättigheter, kontakta oss på: 
              <a href="mailto:privacy@spotlight.se" className="text-primary hover:underline ml-1">
                privacy@spotlight.se
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

export default Privacy;
