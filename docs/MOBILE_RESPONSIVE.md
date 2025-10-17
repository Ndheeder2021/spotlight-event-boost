# Mobilresponsivitet i Spotlight

Detta dokument beskriver mobiloptimeringsstrategin för Spotlight-webbplatsen.

## Innehållsförteckning
1. [Implementerade optimeringar](#implementerade-optimeringar)
2. [Breakpoints](#breakpoints)
3. [Fullständig Guide](#fullständig-guide)
4. [Testing Checklista](#testing-checklista)
5. [Common Issues & Solutions](#common-issues--solutions)
6. [Best Practices](#best-practices)
7. [Performance Optimering](#performance-optimering)
8. [Tools för Testing](#tools-för-testing)
9. [Future Improvements](#future-improvements)

## Implementerade optimeringar

### 1. Touch Targets (Pekområden)
Alla interaktiva element följer WCAG 2.1 AA-standarder:
- **Minimum touch target**: 44x44px (iOS guideline)
- **Rekommenderad touch target**: 48x48px (Android guideline)
- **Spacing mellan touch targets**: minst 8px

#### Implementering
```css
/* Alla knappar och länkar */
button, a[role="button"] {
  min-height: 44px;
  min-width: 44px;
}

/* Mobil-specifika knappar */
@media (max-width: 768px) {
  button:not(.btn-icon-only) {
    padding: 0.75rem 1.25rem;
  }
}
```

### 2. Textstorlekar
- **Base font size**: 16px (förhindrar auto-zoom på iOS)
- **text-xs på mobil**: 13px istället för 12px
- **Rubriker**: Responsiva storlekar med Tailwind breakpoints

```tsx
// Hero heading
<h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
```

### 3. Viewport & Meta Tags
```html
<meta 
  name="viewport" 
  content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover" 
/>
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="format-detection" content="telephone=no" />
```

**Förklaring:**
- `maximum-scale=5.0`: Tillåter zoom men begränsar den
- `user-scalable=yes`: Användare kan zooma för tillgänglighet
- `viewport-fit=cover`: Hanterar notched devices (iPhone X+)
- `format-detection`: Förhindrar automatisk telefonlänk-konvertering

### 4. Safe Areas (iPhone X+)
```css
@supports (padding: max(0px)) {
  body {
    padding-left: max(0px, env(safe-area-inset-left));
    padding-right: max(0px, env(safe-area-inset-right));
  }
}
```

### 5. Input Fields
```css
input, textarea, select {
  min-height: 48px;
  font-size: 16px; /* Förhindrar zoom på iOS */
}
```

### 6. Mobile Navigation
- **Hamburger menu**: 44x44px på small phones, 40x40px på tablets
- **Menu items**: 56px höjd med tydlig padding
- **Spacing**: 8px mellan items för att förhindra felklick

### 7. Performance
```css
/* Snabbare animationer på mobil */
@media (max-width: 768px) {
  * {
    animation-duration: 0.3s !important;
    transition-duration: 0.3s !important;
  }
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}
```

## Breakpoints

### Tailwind Breakpoints
```
sm:  640px  - Small phones landscape
md:  768px  - Tablets portrait
lg:  1024px - Tablets landscape / small laptops
xl:  1280px - Laptops
2xl: 1536px - Desktop
```

### Custom Breakpoints
```css
/* Very small phones */
@media (max-width: 374px) { }

/* Landscape phones */
@media (max-width: 896px) and (orientation: landscape) { }

/* Tablets */
@media (min-width: 769px) and (max-width: 1024px) { }
```

## Fullständig Guide

### Steg 1: Planering och Design
**Innan du börjar koda:**

1. **Identifiera breakpoints**
   - Analysera Google Analytics för att se vilka enhetsstorlekar dina användare har
   - Fokusera på mobil först (375px - 428px)
   - Tablet (768px - 1024px)
   - Desktop (1280px+)

2. **Definiera mobile-specific patterns**
   - Navigation: Hamburger menu eller bottom navigation?
   - Content layout: Single column eller adapted grid?
   - Forms: Full-width eller max-width med centering?

3. **Touch interaction patterns**
   - Swipe gestures för carousels
   - Pull-to-refresh (om relevant)
   - Long-press context menus

### Steg 2: Implementera Mobile-First CSS

**Base styles (gäller alla enheter):**
```css
/* Mobile-first (320px+) */
.container {
  padding: 1rem;
  max-width: 100%;
}

.heading {
  font-size: 1.5rem;
  line-height: 1.2;
}

.button {
  width: 100%;
  padding: 0.75rem 1rem;
  min-height: 48px;
}
```

**Progressive enhancement för större skärmar:**
```css
/* Tablet (768px+) */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
    max-width: 720px;
    margin: 0 auto;
  }
  
  .button {
    width: auto;
    min-width: 120px;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    padding: 3rem;
  }
  
  .heading {
    font-size: 2.5rem;
  }
}
```

### Steg 3: React Component Patterns

**Responsive hook:**
```tsx
// hooks/useMediaQuery.ts
import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

// Usage
const isMobile = useMediaQuery('(max-width: 768px)');
```

**Conditional rendering:**
```tsx
// components/ResponsiveNav.tsx
import { useMediaQuery } from '@/hooks/useMediaQuery';

export const ResponsiveNav = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return isMobile ? <MobileNav /> : <DesktopNav />;
};
```

**Responsive component variations:**
```tsx
// components/EventCard.tsx
export const EventCard = ({ event }: Props) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <Card className={cn(
      "overflow-hidden",
      isMobile ? "mobile-stack" : "flex"
    )}>
      <OptimizedImage
        src={event.image}
        className={cn(
          isMobile ? "w-full h-48" : "w-64 h-auto"
        )}
      />
      <div className={cn(
        "p-4",
        isMobile ? "space-y-2" : "space-y-4"
      )}>
        <h3 className="text-lg md:text-xl">{event.title}</h3>
        <p className="text-sm md:text-base">{event.description}</p>
      </div>
    </Card>
  );
};
```

### Steg 4: Form Optimization

**Mobile-friendly forms:**
```tsx
// components/forms/MobileForm.tsx
export const MobileForm = () => {
  return (
    <form className="space-y-4">
      {/* Full-width inputs på mobil */}
      <Input
        type="email"
        placeholder="Din email"
        className="w-full min-h-[48px] text-base"
        autoComplete="email"
        inputMode="email"
      />
      
      {/* Numeric keyboard för telefonnummer */}
      <Input
        type="tel"
        placeholder="Telefonnummer"
        className="w-full min-h-[48px] text-base"
        inputMode="numeric"
        pattern="[0-9]*"
      />
      
      {/* Select med stor touch target */}
      <Select>
        <SelectTrigger className="min-h-[48px]">
          <SelectValue placeholder="Välj kategori" />
        </SelectTrigger>
      </Select>
      
      {/* Submit button */}
      <Button 
        type="submit"
        className="w-full min-h-[48px] mobile-touch-target"
      >
        Skicka
      </Button>
    </form>
  );
};
```

### Steg 5: Image & Media Optimization

**Responsive images:**
```tsx
// components/OptimizedImage.tsx
export const ResponsiveImage = ({ src, alt }: Props) => {
  return (
    <picture>
      {/* WebP format för modern browsers */}
      <source
        srcSet={`${src}-mobile.webp 400w, ${src}-tablet.webp 800w, ${src}-desktop.webp 1200w`}
        type="image/webp"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      
      {/* Fallback till JPEG */}
      <img
        src={`${src}-mobile.jpg`}
        srcSet={`${src}-mobile.jpg 400w, ${src}-tablet.jpg 800w, ${src}-desktop.jpg 1200w`}
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        alt={alt}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
};
```

### Steg 6: Touch Gestures

**Swipeable carousel:**
```tsx
// components/SwipeableCarousel.tsx
import { useState, useRef } from 'react';

export const SwipeableCarousel = ({ items }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;
    
    if (swipeDistance > minSwipeDistance && currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (swipeDistance < -minSwipeDistance && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };
  
  return (
    <div
      className="overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex transition-transform duration-300"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <div key={index} className="w-full flex-shrink-0">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};
```

## Testing Checklista

### Devices to Test
- [ ] iPhone SE (375x667)
- [ ] iPhone 12/13/14 (390x844)
- [ ] iPhone 12/13/14 Pro Max (428x926)
- [ ] Samsung Galaxy S21 (360x800)
- [ ] iPad (810x1080)
- [ ] iPad Pro (1024x1366)

### Features to Test
- [ ] **Navigation**
  - [ ] Hamburger menu öppnas/stängs smooth
  - [ ] Alla meny-länkar fungerar
  - [ ] Submenu expanderar korrekt
  - [ ] Back-button fungerar i all navigation
  
- [ ] **Touch Targets**
  - [ ] Alla knappar är minst 44x44px
  - [ ] Spacing mellan knappar minst 8px
  - [ ] Länkar går att trycka på utan att zooma
  - [ ] Checkboxes/radio buttons har stora hitboxes
  
- [ ] **Forms**
  - [ ] Ingen auto-zoom vid focus (16px font-size)
  - [ ] Rätt keyboard layout (numeric, email, etc.)
  - [ ] Labels är synliga och tydliga
  - [ ] Error messages syns under inputs
  - [ ] Submit button är tillgänglig (inte dold av keyboard)
  
- [ ] **Typography**
  - [ ] Minst 14px body text på mobil
  - [ ] Line-height minst 1.5 för läsbarhet
  - [ ] Headings skalas korrekt per breakpoint
  - [ ] Kontrast minst 4.5:1 (WCAG AA)
  
- [ ] **Images & Media**
  - [ ] Bilder laddar med lazy loading
  - [ ] WebP format med fallback
  - [ ] Inga layout shifts vid laddning
  - [ ] Videos pausas när inte synliga
  - [ ] Alt-text på alla bilder
  
- [ ] **Scrolling & Performance**
  - [ ] Smooth scrolling utan jank
  - [ ] Ingen horisontell scroll
  - [ ] Fixed headers fungerar
  - [ ] Pull-to-refresh inte i konflikt med scroll
  - [ ] 60fps animations
  
- [ ] **Orientation**
  - [ ] Content fits i landscape mode
  - [ ] Navigation fungerar i båda riktningar
  - [ ] Modals/dialogs anpassas till höjd
  - [ ] Keyboard döljer inte viktigt content
  
- [ ] **Safe Areas (iPhone X+)**
  - [ ] Content inte dold av notch
  - [ ] Bottom navigation över home indicator
  - [ ] Padding på sides för curved edges
  
- [ ] **Accessibility**
  - [ ] ARIA-labels på alla interaktiva element
  - [ ] Focus states synliga
  - [ ] Skip-to-content länk
  - [ ] Kontrastkontroller passerar WCAG AA
  - [ ] Screen reader fungerar korrekt
  
- [ ] **Network Conditions**
  - [ ] Fungerar på 3G (throttle network)
  - [ ] Offline fallbacks visas
  - [ ] Loading states är tydliga
  - [ ] Timeout-hantering fungerar
  
- [ ] **Browser Compatibility**
  - [ ] Safari iOS (senaste + 1 version bakåt)
  - [ ] Chrome Android (senaste version)
  - [ ] Samsung Internet (om relevant)

## Common Issues & Solutions

### Problem: Auto-zoom när man klickar på input
**Solution**: Sätt font-size till minst 16px
```css
input {
  font-size: 16px;
}
```

### Problem: Knappar för små att trycka på
**Solution**: Använd mobile-touch-target klass
```tsx
<button className="mobile-touch-target">
```

### Problem: Horisontell scroll
**Solution**: 
```css
body {
  overflow-x: hidden;
}

/* Kontrollera att ingen content är bredare än viewport */
* {
  max-width: 100%;
}
```

### Problem: Layout shift vid laddning
**Solution**: Ange width/height på bilder
```tsx
<OptimizedImage 
  width={800} 
  height={600}
  // ...
/>
```

### Problem: Knappar fungerar inte i bottom sheet/modal
**Solution**: Z-index och touch-action
```css
.modal-overlay {
  z-index: 9998;
  touch-action: none;
}

.modal-content {
  z-index: 9999;
  touch-action: auto;
}
```

### Problem: Fixed header hoppar vid scroll
**Solution**: Använd transform istället för position fixed
```css
.header {
  position: sticky;
  top: 0;
  transform: translateZ(0); /* Trigger GPU acceleration */
  will-change: transform;
}
```

### Problem: Bilder för stora för mobile
**Solution**: Använd object-fit och max-width
```tsx
<img 
  src={src}
  className="w-full h-auto max-w-full object-cover"
  style={{ maxHeight: '70vh' }}
/>
```

### Problem: Dropdown menus går utanför skärmen
**Solution**: Auto-positioning med Radix UI
```tsx
<DropdownMenu>
  <DropdownMenuContent 
    align="end"
    sideOffset={5}
    className="w-[calc(100vw-2rem)] max-w-xs"
  >
    {/* Content */}
  </DropdownMenuContent>
</DropdownMenu>
```

### Problem: Touch events inte responsive
**Solution**: Använd pointer events istället för mouse events
```tsx
// ❌ Fungerar inte bra på touch
<div onClick={handleClick} onMouseEnter={handleHover}>

// ✅ Fungerar på både mouse och touch
<div 
  onClick={handleClick}
  onPointerEnter={handleHover}
  onPointerDown={handlePress}
>
```

### Problem: Slow scroll performance
**Solution**: Använd CSS containment
```css
.scroll-container {
  overflow-y: auto;
  overscroll-behavior-y: contain;
  -webkit-overflow-scrolling: touch;
}

.list-item {
  contain: layout style paint;
}
```

## Best Practices

### 1. Mobile-First Approach
Designa för mobil först, lägg sedan till desktop-funktioner:
```tsx
<div className="p-4 md:p-6 lg:p-8">
```

### 2. Conditional Rendering
Visa olika UI för mobil vs desktop när det behövs:
```tsx
{isMobile ? <MobileMenu /> : <DesktopNav />}
```

### 3. Touch-Friendly Spacing
```tsx
// ✅ Bra spacing för mobil
<div className="space-y-4 md:space-y-6">

// ❌ För tätt på mobil
<div className="space-y-1">
```

### 4. Responsive Typography
```tsx
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
```

### 5. Image Optimization
- Använd `OptimizedImage` komponent
- Lazy load bilder below-the-fold
- Priority load hero-bilder
- WebP format med JPEG fallback
- Responsive srcset för olika skärmstorlekar

### 6. Performance Budget
Sätt gränser för mobile performance:
```
- First Contentful Paint: < 1.8s
- Largest Contentful Paint: < 2.5s
- Total Blocking Time: < 200ms
- Cumulative Layout Shift: < 0.1
- Time to Interactive: < 3.8s
```

### 7. Offline Support (PWA)
```tsx
// Service Worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
```

### 8. Gesture Patterns
- Swipe för navigation i carousels
- Pull-to-refresh för uppdatering
- Long-press för context menus
- Pinch-to-zoom för bilder (när relevant)

### 9. Dark Mode Support
```tsx
// Respektera system preferences
<ThemeProvider defaultTheme="system">
  <App />
</ThemeProvider>
```

### 10. Loading States
```tsx
// Skeleton screens för bättre UX
{isLoading ? (
  <Skeleton className="h-24 w-full" />
) : (
  <EventCard event={event} />
)}
```

## Performance Optimering

### Code Splitting
```tsx
// Lazy load routes
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Calendar = lazy(() => import('./pages/Calendar'));

<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/calendar" element={<Calendar />} />
  </Routes>
</Suspense>
```

### Bundle Size Optimization
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
});
```

### Image Compression
```bash
# Optimera bilder före deployment
npx @squoosh/cli --resize '{width: 800}' --webp auto src/assets/*.jpg
```

### Font Optimization
```css
/* Preload critical fonts */
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>

/* Font display strategy */
@font-face {
  font-family: 'Inter';
  font-display: swap; /* Visa fallback font direkt */
  src: url('/fonts/inter.woff2') format('woff2');
}
```

### Reduce JavaScript Execution
```tsx
// Debounce expensive operations
import { useDebouncedCallback } from 'use-debounce';

const debouncedSearch = useDebouncedCallback(
  (value) => {
    performSearch(value);
  },
  500 // Wait 500ms after user stops typing
);
```

### Cache Strategy
```typescript
// API caching med React Query
const { data } = useQuery({
  queryKey: ['events'],
  queryFn: fetchEvents,
  staleTime: 5 * 60 * 1000, // 5 minuter
  cacheTime: 10 * 60 * 1000, // 10 minuter
});
```

## Tools för Testing

### Browser DevTools
1. **Chrome DevTools** (F12)
   - Device Mode (Ctrl+Shift+M)
   - Network throttling: "Fast 3G", "Slow 3G"
   - Performance profiling
   - Coverage tool (se oanvänd CSS/JS)

2. **Firefox Developer Tools**
   - Responsive Design Mode
   - Network Monitor
   - Performance tools

3. **Safari Web Inspector** (för iOS testing)
   - Responsive Design Mode
   - Debugga via USB-ansluten iPhone

### Mobile Testing Tools

#### Real Device Testing
- **BrowserStack** - Test på riktiga enheter i molnet
- **Sauce Labs** - Automated mobile testing
- **Physical devices** - Bygg ett device lab med gamla telefoner

#### Emulators & Simulators
```bash
# iOS Simulator (kräver macOS + Xcode)
open -a Simulator

# Android Emulator (kräver Android Studio)
emulator -avd Pixel_5_API_30
```

#### Remote Debugging
```bash
# Chrome DevTools för Android
chrome://inspect

# Safari för iOS (via macOS)
Safari > Develop > [Device Name]
```

### Automated Testing

#### Visual Regression Testing
```bash
# Percy.io för screenshot comparison
npm install --save-dev @percy/cli
npx percy snapshot snapshots/
```

#### Performance Testing
```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun --collect.numberOfRuns=3
```

#### Accessibility Testing
```bash
# axe-core för a11y testing
npm install --save-dev @axe-core/playwright
```

### Online Tools
- [Responsively App](https://responsively.app/) - Test multiple devices samtidigt
- [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly) - SEO mobile check
- [PageSpeed Insights](https://pagespeed.web.dev/) - Core Web Vitals
- [WebPageTest](https://www.webpagetest.org/) - Detaljerad performance analysis
- [GTmetrix](https://gtmetrix.com/) - Performance scoring
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Audit tool

### Lighthouse Mobile Audit
```bash
# Run Lighthouse audit för mobile
lighthouse https://yoursite.com --preset=mobile --view

# Med custom config
lighthouse https://yoursite.com \
  --preset=mobile \
  --throttling.cpuSlowdownMultiplier=4 \
  --output=html \
  --output-path=./report.html
```

**Target scores för production:**
- Performance: >90
- Accessibility: >95
- Best Practices: >95
- SEO: >90
- PWA: >80 (om applicable)

### Testing Workflow

#### Daily Development
1. Chrome DevTools Device Mode
2. Test på egen phone via localhost
3. Lighthouse audit lokalt

#### Before Deploy
1. Test på BrowserStack (iOS + Android)
2. Lighthouse CI in pipeline
3. Visual regression tests
4. Manual QA på key devices

#### After Deploy
1. Real User Monitoring (RUM)
2. Error tracking (Sentry)
3. Performance monitoring (Web Vitals)
4. A/B testing results

## Future Improvements

### PWA (Progressive Web App)
- Installable på hemskärm
- Offline functionality
- Push notifications

### Responsive Images
- WebP format med fallbacks
- Multiple sizes via srcset
- Art direction med `<picture>`

### Haptic Feedback
```tsx
// För native apps med Capacitor
import { Haptics } from '@capacitor/haptics';

const handleClick = async () => {
  await Haptics.impact({ style: 'light' });
  // ...
};
```
