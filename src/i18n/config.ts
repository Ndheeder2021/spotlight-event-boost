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

      // ROI Calculator
      roiCalculator: "ROI Kalkylator",
      calculateRoi: "Beräkna din ROI med Spotlight",
      roiDescription: "Se hur mycket tid och pengar du kan spara genom att automatisera din eventmarknadsföring",
      yourNumbers: "Dina siffror",
      adjustValues: "Justera värdena för att se din potentiella ROI",
      eventsPerMonth: "Antal events per månad",
      averageEvents: "Genomsnittligt antal lokala events du skulle vilja marknadsföra mot",
      hoursPerCampaign: "Timmar per kampanj (manuellt)",
      timeSpentManual: "Tid du spenderar på att hitta events, skapa kampanjtext och planera",
      withSpotlight: "Med Spotlight:",
      minPerCampaign: "~15 min per kampanj",
      yourRoi: "Din ROI",
      savingsPerMonth: "Så här mycket kan du spara varje månad",
      timeSaved: "Tid sparad",
      perCampaign: "per kampanj",
      events: "events",
      valueOfTime: "Värde av sparad tid",
      perHour: "/timme",
      netSavingsMonth: "Nettobesparing per månad",
      afterSpotlightCost: "Efter Spotlight-kostnad ($29/mån)",
      startFreeAndSave: "Starta gratis & spara tid",
      freeTrialNoBind: "14 dagars gratis provperiod • Ingen bindningstid",
      roiDisclaimer: "* Beräkningarna baseras på en genomsnittlig timkostnad på $50 och Spotlights förmåga att reducera kampanjskapande från 3h till ~15 minuter med AI-automation.",

      // Product Tour
      takeATour: "Ta en rundtur",
      tourStep: "Steg",
      of: "av",
      previous: "Föregående",
      next: "Nästa",
      tools: "Verktyg",
      
      tourStep1Title: "Upptäck lokala evenemang automatiskt",
      tourStep1Desc: "Spotlight övervakar kontinuerligt alla evenemang i ditt område och notifierar dig när det händer något relevant för din verksamhet.",
      tourStep1Feature1: "Realtidsbevakning av 10,000+ evenemang",
      tourStep1Feature2: "Filtrera efter typ, storlek och avstånd",
      tourStep1Feature3: "Direkta notiser vid nya events",

      tourStep2Title: "AI skapar kampanjer på 60 sekunder",
      tourStep2Desc: "Välj ett evenemang och låt vår AI generera professionella, skräddarsydda kampanjtexter som matchar din målgrupp och varumärke.",
      tourStep2Feature1: "ChatGPT-driven copywriting",
      tourStep2Feature2: "Anpassat efter din bransch",
      tourStep2Feature3: "Flera varianter att välja mellan",

      tourStep3Title: "Spåra och optimera dina resultat",
      tourStep3Desc: "Se exakt hur dina kampanjer presterar med detaljerad analytics, ROI-tracking och A/B-testning i realtid.",
      tourStep3Feature1: "Real-time analytics dashboard",
      tourStep3Feature2: "ROI-beräkning per kampanj",
      tourStep3Feature3: "A/B-testning för optimering",

      tourStep4Title: "Planera framåt med Event Calendar",
      tourStep4Desc: "Få full översikt över kommande evenemang och planera dina kampanjer i förväg för maximalt genomslag.",
      tourStep4Feature1: "Kalendervy över alla events",
      tourStep4Feature2: "Prognoser för kundflöde",
      tourStep4Feature3: "Automatiska påminnelser",

      keyFeatures: "Nyckelfunktioner:",
      interactiveDemo: "Interaktiv demo",

      // Newsletter
      newsletterEmailPlaceholder: "Din e-postadress",
      newsletterSubscribe: "Prenumerera",
      newsletterSubscribing: "Prenumererar...",
      newsletterSuccess: "Du är nu prenumerant på vårt nyhetsbrev!",
      newsletterError: "Något gick fel. Försök igen.",
      newsletterInvalidEmail: "Vänligen ange en giltig e-postadress",
      newsletterThankYou: "Tack! Du är nu prenumerant.",

      // Trust Badge
      trustedByLocal: "BETRODD AV LOKALA FÖRETAG ÖVER HELA SVERIGE",

      // Header Menu Items
      product: "Produkt",
      solution: "Lösning",
      more: "Mer",
      pricesPerks: "Prices & Perks",
      pricesBenefits: "Priser & Förmåner",
      blog: "Blog",
      caseStudies: "Case Studies",
      referFriend: "Refer a Friend",
      affiliate: "Affiliate",
      investors: "Investerare",

      // FAQ Page Titles
      moreQuestions: "Har du fler frågor?",
      supportTeamHelp: "Vårt supportteam är här för att hjälpa dig. Tveka inte att höra av dig!",
      contactSupportButton: "Contact Support",
      
      // Close/Actions
      close: "Stäng",
      goToStep: "Gå till steg",

      // FAQ Questions & Answers
      faq1Q: "Vad är Spotlight?",
      faq1A: "Spotlight är en AI-driven plattform som hjälper lokala företag att upptäcka närliggande evenemang och automatiskt skapa marknadsföringskampanjer för att dra nytta av det ökade kundflödet.",
      faq2Q: "Hur fungerar det?",
      faq2A: "Vi övervakar kontinuerligt lokala evenemang i ditt område och skickar notifieringar när relevanta evenemang hittas. Du kan sedan använda vår AI för att generera professionell kampanjtext eller skapa egna kampanjer. Allt samlas i en enkel och intuitiv dashboard.",
      faq3Q: "Vilka typer av evenemang täcker ni?",
      faq3A: "Vi täcker allt från konserter, sportevenemang, festivaler, mässor till kulturella evenemang och lokala aktiviteter. Vår databas uppdateras kontinuerligt med nya evenemang från olika källor.",
      faq4Q: "Kan jag testa Spotlight gratis?",
      faq4A: "Ja! Vi erbjuder en 14-dagars gratis testperiod där du får full tillgång till alla funktioner i din valda plan. Inget kreditkort krävs för att starta testperioden.",
      faq5Q: "Hur avbokar jag mitt abonnemang?",
      faq5A: "Du kan när som helst avboka ditt abonnemang från inställningar i din dashboard. Abonnemanget fortsätter till slutet av din betalningsperiod, och du behåller tillgång till alla funktioner fram till dess.",
      faq6Q: "Kan jag byta plan senare?",
      faq6A: "Absolut! Du kan uppgradera eller nedgradera din plan när som helst. Ändringar träder i kraft omedelbart och vi justerar faktureringen proportionellt.",
      faq7Q: "Hur exakt är event-upptäckten?",
      faq7A: "Vår AI-drivna teknologi söker igenom flera datakällor och filtrerar evenemang baserat på din plats och bransch. Vi har en noggrannhet på över 95% och uppdaterar händelser i realtid.",
      faq8Q: "Kan jag använda Spotlight för flera platser?",
      faq8A: "Ja, på Professional och Enterprise-planerna kan du övervaka evenemang för flera platser samtidigt. Detta är perfekt för företag med flera verksamheter.",
      faq9Q: "Hur hanteras mina kampanjer?",
      faq9A: "Du kan spara, redigera, dela och exportera dina kampanjer. På Professional-planen får du även tillgång till PDF-export, delning via lösenordsskyddade länkar och möjlighet att skicka kampanjer direkt via email.",
      faq10Q: "Är mina data säkra?",
      faq10A: "Ja, vi tar datasäkerhet på största allvar. All data krypteras både vid överföring och lagring. Vi följer GDPR och lagrar data i säkra datacenter i EU. Du äger alltid dina egna data.",
      faq11Q: "Vilken support får jag?",
      faq11A: "Alla planer inkluderar email-support. Professional-planen får tillgång till AI Live Support för snabbare svar. Enterprise-kunder får dedikerad support med garanterad svarstid.",
      faq12Q: "Kan jag integrera Spotlight med andra verktyg?",
      faq12A: "Ja! Vi erbjuder integrationer med populära marknadsföringsverktyg, CRM-system och sociala medier. Enterprise-planen inkluderar även anpassade integrationer för dina specifika behov.",

      // Dashboard Page
      mustBeLoggedIn: "Du måste vara inloggad",
      couldNotFindUser: "Kunde inte hitta användarinfo",
      eventRemoved: "Event borttaget från sparade",
      eventSaved: "Event sparat!",
      couldNotSaveEvent: "Kunde inte spara/ta bort event",
      bigEvent: "Stort event!",
      guestsApproaching: "gäster närmar sig!",
      savedEvents: "Sparade Events",
      showAll: "Visa alla",
      youHaveSaved: "Du har",
      savedEvent: "sparade event",
      savedEvents_plural: "s",
      eventRadar: "Event Radar",
      eventsNearYou: "Event i närheten av din verksamhet",
      loadingEvents: "Laddar event...",
      noEventsFound: "Inga event hittades",
      allEvents: "Alla event",

      // Calendar Page
      calendarForecast: "Kalender & Prognos",
      overviewEvents: "Översikt över events, kampanjer och trafikprognos",
      publicEvents: "Publika Events",
      myCampaigns: "Mina Kampanjer",
      internalEvents: "Interna Events",
      all: "Alla",
      publicEventsFilter: "Publika Events",
      myCampaignsFilter: "Mina Kampanjer",
      internalEventsFilter: "Interna Events",
      exportICS: "Exportera ICS",
      addToGoogleCal: "Lägg till i Google Calendar",
      colorCoding: "Färgkodning: Grön = Låg trafik, Gul = Medel, Orange = Hög, Röd = Mycket hög",
      mon: "Mån",
      tue: "Tis",
      wed: "Ons",
      thu: "Tor",
      fri: "Fre",
      sat: "Lör",
      sun: "Sön",
      calendarDownloaded: "Kalenderfil nedladdad!",
      noEventsToExport: "Inga events att exportera",
      campaignStarts24h: "Din kampanj för {{title}} startar inom 24 timmar!",

      // Settings Page
      settingsTitle: "Inställningar",
      manageBusinessIntegrations: "Hantera din verksamhet och integrationer",
      businessTab: "Verksamhet",
      teamSubscriptionTab: "Team & Abonnemang",
      integrationsTab: "Integrationer",
      businessInfo: "Verksamhetsinformation",
      updateBusinessInfo: "Uppdatera information om din verksamhet",
      businessName: "Verksamhetens namn",
      businessType: "Typ av verksamhet",
      cafe: "Café",
      bar: "Bar",
      restaurant: "Restaurang",
      hotel: "Hotell",
      locationAndRadius: "Plats och sökområde",
      saveChanges: "Spara ändringar",
      saving: "Sparar...",
      settingsSaved: "Inställningar sparade!",
      businessNameRequired: "Verksamhetens namn krävs",
      addressRequired: "Adress krävs",
      cityRequired: "Stad krävs",
      subscription: "Abonnemang",
      manageSubscription: "Hantera ditt abonnemang och välj rätt plan för dina behov",
      autoEventImport: "Automatisk Event-import",
      eventsImportedDaily: "Events importeras automatiskt varje dag",
      autoDailyUpdate: "Automatisk daglig uppdatering",
      autoUpdateDesc: "Spotlight hämtar automatiskt nya events varje dag baserat på din verksamhets plats och sökradie. Events läggs till i din kalender utan att du behöver göra något.",
      importFeatures: "✓ Konserter, sportevenemang & festivaler • ✓ Datum, tid & förväntad publik • ✓ Uppdateras varje natt kl. 02:00",
      adminManualImport: "Admin: Manuell import",
      adminManualImportDesc: "Som administratör kan du köra en manuell import av events direkt istället för att vänta på den automatiska importen.",
      importing: "Importerar...",
      importNow: "Importera nu",
      noLocationConfigured: "Ingen plats konfigurerad. Vänligen ställ in din affärs plats först",
      importingEvents: "Importerar events...",
      importSuccess: "✓ Import lyckades! {{count}} events importerades",
      noEventsFoundImport: "0 events hittades. Prova att öka radien för fler träffar.",
      importError: "Ett fel uppstod vid import",
      importInfo: "Info: Events importeras automatiskt baserat på din konfigurerade plats och radie. Dubbletter filtreras automatiskt bort. Systemet hämtar events för de kommande 90 dagarna.",

      // Notifications Page
      notificationsTitle: "Notifieringar",
      configureNotifications: "Konfigurera automatiska notifieringar för stora events",
      newNotificationRule: "Ny notifieringsregel",
      getNotifiedBigEvents: "Få meddelanden när stora events sker nära din verksamhet",
      minAttendees: "Minsta antal deltagare",
      radiusKm: "Radie (km)",
      channel: "Kanal",
      email: "E-post",
      inapp: "In-app",
      createRule: "Skapa regel",
      activeRules: "Aktiva regler",
      noNotificationRules: "Inga notifieringsregler än",
      eventsWith: "Events med",
      attendeesWithin: "+ deltagare inom",
      km: "km",
      lastTriggered: "Senast utlöst:",
      ruleCreated: "Notifieringsregel skapad!",
      ruleEnabled: "Regel aktiverad",
      ruleDisabled: "Regel inaktiverad",
      confirmDeleteRule: "Är du säker på att du vill ta bort denna regel?",
      ruleDeleted: "Regel raderad",

      // Reports/Analytics Page
      analyticsReports: "Analytics & Rapporter",
      detailedStats: "Detaljerad statistik och insikter",
      analyticsRequiresPro: "Analytics kräver Professional",
      upgradeForAnalytics: "Uppgradera till Professional eller Enterprise för att få tillgång till detaljerad analytics, grafer och insikter om dina kampanjer och events.",
      upgradeNow: "Uppgradera nu",
      loadingAnalytics: "Laddar analytics...",
      overviewStats: "Översikt och statistik för dina kampanjer och events",
      totalCampaigns: "Totalt Kampanjer",
      allCreatedCampaigns: "Alla skapade kampanjer",
      activeCampaigns: "Aktiva Kampanjer",
      publishedCampaigns: "Publicerade kampanjer",
      eventsThisWeek: "Events Denna Vecka",
      inYourArea: "I ditt område",
      totalEvents: "Totalt Events",
      nearbyEvents: "Närliggande events",
      campaignsByStatus: "Kampanjer per Status",
      statusDistribution: "Fördelning av kampanjstatus",
      draft: "Utkast",
      scheduled: "Schemalagd",
      published: "Publicerad",
      noDataAvailable: "Ingen data tillgänglig",
      activityLast7Days: "Aktivitet Senaste 7 Dagarna",
      createdCampaignsNewEvents: "Skapade kampanjer och nya events",
      campaigns_lowercase: "kampanjer",
      events_lowercase: "events",
      roiCalculation: "ROI-beräkning",
      calculateROI: "Beräkna avkastning på kampanjer",
      campaignCost: "Kampanjkostnad (SEK)",
      revenueValue: "Intäkter/Värde (SEK)",
      calculateROIButton: "Beräkna ROI",
      calculatedROI: "Beräknad ROI",
      youGotBack: "Du fick tillbaka {{value}}x din investering",
      negativeROI: "Negativ avkastning - justera din strategi",
      campaignPerformance: "Kampanjprestanda",
      compareCampaigns: "Jämför dina kampanjer",
      exportReport: "Exportera rapport",
      reportExported: "Rapport exporterad!",

      // Campaigns Page
      savedEventsAndCampaigns: "Sparade Events & Kampanjer",
      yourSavedEvents: "Dina sparade events och AI-genererade kampanjer",
      noSavedEventsYet: "Inga sparade events än",
      goToDashboardSave: "Gå till Dashboard och spara events genom att klicka på bookmark-ikonen",
      event: "Event",
      unknownEvent: "Okänt event",
      start: "Start",
      end: "Slut",
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

      // ROI Calculator
      roiCalculator: "ROI Calculator",
      calculateRoi: "Calculate Your ROI with Spotlight",
      roiDescription: "See how much time and money you can save by automating your event marketing",
      yourNumbers: "Your Numbers",
      adjustValues: "Adjust values to see your potential ROI",
      eventsPerMonth: "Events per month",
      averageEvents: "Average number of local events you'd like to market to",
      hoursPerCampaign: "Hours per campaign (manual)",
      timeSpentManual: "Time spent finding events, creating campaign copy and planning",
      withSpotlight: "With Spotlight:",
      minPerCampaign: "~15 min per campaign",
      yourRoi: "Your ROI",
      savingsPerMonth: "How much you can save each month",
      timeSaved: "Time saved",
      perCampaign: "per campaign",
      events: "events",
      valueOfTime: "Value of saved time",
      perHour: "/hour",
      netSavingsMonth: "Net savings per month",
      afterSpotlightCost: "After Spotlight cost ($29/month)",
      startFreeAndSave: "Start Free & Save Time",
      freeTrialNoBind: "14-day free trial • No commitment",
      roiDisclaimer: "* Calculations based on an average hourly rate of $50 and Spotlight's ability to reduce campaign creation from 3h to ~15 minutes with AI automation.",

      // Product Tour
      takeATour: "Take a Tour",
      tourStep: "Step",
      of: "of",
      previous: "Previous",
      next: "Next",
      tools: "Tools",
      
      tourStep1Title: "Discover local events automatically",
      tourStep1Desc: "Spotlight continuously monitors all events in your area and notifies you when something relevant happens for your business.",
      tourStep1Feature1: "Real-time monitoring of 10,000+ events",
      tourStep1Feature2: "Filter by type, size and distance",
      tourStep1Feature3: "Direct notifications for new events",

      tourStep2Title: "AI creates campaigns in 60 seconds",
      tourStep2Desc: "Choose an event and let our AI generate professional, customized campaign texts that match your target audience and brand.",
      tourStep2Feature1: "ChatGPT-driven copywriting",
      tourStep2Feature2: "Adapted to your industry",
      tourStep2Feature3: "Multiple variants to choose from",

      tourStep3Title: "Track and optimize your results",
      tourStep3Desc: "See exactly how your campaigns perform with detailed analytics, ROI tracking and real-time A/B testing.",
      tourStep3Feature1: "Real-time analytics dashboard",
      tourStep3Feature2: "ROI calculation per campaign",
      tourStep3Feature3: "A/B testing for optimization",

      tourStep4Title: "Plan ahead with Event Calendar",
      tourStep4Desc: "Get a full overview of upcoming events and plan your campaigns in advance for maximum impact.",
      tourStep4Feature1: "Calendar view of all events",
      tourStep4Feature2: "Customer flow forecasts",
      tourStep4Feature3: "Automatic reminders",

      keyFeatures: "Key Features:",
      interactiveDemo: "Interactive demo",

      // Newsletter
      newsletterEmailPlaceholder: "Your email address",
      newsletterSubscribe: "Subscribe",
      newsletterSubscribing: "Subscribing...",
      newsletterSuccess: "You are now subscribed to our newsletter!",
      newsletterError: "Something went wrong. Please try again.",
      newsletterInvalidEmail: "Please enter a valid email address",
      newsletterThankYou: "Thank you! You are now subscribed.",

      // Trust Badge
      trustedByLocal: "TRUSTED BY LOCAL BUSINESSES ACROSS SWEDEN",

      // Header Menu Items
      product: "Product",
      solution: "Solution",
      more: "More",
      pricesPerks: "Prices & Perks",
      pricesBenefits: "Prices & Benefits",
      blog: "Blog",
      caseStudies: "Case Studies",
      referFriend: "Refer a Friend",
      affiliate: "Affiliate",
      investors: "Investors",

      // FAQ Page Titles
      moreQuestions: "Have more questions?",
      supportTeamHelp: "Our support team is here to help you. Don't hesitate to reach out!",
      contactSupportButton: "Contact Support",
      
      // Close/Actions
      close: "Close",
      goToStep: "Go to step",
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
