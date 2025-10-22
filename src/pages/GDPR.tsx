import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const GDPR = () => {
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
            <span className="text-primary">{t('gdprHero')}</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed">
            {t('gdprHeroDesc')}
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 pb-16 max-w-4xl">
        <div className="space-y-6">
          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4">{t('gdprAboutTitle')}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('gdprAboutText')}
            </p>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4">{t('gdprControllerTitle')}</h2>
            <p className="text-muted-foreground mb-4">
              {t('gdprControllerText')}
            </p>
            <div className="text-muted-foreground bg-muted/30 p-4 rounded-lg">
              <p className="font-semibold">Spotlight AB</p>
              <p>{t('gdprControllerOrg')}</p>
              <p>{t('gdprControllerEmail')} <a href="mailto:gdpr@spotlightevents.online" className="text-accent hover:underline">gdpr@spotlightevents.online</a></p>
            </div>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4">{t('gdprBasisTitle')}</h2>
            <p className="text-muted-foreground mb-4">
              {t('gdprBasisText')}
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>{t('gdprBasisList1Title')}</strong> {t('gdprBasisList1Text')}</li>
              <li><strong>{t('gdprBasisList2Title')}</strong> {t('gdprBasisList2Text')}</li>
              <li><strong>{t('gdprBasisList3Title')}</strong> {t('gdprBasisList3Text')}</li>
              <li><strong>{t('gdprBasisList4Title')}</strong> {t('gdprBasisList4Text')}</li>
            </ul>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4">{t('gdprRetentionTitle')}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('gdprRetentionText')}
            </p>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4">{t('gdprRightsTitle')}</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-accent pl-4">
                <h3 className="font-bold text-lg mb-1">{t('gdprRightAccessTitle')}</h3>
                <p className="text-muted-foreground">{t('gdprRightAccessText')}</p>
              </div>
              <div className="border-l-4 border-accent pl-4">
                <h3 className="font-bold text-lg mb-1">{t('gdprRightRectificationTitle')}</h3>
                <p className="text-muted-foreground">{t('gdprRightRectificationText')}</p>
              </div>
              <div className="border-l-4 border-accent pl-4">
                <h3 className="font-bold text-lg mb-1">{t('gdprRightErasureTitle')}</h3>
                <p className="text-muted-foreground">{t('gdprRightErasureText')}</p>
              </div>
              <div className="border-l-4 border-accent pl-4">
                <h3 className="font-bold text-lg mb-1">{t('gdprRightRestrictionTitle')}</h3>
                <p className="text-muted-foreground">{t('gdprRightRestrictionText')}</p>
              </div>
              <div className="border-l-4 border-accent pl-4">
                <h3 className="font-bold text-lg mb-1">{t('gdprRightPortabilityTitle')}</h3>
                <p className="text-muted-foreground">{t('gdprRightPortabilityText')}</p>
              </div>
              <div className="border-l-4 border-accent pl-4">
                <h3 className="font-bold text-lg mb-1">{t('gdprRightObjectTitle')}</h3>
                <p className="text-muted-foreground">{t('gdprRightObjectText')}</p>
              </div>
            </div>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4">{t('gdprComplaintTitle')}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('gdprComplaintText')}
            </p>
            <div className="mt-4 bg-muted/30 p-4 rounded-lg text-sm text-muted-foreground">
              <p className="font-semibold mb-2">{t('gdprComplaintAuthority')}</p>
              <p>{t('gdprComplaintAddress')}</p>
              <p>{t('gdprComplaintPhone')}</p>
              <p>{t('gdprComplaintEmail')} <a href="mailto:imy@imy.se" className="text-accent hover:underline">imy@imy.se</a></p>
            </div>
          </Card>

          <Card className="p-8 glass-card border-2 hover:border-accent/30 transition-all">
            <h2 className="text-2xl font-bold mb-4">{t('gdprContactTitle')}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('gdprContactText')}{' '}
              <a href="mailto:gdpr@spotlightevents.online" className="text-accent hover:underline font-semibold ml-1">
                gdpr@spotlightevents.online
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

export default GDPR;
