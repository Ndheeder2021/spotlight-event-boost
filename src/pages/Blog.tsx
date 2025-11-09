import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Calendar, ArrowRight, Mail, Star, TrendingUp, Users, BookOpen, Sparkles, Heart, CheckCircle2, Clock } from "lucide-react";
import { Footer } from "@/components/Footer";
import { GlobalHeader } from "@/components/GlobalHeader";
import { TrustBadges } from "@/components/TrustBadges";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { SkeletonBlogCard, SkeletonHero } from "@/components/ui/skeleton-card";
import { toast } from "sonner";
import { OptimizedImage } from "@/components/OptimizedImage";
import { blogPosts } from "@/data/blogData";
import { useTranslation } from "react-i18next";

export default function Blog() {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const currentLang = i18n.language as 'sv' | 'en';

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      toast.success(`${t("blogSubscribeSuccess")} ${email}.`);
      setEmail("");
    } else {
      toast.error(t("blogSubscribeError"));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <GlobalHeader />

      {/* Hero Section - More Playful */}
      <section className="relative container mx-auto px-4 sm:px-6 py-32 lg:py-40 overflow-hidden">
        {/* Doodle decorations */}
        <div className="absolute top-10 left-10 text-primary/10 hidden lg:block animate-float" style={{ transform: 'rotate(-15deg)' }}>
          <svg width="80" height="80" viewBox="0 0 80 80">
            <path d="M20 40 Q40 20, 60 40 T100 40" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="40" cy="25" r="5" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute bottom-20 right-10 text-accent/10 hidden lg:block animate-float" style={{ animationDelay: '1s', transform: 'rotate(20deg)' }}>
          <svg width="60" height="60" viewBox="0 0 60 60">
            <rect x="15" y="15" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="5,5" />
            <circle cx="30" cy="30" r="10" fill="currentColor" opacity="0.3" />
          </svg>
        </div>
        
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          {isLoading ? (
            <SkeletonHero />
          ) : (
            <div className="animate-fade-in">
              <div className="inline-block relative animate-in fade-in duration-500">
                <Badge variant="outline" className="border-primary/30 bg-primary/5 px-6 py-2 text-base mb-6" style={{ transform: 'rotate(-2deg)' }}>
                  📚 {t("blogBadge") || "Tips & Insikter"}
                </Badge>
                <svg className="absolute inset-0 w-full h-full -z-10 pointer-events-none" viewBox="0 0 200 50">
                  <ellipse cx="100" cy="25" rx="98" ry="23" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.2" />
                </svg>
              </div>
              
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight">
                {t("blogHero")}
                <br />
                <span className="gradient-text relative inline-block">
                  {t("blogHeroHighlight")}
                  <svg className="absolute -bottom-4 left-0 w-full h-4" viewBox="0 0 400 12" preserveAspectRatio="none">
                    <path d="M0 6 Q 100 2, 200 6 T 400 6" stroke="hsl(var(--primary))" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4" />
                  </svg>
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed">
                {t("blogHeroDesc")}
              </p>
              
              {/* Fun stats */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-accent" />
                  <span className="font-semibold">{blogPosts.length}+ artiklar</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-semibold">5 min läsning</span>
                  <span className="text-muted-foreground">i snitt</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                  <span className="font-semibold">Ny artikel</span>
                  <span className="text-muted-foreground">varje vecka</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Post - More Festive */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-b from-muted/20 to-background">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <SkeletonBlogCard />
          ) : (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-8">
                <div className="inline-block relative">
                  <Badge className="px-4 py-2 text-base" style={{ transform: 'rotate(-2deg)' }}>
                    ⭐ {t("blogFeatured")}
                  </Badge>
                  <svg className="absolute inset-0 w-full h-full -z-10 pointer-events-none" viewBox="0 0 150 50">
                    <ellipse cx="75" cy="25" rx="73" ry="23" fill="none" stroke="hsl(var(--accent))" strokeWidth="2" opacity="0.3" />
                  </svg>
                </div>
                <Sparkles className="h-5 w-5 text-accent animate-pulse" />
              </div>
              
              <Link to="/blog/1">
                <Card className="overflow-hidden border-2 hover:border-accent/50 transition-all duration-300 hover:shadow-2xl group cursor-pointer premium-glow" style={{ transform: 'rotate(-0.5deg)' }}>
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="relative overflow-hidden h-80 md:h-auto">
                       <OptimizedImage
                        src={blogPosts[0].image}
                        alt={blogPosts[0].title[currentLang]}
                        width={800}
                        height={600}
                        priority
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 bg-accent text-primary-foreground px-3 py-1 rounded-full text-xs font-bold animate-bounce">
                        🔥 Populär!
                      </div>
                    </div>
                    <div className="p-8 flex flex-col justify-center bg-gradient-to-br from-background to-muted/20">
                      <Badge className="w-fit mb-4">{blogPosts[0].category[currentLang]}</Badge>
                      <h2 className="text-3xl font-bold mb-4 group-hover:text-accent transition-colors">
                        {blogPosts[0].title[currentLang]}
                      </h2>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {blogPosts[0].excerpt[currentLang]}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(blogPosts[0].date).toLocaleDateString(currentLang === 'sv' ? 'sv-SE' : 'en-US', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </div>
                        <span>•</span>
                        <span>{blogPosts[0].readTime[currentLang]}</span>
                      </div>
                      <div className="text-accent group-hover:text-accent-glow flex items-center gap-2 font-semibold group-hover:gap-3 transition-all">
                        {t("blogReadMore")}
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Blog Posts Grid - More Dynamic */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                {selectedCategory ? (
                  <span>
                    📂 {selectedCategory}
                  </span>
                ) : (
                  <span>
                    ✨ {t("blogLatest")}
                  </span>
                )}
              </h2>
              {!selectedCategory && (
                <p className="text-muted-foreground">
                  Färska insikter och tips för din marknadsföring
                </p>
              )}
            </div>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="mt-4 sm:mt-0 px-4 py-2 text-sm text-accent hover:text-accent-glow transition-colors font-semibold border-2 border-accent/30 rounded-lg hover:border-accent/50 hover:scale-105 transition-all"
              >
                ← {t("blogShowAll")}
              </button>
            )}
          </div>
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonBlogCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts
                .filter((post) => !selectedCategory || post.category[currentLang] === selectedCategory)
                .slice(selectedCategory ? 0 : 1)
                .map((post, index) => {
                const isEven = index % 2 === 0;
                return (
                  <Link key={post.id} to={`/blog/${post.id}`}>
                    <Card 
                      className="flex flex-col border-2 hover:border-accent/50 transition-all duration-300 hover:shadow-2xl group cursor-pointer h-full overflow-hidden premium-glow animate-in fade-in"
                      style={{ 
                        animationDelay: `${index * 50}ms`,
                        transform: `rotate(${isEven ? '-0.5deg' : '0.5deg'})`
                      }}
                    >
                      <div className="relative overflow-hidden h-48">
                        <OptimizedImage
                          src={post.image} 
                          alt={post.title[currentLang]}
                          width={600}
                          height={400}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {index < 3 && (
                          <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-bold">
                            {index === 0 ? "🆕 Nytt" : index === 1 ? "🔥 Trendigt" : "💡 Populärt"}
                          </div>
                        )}
                      </div>
                      <CardHeader className="flex-1">
                        <Badge className="w-fit mb-2">{post.category[currentLang]}</Badge>
                        <CardTitle className="text-xl group-hover:text-accent transition-colors mb-3 leading-tight">
                          {post.title[currentLang]}
                        </CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          {post.excerpt[currentLang]}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date(post.date).toLocaleDateString(currentLang === 'sv' ? 'sv-SE' : 'en-US', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </div>
                          <span>•</span>
                          <span>{post.readTime[currentLang]}</span>
                        </div>
                        <div className="text-accent group-hover:text-accent-glow flex items-center gap-2 font-semibold group-hover:gap-3 transition-all">
                          {t("blogReadMore")}
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-accent/5 to-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-5xl mb-4">📊</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Vårt <span className="gradient-text">blogg-universum</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Statistik som imponerar
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center p-6 border-2 glass-card hover:border-accent/50 transition-all duration-300 hover:scale-110 premium-glow group cursor-pointer" style={{ transform: 'rotate(-1deg)' }}>
              <div className="text-4xl mb-3">📚</div>
              <div className="text-4xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform">
                <AnimatedCounter end={blogPosts.length} suffix="+" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">Artiklar publicerade</p>
            </Card>
            
            <Card className="text-center p-6 border-2 glass-card hover:border-accent/50 transition-all duration-300 hover:scale-110 premium-glow group cursor-pointer">
              <div className="text-4xl mb-3">👥</div>
              <div className="text-4xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform">
                <AnimatedCounter end={5000} suffix="+" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">Läsare varje månad</p>
            </Card>
            
            <Card className="text-center p-6 border-2 glass-card hover:border-accent/50 transition-all duration-300 hover:scale-110 premium-glow group cursor-pointer" style={{ transform: 'rotate(1deg)' }}>
              <div className="text-4xl mb-3">⏱️</div>
              <div className="text-4xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform">
                <AnimatedCounter end={5} suffix=" min" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">Genomsnittlig läsning</p>
            </Card>
            
            <Card className="text-center p-6 border-2 glass-card hover:border-accent/50 transition-all duration-300 hover:scale-110 premium-glow group cursor-pointer" style={{ transform: 'rotate(-1deg)' }}>
              <div className="text-4xl mb-3">⭐</div>
              <div className="text-4xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform">
                <AnimatedCounter end={98} suffix="%" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">Nöjda läsare</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section - More Playful */}
      <section className="relative container mx-auto px-4 py-20 overflow-hidden">
        {/* Doodle decoration */}
        <div className="absolute top-10 left-20 text-muted/10 hidden lg:block" style={{ transform: 'rotate(-20deg)' }}>
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="30" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="10,5" />
          </svg>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-5xl mb-4">🗂️</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("blogExploreCategories")}
            </h2>
            <p className="text-lg text-muted-foreground">
              Hitta det som passar dig bäst
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { emoji: "📈", category: t("blogCategoryTipsTricks"), gradient: "from-blue-500/10 to-blue-500/5" },
              { emoji: "💡", category: t("blogCategoryAiTech"), gradient: "from-purple-500/10 to-purple-500/5" },
              { emoji: "👥", category: t("blogCategoryCaseStudies"), gradient: "from-green-500/10 to-green-500/5" },
              { emoji: "🎯", category: t("blogCategoryStrategy"), gradient: "from-orange-500/10 to-orange-500/5" }
            ].map((item, index) => {
              const count = blogPosts.filter(p => p.category[currentLang] === item.category).length;
              return (
                <Card 
                  key={index}
                  onClick={() => setSelectedCategory(item.category)}
                  className={`text-center p-8 border-2 hover:border-accent/50 transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-pointer glass-card premium-glow bg-gradient-to-br ${item.gradient} animate-in fade-in`}
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    transform: `rotate(${index % 2 === 0 ? '-1deg' : '1deg'})`
                  }}
                >
                  <div className="text-5xl mb-4 transition-transform group-hover:scale-110 group-hover:rotate-12">{item.emoji}</div>
                  <h3 className="font-bold text-lg mb-2">{item.category}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    <span className="font-semibold text-accent">{count}</span> {t("blogArticles")}
                  </p>
                  <div className="inline-flex items-center gap-2 text-accent text-sm font-medium">
                    Utforska <ArrowRight className="h-3 w-3" />
                  </div>
                </Card>
              );
            })}
          </div>
          
          {/* Achievement badges */}
          <div className="mt-16 flex flex-wrap justify-center gap-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <Star className="h-4 w-4 text-blue-500 fill-blue-500" />
              <span className="text-sm font-medium">Expertkunskap</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Beprövade strategier</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
              <Users className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Verkliga case studies</span>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA - More Festive */}
      <section className="relative container mx-auto px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-accent/5 -z-10" />
        
        {/* Celebration decorations */}
        <div className="absolute top-10 left-10 text-6xl animate-bounce hidden lg:block" style={{ animationDelay: '0.5s' }}>
          ✉️
        </div>
        <div className="absolute top-20 right-20 text-6xl animate-bounce hidden lg:block" style={{ animationDelay: '1s' }}>
          📧
        </div>
        <div className="absolute bottom-10 left-1/4 text-6xl animate-bounce hidden lg:block" style={{ animationDelay: '1.5s' }}>
          💌
        </div>
        
        <div className="max-w-4xl mx-auto text-center space-y-8 glass-card p-12 rounded-3xl border-2 premium-glow-lg relative" style={{ transform: 'rotate(-0.5deg)' }}>
          <div className="text-6xl mb-4 animate-bounce">📬</div>
          
          <h2 className="text-3xl md:text-4xl font-bold">
            {t('blogNewsletterTitle')}
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('blogNewsletterDesc')}
          </p>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Veckovis tips & tricks</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Exklusivt innehåll</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Avsluta när du vill</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto pt-4">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 w-full">
              <input
                type="email"
                placeholder={t('newsletterEmailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border-2 bg-background focus:border-accent outline-none transition-colors"
                required
              />
              <button 
                type="submit"
                className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-primary via-primary-glow to-primary text-primary-foreground font-bold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 bg-[length:200%_100%] animate-gradient-x flex items-center justify-center gap-2"
              >
                <Mail className="h-4 w-4 relative z-10" />
                <span className="relative z-10">{t('blogSubscribe')}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-glow to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </form>
          </div>
          
          {/* Small testimonial snippet */}
          <div className="pt-8 border-t border-border/50">
            <div className="flex items-center justify-center gap-2 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground italic">
              "Bästa nyhetsbrevet jag prenumererar på. Alltid värdefulla tips!"
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              — Maria A., Digital Marknadsförare
            </p>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Footer */}
      <Footer />
    </div>
  );
}
