import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { showErrorToast } from "@/utils/errorMessages";
export default function Auth() {
  const {
    t
  } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    agreeToTerms: false
  });
  useEffect(() => {
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      if (session) {
        navigate("/dashboard");
      } else {
        setLoading(false);
      }
    });
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
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
        const {
          error
        } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        if (error) throw error;
        toast.success(t("authSuccessWelcome"));
      } else {
        const referralCode = localStorage.getItem('referral_code');
        const {
          error
        } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              username: formData.username,
              referral_code: referralCode || null
            }
          }
        });
        if (error) throw error;
        if (referralCode) {
          try {
            const {
              error: trackError
            } = await supabase.functions.invoke('track-referral-signup', {
              body: {
                referral_code: referralCode,
                referred_email: formData.email
              }
            });
            if (trackError) {
              console.error('Error tracking referral:', trackError);
            }
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
    return <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>;
  }
  return <div className={`auth-diagonal-layout min-h-screen relative ${isLogin ? 'login-active' : ''}`}>
      <div className="container mx-auto px-4 relative z-10 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-8 w-full max-w-6xl mx-auto">
          {/* Left Side - Changes based on mode */}
          <div className={`flex flex-col justify-center ${isLogin ? 'order-1' : 'order-2'}`}>
            {isLogin ? <div className="text-center lg:text-left space-y-6 p-8">
                <h2 className="text-4xl font-bold text-white">Don't have an account?</h2>
                <p className="text-lg text-white/90">
                  Create your account now to follow people and like publications
                </p>
                <Button variant="outline" size="lg" className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-primary transition-all px-12 py-6 text-lg rounded-full" onClick={() => setIsLogin(false)}>
                  SIGN UP
                </Button>
              </div> : <div className="bg-background rounded-3xl p-8 lg:p-12 shadow-2xl">
                <h1 className="text-4xl font-bold mb-8 text-foreground">Create Account</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <User className="auth-input-icon h-5 w-5" />
                    <Input placeholder="Username" value={formData.username} onChange={e => setFormData({
                  ...formData,
                  username: e.target.value
                })} required className="auth-input-with-icon h-14 bg-muted border-0 rounded-2xl text-base" />
                  </div>

                  <div className="relative">
                    <Mail className="auth-input-icon h-5 w-5" />
                    <Input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({
                  ...formData,
                  email: e.target.value
                })} required className="auth-input-with-icon h-14 bg-muted border-0 rounded-2xl text-base" />
                  </div>

                  <div className="relative">
                    <Lock className="auth-input-icon h-5 w-5" />
                    <Input type={showPassword ? "text" : "password"} placeholder="Password" value={formData.password} onChange={e => setFormData({
                  ...formData,
                  password: e.target.value
                })} required className="auth-input-with-icon h-14 bg-muted border-0 rounded-2xl text-base pr-12" />
                    {showPassword ? <EyeOff className="auth-eye-icon h-5 w-5" onClick={() => setShowPassword(false)} /> : <Eye className="auth-eye-icon h-5 w-5" onClick={() => setShowPassword(true)} />}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" checked={formData.agreeToTerms} onCheckedChange={checked => setFormData({
                  ...formData,
                  agreeToTerms: checked as boolean
                })} />
                    <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                      I accept the{" "}
                      <Link to="/terms" className="text-primary hover:underline">
                        terms and conditions
                      </Link>
                    </label>
                  </div>

                  <Button type="submit" className="w-full h-14 bg-primary hover:bg-primary-dark text-white text-lg font-semibold rounded-full transition-all" disabled={submitting}>
                    {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "SIGN UP"}
                  </Button>
                </form>
              </div>}
          </div>

          {/* Right Side - Changes based on mode */}
          <div className={`flex flex-col justify-center ${isLogin ? 'order-2' : 'order-1'}`}>
            {isLogin ? <div className="bg-background rounded-3xl p-8 lg:p-12 shadow-2xl">
                <h1 className="text-4xl font-bold mb-8 text-foreground">Sign In</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <User className="auth-input-icon h-5 w-5" />
                    <Input type="email" placeholder="Username" value={formData.email} onChange={e => setFormData({
                  ...formData,
                  email: e.target.value
                })} required className="auth-input-with-icon h-14 bg-muted border-0 rounded-2xl text-base" />
                  </div>

                  <div className="relative">
                    <Lock className="auth-input-icon h-5 w-5" />
                    <Input type={showPassword ? "text" : "password"} placeholder="Password" value={formData.password} onChange={e => setFormData({
                  ...formData,
                  password: e.target.value
                })} required className="auth-input-with-icon h-14 bg-muted border-0 rounded-2xl text-base pr-12" />
                    {showPassword ? <EyeOff className="auth-eye-icon h-5 w-5" onClick={() => setShowPassword(false)} /> : <Eye className="auth-eye-icon h-5 w-5" onClick={() => setShowPassword(true)} />}
                  </div>

                  <div className="text-right">
                    <Link to="/reset-password" className="text-sm text-muted-foreground hover:text-primary">
                      Forgot your password?
                    </Link>
                  </div>

                  <Button type="submit" className="w-full h-14 bg-primary hover:bg-primary-dark text-white text-lg font-semibold rounded-full transition-all" disabled={submitting}>
                    {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "LOGIN"}
                  </Button>
                </form>
              </div> : <div className="text-center lg:text-right space-y-6 p-8">
                <h2 className="text-4xl font-bold text-primary">Already have an account?</h2>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white transition-all px-12 py-6 text-lg rounded-full"
                  onClick={() => setIsLogin(true)}
                >
                  SIGN IN
                </Button>
              </div>}
          </div>
        </div>
      </div>

      {/* Close button */}
      <Link to="/" className="absolute top-6 right-6 z-20">
        <Button variant="ghost" size="icon" className="rounded-full bg-white/10 hover:bg-white/20 text-white">
          ✕
        </Button>
      </Link>
    </div>;
}