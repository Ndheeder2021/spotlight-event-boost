import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, TrendingUp, Bell, Target, Users, BarChart, MapPin, Calendar, Sparkles, ArrowRight } from "lucide-react";
import { Footer } from "@/components/Footer";

export default function Solution() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Zap className="h-6 w-6 text-accent" fill="currentColor" />
            <span className="text-xl font-bold">Spotlight</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t("solution.nav.home")}
            </Link>
            <Link to="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t("solution.nav.contact")}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-32 lg:py-40">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight">
            {t("solution.hero.title1")}
            <br />
            <span className="text-primary">{t("solution.hero.title2")}</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            {t("solution.hero.description")}
          </p>
        </div>
      </section>

      {/* Problem Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("solution.problem.title")}</h2>
            <p className="text-lg text-muted-foreground">
              {t("solution.problem.subtitle")}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 glass-card hover:border-accent/30 transition-all hover:scale-105 hover:shadow-xl group">
              <CardHeader>
                <CardTitle className="text-xl group-hover:text-accent transition-colors">{t("solution.problem.cards.0.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t("solution.problem.cards.0.description")}
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 glass-card hover:border-accent/30 transition-all hover:scale-105 hover:shadow-xl group">
              <CardHeader>
                <CardTitle className="text-xl group-hover:text-accent transition-colors">{t("solution.problem.cards.1.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t("solution.problem.cards.1.description")}
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 glass-card hover:border-accent/30 transition-all hover:scale-105 hover:shadow-xl group">
              <CardHeader>
                <CardTitle className="text-xl group-hover:text-accent transition-colors">{t("solution.problem.cards.2.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t("solution.problem.cards.2.description")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("solution.howItWorks.title")}</h2>
            <p className="text-lg text-muted-foreground">
              {t("solution.howItWorks.subtitle")}
            </p>
          </div>

          <div className="space-y-16">
            {/* Step 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-bold mb-4">
                  {t("solution.howItWorks.step1.badge")}
                </div>
                <h3 className="text-3xl font-bold mb-4 flex items-center gap-3">
                  <MapPin className="h-8 w-8 text-accent" />
                  {t("solution.howItWorks.step1.title")}
                </h3>
                <p className="text-lg text-muted-foreground mb-6">
                  {t("solution.howItWorks.step1.description")}
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground">{t("solution.howItWorks.step1.features.0")}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground">{t("solution.howItWorks.step1.features.1")}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground">{t("solution.howItWorks.step1.features.2")}</span>
                  </li>
                </ul>
              </div>
              <div className="order-1 md:order-2">
                <div className="glass-card p-8 rounded-2xl border-2 border-accent/20 premium-glow hover:scale-105 transition-all">
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent/10 rounded-full blur-2xl" />
                    <Bell className="h-16 w-16 text-accent mb-4 mx-auto relative animate-pulse" />
                  </div>
                  <p className="text-center text-muted-foreground">
                    {t("solution.howItWorks.step1.card")}
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="glass-card p-8 rounded-2xl border-2 border-accent/20 premium-glow hover:scale-105 transition-all">
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent/10 rounded-full blur-2xl" />
                    <Sparkles className="h-16 w-16 text-accent mb-4 mx-auto relative animate-pulse" />
                  </div>
                  <p className="text-center text-muted-foreground">
                    {t("solution.howItWorks.step2.card")}
                  </p>
                </div>
              </div>
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-bold mb-4">
                  {t("solution.howItWorks.step2.badge")}
                </div>
                <h3 className="text-3xl font-bold mb-4 flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-accent" />
                  {t("solution.howItWorks.step2.title")}
                </h3>
                <p className="text-lg text-muted-foreground mb-6">
                  {t("solution.howItWorks.step2.description")}
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground">{t("solution.howItWorks.step2.features.0")}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground">{t("solution.howItWorks.step2.features.1")}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground">{t("solution.howItWorks.step2.features.2")}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-bold mb-4">
                  {t("solution.howItWorks.step3.badge")}
                </div>
                <h3 className="text-3xl font-bold mb-4 flex items-center gap-3">
                  <BarChart className="h-8 w-8 text-accent" />
                  {t("solution.howItWorks.step3.title")}
                </h3>
                <p className="text-lg text-muted-foreground mb-6">
                  {t("solution.howItWorks.step3.description")}
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground">{t("solution.howItWorks.step3.features.0")}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground">{t("solution.howItWorks.step3.features.1")}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground">{t("solution.howItWorks.step3.features.2")}</span>
                  </li>
                </ul>
              </div>
              <div className="order-1 md:order-2">
                <div className="glass-card p-8 rounded-2xl border-2 border-accent/20 premium-glow hover:scale-105 transition-all">
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent/10 rounded-full blur-2xl" />
                    <Target className="h-16 w-16 text-accent mb-4 mx-auto relative animate-pulse" />
                  </div>
                  <p className="text-center text-muted-foreground">
                    {t("solution.howItWorks.step3.card")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-accent/5 to-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("solution.benefits.title")}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 border-2 glass-card hover:border-accent/50 transition-all hover:scale-105 premium-glow group">
              <div className="text-5xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform">40%</div>
              <p className="text-sm text-muted-foreground">{t("solution.benefits.stats.0")}</p>
            </Card>
            <Card className="text-center p-6 border-2 glass-card hover:border-accent/50 transition-all hover:scale-105 premium-glow group">
              <div className="text-5xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform">15min</div>
              <p className="text-sm text-muted-foreground">{t("solution.benefits.stats.1")}</p>
            </Card>
            <Card className="text-center p-6 border-2 glass-card hover:border-accent/50 transition-all hover:scale-105 premium-glow group">
              <div className="text-5xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform">3x</div>
              <p className="text-sm text-muted-foreground">{t("solution.benefits.stats.2")}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative container mx-auto px-4 py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-background -z-10" />
        <div className="max-w-4xl mx-auto text-center space-y-8 glass-card p-12 rounded-3xl border-2 premium-glow-lg">
          <h2 className="text-4xl md:text-5xl font-bold">
            {t("solution.cta.title1")} <span className="gradient-text">{t("solution.cta.title2")}</span>?
          </h2>
          <p className="text-xl text-muted-foreground">
            {t("solution.cta.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="animated"
              size="xl"
              asChild
            >
              <Link to="/auth">
                {t("solution.cta.buttons.start")}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button 
              variant="animatedOutline"
              size="xl"
              asChild
            >
              <Link to="/contact">
                {t("solution.cta.buttons.contact")}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
