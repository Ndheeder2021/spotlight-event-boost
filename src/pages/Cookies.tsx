import { Button } from "@/components/ui/button";
import { ArrowLeft, Cookie, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";

const Cookies = () => {
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
            <span className="text-primary">Cookie-policy</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed">
            Information om hur vi använder cookies för att förbättra din upplevelse
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 pb-16 max-w-4xl">
        <div className="space-y-6">
          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4">Vad är cookies?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies är små textfiler som lagras på din enhet när du besöker en webbplats. 
              De används för att webbplatsen ska fungera korrekt, bli mer användarvänlig och 
              ge oss information om hur webbplatsen används.
            </p>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4">Hur använder vi cookies?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Vi använder cookies för att förbättra din upplevelse på vår webbplats och för att 
              förstå hur du använder våra tjänster.
            </p>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4">Typer av cookies vi använder</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-2 text-accent">Nödvändiga cookies</h3>
                <p className="text-muted-foreground mb-3">
                  Dessa cookies är nödvändiga för att webbplatsen ska fungera korrekt. 
                  De används för att hantera inloggning och säkerhet.
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li><strong>Sessionscookies:</strong> Håller dig inloggad under din session</li>
                  <li><strong>Säkerhetscookies:</strong> Skyddar mot obehörig åtkomst</li>
                </ul>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-bold mb-2 text-accent">Funktionella cookies</h3>
                <p className="text-muted-foreground mb-3">
                  Dessa cookies gör det möjligt för webbplatsen att komma ihåg val du gör 
                  (som språk eller region) och erbjuda förbättrade funktioner.
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li><strong>Användarinställningar:</strong> Sparar dina preferenser</li>
                  <li><strong>Tema:</strong> Kommer ihåg ljust/mörkt tema</li>
                </ul>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-bold mb-2 text-accent">Analytiska cookies</h3>
                <p className="text-muted-foreground mb-3">
                  Dessa cookies hjälper oss att förstå hur besökare interagerar med webbplatsen 
                  genom att samla in och rapportera information anonymt.
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li><strong>Användningsstatistik:</strong> Spårar hur webbplatsen används</li>
                  <li><strong>Prestandamätning:</strong> Mäter laddningstider och prestanda</li>
                </ul>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-bold mb-2 text-accent">Marknadsföringscookies</h3>
                <p className="text-muted-foreground">
                  Dessa cookies används för att spåra besökare över webbplatser. 
                  Avsikten är att visa annonser som är relevanta och engagerande för den enskilda användaren.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4">Tredjepartscookies</h2>
            <p className="text-muted-foreground mb-4">
              Vi använder följande tredjepartstjänster som kan placera cookies:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Supabase:</strong> För autentisering och datalagring</li>
              <li><strong>Stripe:</strong> För betalningshantering (om tillämpligt)</li>
            </ul>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4">Hantera cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Du kan när som helst ändra dina cookie-inställningar genom din webbläsare. 
              Observera att vissa funktioner kanske inte fungerar korrekt om du blockerar cookies.
            </p>
            <p className="text-sm text-muted-foreground">
              Läs mer om hur du hanterar cookies i{" "}
              <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                din webbläsare
              </a>
            </p>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4">Kontakt</h2>
            <p className="text-muted-foreground leading-relaxed">
              För frågor om vår cookie-policy, kontakta oss på: 
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

export default Cookies;
