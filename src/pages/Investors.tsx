import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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

type InvestorFormData = {
  name: string;
  email: string;
  company: string;
  phone: string;
  investment_range: string;
  message: string;
};

export default function Investors() {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
      // Manual validation
      const investorSchema = z.object({
        name: z.string().trim().min(2, t("investorFormErrorNameMin")).max(100, t("investorFormErrorNameMax")),
        email: z.string().trim().email(t("investorFormErrorEmailInvalid")).max(255, t("investorFormErrorEmailMax")),
        company: z.string().trim().max(100, t("investorFormErrorCompanyMax")).optional(),
        phone: z.string().trim().max(20, t("investorFormErrorPhoneMax")).optional(),
        investment_range: z.string().min(1, t("investorFormErrorInvestmentRange")),
        message: z.string().trim().min(10, t("investorFormErrorMessageMin")).max(2000, t("investorFormErrorMessageMax")),
      });

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

      toast.success(t("investorFormSuccess"));
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
        toast.error(t("investorFormErrorGeneral"));
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
        title={`${t("investors")} | Spotlight`}
        description={t("investorHeroDesc")}
      />
      <GlobalHeader variant="default" />
      
      <main className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">{t("investorBadgeText")}</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent leading-tight">
                {t("investorHero")} <br />{t("investorHeroLine2")}
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {t("investorHeroDesc")}
              </p>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <TrendingUp className="h-10 w-10 text-primary mb-2" />
                  <CardTitle className="text-2xl">{t("investorStat1Title")}</CardTitle>
                  <CardDescription>
                    {t("investorStat1Desc")}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <Target className="h-10 w-10 text-primary mb-2" />
                  <CardTitle className="text-2xl">{t("investorStat2Title")}</CardTitle>
                  <CardDescription>
                    {t("investorStat2Desc")}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <Users className="h-10 w-10 text-primary mb-2" />
                  <CardTitle className="text-2xl">{t("investorStat3Title")}</CardTitle>
                  <CardDescription>
                    {t("investorStat3Desc")}
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Form */}
            <Card className="max-w-2xl mx-auto border-2">
              <CardHeader>
                <CardTitle className="text-3xl">{t("investorFormTitle")}</CardTitle>
                <CardDescription className="text-base">
                  {t("investorFormDesc")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("investorFormName")}</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t("investorFormNamePlaceholder")}
                      required
                      maxLength={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t("investorFormEmail")}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t("investorFormEmailPlaceholder")}
                      required
                      maxLength={255}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">{t("investorFormCompany")}</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder={t("investorFormCompanyPlaceholder")}
                        maxLength={100}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">{t("investorFormPhone")}</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={t("investorFormPhonePlaceholder")}
                        maxLength={20}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="investment_range">{t("investorFormInvestmentRange")}</Label>
                    <Select
                      value={formData.investment_range}
                      onValueChange={handleSelectChange}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("investorFormInvestmentPlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100k-500k">{t("investorFormInvestment1")}</SelectItem>
                        <SelectItem value="500k-1m">{t("investorFormInvestment2")}</SelectItem>
                        <SelectItem value="1m-5m">{t("investorFormInvestment3")}</SelectItem>
                        <SelectItem value="5m+">{t("investorFormInvestment4")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t("investorFormMessage")}</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t("investorFormMessagePlaceholder")}
                      required
                      rows={6}
                      maxLength={2000}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.message.length}/2000 {t("investorFormCharCount")}
                    </p>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary via-primary-glow to-primary hover:opacity-90 transition-all duration-300 hover:scale-[1.02] shadow-lg font-bold text-lg h-14"
                  >
                    {isSubmitting ? t("investorFormSubmitting") : t("investorFormSubmit")}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    {t("investorFormTerms")}
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
