import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Menu, 
  ChevronDown, 
  Home, 
  Calendar, 
  Megaphone, 
  Bell, 
  Settings, 
  BarChart, 
  TrendingUp, 
  Shield, 
  LogOut,
  BookOpen,
  DollarSign,
  Users,
  Gift
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitch } from "./LanguageSwitch";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";

interface GlobalHeaderProps {
  variant?: "default" | "authenticated";
}

export function GlobalHeader({ variant = "default" }: GlobalHeaderProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const publicNavItems = [
    { title: "Kontakta oss", url: "/contact", icon: Users },
  ];

  const authenticatedNavItems = [
    { title: t("dashboard"), url: "/dashboard", icon: Home },
    { title: t("campaigns"), url: "/campaigns", icon: Megaphone },
    { title: t("analytics"), url: "/campaign-analytics", icon: TrendingUp },
    { title: t("calendar"), url: "/calendar", icon: Calendar },
    { title: t("reports"), url: "/reports", icon: BarChart },
  ];

  const moreMenuItems = [
    { title: t("notifications"), url: "/notifications", icon: Bell },
    { title: t("settings"), url: "/settings", icon: Settings },
  ];

  const pricesPerksItems = [
    { title: "Priser", url: "/pricing", icon: DollarSign },
    { title: "Refer a Friend", url: "/refer-a-friend", icon: Gift },
    { title: "Affiliate", url: "/affiliate", icon: Users },
  ];

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin");
        
        setIsAdmin(roles && roles.length > 0);
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      navigate("/");
    }
  };

  const navItems = variant === "authenticated" ? authenticatedNavItems : publicNavItems;
  const isAuthenticated = variant === "authenticated" || user;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-6">
          {/* Logo */}
          <Link 
            to={isAuthenticated ? "/dashboard" : "/"} 
            className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 hover:scale-105 group"
          >
            <div className="relative">
              <Zap className="h-8 w-8 text-primary transition-transform duration-300 group-hover:rotate-12" fill="currentColor" />
              <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Spotlight
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-4 flex-1 justify-center">
            {navItems.map((item) => (
              <NavLink
                key={item.url}
                to={item.url}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2.5 text-base font-medium transition-all duration-200 rounded-lg hover:bg-accent/50 hover:scale-105 whitespace-nowrap ${
                    isActive 
                      ? "text-primary bg-accent shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </NavLink>
            ))}

            {/* More Dropdown for Authenticated Users */}
            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 px-4 py-2.5 text-base font-medium hover:bg-accent/50 hover:scale-105 transition-all duration-200 rounded-lg"
                  >
                    <span>Mer</span>
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="center" 
                  className="w-56 bg-background/95 backdrop-blur-sm border-border shadow-xl animate-in fade-in-0 zoom-in-95 z-50"
                  sideOffset={8}
                >
                  <DropdownMenuLabel className="text-base font-semibold">
                    Verktyg
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {moreMenuItems.map((item) => (
                    <DropdownMenuItem key={item.url} asChild>
                      <Link
                        to={item.url}
                        className="flex items-center gap-3 px-3 py-2.5 text-base cursor-pointer hover:bg-accent/80 transition-colors"
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 px-3 py-2.5 text-base cursor-pointer hover:bg-accent/80 transition-colors"
                        >
                          <Shield className="h-5 w-5" />
                          <span>{t("admin")}</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Prices & Perks Dropdown for Public */}
            {!isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 px-4 py-2.5 text-base font-medium hover:bg-accent/50 hover:scale-105 transition-all duration-200 rounded-lg"
                  >
                    <span>Prices & Perks</span>
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="center" 
                  className="w-56 bg-background/95 backdrop-blur-sm border-border shadow-xl animate-in fade-in-0 zoom-in-95 z-50"
                  sideOffset={8}
                >
                  <DropdownMenuLabel className="text-base font-semibold">
                    Priser & Förmåner
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {pricesPerksItems.map((item) => (
                    <DropdownMenuItem key={item.url} asChild>
                      <Link
                        to={item.url}
                        className="flex items-center gap-3 px-3 py-2.5 text-base cursor-pointer hover:bg-accent/80 transition-colors"
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitch />
            <ThemeToggle />
            {isAuthenticated ? (
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleLogout}
                className="gap-2 hover:bg-destructive hover:text-destructive-foreground transition-all duration-200 hover:scale-105"
              >
                <LogOut className="h-4 w-4" />
                {t("logout")}
              </Button>
            ) : (
              <Button 
                size="lg" 
                asChild
                className="gap-2 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <Link to="/auth">
                  Kom igång
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex lg:hidden items-center gap-2">
            <LanguageSwitch />
            <ThemeToggle />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-11 w-11">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] bg-background/95 backdrop-blur-xl">
                <nav className="flex flex-col gap-2 mt-8">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.url}
                      to={item.url}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3.5 text-base font-medium transition-all rounded-lg ${
                          isActive 
                            ? "text-primary bg-accent shadow-sm" 
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      {item.title}
                    </NavLink>
                  ))}

                  {isAuthenticated && (
                    <>
                      <div className="border-t my-2" />
                      {moreMenuItems.map((item) => (
                        <NavLink
                          key={item.url}
                          to={item.url}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3.5 text-base font-medium transition-all rounded-lg ${
                              isActive 
                                ? "text-primary bg-accent shadow-sm" 
                                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
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
                            `flex items-center gap-3 px-4 py-3.5 text-base font-medium transition-all rounded-lg ${
                              isActive 
                                ? "text-primary bg-accent shadow-sm" 
                                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                            }`
                          }
                        >
                          <Shield className="h-5 w-5" />
                          {t("admin")}
                        </NavLink>
                      )}
                    </>
                  )}

                  {!isAuthenticated && (
                    <>
                      <div className="border-t my-2" />
                      <div className="px-4 py-2 text-sm font-semibold text-muted-foreground">
                        Prices & Perks
                      </div>
                      {pricesPerksItems.map((item) => (
                        <NavLink
                          key={item.url}
                          to={item.url}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3.5 text-base font-medium transition-all rounded-lg ${
                              isActive 
                                ? "text-primary bg-accent shadow-sm" 
                                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                            }`
                          }
                        >
                          <item.icon className="h-5 w-5" />
                          {item.title}
                        </NavLink>
                      ))}
                    </>
                  )}

                  <div className="border-t pt-4 mt-4">
                    {isAuthenticated ? (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-3 h-12" 
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleLogout();
                        }}
                      >
                        <LogOut className="h-5 w-5" />
                        {t("logout")}
                      </Button>
                    ) : (
                      <Button 
                        className="w-full h-12 gap-2 bg-gradient-to-r from-primary to-primary-glow" 
                        asChild
                      >
                        <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                          Kom igång
                        </Link>
                      </Button>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
