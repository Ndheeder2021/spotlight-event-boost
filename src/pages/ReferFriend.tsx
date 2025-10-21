import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Zap, Copy, Check, Gift, TrendingUp, Users, DollarSign } from "lucide-react";

export default function ReferFriend() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [referralData, setReferralData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check URL for referral code
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    
    if (refCode) {
      // Store referral code in localStorage for later use during signup
      localStorage.setItem('referral_code', refCode);
      toast.success("Referral kod sparad! Skapa ett konto för att fortsätta.");
    }
  }, []);

  const generateReferralCode = async () => {
    if (!email) {
      toast.error("Vänligen ange din e-postadress");
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Vänligen ange en giltig e-postadress");
      return;
    }

    setLoading(true);

    try {
      // Check if email already has a referral code
      const { data: existing, error: checkError } = await supabase
        .from('referrals')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existing) {
        setReferralData(existing);
        toast.success("Välkommen tillbaka! Din referral-länk är klar.");
      } else {
        // Generate new referral code using the database function
        const { data: codeData, error: codeError } = await supabase
          .rpc('generate_referral_code');

        if (codeError) throw codeError;

        // Create new referral entry
        const { data: newReferral, error: insertError } = await supabase
          .from('referrals')
          .insert({
            email: email,
            referral_code: codeData
          })
          .select()
          .single();

        if (insertError) throw insertError;

        setReferralData(newReferral);
        toast.success("Din referral-länk har skapats!");
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || "Något gick fel");
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}/?ref=${referralData.referral_code}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Länk kopierad!");
    setTimeout(() => setCopied(false), 2000);
  };

  const referralLink = referralData ? `${window.location.origin}/?ref=${referralData.referral_code}` : '';

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
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:inline">
              Hem
            </Link>
            <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:inline">
              Priser
            </Link>
            <LanguageSwitch />
            <ThemeToggle />
            <Link to="/auth">
              <Button className="bg-accent hover:bg-accent-dark text-accent-foreground">
                Logga in
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-20 lg:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <div className="bg-primary/10 rounded-full p-4">
                <Gift className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Bjud in dina vänner,<br />
              <span className="text-primary">tjäna pengar</span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Dela Spotlight med dina vänner och få 20% provision på varje betalning de gör under första året
            </p>
          </div>

          {/* Main Card */}
          <Card className="max-w-2xl mx-auto mb-16 border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Kom igång med ditt referral-program</CardTitle>
              <CardDescription className="text-base">
                Ange din e-postadress för att få din unika referral-länk
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!referralData ? (
                <div className="space-y-4">
                  <Input
                    type="email"
                    placeholder="din@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 text-base"
                    onKeyPress={(e) => e.key === 'Enter' && generateReferralCode()}
                  />
                  <Button
                    onClick={generateReferralCode}
                    disabled={loading}
                    className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
                  >
                    {loading ? "Skapar..." : "Få min referral-länk"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Din unika referral-länk</label>
                    <div className="flex gap-2">
                      <Input
                        value={referralLink}
                        readOnly
                        className="h-12 font-mono text-sm"
                      />
                      <Button
                        onClick={copyReferralLink}
                        variant="outline"
                        className="h-12 px-6"
                      >
                        {copied ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <Copy className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <Card className="text-center p-4">
                      <Users className="h-6 w-6 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold">{referralData.referred_count}</p>
                      <p className="text-sm text-muted-foreground">Referenser</p>
                    </Card>
                    <Card className="text-center p-4">
                      <DollarSign className="h-6 w-6 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold">${referralData.total_commission}</p>
                      <p className="text-sm text-muted-foreground">Intjänat</p>
                    </Card>
                    <Card className="text-center p-4">
                      <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold">{(referralData.commission_rate * 100).toFixed(0)}%</p>
                      <p className="text-sm text-muted-foreground">Provision</p>
                    </Card>
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    <p>Dela länken via email, sociala medier eller direkt med dina vänner!</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* How it Works */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Så här fungerar det</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-8">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Dela din länk</h3>
                <p className="text-muted-foreground">
                  Dela din unika referral-länk med vänner och kollegor som kan ha nytta av Spotlight
                </p>
              </Card>

              <Card className="text-center p-8">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-bold mb-3">De registrerar sig</h3>
                <p className="text-muted-foreground">
                  När dina vänner skapar ett konto och väljer en betalplan får du provision
                </p>
              </Card>

              <Card className="text-center p-8">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Tjäna pengar</h3>
                <p className="text-muted-foreground">
                  Få 20% provision på alla deras betalningar under det första året
                </p>
              </Card>
            </div>
          </div>

          {/* Benefits */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Varför bli en Spotlight-partner?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <Check className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Generös provision</h3>
                    <p className="text-sm text-muted-foreground">20% av alla betalningar första året</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Check className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Obegränsade referenser</h3>
                    <p className="text-sm text-muted-foreground">Ingen gräns för hur många du kan hänvisa</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Check className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Enkel spårning</h3>
                    <p className="text-sm text-muted-foreground">Se alla dina referenser och intäkter i realtid</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Check className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Snabba utbetalningar</h3>
                    <p className="text-sm text-muted-foreground">Få dina provisioner månadsvis direkt till ditt konto</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
