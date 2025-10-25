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
    <section className="py-24 bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="border-primary/30 bg-primary/5 mb-4">
              {t('roiCalculator')}
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              {t('calculateRoi')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('roiDescription')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  {t('yourNumbers')}
                </CardTitle>
                <CardDescription>
                  {t('adjustValues')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Events per month */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="events" className="text-base font-semibold">
                      {t('eventsPerMonth')}
                    </Label>
                    <Badge variant="secondary" className="text-lg font-bold">
                      {eventsPerMonth}
                    </Badge>
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
                  <p className="text-xs text-muted-foreground">
                    {t('averageEvents')}
                  </p>
                </div>

                {/* Hours per campaign */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hours" className="text-base font-semibold">
                      {t('hoursPerCampaign')}
                    </Label>
                    <Badge variant="secondary" className="text-lg font-bold">
                      {hoursPerCampaign}h
                    </Badge>
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
                  <p className="text-xs text-muted-foreground">
                    {t('timeSpentManual')}
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t('withSpotlight')}</span>
                    <span className="font-semibold text-primary">{t('minPerCampaign')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card className="border-2 border-primary/20 shadow-lg bg-gradient-to-br from-primary/5 to-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  {t('yourRoi')}
                </CardTitle>
                <CardDescription>
                  {t('savingsPerMonth')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Time Saved */}
                <div className="p-4 rounded-lg bg-background border border-border/50">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">{t('timeSaved')}</p>
                      <p className="text-3xl font-bold text-primary">
                        {totalTimeSaved.toFixed(1)}h
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {timeSavedPerCampaign.toFixed(1)}h {t('perCampaign')} × {eventsPerMonth} {t('events')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Money Saved */}
                <div className="p-4 rounded-lg bg-background border border-border/50">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="rounded-full bg-primary/10 p-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">{t('valueOfTime')}</p>
                      <p className="text-3xl font-bold text-primary">
                        {isSwedish ? `${moneySavedOnTime.toFixed(0)} kr` : `$${moneySavedOnTime.toFixed(0)}`}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {totalTimeSaved.toFixed(1)}h × {isSwedish ? `${hourlyRate} kr` : `$${hourlyRate}`}{t('perHour')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Net Savings */}
                <div className="p-4 rounded-lg bg-primary/10 border-2 border-primary/30">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/20 p-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">{t('netSavingsMonth')}</p>
                      <p className="text-4xl font-bold text-primary mb-1">
                        {isSwedish ? `${netSavings.toFixed(0)} kr` : `$${netSavings.toFixed(0)}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t('afterSpotlightCost')}
                      </p>
                      <div className="mt-3 pt-3 border-t border-primary/20">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">ROI:</span>
                          <Badge variant="default" className="text-lg font-bold">
                            +{roiPercentage}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-4">
                  <Link to="/auth" className="block">
                    <Button variant="animated" size="xl" className="w-full">
                      {t('startFreeAndSave')}
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    {t('freeTrialNoBind')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional context */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              {t('roiDisclaimer')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
