import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const Privacy = () => {
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
            <span className="text-primary">{t('privacyHero')}</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed">
            {t('privacyHeroDesc')}
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 pb-16 max-w-4xl">
        <div className="space-y-6">
          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">1.</span> {t('privacyIntroTitle')}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('privacyIntroText')}
            </p>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">2.</span> {t('privacyDataTitle')}
            </h2>
            <p className="text-muted-foreground mb-4">
              {t('privacyDataText')}
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>{t('privacyDataList1')}</li>
              <li>{t('privacyDataList2')}</li>
              <li>{t('privacyDataList3')}</li>
              <li>{t('privacyDataList4')}</li>
            </ul>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">3.</span> {t('privacyUseTitle')}
            </h2>
            <p className="text-muted-foreground mb-4">
              {t('privacyUseText')}
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>{t('privacyUseList1')}</li>
              <li>{t('privacyUseList2')}</li>
              <li>{t('privacyUseList3')}</li>
              <li>{t('privacyUseList4')}</li>
              <li>{t('privacyUseList5')}</li>
            </ul>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">4.</span> {t('privacySharingTitle')}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('privacySharingText')}
            </p>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">5.</span> {t('privacySecurityTitle')}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('privacySecurityText')}
            </p>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">6.</span> {t('privacyRightsTitle')}
            </h2>
            <p className="text-muted-foreground mb-4">
              {t('privacyRightsText')}
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>{t('privacyRightsList1')}</li>
              <li>{t('privacyRightsList2')}</li>
              <li>{t('privacyRightsList3')}</li>
              <li>{t('privacyRightsList4')}</li>
              <li>{t('privacyRightsList5')}</li>
            </ul>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">7.</span> {t('privacyContactTitle')}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('privacyContactText')}
            </p>
            <div className="mt-4 p-4 bg-primary/10 border-2 border-primary/30 rounded-xl hover:border-primary/50 transition-all">
              <a 
                href="mailto:privacy@spotlightevents.online" 
                className="text-primary hover:text-primary-glow font-bold text-lg flex items-center gap-2 transition-colors"
              >
                <Shield className="h-5 w-5" />
                privacy@spotlightevents.online
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

export default Privacy;
