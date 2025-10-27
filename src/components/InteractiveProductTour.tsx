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
      image: "/empty-restaurant-video.mp4",
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
      image: "/ai-campaign-demo.mp4",
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
      image: "/analytics-demo.mp4",
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
      image: "/happy-customers-demo.mp4",
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
        className="w-full h-14 text-base sm:text-lg border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        <Zap className="mr-2 h-5 w-5" />
        {t('takeATour')}
        <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[98vw] h-[98vh] p-0 border-2 border-primary/30 flex flex-col bg-background overflow-hidden shadow-2xl rounded-2xl">
          <DialogTitle className="sr-only">
            {t('interactiveDemo')} - {t('tourStep')} {currentStep + 1} {t('of')} {tourSteps.length}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {step.description}
          </DialogDescription>
          
          {/* Header */}
          <div className="relative bg-gradient-to-r from-primary/10 via-accent/20 to-primary/10 p-6 border-b flex-shrink-0 backdrop-blur-sm">
            <button
              onClick={handleClose}
              className="absolute right-6 top-6 rounded-full p-2.5 hover:bg-background/80 transition-all hover:scale-110 z-10 border border-border/50"
              aria-label={t('close')}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className={`rounded-2xl bg-gradient-to-br ${step.color} p-3.5 text-white shadow-xl`}>
                {step.icon}
              </div>
              <div>
                <Badge variant="outline" className="mb-2 border-primary/40 bg-primary/10 text-sm font-semibold px-3 py-1">
                  {t('tourStep')} {currentStep + 1} {t('of')} {tourSteps.length}
                </Badge>
                <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">{step.title}</h2>
              </div>
            </div>

            <Progress value={progress} className="h-2" />
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col lg:flex-row gap-8 p-8 overflow-hidden">
            {/* Left side - Image/Video */}
            <div className="lg:w-3/5 flex-shrink-0">
              <Card className="relative h-full rounded-2xl overflow-hidden border-2 border-primary/20 shadow-2xl hover:border-primary/30 transition-all">
                {step.image ? (
                  step.image.endsWith('.mp4') ? (
                    <video 
                      key={currentStep}
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
                      <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-xl`}>
                        {step.icon}
                      </div>
                      <div className="space-y-2">
                        <div className="inline-block px-5 py-3 bg-background/90 backdrop-blur-sm rounded-xl border shadow-lg">
                          <p className="text-base font-medium">{t('interactiveDemo')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Right side - Description and Features */}
            <div className="lg:w-2/5 flex flex-col justify-center space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {step.description}
              </p>

              {/* Features List */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">{t('keyFeatures')}</h3>
                <div className="grid gap-3">
                  {step.features.map((feature, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 p-4 rounded-xl bg-accent/30 border border-border/50 transition-all hover:bg-accent/50 hover:border-primary/30 hover:scale-[1.02] hover:shadow-md"
                    >
                      <div className={`rounded-full bg-gradient-to-br ${step.color} p-1.5 mt-0.5 flex-shrink-0 shadow-lg`}>
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-base font-medium leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="border-t bg-gradient-to-r from-accent/20 via-accent/30 to-accent/20 p-6 flex-shrink-0 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <Button
                variant="animated"
                onClick={handlePrev}
                disabled={isFirstStep}
                className="gap-2 h-12 px-6 text-base shadow-xl"
              >
                <ArrowLeft className="h-5 w-5" />
                {t('previous')}
              </Button>

              <div className="flex gap-3">
                {tourSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`h-3 rounded-full transition-all ${
                      index === currentStep 
                        ? 'w-10 bg-primary shadow-lg' 
                        : 'w-3 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                    aria-label={`${t('goToStep')} ${index + 1}`}
                  />
                ))}
              </div>

              {isLastStep ? (
                <Link to="/auth" onClick={handleClose}>
                  <Button variant="animated" className="gap-2 h-12 px-6 text-base shadow-xl">
                    {t('getStartedFree')}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="animated"
                  className="gap-2 h-12 px-6 text-base shadow-xl"
                >
                  {t('next')}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
