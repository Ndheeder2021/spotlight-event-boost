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
      calendar: "Kalender",
      reports: "Rapporter",
      settings: "Inställningar",
      
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
      analytics: "Analytics",
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
      calendar: "Calendar",
      reports: "Reports",
      settings: "Settings",
      
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
      analytics: "Analytics",
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
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'sv',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
