import { Link } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Calendar, ArrowRight, Mail } from "lucide-react";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { OptimizedImage } from "@/components/OptimizedImage";
import { blogPosts } from "@/data/blogData";

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
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Zap className="h-6 w-6 text-accent" fill="currentColor" />
            <span className="text-xl font-bold">Spotlight</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Hem
            </Link>
            <Link to="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Kontakt
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-32 lg:py-40">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight">
            Insikter & tips om
            <br />
            <span className="text-primary">eventdriven marknadsföring</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed">
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
                    src={blogPosts[0].image}
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
              <div className="h-8 w-8 text-accent mx-auto mb-3">📈</div>
              <h3 className="font-bold mb-1">Tips & Tricks</h3>
              <p className="text-sm text-muted-foreground">
                {blogPosts.filter(p => p.category === "Tips & Tricks").length} artiklar
              </p>
            </Card>
            <Card 
              onClick={() => setSelectedCategory("AI & Teknologi")}
              className="text-center p-6 border-2 hover:border-accent/50 transition-all hover:scale-105 cursor-pointer"
            >
              <div className="h-8 w-8 text-accent mx-auto mb-3">💡</div>
              <h3 className="font-bold mb-1">AI & Teknologi</h3>
              <p className="text-sm text-muted-foreground">
                {blogPosts.filter(p => p.category === "AI & Teknologi").length} artiklar
              </p>
            </Card>
            <Card 
              onClick={() => setSelectedCategory("Fallstudier")}
              className="text-center p-6 border-2 hover:border-accent/50 transition-all hover:scale-105 cursor-pointer"
            >
              <div className="h-8 w-8 text-accent mx-auto mb-3">👥</div>
              <h3 className="font-bold mb-1">Fallstudier</h3>
              <p className="text-sm text-muted-foreground">
                {blogPosts.filter(p => p.category === "Fallstudier").length} artiklar
              </p>
            </Card>
            <Card 
              onClick={() => setSelectedCategory("Strategi")}
              className="text-center p-6 border-2 hover:border-accent/50 transition-all hover:scale-105 cursor-pointer"
            >
              <div className="h-8 w-8 text-accent mx-auto mb-3">🎯</div>
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
