import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  sv: {
    translation: {
      // Navigation
      home: "Hem",
      pricing: "Priser",
      howItWorks: "Hur det fungerar",
      contact: "Kontakt",
      login: "Logga in",
      logout: "Logga ut",
      dashboard: "Dashboard",
      campaigns: "Kampanjer",
      analytics: "Analytics",
      calendar: "Kalender",
      reports: "Rapporter",
      notifications: "Notifieringar",
      settings: "Inställningar",
      admin: "Admin",
      
      // Dashboard
      welcomeBack: "Välkommen tillbaka",
      upcomingEvents: "Kommande Events",
      savedCampaigns: "Sparade Kampanjer",
      quickStats: "Snabb Statistik",
      
      // Campaigns
      saveCampaign: "Spara kampanj",
      exportPDF: "Exportera PDF",
      shareCampaign: "Dela",
      sendEmail: "Skicka",
      generateMockup: "Generera mockup",
      comments: "Kommentarer",
      
      // Common
      save: "Spara",
      cancel: "Avbryt",
      delete: "Ta bort",
      edit: "Redigera",
      loading: "Laddar...",
      search: "Sök",
      filter: "Filtrera",
      
      // Plans
      starter: "Starter",
      professional: "Professional",
      enterprise: "Enterprise",
      upgrade: "Uppgradera",
      currentPlan: "Nuvarande plan",
      
      // Team
      owner: "Ägare",
      editor: "Redaktör",
      viewer: "Granskare",
      
      // Index Page - Hero
      heroTitle: "Marknadsför ditt företag vid rätt tillfälle med AI",
      heroSubtitle: "Upptäck lokala evenemang automatiskt och få AI-genererade kampanjer på sekunder. Öka försäljningen när det händer något i ditt område.",
      heroCtaPrimary: "Kom igång gratis",
      heroCtaSecondary: "Se hur det fungerar",
      heroTrustText: "Gratis 14-dagars provperiod • Ingen kreditkort krävs • Avsluta när som helst",
      
      // Stats
      statsCompanies: "Nöjda företag",
      statsCampaigns: "Kampanjer skapade",
      statsSalesIncrease: "Genomsnittlig försäljningsökning",
      statsTimeSaved: "Sparad tid per kampanj",
      
      // Trust Badges
      trustGdprCompliant: "GDPR-kompatibel",
      trustSecureData: "Säker data",
      trustSupport: "24/7 Support",
      trustMoneyBack: "30 dagars återbetalning",
      
      // Features
      featuresTitle: "Allt du behöver för framgångsrik eventmarknadsföring",
      featuresSubtitle: "Kraftfulla funktioner som gör marknadsföring enklare, smartare och mer lönsam",
      featureAnalytics: "Kraftfull Analytics",
      featureAnalyticsDesc: "Följ dina kampanjers prestanda i realtid med detaljerade insikter och ROI-tracking.",
      featureAi: "AI-Driven Kampanjer",
      featureAiDesc: "Låt AI skapa skräddarsydda kampanjer baserade på lokala evenemang och din målgrupp.",
      featureEvents: "Event Discovery",
      featureEventsDesc: "Upptäck automatiskt alla relevanta lokala evenemang i ditt område.",
      
      // User Ratings
      ratingsTitle: "Våra användare älskar oss!",
      ratingsScore: "baserat på 500+ recensioner",
      ratingsRecommend: "rekommenderar Spotlight",
      ratingsEaseOfUse: "Användarvänlighet",
      ratingsSupport: "Kundsupport",
      ratingsRoi: "ROI & Resultat",
      ratingsFeatures: "Funktioner",
      ratingsHappyCustomers: "Nöjda kunder",
      ratingsQuickSetup: "Snabb igångsättning",
      ratingsFreeSupport: "Gratis support",
      ratingsUpdates: "Regelbundna uppdateringar",
      
      // Plans Section
      plansTitle: "Välj den plan som passar dig",
      plansSubtitle: "Prova gratis i 14 dagar. Inget kreditkort krävs.",
      plansBillingMonthly: "Månadsvis",
      plansBillingYearly: "Årsvis",
      plansStarterDesc: "Perfekt för små företag som vill komma igång",
      plansProfessionalDesc: "För växande företag med fler behov",
      plansEnterpriseDesc: "Skräddarsydda lösningar för stora organisationer",
      plansPerMonth: "/månad",
      plansSaveAmount: "Spara",
      plansGetStarted: "Kom igång",
      plansContactUs: "Kontakta oss",
      plansPopular: "Populär",
      
      // Plan Features
      planFeatureSaveCampaigns: "Spara kampanjer till databasen",
      planFeatureBasicView: "Grundläggande kampanjvy",
      planFeatureEditProposals: "Redigera kampanjförslag",
      planFeatureCampaignsLimit: "Upp till {{count}} kampanjer",
      planFeaturePdfExport: "PDF-export",
      planFeatureShareCampaigns: "Dela kampanjer",
      planFeatureAnalytics: "Analytics & ROI-tracking",
      planFeatureAiGeneration: "AI-generering",
      planFeatureEmailCampaigns: "Skicka kampanjer via email",
      planFeatureAdMockups: "AI-genererade annons-mockups",
      planFeatureComments: "Kommentarer & samarbete",
      planFeatureABTesting: "A/B-testning",
      planFeatureTeamManagement: "Team-hantering",
      planFeatureAdvancedAnalytics: "Avancerad analytics",
      planFeaturePrioritySupport: "Prioriterad support",
      planFeatureCustomIntegrations: "Anpassade integrationer",
      planFeatureDedicatedManager: "Dedikerad account manager",
      planFeatureCustomTraining: "Anpassad träning",
      planFeatureWhiteLabel: "White-label alternativ",
      
      // Testimonials
      testimonialsTitle: "Vad säger våra kunder?",
      testimonialsSubtitle: "Lär känna företagen som revolutionerat sin marknadsföring med Spotlight",
      
      // FAQ
      faqTitle: "Vanliga frågor",
      faqSubtitle: "Hitta svar på de vanligaste frågorna om Spotlight",
      
      // CTA Section
      ctaTitle: "Redo att revolutionera din marknadsföring?",
      ctaSubtitle: "Börja skapa AI-drivna kampanjer idag. Ingen kreditkort krävs för provperioden.",
      ctaButton: "Starta din kostnadsfria provperiod",
    }
  },
  en: {
    translation: {
      // Navigation
      home: "Home",
      pricing: "Pricing",
      howItWorks: "How It Works",
      contact: "Contact",
      login: "Login",
      logout: "Logout",
      dashboard: "Dashboard",
      campaigns: "Campaigns",
      analytics: "Analytics",
      calendar: "Calendar",
      reports: "Reports",
      notifications: "Notifications",
      settings: "Settings",
      admin: "Admin",
      
      // Dashboard
      welcomeBack: "Welcome back",
      upcomingEvents: "Upcoming Events",
      savedCampaigns: "Saved Campaigns",
      quickStats: "Quick Stats",
      
      // Campaigns
      saveCampaign: "Save campaign",
      exportPDF: "Export PDF",
      shareCampaign: "Share",
      sendEmail: "Send",
      generateMockup: "Generate mockup",
      comments: "Comments",
      
      // Common
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      loading: "Loading...",
      search: "Search",
      filter: "Filter",
      
      // Plans
      starter: "Starter",
      professional: "Professional",
      enterprise: "Enterprise",
      upgrade: "Upgrade",
      currentPlan: "Current plan",
      
      // Team
      owner: "Owner",
      editor: "Editor",
      viewer: "Viewer",
      
      // Index Page - Hero
      heroTitle: "Market Your Business at the Right Time with AI",
      heroSubtitle: "Automatically discover local events and get AI-generated campaigns in seconds. Boost sales when things are happening in your area.",
      heroCtaPrimary: "Get Started Free",
      heroCtaSecondary: "See How It Works",
      heroTrustText: "Free 14-day trial • No credit card required • Cancel anytime",
      
      // Stats
      statsCompanies: "Happy companies",
      statsCampaigns: "Campaigns created",
      statsSalesIncrease: "Average sales increase",
      statsTimeSaved: "Time saved per campaign",
      
      // Trust Badges
      trustGdprCompliant: "GDPR Compliant",
      trustSecureData: "Secure Data",
      trustSupport: "24/7 Support",
      trustMoneyBack: "30-day money back",
      
      // Features
      featuresTitle: "Everything you need for successful event marketing",
      featuresSubtitle: "Powerful features that make marketing easier, smarter and more profitable",
      featureAnalytics: "Powerful Analytics",
      featureAnalyticsDesc: "Track your campaign performance in real-time with detailed insights and ROI tracking.",
      featureAi: "AI-Driven Campaigns",
      featureAiDesc: "Let AI create custom campaigns based on local events and your target audience.",
      featureEvents: "Event Discovery",
      featureEventsDesc: "Automatically discover all relevant local events in your area.",
      
      // User Ratings
      ratingsTitle: "Our users love us!",
      ratingsScore: "based on 500+ reviews",
      ratingsRecommend: "recommend Spotlight",
      ratingsEaseOfUse: "Ease of Use",
      ratingsSupport: "Customer Support",
      ratingsRoi: "ROI & Results",
      ratingsFeatures: "Features",
      ratingsHappyCustomers: "Happy customers",
      ratingsQuickSetup: "Quick setup",
      ratingsFreeSupport: "Free support",
      ratingsUpdates: "Regular updates",
      
      // Plans Section
      plansTitle: "Choose the plan that fits you",
      plansSubtitle: "Try free for 14 days. No credit card required.",
      plansBillingMonthly: "Monthly",
      plansBillingYearly: "Yearly",
      plansStarterDesc: "Perfect for small businesses getting started",
      plansProfessionalDesc: "For growing businesses with more needs",
      plansEnterpriseDesc: "Custom solutions for large organizations",
      plansPerMonth: "/month",
      plansSaveAmount: "Save",
      plansGetStarted: "Get Started",
      plansContactUs: "Contact Us",
      plansPopular: "Popular",
      
      // Plan Features
      planFeatureSaveCampaigns: "Save campaigns to database",
      planFeatureBasicView: "Basic campaign view",
      planFeatureEditProposals: "Edit campaign proposals",
      planFeatureCampaignsLimit: "Up to {{count}} campaigns",
      planFeaturePdfExport: "PDF export",
      planFeatureShareCampaigns: "Share campaigns",
      planFeatureAnalytics: "Analytics & ROI tracking",
      planFeatureAiGeneration: "AI generation",
      planFeatureEmailCampaigns: "Send campaigns via email",
      planFeatureAdMockups: "AI-generated ad mockups",
      planFeatureComments: "Comments & collaboration",
      planFeatureABTesting: "A/B testing",
      planFeatureTeamManagement: "Team management",
      planFeatureAdvancedAnalytics: "Advanced analytics",
      planFeaturePrioritySupport: "Priority support",
      planFeatureCustomIntegrations: "Custom integrations",
      planFeatureDedicatedManager: "Dedicated account manager",
      planFeatureCustomTraining: "Custom training",
      planFeatureWhiteLabel: "White-label options",
      
      // Testimonials
      testimonialsTitle: "What do our customers say?",
      testimonialsSubtitle: "Meet the companies that revolutionized their marketing with Spotlight",
      
      // FAQ
      faqTitle: "Frequently Asked Questions",
      faqSubtitle: "Find answers to the most common questions about Spotlight",
      
      // CTA Section
      ctaTitle: "Ready to revolutionize your marketing?",
      ctaSubtitle: "Start creating AI-powered campaigns today. No credit card required for trial.",
      ctaButton: "Start Your Free Trial",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'sv',
    supportedLngs: ['sv', 'en'],
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    detection: {
      order: ['localStorage', 'cookie', 'querystring', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
      lookupLocalStorage: 'i18nextLng',
      cookieMinutes: 525600
    },
    interpolation: {
      escapeValue: false
    }
  });

// Update <html lang> on language change for SEO/accessibility
if (typeof document !== 'undefined') {
  document.documentElement.lang = i18n.language;
  i18n.on('languageChanged', (lng) => {
    document.documentElement.lang = lng.split('-')[0];
  });
}

export default i18n;
