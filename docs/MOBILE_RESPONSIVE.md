# Mobilresponsivitet i Spotlight

Detta dokument beskriver mobiloptimeringsstrategin för Spotlight-webbplatsen.

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

## Testing Checklista

### Devices to Test
- [ ] iPhone SE (375x667)
- [ ] iPhone 12/13/14 (390x844)
- [ ] iPhone 12/13/14 Pro Max (428x926)
- [ ] Samsung Galaxy S21 (360x800)
- [ ] iPad (810x1080)
- [ ] iPad Pro (1024x1366)

### Features to Test
- [ ] Navigation (hamburger menu fungerar)
- [ ] Touch targets (alla knappar lätta att trycka)
- [ ] Form inputs (ingen auto-zoom)
- [ ] Text readability (minst 14px på små skärmar)
- [ ] Images (laddar och skalar korrekt)
- [ ] Scrolling (smooth, no jank)
- [ ] Landscape mode (content fits)
- [ ] Safe areas (content not hidden by notch)

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

## Tools för Testing

### Browser DevTools
1. Chrome DevTools (F12)
2. Device Mode (Ctrl+Shift+M)
3. Throttle network to "Fast 3G"

### Online Tools
- [Responsively](https://responsively.app/) - Test multiple devices
- [BrowserStack](https://www.browserstack.com/) - Real device testing
- [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

### Lighthouse Mobile Audit
```bash
# Run Lighthouse audit for mobile
lighthouse https://yoursite.com --preset=mobile
```

Target scores:
- Performance: >90
- Accessibility: >95
- Best Practices: >95
- SEO: >90

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
