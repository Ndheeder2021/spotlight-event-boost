import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";

const GDPR = () => {
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
            <span className="text-primary">GDPR-information</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed">
            Vi följer GDPR:s principer och krav för att skydda dina personuppgifter
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 pb-16 max-w-4xl">
        <div className="space-y-6">
          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4">Om GDPR</h2>
            <p className="text-muted-foreground leading-relaxed">
              Dataskyddsförordningen (GDPR) är en EU-förordning som stärker och förenar dataskyddet 
              för individer inom EU. Spotlight följer GDPR:s principer och krav.
            </p>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4">Personuppgiftsansvarig</h2>
            <p className="text-muted-foreground mb-4">
              Spotlight AB är personuppgiftsansvarig för behandlingen av dina personuppgifter.
            </p>
            <div className="text-muted-foreground bg-muted/30 p-4 rounded-lg">
              <p className="font-semibold">Spotlight AB</p>
              <p>Org.nr: 559XXX-XXXX</p>
              <p>E-post: <a href="mailto:gdpr@spotlightevents.online" className="text-accent hover:underline">gdpr@spotlightevents.online</a></p>
            </div>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4">Rättslig grund för behandling</h2>
            <p className="text-muted-foreground mb-4">
              Vi behandlar dina personuppgifter baserat på följande rättsliga grunder:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Fullgörande av avtalet:</strong> För att tillhandahålla våra tjänster enligt avtalet med dig</li>
              <li><strong>Berättigat intresse:</strong> För att förbättra våra tjänster och förhindra missbruk</li>
              <li><strong>Samtycke:</strong> För marknadsföring och analyser där det krävs</li>
              <li><strong>Rättslig förpliktelse:</strong> För att uppfylla lagkrav som bokföring</li>
            </ul>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4">Lagringstid</h2>
            <p className="text-muted-foreground leading-relaxed">
              Vi lagrar dina personuppgifter endast så länge det är nödvändigt för de ändamål som 
              uppgifterna samlades in för, eller så länge vi är skyldiga enligt lag att behålla dem. 
              Efter att ditt konto raderas, raderas dina personuppgifter inom 30 dagar, 
              förutom uppgifter som måste bevaras enligt bokföringslagen.
            </p>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4">Dina rättigheter enligt GDPR</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-accent pl-4">
                <h3 className="font-bold text-lg mb-1">Rätt till tillgång</h3>
                <p className="text-muted-foreground">Du har rätt att få information om vilka personuppgifter vi behandlar om dig.</p>
              </div>
              <div className="border-l-4 border-accent pl-4">
                <h3 className="font-bold text-lg mb-1">Rätt till rättelse</h3>
                <p className="text-muted-foreground">Du har rätt att få felaktiga uppgifter rättade.</p>
              </div>
              <div className="border-l-4 border-accent pl-4">
                <h3 className="font-bold text-lg mb-1">Rätt till radering</h3>
                <p className="text-muted-foreground">Du har rätt att få dina uppgifter raderade under vissa omständigheter.</p>
              </div>
              <div className="border-l-4 border-accent pl-4">
                <h3 className="font-bold text-lg mb-1">Rätt till begränsning</h3>
                <p className="text-muted-foreground">Du har rätt att begära att behandlingen av dina uppgifter begränsas.</p>
              </div>
              <div className="border-l-4 border-accent pl-4">
                <h3 className="font-bold text-lg mb-1">Rätt till dataportabilitet</h3>
                <p className="text-muted-foreground">Du har rätt att få ut dina uppgifter i ett strukturerat format.</p>
              </div>
              <div className="border-l-4 border-accent pl-4">
                <h3 className="font-bold text-lg mb-1">Rätt att invända</h3>
                <p className="text-muted-foreground">Du har rätt att invända mot behandling som grundas på berättigat intresse.</p>
              </div>
            </div>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4">Klagomål</h2>
            <p className="text-muted-foreground leading-relaxed">
              Om du anser att vi behandlar dina personuppgifter i strid med GDPR har du rätt att 
              lämna in ett klagomål till Integritetsskyddsmyndigheten (IMY).
            </p>
            <div className="mt-4 bg-muted/30 p-4 rounded-lg text-sm text-muted-foreground">
              <p className="font-semibold mb-2">Integritetsskyddsmyndigheten</p>
              <p>Box 8114, 104 20 Stockholm</p>
              <p>Telefon: 08-657 61 00</p>
              <p>E-post: <a href="mailto:imy@imy.se" className="text-accent hover:underline">imy@imy.se</a></p>
            </div>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4">Kontakt</h2>
            <p className="text-muted-foreground leading-relaxed">
              För att utöva dina rättigheter eller för frågor om GDPR, kontakta oss på: 
              <a href="mailto:gdpr@spotlightevents.online" className="text-accent hover:underline font-semibold ml-1">
                gdpr@spotlightevents.online
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

export default GDPR;
