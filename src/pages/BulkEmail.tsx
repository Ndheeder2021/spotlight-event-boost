import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Send, Users, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function BulkEmail() {
  const [emails, setEmails] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const parseEmails = (text: string): string[] => {
    // Split by newlines, commas, or spaces and filter out empty strings
    return text
      .split(/[\n,\s]+/)
      .map(email => email.trim())
      .filter(email => email.length > 0 && email.includes("@"));
  };

  const handleSendEmails = async () => {
    const emailList = parseEmails(emails);

    if (emailList.length === 0) {
      toast({
        title: "Inga e-postadresser",
        description: "Vänligen ange minst en giltig e-postadress.",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emailList.filter(email => !emailRegex.test(email));
    
    if (invalidEmails.length > 0) {
      toast({
        title: "Ogiltiga e-postadresser",
        description: `Följande adresser är ogiltiga: ${invalidEmails.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke("send-bulk-marketing-email", {
        body: {
          emails: emailList,
        },
      });

      if (error) throw error;

      setResults(data);

      toast({
        title: "E-post skickade!",
        description: `${data.successCount} e-postmeddelanden skickades framgångsrikt.`,
      });

      // Clear the textarea on success
      if (data.failureCount === 0) {
        setEmails("");
      }
    } catch (error: any) {
      console.error("Error sending bulk emails:", error);
      toast({
        title: "Fel vid utskick",
        description: error.message || "Kunde inte skicka e-postmeddelanden.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const emailList = parseEmails(emails);
  const validEmailCount = emailList.length;

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
          <Mail className="h-8 w-8" />
          Marknadsföringsutskick
        </h1>
        <p className="text-muted-foreground">
          Skicka kampanjmail om 2 veckors gratis provperiod till potentiella kunder
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>E-postadresser</CardTitle>
            <CardDescription>
              Ange e-postadresser separerade med nyrad, kommatecken eller mellanslag
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="exempel@företag.se&#10;kontakt@företag.com&#10;info@företag.se"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              rows={12}
              className="font-mono text-sm"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{validEmailCount} giltiga e-postadresser</span>
              </div>
              
              <Button
                onClick={handleSendEmails}
                disabled={isSending || validEmailCount === 0}
                size="lg"
              >
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Skickar...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Skicka till {validEmailCount} mottagare
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {results && (
          <Card>
            <CardHeader>
              <CardTitle>Resultat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Alert>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    <strong>{results.successCount}</strong> skickade
                  </AlertDescription>
                </Alert>
                
                {results.failureCount > 0 && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>{results.failureCount}</strong> misslyckades
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {results.results && results.results.some((r: any) => !r.success) && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2 text-sm">Misslyckade e-postadresser:</h4>
                  <ul className="space-y-1">
                    {results.results
                      .filter((r: any) => !r.success)
                      .map((r: any, idx: number) => (
                        <li key={idx} className="text-sm text-muted-foreground">
                          {r.email} - {r.error}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Om kampanjen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <strong>Ämnesrad:</strong> "Prova EventRadar gratis i 2 veckor – Ingen bindningstid"
            </div>
            <div>
              <strong>Innehåll:</strong>
              <ul className="list-disc ml-6 mt-2 space-y-1 text-muted-foreground">
                <li>Personlig hälsning</li>
                <li>Erbjudande om 2 veckors gratis test</li>
                <li>Beskrivning av funktioner (AI-kampanjer, eventspaning, mallar, analys)</li>
                <li>Call-to-action knapp för registrering</li>
                <li>Professionell design med gradient och ikoner</li>
              </ul>
            </div>
            <div className="pt-2 border-t">
              <p className="text-muted-foreground">
                💡 <strong>Tips:</strong> E-posten skickas i omgångar om 10 åt gången med paus mellan varje omgång för att undvika rate limits.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
