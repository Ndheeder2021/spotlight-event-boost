import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Eye, MousePointerClick, Loader2 } from "lucide-react";
import { useAdminCheck } from "@/hooks/useAdminCheck";

export default function Analytics() {
  const { isAdmin, loading } = useAdminCheck();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
          <BarChart3 className="h-8 w-8" />
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground">
          Övervaka besökare och aktivitet på din webbplats
        </p>
      </div>

      <div className="grid gap-6">
        {/* Info Card */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary-glow/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Produktionsstatistik
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              För att se produktionsstatistik för din app (besökare, sidvisningar, sessioner, etc.), använd Lovable Cloud backend-panelen.
            </p>
            <p className="text-sm text-muted-foreground">
              Backend-panelen ger dig tillgång till:
            </p>
            <ul className="list-disc ml-6 space-y-2 text-sm text-muted-foreground">
              <li><strong>Besöksstatistik:</strong> Unika besökare, totala besök, sidvisningar</li>
              <li><strong>Trafikanalys:</strong> Källor, enhetstyper, geografisk fördelning</li>
              <li><strong>Användarbeteende:</strong> Sessionstid, bounce rate, populära sidor</li>
              <li><strong>Real-time data:</strong> Aktuell aktivitet på din webbplats</li>
            </ul>
          </CardContent>
        </Card>

        {/* Email Campaign Tracking Info */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary-glow/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MousePointerClick className="h-5 w-5" />
              Email Campaign Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              Alla utskickade marknadsföringsmails innehåller automatisk tracking via UTM-parametrar:
            </p>
            <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
              <li><strong>utm_source:</strong> email</li>
              <li><strong>utm_medium:</strong> marketing</li>
              <li><strong>utm_campaign:</strong> bulk_outreach</li>
            </ul>
            <div className="pt-2 border-t">
              <p className="text-muted-foreground">
                💡 <strong>Tips:</strong> Besökare som klickar på länkar i dina mail kan spåras via UTM-parametrarna i produktionsstatistiken.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Custom Analytics Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Anpassad Statistik
            </CardTitle>
            <CardDescription>
              Implementera egen dataanalys
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Om du behöver spåra specifika händelser i din app (ex. knappklick, formulärinskickningar, kampanjinteraktioner), 
              kan du implementera egen tracking genom att spara data i databasen.
            </p>
            <div className="pt-2">
              <p className="font-medium text-foreground mb-2">Exempel på custom tracking:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Kampanjgenereringar och konverteringar</li>
                <li>Email-öppningar och klick (via webhook)</li>
                <li>Lead-interaktioner</li>
                <li>Event-favoriter och delningar</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
