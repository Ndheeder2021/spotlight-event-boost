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
  title: { sv: string; en: string };
  excerpt: { sv: string; en: string };
  category: { sv: string; en: string };
  date: string;
  readTime: { sv: string; en: string };
  icon: LucideIcon;
  image: string;
  content?: { sv: string; en: string };
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: {
      sv: "5 sätt att maximera försäljningen vid lokala evenemang",
      en: "5 Ways to Maximize Sales at Local Events"
    },
    excerpt: {
      sv: "Lär dig hur du kan utnyttja lokala evenemang för att öka trafiken till din butik och öka försäljningen med upp till 40%.",
      en: "Learn how to leverage local events to increase foot traffic to your store and boost sales by up to 40%."
    },
    category: {
      sv: "Tips & Tricks",
      en: "Tips & Tricks"
    },
    date: "2025-01-15",
    readTime: {
      sv: "5 min läsning",
      en: "5 min read"
    },
    icon: TrendingUp,
    image: blogLocalEvents,
    content: {
      sv: `
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
      `,
      en: `
        <p>Local events are goldmines for small businesses looking to increase sales. When thousands gather in your area, unique opportunities open up to reach new customers and dramatically boost revenue.</p>
        
        <h2>1. Timing is Key</h2>
        <p>Start your marketing 7-10 days before the event. This gives you enough time to build awareness without risking people forgetting your offer. Use multiple channels: social media, email, and possibly local ads.</p>
        
        <h2>2. Create Event-Specific Offers</h2>
        <p>Create offers directly tied to the event. If it's a concert, offer an "after-concert discount". For sporting events, have a "match-day special" ready. This creates a sense that the offer is exclusive and time-limited.</p>
        
        <h2>3. Optimize Your Visibility</h2>
        <p>Make sure your store is easy to find for event attendees. Use clear signage, balloon installations, or flags. If possible, place someone outside distributing flyers or coupons to passersby.</p>
        
        <h2>4. Extend Hours Strategically</h2>
        <p>Adjust your hours to match the event schedule. If the event ends at 10 PM, stay open until 11 PM to catch hungry and thirsty visitors looking for something before heading home.</p>
        
        <h2>5. Follow Up After the Event</h2>
        <p>Collect email addresses during the event by offering a small discount for newsletter signup. Then follow up with a thank-you message and a new offer within 2-3 days. This helps convert one-time customers into repeat visitors.</p>
        
        <h2>Results You Can Expect</h2>
        <p>Businesses implementing these strategies see an average sales increase of 30-40% during event days, and many also see a long-term customer base increase of 10-15% after each major event.</p>
      `
    }
  },
  {
    id: 2,
    title: {
      sv: "Hur AI förändrar lokal marknadsföring",
      en: "How AI is Transforming Local Marketing"
    },
    excerpt: {
      sv: "Upptäck hur artificiell intelligens kan hjälpa små företag att konkurrera med större aktörer genom smartare kampanjer.",
      en: "Discover how artificial intelligence can help small businesses compete with larger players through smarter campaigns."
    },
    category: {
      sv: "AI & Teknologi",
      en: "AI & Technology"
    },
    date: "2025-01-10",
    readTime: {
      sv: "7 min läsning",
      en: "7 min read"
    },
    icon: Lightbulb,
    image: blogAiMarketing,
    content: {
      sv: `
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
      `,
      en: `
        <p>Artificial intelligence was previously reserved for large companies with deep pockets. But now the technology is being democratized, and even small local businesses can leverage AI's power to compete on equal terms.</p>
        
        <h2>Automatic Campaign Generation</h2>
        <p>AI can now generate complete marketing campaigns in seconds. By analyzing event data, audience insights, and historical performance, AI can create tailored campaigns optimized for your specific business and customers.</p>
        
        <h2>Predictive Analytics</h2>
        <p>AI can predict which events will be most profitable for your specific business. By analyzing factors like weather, previous attendance statistics, competitor activity, and more, AI helps you prioritize the right events.</p>
        
        <h2>Personalization at Scale</h2>
        <p>With AI, you can personalize your messages for different customer segments without manually creating hundreds of variants. AI automatically adapts tone, offers, and channels based on the recipient's preferences and behavior.</p>
        
        <h2>Cost Efficiency</h2>
        <p>What previously required a marketing department can now be done by one person with AI's help. This means small businesses can achieve the same marketing sophistication as large chains, but at a fraction of the cost.</p>
        
        <h2>The Future is Here</h2>
        <p>AI is no longer science fiction - it's a tool every small business should consider. Companies that embrace AI-driven marketing early gain a significant competitive advantage over those who wait.</p>
      `
    }
  },
  {
    id: 3,
    title: {
      sv: "Fallstudie: Café Bröd & Salt ökar försäljningen med 40%",
      en: "Case Study: Café Bröd & Salt Increases Sales by 40%"
    },
    excerpt: {
      sv: "Läs om hur ett lokalt café i Stockholm använde Spotlight för att dra nytta av närliggande evenemang och ökade sin försäljning dramatiskt.",
      en: "Read about how a local café in Stockholm used Spotlight to capitalize on nearby events and dramatically increased sales."
    },
    category: {
      sv: "Fallstudier",
      en: "Case Studies"
    },
    date: "2025-01-05",
    readTime: {
      sv: "6 min läsning",
      en: "6 min read"
    },
    icon: Users,
    image: blogCafeCase,
    content: {
      sv: `
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
      `,
      en: `
        <p>Café Bröd & Salt is located in the heart of Stockholm, but owner Lisa Andersson struggled to stand out among all the other cafés in the area. Here's the story of how she turned things around.</p>
        
        <h2>The Challenge</h2>
        <p>Despite a good location and quality products, Lisa saw large chains taking market share. She knew there were often events in the area - concerts, sporting events, fairs - but she had neither the time nor resources to keep track of everything and plan campaigns.</p>
        
        <h2>The Solution</h2>
        <p>Lisa started using Spotlight in September 2024. The system automatically informed her about upcoming events within 2 km of the café and generated ready-made campaigns she could launch with one click.</p>
        
        <h2>First Campaign</h2>
        <p>The first event was a major concert at Globen with 15,000 attendees. Spotlight generated a campaign targeting concert-goers with the offer "Pre-party coffee - 20% off between 4-7 PM". Lisa launched the campaign 5 days before the event.</p>
        
        <h2>Results</h2>
        <p>That evening, the café had 60% more customers than usual during the afternoon. Many came with the campaign coupon. But best of all, 20 new customers signed up for the café's newsletter, leading to repeat visits.</p>
        
        <h2>Three Months Later</h2>
        <p>After running 12 event campaigns during autumn, Lisa saw an average sales increase of 40% during event days. But most importantly, her overall sales also increased by 15% thanks to all the new regular customers she gained.</p>
        
        <h2>Lisa's Advice</h2>
        <p>"I wish I had started earlier. Not taking advantage of events in the area is like leaving money on the table. With the right tools, it's both easy and profitable."</p>
      `
    }
  },
  {
    id: 4,
    title: {
      sv: "Bästa tidpunkten att lansera en eventkampanj",
      en: "Best Time to Launch an Event Campaign"
    },
    excerpt: {
      sv: "Timing är allt. Lär dig när du ska starta din marknadsföring för att få maximal effekt av lokala evenemang.",
      en: "Timing is everything. Learn when to start your marketing for maximum impact from local events."
    },
    category: {
      sv: "Strategi",
      en: "Strategy"
    },
    date: "2024-12-28",
    readTime: {
      sv: "4 min läsning",
      en: "4 min read"
    },
    icon: Target,
    image: blogTimingStrategy,
  },
  {
    id: 5,
    title: {
      sv: "Så skapar du engagerande kampanjtexter",
      en: "How to Create Engaging Campaign Copy"
    },
    excerpt: {
      sv: "En guide till att skriva marknadsföringstexter som fångar uppmärksamhet och driver konvertering.",
      en: "A guide to writing marketing copy that captures attention and drives conversion."
    },
    category: {
      sv: "Content Marketing",
      en: "Content Marketing"
    },
    date: "2024-12-20",
    readTime: {
      sv: "8 min läsning",
      en: "8 min read"
    },
    icon: TrendingUp,
    image: blogCopywriting,
  },
  {
    id: 6,
    title: {
      sv: "Event-driven marknadsföring: En komplett guide",
      en: "Event-Driven Marketing: A Complete Guide"
    },
    excerpt: {
      sv: "Allt du behöver veta om att bygga en framgångsrik marknadsföringsstrategi baserad på lokala evenemang.",
      en: "Everything you need to know about building a successful marketing strategy based on local events."
    },
    category: {
      sv: "Guide",
      en: "Guide"
    },
    date: "2024-12-15",
    readTime: {
      sv: "10 min läsning",
      en: "10 min read"
    },
    icon: Lightbulb,
    image: blogEventGuide,
  },
  {
    id: 7,
    title: {
      sv: "Social media-strategier för lokala företag",
      en: "Social Media Strategies for Local Businesses"
    },
    excerpt: {
      sv: "Lär dig hur du effektivt använder sociala medier för att nå ut till din lokala målgrupp och bygga en engagerad community.",
      en: "Learn how to effectively use social media to reach your local audience and build an engaged community."
    },
    category: {
      sv: "Content Marketing",
      en: "Content Marketing"
    },
    date: "2024-11-28",
    readTime: {
      sv: "6 min läsning",
      en: "6 min read"
    },
    icon: TrendingUp,
    image: blogSocialMedia,
  },
  {
    id: 8,
    title: {
      sv: "Framgångshistoria: Lokala butiken som fördublade trafiken",
      en: "Success Story: Local Store That Doubled Traffic"
    },
    excerpt: {
      sv: "Hur en liten butikskedja i Göteborg använde eventbaserad marknadsföring för att öka kundtrafiken med 120%.",
      en: "How a small retail chain in Gothenburg used event-based marketing to increase customer traffic by 120%."
    },
    category: {
      sv: "Fallstudier",
      en: "Case Studies"
    },
    date: "2024-11-15",
    readTime: {
      sv: "7 min läsning",
      en: "7 min read"
    },
    icon: Users,
    image: blogRetailSuccess,
  },
  {
    id: 9,
    title: {
      sv: "Mobil marknadsföring: Nå kunder i realtid",
      en: "Mobile Marketing: Reach Customers in Real-Time"
    },
    excerpt: {
      sv: "Upptäck hur platsbaserad mobilmarknadsföring kan hjälpa dig att nå potentiella kunder precis när de är i närheten.",
      en: "Discover how location-based mobile marketing can help you reach potential customers right when they're nearby."
    },
    category: {
      sv: "AI & Teknologi",
      en: "AI & Technology"
    },
    date: "2024-10-30",
    readTime: {
      sv: "5 min läsning",
      en: "5 min read"
    },
    icon: Lightbulb,
    image: blogMobileMarketing,
  },
  {
    id: 10,
    title: {
      sv: "Bygg en vinnande marknadsföringsstrategi",
      en: "Build a Winning Marketing Strategy"
    },
    excerpt: {
      sv: "En steg-för-steg guide till att utveckla en marknadsföringsstrategi som levererar mätbara resultat för ditt företag.",
      en: "A step-by-step guide to developing a marketing strategy that delivers measurable results for your business."
    },
    category: {
      sv: "Strategi",
      en: "Strategy"
    },
    date: "2024-10-12",
    readTime: {
      sv: "9 min läsning",
      en: "9 min read"
    },
    icon: Target,
    image: blogTeamStrategy,
  },
  {
    id: 11,
    title: {
      sv: "Fallstudie: Restaurang Smaka tredubblar gästantal",
      en: "Case Study: Restaurant Smaka Triples Guest Count"
    },
    excerpt: {
      sv: "Läs om hur en familjerestaurang i Malmö använde lokala festivaler för att öka sin gästfrekvens med 200%.",
      en: "Read how a family restaurant in Malmö used local festivals to increase guest frequency by 200%."
    },
    category: {
      sv: "Fallstudier",
      en: "Case Studies"
    },
    date: "2024-09-20",
    readTime: {
      sv: "6 min läsning",
      en: "6 min read"
    },
    icon: Users,
    image: blogRestaurantCase,
  },
  {
    id: 12,
    title: {
      sv: "Data-driven marknadsföring: Förstå dina kunder",
      en: "Data-Driven Marketing: Understand Your Customers"
    },
    excerpt: {
      sv: "Använd dataanalys och kundbeteendemönster för att skapa kampanjer som verkligen resonerar med din målgrupp.",
      en: "Use data analysis and customer behavior patterns to create campaigns that truly resonate with your target audience."
    },
    category: {
      sv: "Strategi",
      en: "Strategy"
    },
    date: "2024-08-25",
    readTime: {
      sv: "8 min läsning",
      en: "8 min read"
    },
    icon: Target,
    image: blogDataInsights,
  },
  {
    id: 13,
    title: {
      sv: "10 tips för butiker under rea-säsongen",
      en: "10 Tips for Stores During Sale Season"
    },
    excerpt: {
      sv: "Maximera din försäljning under högsäsong med dessa beprövade strategier för att sticka ut från konkurrenterna.",
      en: "Maximize your sales during peak season with these proven strategies to stand out from competitors."
    },
    category: {
      sv: "Tips & Tricks",
      en: "Tips & Tricks"
    },
    date: "2024-07-18",
    readTime: {
      sv: "5 min läsning",
      en: "5 min read"
    },
    icon: TrendingUp,
    image: blogBoutiqueTips,
  },
  {
    id: 14,
    title: {
      sv: "E-postmarknadsföring som konverterar",
      en: "Email Marketing That Converts"
    },
    excerpt: {
      sv: "Skapa e-postkampanjer som dina kunder faktiskt vill öppna och som driver försäljning för ditt lokala företag.",
      en: "Create email campaigns your customers actually want to open and that drive sales for your local business."
    },
    category: {
      sv: "Content Marketing",
      en: "Content Marketing"
    },
    date: "2024-06-30",
    readTime: {
      sv: "7 min läsning",
      en: "7 min read"
    },
    icon: TrendingUp,
    image: blogEmailGuide,
  },
  {
    id: 15,
    title: {
      sv: "Räkna ut ROI för din marknadsföring",
      en: "Calculate ROI for Your Marketing"
    },
    excerpt: {
      sv: "Lär dig hur du mäter avkastningen på dina marknadsföringsinvesteringar och optimerar din budget för bästa resultat.",
      en: "Learn how to measure return on your marketing investments and optimize your budget for best results."
    },
    category: {
      sv: "Strategi",
      en: "Strategy"
    },
    date: "2024-05-15",
    readTime: {
      sv: "6 min läsning",
      en: "6 min read"
    },
    icon: Target,
    image: blogRoiAnalysis,
  },
  {
    id: 16,
    title: {
      sv: "Säsongsplanering för lokala företag",
      en: "Seasonal Planning for Local Businesses"
    },
    excerpt: {
      sv: "En komplett guide till att planera din marknadsföring runt säsonger, helgdagar och lokala evenemang året runt.",
      en: "A complete guide to planning your marketing around seasons, holidays, and local events year-round."
    },
    category: {
      sv: "Guide",
      en: "Guide"
    },
    date: "2024-04-10",
    readTime: {
      sv: "10 min läsning",
      en: "10 min read"
    },
    icon: Lightbulb,
    image: blogSeasonalPlanning,
  },
  {
    id: 17,
    title: {
      sv: "Så tar du tillvara på sommarevenemang",
      en: "How to Capitalize on Summer Events"
    },
    excerpt: {
      sv: "Sommarens festivaler och evenemang erbjuder fantastiska möjligheter för lokala företag. Här är hur du gör.",
      en: "Summer festivals and events offer fantastic opportunities for local businesses. Here's how to do it."
    },
    category: {
      sv: "Tips & Tricks",
      en: "Tips & Tricks"
    },
    date: "2023-12-08",
    readTime: {
      sv: "5 min läsning",
      en: "5 min read"
    },
    icon: TrendingUp,
    image: blogLocalEvents,
  },
  {
    id: 18,
    title: {
      sv: "AI-verktyg för småföretag 2023",
      en: "AI Tools for Small Businesses 2023"
    },
    excerpt: {
      sv: "De bästa AI-verktygen som kan hjälpa ditt småföretag att automatisera marknadsföring och öka effektiviteten.",
      en: "The best AI tools that can help your small business automate marketing and increase efficiency."
    },
    category: {
      sv: "AI & Teknologi",
      en: "AI & Technology"
    },
    date: "2023-11-20",
    readTime: {
      sv: "8 min läsning",
      en: "8 min read"
    },
    icon: Lightbulb,
    image: blogAiMarketing,
  },
  {
    id: 19,
    title: {
      sv: "Lokalt samarbete ger starkare resultat",
      en: "Local Collaboration Yields Stronger Results"
    },
    excerpt: {
      sv: "Upptäck hur strategiska partnerskap med andra lokala företag kan förstärka er marknadsföring och nå fler kunder.",
      en: "Discover how strategic partnerships with other local businesses can strengthen your marketing and reach more customers."
    },
    category: {
      sv: "Strategi",
      en: "Strategy"
    },
    date: "2023-10-15",
    readTime: {
      sv: "6 min läsning",
      en: "6 min read"
    },
    icon: Target,
    image: blogTeamStrategy,
  },
  {
    id: 20,
    title: {
      sv: "Fallstudie: Bokhandeln som fann sin nisch",
      en: "Case Study: The Bookstore That Found Its Niche"
    },
    excerpt: {
      sv: "Hur en liten bokhandel lyckades växa genom att fokusera på lokala författarevenemang och läsecirklar.",
      en: "How a small bookstore succeeded in growing by focusing on local author events and book clubs."
    },
    category: {
      sv: "Fallstudier",
      en: "Case Studies"
    },
    date: "2023-09-05",
    readTime: {
      sv: "7 min läsning",
      en: "7 min read"
    },
    icon: Users,
    image: blogCafeCase,
  },
];
