# Bildoptimering i Spotlight

Detta dokument beskriver bildoptimeringsstrategin för Spotlight-webbplatsen.

## Implementerade optimeringar

### 1. OptimizedImage-komponent
En React-komponent som hanterar:
- ✅ Lazy loading (loading="lazy")
- ✅ Async decoding för bättre prestanda
- ✅ Blur placeholder under laddning
- ✅ Error handling med fallback
- ✅ Priority loading för above-the-fold bilder
- ✅ Responsiva dimensioner

### 2. Browser caching (.htaccess)
- Bilder: 1 år cache
- Fonts: 1 år cache
- CSS/JS: 1 månad cache
- GZIP compression aktiverad

### 3. Build optimeringar (vite.config.ts)
- Code splitting för bättre caching
- Terser minification
- CSS code splitting
- Drop console.log i production
- Optimerad chunk storlek

### 4. Preload & DNS Prefetch
- Font preloading för snabbare text-rendering
- DNS prefetch för externa resurser
- Preconnect för fonts.googleapis.com

## Användning

### Basic användning
```tsx
import { OptimizedImage } from "@/components/OptimizedImage";

<OptimizedImage
  src={imageUrl}
  alt="Beskrivning"
  width={800}
  height={600}
/>
```

### Priority (above-the-fold) bilder
```tsx
<OptimizedImage
  src={heroImage}
  alt="Hero bild"
  width={1920}
  height={1080}
  priority // Laddar omedelbart, ingen lazy loading
/>
```

### Med responsive breakpoints
```tsx
<OptimizedImage
  src={imageUrl}
  alt="Beskrivning"
  className="w-full md:w-1/2 lg:w-1/3"
  width={1200}
  height={800}
/>
```

## Framtida förbättringar

### WebP & AVIF format
För optimal prestanda, överväg att:
1. Konvertera bilder till WebP/AVIF under build
2. Använd `<picture>` element med fallbacks
3. Integrera med CDN som Cloudinary eller ImageKit

### Responsive images med srcset
```tsx
// Exempel på framtida implementation
<OptimizedImage
  src={image}
  srcSet="image-400.webp 400w, image-800.webp 800w, image-1200.webp 1200w"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

### Image CDN integration
För produktion, överväg:
- Cloudinary för on-the-fly transformationer
- ImageKit för automatisk formatkonvertering
- Vercel/Netlify Image optimization

## Prestanda-mått

### Målsättningar
- Lighthouse Performance Score: >90
- Largest Contentful Paint (LCP): <2.5s
- First Input Delay (FID): <100ms
- Cumulative Layout Shift (CLS): <0.1

### Mätning
Använd:
1. Lighthouse i Chrome DevTools
2. WebPageTest.org
3. Google PageSpeed Insights

## Best practices

### Bildstorlekar
- Hero bilder: 1920x1080px (max)
- Card bilder: 600x400px
- Thumbnails: 300x200px
- Ikoner: SVG när möjligt

### Alt-texter
Skriv alltid beskrivande alt-texter för tillgänglighet och SEO:
```tsx
// ✅ Bra
<OptimizedImage alt="Café med gäster under musikfestival" />

// ❌ Dåligt
<OptimizedImage alt="bild" />
```

### Lazy loading
- Above-the-fold: `priority={true}`
- Below-the-fold: standard (lazy loading)

## Felsökning

### Bilder laddas inte
1. Kontrollera att sökvägen är korrekt
2. Verifiera att bilden finns i assets-mappen
3. Kolla nätverksflik i DevTools

### Långsam laddning
1. Kontrollera bildstorlek (bör vara <500KB)
2. Verifiera att lazy loading fungerar
3. Testa compression med Lighthouse

### Layout shift
1. Ange alltid width och height
2. Använd aspect-ratio CSS
3. Reservera utrymme för bilder
