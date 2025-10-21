export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  company: string;
  industry: string;
  location: string;
  heroImage: string;
  logo?: string;
  results: {
    metric: string;
    value: string;
    description: string;
  }[];
  challenge: string;
  solution: string;
  implementation: string[];
  testimonial: {
    quote: string;
    author: string;
    role: string;
    image: string;
  };
  keyTakeaways: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    id: "cafe-x-45-percent-increase",
    title: "Hur Café Bröd & Salt ökade sin försäljning med 45%",
    subtitle: "Från reaktiv till proaktiv event marketing",
    company: "Café Bröd & Salt",
    industry: "Café & Bageri",
    location: "Stockholm, Södermalm",
    heroImage: "/placeholder.svg",
    results: [
      {
        metric: "Försäljningsökning",
        value: "45%",
        description: "Under lokala evenemang"
      },
      {
        metric: "Kampanjeffektivitet",
        value: "3x",
        description: "Fler konverteringar per kampanj"
      },
      {
        metric: "Tidsbesparing",
        value: "12h/vecka",
        description: "Automatiserad kampanjplanering"
      },
      {
        metric: "ROI",
        value: "420%",
        description: "Return on investment första kvartalet"
      }
    ],
    challenge: "Café Bröd & Salt låg mitt i Stockholms mest eventtäta område, men ägaren Anna Svensson hade svårt att hålla koll på alla konserter, festivaler och sportevenemang som lockade människor till området. 'Vi missade ständigt möjligheter att dra nytta av det ökade kundflödet. När vi väl fick reda på ett evenemang var det ofta för sent att planera en effektiv kampanj,' berättar Anna.",
    solution: "Med Spotlight fick Anna automatiska notifieringar om alla relevanta evenemang inom 2 km från caféet. Plattformens AI analyserade vilka evenemang som skulle passa bäst för deras målgrupp och genererade färdiga kampanjförslag. 'Plötsligt hade vi en 14-dagars framförhållning på alla möjligheter. Vi kunde planera specialerbjudanden, öka personalen och beställa extra varor i god tid.'",
    implementation: [
      "Vecka 1: Installerade Spotlight och konfigurerade notifieringar för evenemang inom 2 km",
      "Vecka 2: Testade AI-genererade kampanjer för tre mindre evenemang",
      "Vecka 3: Skalade upp med automatiska kampanjer för alla relevanta evenemang",
      "Vecka 4: Integrerade kampanjresultat med kassasystemet för ROI-tracking"
    ],
    testimonial: {
      quote: "Spotlight har förvandlat hur vi arbetar med marknadsföring. Vi har gått från att missa möjligheter till att vara steget före. Försäljningen har ökat med 45% och vi sparar timmar varje vecka. Det är den bästa investeringen vi gjort för vårt café.",
      author: "Anna Svensson",
      role: "Ägare, Café Bröd & Salt",
      image: "/placeholder.svg"
    },
    keyTakeaways: [
      "Automatiserad event-discovery sparade 12 timmar per vecka i researchtid",
      "AI-genererade kampanjer ökade konverteringsgraden med 300%",
      "Proaktiv planering möjliggjorde bättre lagerhantering och personalplanering",
      "ROI-tracking visade tydligt vilka eventtyper som gav bäst resultat"
    ]
  },
  {
    id: "restaurant-smak-triple-revenue",
    title: "Restaurant Smak fördubblade sina kampanjresultat",
    subtitle: "Från manuell planering till AI-driven automation",
    company: "Restaurant Smak",
    industry: "Restaurang",
    location: "Göteborg, Centrum",
    heroImage: "/placeholder.svg",
    results: [
      {
        metric: "Kampanjkonvertering",
        value: "210%",
        description: "Ökning i bokningar från kampanjer"
      },
      {
        metric: "Kostnadseffektivitet",
        value: "65%",
        description: "Lägre kostnad per konvertering"
      },
      {
        metric: "Kampanjvolym",
        value: "8x",
        description: "Fler kampanjer utan extra arbetstid"
      },
      {
        metric: "Kundlojalitet",
        value: "+32%",
        description: "Återkommande gäster från event-kampanjer"
      }
    ],
    challenge: "Erik Lundberg, marknadsansvarig på Restaurant Smak, kämpade med att skapa tillräckligt många kampanjer för att hänga med i Göteborgs livliga eventkalender. 'Vi hade tiden för max 2-3 kampanjer per månad. Samtidigt hände det 20-30 relevanta evenemang som vi skulle kunna kapitalisera på. Vi lämnade pengar på bordet varje vecka.'",
    solution: "Spotlight's AI-motor började generera skräddarsydda kampanjer automatiskt baserat på kommande evenemang. Systemet analyserade historisk data för att identifiera vilka eventtyper som gav bäst resultat för restaurangen. 'Nu skapar AI första utkastet, vi justerar vid behov, och kör. Vi har gått från 3 kampanjer per månad till 24, utan att anställa extra personal.'",
    implementation: [
      "Fas 1: AI-analys av historiska kampanjresultat och kunddata",
      "Fas 2: Automatisk kampanjgenerering för alla identifierade evenemang",
      "Fas 3: A/B-testning av olika kampanjformat med AI-optimering",
      "Fas 4: Integration med bokningssystem för automatisk resultatuppföljning"
    ],
    testimonial: {
      quote: "AI-funktionen har varit en game-changer. Vi når nu 8 gånger fler potentiella gäster med kampanjer som konverterar dubbelt så bra som våra gamla manuella försök. Och vi gör det på samma tid som tidigare. Det är nästan magiskt.",
      author: "Erik Lundberg",
      role: "Marknadsansvarig, Restaurant Smak",
      image: "/placeholder.svg"
    },
    keyTakeaways: [
      "AI-driven kampanjgenerering möjliggjorde 8x fler kampanjer utan extra personal",
      "Historisk dataanalys identifierade de mest lönsamma eventtyperna",
      "A/B-testning med AI-optimering ökade konverteringsgraden med 210%",
      "Automatisk ROI-tracking visade 65% lägre kostnad per konvertering"
    ]
  },
  {
    id: "urban-bar-grill-efficiency",
    title: "Urban Bar & Grill fördubblade kampanjproduktionen",
    subtitle: "Professionell marknadsföring utan att öka arbetsbördan",
    company: "Urban Bar & Grill",
    industry: "Bar & Restaurang",
    location: "Malmö, Västra Hamnen",
    heroImage: "/placeholder.svg",
    results: [
      {
        metric: "Kampanjvolym",
        value: "200%",
        description: "Fördubbling av antal kampanjer"
      },
      {
        metric: "Arbetstid",
        value: "0%",
        description: "Ingen ökning trots fler kampanjer"
      },
      {
        metric: "Kvalitet",
        value: "+85%",
        description: "Högre upplevd professionalism"
      },
      {
        metric: "Engagemang",
        value: "+120%",
        description: "Ökad social media interaktion"
      }
    ],
    challenge: "Maria Andersson, VD för Urban Bar & Grill, ville expandera sin marknadsföring men saknade resurser. 'Vi hade en person som jobbade med marknadsföring på halvtid. Det räckte knappt för att hålla våra sociala medier uppdaterade, än mindre skapa sofistikerade event-kampanjer. Men vi såg konkurrenterna göra det och ta vår marknad.'",
    solution: "Spotlight blev deras digitala marknadsavdelning. Plattformen hanterade allt från event-discovery till kampanjskapande och resultatuppföljning. AI-genererade visuella mockups gjorde kampanjerna professionella. 'Nu producerar vi lika många kampanjer som kedjor med stora marknadsavdelningar, men vi är fortfarande bara en person på halvtid.'",
    implementation: [
      "Månad 1: Setup och grundkonfiguration, första AI-kampanjerna",
      "Månad 2: Implementering av delningsfunktion för samarbete med influencers",
      "Månad 3: A/B-testning och optimering av kampanjformat",
      "Månad 4: Full automation med minimal mänsklig input"
    ],
    testimonial: {
      quote: "Spotlight har demokratiserat professionell marknadsföring. Vi, som ett medelstort företag, kan nu konkurrera med stora kedjor när det gäller kampanjvolym och kvalitet. Och vi gör det utan att anställa fler. Det är revolutionerande.",
      author: "Maria Andersson",
      role: "VD, Urban Bar & Grill",
      image: "/placeholder.svg"
    },
    keyTakeaways: [
      "Små team kan nu producera kampanjer i professionell kvalitet och volym",
      "AI-genererade visuella mockups eliminerade behovet av designresurser",
      "Delningsfunktionen möjliggjorde enkelt samarbete med partners och influencers",
      "Resultatuppföljning visade tydligt vilka kampanjer som gav bäst ROI"
    ]
  }
];

export const getCaseStudyById = (id: string): CaseStudy | undefined => {
  return caseStudies.find(study => study.id === id);
};
