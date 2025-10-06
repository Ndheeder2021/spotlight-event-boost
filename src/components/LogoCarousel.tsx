import { useEffect, useRef } from "react";

const customers = [
  "Café Bröd & Salt",
  "Restaurant Smak",
  "Urban Bar & Grill",
  "Bistro Kungsholmen",
  "Fika & Co",
  "Södermalm Bageri",
  "Norrlands Kök",
  "Vasastan Tapas",
  "Gamla Stan Bistro",
  "Östermalm Café",
  "Göteborg Bar",
  "Malmö Kitchen",
  "Uppsala Restaurang",
  "Lund Bistro",
  "Helsingborg Café"
];

export const LogoCarousel = () => {
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

  return (
    <div className="w-full overflow-hidden py-16 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="text-center mb-12">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Betrodd av lokala företag över hela Sverige
        </p>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex gap-12 overflow-hidden whitespace-nowrap"
        style={{ 
          scrollBehavior: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {duplicatedCustomers.map((customer, index) => (
          <div
            key={`${customer}-${index}`}
            className="inline-flex items-center justify-center px-8 py-4 min-w-[200px] group"
          >
            <span className="text-2xl font-bold text-muted-foreground/70 group-hover:text-foreground transition-colors duration-300 font-display">
              {customer}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
