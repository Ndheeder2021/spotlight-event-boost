import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { SEO } from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Zap, DollarSign, Users, TrendingUp, CheckCircle, Menu, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { z } from "zod";

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

const affiliateSchema = z.object({
  name: z.string().trim().min(1, "Namn krävs").max(100, "Namn måste vara mindre än 100 tecken"),
  email: z.string().trim().email("Ogiltig e-postadress").max(255, "E-post måste vara mindre än 255 tecken"),
  company: z.string().trim().max(100, "Företagsnamn måste vara mindre än 100 tecken").optional(),
  website: z.string().trim().url("Ogiltig webbadress").max(255, "Webbadress måste vara mindre än 255 tecken").optional().or(z.literal("")),
  description: z.string().trim().min(50, "Beskriv hur du planerar att marknadsföra Spotlight (minst 50 tecken)").max(1000, "Beskrivning måste vara mindre än 1000 tecken"),
  audience: z.string().trim().min(20, "Beskriv din målgrupp (minst 20 tecken)").max(500, "Målgrupp måste vara mindre än 500 tecken"),
});

const Affiliate = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    website: "",
    description: "",
    audience: "",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      const validatedData = affiliateSchema.parse(formData);

      // Send email via edge function
      const { error } = await supabase.functions.invoke("send-affiliate-application", {
        body: validatedData,
      });

      if (error) throw error;

      toast.success("Tack för din ansökan! Vi återkommer inom 2-3 arbetsdagar.");
      setFormData({
        name: "",
        email: "",
        company: "",
        website: "",
        description: "",
        audience: "",
      });
      setShowForm(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast.error(firstError.message);
      } else {
        console.error("Error submitting application:", error);
        toast.error("Något gick fel. Försök igen senare.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <Button 
                size="lg"
                onClick={() => setShowForm(true)}
                className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold"
              >
                Ansök nu
              </Button>
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

      {/* Application Form */}
      {showForm && (
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Ansök till vårt affiliate-program</h2>
                <p className="text-xl text-muted-foreground">
                  Fyll i formuläret nedan så återkommer vi inom 2-3 arbetsdagar
                </p>
              </div>

              <Card className="border-2">
                <CardContent className="pt-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Namn *</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ditt för- och efternamn"
                        required
                        maxLength={100}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">E-post *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="din@epost.se"
                        required
                        maxLength={255}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Företagsnamn (valfritt)</Label>
                      <Input
                        id="company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Ditt företag"
                        maxLength={100}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Webbplats (valfritt)</Label>
                      <Input
                        id="website"
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="https://dinwebbplats.se"
                        maxLength={255}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Hur planerar du att marknadsföra Spotlight? *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Beskriv din strategi för att marknadsföra Spotlight (minst 50 tecken)"
                        required
                        rows={4}
                        maxLength={1000}
                        className="resize-none"
                      />
                      <p className="text-sm text-muted-foreground">
                        {formData.description.length}/1000 tecken
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="audience">Beskriv din målgrupp *</Label>
                      <Textarea
                        id="audience"
                        value={formData.audience}
                        onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                        placeholder="Vilka är dina följare/kunder? (minst 20 tecken)"
                        required
                        rows={3}
                        maxLength={500}
                        className="resize-none"
                      />
                      <p className="text-sm text-muted-foreground">
                        {formData.audience.length}/500 tecken
                      </p>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowForm(false)}
                        className="flex-1"
                      >
                        Avbryt
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-primary hover:bg-primary/90"
                      >
                        {isSubmitting ? "Skickar..." : "Skicka ansökan"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {!showForm && (
        <section className="py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                Redo att börja tjäna?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Ansök till vårt affiliate-program idag och börja tjäna provision på dina referrals
              </p>
              <Button 
                size="lg"
                onClick={() => setShowForm(true)}
                className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold"
              >
                Ansök till programmet
              </Button>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Affiliate;
