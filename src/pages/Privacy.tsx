import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";

const Privacy = () => {
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
            <span className="text-primary">Integritetspolicy</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed">
            Vi värnar om din integritet och är transparenta med hur vi hanterar dina uppgifter
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 pb-16 max-w-4xl">
        <div className="space-y-6">
          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">1.</span> Inledning
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Spotlight värnar om din integritet och är engagerade i att skydda dina personuppgifter. 
              Denna integritetspolicy förklarar hur vi samlar in, använder och skyddar din information.
            </p>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">2.</span> Vilka uppgifter samlar vi in?
            </h2>
            <p className="text-muted-foreground mb-4">
              Vi samlar in följande typer av personuppgifter:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Kontaktinformation (namn, e-postadress, telefonnummer)</li>
              <li>Företagsinformation (företagsnamn, adress, organisationsnummer)</li>
              <li>Användningsdata (hur du använder vår plattform)</li>
              <li>Teknisk information (IP-adress, webbläsartyp, enhetsinformation)</li>
            </ul>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">3.</span> Hur använder vi dina uppgifter?
            </h2>
            <p className="text-muted-foreground mb-4">
              Vi använder dina personuppgifter för att:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Tillhandahålla och förbättra våra tjänster</li>
              <li>Hantera ditt konto och prenumeration</li>
              <li>Skicka viktig information om tjänsten</li>
              <li>Ge support och besvara dina frågor</li>
              <li>Analysera och förbättra användarupplevelsen</li>
            </ul>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">4.</span> Delning av uppgifter
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Vi säljer aldrig dina personuppgifter. Vi kan dela information med betrodda tredjepartsleverantörer 
              som hjälper oss att driva vår verksamhet, såsom hosting-tjänster och betalningsprocessorer. 
              Dessa parter är bundna av sekretessavtal.
            </p>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">5.</span> Säkerhet
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Vi implementerar lämpliga tekniska och organisatoriska säkerhetsåtgärder för att skydda 
              dina personuppgifter mot obehörig åtkomst, förlust eller missbruk.
            </p>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">6.</span> Dina rättigheter
            </h2>
            <p className="text-muted-foreground mb-4">
              Du har rätt att:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Få tillgång till dina personuppgifter</li>
              <li>Rätta felaktiga uppgifter</li>
              <li>Radera dina uppgifter</li>
              <li>Invända mot behandling</li>
              <li>Begära dataportabilitet</li>
            </ul>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">7.</span> Kontakt
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              För frågor om denna integritetspolicy eller för att utöva dina rättigheter, kontakta oss på: 
              <a href="mailto:privacy@spotlightevents.online" className="text-accent hover:underline font-semibold ml-1">
                privacy@spotlightevents.online
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

export default Privacy;
