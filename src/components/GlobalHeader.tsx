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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const hoverTimeoutRef = useState<NodeJS.Timeout | null>(null)[0];

  const publicNavItems: { title: string; url: string; icon: any }[] = [];

  const productItems = [
    { title: "Lösning", url: "/solution", icon: Zap },
    { title: "Hur det fungerar", url: "/how-it-works", icon: BookOpen },
  ];

  const blogItems = [
    { title: "Blog", url: "/blog", icon: BookOpen },
    { title: "Case Studies", url: "/case-studies", icon: BarChart },
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
    { title: "Investerare", url: "/investors", icon: TrendingUp },
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

  const handleMouseEnter = (dropdown: string) => {
    if (hoverTimeoutRef) {
      clearTimeout(hoverTimeoutRef);
    }
    setOpenDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };

  const navItems = variant === "authenticated" ? authenticatedNavItems : publicNavItems;
  const isAuthenticated = variant === "authenticated" || user;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 lg:h-24 items-center justify-between gap-2 sm:gap-4 lg:gap-8">
          {/* Logo */}
          <Link 
            to={isAuthenticated ? "/dashboard" : "/"} 
            className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-all duration-300 hover:scale-105 group flex-shrink-0"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary-glow/30 blur-xl sm:blur-2xl group-hover:blur-2xl sm:group-hover:blur-3xl transition-all duration-500 opacity-60 group-hover:opacity-100 rounded-full" />
              <Zap className="h-7 w-7 sm:h-9 sm:w-9 lg:h-10 lg:w-10 text-primary relative z-10 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 drop-shadow-lg" fill="currentColor" />
            </div>
            <span className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent tracking-tight">
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
              <div onMouseEnter={() => handleMouseEnter('more')} onMouseLeave={handleMouseLeave}>
                <DropdownMenu open={openDropdown === 'more'} onOpenChange={(open) => !open && setOpenDropdown(null)}>
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
                    className="w-64 bg-background/98 backdrop-blur-xl border border-border/60 shadow-2xl animate-in fade-in-0 slide-in-from-top-4 duration-300 z-50 rounded-2xl p-2"
                    sideOffset={12}
                  >
                  <DropdownMenuLabel className="text-base font-bold px-3 py-2.5 bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-lg mb-1 animate-in fade-in-0 slide-in-from-top-2 duration-300">
                    Verktyg
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-2" />
                  {moreMenuItems.map((item, index) => (
                    <DropdownMenuItem key={item.url} asChild>
                      <Link
                        to={item.url}
                        className="flex items-center gap-3 px-3 py-3 text-base font-medium cursor-pointer hover:bg-accent/90 transition-all duration-300 rounded-xl group animate-in fade-in-0 slide-in-from-left-2"
                        style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
                      >
                        <item.icon className="h-5 w-5 text-primary/70 group-hover:text-primary transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                        <span className="group-hover:translate-x-1 transition-all duration-300">{item.title}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator className="my-2" />
                      <DropdownMenuItem asChild>
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 px-3 py-3 text-base font-medium cursor-pointer hover:bg-accent/90 transition-all duration-300 rounded-xl group animate-in fade-in-0 slide-in-from-left-2"
                          style={{ animationDelay: `${moreMenuItems.length * 50}ms`, animationFillMode: 'backwards' }}
                        >
                          <Shield className="h-5 w-5 text-primary/70 group-hover:text-primary transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                          <span className="group-hover:translate-x-1 transition-all duration-300">{t("admin")}</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              </div>
            )}

            {/* Product Dropdown for Public */}
            {!isAuthenticated && (
              <>
                <div onMouseEnter={() => handleMouseEnter('product')} onMouseLeave={handleMouseLeave}>
                  <DropdownMenu open={openDropdown === 'product'} onOpenChange={(open) => !open && setOpenDropdown(null)}>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-2.5 px-5 py-3 text-base font-semibold hover:bg-accent/60 hover:scale-105 transition-all duration-300 rounded-xl group relative"
                      >
                        <span>Produkt</span>
                        <ChevronDown className="h-4 w-4 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="center" 
                      className="w-64 bg-background/98 backdrop-blur-xl border border-border/60 shadow-2xl animate-in fade-in-0 slide-in-from-top-4 duration-300 z-50 rounded-2xl p-2"
                      sideOffset={12}
                    >
                  <DropdownMenuLabel className="text-base font-bold px-3 py-2.5 bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-lg mb-1 animate-in fade-in-0 slide-in-from-top-2 duration-300">
                    Produkt
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-2" />
                  {productItems.map((item, index) => (
                    <DropdownMenuItem key={item.url} asChild>
                      <Link
                        to={item.url}
                        className="flex items-center gap-3 px-3 py-3 text-base font-medium cursor-pointer hover:bg-accent/90 transition-all duration-300 rounded-xl group animate-in fade-in-0 slide-in-from-left-2"
                        style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
                      >
                        <item.icon className="h-5 w-5 text-primary/70 group-hover:text-primary transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                        <span className="group-hover:translate-x-1 transition-all duration-300">{item.title}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Blog Dropdown */}
                <div onMouseEnter={() => handleMouseEnter('blog')} onMouseLeave={handleMouseLeave}>
                  <DropdownMenu open={openDropdown === 'blog'} onOpenChange={(open) => !open && setOpenDropdown(null)}>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-2.5 px-5 py-3 text-base font-semibold hover:bg-accent/60 hover:scale-105 transition-all duration-300 rounded-xl group relative"
                      >
                        <span>Blog</span>
                        <ChevronDown className="h-4 w-4 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="center" 
                      className="w-64 bg-background/98 backdrop-blur-xl border border-border/60 shadow-2xl animate-in fade-in-0 slide-in-from-top-4 duration-300 z-50 rounded-2xl p-2"
                      sideOffset={12}
                    >
                  <DropdownMenuLabel className="text-base font-bold px-3 py-2.5 bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-lg mb-1 animate-in fade-in-0 slide-in-from-top-2 duration-300">
                    Blog
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-2" />
                  {blogItems.map((item, index) => (
                    <DropdownMenuItem key={item.url} asChild>
                      <Link
                        to={item.url}
                        className="flex items-center gap-3 px-3 py-3 text-base font-medium cursor-pointer hover:bg-accent/90 transition-all duration-300 rounded-xl group animate-in fade-in-0 slide-in-from-left-2"
                        style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
                      >
                        <item.icon className="h-5 w-5 text-primary/70 group-hover:text-primary transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                        <span className="group-hover:translate-x-1 transition-all duration-300">{item.title}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Prices & Perks Dropdown */}
                <div onMouseEnter={() => handleMouseEnter('perks')} onMouseLeave={handleMouseLeave}>
                  <DropdownMenu open={openDropdown === 'perks'} onOpenChange={(open) => !open && setOpenDropdown(null)}>
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
                      className="w-64 bg-background/98 backdrop-blur-xl border border-border/60 shadow-2xl animate-in fade-in-0 slide-in-from-top-4 duration-300 z-50 rounded-2xl p-2"
                      sideOffset={12}
                    >
                  <DropdownMenuLabel className="text-base font-bold px-3 py-2.5 bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-lg mb-1 animate-in fade-in-0 slide-in-from-top-2 duration-300">
                    Priser & Förmåner
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-2" />
                  {pricesPerksItems.map((item, index) => (
                    <DropdownMenuItem key={item.url} asChild>
                      <Link
                        to={item.url}
                        className="flex items-center gap-3 px-3 py-3 text-base font-medium cursor-pointer hover:bg-accent/90 transition-all duration-300 rounded-xl group animate-in fade-in-0 slide-in-from-left-2"
                        style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
                      >
                        <item.icon className="h-5 w-5 text-primary/70 group-hover:text-primary transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                        <span className="group-hover:translate-x-1 transition-all duration-300">{item.title}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
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
              <>
                <Button 
                  variant="outline" 
                  size="lg" 
                  asChild
                  className="gap-2.5 px-6 py-3 hover:bg-accent hover:text-foreground transition-all duration-300 hover:scale-105 rounded-xl font-semibold border-2"
                >
                  <Link to="/auth">Logga in</Link>
                </Button>
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
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
            <LanguageSwitch />
            <ThemeToggle />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 sm:h-11 sm:w-11">
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="sr-only">Öppna meny</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] max-w-[320px] bg-background/98 backdrop-blur-xl border-l-2 flex flex-col p-0 pb-0">
                <div className="p-4 flex-1 overflow-y-auto">
                  <nav className="flex flex-col gap-1 mt-0">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.url}
                      to={item.url}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-4 text-base font-medium transition-all rounded-xl touch-manipulation ${
                          isActive 
                            ? "text-primary bg-accent/90 shadow-sm font-semibold" 
                            : "text-foreground hover:text-primary hover:bg-accent/60"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </NavLink>
                  ))}

                  {isAuthenticated && (
                    <>
                      <div className="border-t my-3" />
                      <div className="px-2 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Verktyg
                      </div>
                      {moreMenuItems.map((item) => (
                        <NavLink
                          key={item.url}
                          to={item.url}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-4 text-base font-medium transition-all rounded-xl touch-manipulation ${
                              isActive 
                                ? "text-primary bg-accent/90 shadow-sm font-semibold" 
                                : "text-foreground hover:text-primary hover:bg-accent/60"
                            }`
                          }
                        >
                          <item.icon className="h-5 w-5 flex-shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </NavLink>
                      ))}
                      {isAdmin && (
                        <NavLink
                          to="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-4 text-base font-medium transition-all rounded-xl touch-manipulation ${
                              isActive 
                                ? "text-primary bg-accent/90 shadow-sm font-semibold" 
                                : "text-foreground hover:text-primary hover:bg-accent/60"
                            }`
                          }
                        >
                          <Shield className="h-5 w-5 flex-shrink-0" />
                          <span className="truncate">{t("admin")}</span>
                        </NavLink>
                      )}
                    </>
                  )}

                  {!isAuthenticated && (
                    <>
                      <div className="border-t my-3" />
                      <div className="px-2 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Produkt
                      </div>
                      {productItems.map((item) => (
                        <NavLink
                          key={item.url}
                          to={item.url}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-4 text-base font-medium transition-all rounded-xl touch-manipulation ${
                              isActive 
                                ? "text-primary bg-accent/90 shadow-sm font-semibold" 
                                : "text-foreground hover:text-primary hover:bg-accent/60"
                            }`
                          }
                        >
                          <item.icon className="h-5 w-5 flex-shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </NavLink>
                      ))}
                      <div className="border-t my-3" />
                      <div className="px-2 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Blog
                      </div>
                      {blogItems.map((item) => (
                        <NavLink
                          key={item.url}
                          to={item.url}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-4 text-base font-medium transition-all rounded-xl touch-manipulation ${
                              isActive 
                                ? "text-primary bg-accent/90 shadow-sm font-semibold" 
                                : "text-foreground hover:text-primary hover:bg-accent/60"
                            }`
                          }
                        >
                          <item.icon className="h-5 w-5 flex-shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </NavLink>
                      ))}
                      <div className="border-t my-3" />
                      <div className="px-2 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Prices & Perks
                      </div>
                      {pricesPerksItems.map((item) => (
                        <NavLink
                          key={item.url}
                          to={item.url}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-4 text-base font-medium transition-all rounded-xl touch-manipulation ${
                              isActive 
                                ? "text-primary bg-accent/90 shadow-sm font-semibold" 
                                : "text-foreground hover:text-primary hover:bg-accent/60"
                            }`
                          }
                        >
                          <item.icon className="h-5 w-5 flex-shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </NavLink>
                      ))}
                    </>
                  )}
                </nav>
                </div>

                {/* Sticky footer with CTA button */}
                <div className="border-t pt-4 px-4 pb-6 flex-shrink-0 bg-background/95 backdrop-blur-sm sticky bottom-0 shadow-[0_-4px_12px_rgba(0,0,0,0.1)]">
                    {isAuthenticated ? (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-3 h-14 text-base font-semibold touch-manipulation" 
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
                        className="w-full h-14 gap-2 bg-gradient-to-r from-primary to-primary-glow text-base font-bold shadow-lg touch-manipulation" 
                        asChild
                      >
                        <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                          Kom igång
                        </Link>
                      </Button>
                    )}
                  </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
