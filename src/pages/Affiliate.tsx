import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { SEO } from "@/components/SEO";
import { Zap, DollarSign, Users, TrendingUp, CheckCircle, Menu, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const benefits = [
  {
    icon: DollarSign,
    title: "Generös provision",
    description: "Tjäna upp till 30% återkommande provision på varje betalande kund du refererar"
  },
  {
    icon: Users,
    title: "Obegränsad potential",
    description: "Ingen gräns för hur mycket du kan tjäna - desto fler du refererar, desto mer tjänar du"
  },
  {
    icon: TrendingUp,
    title: "Återkommande intäkter",
    description: "Få provision varje månad så länge dina refererade kunder är aktiva"
  }
];

const howItWorks = [
  {
    step: "1",
    title: "Ansök till programmet",
    description: "Fyll i ansökningsformuläret och berätta om hur du planerar att marknadsföra Spotlight"
  },
  {
    step: "2",
    title: "Få din unika länk",
    description: "Efter godkännande får du tillgång till din personliga affiliate-dashboard med spårningslänkar"
  },
  {
    step: "3",
    title: "Dela och tjäna",
    description: "Dela dina länkar med din målgrupp och börja tjäna provision på alla konverteringar"
  },
  {
    step: "4",
    title: "Få utbetalning",
    description: "Ta ut dina intjänade provisioner månadsvis direkt till ditt bankkonto"
  }
];

const Affiliate = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Affiliate Program - Spotlight"
        description="Bli en Spotlight affiliate partner och tjäna generös provision genom att referera lokala företag till vår AI-driven event marketing plattform."
        keywords="affiliate program, partner program, marknadsföring, provision"
      />

      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Zap className="h-6 w-6 text-accent" fill="currentColor" />
            <span className="text-xl font-bold">Spotlight</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Plans & Perks <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border z-50">
                <DropdownMenuItem asChild>
                  <Link to="/pricing" className="cursor-pointer">
                    Priser
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/refer-a-friend" className="cursor-pointer">
                    Refer a Friend
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/affiliate" className="cursor-pointer">
                    Affiliate
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Kontakt
            </Link>
            <LanguageSwitch />
            <ThemeToggle />
            {user ? (
              <Link to="/dashboard">
                <Button>
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="outline">
                    Logga in
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-accent hover:bg-accent-dark text-accent-foreground">
                    Kom igång
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitch />
            <ThemeToggle />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 mt-8">
                  <div className="text-sm font-semibold text-muted-foreground mb-2">Plans & Perks</div>
                  <Link to="/pricing" className="text-lg font-medium pl-4" onClick={() => setMobileMenuOpen(false)}>
                    Priser
                  </Link>
                  <Link to="/refer-a-friend" className="text-lg font-medium pl-4" onClick={() => setMobileMenuOpen(false)}>
                    Refer a Friend
                  </Link>
                  <Link to="/affiliate" className="text-lg font-medium pl-4" onClick={() => setMobileMenuOpen(false)}>
                    Affiliate
                  </Link>
                  <Link to="/contact" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Kontakt
                  </Link>
                  {user ? (
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full">
                        Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Logga in
                        </Button>
                      </Link>
                      <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="bg-accent hover:bg-accent-dark text-accent-foreground w-full">
                          Kom igång
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background">
        <div className="container relative mx-auto px-4 sm:px-6 pt-32 pb-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
              Bli en Spotlight <span className="text-primary">Affiliate Partner</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tjäna generös provision genom att hjälpa lokala företag växa med vår AI-drivna event marketing plattform
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/contact">
                <Button 
                  size="lg"
                  className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold"
                >
                  Ansök nu
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Varför bli affiliate partner?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Vi erbjuder ett av marknadens mest generösa affiliate-program
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <benefit.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle className="text-2xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Så fungerar det</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Kom igång på några minuter och börja tjäna provision
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-6">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Provisionsstruktur</h2>
              <p className="text-xl text-muted-foreground">
                Transparent och rättvis provision på alla dina refererade kunder
              </p>
            </div>

            <Card className="border-2">
              <CardContent className="pt-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Starter Plan</h3>
                      <p className="text-muted-foreground">20% återkommande provision ($5.80/månad per kund)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Professional Plan</h3>
                      <p className="text-muted-foreground">25% återkommande provision ($12.25/månad per kund)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Enterprise Plan</h3>
                      <p className="text-muted-foreground">30% återkommande provision på anpassade enterprise-avtal</p>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t mt-8">
                    <p className="text-sm text-muted-foreground">
                      * Provision betalas ut månadsvis via banköverföring. Minimum utbetalning: $100. 
                      Cookie-längd: 90 dagar.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Redo att börja tjäna?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Ansök till vårt affiliate-program idag och börja tjäna provision på dina referrals
            </p>
            <Link to="/contact">
              <Button 
                size="lg"
                className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold"
              >
                Ansök till programmet
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Affiliate;
