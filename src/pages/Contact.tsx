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

const contactSchema = z.object({
  name: z.string().trim().min(1, "Namn är obligatoriskt").max(100, "Namn får vara max 100 tecken"),
  email: z.string().trim().email("Ogiltig e-postadress").max(255, "E-post får vara max 255 tecken"),
  subject: z.string().trim().min(1, "Ämne är obligatoriskt").max(200, "Ämne får vara max 200 tecken"),
  message: z.string().trim().min(10, "Meddelandet måste vara minst 10 tecken").max(2000, "Meddelandet får vara max 2000 tecken"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const { toast } = useToast();
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
        title: "Meddelande skickat!",
        description: "Vi återkommer till dig inom 24 timmar.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Error sending contact form:", error);
      toast({
        title: "Något gick fel",
        description: "Kunde inte skicka meddelandet. Försök igen senare.",
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
              Hem
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
              Kontakta{" "}
              <span className="text-primary">oss</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Vi svarar inom 24 timmar
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
                        <FormLabel className="text-base font-semibold">Namn</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ditt namn" 
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
                        <FormLabel className="text-base font-semibold">E-post</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="din@email.se" 
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
                      <FormLabel className="text-base font-semibold">Ämne</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Vad gäller det?" 
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
                      <FormLabel className="text-base font-semibold">Meddelande</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Berätta mer om din fråga eller förfrågan..."
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
                      Skickar meddelande...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Skicka Meddelande
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>

          {/* Additional Contact Info */}
          <div className="mt-12 text-center text-muted-foreground">
            <p className="text-base">
              Föredrar du e-post? Skicka direkt till{" "}
              <a href="mailto:support@spotlightevents.online" className="text-primary hover:underline font-semibold">
                support@spotlightevents.online
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Contact;
