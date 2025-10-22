import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const Terms = () => {
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
            <span className="text-primary">{t('termsHero')}</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed">
            {t('termsHeroDesc')}
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 pb-16 max-w-4xl">
        <div className="space-y-6">
          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">1.</span> {t('termsAcceptanceTitle')}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('termsAcceptanceText')}
            </p>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">2.</span> {t('termsServiceTitle')}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('termsServiceText')}
            </p>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">3.</span> {t('termsAccountTitle')}
            </h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>{t('termsAccountList1')}</li>
              <li>{t('termsAccountList2')}</li>
              <li>{t('termsAccountList3')}</li>
              <li>{t('termsAccountList4')}</li>
              <li>{t('termsAccountList5')}</li>
            </ul>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">4.</span> {t('termsPaymentTitle')}
            </h2>
            <p className="text-muted-foreground mb-4">
              {t('termsPaymentText')}
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>{t('termsPaymentList1')}</li>
              <li>{t('termsPaymentList2')}</li>
              <li>{t('termsPaymentList3')}</li>
              <li>{t('termsPaymentList4')}</li>
              <li>{t('termsPaymentList5')}</li>
            </ul>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">5.</span> {t('termsUsageTitle')}
            </h2>
            <p className="text-muted-foreground mb-4">
              {t('termsUsageText')}
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>{t('termsUsageList1')}</li>
              <li>{t('termsUsageList2')}</li>
              <li>{t('termsUsageList3')}</li>
              <li>{t('termsUsageList4')}</li>
              <li>{t('termsUsageList5')}</li>
              <li>{t('termsUsageList6')}</li>
            </ul>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">6.</span> {t('termsIPTitle')}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('termsIPText')}
            </p>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">7.</span> {t('termsTerminationTitle')}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('termsTerminationText')}
            </p>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">8.</span> {t('termsLiabilityTitle')}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('termsLiabilityText')}
            </p>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">9.</span> {t('termsChangesTitle')}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('termsChangesText')}
            </p>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">10.</span> {t('termsContactTitle')}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('termsContactText')}{' '}
              <a href="mailto:legal@spotlightevents.online" className="text-accent hover:underline font-semibold ml-1">
                legal@spotlightevents.online
              </a>
            </p>
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

export default Terms;
