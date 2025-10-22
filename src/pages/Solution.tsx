import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, TrendingUp, Bell, Target, Users, BarChart, MapPin, Calendar, Sparkles, ArrowRight } from "lucide-react";
import { Footer } from "@/components/Footer";

export default function Solution() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Zap className="h-6 w-6 text-accent" fill="currentColor" />
            <span className="text-xl font-bold">Spotlight</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Hem
            </Link>
            <Link to="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Kontakt
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-32 lg:py-40">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight">
            En komplett lösning för
            <br />
            <span className="text-primary">eventdriven marknadsföring</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Spotlight kombinerar AI-teknologi med lokal eventdata för att automatiskt skapa och optimera marknadsföringskampanjer
          </p>
        </div>
      </section>

      {/* Problem Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Utmaningen</h2>
            <p className="text-lg text-muted-foreground">
              Lokala företag missar dagligen värdefulla möjligheter
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 glass-card hover:border-accent/30 transition-all hover:scale-105 hover:shadow-xl group">
              <CardHeader>
                <CardTitle className="text-xl group-hover:text-accent transition-colors">Missade evenemang</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Tusentals lokala evenemang sker varje vecka, men de flesta företag saknar resurser att övervaka och agera på dem i tid.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 glass-card hover:border-accent/30 transition-all hover:scale-105 hover:shadow-xl group">
              <CardHeader>
                <CardTitle className="text-xl group-hover:text-accent transition-colors">Tidskrävande kampanjer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Att skapa effektiva marknadsföringskampanjer tar tid och expertis som små företag ofta inte har tillgång till.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 glass-card hover:border-accent/30 transition-all hover:scale-105 hover:shadow-xl group">
              <CardHeader>
                <CardTitle className="text-xl group-hover:text-accent transition-colors">Ingen insikt</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Utan verktyg för att mäta och analysera resultat går företag miste om värdefulla lärdomar för framtida kampanjer.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Så fungerar Spotlight</h2>
            <p className="text-lg text-muted-foreground">
              En komplett plattform som automatiserar hela processen
            </p>
          </div>

          <div className="space-y-16">
            {/* Step 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-bold mb-4">
                  Steg 1
                </div>
                <h3 className="text-3xl font-bold mb-4 flex items-center gap-3">
                  <MapPin className="h-8 w-8 text-accent" />
                  Automatisk Eventövervakning
                </h3>
                <p className="text-lg text-muted-foreground mb-6">
                  Spotlight övervakar kontinuerligt tusentals evenemang i ditt område. Vi analyserar storlek, typ, och relevans för ditt företag.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground">Realtidsuppdatering av lokala evenemang</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground">Intelligent filtrering baserat på din bransch</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground">Uppskattat besöksantal för varje event</span>
                  </li>
                </ul>
              </div>
              <div className="order-1 md:order-2">
                <div className="glass-card p-8 rounded-2xl border-2 border-accent/20 premium-glow hover:scale-105 transition-all">
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent/10 rounded-full blur-2xl" />
                    <Bell className="h-16 w-16 text-accent mb-4 mx-auto relative animate-pulse" />
                  </div>
                  <p className="text-center text-muted-foreground">
                    Få notifieringar om relevanta evenemang innan de händer
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="glass-card p-8 rounded-2xl border-2 border-accent/20 premium-glow hover:scale-105 transition-all">
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent/10 rounded-full blur-2xl" />
                    <Sparkles className="h-16 w-16 text-accent mb-4 mx-auto relative animate-pulse" />
                  </div>
                  <p className="text-center text-muted-foreground">
                    AI skapar skräddarsydda kampanjer på sekunder
                  </p>
                </div>
              </div>
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-bold mb-4">
                  Steg 2
                </div>
                <h3 className="text-3xl font-bold mb-4 flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-accent" />
                  AI-Genererade Kampanjer
                </h3>
                <p className="text-lg text-muted-foreground mb-6">
                  Vår AI analyserar eventet och skapar automatiskt professionella kampanjtexter anpassade för din målgrupp och kanal.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground">Personliga kampanjtexter på sekunder</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground">Optimerad för olika kanaler (social, email, webb)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground">Enkelt att redigera och anpassa</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-bold mb-4">
                  Steg 3
                </div>
                <h3 className="text-3xl font-bold mb-4 flex items-center gap-3">
                  <BarChart className="h-8 w-8 text-accent" />
                  Mätning & Optimering
                </h3>
                <p className="text-lg text-muted-foreground mb-6">
                  Följ resultat i realtid och lär dig vad som fungerar bäst för just ditt företag.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground">Detaljerad analys av kampanjprestanda</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground">ROI-tracking per kampanj</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground">AI-rekommendationer för förbättring</span>
                  </li>
                </ul>
              </div>
              <div className="order-1 md:order-2">
                <div className="glass-card p-8 rounded-2xl border-2 border-accent/20 premium-glow hover:scale-105 transition-all">
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent/10 rounded-full blur-2xl" />
                    <Target className="h-16 w-16 text-accent mb-4 mx-auto relative animate-pulse" />
                  </div>
                  <p className="text-center text-muted-foreground">
                    Se exakt vilka kampanjer som ger bäst resultat
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-accent/5 to-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Resultat du kan förvänta dig</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 border-2 glass-card hover:border-accent/50 transition-all hover:scale-105 premium-glow group">
              <div className="text-5xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform">40%</div>
              <p className="text-sm text-muted-foreground">Ökad försäljning under evenemang</p>
            </Card>
            <Card className="text-center p-6 border-2 glass-card hover:border-accent/50 transition-all hover:scale-105 premium-glow group">
              <div className="text-5xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform">15min</div>
              <p className="text-sm text-muted-foreground">Sparad tid per kampanj</p>
            </Card>
            <Card className="text-center p-6 border-2 glass-card hover:border-accent/50 transition-all hover:scale-105 premium-glow group">
              <div className="text-5xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform">3x</div>
              <p className="text-sm text-muted-foreground">Fler kampanjer per månad</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative container mx-auto px-4 py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-background -z-10" />
        <div className="max-w-4xl mx-auto text-center space-y-8 glass-card p-12 rounded-3xl border-2 premium-glow-lg">
          <h2 className="text-4xl md:text-5xl font-bold">
            Redo att öka din <span className="gradient-text">försäljning</span>?
          </h2>
          <p className="text-xl text-muted-foreground">
            Börja använda Spotlight idag och se resultat redan vid nästa lokala evenemang.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="animated"
              size="xl"
              asChild
            >
              <Link to="/auth">
                Kom igång gratis
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button 
              variant="animatedOutline"
              size="xl"
              asChild
            >
              <Link to="/contact">
                Kontakta oss
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
