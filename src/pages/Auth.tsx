import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Zap, Users, TrendingUp, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    agreeToTerms: false
  });

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && !formData.agreeToTerms) {
      toast.error("Du måste acceptera villkoren för att fortsätta");
      return;
    }

    setSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;
        toast.success("Välkommen tillbaka!");
      } else {
        // Check for referral code in localStorage
        const referralCode = localStorage.getItem('referral_code');
        
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              referral_code: referralCode || null
            }
          }
        });

        if (error) throw error;
        
        // If signup successful and there was a referral code, track it
        if (referralCode) {
          try {
            // Insert into referred_users
            await supabase
              .from('referred_users')
              .insert({
                referral_code: referralCode,
                referred_email: formData.email,
                status: 'signed_up'
              });
            
            // Update referral count
            const { data: referralData } = await supabase
              .from('referrals')
              .select('referred_count')
              .eq('referral_code', referralCode)
              .single();
            
            if (referralData) {
              await supabase
                .from('referrals')
                .update({ 
                  referred_count: (referralData.referred_count || 0) + 1 
                })
                .eq('referral_code', referralCode);
            }
            
            // Clear referral code from localStorage
            localStorage.removeItem('referral_code');
          } catch (refError) {
            console.error('Error tracking referral:', refError);
          }
        }
        
        toast.success("Konto skapat! Kontrollera din email för att verifiera.");
      }
    } catch (error: any) {
      toast.error(error.message || "Något gick fel");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Kunde inte logga in med Google");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Zap className="h-6 w-6 text-accent" fill="currentColor" />
            <span className="text-xl font-bold">Spotlight</span>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="icon">
              ✕
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 max-w-7xl mx-auto">
          {/* Left Column - Form */}
          <div className="flex flex-col justify-center max-w-md mx-auto w-full">
            <div className="mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold mb-3">
                {isLogin ? "Välkommen tillbaka" : "Skapa ett nytt konto"}
              </h1>
              <p className="text-muted-foreground text-lg">
                {isLogin ? "Logga in för att fortsätta" : "Kom igång med Spotlight idag"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Förnamn</Label>
                    <Input
                      id="firstName"
                      placeholder="Förnamn"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      required={!isLogin}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Efternamn</Label>
                    <Input
                      id="lastName"
                      placeholder="Efternamn"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      required={!isLogin}
                      className="h-12"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="din@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Lösenord</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  className="h-12"
                />
              </div>

              {!isLogin && (
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => 
                      setFormData({...formData, agreeToTerms: checked as boolean})
                    }
                    className="mt-1"
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                    Jag godkänner Spotlight's{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      Användarvillkor
                    </Link>{" "}
                    och{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Integritetspolicy
                    </Link>
                  </Label>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : isLogin ? (
                  "Logga in"
                ) : (
                  "Kom igång nu"
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">eller</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 text-base font-medium"
                onClick={handleGoogleSignIn}
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {isLogin ? "Logga in med Google" : "Registrera med Google"}
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  {isLogin ? "Har du inget konto?" : "Har du redan ett konto?"}{" "}
                </span>
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:underline font-medium"
                >
                  {isLogin ? "Registrera dig" : "Logga in"}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column - Social Proof */}
          <div className="hidden lg:flex flex-col justify-center space-y-8">
            <div className="space-y-6">
              <div className="inline-block">
                <div className="bg-primary/10 rounded-2xl p-8 backdrop-blur">
                  <Users className="h-16 w-16 text-primary mb-4" />
                </div>
              </div>
              
              <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
                500+ företag<br />
                får fler kunder!
              </h2>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Lås upp kraften i effektiv event-marketing med vår plattform och upplev en kraftig ökning i kundengagemang som aldrig förr.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-lg">AI-drivna kampanjer</p>
                  <p className="text-muted-foreground">Skapa professionella kampanjer på minuter</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-lg">Automatisk event-upptäckt</p>
                  <p className="text-muted-foreground">Vi hittar relevanta evenemang åt dig</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-lg">Resultat som syns</p>
                  <p className="text-muted-foreground">Genomsnittligt 40% försäljningsökning</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8 pt-8">
              <div>
                <div className="text-4xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Nöjda kunder</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">10k+</div>
                <div className="text-sm text-muted-foreground">Kampanjer</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">40%</div>
                <div className="text-sm text-muted-foreground">Mer försäljning</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
