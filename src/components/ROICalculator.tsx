import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, DollarSign, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const ROICalculator = () => {
  const { t, i18n } = useTranslation();
  const [eventsPerMonth, setEventsPerMonth] = useState(10);
  const [hoursPerCampaign, setHoursPerCampaign] = useState(3);

  // Calculations based on language
  const isSwedish = i18n.language === 'sv';
  const currency = isSwedish ? 'kr' : '$';
  const currencySymbol = isSwedish ? '' : '$';
  const spotlightTimePerCampaign = 0.25; // 15 minutes with Spotlight
  const hourlyRate = isSwedish ? 500 : 50; // Average hourly rate (SEK/USD)
  const spotlightCost = isSwedish ? 299 : 29; // Monthly cost (SEK/USD)

  const timeSavedPerCampaign = hoursPerCampaign - spotlightTimePerCampaign;
  const totalTimeSaved = timeSavedPerCampaign * eventsPerMonth;
  const moneySavedOnTime = totalTimeSaved * hourlyRate;
  const netSavings = moneySavedOnTime - spotlightCost;
  const roiPercentage = ((netSavings / spotlightCost) * 100).toFixed(0);

  return (
    <section className="py-24 bg-gradient-to-b from-background via-primary/5 to-background relative overflow-hidden">
      {/* Hand-drawn style background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 border-2 border-primary/10 rounded-full" style={{ transform: 'rotate(-15deg)' }} />
      <div className="absolute bottom-40 right-20 w-24 h-24 border-2 border-primary/10 rounded-lg" style={{ transform: 'rotate(25deg)' }} />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header with handwritten feel */}
          <div className="text-center mb-16 relative">
            <div className="inline-block relative mb-6">
              <Badge variant="outline" className="border-primary/30 bg-primary/5 px-6 py-2 text-base" style={{ transform: 'rotate(-1deg)' }}>
                {t('roiCalculator')}
              </Badge>
              {/* Hand-drawn arrow */}
              <div className="absolute -right-16 top-1/2 -translate-y-1/2 text-primary/40 hidden lg:block" style={{ transform: 'rotate(-10deg)' }}>
                <svg width="50" height="30" viewBox="0 0 50 30" fill="none">
                  <path d="M2 15 Q 25 5, 45 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M40 8 L 48 12 L 42 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 relative inline-block">
              {t('calculateRoi')}
              {/* Underline scribble */}
              <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 300 10" fill="none" preserveAspectRatio="none">
                <path d="M2 5 Q 75 8, 150 5 T 298 5" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
              </svg>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('roiDescription')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Input Section - Sticky Note Style */}
            <div className="relative" style={{ transform: 'rotate(-0.5deg)' }}>
              {/* Tape effect at top */}
              <div className="absolute -top-4 left-8 w-20 h-8 bg-muted/40 backdrop-blur-sm" style={{ transform: 'rotate(-2deg)' }} />
              <div className="absolute -top-4 right-8 w-20 h-8 bg-muted/40 backdrop-blur-sm" style={{ transform: 'rotate(2deg)' }} />
              
              <Card className="border-2 border-border shadow-2xl bg-gradient-to-br from-card to-card/80 relative">
                {/* Corner fold effect */}
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[30px] border-t-muted/20 border-l-[30px] border-l-transparent" />
                
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-2 rounded-lg bg-primary/10 rotate-3">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <span className="relative">
                      {t('yourNumbers')}
                      {/* Highlighter effect */}
                      <span className="absolute inset-0 bg-primary/10 -z-10" style={{ transform: 'skewX(-5deg)', width: '105%' }} />
                    </span>
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    {t('adjustValues')}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-10">
                  {/* Events per month */}
                  <div className="space-y-5 relative">
                    {/* Doodle decoration */}
                    <div className="absolute -left-4 top-0 text-primary/20">
                      <svg width="20" height="20" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
                        <circle cx="10" cy="10" r="3" fill="currentColor" />
                      </svg>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="events" className="text-lg font-bold">
                        {t('eventsPerMonth')}
                      </Label>
                      <div className="relative">
                        <Badge variant="secondary" className="text-2xl font-bold px-4 py-2" style={{ transform: 'rotate(2deg)' }}>
                          {eventsPerMonth}
                        </Badge>
                        {/* Hand-drawn circle around number */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                          <ellipse cx="50" cy="50" rx="45" ry="40" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.2" />
                        </svg>
                      </div>
                    </div>
                    
                    <Slider
                      id="events"
                      min={1}
                      max={50}
                      step={1}
                      value={[eventsPerMonth]}
                      onValueChange={(value) => setEventsPerMonth(value[0])}
                      className="py-4"
                    />
                    
                    <p className="text-sm text-muted-foreground italic pl-2 border-l-2 border-primary/20">
                      {t('averageEvents')}
                    </p>
                  </div>

                  {/* Hours per campaign */}
                  <div className="space-y-5 relative">
                    {/* Doodle decoration */}
                    <div className="absolute -left-4 top-0 text-primary/20">
                      <svg width="20" height="20" viewBox="0 0 20 20">
                        <path d="M4 10 L16 10 M10 4 L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="hours" className="text-lg font-bold">
                        {t('hoursPerCampaign')}
                      </Label>
                      <div className="relative">
                        <Badge variant="secondary" className="text-2xl font-bold px-4 py-2" style={{ transform: 'rotate(-2deg)' }}>
                          {hoursPerCampaign}h
                        </Badge>
                        {/* Hand-drawn star */}
                        <svg className="absolute -top-2 -right-2 w-6 h-6 text-primary/30" viewBox="0 0 24 24">
                          <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill="currentColor" />
                        </svg>
                      </div>
                    </div>
                    
                    <Slider
                      id="hours"
                      min={0.5}
                      max={10}
                      step={0.5}
                      value={[hoursPerCampaign]}
                      onValueChange={(value) => setHoursPerCampaign(value[0])}
                      className="py-4"
                    />
                    
                    <p className="text-sm text-muted-foreground italic pl-2 border-l-2 border-primary/20">
                      {t('timeSpentManual')}
                    </p>
                  </div>

                  <div className="pt-6 border-t-2 border-dashed border-border">
                    <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg" style={{ transform: 'rotate(-0.5deg)' }}>
                      <span className="text-sm font-semibold">{t('withSpotlight')}</span>
                      <span className="font-bold text-primary text-lg">{t('minPerCampaign')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Section - Notebook Style */}
            <div className="relative" style={{ transform: 'rotate(0.5deg)' }}>
              {/* Paper clip effect */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 border-4 border-muted/60 rounded-full" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }} />
              
              <Card className="border-2 border-border shadow-2xl bg-gradient-to-br from-primary/10 via-background to-primary/5 relative overflow-hidden">
                {/* Notebook lines effect */}
                <div className="absolute inset-0 pointer-events-none opacity-5">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="w-full h-12 border-b border-primary" />
                  ))}
                </div>
                
                <CardHeader className="pb-4 relative z-10">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-2 rounded-full bg-primary/20 -rotate-12 relative">
                      <TrendingUp className="h-6 w-6 text-primary" />
                      {/* Sparkle effect */}
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
                    </div>
                    <span className="relative font-bold">
                      {t('yourRoi')}
                      {/* Exclamation marks for emphasis */}
                      <span className="text-primary ml-1">💰</span>
                    </span>
                  </CardTitle>
                  <CardDescription className="text-base mt-2 font-medium">
                    {t('savingsPerMonth')}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6 relative z-10">
                  {/* Time Saved - Post-it style */}
                  <div className="p-5 rounded-lg bg-yellow-100/90 dark:bg-yellow-900/30 border-l-4 border-yellow-500 shadow-md" style={{ transform: 'rotate(-1deg)' }}>
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-yellow-500/20 p-3 -rotate-6">
                        <Clock className="h-6 w-6 text-yellow-700 dark:text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-2">{t('timeSaved')}</p>
                        <p className="text-4xl font-black text-yellow-800 dark:text-yellow-300">
                          {totalTimeSaved.toFixed(1)}h
                        </p>
                        <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-2 italic">
                          {timeSavedPerCampaign.toFixed(1)}h {t('perCampaign')} × {eventsPerMonth} {t('events')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Money Saved - Highlight style */}
                  <div className="p-5 rounded-lg bg-green-100/90 dark:bg-green-900/30 border-l-4 border-green-500 shadow-md" style={{ transform: 'rotate(1deg)' }}>
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-green-500/20 p-3 rotate-6">
                        <DollarSign className="h-6 w-6 text-green-700 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-green-900 dark:text-green-200 mb-2">{t('valueOfTime')}</p>
                        <p className="text-4xl font-black text-green-800 dark:text-green-300">
                          {isSwedish ? `${moneySavedOnTime.toFixed(0)} kr` : `$${moneySavedOnTime.toFixed(0)}`}
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-400 mt-2 italic">
                          {totalTimeSaved.toFixed(1)}h × {isSwedish ? `${hourlyRate} kr` : `$${hourlyRate}`}{t('perHour')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Net Savings - Stamp style */}
                  <div className="relative p-6 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border-4 border-double border-primary shadow-2xl" style={{ transform: 'rotate(-0.5deg)' }}>
                    {/* Corner decorations */}
                    <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-primary/40" />
                    <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-primary/40" />
                    <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-primary/40" />
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-primary/40" />
                    
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-primary p-3 rotate-12 shadow-lg">
                        <TrendingUp className="h-7 w-7 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-bold mb-3">{t('netSavingsMonth')}</p>
                        <p className="text-5xl font-black text-primary mb-2 relative">
                          {isSwedish ? `${netSavings.toFixed(0)} kr` : `$${netSavings.toFixed(0)}`}
                          {/* Underline scribble */}
                          <svg className="absolute -bottom-1 left-0 w-full h-2" viewBox="0 0 200 5" preserveAspectRatio="none">
                            <path d="M0 2 Q 50 4, 100 2 T 200 2" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" />
                          </svg>
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          {t('afterSpotlightCost')}
                        </p>
                        <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border-2 border-dashed border-primary/30">
                          <span className="text-base font-bold">ROI:</span>
                          <Badge variant="default" className="text-2xl font-black px-4 py-2" style={{ transform: 'rotate(-2deg)' }}>
                            +{roiPercentage}%
                          </Badge>
                          {/* Arrow pointing to ROI */}
                          <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none">
                            <path d="M7 17 L17 7 M17 7 L17 17 M17 7 L7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA - Hand-drawn button style */}
                  <div className="pt-6">
                    <Link to="/auth" className="block group">
                      <div className="relative">
                        {/* Scribble border */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 60" preserveAspectRatio="none">
                          <rect x="2" y="2" width="296" height="56" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" rx="12" opacity="0.3" />
                        </svg>
                        <Button variant="animated" size="xl" className="w-full bg-gradient-to-r from-primary via-primary-glow to-primary hover:opacity-90 text-lg font-bold relative z-10">
                          <span className="relative">
                            {t('startFreeAndSave')}
                            {/* Sparkle */}
                            <span className="absolute -top-1 -right-1 text-xl animate-pulse">✨</span>
                          </span>
                          <ArrowRight className="ml-2 h-6 w-6 transition-transform duration-300 group-hover:translate-x-2" />
                        </Button>
                      </div>
                    </Link>
                    <p className="text-sm text-center text-muted-foreground mt-4 font-medium">
                      {t('freeTrialNoBind')} 🎉
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Additional context - Handwritten note style */}
          <div className="mt-16 text-center relative">
            <div className="inline-block max-w-2xl p-6 bg-muted/50 rounded-lg border-2 border-dashed border-border" style={{ transform: 'rotate(-0.5deg)' }}>
              {/* Paperclip decoration */}
              <div className="absolute -top-4 right-8 w-8 h-12 border-2 border-muted-foreground/30 rounded-full" style={{ clipPath: 'ellipse(50% 40% at 50% 30%)' }} />
              
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                * {t('roiDisclaimer')}
              </p>
              
              {/* Doodle decoration */}
              <div className="absolute -bottom-3 left-4 text-primary/20">
                <svg width="40" height="20" viewBox="0 0 40 20">
                  <path d="M2 10 Q 10 5, 20 10 T 38 10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
