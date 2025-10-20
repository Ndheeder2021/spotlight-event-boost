import { TrendingUp, Users, Target, Lightbulb, LucideIcon } from "lucide-react";
import blogLocalEvents from "@/assets/blog-local-events.jpg";
import blogAiMarketing from "@/assets/blog-ai-marketing.jpg";
import blogCafeCase from "@/assets/blog-cafe-case.jpg";
import blogTimingStrategy from "@/assets/blog-timing-strategy.jpg";
import blogCopywriting from "@/assets/blog-copywriting.jpg";
import blogEventGuide from "@/assets/blog-event-guide.jpg";
import blogSocialMedia from "@/assets/blog-social-media.jpg";
import blogRetailSuccess from "@/assets/blog-retail-success.jpg";
import blogMobileMarketing from "@/assets/blog-mobile-marketing.jpg";
import blogTeamStrategy from "@/assets/blog-team-strategy.jpg";
import blogRestaurantCase from "@/assets/blog-restaurant-case.jpg";
import blogDataInsights from "@/assets/blog-data-insights.jpg";
import blogBoutiqueTips from "@/assets/blog-boutique-tips.jpg";
import blogEmailGuide from "@/assets/blog-email-guide.jpg";
import blogRoiAnalysis from "@/assets/blog-roi-analysis.jpg";
import blogSeasonalPlanning from "@/assets/blog-seasonal-planning.jpg";

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  icon: LucideIcon;
  image: string;
  content?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "5 sätt att maximera försäljningen vid lokala evenemang",
    excerpt: "Lär dig hur du kan utnyttja lokala evenemang för att öka trafiken till din butik och öka försäljningen med upp till 40%.",
    category: "Tips & Tricks",
    date: "2025-01-15",
    readTime: "5 min läsning",
    icon: TrendingUp,
    image: blogLocalEvents,
    content: `
      <p>Lokala evenemang är guldgruvor för små företag som vill öka sin försäljning. När tusentals människor samlas i ditt område öppnas unika möjligheter att nå nya kunder och öka intäkterna dramatiskt.</p>
      
      <h2>1. Timing är nyckeln</h2>
      <p>Börja din marknadsföring 7-10 dagar innan evenemanget. Detta ger dig tillräckligt med tid att bygga upp medvetenhet utan att riskera att folk glömmer bort ditt erbjudande. Använd flera kanaler: sociala medier, email och eventuellt lokala annonser.</p>
      
      <h2>2. Skapa event-specifika erbjudanden</h2>
      <p>Skapa erbjudanden som är direkt kopplade till evenemanget. Om det är en konsert, erbjud en "efter-konsert-rabatt". Vid sportevenemang, ha ett "matcha-dagen-erbjudande" klart. Detta skapar en känsla av att erbjudandet är exklusivt och tidsbegränsat.</p>
      
      <h2>3. Optimera din synlighet</h2>
      <p>Se till att din butik är lätt att hitta för eventdeltagare. Använd tydliga skyltar, ballong-installationer eller flaggor. Om möjligt, placera någon utanför som delar ut flygblad eller kuponger till förbipasserande.</p>
      
      <h2>4. Förläng öppettiderna strategiskt</h2>
      <p>Anpassa dina öppettider efter evenemangets schema. Om evenemanget slutar kl 22:00, håll öppet till 23:00 för att fånga upp hungriga och törstiga besökare som letar efter något innan de åker hem.</p>
      
      <h2>5. Följ upp efter evenemanget</h2>
      <p>Samla in email-adresser under evenemanget genom att erbjuda en liten rabatt för nyhetsbrev-anmälan. Följ sedan upp med ett tackmeddelande och ett nytt erbjudande inom 2-3 dagar. Detta hjälper dig att konvertera engångskunder till återkommande besökare.</p>
      
      <h2>Resultat du kan förvänta dig</h2>
      <p>Företag som implementerar dessa strategier ser i genomsnitt en försäljningsökning på 30-40% under eventdagar, och många ser också en långsiktig ökning av sin kundbas med 10-15% efter varje större evenemang.</p>
    `
  },
  {
    id: 2,
    title: "Hur AI förändrar lokal marknadsföring",
    excerpt: "Upptäck hur artificiell intelligens kan hjälpa små företag att konkurrera med större aktörer genom smartare kampanjer.",
    category: "AI & Teknologi",
    date: "2025-01-10",
    readTime: "7 min läsning",
    icon: Lightbulb,
    image: blogAiMarketing,
    content: `
      <p>Artificiell intelligens har tidigare varit förbehållet stora företag med djupa fickor. Men nu demokratiseras tekniken, och även små lokala företag kan dra nytta av AI:s kraft för att konkurrera på lika villkor.</p>
      
      <h2>Automatisk kampanjgenerering</h2>
      <p>AI kan nu generera kompletta marknadsföringskampanjer på sekunder. Genom att analysera evenemangsdata, målgruppsinsikter och historisk prestanda kan AI skapa skräddarsydda kampanjer som är optimerade för just ditt företag och dina kunder.</p>
      
      <h2>Prediktiv analys</h2>
      <p>AI kan förutsäga vilka evenemang som kommer att vara mest lönsamma för just ditt företag. Genom att analysera faktorer som väder, tidigare besöksstatistik, konkurrentaktivitet och mer kan AI hjälpa dig att prioritera rätt evenemang.</p>
      
      <h2>Personalisering i skala</h2>
      <p>Med AI kan du personalisera dina budskap för olika kundsegment utan att behöva manuellt skapa hundratals varianter. AI anpassar automatiskt ton, erbjudanden och kanaler baserat på mottagarens preferenser och beteende.</p>
      
      <h2>Kostnadseffektivitet</h2>
      <p>Det som tidigare krävde en marknadsföringsavdelning kan nu göras av en person med hjälp av AI. Detta innebär att små företag kan uppnå samma sofistikering i sin marknadsföring som stora kedjor, men till en bråkdel av kostnaden.</p>
      
      <h2>Framtiden är här</h2>
      <p>AI är inte längre science fiction - det är ett verktyg som varje litet företag bör överväga. Företag som anammar AI-driven marknadsföring tidigt får en betydande konkurrensfördel gentemot de som väntar.</p>
    `
  },
  {
    id: 3,
    title: "Fallstudie: Café Bröd & Salt ökar försäljningen med 40%",
    excerpt: "Läs om hur ett lokalt café i Stockholm använde Spotlight för att dra nytta av närliggande evenemang och ökade sin försäljning dramatiskt.",
    category: "Fallstudier",
    date: "2025-01-05",
    readTime: "6 min läsning",
    icon: Users,
    image: blogCafeCase,
    content: `
      <p>Café Bröd & Salt ligger mitt i Stockholms city, men ägaren Lisa Andersson kämpade med att sticka ut bland alla andra caféer i området. Här är historien om hur hon vände skutan.</p>
      
      <h2>Utmaningen</h2>
      <p>Trots ett bra läge och kvalitetsprodukter såg Lisa hur stora kedjor tog marknadsandelar. Hon visste att det ofta var evenemang i området - konserter, idrottsevenemang, mässor - men hon hade varken tid eller resurser att hålla koll på allt och planera kampanjer.</p>
      
      <h2>Lösningen</h2>
      <p>Lisa började använda Spotlight i september 2024. Systemet informerade henne automatiskt om kommande evenemang inom 2 km från caféet och genererade färdiga kampanjer som hon kunde lansera med ett klick.</p>
      
      <h2>Första kampanjen</h2>
      <p>Det första evenemanget var en stor konsert på Globen med 15,000 besökare. Spotlight genererade en kampanj som riktade sig till konsertbesökare med erbjudandet "Förfest-fika - 20% rabatt mellan 16-19". Lisa lanserade kampanjen 5 dagar före evenemanget.</p>
      
      <h2>Resultat</h2>
      <p>Den kvällen hade caféet 60% fler kunder än vanligt under eftermiddagen. Många kom med kupongen från kampanjen. Men det bästa var att 20 nya kunder anmälde sig till caféets nyhetsbrev, vilket ledde till återkommande besök.</p>
      
      <h2>Tre månader senare</h2>
      <p>Efter att ha kört 12 event-kampanjer under hösten såg Lisa en genomsnittlig försäljningsökning på 40% under eventdagar. Men viktigast var att hennes allmänna försäljning också ökat med 15% tack vare alla nya stamkunder hon fått.</p>
      
      <h2>Lisas råd</h2>
      <p>"Jag önskar att jag hade börjat tidigare. Att inte dra nytta av evenemang i området är som att lämna pengar på bordet. Med rätt verktyg är det både enkelt och lönsamt."</p>
    `
  },
  // ... fortsätt med resten av bloggposterna här med bara excerpt, utan content för de som inte har content än
  {
    id: 4,
    title: "Bästa tidpunkten att lansera en eventkampanj",
    excerpt: "Timing är allt. Lär dig när du ska starta din marknadsföring för att få maximal effekt av lokala evenemang.",
    category: "Strategi",
    date: "2024-12-28",
    readTime: "4 min läsning",
    icon: Target,
    image: blogTimingStrategy,
  },
  {
    id: 5,
    title: "Så skapar du engagerande kampanjtexter",
    excerpt: "En guide till att skriva marknadsföringstexter som fångar uppmärksamhet och driver konvertering.",
    category: "Content Marketing",
    date: "2024-12-20",
    readTime: "8 min läsning",
    icon: TrendingUp,
    image: blogCopywriting,
  },
  {
    id: 6,
    title: "Event-driven marknadsföring: En komplett guide",
    excerpt: "Allt du behöver veta om att bygga en framgångsrik marknadsföringsstrategi baserad på lokala evenemang.",
    category: "Guide",
    date: "2024-12-15",
    readTime: "10 min läsning",
    icon: Lightbulb,
    image: blogEventGuide,
  },
  {
    id: 7,
    title: "Social media-strategier för lokala företag",
    excerpt: "Lär dig hur du effektivt använder sociala medier för att nå ut till din lokala målgrupp och bygga en engagerad community.",
    category: "Content Marketing",
    date: "2024-11-28",
    readTime: "6 min läsning",
    icon: TrendingUp,
    image: blogSocialMedia,
  },
  {
    id: 8,
    title: "Framgångshistoria: Lokala butiken som fördublade trafiken",
    excerpt: "Hur en liten butikskedja i Göteborg använde eventbaserad marknadsföring för att öka kundtrafiken med 120%.",
    category: "Fallstudier",
    date: "2024-11-15",
    readTime: "7 min läsning",
    icon: Users,
    image: blogRetailSuccess,
  },
  {
    id: 9,
    title: "Mobil marknadsföring: Nå kunder i realtid",
    excerpt: "Upptäck hur platsbaserad mobilmarknadsföring kan hjälpa dig att nå potentiella kunder precis när de är i närheten.",
    category: "AI & Teknologi",
    date: "2024-10-30",
    readTime: "5 min läsning",
    icon: Lightbulb,
    image: blogMobileMarketing,
  },
  {
    id: 10,
    title: "Bygg en vinnande marknadsföringsstrategi",
    excerpt: "En steg-för-steg guide till att utveckla en marknadsföringsstrategi som levererar mätbara resultat för ditt företag.",
    category: "Strategi",
    date: "2024-10-12",
    readTime: "9 min läsning",
    icon: Target,
    image: blogTeamStrategy,
  },
  {
    id: 11,
    title: "Fallstudie: Restaurang Smaka tredubblar gästantal",
    excerpt: "Läs om hur en familjerestaurang i Malmö använde lokala festivaler för att öka sin gästfrekvens med 200%.",
    category: "Fallstudier",
    date: "2024-09-20",
    readTime: "6 min läsning",
    icon: Users,
    image: blogRestaurantCase,
  },
  {
    id: 12,
    title: "Data-driven marknadsföring: Förstå dina kunder",
    excerpt: "Använd dataanalys och kundbeteendemönster för att skapa kampanjer som verkligen resonerar med din målgrupp.",
    category: "Strategi",
    date: "2024-08-25",
    readTime: "8 min läsning",
    icon: Target,
    image: blogDataInsights,
  },
  {
    id: 13,
    title: "10 tips för butiker under rea-säsongen",
    excerpt: "Maximera din försäljning under högsäsong med dessa beprövade strategier för att sticka ut från konkurrenterna.",
    category: "Tips & Tricks",
    date: "2024-07-18",
    readTime: "5 min läsning",
    icon: TrendingUp,
    image: blogBoutiqueTips,
  },
  {
    id: 14,
    title: "E-postmarknadsföring som konverterar",
    excerpt: "Skapa e-postkampanjer som dina kunder faktiskt vill öppna och som driver försäljning för ditt lokala företag.",
    category: "Content Marketing",
    date: "2024-06-30",
    readTime: "7 min läsning",
    icon: TrendingUp,
    image: blogEmailGuide,
  },
  {
    id: 15,
    title: "Räkna ut ROI för din marknadsföring",
    excerpt: "Lär dig hur du mäter avkastningen på dina marknadsföringsinvesteringar och optimerar din budget för bästa resultat.",
    category: "Strategi",
    date: "2024-05-15",
    readTime: "6 min läsning",
    icon: Target,
    image: blogRoiAnalysis,
  },
  {
    id: 16,
    title: "Säsongsplanering för lokala företag",
    excerpt: "En komplett guide till att planera din marknadsföring runt säsonger, helgdagar och lokala evenemang året runt.",
    category: "Guide",
    date: "2024-04-10",
    readTime: "10 min läsning",
    icon: Lightbulb,
    image: blogSeasonalPlanning,
  },
  {
    id: 17,
    title: "Så tar du tillvara på sommarevenemang",
    excerpt: "Sommarens festivaler och evenemang erbjuder fantastiska möjligheter för lokala företag. Här är hur du gör.",
    category: "Tips & Tricks",
    date: "2023-12-08",
    readTime: "5 min läsning",
    icon: TrendingUp,
    image: blogLocalEvents,
  },
  {
    id: 18,
    title: "AI-verktyg för småföretag 2023",
    excerpt: "De bästa AI-verktygen som kan hjälpa ditt småföretag att automatisera marknadsföring och öka effektiviteten.",
    category: "AI & Teknologi",
    date: "2023-11-20",
    readTime: "8 min läsning",
    icon: Lightbulb,
    image: blogAiMarketing,
  },
  {
    id: 19,
    title: "Lokalt samarbete ger starkare resultat",
    excerpt: "Upptäck hur strategiska partnerskap med andra lokala företag kan förstärka er marknadsföring och nå fler kunder.",
    category: "Strategi",
    date: "2023-10-15",
    readTime: "6 min läsning",
    icon: Target,
    image: blogTeamStrategy,
  },
  {
    id: 20,
    title: "Fallstudie: Bokhandeln som fann sin nisch",
    excerpt: "Hur en liten bokhandel lyckades växa genom att fokusera på lokala författarevenemang och läsecirklar.",
    category: "Fallstudier",
    date: "2023-09-05",
    readTime: "7 min läsning",
    icon: Users,
    image: blogCafeCase,
  },
];
