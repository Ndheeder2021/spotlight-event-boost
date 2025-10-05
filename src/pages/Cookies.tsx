import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Cookies = () => {
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
        <h1 className="text-4xl font-bold mb-8">Cookie-policy</h1>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Vad är cookies?</h2>
            <p className="text-muted-foreground">
              Cookies är små textfiler som lagras på din enhet när du besöker en webbplats. 
              De används för att webbplatsen ska fungera korrekt, bli mer användarvänlig och 
              ge oss information om hur webbplatsen används.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Hur använder vi cookies?</h2>
            <p className="text-muted-foreground">
              Vi använder cookies för att förbättra din upplevelse på vår webbplats och för att 
              förstå hur du använder våra tjänster.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Typer av cookies vi använder</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Nödvändiga cookies</h3>
                <p className="text-muted-foreground">
                  Dessa cookies är nödvändiga för att webbplatsen ska fungera korrekt. 
                  De används för att hantera inloggning och säkerhet.
                </p>
                <ul className="list-disc pl-6 text-muted-foreground mt-2 space-y-1">
                  <li><strong>Sessionscookies:</strong> Håller dig inloggad under din session</li>
                  <li><strong>Säkerhetscookies:</strong> Skyddar mot obehörig åtkomst</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Funktionella cookies</h3>
                <p className="text-muted-foreground">
                  Dessa cookies gör det möjligt för webbplatsen att komma ihåg val du gör 
                  (som språk eller region) och erbjuda förbättrade funktioner.
                </p>
                <ul className="list-disc pl-6 text-muted-foreground mt-2 space-y-1">
                  <li><strong>Användarinställningar:</strong> Sparar dina preferenser</li>
                  <li><strong>Tema:</strong> Kommer ihåg ljust/mörkt tema</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Analytiska cookies</h3>
                <p className="text-muted-foreground">
                  Dessa cookies hjälper oss att förstå hur besökare interagerar med webbplatsen 
                  genom att samla in och rapportera information anonymt.
                </p>
                <ul className="list-disc pl-6 text-muted-foreground mt-2 space-y-1">
                  <li><strong>Användningsstatistik:</strong> Spårar hur webbplatsen används</li>
                  <li><strong>Prestandamätning:</strong> Mäter laddningstider och prestanda</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Marknadsföringscookies</h3>
                <p className="text-muted-foreground">
                  Dessa cookies används för att spåra besökare över webbplatser. 
                  Avsikten är att visa annonser som är relevanta och engagerande för den enskilda användaren.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Tredjepartscookies</h2>
            <p className="text-muted-foreground mb-2">
              Vi använder följande tredjepartstjänster som kan placera cookies:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Supabase:</strong> För autentisering och datalagring</li>
              <li><strong>Stripe:</strong> För betalningshantering (om tillämpligt)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Hantera cookies</h2>
            <p className="text-muted-foreground mb-2">
              Du kan kontrollera och/eller radera cookies som du vill. Du kan radera alla 
              cookies som redan finns på din dator och du kan ställa in de flesta webbläsare 
              så att de förhindrar att cookies placeras.
            </p>
            <p className="text-muted-foreground">
              Observera att om du gör detta kan du behöva justera vissa inställningar manuellt 
              varje gång du besöker webbplatsen och vissa tjänster och funktioner kanske inte fungerar.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Lagringstid</h2>
            <p className="text-muted-foreground">
              Olika cookies har olika lagringstid:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
              <li><strong>Sessionscookies:</strong> Raderas när du stänger webbläsaren</li>
              <li><strong>Permanenta cookies:</strong> Ligger kvar i upp till 12 månader</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Kontakt</h2>
            <p className="text-muted-foreground">
              Om du har frågor om vår användning av cookies, kontakta oss på:
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

export default Cookies;
