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
import { TrendingUp, Target, Users, Sparkles, ArrowRight } from "lucide-react";
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

      // Submit through secure Edge Function with rate limiting
      const { data, error } = await supabase.functions.invoke(
        "submit-investor-application",
        {
          body: {
            name: validatedData.name,
            email: validatedData.email,
            company: validatedData.company || null,
            phone: validatedData.phone || null,
            investment_range: validatedData.investment_range,
            message: validatedData.message,
          },
        }
      );

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

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
              <Card className="relative overflow-hidden bg-gradient-to-br from-card via-card to-primary/5 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:blur-3xl transition-all" />
                <CardHeader className="relative">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-2xl mb-2">{t("investorStat1Title")}</CardTitle>
                  <CardDescription className="text-base">
                    {t("investorStat1Desc")}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="relative overflow-hidden bg-gradient-to-br from-card via-card to-accent/5 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl group-hover:blur-3xl transition-all" />
                <CardHeader className="relative">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Target className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-2xl mb-2">{t("investorStat2Title")}</CardTitle>
                  <CardDescription className="text-base">
                    {t("investorStat2Desc")}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="relative overflow-hidden bg-gradient-to-br from-card via-card to-primary/5 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:blur-3xl transition-all" />
                <CardHeader className="relative">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-2xl mb-2">{t("investorStat3Title")}</CardTitle>
                  <CardDescription className="text-base">
                    {t("investorStat3Desc")}
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Form */}
            <Card className="relative max-w-2xl mx-auto bg-gradient-to-br from-card via-card to-primary/5 border-2 border-primary/20 shadow-xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <CardHeader className="space-y-3">
                  <CardTitle className="text-3xl bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                    {t("investorFormTitle")}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {t("investorFormDesc")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-semibold">{t("investorFormName")}</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t("investorFormNamePlaceholder")}
                        required
                        maxLength={100}
                        className="h-12 bg-background/50 border-2 border-border hover:border-primary/50 focus:border-primary transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-semibold">{t("investorFormEmail")}</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t("investorFormEmailPlaceholder")}
                        required
                        maxLength={255}
                        className="h-12 bg-background/50 border-2 border-border hover:border-primary/50 focus:border-primary transition-colors"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company" className="font-semibold">{t("investorFormCompany")}</Label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder={t("investorFormCompanyPlaceholder")}
                          maxLength={100}
                          className="h-12 bg-background/50 border-2 border-border hover:border-primary/50 focus:border-primary transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="font-semibold">{t("investorFormPhone")}</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder={t("investorFormPhonePlaceholder")}
                          maxLength={20}
                          className="h-12 bg-background/50 border-2 border-border hover:border-primary/50 focus:border-primary transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="investment_range" className="font-semibold">{t("investorFormInvestmentRange")}</Label>
                      <Select
                        value={formData.investment_range}
                        onValueChange={handleSelectChange}
                        required
                      >
                        <SelectTrigger className="h-12 bg-background/50 border-2 border-border hover:border-primary/50 focus:border-primary transition-colors">
                          <SelectValue placeholder={t("investorFormInvestmentPlaceholder")} />
                        </SelectTrigger>
                        <SelectContent className="bg-background z-50">
                          <SelectItem value="100k-500k">{t("investorFormInvestment1")}</SelectItem>
                          <SelectItem value="500k-1m">{t("investorFormInvestment2")}</SelectItem>
                          <SelectItem value="1m-5m">{t("investorFormInvestment3")}</SelectItem>
                          <SelectItem value="5m+">{t("investorFormInvestment4")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="font-semibold">{t("investorFormMessage")}</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder={t("investorFormMessagePlaceholder")}
                        required
                        rows={6}
                        maxLength={2000}
                        className="resize-none bg-background/50 border-2 border-border hover:border-primary/50 focus:border-primary transition-colors"
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.message.length}/2000 {t("investorFormCharCount")}
                      </p>
                    </div>

                    <Button
                      type="submit"
                      size="xl"
                      disabled={isSubmitting}
                      className="group relative w-full overflow-hidden bg-gradient-to-r from-primary via-primary-glow to-primary font-bold shadow-xl hover:shadow-2xl transition-all duration-300 bg-[length:200%_100%] animate-gradient-x"
                    >
                      <span className="relative z-10">
                        {isSubmitting ? t("investorFormSubmitting") : t("investorFormSubmit")}
                      </span>
                      {!isSubmitting && (
                        <ArrowRight className="ml-2 h-5 w-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-glow to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      {t("investorFormTerms")}
                    </p>
                  </form>
                </CardContent>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
