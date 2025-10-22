import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Footer } from "./Footer";
import { SkipToContent } from "./SkipToContent";
import { GlobalHeader } from "./GlobalHeader";

export function AppLayout() {
  const navigate = useNavigate();
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Check if user is admin - admins bypass subscription check
        const { data: isAdmin, error: roleError } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin'
        });

        if (!roleError && isAdmin) {
          // Admins don't need a subscription
          setHasSubscription(true);
          setCheckingSubscription(false);
          return;
        }

        // For non-admins, check subscription status
        const { data: subData, error: subError } = await supabase.functions.invoke('check-subscription');
        
        if (subError) {
          console.error("Subscription check error:", subError);
          setHasSubscription(false);
          setCheckingSubscription(false);
          navigate("/");
          return;
        }

        if (!subData?.subscribed) {
          setHasSubscription(false);
          setCheckingSubscription(false);
          navigate("/");
          return;
        }

        setHasSubscription(true);
      }
      
      setCheckingSubscription(false);
    };
    checkUser();
  }, [navigate]);

  if (checkingSubscription) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex items-center gap-2">
          <Zap className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">Spotlight</span>
        </div>
      </div>
    );
  }

  if (!hasSubscription) {
    return null; // Will be redirected by navigate
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SkipToContent />
      <GlobalHeader variant="authenticated" />
      <main className="flex-1 overflow-auto" id="main-content" role="main">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
}
