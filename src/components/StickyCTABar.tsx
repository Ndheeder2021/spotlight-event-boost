import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";
import { Link } from "react-router-dom";

export const StickyCTABar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the bar before
    const dismissed = sessionStorage.getItem("ctaBarDismissed");
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    const handleScroll = () => {
      // Show bar after scrolling 400px down
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem("ctaBarDismissed", "true");
  };

  if (isDismissed) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="bg-gradient-to-r from-primary via-primary/95 to-primary backdrop-blur-lg border-b border-primary-foreground/10 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-3 gap-4">
            {/* Message */}
            <div className="flex items-center gap-3 flex-1">
              <div className="hidden sm:block w-2 h-2 rounded-full bg-primary-foreground/80 animate-pulse" />
              <p className="text-sm sm:text-base font-medium text-primary-foreground">
                <span className="hidden sm:inline">Redo att öka din försäljning? </span>
                <span className="font-semibold">Starta din 14-dagars gratis provperiod nu!</span>
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex items-center gap-2">
              <Link to="/auth">
                <Button 
                  variant="secondary"
                  size="sm"
                  className="shadow-md hover:shadow-lg transition-shadow"
                >
                  Starta gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              
              {/* Dismiss button */}
              <button
                onClick={handleDismiss}
                className="p-2 rounded-full hover:bg-primary-foreground/10 transition-colors"
                aria-label="Stäng"
              >
                <X className="h-4 w-4 text-primary-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
