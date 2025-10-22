import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Sparkles, Check, ArrowRight, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const ExitIntentPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error("Vänligen ange en giltig e-postadress");
      return;
    }

    setIsSubmitting(true);

    try {
      // Call edge function to capture lead
      const { error } = await supabase.functions.invoke('capture-lead', {
        body: { email, source: 'exit_intent_popup' }
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success("Tack! Du får snart din guide via email.");
      
      // Close popup after 3 seconds
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error) {
      console.error('Error capturing lead:', error);
      toast.error("Något gick fel. Försök igen.");
    } finally {
      setIsSubmitting(false);
    }
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
                <Download className="h-4 w-4 text-primary animate-bounce" />
                <span className="text-sm font-medium text-primary">Gratis Guide!</span>
              </div>
              
              <DialogTitle className="text-3xl sm:text-4xl font-bold leading-tight">
                Vänta! Få vår{" "}
                <span className="text-primary">Event Marketing Guide</span>
              </DialogTitle>
              
              <DialogDescription className="text-lg text-muted-foreground">
                Lär dig hur du maximerar försäljningen vid lokala evenemang. Helt gratis, direkt till din inkorg!
              </DialogDescription>
            </DialogHeader>

            {isSubmitted ? (
              // Success state
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Perfekt!</h3>
                  <p className="text-muted-foreground">
                    Kolla din inkorg - din guide är på väg!
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Benefits list */}
                <div className="space-y-3">
                  <h3 className="font-semibold">I guiden får du:</h3>
                  {[
                    "7 beprövade strategier för event marketing",
                    "Kampanjmallar du kan använda direkt",
                    "Checklista för varje event-typ",
                    "ROI-kalkylator för eventbaserad marknadsföring"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Email form */}
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-semibold">
                      Din e-postadress
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="namn@företag.se"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 text-base"
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    variant="animated" 
                    size="xl" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Skickar..." : "Skicka mig guiden"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>

                {/* Alternative CTA */}
                <div className="text-center pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-3">
                    Eller starta direkt med en gratis provperiod
                  </p>
                  <Link to="/auth" onClick={handleClose}>
                    <Button variant="outline" size="lg" className="w-full">
                      Testa Spotlight gratis
                    </Button>
                  </Link>
                </div>
              </>
            )}

            {/* Trust signals */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs text-muted-foreground border-t">
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
