import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Send, Users, CheckCircle, XCircle, Loader2, Upload, Download } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAdminCheck } from "@/hooks/useAdminCheck";

export default function BulkEmail() {
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  const location = useLocation();
  const [emails, setEmails] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Load emails from navigation state if provided
  useEffect(() => {
    if (location.state?.emails && Array.isArray(location.state.emails)) {
      const importedEmails = location.state.emails.filter((e: string) => e && e.includes('@'));
      if (importedEmails.length > 0) {
        setEmails(importedEmails.join('\n'));
        toast({
          title: "E-postadresser importerade!",
          description: `${importedEmails.length} e-postadresser laddades från Lead Finder`,
        });
      }
    }
  }, [location.state, toast]);

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const parseEmails = (text: string): string[] => {
    // Split by newlines, commas, or spaces and filter out empty strings
    return text
      .split(/[\n,\s]+/)
      .map(email => email.trim())
      .filter(email => email.length > 0 && email.includes("@"));
  };

  const parseCSV = (csvText: string): string[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
    const emailIndex = headers.findIndex(h => h === 'email');

    if (emailIndex === -1) {
      toast({
        title: "Ogiltig CSV",
        description: "CSV-filen måste ha en 'email' kolumn",
        variant: "destructive",
      });
      return [];
    }

    const emails: string[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const email = values[emailIndex];
      if (email && email.includes('@')) {
        emails.push(email);
      }
    }

    return emails;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Ogiltig fil",
        description: "Vänligen ladda upp en CSV-fil",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const text = await file.text();
      const parsedEmails = parseCSV(text);

      if (parsedEmails.length === 0) {
        toast({
          title: "Inga emails hittades",
          description: "Kunde inte hitta några giltiga email-adresser i CSV-filen",
          variant: "destructive",
        });
        return;
      }

      // Add to existing emails or replace
      const currentEmails = emails ? emails.split('\n').filter(e => e.trim()) : [];
      const allEmails = [...currentEmails, ...parsedEmails];
      const uniqueEmails = Array.from(new Set(allEmails));
      
      setEmails(uniqueEmails.join('\n'));

      toast({
        title: "CSV uppladdad!",
        description: `${parsedEmails.length} email-adresser importerades`,
      });
    } catch (error) {
      console.error('Error parsing CSV:', error);
      toast({
        title: "Fel vid uppladdning",
        description: "Kunde inte läsa CSV-filen",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const downloadExampleCSV = () => {
    const exampleCSV = `City,Business Name,Website,Email,Category
Stockholm,Grand Hotel,https://grandhotel.se,info@grandhotel.se,hotel
Stockholm,Restaurant Mathias Dahlgren,https://restaurang.se,contact@restaurang.se,restaurant
Gothenburg,Clarion Hotel Post,https://clarionpost.se,info@clarionpost.se,hotel`;

    const blob = new Blob([exampleCSV], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'example-leads.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Exempel nedladdad",
      description: "Använd denna som mall för dina CSV-filer",
    });
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
              Ladda upp CSV-fil eller ange e-postadresser manuellt
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* CSV Upload Section */}
            <div className="glass-card p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm mb-1">Ladda upp CSV-fil</h4>
                  <p className="text-xs text-muted-foreground">
                    Importera leads från CSV med "email" kolumn
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadExampleCSV}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Exempel CSV
                </Button>
              </div>
              
              <div className="flex gap-2">
                <label className="flex-1">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    disabled={isUploading}
                    onClick={(e) => {
                      e.preventDefault();
                      (e.currentTarget.previousElementSibling as HTMLInputElement)?.click();
                    }}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Laddar upp...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Välj CSV-fil
                      </>
                    )}
                  </Button>
                </label>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">eller ange manuellt</span>
              </div>
            </div>

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
              <strong>Ämnesrad:</strong> "Öka gästflödet vid lokala evenemang – Spotlight Events"
            </div>
            <div>
              <strong>Innehåll:</strong>
              <ul className="list-disc ml-6 mt-2 space-y-1 text-muted-foreground">
                <li>Personlig hälsning med automatiskt företagsnamn från emailadressen</li>
                <li>Presentation av Nabeel Heeder och Spotlight Events</li>
                <li>Beskrivning av hur plattformen hjälper till med event-marknadsföring</li>
                <li>Call-to-action för kort introduktion</li>
                <li>Kontaktinformation och signatur</li>
                <li>Professionell design med Spotlight Events logotyp</li>
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
