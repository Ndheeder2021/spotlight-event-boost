import { Link } from "react-router-dom";
import { Zap, Linkedin, Facebook, X, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t py-16 bg-gradient-to-br from-muted/30 via-background to-muted/30" role="contentinfo">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
          <Link 
            to="/" 
            className="flex items-center gap-3 hover:opacity-90 transition-opacity group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary-glow/20 blur-xl group-hover:blur-2xl transition-all duration-300 opacity-60 group-hover:opacity-100 rounded-full" />
              <Zap className="h-8 w-8 text-primary relative z-10 transition-all duration-300 group-hover:rotate-12 hover-glow" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent hover-underline">Spotlight</span>
          </Link>
            <p className="text-base text-muted-foreground leading-relaxed">
              {t('footerDescription')}
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-bold text-lg mb-6">{t('footerProduct')}</h3>
            <nav aria-label="Produkt navigation">
              <ul className="space-y-4">
              <li>
                <Link to="/solution" className="text-base text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  {t('footerSolution')}
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-base text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  {t('footerHowItWorks')}
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-base text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  {t('footerPricing')}
                </Link>
              </li>
              </ul>
            </nav>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-lg mb-6">{t('footerResources')}</h3>
            <nav aria-label="Resurser navigation">
              <ul className="space-y-4">
              <li>
                <Link to="/blog" className="text-base text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  {t('footerBlog')}
                </Link>
              </li>
              <li>
                <Link to="/case-studies" className="text-base text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  {t('footerCaseStudies')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-base text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  {t('footerContact')}
                </Link>
              </li>
              <li>
                <Link to="/investors" className="text-base text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  {t('footerInvestors')}
                </Link>
              </li>
              </ul>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-6">{t('footerLegal')}</h3>
            <nav aria-label="Juridiskt navigation">
              <ul className="space-y-4">
              <li>
                <Link to="/privacy" className="text-base text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  {t('footerPrivacy')}
                </Link>
              </li>
              <li>
                <Link to="/gdpr" className="text-base text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  {t('footerGDPR')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-base text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  {t('footerTerms')}
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-base text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  {t('footerCookies')}
                </Link>
              </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Social Media Links */}
          <nav aria-label="Sociala medier">
            <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-12 w-12 hover:text-primary hover:scale-110 hover:bg-primary/10 transition-all duration-300 hover-glow" asChild>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="h-6 w-6 transition-transform duration-300 hover:rotate-12" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="h-12 w-12 hover:text-primary hover:scale-110 hover:bg-primary/10 transition-all duration-300 hover-glow" asChild>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="h-6 w-6 transition-transform duration-300 hover:rotate-12" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="h-12 w-12 hover:text-primary hover:scale-110 hover:bg-primary/10 transition-all duration-300 hover-glow" asChild>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                <X className="h-6 w-6 transition-transform duration-300 hover:rotate-12" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="h-12 w-12 hover:text-primary hover:scale-110 hover:bg-primary/10 transition-all duration-300 hover-glow" asChild>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="h-6 w-6 transition-transform duration-300 hover:rotate-12" />
              </a>
              </Button>
            </div>
          </nav>

          {/* Copyright */}
          <p className="text-base text-muted-foreground">
            {t('footerCopyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
