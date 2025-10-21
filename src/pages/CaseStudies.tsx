import { Link, useParams } from "react-router-dom";
import { GlobalHeader } from "@/components/GlobalHeader";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { caseStudies, getCaseStudyById, type CaseStudy } from "@/data/caseStudiesData";
import { ArrowRight, Building2, MapPin, TrendingUp, Target, Lightbulb, CheckCircle2, Quote } from "lucide-react";

const CaseStudyCard = ({ study }: { study: CaseStudy }) => (
  <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-primary/50">
    <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary-glow/10 relative overflow-hidden">
      <img 
        src={study.heroImage} 
        alt={study.company}
        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
        {study.industry}
      </Badge>
    </div>
    <CardHeader>
      <CardTitle className="text-2xl group-hover:text-primary transition-colors">
        {study.title}
      </CardTitle>
      <CardDescription className="text-base">
        {study.subtitle}
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Building2 className="h-4 w-4" />
          <span>{study.company}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          <span>{study.location}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 py-4">
        {study.results.slice(0, 2).map((result, idx) => (
          <div key={idx} className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">
              {result.value}
            </div>
            <div className="text-xs text-muted-foreground">
              {result.metric}
            </div>
          </div>
        ))}
      </div>

      <Link to={`/case-studies/${study.id}`}>
        <Button variant="outline" className="w-full group/btn">
          Läs hela case studien
          <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </CardContent>
  </Card>
);

const CaseStudyDetail = ({ study }: { study: CaseStudy }) => (
  <div className="min-h-screen bg-background">
    <SEO
      title={`${study.title} - Spotlight Case Study`}
      description={study.subtitle}
      keywords={`case study, ${study.industry}, event marketing, ${study.company}`}
    />
    <GlobalHeader />

    {/* Hero Section */}
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary-glow/5" />
      <div className="container relative mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge className="mb-4">{study.industry}</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            {study.title}
          </h1>
          <p className="text-xl text-muted-foreground">
            {study.subtitle}
          </p>
          <div className="flex items-center justify-center gap-6 pt-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              <span>{study.company}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>{study.location}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Results Section */}
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Resultat
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {study.results.map((result, idx) => (
              <Card key={idx} className="text-center border-2 hover:border-primary/50 transition-all">
                <CardContent className="pt-8 pb-6">
                  <div className="text-5xl font-bold text-primary mb-2">
                    {result.value}
                  </div>
                  <div className="text-lg font-semibold mb-2">
                    {result.metric}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {result.description}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Challenge Section */}
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Target className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Utmaningen</h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {study.challenge}
          </p>
        </div>
      </div>
    </section>

    <Separator className="max-w-4xl mx-auto" />

    {/* Solution Section */}
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Lösningen</h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {study.solution}
          </p>
        </div>
      </div>
    </section>

    <Separator className="max-w-4xl mx-auto" />

    {/* Implementation Section */}
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Implementering</h2>
          </div>
          <div className="space-y-4">
            {study.implementation.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <p className="text-lg text-muted-foreground">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Testimonial Section */}
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20 overflow-hidden">
            <CardContent className="p-8 md:p-12 relative">
              <Quote className="absolute top-8 left-8 h-16 w-16 text-primary/10" />
              <div className="relative z-10 space-y-6">
                <p className="text-xl md:text-2xl font-medium leading-relaxed">
                  "{study.testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 overflow-hidden">
                    <img 
                      src={study.testimonial.image} 
                      alt={study.testimonial.author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-lg">
                      {study.testimonial.author}
                    </div>
                    <div className="text-muted-foreground">
                      {study.testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    {/* Key Takeaways Section */}
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Viktiga lärdomar</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {study.keyTakeaways.map((takeaway, idx) => (
              <Card key={idx} className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">{takeaway}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-primary-glow/10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Redo att uppnå liknande resultat?
          </h2>
          <p className="text-xl text-muted-foreground">
            Starta din 14-dagars gratisperiod idag och se hur Spotlight kan transformera din marknadsföring.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/auth">
              <Button size="lg" variant="animated">
                Kom igång gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/case-studies">
              <Button size="lg" variant="outline">
                Se fler case studies
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

const CaseStudiesOverview = () => (
  <div className="min-h-screen bg-background">
    <SEO
      title="Case Studies - Spotlight Success Stories"
      description="Upptäck hur företag över hela Sverige använder Spotlight för att öka försäljningen genom event-driven marknadsföring. Läs detaljerade case studies med verkliga resultat."
      keywords="case studies, success stories, event marketing, ROI, kundberättelser"
    />
    <GlobalHeader />

    {/* Hero Section */}
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary-glow/5" />
      <div className="container relative mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge className="mb-4">Success Stories</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            Riktiga resultat från riktiga företag
          </h1>
          <p className="text-xl text-muted-foreground">
            Upptäck hur företag över hela Sverige använder Spotlight för att öka försäljningen genom event-driven marknadsföring
          </p>
        </div>
      </div>
    </section>

    {/* Case Studies Grid */}
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {caseStudies.map((study) => (
            <CaseStudyCard key={study.id} study={study} />
          ))}
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-primary-glow/10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Vill du bli vår nästa success story?
          </h2>
          <p className="text-xl text-muted-foreground">
            Starta din 14-dagars gratisperiod idag. Inget kreditkort behövs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/auth">
              <Button size="lg" variant="animated">
                Kom igång gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline">
                Kontakta oss
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

const CaseStudies = () => {
  const { id } = useParams();
  
  if (id) {
    const study = getCaseStudyById(id);
    if (!study) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Case study hittades inte</h1>
            <Link to="/case-studies">
              <Button>Tillbaka till alla case studies</Button>
            </Link>
          </div>
        </div>
      );
    }
    return <CaseStudyDetail study={study} />;
  }

  return <CaseStudiesOverview />;
};

export default CaseStudies;
