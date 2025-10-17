import { Outlet, useNavigate, NavLink, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Home, Calendar, Megaphone, Bell, Settings, BarChart, Zap, TrendingUp, Shield, Menu } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { AILiveSupport } from "./AILiveSupport";
import { usePlanFeatures } from "@/hooks/usePlanFeatures";
import { Footer } from "./Footer";
import { ThemeToggle } from "./ThemeToggle";
import { SkipToContent } from "./SkipToContent";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Check if user is admin
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin");
        
        setIsAdmin(roles && roles.length > 0);
      }
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
      <SkipToContent />
      <header className="border-b bg-background" role="banner">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0" aria-label="Spotlight - Hem">
              <Zap className="h-6 w-6 text-primary" fill="currentColor" />
              <span className="text-xl font-bold">Spotlight</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6 flex-1 justify-center" aria-label="Huvudnavigation">
              {navItems.map((item) => (
                <NavLink
                  key={item.url}
                  to={item.url}
                  className={({ isActive }) =>
                    `flex items-center gap-2 text-sm transition-colors hover:text-primary whitespace-nowrap ${
                      isActive ? "text-primary font-medium" : "text-muted-foreground"
                    }`
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </NavLink>
              ))}
              {isAdmin && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `flex items-center gap-2 text-sm transition-colors hover:text-primary whitespace-nowrap ${
                      isActive ? "text-primary font-medium" : "text-muted-foreground"
                    }`
                  }
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </NavLink>
              )}
            </nav>
            
            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
              <ThemeToggle />
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logga ut
              </Button>
            </div>

            {/* Mobile Menu */}
            <div className="flex lg:hidden items-center gap-2">
              <ThemeToggle />
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Öppna navigation">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                  <nav className="flex flex-col gap-4 mt-8">
                    {navItems.map((item) => (
                      <NavLink
                        key={item.url}
                        to={item.url}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 text-base transition-colors hover:text-primary px-2 py-2 rounded-md ${
                            isActive ? "text-primary font-medium bg-accent/10" : "text-muted-foreground"
                          }`
                        }
                      >
                        <item.icon className="h-5 w-5" />
                        {item.title}
                      </NavLink>
                    ))}
                    {isAdmin && (
                      <NavLink
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 text-base transition-colors hover:text-primary px-2 py-2 rounded-md ${
                            isActive ? "text-primary font-medium bg-accent/10" : "text-muted-foreground"
                          }`
                        }
                      >
                        <Shield className="h-5 w-5" />
                        Admin
                      </NavLink>
                    )}
                    <div className="pt-4 mt-4 border-t">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-3" 
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleLogout();
                        }}
                      >
                        <LogOut className="h-5 w-5" />
                        Logga ut
                      </Button>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-auto" id="main-content" role="main">
        <Outlet />
      </main>
      
      <Footer />
      
      {/* AI Live Support for paid users */}
      {showAISupport && <AILiveSupport />}
    </div>
  );
}
