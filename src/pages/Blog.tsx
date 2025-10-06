import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Calendar, ArrowRight, TrendingUp, Users, Target, Lightbulb } from "lucide-react";
import { Footer } from "@/components/Footer";

const blogPosts = [
  {
    id: 1,
    title: "5 sätt att maximera försäljningen vid lokala evenemang",
    excerpt: "Lär dig hur du kan utnyttja lokala evenemang för att öka trafiken till din butik och öka försäljningen med upp till 40%.",
    category: "Tips & Tricks",
    date: "2025-01-15",
    readTime: "5 min läsning",
    icon: TrendingUp,
  },
  {
    id: 2,
    title: "Hur AI förändrar lokal marknadsföring",
    excerpt: "Upptäck hur artificiell intelligens kan hjälpa små företag att konkurrera med större aktörer genom smartare kampanjer.",
    category: "AI & Teknologi",
    date: "2025-01-10",
    readTime: "7 min läsning",
    icon: Lightbulb,
  },
  {
    id: 3,
    title: "Fallstudie: Café Bröd & Salt ökar försäljningen med 40%",
    excerpt: "Läs om hur ett lokalt café i Stockholm använde Spotlight för att dra nytta av närliggande evenemang och ökade sin försäljning dramatiskt.",
    category: "Fallstudier",
    date: "2025-01-05",
    readTime: "6 min läsning",
    icon: Users,
  },
  {
    id: 4,
    title: "Bästa tidpunkten att lansera en eventkampanj",
    excerpt: "Timing är allt. Lär dig när du ska starta din marknadsföring för att få maximal effekt av lokala evenemang.",
    category: "Strategi",
    date: "2024-12-28",
    readTime: "4 min läsning",
    icon: Target,
  },
  {
    id: 5,
    title: "Så skapar du engagerande kampanjtexter",
    excerpt: "En guide till att skriva marknadsföringstexter som fångar uppmärksamhet och driver konvertering.",
    category: "Content Marketing",
    date: "2024-12-20",
    readTime: "8 min läsning",
    icon: TrendingUp,
  },
  {
    id: 6,
    title: "Event-driven marknadsföring: En komplett guide",
    excerpt: "Allt du behöver veta om att bygga en framgångsrik marknadsföringsstrategi baserad på lokala evenemang.",
    category: "Guide",
    date: "2024-12-15",
    readTime: "10 min läsning",
    icon: Lightbulb,
  },
];

export default function Blog() {
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
          <Card className="overflow-hidden border-2 hover:border-accent/50 transition-all hover:shadow-xl">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="bg-gradient-to-br from-accent/20 to-accent/5 p-12 flex items-center justify-center">
                <TrendingUp className="h-32 w-32 text-accent" />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <Badge className="w-fit mb-4">Tips & Tricks</Badge>
                <h2 className="text-3xl font-bold mb-4">
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
                <Link 
                  to="/blog/1" 
                  className="text-accent hover:text-accent-glow flex items-center gap-2 font-semibold"
                >
                  Läs mer
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Senaste artiklarna</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(1).map((post) => {
              const Icon = post.icon;
              return (
                <Card 
                  key={post.id} 
                  className="flex flex-col border-2 hover:border-accent/50 transition-all hover:shadow-xl group"
                >
                  <CardHeader>
                    <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6 text-accent" />
                    </div>
                    <Badge className="w-fit mb-2">{post.category}</Badge>
                    <CardTitle className="text-xl group-hover:text-accent transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
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
                    <Link 
                      to={`/blog/${post.id}`}
                      className="text-accent hover:text-accent-glow flex items-center gap-2 font-semibold"
                    >
                      Läs mer
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </CardContent>
                </Card>
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
            <Card className="text-center p-6 border-2 hover:border-accent/50 transition-all hover:scale-105 cursor-pointer">
              <TrendingUp className="h-8 w-8 text-accent mx-auto mb-3" />
              <h3 className="font-bold mb-1">Tips & Tricks</h3>
              <p className="text-sm text-muted-foreground">12 artiklar</p>
            </Card>
            <Card className="text-center p-6 border-2 hover:border-accent/50 transition-all hover:scale-105 cursor-pointer">
              <Lightbulb className="h-8 w-8 text-accent mx-auto mb-3" />
              <h3 className="font-bold mb-1">AI & Teknologi</h3>
              <p className="text-sm text-muted-foreground">8 artiklar</p>
            </Card>
            <Card className="text-center p-6 border-2 hover:border-accent/50 transition-all hover:scale-105 cursor-pointer">
              <Users className="h-8 w-8 text-accent mx-auto mb-3" />
              <h3 className="font-bold mb-1">Fallstudier</h3>
              <p className="text-sm text-muted-foreground">15 artiklar</p>
            </Card>
            <Card className="text-center p-6 border-2 hover:border-accent/50 transition-all hover:scale-105 cursor-pointer">
              <Target className="h-8 w-8 text-accent mx-auto mb-3" />
              <h3 className="font-bold mb-1">Strategi</h3>
              <p className="text-sm text-muted-foreground">10 artiklar</p>
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
            <input
              type="email"
              placeholder="Din e-postadress"
              className="flex-1 px-4 py-3 rounded-lg border-2 bg-background focus:border-accent outline-none"
            />
            <button className="px-6 py-3 bg-accent hover:bg-accent-glow text-primary-foreground font-semibold rounded-lg transition-colors">
              Prenumerera
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
