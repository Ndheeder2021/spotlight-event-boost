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
  Gift,
  ArrowRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LanguageSwitch } from "./LanguageSwitch";
import { ThemeToggle } from "./ThemeToggle";
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
    { title: t('solution'), url: "/solution", icon: Zap },
    { title: t('howItWorks'), url: "/how-it-works", icon: BookOpen },
  ];

  const blogItems = [
    { title: t('blog'), url: "/blog", icon: BookOpen },
    { title: t('caseStudies'), url: "/case-studies", icon: BarChart },
  ];

  const authenticatedNavItems = [
    { title: t("dashboard"), url: "/dashboard", icon: Home },
    { title: t("campaigns"), url: "/campaigns", icon: Megaphone },
    { title: t("analytics"), url: "/campaign-analytics", icon: TrendingUp },
    { title: t("calendar"), url: "/calendar", icon: Calendar },
    { title: t("reports"), url: "/reports", icon: BarChart },
  ];

  const moreMenuItems = [
    ...(isAdmin ? [
      { title: "Analytics", url: "/analytics", icon: BarChart },
      { title: "Bulk Email", url: "/bulk-email", icon: Megaphone },
    ] : []),
    { title: t("notifications"), url: "/notifications", icon: Bell },
    { title: t("settings"), url: "/settings", icon: Settings },
  ];

  const pricesPerksItems = [
    { title: t('pricing'), url: "/pricing", icon: DollarSign },
    { title: t('referFriend'), url: "/refer-a-friend", icon: Gift },
    { title: t('affiliate'), url: "/affiliate", icon: Users },
    { title: t('investors'), url: "/investors", icon: TrendingUp },
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
      <div className="container mx-auto px-2 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[auto_1fr_auto] min-h-14 sm:min-h-16 md:min-h-20 lg:min-h-24 h-auto items-center gap-1 sm:gap-4 lg:gap-8 py-2">
          {/* Logo */}
          <Link 
            to={isAuthenticated ? "/dashboard" : "/"} 
            className="flex items-center gap-1.5 sm:gap-2 md:gap-3 hover:opacity-90 transition-all duration-300 hover:scale-105 group flex-shrink-0"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary-glow/30 blur-lg sm:blur-xl md:blur-2xl group-hover:blur-xl sm:group-hover:blur-2xl md:group-hover:blur-3xl transition-all duration-500 opacity-60 group-hover:opacity-100 rounded-full" />
              <Zap className="h-6 w-6 sm:h-7 sm:w-7 md:h-9 md:w-9 lg:h-10 lg:w-10 text-primary relative z-10 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 drop-shadow-lg" fill="currentColor" />
            </div>
            <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent tracking-tight">
              Spotlight
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-2 flex-1 min-w-0 max-w-[50%] justify-center p-2 bg-card rounded-[15px] shadow-[0_10px_25px_0_rgba(0,0,0,0.075)] overflow-x-auto whitespace-nowrap col-start-2">
            {navItems.map((item) => (
              <NavLink
                key={item.url}
                to={item.url}
                className={({ isActive }) =>
                  `relative flex items-center justify-center w-[70px] h-[50px] rounded-lg overflow-hidden transition-all duration-200 ease-in origin-left hover:w-[130px] group ${
                    isActive 
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`absolute inset-0 rounded-lg bg-accent translate-x-full transition-transform duration-200 ease-in origin-right group-hover:translate-x-0 ${isActive ? 'translate-x-0' : ''}`} />
                    <item.icon className="w-7 h-7 flex-shrink-0 absolute left-[18px] z-10" />
                    <span className="block text-center w-full translate-x-full transition-transform duration-200 ease-in origin-right group-hover:translate-x-0 text-sm font-medium indent-[28px] opacity-0 group-hover:opacity-100">
                      {item.title}
                    </span>
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
                      <span>{t('more')}</span>
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
                    {t('tools')}
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
                        <span>{t('product')}</span>
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
                    {t('product')}
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
                        <span>{t('blog')}</span>
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
                    {t('blog')}
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
                        <span>{t('pricesPerks')}</span>
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
                    {t('pricesBenefits')}
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

          {/* Right-side actions wrapper */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* Desktop Actions */}
            <div className="hidden xl:flex items-center gap-4 flex-shrink-0">
            <ThemeToggle />
            <LanguageSwitch />
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
                  <Link to="/auth">{t("login")}</Link>
                </Button>
                <Button 
                  size="lg" 
                  asChild
                  className="gap-2.5 px-8 py-3 bg-gradient-to-r from-primary via-primary-glow to-primary hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl rounded-xl font-bold text-base relative overflow-hidden group"
                >
                  <Link to="/auth">
                    {t("heroCtaPrimary")}
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex xl:hidden items-center gap-0.5 sm:gap-1.5">
            <div className="scale-90 sm:scale-100">
              <ThemeToggle />
            </div>
            <div className="scale-90 sm:scale-100">
              <LanguageSwitch />
            </div>
            {!isAuthenticated && (
              <Button 
                variant="outline" 
                className="inline-flex h-9 sm:h-10 px-3 sm:px-4 rounded-xl font-semibold shrink-0"
                asChild
              >
                <Link to="/auth">{t("login")}</Link>
              </Button>
            )}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 min-h-[44px] min-w-[44px]">
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="sr-only">Öppna meny</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] max-w-[320px] bg-background/98 backdrop-blur-xl border-l-2 flex flex-col p-0 pb-0">
                <div className="p-4 flex-1 overflow-y-auto">
                  <nav className="flex flex-col gap-2 mt-0">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.url}
                      to={item.url}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 px-4 py-3.5 text-base font-medium transition-all duration-300 rounded-xl touch-manipulation relative overflow-hidden ${
                          isActive 
                            ? "text-primary bg-gradient-to-r from-accent/90 to-accent/70 shadow-md font-semibold scale-[0.98]" 
                            : "text-foreground hover:text-primary hover:bg-accent/50 hover:shadow-sm active:scale-[0.97]"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className={`${isActive ? 'animate-pulse' : 'group-hover:scale-110'} transition-transform duration-300`}>
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                          </div>
                          <span className="truncate">{item.title}</span>
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                          )}
                        </>
                      )}
                    </NavLink>
                  ))}

                  {isAuthenticated && (
                    <>
                      <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-border/60" />
                        </div>
                        <div className="relative flex justify-center">
                          <span className="bg-background px-3 py-1 text-xs font-bold text-muted-foreground uppercase tracking-wider rounded-full border border-border/40">
                            Verktyg
                          </span>
                        </div>
                      </div>
                      {moreMenuItems.map((item) => (
                        <NavLink
                          key={item.url}
                          to={item.url}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `group flex items-center gap-3 px-4 py-3.5 text-base font-medium transition-all duration-300 rounded-xl touch-manipulation relative overflow-hidden ${
                              isActive 
                                ? "text-primary bg-gradient-to-r from-accent/90 to-accent/70 shadow-md font-semibold scale-[0.98]" 
                                : "text-foreground hover:text-primary hover:bg-accent/50 hover:shadow-sm active:scale-[0.97]"
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <div className={`${isActive ? 'animate-pulse' : 'group-hover:scale-110'} transition-transform duration-300`}>
                                <item.icon className="h-5 w-5 flex-shrink-0" />
                              </div>
                              <span className="truncate">{item.title}</span>
                              {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                              )}
                            </>
                          )}
                        </NavLink>
                      ))}
                      {isAdmin && (
                        <NavLink
                          to="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `group flex items-center gap-3 px-4 py-3.5 text-base font-medium transition-all duration-300 rounded-xl touch-manipulation relative overflow-hidden ${
                              isActive 
                                ? "text-primary bg-gradient-to-r from-accent/90 to-accent/70 shadow-md font-semibold scale-[0.98]" 
                                : "text-foreground hover:text-primary hover:bg-accent/50 hover:shadow-sm active:scale-[0.97]"
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <div className={`${isActive ? 'animate-pulse' : 'group-hover:scale-110'} transition-transform duration-300`}>
                                <Shield className="h-5 w-5 flex-shrink-0" />
                              </div>
                              <span className="truncate">{t("admin")}</span>
                              {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                              )}
                            </>
                          )}
                        </NavLink>
                      )}
                    </>
                  )}

                  {!isAuthenticated && (
                    <>
                      <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-border/60" />
                        </div>
                        <div className="relative flex justify-center">
                          <span className="bg-background px-3 py-1 text-xs font-bold text-muted-foreground uppercase tracking-wider rounded-full border border-border/40">
                            Produkt
                          </span>
                        </div>
                      </div>
                      {productItems.map((item) => (
                        <NavLink
                          key={item.url}
                          to={item.url}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `group flex items-center gap-3 px-4 py-3.5 text-base font-medium transition-all duration-300 rounded-xl touch-manipulation relative overflow-hidden ${
                              isActive 
                                ? "text-primary bg-gradient-to-r from-accent/90 to-accent/70 shadow-md font-semibold scale-[0.98]" 
                                : "text-foreground hover:text-primary hover:bg-accent/50 hover:shadow-sm active:scale-[0.97]"
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <div className={`${isActive ? 'animate-pulse' : 'group-hover:scale-110'} transition-transform duration-300`}>
                                <item.icon className="h-5 w-5 flex-shrink-0" />
                              </div>
                              <span className="truncate">{item.title}</span>
                              {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                              )}
                            </>
                          )}
                        </NavLink>
                      ))}
                      <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-border/60" />
                        </div>
                        <div className="relative flex justify-center">
                          <span className="bg-background px-3 py-1 text-xs font-bold text-muted-foreground uppercase tracking-wider rounded-full border border-border/40">
                            Blog
                          </span>
                        </div>
                      </div>
                      {blogItems.map((item) => (
                        <NavLink
                          key={item.url}
                          to={item.url}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `group flex items-center gap-3 px-4 py-3.5 text-base font-medium transition-all duration-300 rounded-xl touch-manipulation relative overflow-hidden ${
                              isActive 
                                ? "text-primary bg-gradient-to-r from-accent/90 to-accent/70 shadow-md font-semibold scale-[0.98]" 
                                : "text-foreground hover:text-primary hover:bg-accent/50 hover:shadow-sm active:scale-[0.97]"
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <div className={`${isActive ? 'animate-pulse' : 'group-hover:scale-110'} transition-transform duration-300`}>
                                <item.icon className="h-5 w-5 flex-shrink-0" />
                              </div>
                              <span className="truncate">{item.title}</span>
                              {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                              )}
                            </>
                          )}
                        </NavLink>
                      ))}
                      <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-border/60" />
                        </div>
                        <div className="relative flex justify-center">
                          <span className="bg-background px-3 py-1 text-xs font-bold text-muted-foreground uppercase tracking-wider rounded-full border border-border/40">
                            Prices & Perks
                          </span>
                        </div>
                      </div>
                      {pricesPerksItems.map((item) => (
                        <NavLink
                          key={item.url}
                          to={item.url}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `group flex items-center gap-3 px-4 py-3.5 text-base font-medium transition-all duration-300 rounded-xl touch-manipulation relative overflow-hidden ${
                              isActive 
                                ? "text-primary bg-gradient-to-r from-accent/90 to-accent/70 shadow-md font-semibold scale-[0.98]" 
                                : "text-foreground hover:text-primary hover:bg-accent/50 hover:shadow-sm active:scale-[0.97]"
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <div className={`${isActive ? 'animate-pulse' : 'group-hover:scale-110'} transition-transform duration-300`}>
                                <item.icon className="h-5 w-5 flex-shrink-0" />
                              </div>
                              <span className="truncate">{item.title}</span>
                              {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                              )}
                            </>
                          )}
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
                        className="group relative w-full h-14 gap-2 overflow-hidden bg-gradient-to-r from-primary via-primary-glow to-primary text-base font-bold shadow-xl hover:shadow-2xl transition-all duration-300 touch-manipulation bg-[length:200%_100%] animate-gradient-x" 
                        asChild
                      >
                        <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2">
                          {t("heroCtaPrimary")}
                          <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    )}
                  </div>
              </SheetContent>
            </Sheet>
          </div>
          </div>
        </div>
      </div>
    </header>
  );
}
