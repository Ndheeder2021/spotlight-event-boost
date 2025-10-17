import { Link, useParams } from "react-router-dom";
import { Zap, Calendar, Clock, ArrowLeft, Share2, TrendingUp, Users, Target, Lightbulb } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/OptimizedImage";
import blogLocalEvents from "@/assets/blog-local-events.jpg";
import blogAiMarketing from "@/assets/blog-ai-marketing.jpg";
import blogCafeCase from "@/assets/blog-cafe-case.jpg";
import blogTimingStrategy from "@/assets/blog-timing-strategy.jpg";
import blogCopywriting from "@/assets/blog-copywriting.jpg";
import blogEventGuide from "@/assets/blog-event-guide.jpg";

const blogArticles = [
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
  {
    id: 4,
    title: "Bästa tidpunkten att lansera en eventkampanj",
    excerpt: "Timing är allt. Lär dig när du ska starta din marknadsföring för att få maximal effekt av lokala evenemang.",
    category: "Strategi",
    date: "2024-12-28",
    readTime: "4 min läsning",
    icon: Target,
    image: blogTimingStrategy,
    content: `
      <p>När det gäller event-marketing är timing avgörande för framgång. Lansera för tidigt och folk glömmer bort dig. Lansera för sent och du missar potentiella kunder. Här är din kompletta guide till perfekt timing.</p>
      
      <h2>7-10 dagar före: Det magiska fönstret</h2>
      <p>Forskning visar att 7-10 dagar före ett evenemang är den optimala tiden att starta din kampanj. Detta ger människor tid att planera utan att glömma bort ditt erbjudande.</p>
      
      <h2>Dagarna före: Påminnelser</h2>
      <p>Skicka ut en påminnelse 2-3 dagar före evenemanget. Detta fångar upp de som är i aktiv planeringsläge och letar efter restauranger, barer eller aktiviteter före/efter evenemanget.</p>
      
      <h2>Eventdagen: Sista chansen</h2>
      <p>Även på själva dagen finns det värde i att påminna. Många människor bestämmer sig i sista minuten var de ska äta eller ta en drink. En notifikation på morgonen kan vara skillnaden mellan att de väljer dig eller en konkurrent.</p>
      
      <h2>Efter evenemanget: Glöm inte uppföljningen</h2>
      <p>Inom 48 timmar efter evenemanget, följ upp med ett tack-meddelande och ett nytt erbjudande. Detta är din chans att omvandla engångskunder till stammisar.</p>
      
      <h2>Säsongsvariation</h2>
      <p>Under sommaren kan du börja lite tidigare (10-12 dagar) då folk planerar mer i förväg. Under vintermånaderna är 5-7 dagar ofta tillräckligt.</p>
    `
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
    content: `
      <p>En bra kampanj handlar inte bara om rätt timing och målgrupp - själva budskapet är minst lika viktigt. Här är allt du behöver veta om att skriva texter som konverterar.</p>
      
      <h2>Börja med värdet</h2>
      <p>Din första mening ska genast kommunicera värdet för kunden. Inte "Vi har öppet länge", utan "Ta en välförtjänt drink efter matchen - vi har öppet till midnatt!"</p>
      
      <h2>Skapa brådska</h2>
      <p>Använd tidsbegränsade erbjudanden. "Endast ikväll" eller "För de första 50 gästerna" skapar en känsla av att man måste agera nu.</p>
      
      <h2>Tala direkt till läsaren</h2>
      <p>Använd "du" och "din" istället för "vi" och "vår". "Din favorit-pizza" känns mer personligt än "Våra pizzor".</p>
      
      <h2>Var specifik</h2>
      <p>"30% rabatt" är bättre än "stor rabatt". "Gratis dessert" är bättre än "extra förmåner".</p>
      
      <h2>Inkludera en tydlig Call-to-Action</h2>
      <p>Avsluta alltid med en tydlig uppmaning: "Boka bord nu", "Visa denna kupong i kassan", "Använd kod KONSERT25 vid beställning".</p>
      
      <h2>Testa och optimera</h2>
      <p>A/B-testa olika varianter av dina texter. Ibland kan en liten ändring i ordvalet göra stor skillnad i konverteringsgraden.</p>
    `
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
    content: `
      <p>Event-driven marknadsföring är konsten att dra nytta av trafiken och energin kring lokala evenemang för att öka försäljningen. Denna guide täcker allt från strategi till genomförande.</p>
      
      <h2>Kapitel 1: Grunderna</h2>
      <p>Event-driven marknadsföring bygger på en enkel insikt: när människor är ute på stan för ett evenemang är de i ett positivt, konsumerande mindset. De letar efter restauranger, caféer, barer och shopping innan och efter evenemanget.</p>
      
      <h2>Kapitel 2: Identifiera rätt evenemang</h2>
      <p>Inte alla evenemang är relevanta för ditt företag. En restaurang drar nytta av konserter och sportevenemang, medan en klädbutik kanske får mer från mässor och festivaler. Fokusera på evenemang som attraherar din målgrupp.</p>
      
      <h2>Kapitel 3: Planera din kampanj</h2>
      <p>En framgångsrik event-kampanj har flera komponenter: timing (7-10 dagar före), erbjudande (event-specifikt och attraktivt), kanaler (sociala medier, email, fysiska skyltar) och uppföljning (inom 48 timmar).</p>
      
      <h2>Kapitel 4: Mät och optimera</h2>
      <p>Spåra alltid dina resultat. Hur många nya kunder fick du? Vilken var genomsnittligt köpvärde? Hur många anmälde sig till nyhetsbrevet? Använd dessa insights för att förbättra nästa kampanj.</p>
      
      <h2>Kapitel 5: Bygg långsiktiga relationer</h2>
      <p>Det ultimata målet är inte försäljningen under eventdagen - det är att konvertera dessa engångskunder till stammisar. Samla email-adresser, erbjud lojalitetsprogram och följ upp regelbundet.</p>
      
      <h2>Slutsats</h2>
      <p>Event-driven marknadsföring är inte längre något endast stora företag kan dra nytta av. Med rätt verktyg och strategi kan även små lokala företag dramatiskt öka sin försäljning och bygga sin kundbas.</p>
    `
  },
];

export default function BlogPost() {
  const { id } = useParams();
  const article = blogArticles.find(a => a.id === Number(id));

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Artikel hittades inte</h1>
          <Link to="/blog">
            <Button>Tillbaka till bloggen</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Zap className="h-6 w-6 text-primary" fill="currentColor" />
            <span className="text-xl font-bold">Spotlight</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Blogg
            </Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Kontakt
            </Link>
          </div>
        </div>
      </header>

      {/* Article Hero */}
      <section className="relative h-[500px] overflow-hidden">
        <OptimizedImage
          src={article.image} 
          alt={article.title}
          width={1920}
          height={500}
          priority
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-12">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Tillbaka till bloggen
          </Link>
          <div className="max-w-4xl">
            <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-bold mb-4">
              {article.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary-foreground drop-shadow-lg">
              {article.title}
            </h1>
            <div className="flex items-center gap-6 text-sm text-primary-foreground/90">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(article.date).toLocaleDateString('sv-SE', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {article.readTime}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div 
            className="prose prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-foreground
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
              prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
              prose-strong:text-foreground
              prose-a:text-accent prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Share Section */}
          <div className="mt-16 pt-8 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Dela artikel:</span>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Dela
              </Button>
            </div>
          </div>

          {/* Back to Blog CTA */}
          <div className="mt-16 text-center">
            <Link to="/blog">
              <Button size="lg" className="group">
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Se fler artiklar
              </Button>
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
