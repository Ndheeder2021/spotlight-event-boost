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
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-lg transition-all duration-300">
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

          {/* Desktop Navigation - Human Design */}
          <nav className="hidden xl:flex items-center flex-wrap gap-3 justify-center p-3 bg-card rounded-2xl border-2 border-border/50 shadow-lg mx-auto" style={{ transform: 'rotate(-0.3deg)' }}>
            {navItems.map((item, index) => {
              const rotations = ['-0.5deg', '0.3deg', '-0.2deg', '0.4deg'];
              return (
                <NavLink
                  key={item.url}
                  to={item.url}
                  className={({ isActive }) =>
                    `relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 border-2 ${
                      isActive 
                        ? "text-primary bg-accent/80 border-primary/30 font-semibold" 
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/40 border-transparent hover:border-border/50"
                    }`
                  }
                  style={{ transform: `rotate(${rotations[index % rotations.length]})` }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'rotate(0deg) scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = `rotate(${rotations[index % rotations.length]}) scale(1)`;
                  }}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium whitespace-nowrap">
                        {item.title}
                      </span>
                      {isActive && <span className="ml-1">✓</span>}
                    </>
                  )}
                </NavLink>
              );
            })}

            {/* More Dropdown for Authenticated Users */}
            {isAuthenticated && (
              <div onMouseEnter={() => handleMouseEnter('more')} onMouseLeave={handleMouseLeave}>
                <DropdownMenu open={openDropdown === 'more'} onOpenChange={(open) => !open && setOpenDropdown(null)}>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold hover:bg-accent/60 transition-all duration-200 rounded-xl border-2 border-transparent hover:border-border/50"
                      style={{ transform: 'rotate(0.5deg)' }}
                    >
                      <span>{t('more')}</span>
                      <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="center" 
                    className="w-56 bg-background border-2 border-border shadow-2xl z-50 rounded-2xl p-3"
                    sideOffset={8}
                    style={{ transform: 'rotate(-0.5deg)' }}
                  >
                    {/* Hand-drawn divider */}
                    <DropdownMenuLabel className="text-sm font-bold px-3 py-2 bg-accent/30 rounded-lg mb-2 flex items-center gap-2" style={{ transform: 'rotate(0.5deg)' }}>
                      <span>⚙️</span> {t('tools')}
                    </DropdownMenuLabel>
                    
                    {moreMenuItems.map((item, index) => (
                      <DropdownMenuItem key={item.url} asChild>
                        <Link
                          to={item.url}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium cursor-pointer hover:bg-accent/50 transition-all duration-200 rounded-lg my-1 border-l-2 border-transparent hover:border-primary/30"
                        >
                          <item.icon className="h-4 w-4 text-primary/70" />
                          <span>{item.title}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    {isAdmin && (
                      <>
                        {/* Hand-drawn separator */}
                        <div className="my-2 relative h-1">
                          <svg className="w-full h-1" viewBox="0 0 100 4" preserveAspectRatio="none">
                            <path d="M0 2 Q 25 1, 50 2 T 100 2" stroke="hsl(var(--border))" strokeWidth="1" fill="none" />
                          </svg>
                        </div>
                        <DropdownMenuItem asChild>
                          <Link
                            to="/admin"
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium cursor-pointer hover:bg-accent/50 transition-all duration-200 rounded-lg border-l-2 border-transparent hover:border-primary/30"
                          >
                            <Shield className="h-4 w-4 text-primary/70" />
                            <span>{t("admin")}</span>
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
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold hover:bg-accent/60 transition-all duration-200 rounded-xl border-2 border-transparent hover:border-border/50"
                        style={{ transform: 'rotate(-0.3deg)' }}
                      >
                        <span>📦 {t('product')}</span>
                        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="center" 
                      className="w-56 bg-background border-2 border-border shadow-2xl z-50 rounded-2xl p-3"
                      sideOffset={8}
                      style={{ transform: 'rotate(0.5deg)' }}
                    >
                      <DropdownMenuLabel className="text-sm font-bold px-3 py-2 bg-accent/30 rounded-lg mb-2" style={{ transform: 'rotate(-0.3deg)' }}>
                        📦 {t('product')}
                      </DropdownMenuLabel>
                      
                      {productItems.map((item) => (
                        <DropdownMenuItem key={item.url} asChild>
                          <Link
                            to={item.url}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium cursor-pointer hover:bg-accent/50 transition-all duration-200 rounded-lg my-1 border-l-2 border-transparent hover:border-primary/30"
                          >
                            <item.icon className="h-4 w-4 text-primary/70" />
                            <span>{item.title}</span>
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
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold hover:bg-accent/60 transition-all duration-200 rounded-xl border-2 border-transparent hover:border-border/50"
                        style={{ transform: 'rotate(0.4deg)' }}
                      >
                        <span>✍️ {t('blog')}</span>
                        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="center" 
                      className="w-56 bg-background border-2 border-border shadow-2xl z-50 rounded-2xl p-3"
                      sideOffset={8}
                      style={{ transform: 'rotate(-0.4deg)' }}
                    >
                      <DropdownMenuLabel className="text-sm font-bold px-3 py-2 bg-accent/30 rounded-lg mb-2" style={{ transform: 'rotate(0.3deg)' }}>
                        ✍️ {t('blog')}
                      </DropdownMenuLabel>
                      
                      {blogItems.map((item) => (
                        <DropdownMenuItem key={item.url} asChild>
                          <Link
                            to={item.url}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium cursor-pointer hover:bg-accent/50 transition-all duration-200 rounded-lg my-1 border-l-2 border-transparent hover:border-primary/30"
                          >
                            <item.icon className="h-4 w-4 text-primary/70" />
                            <span>{item.title}</span>
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
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold hover:bg-accent/60 transition-all duration-200 rounded-xl border-2 border-transparent hover:border-border/50"
                        style={{ transform: 'rotate(-0.2deg)' }}
                      >
                        <span>💰 {t('pricesPerks')}</span>
                        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="center" 
                      className="w-56 bg-background border-2 border-border shadow-2xl z-50 rounded-2xl p-3"
                      sideOffset={8}
                      style={{ transform: 'rotate(0.3deg)' }}
                    >
                      <DropdownMenuLabel className="text-sm font-bold px-3 py-2 bg-accent/30 rounded-lg mb-2" style={{ transform: 'rotate(-0.2deg)' }}>
                        💰 {t('pricesBenefits')}
                      </DropdownMenuLabel>
                      
                      {pricesPerksItems.map((item) => (
                        <DropdownMenuItem key={item.url} asChild>
                          <Link
                            to={item.url}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium cursor-pointer hover:bg-accent/50 transition-all duration-200 rounded-lg my-1 border-l-2 border-transparent hover:border-primary/30"
                          >
                            <item.icon className="h-4 w-4 text-primary/70" />
                            <span>{item.title}</span>
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
                <div className="relative inline-flex items-center justify-center gap-4 group">
                  <div className="absolute inset-0 duration-1000 opacity-60 transition-all bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 rounded-xl blur-lg filter group-hover:opacity-100 group-hover:duration-200"></div>
                  <Link
                    to="/auth"
                    className="group relative inline-flex items-center justify-center text-base rounded-xl bg-gray-900 px-8 py-3 font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-600/30"
                  >
                    {t("heroCtaPrimary")}
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 10 10"
                      height="10"
                      width="10"
                      fill="none"
                      className="mt-0.5 ml-2 -mr-1 stroke-white stroke-2"
                    >
                      <path
                        d="M0 5h7"
                        className="transition opacity-0 group-hover:opacity-100"
                      ></path>
                      <path
                        d="M1 1l4 4-4 4"
                        className="transition group-hover:translate-x-[3px]"
                      ></path>
                    </svg>
                  </Link>
                </div>
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
                  <nav className="flex flex-col gap-3 mt-0">
                  {navItems.map((item, index) => (
                    <NavLink
                      key={item.url}
                      to={item.url}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 px-4 py-3.5 text-base font-medium transition-all duration-200 rounded-2xl touch-manipulation relative ${
                          isActive 
                            ? "text-primary bg-accent/80 shadow-sm font-semibold border-l-4 border-primary translate-x-1" 
                            : "text-foreground hover:text-primary hover:bg-accent/30 active:scale-[0.98] border-l-4 border-transparent"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className={`${isActive ? '' : 'group-hover:scale-110'} transition-transform duration-200 p-2 rounded-lg ${isActive ? 'bg-primary/10' : 'bg-background'}`}>
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                          </div>
                          <span className="truncate">{item.title}</span>
                          {isActive && (
                            <span className="ml-auto text-xs">✓</span>
                          )}
                        </>
                      )}
                    </NavLink>
                  ))}

                  {isAuthenticated && (
                    <>
                      <div className="relative my-6">
                        {/* Hand-drawn divider */}
                        <svg className="w-full h-2" viewBox="0 0 200 8" preserveAspectRatio="none">
                          <path d="M0 4 Q 50 2, 100 4 T 200 4" stroke="hsl(var(--border))" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />
                        </svg>
                        <div className="relative flex justify-center -mt-4">
                          <span className="bg-background px-4 py-1.5 text-xs font-semibold text-muted-foreground rounded-full border border-border/50 shadow-sm" style={{ transform: 'rotate(-1deg)' }}>
                            ⚙️ Verktyg
                          </span>
                        </div>
                      </div>
                      {moreMenuItems.map((item) => (
                        <NavLink
                          key={item.url}
                          to={item.url}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `group flex items-center gap-3 px-4 py-3.5 text-base font-medium transition-all duration-200 rounded-2xl touch-manipulation relative ${
                              isActive 
                                ? "text-primary bg-accent/80 shadow-sm font-semibold border-l-4 border-primary" 
                                : "text-foreground hover:text-primary hover:bg-accent/30 active:scale-[0.98] border-l-4 border-transparent"
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <div className={`${isActive ? '' : 'group-hover:scale-110'} transition-transform duration-200 p-2 rounded-lg ${isActive ? 'bg-primary/10' : 'bg-background'}`}>
                                <item.icon className="h-5 w-5 flex-shrink-0" />
                              </div>
                              <span className="truncate">{item.title}</span>
                              {isActive && (
                                <span className="ml-auto text-xs">✓</span>
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
                            `group flex items-center gap-3 px-4 py-3.5 text-base font-medium transition-all duration-200 rounded-2xl touch-manipulation relative ${
                              isActive 
                                ? "text-primary bg-accent/80 shadow-sm font-semibold border-l-4 border-primary" 
                                : "text-foreground hover:text-primary hover:bg-accent/30 active:scale-[0.98] border-l-4 border-transparent"
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <div className={`${isActive ? '' : 'group-hover:scale-110'} transition-transform duration-200 p-2 rounded-lg ${isActive ? 'bg-primary/10' : 'bg-background'}`}>
                                <Shield className="h-5 w-5 flex-shrink-0" />
                              </div>
                              <span className="truncate">{t("admin")}</span>
                              {isActive && (
                                <span className="ml-auto text-xs">✓</span>
                              )}
                            </>
                          )}
                        </NavLink>
                      )}
                    </>
                  )}

                  {!isAuthenticated && (
                    <>
                      <div className="relative my-6">
                        {/* Hand-drawn divider */}
                        <svg className="w-full h-2" viewBox="0 0 200 8" preserveAspectRatio="none">
                          <path d="M0 4 Q 50 2, 100 4 T 200 4" stroke="hsl(var(--border))" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />
                        </svg>
                        <div className="relative flex justify-center -mt-4">
                          <span className="bg-background px-4 py-1.5 text-xs font-semibold text-muted-foreground rounded-full border border-border/50 shadow-sm" style={{ transform: 'rotate(1deg)' }}>
                            📦 Produkt
                          </span>
                        </div>
                      </div>
                      {productItems.map((item) => (
                        <NavLink
                          key={item.url}
                          to={item.url}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `group flex items-center gap-3 px-4 py-3.5 text-base font-medium transition-all duration-200 rounded-2xl touch-manipulation relative ${
                              isActive 
                                ? "text-primary bg-accent/80 shadow-sm font-semibold border-l-4 border-primary" 
                                : "text-foreground hover:text-primary hover:bg-accent/30 active:scale-[0.98] border-l-4 border-transparent"
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <div className={`${isActive ? '' : 'group-hover:scale-110'} transition-transform duration-200 p-2 rounded-lg ${isActive ? 'bg-primary/10' : 'bg-background'}`}>
                                <item.icon className="h-5 w-5 flex-shrink-0" />
                              </div>
                              <span className="truncate">{item.title}</span>
                              {isActive && (
                                <span className="ml-auto text-xs">✓</span>
                              )}
                            </>
                          )}
                        </NavLink>
                      ))}
                      <div className="relative my-6">
                        {/* Hand-drawn divider */}
                        <svg className="w-full h-2" viewBox="0 0 200 8" preserveAspectRatio="none">
                          <path d="M0 4 Q 50 2, 100 4 T 200 4" stroke="hsl(var(--border))" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />
                        </svg>
                        <div className="relative flex justify-center -mt-4">
                          <span className="bg-background px-4 py-1.5 text-xs font-semibold text-muted-foreground rounded-full border border-border/50 shadow-sm" style={{ transform: 'rotate(-0.5deg)' }}>
                            ✍️ Blog
                          </span>
                        </div>
                      </div>
                      {blogItems.map((item) => (
                        <NavLink
                          key={item.url}
                          to={item.url}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `group flex items-center gap-3 px-4 py-3.5 text-base font-medium transition-all duration-200 rounded-2xl touch-manipulation relative ${
                              isActive 
                                ? "text-primary bg-accent/80 shadow-sm font-semibold border-l-4 border-primary" 
                                : "text-foreground hover:text-primary hover:bg-accent/30 active:scale-[0.98] border-l-4 border-transparent"
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <div className={`${isActive ? '' : 'group-hover:scale-110'} transition-transform duration-200 p-2 rounded-lg ${isActive ? 'bg-primary/10' : 'bg-background'}`}>
                                <item.icon className="h-5 w-5 flex-shrink-0" />
                              </div>
                              <span className="truncate">{item.title}</span>
                              {isActive && (
                                <span className="ml-auto text-xs">✓</span>
                              )}
                            </>
                          )}
                        </NavLink>
                      ))}
                      <div className="relative my-6">
                        {/* Hand-drawn divider */}
                        <svg className="w-full h-2" viewBox="0 0 200 8" preserveAspectRatio="none">
                          <path d="M0 4 Q 50 2, 100 4 T 200 4" stroke="hsl(var(--border))" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />
                        </svg>
                        <div className="relative flex justify-center -mt-4">
                          <span className="bg-background px-4 py-1.5 text-xs font-semibold text-muted-foreground rounded-full border border-border/50 shadow-sm" style={{ transform: 'rotate(1deg)' }}>
                            💰 Prices & Perks
                          </span>
                        </div>
                      </div>
                      {pricesPerksItems.map((item) => (
                        <NavLink
                          key={item.url}
                          to={item.url}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `group flex items-center gap-3 px-4 py-3.5 text-base font-medium transition-all duration-200 rounded-2xl touch-manipulation relative ${
                              isActive 
                                ? "text-primary bg-accent/80 shadow-sm font-semibold border-l-4 border-primary" 
                                : "text-foreground hover:text-primary hover:bg-accent/30 active:scale-[0.98] border-l-4 border-transparent"
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <div className={`${isActive ? '' : 'group-hover:scale-110'} transition-transform duration-200 p-2 rounded-lg ${isActive ? 'bg-primary/10' : 'bg-background'}`}>
                                <item.icon className="h-5 w-5 flex-shrink-0" />
                              </div>
                              <span className="truncate">{item.title}</span>
                              {isActive && (
                                <span className="ml-auto text-xs">✓</span>
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
