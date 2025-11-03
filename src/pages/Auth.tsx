import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Zap, Users, TrendingUp, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { showErrorToast } from "@/utils/errorMessages";

export default function Auth() {
  const { t } = useTranslation();
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
      toast.error(t("authErrorTerms"));
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
        toast.success(t("authSuccessWelcome"));
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
            // Track referral through Edge Function with service role
            const { error: trackError } = await supabase.functions.invoke('track-referral-signup', {
              body: {
                referral_code: referralCode,
                referred_email: formData.email
              }
            });

            if (trackError) {
              console.error('Error tracking referral:', trackError);
            }
            
            // Clear referral code from localStorage
            localStorage.removeItem('referral_code');
          } catch (refError) {
            console.error('Error tracking referral:', refError);
          }
        }
        
        toast.success(t("authSuccessCreated"));
      }
    } catch (error: any) {
      showErrorToast(toast, error, t("authErrorGeneric"));
    } finally {
      setSubmitting(false);
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
    <div className={`auth-wrapper min-h-screen bg-background overflow-hidden relative ${!isLogin ? 'register-active' : ''}`}>
      {/* Animated Background Circle */}
      <div className="animated-circle" />
      
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur relative z-10">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Zap className="h-6 w-6 text-primary" fill="currentColor" />
            <span className="text-xl font-bold gradient-text">Spotlight</span>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="icon">
              ✕
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 lg:py-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 max-w-7xl mx-auto">
          {/* Left Column - Form */}
          <div className="flex flex-col justify-center max-w-md mx-auto w-full fade-in-up">
            <div className="mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold mb-3 gradient-text">
                {isLogin ? t("authWelcomeBack") : t("authCreateAccount")}
              </h1>
              <p className="text-muted-foreground text-lg">
                {isLogin ? t("authLoginSubtitle") : t("authSignupSubtitle")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t("authFirstName")}</Label>
                    <Input
                      id="firstName"
                      placeholder={t("authFirstName")}
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      required={!isLogin}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t("authLastName")}</Label>
                    <Input
                      id="lastName"
                      placeholder={t("authLastName")}
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      required={!isLogin}
                      className="h-12"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{t("authEmail")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("authEmailPlaceholder")}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t("authPassword")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("authPasswordPlaceholder")}
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
                    {t("authAgreeToTerms")}{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      {t("authTerms")}
                    </Link>{" "}
                    {t("authAnd")}{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      {t("authPrivacy")}
                    </Link>
                  </Label>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 hover-lift hover-glow shadow-lg"
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : isLogin ? (
                  t("authLoginButton")
                ) : (
                  t("authSignupButton")
                )}
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  {isLogin ? t("authNoAccount") : t("authHaveAccount")}{" "}
                </span>
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:underline font-medium"
                >
                  {isLogin ? t("authRegister") : t("authLoginButton")}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column - Social Proof */}
          <div className="hidden lg:flex flex-col justify-center space-y-8 slide-in-right">
            <div className="space-y-6">
              <div className="inline-block">
                <div className="glass-premium rounded-2xl p-8 backdrop-blur hover-float">
                  <Users className="h-16 w-16 text-primary premium-glow" />
                </div>
              </div>
              
              <h2 className="text-4xl sm:text-5xl font-bold leading-tight gradient-text" dangerouslySetInnerHTML={{ __html: t("authSocialProofTitle") }} />
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                {t("authSocialProofDesc")}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-lg">{t("authFeature1Title")}</p>
                  <p className="text-muted-foreground">{t("authFeature1Desc")}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-lg">{t("authFeature2Title")}</p>
                  <p className="text-muted-foreground">{t("authFeature2Desc")}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-lg">{t("authFeature3Title")}</p>
                  <p className="text-muted-foreground">{t("authFeature3Desc")}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
