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
import { useTranslation } from "react-i18next";
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
    image: "/hero-video.mp4",
    features: [
      "Kalendervy över alla events",
      "Prognoser för kundflöde",
      "Automatiska påminnelser"
    ],
    color: "from-orange-500 to-red-500"
  }
];

export const InteractiveProductTour = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const tourSteps: TourStep[] = [
    {
      id: 1,
      title: t('tourStep1Title'),
      description: t('tourStep1Desc'),
      icon: <MapPin className="h-6 w-6" />,
      image: featureEvents,
      features: [
        t('tourStep1Feature1'),
        t('tourStep1Feature2'),
        t('tourStep1Feature3')
      ],
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      title: t('tourStep2Title'),
      description: t('tourStep2Desc'),
      icon: <Sparkles className="h-6 w-6" />,
      image: featureAiCampaign,
      features: [
        t('tourStep2Feature1'),
        t('tourStep2Feature2'),
        t('tourStep2Feature3')
      ],
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 3,
      title: t('tourStep3Title'),
      description: t('tourStep3Desc'),
      icon: <BarChart3 className="h-6 w-6" />,
      image: featureAnalytics,
      features: [
        t('tourStep3Feature1'),
        t('tourStep3Feature2'),
        t('tourStep3Feature3')
      ],
      color: "from-green-500 to-emerald-500"
    },
    {
      id: 4,
      title: t('tourStep4Title'),
      description: t('tourStep4Desc'),
      icon: <Calendar className="h-6 w-6" />,
      image: "/hero-video.mp4",
      features: [
        t('tourStep4Feature1'),
        t('tourStep4Feature2'),
        t('tourStep4Feature3')
      ],
      color: "from-orange-500 to-red-500"
    }
  ];

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
        size="xl"
        onClick={() => setIsOpen(true)}
        className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        <Zap className="mr-2 h-5 w-5" />
        {t('takeATour')}
        <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-6xl h-[95vh] p-0 border-2 border-primary/20 flex flex-col bg-background overflow-hidden">
          <DialogTitle className="sr-only">
            {t('interactiveDemo')} - {t('tourStep')} {currentStep + 1} {t('of')} {tourSteps.length}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {step.description}
          </DialogDescription>
          
          {/* Header */}
          <div className="relative bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-4 border-b flex-shrink-0">
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-full p-2 hover:bg-background/80 transition-colors z-10"
              aria-label={t('close')}
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className={`rounded-full bg-gradient-to-br ${step.color} p-2.5 text-white shadow-lg`}>
                {step.icon}
              </div>
              <div>
                <Badge variant="outline" className="mb-1.5 border-primary/30 bg-primary/5 text-xs">
                  {t('tourStep')} {currentStep + 1} {t('of')} {tourSteps.length}
                </Badge>
                <h2 className="text-xl font-bold tracking-tight">{step.title}</h2>
              </div>
            </div>

            <Progress value={progress} className="h-1.5" />
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 overflow-hidden">
            {/* Left side - Image/Video */}
            <div className="lg:w-3/5 flex-shrink-0">
              <Card className="relative h-full rounded-xl overflow-hidden border-2 shadow-xl">
                {step.image ? (
                  step.image.endsWith('.mp4') ? (
                    <video 
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source src={step.image} type="video/mp4" />
                    </video>
                  ) : (
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-8 bg-gradient-to-br from-accent/50 to-background">
                    <div className="text-center space-y-4">
                      <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg`}>
                        {step.icon}
                      </div>
                      <div className="space-y-2">
                        <div className="inline-block px-4 py-2 bg-background/90 backdrop-blur-sm rounded-lg border shadow-sm">
                          <p className="text-sm font-medium">{t('interactiveDemo')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Right side - Description and Features */}
            <div className="lg:w-2/5 flex flex-col justify-center space-y-4">
              <p className="text-base text-muted-foreground leading-relaxed">
                {step.description}
              </p>

              {/* Features List */}
              <div className="space-y-2">
                <h3 className="font-semibold text-base">{t('keyFeatures')}</h3>
                <div className="grid gap-2">
                  {step.features.map((feature, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-2 p-3 rounded-lg bg-accent/30 border border-border/50 transition-all hover:bg-accent/50 hover:border-primary/20"
                    >
                      <div className={`rounded-full bg-gradient-to-br ${step.color} p-1 mt-0.5 flex-shrink-0`}>
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm font-medium leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="border-t bg-gradient-to-r from-accent/20 via-accent/30 to-accent/20 p-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={isFirstStep}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('previous')}
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
                    aria-label={`${t('goToStep')} ${index + 1}`}
                  />
                ))}
              </div>

              {isLastStep ? (
                <Link to="/auth" onClick={handleClose}>
                  <Button variant="animated" className="gap-2">
                    {t('getStartedFree')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="animated"
                  className="gap-2"
                >
                  {t('next')}
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
