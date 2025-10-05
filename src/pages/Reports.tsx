import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "lucide-react";

export default function Reports() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Rapporter</h1>
        <p className="text-muted-foreground">Översikt och statistik</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Events denna vecka</CardTitle>
            <CardDescription>Antal events inom 10km</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skapade kampanjer</CardTitle>
            <CardDescription>Senaste 30 dagarna</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifieringar</CardTitle>
            <CardDescription>Utlösta denna månad</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">0</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BarChart className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Detaljerad analys kommer snart</h3>
          <p className="text-muted-foreground text-center">
            Grafer och djupare insikter om dina kampanjer och events
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
