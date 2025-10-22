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
      
      // Buttons & Actions
      readMore: "Läs mer",
      getStartedFree: "Kom igång gratis",
      startFree: "Starta gratis",
      contactUs: "Kontakta oss",
      contactSupport: "Kontakta support",
      trySpotlightFree: "Prova Spotlight gratis",
      
      // Simple Features
      autoMonitoring: "Automatisk bevakning",
      autoMonitoringDesc: "Vi övervakar kontinuerligt lokala evenemang och notifierar dig omedelbart.",
      aiCampaigns: "AI-kampanjer",
      aiCampaignsDesc: "Skräddarsydda kampanjtexter genererade av avancerad AI-teknologi.",
      roiTracking: "ROI-tracking",
      roiTrackingDesc: "Följ resultat i realtid och optimera för maximal avkastning.",
      
      // Social Proof
      companiesUsing: "företag använder Spotlight",
      over: "Över",
      companiesCount: "500+ företag",
      
      // Live Stats
      companiesUsingSpotlight: "Företag använder Spotlight",
      campaignsThisMonth: "Kampanjer skapade denna månad",
      customerSatisfaction: "Kundnöjdhet",
      
      // Trust points
      noCommitment: "Ingen bindningstid",
      daysFree: "14 dagar gratis",
      noCreditCard: "Inget kreditkort behövs",
      
      // Rating Categories
      easeOfUse: "Användarvänlighet",
      customerSupport: "Kundsupport",
      
      // Comparison Tables
      comparisonTitle: "Spotlight vs Traditionell Marknadsföring",
      comparisonSubtitle: "Se skillnaden",
      vsCompetitorsTitle: "Spotlight vs Konkurrenter",
      vsCompetitorsSubtitle: "Varför våra kunder väljer oss",
      feature: "Funktion",
      traditionalMarketing: "Traditionell marknadsföring",
      competitor: "Konkurrent",
      
      // Comparison Features
      findEvents: "Hitta relevanta evenemang",
      autoMonitoring247: "Automatisk bevakning 24/7",
      manualSearchWeekly: "Manuell sökning varje vecka",
      createCampaignText: "Skapa kampanjtext",
      aiGenerated60s: "AI-genererad på 60 sekunder",
      manual24hours: "2-4 timmar per kampanj",
      analyticsRoi: "Analytics & ROI",
      realtimeDashboard: "Real-time dashboard",
      manualExcel: "Manuell uppföljning i Excel",
      abTesting: "A/B-testning",
      builtInAutomated: "Inbyggt & automatiserat",
      difficultTimeConsuming: "Svårt och tidskrävande",
      costPerMonth: "Kostnad per månad",
      fromEuro29: "Från €29",
      euro500Plus: "€500+ (timkostnad)",
      
      eventDiscoveryAi: "Event Discovery med AI",
      localEventDatabase: "Lokal eventdatabas",
      basicEventCalendar: "Grundläggande eventkalender",
      swedishSupport: "Support på svenska",
      emailOnly: "Endast email",
      unlimitedCampaigns: "Obegränsade kampanjer",
      limited: "Begränsat",
      realTimeNotifications: "Realtidsnotiser",
      pdfExport: "PDF-export",
      freeTrial14Days: "14 dagars gratis trial",
      startingPriceMonth: "Startpris/månad",
      
      // Customer Stories
      customerStories: "Kundberättelser",
      seeWhatCustomersThink: "Se vad våra kunder tycker",
      
      // Newsletter
      newsletterTitle: "Få marknadsföringstips direkt i din inkorg",
      newsletterDesc: "Prenumerera på vårt nyhetsbrev och få exklusiva tips, case studies och branschinsikter.",
      
      // Other sections
      everythingInOnePlace: "Allt du behöver på ett ställe",
      powerfulToolsModern: "Kraftfulla verktyg för moderna marknadsförare",
      basedOnReviews: "baserat på 500+ recensioner",
      recommendSpotlight: "rekommenderar Spotlight",
      seeUserExperience: "Se vad våra kunder tycker om användarupplevelsen",
      happyCompanies: "Nöjda företag",
      joinHundreds: "Gå med i hundratals företag som redan ökar sin försäljning med Spotlight",
      allPlansInclude: "Alla planer inkluderar 14 dagars gratis provperiod",
      everythingYouNeed: "Allt du behöver veta om Spotlight. Hittar du inte svaret du söker? Kontakta oss gärna!",
      startToday: "Börja idag",
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
      
      // Buttons & Actions
      readMore: "Read more",
      getStartedFree: "Get Started Free",
      startFree: "Start Free",
      contactUs: "Contact Us",
      contactSupport: "Contact Support",
      trySpotlightFree: "Try Spotlight Free",
      
      // Simple Features
      autoMonitoring: "Automatic Monitoring",
      autoMonitoringDesc: "We continuously monitor local events and notify you immediately.",
      aiCampaigns: "AI Campaigns",
      aiCampaignsDesc: "Custom campaign texts generated by advanced AI technology.",
      roiTracking: "ROI Tracking",
      roiTrackingDesc: "Track results in real-time and optimize for maximum return.",
      
      // Social Proof
      companiesUsing: "companies use Spotlight",
      over: "Over",
      companiesCount: "500+ companies",
      
      // Live Stats
      companiesUsingSpotlight: "Companies use Spotlight",
      campaignsThisMonth: "Campaigns created this month",
      customerSatisfaction: "Customer satisfaction",
      
      // Trust points
      noCommitment: "No commitment",
      daysFree: "14 days free",
      noCreditCard: "No credit card needed",
      
      // Rating Categories
      easeOfUse: "Ease of Use",
      customerSupport: "Customer Support",
      
      // Comparison Tables
      comparisonTitle: "Spotlight vs Traditional Marketing",
      comparisonSubtitle: "See the difference",
      vsCompetitorsTitle: "Spotlight vs Competitors",
      vsCompetitorsSubtitle: "Why our customers choose us",
      feature: "Feature",
      traditionalMarketing: "Traditional marketing",
      competitor: "Competitor",
      
      // Comparison Features
      findEvents: "Find relevant events",
      autoMonitoring247: "Automatic monitoring 24/7",
      manualSearchWeekly: "Manual search every week",
      createCampaignText: "Create campaign text",
      aiGenerated60s: "AI-generated in 60 seconds",
      manual24hours: "2-4 hours per campaign",
      analyticsRoi: "Analytics & ROI",
      realtimeDashboard: "Real-time dashboard",
      manualExcel: "Manual tracking in Excel",
      abTesting: "A/B Testing",
      builtInAutomated: "Built-in & automated",
      difficultTimeConsuming: "Difficult and time-consuming",
      costPerMonth: "Cost per month",
      fromEuro29: "From €29",
      euro500Plus: "€500+ (hourly cost)",
      
      eventDiscoveryAi: "Event Discovery with AI",
      localEventDatabase: "Local event database",
      basicEventCalendar: "Basic event calendar",
      swedishSupport: "Swedish support",
      emailOnly: "Email only",
      unlimitedCampaigns: "Unlimited campaigns",
      limited: "Limited",
      realTimeNotifications: "Real-time notifications",
      pdfExport: "PDF export",
      freeTrial14Days: "14-day free trial",
      startingPriceMonth: "Starting price/month",
      
      // Customer Stories
      customerStories: "Customer Stories",
      seeWhatCustomersThink: "See what our customers think",
      
      // Newsletter
      newsletterTitle: "Get marketing tips straight to your inbox",
      newsletterDesc: "Subscribe to our newsletter and receive exclusive tips, case studies, and industry insights.",
      
      // Other sections
      everythingInOnePlace: "Everything you need in one place",
      powerfulToolsModern: "Powerful tools for modern marketers",
      basedOnReviews: "based on 500+ reviews",
      recommendSpotlight: "recommend Spotlight",
      seeUserExperience: "See what our customers think about the user experience",
      happyCompanies: "Happy companies",
      joinHundreds: "Join hundreds of companies already boosting their sales with Spotlight",
      allPlansInclude: "All plans include 14-day free trial",
      everythingYouNeed: "Everything you need to know about Spotlight. Can't find the answer you're looking for? Feel free to contact us!",
      startToday: "Start today",
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
