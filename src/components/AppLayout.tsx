import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Home, Calendar, Megaphone, Bell, Settings, BarChart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Kampanjer", url: "/campaigns", icon: Megaphone },
  { title: "Kalender", url: "/calendar", icon: Calendar },
  { title: "Notifieringar", url: "/notifications", icon: Bell },
  { title: "Rapporter", url: "/reports", icon: BarChart },
  { title: "Inställningar", url: "/settings", icon: Settings },
];

export function AppLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold">Spotlight</h1>
              <nav className="hidden md:flex items-center gap-6">
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
            </div>
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
    </div>
  );
}
