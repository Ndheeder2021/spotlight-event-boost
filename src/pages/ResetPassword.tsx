import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import "./reset-password.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;

      setSent(true);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20 p-4 sm:p-6">
      <Card className="w-full max-w-md shadow-2xl border-border/50 backdrop-blur-sm bg-card/95 rounded-3xl">
        <CardHeader className="space-y-4 sm:space-y-6 pb-6 sm:pb-8 px-4 sm:px-6">
          <Link 
            to="/auth" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium min-h-[44px]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
          
          <div className="space-y-2 sm:space-y-3">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-center tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
              Reset Password
            </CardTitle>
            <CardDescription className="text-center text-sm sm:text-base leading-relaxed">
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-4 sm:px-6">
          {sent ? (
            <div className="space-y-4 sm:space-y-6">
              <div className="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 p-4 sm:p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      Password reset email sent!
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Check <strong>{email}</strong> for the reset link. The link will expire in 1 hour.
                    </p>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={() => navigate("/auth")}
                className="w-full"
                size="lg"
              >
                Return to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email address
                </label>
                <div className="group">
                  <Mail className="icon" />
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}

          <div className="mt-4 sm:mt-6 text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link to="/auth" className="text-primary font-medium hover:underline min-h-[44px] inline-flex items-center">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
