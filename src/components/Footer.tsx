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
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="LinkedIn"
              className="group relative flex justify-center items-center p-2 rounded-md drop-shadow-xl bg-[#0077b5] text-white font-semibold hover:translate-y-3 hover:rounded-[50%] transition-all duration-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1.1em"
                viewBox="0 0 512 512"
                strokeWidth="0"
                fill="currentColor"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  d="M444.17 32H70.28C49.85 32 32 46.7 32 66.89v374.72C32 461.91 49.85 480 70.28 480h373.78c20.54 0 35.94-18.21 35.94-38.39V66.89C480.12 46.7 464.6 32 444.17 32zm-273.3 373.43h-64.18V205.88h64.18zM141 175.54h-.46c-20.54 0-33.84-15.29-33.84-34.43 0-19.49 13.65-34.42 34.65-34.42s33.85 14.82 34.31 34.42c-.01 19.14-13.31 34.43-34.66 34.43zm264.43 229.89h-64.18V296.32c0-26.14-9.34-44-32.56-44-17.74 0-28.24 12-32.91 23.69-1.75 4.2-2.22 9.92-2.22 15.76v113.66h-64.18V205.88h64.18v27.77c9.34-13.3 23.93-32.44 57.88-32.44 42.13 0 74 27.77 74 87.64z"
                ></path>
              </svg>
              <span className="absolute opacity-0 group-hover:opacity-100 group-hover:text-gray-700 group-hover:text-sm group-hover:-translate-y-10 duration-700">
                Linkedin
              </span>
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Facebook"
              className="group relative flex justify-center items-center p-2 rounded-md drop-shadow-xl bg-[#316FF6] text-white font-semibold hover:translate-y-3 hover:rounded-[50%] transition-all duration-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1.1em"
                viewBox="0 0 448 512"
                strokeWidth="0"
                fill="currentColor"
                stroke="currentColor"
                className="w-5"
              >
                <path
                  d="M400 32H48A48 48 0 0 0 0 80v352a48 48 0 0 0 48 48h137.25V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.27c-30.81 0-40.42 19.12-40.42 38.73V256h68.78l-11 71.69h-57.78V480H400a48 48 0 0 0 48-48V80a48 48 0 0 0-48-48z"
                ></path>
              </svg>
              <span className="absolute opacity-0 group-hover:opacity-100 group-hover:text-gray-700 group-hover:text-sm group-hover:-translate-y-10 duration-700">
                Facebook
              </span>
            </a>
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
