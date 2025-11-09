import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Send, Loader2, Phone, Mail, MapPin, Clock } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Footer } from "@/components/Footer";
import { GlobalHeader } from "@/components/GlobalHeader";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const contactSchema = z.object({
    name: z.string().trim().min(1, t('contactNameRequired')).max(100, t('contactNameMax')),
    email: z.string().trim().email(t('contactEmailInvalid')).max(255, t('contactEmailMax')),
    countryCode: z.string().min(1, "Country code is required"),
    phone: z.string().trim().min(1, "Phone number is required").max(20, "Phone number is too long"),
    subject: z.string().trim().min(1, t('contactSubjectRequired')).max(200, t('contactSubjectMax')),
    message: z.string().trim().min(10, t('contactMessageMin')).max(2000, t('contactMessageMax')),
  });

  type ContactFormData = z.infer<typeof contactSchema>;
  
  const countryCodes = [
    { value: "+1", label: "🇺🇸 +1" },
    { value: "+44", label: "🇬🇧 +44" },
    { value: "+46", label: "🇸🇪 +46" },
    { value: "+47", label: "🇳🇴 +47" },
    { value: "+45", label: "🇩🇰 +45" },
    { value: "+358", label: "🇫🇮 +358" },
    { value: "+49", label: "🇩🇪 +49" },
    { value: "+33", label: "🇫🇷 +33" },
    { value: "+34", label: "🇪🇸 +34" },
    { value: "+39", label: "🇮🇹 +39" },
    { value: "+31", label: "🇳🇱 +31" },
  ];
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      countryCode: "+46",
      phone: "",
      subject: "",
      message: "",
    },
  });

  // Scroll animations
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    });

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("send-contact-email", {
        body: data,
      });

      if (error) {
        // Check if it's a rate limit error
        if (error.message?.includes("429") || error.message?.includes("Too many requests")) {
          toast({
            title: t('contactRateLimitTitle') || "För många förfrågningar",
            description: t('contactRateLimitDesc') || "Du har skickat för många meddelanden. Försök igen om 15 minuter.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
        throw error;
      }

      toast({
        title: t('contactSuccess'),
        description: t('contactSuccessDesc'),
      });
      
      form.reset();
    } catch (error: any) {
      console.error("Error sending contact form:", error);
      
      // Check for rate limit in catch block too
      if (error?.message?.includes("429") || error?.message?.includes("Too many requests")) {
        toast({
          title: t('contactRateLimitTitle') || "För många förfrågningar",
          description: t('contactRateLimitDesc') || "Du har skickat för många meddelanden. Försök igen om 15 minuter.",
          variant: "destructive",
        });
      } else {
        toast({
          title: t('contactError'),
          description: t('contactErrorDesc'),
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5 relative overflow-hidden">
      <SEO
        title="Kontakta Oss - Spotlight"
        description="Har du frågor om Spotlight? Kontakta oss så svarar vi inom 24 timmar. Vi hjälper dig att lyckas med event-driven marknadsföring."
        keywords="kontakt, support, kundtjänst, spotlight kontakt"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Kontakta Spotlight",
          "description": "Kontakta Spotlight för support och frågor"
        }}
      />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 text-6xl animate-bounce opacity-20">💬</div>
      <div className="absolute top-40 right-20 text-5xl animate-pulse opacity-20">📧</div>
      <div className="absolute bottom-40 left-20 text-5xl animate-bounce opacity-20" style={{ animationDelay: '1s' }}>📞</div>
      <div className="absolute bottom-20 right-10 text-6xl animate-pulse opacity-20" style={{ animationDelay: '0.5s' }}>✨</div>

      {/* Hand-drawn circle decoration */}
      <svg className="absolute top-32 right-1/4 w-32 h-32 opacity-10 animate-float" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" 
          strokeDasharray="5,5" transform="rotate(-10 50 50)" />
      </svg>
      
      {/* Hand-drawn star decoration */}
      <svg className="absolute bottom-1/3 left-1/4 w-24 h-24 opacity-10 animate-float" style={{ animationDelay: '1.5s' }} viewBox="0 0 100 100">
        <path d="M50 10 L60 40 L90 45 L65 65 L72 95 L50 80 L28 95 L35 65 L10 45 L40 40 Z" 
          fill="none" stroke="currentColor" strokeWidth="2" className="text-accent" />
      </svg>

      <GlobalHeader variant="default" />

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-32 lg:py-40 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 relative">
            {/* Sparkle decorations */}
            <div className="absolute -top-10 left-1/4 text-4xl animate-pulse opacity-30">✨</div>
            <div className="absolute -top-5 right-1/3 text-3xl animate-bounce opacity-30" style={{ animationDelay: '0.5s' }}>💡</div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-8">
              <span className="relative inline-block">
                {t('contactHero')}{" "}
                <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
                  {t('contactHeroHighlight')}
                </span>
                {/* Wavy underline */}
                <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 400 12">
                  <path d="M0 6 Q20 0, 40 6 T80 6 T120 6 T160 6 T200 6 T240 6 T280 6 T320 6 T360 6 T400 6" 
                    fill="none" stroke="currentColor" strokeWidth="3" className="text-accent" />
                </svg>
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
              {t('contactHeroDesc')} 🚀
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Contact Info Cards */}
            <Card className="relative overflow-hidden bg-card border-2 border-border hover:border-primary/40 transition-all duration-300 hover:shadow-xl group hover:-rotate-1" style={{ transform: 'rotate(-0.5deg)' }}>
              <div className="absolute -top-5 -right-5 text-5xl opacity-20 group-hover:scale-125 transition-transform duration-300">📧</div>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">Email</h3>
                <a href="mailto:support@spotlightevents.online" className="text-primary hover:underline break-all">
                  support@spotlightevents.online
                </a>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-card border-2 border-border hover:border-primary/40 transition-all duration-300 hover:shadow-xl group hover:rotate-1" style={{ transform: 'rotate(0.5deg)' }}>
              <div className="absolute -top-5 -right-5 text-5xl opacity-20 group-hover:scale-125 transition-transform duration-300">⏰</div>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">Response Time</h3>
                <p className="text-foreground/70">Within 24 hours ⚡</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-card border-2 border-border hover:border-primary/40 transition-all duration-300 hover:shadow-xl group hover:-rotate-1" style={{ transform: 'rotate(-0.5deg)' }}>
              <div className="absolute -top-5 -right-5 text-5xl opacity-20 group-hover:scale-125 transition-transform duration-300">🌍</div>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">Location</h3>
                <p className="text-foreground/70">Stockholm, Sweden 🇸🇪</p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="relative max-w-3xl mx-auto bg-card border-2 border-border shadow-2xl overflow-hidden hover:shadow-primary/20 transition-all duration-300 hover:-rotate-0.5" style={{ transform: 'rotate(0.5deg)' }}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
            
            {/* Fun decorative emojis */}
            <div className="absolute top-4 right-4 text-4xl animate-bounce opacity-20">💌</div>
            <div className="absolute bottom-4 left-4 text-3xl animate-pulse opacity-20">📝</div>
            
            <CardContent className="p-8 md:p-12 relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center hover:scale-110 hover:rotate-12 transition-all duration-300">
                  <MessageSquare className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">
                    <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                      {t('contactFormTitle')}
                    </span>
                  </h2>
                  <p className="text-sm text-foreground/60">Vi svarar inom 24 timmar! ⚡</p>
                </div>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold flex items-center gap-2">
                            {t('contactName')} <span className="text-lg">👤</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={t('contactNamePlaceholder')} 
                              className="h-12 text-base bg-background/50 border-2 border-border hover:border-primary/50 focus:border-primary transition-colors" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold flex items-center gap-2">
                            {t('contactEmail')} <span className="text-lg">📧</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder={t('contactEmailPlaceholder')} 
                              className="h-12 text-base bg-background/50 border-2 border-border hover:border-primary/50 focus:border-primary transition-colors"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Phone Number with Country Code */}
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="countryCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold flex items-center gap-2">
                            Code <span className="text-lg">🌍</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 text-base bg-background/50 border-2 border-border hover:border-primary/50 focus:border-primary transition-colors">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-background max-h-[300px]">
                              {countryCodes.map((country) => (
                                <SelectItem key={country.value} value={country.value}>
                                  {country.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel className="text-base font-semibold flex items-center gap-2">
                            Phone Number <span className="text-lg">📞</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="tel"
                              placeholder="70 123 45 67" 
                              className="h-12 text-base bg-background/50 border-2 border-border hover:border-primary/50 focus:border-primary transition-colors"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold flex items-center gap-2">
                          {t('contactSubject')} <span className="text-lg">💡</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={t('contactSubjectPlaceholder')} 
                            className="h-12 text-base bg-background/50 border-2 border-border hover:border-primary/50 focus:border-primary transition-colors"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold flex items-center gap-2">
                          {t('contactMessage')} <span className="text-lg">✍️</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t('contactMessagePlaceholder')}
                            className="min-h-[200px] text-base resize-none bg-background/50 border-2 border-border hover:border-primary/50 focus:border-primary transition-colors"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    size="xl"
                    className="group relative w-full overflow-hidden bg-gradient-to-r from-primary via-primary-glow to-primary text-base font-bold shadow-xl hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 bg-[length:200%_100%] animate-gradient-x hover:scale-105"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin relative z-10" />
                        <span className="relative z-10">{t('contactSending')}</span>
                        <span className="text-xl animate-spin">⏳</span>
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                        <span className="relative z-10">{t('contactSendButton')}</span>
                        <span className="text-xl ml-2">🚀</span>
                      </>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-glow to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                  
                  <p className="text-xs text-center text-foreground/60 mt-4">
                    Vi behandlar dina personuppgifter enligt vår integritetspolicy 🔒
                  </p>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Contact;
