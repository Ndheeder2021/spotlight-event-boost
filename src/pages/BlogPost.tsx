import { Link, useParams } from "react-router-dom";
import { Zap, Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/OptimizedImage";
import { blogPosts } from "@/data/blogData";

export default function BlogPost() {
  const { id } = useParams();
  const article = blogPosts.find(a => a.id === Number(id));

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

  // Om artikeln saknar content, visa en generisk placeholder
  const defaultContent = `
    <p>${article.excerpt}</p>
    <h2>Mer information kommer snart</h2>
    <p>Vi arbetar på att lägga till mer innehåll till denna artikel. Kom tillbaka snart för att läsa mer!</p>
  `;

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
            dangerouslySetInnerHTML={{ __html: article.content || defaultContent }}
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
