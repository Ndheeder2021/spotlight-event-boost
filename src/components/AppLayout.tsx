import { Outlet, useNavigate, NavLink, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Home, Calendar, Megaphone, Bell, Settings, BarChart, Zap, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { AILiveSupport } from "./AILiveSupport";
import { usePlanFeatures } from "@/hooks/usePlanFeatures";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Kampanjer", url: "/campaigns", icon: Megaphone },
  { title: "Analytics", url: "/campaign-analytics", icon: TrendingUp },
  { title: "Kalender", url: "/calendar", icon: Calendar },
  { title: "Rapporter", url: "/reports", icon: BarChart },
  { title: "Notifieringar", url: "/notifications", icon: Bell },
  { title: "Inställningar", url: "/settings", icon: Settings },
];

export function AppLayout() {
  const navigate = useNavigate();
  const { features, loading } = usePlanFeatures();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      navigate("/");
    }
  };

  // Show AI support only for professional and enterprise plans
  const showAISupport = !loading && user && (features.plan === "professional" || features.plan === "enterprise");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Zap className="h-6 w-6 text-primary" fill="currentColor" />
              <span className="text-xl font-bold">Spotlight</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
              {navItems.map((item) => (
                <NavLink
                  key={item.url}
                  to={item.url}
                  className={({ isActive }) =>
                    `flex items-center gap-2 text-sm transition-colors hover:text-primary ${
                      isActive ? "text-primary font-medium" : "text-muted-foreground"
                    }`
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </NavLink>
              ))}
            </nav>
            
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logga ut
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
      
      {/* AI Live Support for paid users */}
      {showAISupport && <AILiveSupport />}
    </div>
  );
}
