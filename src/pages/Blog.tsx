import { Link } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Calendar, ArrowRight, TrendingUp, Users, Target, Lightbulb, Mail } from "lucide-react";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { OptimizedImage } from "@/components/OptimizedImage";
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

const blogPosts = [
  {
    id: 1,
    title: "5 sätt att maximera försäljningen vid lokala evenemang",
    excerpt: "Lär dig hur du kan utnyttja lokala evenemang för att öka trafiken till din butik och öka försäljningen med upp till 40%.",
    category: "Tips & Tricks",
    date: "2025-01-15",
    readTime: "5 min läsning",
    icon: TrendingUp,
    image: blogLocalEvents,
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

export default function Blog() {
  const [email, setEmail] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      toast({
        title: "🎉 Tack för din prenumeration!",
        description: `Vi har skickat en bekräftelse till ${email}. Välkommen till Spotlight-communityn!`,
        duration: 5000,
      });
      setEmail("");
    } else {
      toast({
        title: "Ogiltig e-postadress",
        description: "Vänligen ange en giltig e-postadress.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

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
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Hem
            </Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Kontakt
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 bg-gradient-to-b from-accent/5 to-background">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-block px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4">
            <span className="text-sm font-semibold text-accent">Blogg</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold">
            Insikter & tips om
            <br />
            <span className="gradient-text">eventdriven marknadsföring</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Lär dig hur du kan växa ditt företag genom att dra nytta av lokala evenemang
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-bold mb-6">
            Utvalda artiklar
          </div>
          <Link to="/blog/1">
            <Card className="overflow-hidden border-2 hover:border-accent/50 transition-all hover:shadow-xl group cursor-pointer">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative overflow-hidden h-80 md:h-auto">
                  <OptimizedImage
                    src={blogLocalEvents} 
                    alt="Lokala evenemang" 
                    width={800}
                    height={600}
                    priority
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <Badge className="w-fit mb-4">Tips & Tricks</Badge>
                  <h2 className="text-3xl font-bold mb-4 group-hover:text-accent transition-colors">
                    5 sätt att maximera försäljningen vid lokala evenemang
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Lär dig hur du kan utnyttja lokala evenemang för att öka trafiken till din butik och öka försäljningen med upp till 40%. Vi delar med oss av beprövade strategier från framgångsrika företag.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      15 jan 2025
                    </div>
                    <span>5 min läsning</span>
                  </div>
                  <div className="text-accent group-hover:text-accent-glow flex items-center gap-2 font-semibold">
                    Läs mer
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">
              {selectedCategory ? `${selectedCategory}` : "Senaste artiklarna"}
            </h2>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-sm text-accent hover:text-accent-glow transition-colors font-semibold"
              >
                Visa alla
              </button>
            )}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts
              .filter((post) => !selectedCategory || post.category === selectedCategory)
              .slice(selectedCategory ? 0 : 1)
              .map((post) => {
              return (
                <Link key={post.id} to={`/blog/${post.id}`}>
                  <Card className="flex flex-col border-2 hover:border-accent/50 transition-all hover:shadow-xl group cursor-pointer h-full overflow-hidden">
                    <div className="relative overflow-hidden h-48">
                      <OptimizedImage
                        src={post.image} 
                        alt={post.title}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader className="flex-1">
                      <Badge className="w-fit mb-2">{post.category}</Badge>
                      <CardTitle className="text-xl group-hover:text-accent transition-colors mb-3">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(post.date).toLocaleDateString('sv-SE', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </div>
                        <span>{post.readTime}</span>
                      </div>
                      <div className="text-accent group-hover:text-accent-glow flex items-center gap-2 font-semibold">
                        Läs mer
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Utforska kategorier</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card 
              onClick={() => setSelectedCategory("Tips & Tricks")}
              className="text-center p-6 border-2 hover:border-accent/50 transition-all hover:scale-105 cursor-pointer"
            >
              <TrendingUp className="h-8 w-8 text-accent mx-auto mb-3" />
              <h3 className="font-bold mb-1">Tips & Tricks</h3>
              <p className="text-sm text-muted-foreground">
                {blogPosts.filter(p => p.category === "Tips & Tricks").length} artiklar
              </p>
            </Card>
            <Card 
              onClick={() => setSelectedCategory("AI & Teknologi")}
              className="text-center p-6 border-2 hover:border-accent/50 transition-all hover:scale-105 cursor-pointer"
            >
              <Lightbulb className="h-8 w-8 text-accent mx-auto mb-3" />
              <h3 className="font-bold mb-1">AI & Teknologi</h3>
              <p className="text-sm text-muted-foreground">
                {blogPosts.filter(p => p.category === "AI & Teknologi").length} artiklar
              </p>
            </Card>
            <Card 
              onClick={() => setSelectedCategory("Fallstudier")}
              className="text-center p-6 border-2 hover:border-accent/50 transition-all hover:scale-105 cursor-pointer"
            >
              <Users className="h-8 w-8 text-accent mx-auto mb-3" />
              <h3 className="font-bold mb-1">Fallstudier</h3>
              <p className="text-sm text-muted-foreground">
                {blogPosts.filter(p => p.category === "Fallstudier").length} artiklar
              </p>
            </Card>
            <Card 
              onClick={() => setSelectedCategory("Strategi")}
              className="text-center p-6 border-2 hover:border-accent/50 transition-all hover:scale-105 cursor-pointer"
            >
              <Target className="h-8 w-8 text-accent mx-auto mb-3" />
              <h3 className="font-bold mb-1">Strategi</h3>
              <p className="text-sm text-muted-foreground">
                {blogPosts.filter(p => p.category === "Strategi").length} artiklar
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-6 glass-card p-12 rounded-3xl border-2">
          <h2 className="text-3xl md:text-4xl font-bold">
            Få de senaste insikterna direkt i inboxen
          </h2>
          <p className="text-lg text-muted-foreground">
            Prenumerera på vårt nyhetsbrev och få värdefulla tips om eventdriven marknadsföring varje vecka.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 w-full">
              <input
                type="email"
                placeholder="Din e-postadress"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border-2 bg-background focus:border-accent outline-none transition-colors"
                required
              />
              <button 
                type="submit"
                className="px-6 py-3 bg-accent hover:bg-accent-glow text-primary-foreground font-semibold rounded-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Prenumerera
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
