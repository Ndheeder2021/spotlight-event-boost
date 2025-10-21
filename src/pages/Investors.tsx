import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalHeader } from "@/components/GlobalHeader";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TrendingUp, Target, Users, Sparkles } from "lucide-react";
import { z } from "zod";

const investorSchema = z.object({
  name: z.string().trim().min(2, "Namn måste vara minst 2 tecken").max(100, "Namn får vara max 100 tecken"),
  email: z.string().trim().email("Ogiltig e-postadress").max(255, "E-post får vara max 255 tecken"),
  company: z.string().trim().max(100, "Företag får vara max 100 tecken").optional(),
  phone: z.string().trim().max(20, "Telefon får vara max 20 tecken").optional(),
  investment_range: z.string().min(1, "Välj ett investeringsintervall"),
  message: z.string().trim().min(10, "Meddelande måste vara minst 10 tecken").max(2000, "Meddelande får vara max 2000 tecken"),
});

type InvestorFormData = z.infer<typeof investorSchema>;

export default function Investors() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<InvestorFormData>({
    name: "",
    email: "",
    company: "",
    phone: "",
    investment_range: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = investorSchema.parse(formData);
      setIsSubmitting(true);

      const { error } = await supabase
        .from("investor_applications")
        .insert([{
          name: validatedData.name,
          email: validatedData.email,
          company: validatedData.company || null,
          phone: validatedData.phone || null,
          investment_range: validatedData.investment_range,
          message: validatedData.message,
        }]);

      if (error) throw error;

      toast.success("Tack för ditt intresse! Vi återkommer inom kort.");
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        investment_range: "",
        message: "",
      });
      
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        toast.error("Något gick fel. Försök igen.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      investment_range: value,
    }));
  };

  return (
    <>
      <SEO 
        title="Investera i Spotlight | Investerings möjligheter"
        description="Bli en del av Spotlights tillväxtresa. Upptäck investeringsmöjligheter i den ledande AI-drivna marknadsföringsplattformen för lokala företag."
      />
      <GlobalHeader variant="default" />
      
      <main className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Investeringsmöjligheter</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent leading-tight">
                Investera i framtidens <br />marknadsföring
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Bli en del av Spotlights tillväxtresa och hjälp oss revolutionera hur lokala företag når sina kunder genom AI-driven marknadsföring.
              </p>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <TrendingUp className="h-10 w-10 text-primary mb-2" />
                  <CardTitle className="text-2xl">Snabb tillväxt</CardTitle>
                  <CardDescription>
                    Expanderar snabbt inom den nordiska marknaden
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <Target className="h-10 w-10 text-primary mb-2" />
                  <CardTitle className="text-2xl">Beprövad modell</CardTitle>
                  <CardDescription>
                    Validerad affärsmodell med återkommande intäkter
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <Users className="h-10 w-10 text-primary mb-2" />
                  <CardTitle className="text-2xl">Stor marknad</CardTitle>
                  <CardDescription>
                    Miljontals små och medelstora företag är vår målgrupp
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Form */}
            <Card className="max-w-2xl mx-auto border-2">
              <CardHeader>
                <CardTitle className="text-3xl">Ansök om investeringsmöjlighet</CardTitle>
                <CardDescription className="text-base">
                  Fyll i formuläret nedan så återkommer vi med mer information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Namn *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ditt fullständiga namn"
                      required
                      maxLength={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-post *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="din@email.com"
                      required
                      maxLength={255}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Företag</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Ditt företag (valfritt)"
                        maxLength={100}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+46 70 123 45 67"
                        maxLength={20}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="investment_range">Investeringsintervall *</Label>
                    <Select
                      value={formData.investment_range}
                      onValueChange={handleSelectChange}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Välj ett intervall" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100k-500k">100k - 500k SEK</SelectItem>
                        <SelectItem value="500k-1m">500k - 1M SEK</SelectItem>
                        <SelectItem value="1m-5m">1M - 5M SEK</SelectItem>
                        <SelectItem value="5m+">5M+ SEK</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Meddelande *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Berätta varför du är intresserad av att investera i Spotlight..."
                      required
                      rows={6}
                      maxLength={2000}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.message.length}/2000 tecken
                    </p>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary via-primary-glow to-primary hover:opacity-90 transition-all duration-300 hover:scale-[1.02] shadow-lg font-bold text-lg h-14"
                  >
                    {isSubmitting ? "Skickar..." : "Skicka ansökan"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Genom att skicka in detta formulär godkänner du att vi kontaktar dig angående investeringsmöjligheter.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
