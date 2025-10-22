import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Send, Loader2, Zap } from "lucide-react";
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
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { SEO } from "@/components/SEO";
import { LiveChatSupport } from "@/components/LiveChatSupport";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const contactSchema = z.object({
    name: z.string().trim().min(1, t('contactNameRequired')).max(100, t('contactNameMax')),
    email: z.string().trim().email(t('contactEmailInvalid')).max(255, t('contactEmailMax')),
    subject: z.string().trim().min(1, t('contactSubjectRequired')).max(200, t('contactSubjectMax')),
    message: z.string().trim().min(10, t('contactMessageMin')).max(2000, t('contactMessageMax')),
  });

  type ContactFormData = z.infer<typeof contactSchema>;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
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
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: data,
      });

      if (error) throw error;

      toast({
        title: t('contactSuccess'),
        description: t('contactSuccessDesc'),
      });
      
      form.reset();
    } catch (error) {
      console.error("Error sending contact form:", error);
      toast({
        title: t('contactError'),
        description: t('contactErrorDesc'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
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
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Zap className="h-6 w-6 text-accent" fill="currentColor" />
            <span className="text-xl font-bold">Spotlight</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:inline">
              {t('home')}
            </Link>
            <LanguageSwitch />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-32 lg:py-40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight mb-8">
              {t('contactHero')}{" "}
              <span className="text-primary">{t('contactHeroHighlight')}</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('contactHeroDesc')}
            </p>
          </div>

          {/* Contact Form */}
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-sm">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">{t('contactName')}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={t('contactNamePlaceholder')} 
                            className="h-12 text-base" 
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
                        <FormLabel className="text-base font-semibold">{t('contactEmail')}</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder={t('contactEmailPlaceholder')} 
                            className="h-12 text-base"
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
                      <FormLabel className="text-base font-semibold">{t('contactSubject')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={t('contactSubjectPlaceholder')} 
                          className="h-12 text-base"
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
                      <FormLabel className="text-base font-semibold">{t('contactMessage')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('contactMessagePlaceholder')}
                          className="min-h-[200px] text-base resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t('contactSending')}
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      {t('contactSendButton')}
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>

          {/* Additional Contact Info */}
          <div className="mt-12 text-center text-muted-foreground">
            <p className="text-base">
              {t('contactPreferEmail')}{" "}
              <a href="mailto:support@spotlightevents.online" className="text-primary hover:underline font-semibold">
                support@spotlightevents.online
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
      
      {/* Live Chat Support */}
      <LiveChatSupport />
    </div>
  );
};

export default Contact;
