import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, DollarSign, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const ROICalculator = () => {
  const [eventsPerMonth, setEventsPerMonth] = useState(10);
  const [hoursPerCampaign, setHoursPerCampaign] = useState(3);

  // Calculations
  const spotlightTimePerCampaign = 0.25; // 15 minutes with Spotlight
  const hourlyRate = 50; // Average hourly rate in EUR
  const spotlightCost = 29; // Monthly cost

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
              ROI Kalkylator
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Beräkna din ROI med Spotlight
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Se hur mycket tid och pengar du kan spara genom att automatisera din eventmarknadsföring
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Dina siffror
                </CardTitle>
                <CardDescription>
                  Justera värdena för att se din potentiella ROI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Events per month */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="events" className="text-base font-semibold">
                      Antal events per månad
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
                    Genomsnittligt antal lokala events du skulle vilja marknadsföra mot
                  </p>
                </div>

                {/* Hours per campaign */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hours" className="text-base font-semibold">
                      Timmar per kampanj (manuellt)
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
                    Tid du spenderar på att hitta events, skapa kampanjtext och planera
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Med Spotlight:</span>
                    <span className="font-semibold text-primary">~15 min per kampanj</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card className="border-2 border-primary/20 shadow-lg bg-gradient-to-br from-primary/5 to-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Din ROI
                </CardTitle>
                <CardDescription>
                  Så här mycket kan du spara varje månad
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
                      <p className="text-sm text-muted-foreground mb-1">Tid sparad</p>
                      <p className="text-3xl font-bold text-primary">
                        {totalTimeSaved.toFixed(1)}h
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {timeSavedPerCampaign.toFixed(1)}h per kampanj × {eventsPerMonth} events
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
                      <p className="text-sm text-muted-foreground mb-1">Värde av sparad tid</p>
                      <p className="text-3xl font-bold text-primary">
                        €{moneySavedOnTime.toFixed(0)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {totalTimeSaved.toFixed(1)}h × €{hourlyRate}/timme
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
                      <p className="text-sm font-medium mb-1">Nettobesparing per månad</p>
                      <p className="text-4xl font-bold text-primary mb-1">
                        €{netSavings.toFixed(0)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Efter Spotlight-kostnad (€29/mån)
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
                    <Button variant="animated" size="lg" className="w-full">
                      Starta gratis & spara tid
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    14 dagars gratis provperiod • Ingen bindningstid
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional context */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              * Beräkningarna baseras på en genomsnittlig timkostnad på €{hourlyRate} och Spotlights 
              förmåga att reducera kampanjskapande från {hoursPerCampaign}h till ~15 minuter med AI-automation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
