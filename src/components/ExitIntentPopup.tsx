import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Sparkles, Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const ExitIntentPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if popup has been shown before
    const popupShown = sessionStorage.getItem("exitIntentShown");
    if (popupShown) {
      setHasShown(true);
      return;
    }

    let exitIntentTriggered = false;

    const handleMouseLeave = (e: MouseEvent) => {
      // Check if mouse is leaving from the top of the viewport
      if (e.clientY <= 0 && !exitIntentTriggered && !hasShown) {
        exitIntentTriggered = true;
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem("exitIntentShown", "true");
      }
    };

    // Add event listener after a short delay to avoid triggering on page load
    const timeoutId = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShown]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-2 border-primary/20">
        <div className="relative">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 pointer-events-none" />
          
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-full p-2 hover:bg-accent transition-colors z-10"
            aria-label="Stäng"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Content */}
          <div className="relative p-8 space-y-6">
            <DialogHeader className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 w-fit">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">Vänta!</span>
              </div>
              
              <DialogTitle className="text-3xl sm:text-4xl font-bold leading-tight">
                Innan du går...
                <br />
                <span className="text-primary">Testa Spotlight gratis!</span>
              </DialogTitle>
              
              <DialogDescription className="text-lg text-muted-foreground">
                Få 14 dagar kostnadsfri tillgång till alla funktioner. Ingen bindningstid, avsluta när du vill.
              </DialogDescription>
            </DialogHeader>

            {/* Benefits list */}
            <div className="space-y-3">
              {[
                "AI-genererade kampanjer på 60 sekunder",
                "Automatisk eventbevakning i ditt område",
                "Professionella analytics & ROI-tracking",
                "Inget kreditkort krävs för att starta"
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link to="/auth" className="flex-1">
                <Button 
                  variant="animated" 
                  size="lg" 
                  className="w-full"
                  onClick={handleClose}
                >
                  Starta gratis provperiod
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleClose}
                className="flex-1"
              >
                Kanske senare
              </Button>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs text-muted-foreground border-t">
              <div className="flex items-center gap-1">
                <Check className="h-3 w-3 text-primary" />
                <span>500+ nöjda kunder</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="h-3 w-3 text-primary" />
                <span>5/5 i snittbetyg</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="h-3 w-3 text-primary" />
                <span>Avsluta när du vill</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
