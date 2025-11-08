import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
const customers = ["The Daily Grind", "Blue Moon Bistro", "Urban Bar & Grill", "The Garden Café", "Brew & Co", "Corner Bakery", "Harvest Kitchen", "Tapas & Wine", "Old Town Bistro", "East Side Café", "The Harbor Bar", "Fusion Kitchen", "Central Restaurant", "Green Leaf Bistro", "Sunset Café"];
export const LogoCarousel = () => {
  const {
    t
  } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;
    const animate = () => {
      scrollPosition += scrollSpeed;
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }
      scrollContainer.scrollLeft = scrollPosition;
      requestAnimationFrame(animate);
    };
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Duplicate the array to create seamless loop
  const duplicatedCustomers = [...customers, ...customers];
  return <div className="w-full overflow-hidden py-16 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="text-center mb-12">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          {t('trustedByLocal')}
        </p>
      </div>
      
      <div ref={scrollRef} className="flex gap-12 overflow-hidden whitespace-nowrap" style={{
      scrollBehavior: 'auto',
      WebkitOverflowScrolling: 'touch'
    }}>
        {duplicatedCustomers.map((customer, index) => <div key={`${customer}-${index}`} className="inline-flex items-center justify-center px-8 py-4 min-w-[200px] group">
            <span className="transition-colors duration-300 font-display text-2xl font-bold text-foreground">
              {customer}
            </span>
          </div>)}
      </div>
    </div>;
};