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
