import cafeBrodSalt from "@/assets/case-cafe-brod-salt.jpg";
import restaurantSmak from "@/assets/case-restaurant-smak.jpg";
import urbanBarGrill from "@/assets/case-urban-bar-grill.jpg";
import testimonialAnna from "@/assets/testimonial-anna-cafe.jpg";
import testimonialErik from "@/assets/testimonial-erik-restaurant.jpg";
import testimonialMaria from "@/assets/testimonial-maria-bar.jpg";

export interface CaseStudy {
  id: string;
  title: { sv: string; en: string };
  subtitle: { sv: string; en: string };
  company: string;
  industry: { sv: string; en: string };
  location: string;
  heroImage: string;
  logo?: string;
  results: {
    metric: { sv: string; en: string };
    value: string;
    description: { sv: string; en: string };
  }[];
  challenge: { sv: string; en: string };
  solution: { sv: string; en: string };
  implementation: { sv: string[]; en: string[] };
  testimonial: {
    quote: { sv: string; en: string };
    author: string;
    role: { sv: string; en: string };
    image: string;
  };
  keyTakeaways: { sv: string[]; en: string[] };
}

export const caseStudies: CaseStudy[] = [
  {
    id: "cafe-x-45-percent-increase",
    title: {
      sv: "Hur Café Bröd & Salt ökade sin försäljning med 45%",
      en: "How Café Bröd & Salt Increased Sales by 45%"
    },
    subtitle: {
      sv: "Från reaktiv till proaktiv event marketing",
      en: "From Reactive to Proactive Event Marketing"
    },
    company: "Café Bröd & Salt",
    industry: {
      sv: "Café & Bageri",
      en: "Café & Bakery"
    },
    location: "Stockholm, Södermalm",
    heroImage: cafeBrodSalt,
    results: [
      {
        metric: { sv: "Försäljningsökning", en: "Sales Increase" },
        value: "45%",
        description: { sv: "Under lokala evenemang", en: "During local events" }
      },
      {
        metric: { sv: "Kampanjeffektivitet", en: "Campaign Effectiveness" },
        value: "3x",
        description: { sv: "Fler konverteringar per kampanj", en: "More conversions per campaign" }
      },
      {
        metric: { sv: "Tidsbesparing", en: "Time Savings" },
        value: "12h/vecka",
        description: { sv: "Automatiserad kampanjplanering", en: "Automated campaign planning" }
      },
      {
        metric: { sv: "ROI", en: "ROI" },
        value: "420%",
        description: { sv: "Return on investment första kvartalet", en: "Return on investment first quarter" }
      }
    ],
    challenge: {
      sv: "Café Bröd & Salt låg mitt i Stockholms mest eventtäta område, men ägaren Anna Svensson hade svårt att hålla koll på alla konserter, festivaler och sportevenemang som lockade människor till området. 'Vi missade ständigt möjligheter att dra nytta av det ökade kundflödet. När vi väl fick reda på ett evenemang var det ofta för sent att planera en effektiv kampanj,' berättar Anna.",
      en: "Café Bröd & Salt was located in Stockholm's busiest event area, but owner Anna Svensson struggled to keep track of all concerts, festivals, and sports events attracting people to the neighborhood. 'We constantly missed opportunities to capitalize on increased foot traffic. By the time we heard about an event, it was often too late to plan an effective campaign,' Anna explains."
    },
    solution: {
      sv: "Med Spotlight fick Anna automatiska notifieringar om alla relevanta evenemang inom 2 km från caféet. Plattformens AI analyserade vilka evenemang som skulle passa bäst för deras målgrupp och genererade färdiga kampanjförslag. 'Plötsligt hade vi en 14-dagars framförhållning på alla möjligheter. Vi kunde planera specialerbjudanden, öka personalen och beställa extra varor i god tid.'",
      en: "With Spotlight, Anna received automatic notifications about all relevant events within 2 km of the café. The platform's AI analyzed which events would best suit their target audience and generated ready-made campaign suggestions. 'Suddenly we had 14 days' notice of all opportunities. We could plan special offers, increase staff, and order extra supplies well in advance.'"
    },
    implementation: {
      sv: [
        "Vecka 1: Installerade Spotlight och konfigurerade notifieringar för evenemang inom 2 km",
        "Vecka 2: Testade AI-genererade kampanjer för tre mindre evenemang",
        "Vecka 3: Skalade upp med automatiska kampanjer för alla relevanta evenemang",
        "Vecka 4: Integrerade kampanjresultat med kassasystemet för ROI-tracking"
      ],
      en: [
        "Week 1: Installed Spotlight and configured notifications for events within 2 km",
        "Week 2: Tested AI-generated campaigns for three smaller events",
        "Week 3: Scaled up with automatic campaigns for all relevant events",
        "Week 4: Integrated campaign results with POS system for ROI tracking"
      ]
    },
    testimonial: {
      quote: {
        sv: "Spotlight har förvandlat hur vi arbetar med marknadsföring. Vi har gått från att missa möjligheter till att vara steget före. Försäljningen har ökat med 45% och vi sparar timmar varje vecka. Det är den bästa investeringen vi gjort för vårt café.",
        en: "Spotlight has transformed how we work with marketing. We've gone from missing opportunities to being one step ahead. Sales have increased by 45% and we save hours every week. It's the best investment we've made for our café."
      },
      author: "Anna Svensson",
      role: {
        sv: "Ägare, Café Bröd & Salt",
        en: "Owner, Café Bröd & Salt"
      },
      image: testimonialAnna
    },
    keyTakeaways: {
      sv: [
        "Automatiserad event-discovery sparade 12 timmar per vecka i researchtid",
        "AI-genererade kampanjer ökade konverteringsgraden med 300%",
        "Proaktiv planering möjliggjorde bättre lagerhantering och personalplanering",
        "ROI-tracking visade tydligt vilka eventtyper som gav bäst resultat"
      ],
      en: [
        "Automated event discovery saved 12 hours per week in research time",
        "AI-generated campaigns increased conversion rate by 300%",
        "Proactive planning enabled better inventory and staff management",
        "ROI tracking clearly showed which event types yielded the best results"
      ]
    }
  },
  {
    id: "restaurant-smak-triple-revenue",
    title: {
      sv: "Restaurant Smak fördubblade sina kampanjresultat",
      en: "Restaurant Smak Doubled Their Campaign Results"
    },
    subtitle: {
      sv: "Från manuell planering till AI-driven automation",
      en: "From Manual Planning to AI-Driven Automation"
    },
    company: "Restaurant Smak",
    industry: {
      sv: "Restaurang",
      en: "Restaurant"
    },
    location: "Göteborg, Centrum",
    heroImage: restaurantSmak,
    results: [
      {
        metric: { sv: "Kampanjkonvertering", en: "Campaign Conversion" },
        value: "210%",
        description: { sv: "Ökning i bokningar från kampanjer", en: "Increase in bookings from campaigns" }
      },
      {
        metric: { sv: "Kostnadseffektivitet", en: "Cost Efficiency" },
        value: "65%",
        description: { sv: "Lägre kostnad per konvertering", en: "Lower cost per conversion" }
      },
      {
        metric: { sv: "Kampanjvolym", en: "Campaign Volume" },
        value: "8x",
        description: { sv: "Fler kampanjer utan extra arbetstid", en: "More campaigns without extra work hours" }
      },
      {
        metric: { sv: "Kundlojalitet", en: "Customer Loyalty" },
        value: "+32%",
        description: { sv: "Återkommande gäster från event-kampanjer", en: "Returning guests from event campaigns" }
      }
    ],
    challenge: {
      sv: "Erik Lundberg, marknadsansvarig på Restaurant Smak, kämpade med att skapa tillräckligt många kampanjer för att hänga med i Göteborgs livliga eventkalender. 'Vi hade tiden för max 2-3 kampanjer per månad. Samtidigt hände det 20-30 relevanta evenemang som vi skulle kunna kapitalisera på. Vi lämnade pengar på bordet varje vecka.'",
      en: "Erik Lundberg, marketing manager at Restaurant Smak, struggled to create enough campaigns to keep up with Gothenburg's vibrant event calendar. 'We only had time for 2-3 campaigns per month. Meanwhile, there were 20-30 relevant events we could capitalize on. We were leaving money on the table every week.'"
    },
    solution: {
      sv: "Spotlight's AI-motor började generera skräddarsydda kampanjer automatiskt baserat på kommande evenemang. Systemet analyserade historisk data för att identifiera vilka eventtyper som gav bäst resultat för restaurangen. 'Nu skapar AI första utkastet, vi justerar vid behov, och kör. Vi har gått från 3 kampanjer per månad till 24, utan att anställa extra personal.'",
      en: "Spotlight's AI engine began generating tailored campaigns automatically based on upcoming events. The system analyzed historical data to identify which event types yielded the best results for the restaurant. 'Now AI creates the first draft, we adjust as needed, and launch. We've gone from 3 campaigns per month to 24, without hiring extra staff.'"
    },
    implementation: {
      sv: [
        "Fas 1: AI-analys av historiska kampanjresultat och kunddata",
        "Fas 2: Automatisk kampanjgenerering för alla identifierade evenemang",
        "Fas 3: A/B-testning av olika kampanjformat med AI-optimering",
        "Fas 4: Integration med bokningssystem för automatisk resultatuppföljning"
      ],
      en: [
        "Phase 1: AI analysis of historical campaign results and customer data",
        "Phase 2: Automatic campaign generation for all identified events",
        "Phase 3: A/B testing of different campaign formats with AI optimization",
        "Phase 4: Integration with booking system for automatic results tracking"
      ]
    },
    testimonial: {
      quote: {
        sv: "AI-funktionen har varit en game-changer. Vi når nu 8 gånger fler potentiella gäster med kampanjer som konverterar dubbelt så bra som våra gamla manuella försök. Och vi gör det på samma tid som tidigare. Det är nästan magiskt.",
        en: "The AI feature has been a game-changer. We now reach 8 times more potential guests with campaigns that convert twice as well as our old manual attempts. And we do it in the same time as before. It's almost magical."
      },
      author: "Erik Lundberg",
      role: {
        sv: "Marknadsansvarig, Restaurant Smak",
        en: "Marketing Manager, Restaurant Smak"
      },
      image: testimonialErik
    },
    keyTakeaways: {
      sv: [
        "AI-driven kampanjgenerering möjliggjorde 8x fler kampanjer utan extra personal",
        "Historisk dataanalys identifierade de mest lönsamma eventtyperna",
        "A/B-testning med AI-optimering ökade konverteringsgraden med 210%",
        "Automatisk ROI-tracking visade 65% lägre kostnad per konvertering"
      ],
      en: [
        "AI-driven campaign generation enabled 8x more campaigns without extra staff",
        "Historical data analysis identified the most profitable event types",
        "A/B testing with AI optimization increased conversion rate by 210%",
        "Automatic ROI tracking showed 65% lower cost per conversion"
      ]
    }
  },
  {
    id: "urban-bar-grill-efficiency",
    title: {
      sv: "Urban Bar & Grill fördubblade kampanjproduktionen",
      en: "Urban Bar & Grill Doubled Campaign Production"
    },
    subtitle: {
      sv: "Professionell marknadsföring utan att öka arbetsbördan",
      en: "Professional Marketing Without Increasing Workload"
    },
    company: "Urban Bar & Grill",
    industry: {
      sv: "Bar & Restaurang",
      en: "Bar & Restaurant"
    },
    location: "Malmö, Västra Hamnen",
    heroImage: urbanBarGrill,
    results: [
      {
        metric: { sv: "Kampanjvolym", en: "Campaign Volume" },
        value: "200%",
        description: { sv: "Fördubbling av antal kampanjer", en: "Doubling of number of campaigns" }
      },
      {
        metric: { sv: "Arbetstid", en: "Working Hours" },
        value: "0%",
        description: { sv: "Ingen ökning trots fler kampanjer", en: "No increase despite more campaigns" }
      },
      {
        metric: { sv: "Kvalitet", en: "Quality" },
        value: "+85%",
        description: { sv: "Högre upplevd professionalism", en: "Higher perceived professionalism" }
      },
      {
        metric: { sv: "Engagemang", en: "Engagement" },
        value: "+120%",
        description: { sv: "Ökad social media interaktion", en: "Increased social media interaction" }
      }
    ],
    challenge: {
      sv: "Maria Andersson, VD för Urban Bar & Grill, ville expandera sin marknadsföring men saknade resurser. 'Vi hade en person som jobbade med marknadsföring på halvtid. Det räckte knappt för att hålla våra sociala medier uppdaterade, än mindre skapa sofistikerade event-kampanjer. Men vi såg konkurrenterna göra det och ta vår marknad.'",
      en: "Maria Andersson, CEO of Urban Bar & Grill, wanted to expand her marketing but lacked resources. 'We had one person working part-time on marketing. That was barely enough to keep our social media updated, let alone create sophisticated event campaigns. But we saw competitors doing it and taking our market.'"
    },
    solution: {
      sv: "Spotlight blev deras digitala marknadsavdelning. Plattformen hanterade allt från event-discovery till kampanjskapande och resultatuppföljning. AI-genererade visuella mockups gjorde kampanjerna professionella. 'Nu producerar vi lika många kampanjer som kedjor med stora marknadsavdelningar, men vi är fortfarande bara en person på halvtid.'",
      en: "Spotlight became their digital marketing department. The platform handled everything from event discovery to campaign creation and results tracking. AI-generated visual mockups made the campaigns professional. 'Now we produce as many campaigns as chains with large marketing departments, but we're still just one person part-time.'"
    },
    implementation: {
      sv: [
        "Månad 1: Setup och grundkonfiguration, första AI-kampanjerna",
        "Månad 2: Implementering av delningsfunktion för samarbete med influencers",
        "Månad 3: A/B-testning och optimering av kampanjformat",
        "Månad 4: Full automation med minimal mänsklig input"
      ],
      en: [
        "Month 1: Setup and basic configuration, first AI campaigns",
        "Month 2: Implementation of sharing feature for collaboration with influencers",
        "Month 3: A/B testing and optimization of campaign formats",
        "Month 4: Full automation with minimal human input"
      ]
    },
    testimonial: {
      quote: {
        sv: "Spotlight har demokratiserat professionell marknadsföring. Vi, som ett medelstort företag, kan nu konkurrera med stora kedjor när det gäller kampanjvolym och kvalitet. Och vi gör det utan att anställa fler. Det är revolutionerande.",
        en: "Spotlight has democratized professional marketing. We, as a medium-sized business, can now compete with large chains in terms of campaign volume and quality. And we do it without hiring more people. It's revolutionary."
      },
      author: "Maria Andersson",
      role: {
        sv: "VD, Urban Bar & Grill",
        en: "CEO, Urban Bar & Grill"
      },
      image: testimonialMaria
    },
    keyTakeaways: {
      sv: [
        "Små team kan nu producera kampanjer i professionell kvalitet och volym",
        "AI-genererade visuella mockups eliminerade behovet av designresurser",
        "Delningsfunktionen möjliggjorde enkelt samarbete med partners och influencers",
        "Resultatuppföljning visade tydligt vilka kampanjer som gav bäst ROI"
      ],
      en: [
        "Small teams can now produce campaigns in professional quality and volume",
        "AI-generated visual mockups eliminated the need for design resources",
        "Sharing feature enabled easy collaboration with partners and influencers",
        "Results tracking clearly showed which campaigns provided the best ROI"
      ]
    }
  }
];

export const getCaseStudyById = (id: string): CaseStudy | undefined => {
  return caseStudies.find(study => study.id === id);
};
