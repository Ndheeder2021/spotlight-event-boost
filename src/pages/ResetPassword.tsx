import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="form-container">
        <Link 
          to="/auth" 
          className="link inline-flex items-center gap-2 text-sm hover:underline mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>

        <div className="logo-container">
          Reset Password
        </div>

        <p className="text-gray-600 text-center text-sm">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {sent ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm">
                ✓ Password reset email sent to <strong>{email}</strong>
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Check your inbox and click the link to reset your password. The link will expire in 1 hour.
            </p>
            <button
              onClick={() => navigate("/auth")}
              className="form-submit-btn"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="form">
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="form-submit-btn"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <div className="signup-link">
          Remember your password? <Link to="/auth" className="link">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
