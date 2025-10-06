import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/AuthForm";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Auth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Välkommen till Spotlight</CardTitle>
            <CardDescription>
              Välj hur du vill fortsätta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => setAuthMode("login")}
            >
              Logga in
            </Button>
            <Button 
              className="w-full" 
              variant="outline" 
              size="lg"
              onClick={() => setAuthMode("signup")}
            >
              Skapa konto
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-4">
        <Button 
          variant="ghost" 
          onClick={() => setAuthMode(null)}
          className="mb-2"
        >
          ← Tillbaka
        </Button>
        <AuthForm 
          onSuccess={() => navigate("/dashboard")} 
          initialMode={authMode}
        />
      </div>
    </div>
  );
}
