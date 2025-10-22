import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, Bell, Sparkles, Send, BarChart, Check } from "lucide-react";
import { Footer } from "@/components/Footer";

export default function HowItWorks() {
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
              {t('home')}
            </Link>
            <Link to="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t('contact')}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 sm:px-6 py-32 lg:py-40">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight">
            {t('howItWorksHero')}
            <br />
            <span className="text-primary">{t('howItWorksHeroHighlight')}</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            {t('howItWorksHeroDesc')}
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-24">
          {/* Step 1 */}
          <div className="relative">
            <div className="absolute left-8 top-20 bottom-0 w-0.5 bg-gradient-to-b from-accent to-transparent hidden md:block" />
            <div className="grid md:grid-cols-[auto,1fr] gap-8 items-start">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-lg">
                  1
                </div>
              </div>
              <Card className="p-8 border-2 glass-card hover:border-accent/50 transition-all hover:shadow-xl premium-glow group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Bell className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-accent transition-colors">{t('howItWorksStep1Title')}</h3>
                    <p className="text-muted-foreground text-lg">
                      {t('howItWorksStep1Desc')}
                    </p>
                  </div>
                </div>
                <div className="mt-6 pl-16 space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{t('howItWorksStep1Feature1')}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{t('howItWorksStep1Feature2')}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{t('howItWorksStep1Feature3')}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="absolute left-8 top-20 bottom-0 w-0.5 bg-gradient-to-b from-accent to-transparent hidden md:block" />
            <div className="grid md:grid-cols-[auto,1fr] gap-8 items-start">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-lg">
                  2
                </div>
              </div>
              <Card className="p-8 border-2 glass-card hover:border-accent/50 transition-all hover:shadow-xl premium-glow group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Sparkles className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-accent transition-colors">{t('howItWorksStep2Title')}</h3>
                    <p className="text-muted-foreground text-lg">
                      {t('howItWorksStep2Desc')}
                    </p>
                  </div>
                </div>
                <div className="mt-6 pl-16 space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{t('howItWorksStep2Feature1')}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{t('howItWorksStep2Feature2')}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{t('howItWorksStep2Feature3')}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <div className="absolute left-8 top-20 bottom-0 w-0.5 bg-gradient-to-b from-accent to-transparent hidden md:block" />
            <div className="grid md:grid-cols-[auto,1fr] gap-8 items-start">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-lg">
                  3
                </div>
              </div>
              <Card className="p-8 border-2 glass-card hover:border-accent/50 transition-all hover:shadow-xl premium-glow group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Send className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-accent transition-colors">{t('howItWorksStep3Title')}</h3>
                    <p className="text-muted-foreground text-lg">
                      {t('howItWorksStep3Desc')}
                    </p>
                  </div>
                </div>
                <div className="mt-6 pl-16 space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{t('howItWorksStep3Feature1')}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{t('howItWorksStep3Feature2')}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{t('howItWorksStep3Feature3')}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative">
            <div className="grid md:grid-cols-[auto,1fr] gap-8 items-start">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-lg">
                  4
                </div>
              </div>
              <Card className="p-8 border-2 glass-card hover:border-accent/50 transition-all hover:shadow-xl premium-glow group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <BarChart className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-accent transition-colors">{t('howItWorksStep4Title')}</h3>
                    <p className="text-muted-foreground text-lg">
                      {t('howItWorksStep4Desc')}
                    </p>
                  </div>
                </div>
                <div className="mt-6 pl-16 space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{t('howItWorksStep4Feature1')}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{t('howItWorksStep4Feature2')}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{t('howItWorksStep4Feature3')}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-accent/5 to-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('howItWorksFeaturesTitle')}</h2>
            <p className="text-lg text-muted-foreground">
              {t('howItWorksFeaturesDesc')}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 border-2 glass-card hover:border-accent/50 transition-all hover:scale-105 premium-glow group">
              <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">{t('howItWorksFeature1Title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('howItWorksFeature1Desc')}
              </p>
            </Card>
            <Card className="p-6 border-2 glass-card hover:border-accent/50 transition-all hover:scale-105 premium-glow group">
              <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">{t('howItWorksFeature2Title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('howItWorksFeature2Desc')}
              </p>
            </Card>
            <Card className="p-6 border-2 glass-card hover:border-accent/50 transition-all hover:scale-105 premium-glow group">
              <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">{t('howItWorksFeature3Title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('howItWorksFeature3Desc')}
              </p>
            </Card>
            <Card className="p-6 border-2 glass-card hover:border-accent/50 transition-all hover:scale-105 premium-glow group">
              <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">{t('howItWorksFeature4Title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('howItWorksFeature4Desc')}
              </p>
            </Card>
            <Card className="p-6 border-2 glass-card hover:border-accent/50 transition-all hover:scale-105 premium-glow group">
              <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">{t('howItWorksFeature5Title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('howItWorksFeature5Desc')}
              </p>
            </Card>
            <Card className="p-6 border-2 glass-card hover:border-accent/50 transition-all hover:scale-105 premium-glow group">
              <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">{t('howItWorksFeature6Title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('howItWorksFeature6Desc')}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative container mx-auto px-4 py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-background -z-10" />
        <div className="max-w-4xl mx-auto text-center space-y-8 glass-card p-12 rounded-3xl border-2 premium-glow-lg">
          <h2 className="text-4xl md:text-5xl font-bold">
            {t('howItWorksCtaTitle')} <span className="gradient-text">{t('howItWorksCtaHighlight')}</span>?
          </h2>
          <p className="text-xl text-muted-foreground">
            {t('howItWorksCtaDesc')}
          </p>
          <Button size="lg" className="text-lg px-8 h-14 hover:scale-105 transition-transform" asChild>
            <Link to="/auth">
              {t('howItWorksCtaBtn')}
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
