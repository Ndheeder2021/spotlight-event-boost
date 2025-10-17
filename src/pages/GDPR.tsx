import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";

const GDPR = () => {
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
        <h1 className="text-4xl font-bold mb-8">GDPR-information</h1>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Om GDPR</h2>
            <p className="text-muted-foreground">
              Dataskyddsförordningen (GDPR) är en EU-förordning som stärker och förenar dataskyddet 
              för individer inom EU. Spotlight följer GDPR:s principer och krav.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Personuppgiftsansvarig</h2>
            <p className="text-muted-foreground">
              Spotlight AB är personuppgiftsansvarig för behandlingen av dina personuppgifter.
            </p>
            <div className="mt-4 text-muted-foreground">
              <p>Spotlight AB</p>
              <p>Org.nr: 559XXX-XXXX</p>
              <p>E-post: gdpr@spotlightevents.online</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Rättslig grund för behandling</h2>
            <p className="text-muted-foreground mb-2">
              Vi behandlar dina personuppgifter baserat på följande rättsliga grunder:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Fullgörande av avtalet:</strong> För att tillhandahålla våra tjänster enligt avtalet med dig</li>
              <li><strong>Berättigat intresse:</strong> För att förbättra våra tjänster och förhindra missbruk</li>
              <li><strong>Samtycke:</strong> För marknadsföring och analyser där det krävs</li>
              <li><strong>Rättslig förpliktelse:</strong> För att uppfylla lagkrav som bokföring</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Lagringstid</h2>
            <p className="text-muted-foreground">
              Vi lagrar dina personuppgifter endast så länge det är nödvändigt för de ändamål som 
              uppgifterna samlades in för, eller så länge vi är skyldiga enligt lag att behålla dem. 
              Efter att ditt konto raderas, raderas dina personuppgifter inom 30 dagar, 
              förutom uppgifter som måste bevaras enligt bokföringslagen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Dina rättigheter enligt GDPR</h2>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Rätt till tillgång</h3>
                <p>Du har rätt att få information om vilka personuppgifter vi behandlar om dig.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Rätt till rättelse</h3>
                <p>Du har rätt att få felaktiga uppgifter rättade.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Rätt till radering</h3>
                <p>Du har rätt att få dina uppgifter raderade under vissa omständigheter.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Rätt till begränsning</h3>
                <p>Du har rätt att begära att behandlingen av dina uppgifter begränsas.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Rätt till dataportabilitet</h3>
                <p>Du har rätt att få ut dina uppgifter i ett strukturerat format.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Rätt att invända</h3>
                <p>Du har rätt att invända mot behandling som grundas på berättigat intresse.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Klagomål</h2>
            <p className="text-muted-foreground">
              Om du anser att vi behandlar dina personuppgifter i strid med GDPR har du rätt att 
              lämna in ett klagomål till Integritetsskyddsmyndigheten (IMY).
            </p>
            <div className="mt-4 text-muted-foreground">
              <p>Integritetsskyddsmyndigheten</p>
              <p>Box 8114, 104 20 Stockholm</p>
              <p>E-post: imy@imy.se</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Kontakta oss</h2>
            <p className="text-muted-foreground">
              För att utöva dina rättigheter eller om du har frågor, kontakta oss på:
              <a href="mailto:gdpr@spotlightevents.online" className="text-primary hover:underline ml-1">
                gdpr@spotlightevents.online
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
      <Footer />
    </div>
  );
};

export default GDPR;
