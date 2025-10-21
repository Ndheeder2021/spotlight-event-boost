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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between gap-8">
          {/* Logo */}
          <Link 
            to={isAuthenticated ? "/dashboard" : "/"} 
            className="flex items-center gap-3 hover:opacity-90 transition-all duration-300 hover:scale-105 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary-glow/30 blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-60 group-hover:opacity-100 rounded-full" />
              <Zap className="h-10 w-10 text-primary relative z-10 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 drop-shadow-lg" fill="currentColor" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent tracking-tight">
              Spotlight
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-6 flex-1 justify-center">
            {navItems.map((item) => (
              <NavLink
                key={item.url}
                to={item.url}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-5 py-3 text-base font-semibold transition-all duration-300 rounded-xl hover:scale-105 whitespace-nowrap relative group ${
                    isActive 
                      ? "text-primary bg-gradient-to-r from-accent/80 to-accent/60 shadow-md" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    <span>{item.title}</span>
                    {!isActive && <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />}
                  </>
                )}
              </NavLink>
            ))}

            {/* More Dropdown for Authenticated Users */}
            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2.5 px-5 py-3 text-base font-semibold hover:bg-accent/60 hover:scale-105 transition-all duration-300 rounded-xl group relative"
                  >
                    <span>Mer</span>
                    <ChevronDown className="h-4 w-4 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="center" 
                  className="w-64 bg-background/98 backdrop-blur-xl border border-border/60 shadow-2xl animate-in fade-in-0 zoom-in-95 z-50 rounded-2xl p-2"
                  sideOffset={12}
                >
                  <DropdownMenuLabel className="text-base font-bold px-3 py-2.5 bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-lg mb-1">
                    Verktyg
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-2" />
                  {moreMenuItems.map((item) => (
                    <DropdownMenuItem key={item.url} asChild>
                      <Link
                        to={item.url}
                        className="flex items-center gap-3 px-3 py-3 text-base font-medium cursor-pointer hover:bg-accent/90 transition-all duration-200 rounded-xl group"
                      >
                        <item.icon className="h-5 w-5 text-primary/70 group-hover:text-primary transition-colors group-hover:scale-110 duration-200" />
                        <span className="group-hover:translate-x-0.5 transition-transform duration-200">{item.title}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator className="my-2" />
                      <DropdownMenuItem asChild>
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 px-3 py-3 text-base font-medium cursor-pointer hover:bg-accent/90 transition-all duration-200 rounded-xl group"
                        >
                          <Shield className="h-5 w-5 text-primary/70 group-hover:text-primary transition-colors group-hover:scale-110 duration-200" />
                          <span className="group-hover:translate-x-0.5 transition-transform duration-200">{t("admin")}</span>
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
                    className="flex items-center gap-2.5 px-5 py-3 text-base font-semibold hover:bg-accent/60 hover:scale-105 transition-all duration-300 rounded-xl group relative"
                  >
                    <span>Prices & Perks</span>
                    <ChevronDown className="h-4 w-4 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="center" 
                  className="w-64 bg-background/98 backdrop-blur-xl border border-border/60 shadow-2xl animate-in fade-in-0 zoom-in-95 z-50 rounded-2xl p-2"
                  sideOffset={12}
                >
                  <DropdownMenuLabel className="text-base font-bold px-3 py-2.5 bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-lg mb-1">
                    Priser & Förmåner
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-2" />
                  {pricesPerksItems.map((item) => (
                    <DropdownMenuItem key={item.url} asChild>
                      <Link
                        to={item.url}
                        className="flex items-center gap-3 px-3 py-3 text-base font-medium cursor-pointer hover:bg-accent/90 transition-all duration-200 rounded-xl group"
                      >
                        <item.icon className="h-5 w-5 text-primary/70 group-hover:text-primary transition-colors group-hover:scale-110 duration-200" />
                        <span className="group-hover:translate-x-0.5 transition-transform duration-200">{item.title}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <LanguageSwitch />
            <ThemeToggle />
            {isAuthenticated ? (
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleLogout}
                className="gap-2.5 px-6 py-3 hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 hover:scale-105 rounded-xl font-semibold border-2"
              >
                <LogOut className="h-4 w-4" />
                {t("logout")}
              </Button>
            ) : (
              <Button 
                size="lg" 
                asChild
                className="gap-2.5 px-8 py-3 bg-gradient-to-r from-primary via-primary-glow to-primary hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl rounded-xl font-bold text-base relative overflow-hidden group"
              >
                <Link to="/auth">
                  <span className="relative z-10">Kom igång</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-glow to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
