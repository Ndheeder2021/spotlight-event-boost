import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/AuthForm";
import { OnboardingForm } from "@/components/OnboardingForm";
import { Sparkles } from "lucide-react";
import { Session, User } from "@supabase/supabase-js";

const Index = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      checkProfile(session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkProfile = async (user: User | null | undefined) => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("business_name")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      if (!data?.business_name || data.business_name === "My Business") {
        setNeedsOnboarding(true);
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setNeedsOnboarding(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      checkProfile(session?.user);
    });
  };

  const handleOnboardingComplete = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">Spotlight</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold">Spotlight</h1>
          </div>
          <p className="text-muted-foreground">
            Turn local events into local profits
          </p>
        </div>

        {!user ? (
          <AuthForm onSuccess={handleAuthSuccess} />
        ) : needsOnboarding ? (
          <OnboardingForm userId={user.id} onComplete={handleOnboardingComplete} />
        ) : null}
      </div>
    </div>
  );
};

export default Index;
