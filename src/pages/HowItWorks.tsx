import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, Bell, Sparkles, Send, BarChart, Check } from "lucide-react";
import { Footer } from "@/components/Footer";

export default function HowItWorks() {
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
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative container mx-auto px-4 py-24 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl" />
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 grid-pattern opacity-30 -z-10" />
        
        <div className="max-w-4xl mx-auto text-center space-y-6 relative">
          <div className="inline-block px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4 backdrop-blur-sm">
            <span className="text-sm font-semibold text-accent">Hur Det Fungerar</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold">
            Från evenemang till
            <br />
            <span className="gradient-text">försäljning på 3 steg</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Spotlight automatiserar hela processen från att upptäcka lokala evenemang till att generera kampanjer som ger resultat
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-24">
          {/* Step 1 */}
          <div className="relative">
            <div className="absolute left-8 top-20 bottom-0 w-0.5 bg-gradient-to-b from-accent to-transparent hidden md:block" />
            <div className="grid md:grid-cols-[auto,1fr] gap-8 items-start">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-lg">
                  1
                </div>
              </div>
              <Card className="p-8 border-2 glass-card hover:border-accent/50 transition-all hover:shadow-xl premium-glow group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Bell className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-accent transition-colors">Registrera ditt företag</h3>
                    <p className="text-muted-foreground text-lg">
                      Skapa ett konto och ange din affärs plats, typ av verksamhet och målgrupp. Det tar mindre än 2 minuter.
                    </p>
                  </div>
                </div>
                <div className="mt-6 pl-16 space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Ange din affärs plats och radius</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Välj typ av evenemang som är relevanta</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Ställ in önskad besökarstorlek</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="absolute left-8 top-20 bottom-0 w-0.5 bg-gradient-to-b from-accent to-transparent hidden md:block" />
            <div className="grid md:grid-cols-[auto,1fr] gap-8 items-start">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-lg">
                  2
                </div>
              </div>
              <Card className="p-8 border-2 glass-card hover:border-accent/50 transition-all hover:shadow-xl premium-glow group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Sparkles className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-accent transition-colors">Ta emot notifieringar</h3>
                    <p className="text-muted-foreground text-lg">
                      Spotlight övervakar automatiskt lokala evenemang och skickar dig notifieringar när något relevant upptäcks.
                    </p>
                  </div>
                </div>
                <div className="mt-6 pl-16 space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Få varningar 1-2 veckor i förväg</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Se detaljer om eventet och uppskattat besöksantal</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Välj vilka evenemang du vill skapa kampanjer för</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <div className="absolute left-8 top-20 bottom-0 w-0.5 bg-gradient-to-b from-accent to-transparent hidden md:block" />
            <div className="grid md:grid-cols-[auto,1fr] gap-8 items-start">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-lg">
                  3
                </div>
              </div>
              <Card className="p-8 border-2 glass-card hover:border-accent/50 transition-all hover:shadow-xl premium-glow group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Send className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-accent transition-colors">Generera & lansera kampanjer</h3>
                    <p className="text-muted-foreground text-lg">
                      Använd vår AI för att skapa professionella kampanjer på sekunder, eller skriv egna. Redigera, godkänn och lansera.
                    </p>
                  </div>
                </div>
                <div className="mt-6 pl-16 space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">AI skapar kampanjtext optimerad för ditt företag</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Anpassa och redigera efter behov</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Exportera till PDF, dela via länk eller email</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative">
            <div className="grid md:grid-cols-[auto,1fr] gap-8 items-start">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-lg">
                  4
                </div>
              </div>
              <Card className="p-8 border-2 glass-card hover:border-accent/50 transition-all hover:shadow-xl premium-glow group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <BarChart className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-accent transition-colors">Följ resultat & optimera</h3>
                    <p className="text-muted-foreground text-lg">
                      Se hur dina kampanjer presterar i realtid och lär dig vad som fungerar bäst för just ditt företag.
                    </p>
                  </div>
                </div>
                <div className="mt-6 pl-16 space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Detaljerad analys av varje kampanj</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">ROI-tracking och försäljningsdata</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">AI-rekommendationer för nästa kampanj</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-accent/5 to-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Allt du behöver på ett ställe</h2>
            <p className="text-lg text-muted-foreground">
              Spotlight inkluderar alla verktyg du behöver för att lyckas
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 border-2 glass-card hover:border-accent/50 transition-all hover:scale-105 premium-glow group">
              <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">Smart Kalendervy</h3>
              <p className="text-sm text-muted-foreground">
                Se alla kommande evenemang och dina kampanjer i en överskådlig kalender
              </p>
            </Card>
            <Card className="p-6 border-2 glass-card hover:border-accent/50 transition-all hover:scale-105 premium-glow group">
              <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">Kampanjbibliotek</h3>
              <p className="text-sm text-muted-foreground">
                Spara och återanvänd framgångsrika kampanjer för liknande evenemang
              </p>
            </Card>
            <Card className="p-6 border-2 glass-card hover:border-accent/50 transition-all hover:scale-105 premium-glow group">
              <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">Teamsamarbete</h3>
              <p className="text-sm text-muted-foreground">
                Bjud in teammedlemmar och samarbeta kring kampanjer
              </p>
            </Card>
            <Card className="p-6 border-2 glass-card hover:border-accent/50 transition-all hover:scale-105 premium-glow group">
              <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">PDF Export</h3>
              <p className="text-sm text-muted-foreground">
                Exportera kampanjer till professionella PDF:er för utskrift
              </p>
            </Card>
            <Card className="p-6 border-2 glass-card hover:border-accent/50 transition-all hover:scale-105 premium-glow group">
              <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">Delningslänkar</h3>
              <p className="text-sm text-muted-foreground">
                Dela kampanjer med klienter via säkra, lösenordsskyddade länkar
              </p>
            </Card>
            <Card className="p-6 border-2 glass-card hover:border-accent/50 transition-all hover:scale-105 premium-glow group">
              <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">AI Live Support</h3>
              <p className="text-sm text-muted-foreground">
                Få hjälp direkt i plattformen med vår AI-assistent (Pro & Enterprise)
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative container mx-auto px-4 py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-background -z-10" />
        <div className="max-w-4xl mx-auto text-center space-y-8 glass-card p-12 rounded-3xl border-2 premium-glow-lg">
          <h2 className="text-4xl md:text-5xl font-bold">
            Redo att <span className="gradient-text">komma igång</span>?
          </h2>
          <p className="text-xl text-muted-foreground">
            Prova Spotlight gratis i 14 dagar. Inget kreditkort krävs.
          </p>
          <Button size="lg" className="text-lg px-8 h-14 hover:scale-105 transition-transform" asChild>
            <Link to="/">
              Starta din gratisperiod
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
