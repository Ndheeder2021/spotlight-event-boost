import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowRight, 
  ArrowLeft, 
  X, 
  MapPin, 
  Sparkles, 
  BarChart3, 
  Calendar,
  Check,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import featureEvents from "@/assets/feature-event-radar-new.png";
import featureAiCampaign from "@/assets/feature-ai-campaign-new.png";
import featureAnalytics from "@/assets/feature-analytics-new.png";

interface TourStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  image?: string;
  features: string[];
  color: string;
}

const tourSteps: TourStep[] = [
  {
    id: 1,
    title: "Upptäck lokala evenemang automatiskt",
    description: "Spotlight övervakar kontinuerligt alla evenemang i ditt område och notifierar dig när det händer något relevant för din verksamhet.",
    icon: <MapPin className="h-6 w-6" />,
    image: featureEvents,
    features: [
      "Realtidsbevakning av 10,000+ evenemang",
      "Filtrera efter typ, storlek och avstånd",
      "Direkta notiser vid nya events"
    ],
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    title: "AI skapar kampanjer på 60 sekunder",
    description: "Välj ett evenemang och låt vår AI generera professionella, skräddarsydda kampanjtexter som matchar din målgrupp och varumärke.",
    icon: <Sparkles className="h-6 w-6" />,
    image: featureAiCampaign,
    features: [
      "ChatGPT-driven copywriting",
      "Anpassat efter din bransch",
      "Flera varianter att välja mellan"
    ],
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 3,
    title: "Spåra och optimera dina resultat",
    description: "Se exakt hur dina kampanjer presterar med detaljerad analytics, ROI-tracking och A/B-testning i realtid.",
    icon: <BarChart3 className="h-6 w-6" />,
    image: featureAnalytics,
    features: [
      "Real-time analytics dashboard",
      "ROI-beräkning per kampanj",
      "A/B-testning för optimering"
    ],
    color: "from-green-500 to-emerald-500"
  },
  {
    id: 4,
    title: "Planera framåt med Event Calendar",
    description: "Få full översikt över kommande evenemang och planera dina kampanjer i förväg för maximalt genomslag.",
    icon: <Calendar className="h-6 w-6" />,
    image: featureEvents,
    features: [
      "Kalendervy över alla events",
      "Prognoser för kundflöde",
      "Automatiska påminnelser"
    ],
    color: "from-orange-500 to-red-500"
  }
];

export const InteractiveProductTour = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const step = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;
  const isLastStep = currentStep === tourSteps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setCurrentStep(0);
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="lg"
        onClick={() => setIsOpen(true)}
        className="group"
      >
        <Zap className="mr-2 h-5 w-5" />
        Ta en rundtur
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 border-2 border-primary/20 flex flex-col">
          <DialogTitle className="sr-only">
            Interaktiv produktrundtur - Steg {currentStep + 1} av {tourSteps.length}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {step.description}
          </DialogDescription>
          
          {/* Header */}
          <div className="relative bg-gradient-to-r from-background via-primary/5 to-background p-6 border-b flex-shrink-0">
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-full p-2 hover:bg-accent transition-colors"
              aria-label="Stäng"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className={`rounded-full bg-gradient-to-br ${step.color} p-3 text-white`}>
                {step.icon}
              </div>
              <div>
                <Badge variant="outline" className="mb-1">
                  Steg {currentStep + 1} av {tourSteps.length}
                </Badge>
                <h2 className="text-2xl font-bold">{step.title}</h2>
              </div>
            </div>

            <Progress value={progress} className="h-2" />
          </div>

          {/* Content */}
          <div className="p-8 space-y-6 overflow-y-auto flex-1">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {step.description}
            </p>

            {/* Visual Demo Area */}
            <Card className="relative aspect-video rounded-xl overflow-hidden border-2 border-border bg-accent/20">
              {step.image ? (
                <img 
                  src={step.image} 
                  alt={step.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="text-center space-y-4">
                    <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg`}>
                      {step.icon}
                    </div>
                    <div className="space-y-2">
                      <div className="inline-block px-4 py-2 bg-background/90 backdrop-blur-sm rounded-lg border">
                        <p className="text-sm font-medium">Interaktiv demo</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Features List */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Nyckelfunktioner:</h3>
              <div className="grid gap-3">
                {step.features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-3 p-3 rounded-lg bg-accent/50 border transition-all hover:bg-accent"
                  >
                    <div className={`rounded-full bg-gradient-to-br ${step.color} p-1 mt-0.5`}>
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="border-t bg-accent/30 p-6 flex-shrink-0">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handlePrev}
                disabled={isFirstStep}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Föregående
              </Button>

              <div className="flex gap-2">
                {tourSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentStep 
                        ? 'w-8 bg-primary' 
                        : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                    aria-label={`Gå till steg ${index + 1}`}
                  />
                ))}
              </div>

              {isLastStep ? (
                <Link to="/auth" onClick={handleClose}>
                  <Button variant="animated" className="gap-2">
                    Kom igång gratis
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="default"
                  className="gap-2"
                >
                  Nästa
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
