import { Button } from "@/components/ui/button";
import { ArrowLeft, Cookie, Mail, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const Cookies = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Zap className="h-6 w-6 text-accent" fill="currentColor" />
            <span className="text-xl font-bold">Spotlight</span>
          </Link>
          <Button variant="ghost" asChild>
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t('back')}
            </Link>
          </Button>
        </div>
      </header>

      <section className="container mx-auto px-4 sm:px-6 py-32 lg:py-40">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight">
            <span className="text-primary">{t('cookiesHero')}</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed">
            {t('cookiesHeroDesc')}
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 pb-16 max-w-4xl">
        <div className="space-y-6">
          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4">{t('cookiesWhatTitle')}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('cookiesWhatText')}
            </p>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4">{t('cookiesHowTitle')}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('cookiesHowText')}
            </p>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4">{t('cookiesTypesTitle')}</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-2 text-accent">{t('cookiesNecessaryTitle')}</h3>
                <p className="text-muted-foreground mb-3">
                  {t('cookiesNecessaryText')}
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li><strong>{t('cookiesSessionTitle')}</strong> {t('cookiesSessionText')}</li>
                  <li><strong>{t('cookiesSecurityTitle')}</strong> {t('cookiesSecurityText')}</li>
                </ul>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-bold mb-2 text-accent">{t('cookiesFunctionalTitle')}</h3>
                <p className="text-muted-foreground mb-3">
                  {t('cookiesFunctionalText')}
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li><strong>{t('cookiesPreferencesTitle')}</strong> {t('cookiesPreferencesText')}</li>
                  <li><strong>{t('cookiesThemeTitle')}</strong> {t('cookiesThemeText')}</li>
                </ul>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-bold mb-2 text-accent">{t('cookiesAnalyticsTitle')}</h3>
                <p className="text-muted-foreground mb-3">
                  {t('cookiesAnalyticsText')}
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li><strong>{t('cookiesUsageTitle')}</strong> {t('cookiesUsageText')}</li>
                  <li><strong>{t('cookiesPerformanceTitle')}</strong> {t('cookiesPerformanceText')}</li>
                </ul>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-bold mb-2 text-accent">{t('cookiesMarketingTitle')}</h3>
                <p className="text-muted-foreground">
                  {t('cookiesMarketingText')}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4">{t('cookiesThirdTitle')}</h2>
            <p className="text-muted-foreground mb-4">
              {t('cookiesThirdText')}
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>{t('cookiesThirdSupabase')}</strong></li>
              <li><strong>{t('cookiesThirdStripe')}</strong></li>
            </ul>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4">{t('cookiesManageTitle')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('cookiesManageText')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('cookiesLearnMore')}{" "}
              <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                {t('cookiesBrowser')}
              </a>
            </p>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4">{t('cookiesContactTitle')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {t('cookiesContactText')}
            </p>
            <div className="mt-4">
              <a 
                href="mailto:privacy@spotlightevents.online" 
                className="inline-flex items-center gap-3 px-6 py-4 bg-primary/10 border-2 border-primary/20 rounded-lg hover:bg-primary/20 hover:border-primary/40 transition-all group"
              >
                <Mail className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-lg font-bold text-primary">privacy@spotlightevents.online</span>
              </a>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              {t('lastUpdated')} {new Date().toLocaleDateString(t('locale'))}
            </p>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cookies;
