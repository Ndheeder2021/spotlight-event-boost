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
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Zap className="h-7 w-7 text-accent" fill="currentColor" />
            <span className="text-2xl font-bold gradient-text">Spotlight</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-accent/5 py-20">
        {/* Grid Pattern Background */}
        <div className="absolute inset-0 grid-pattern opacity-30" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse premium-glow" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="container relative mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 animate-on-scroll">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card/80 backdrop-blur-xl border border-accent/30 shadow-xl mb-8">
                <MessageSquare className="h-5 w-5 text-accent" />
                <span className="text-sm font-semibold gradient-text">
                  Vi är här för att hjälpa dig
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-display mb-6">
                Kontakta{" "}
                <span className="gradient-text">Spotlight</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Har du frågor om våra tjänster? Vi svarar inom 24 timmar.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-16 animate-on-scroll">
              <div className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-accent/50 transition-all hover:scale-105">
                <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Send className="h-7 w-7 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Snabb respons</h3>
                <p className="text-sm text-muted-foreground">Svar inom 24 timmar på alla förfrågningar</p>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-accent/50 transition-all hover:scale-105">
                <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-7 w-7 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Personlig support</h3>
                <p className="text-sm text-muted-foreground">Dedikerad hjälp från vårt expertteam</p>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-accent/50 transition-all hover:scale-105">
                <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-7 w-7 text-accent" fill="currentColor" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Lösningsfokuserad</h3>
                <p className="text-sm text-muted-foreground">Vi hjälper dig att lyckas med Spotlight</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass-card p-8 md:p-12 shadow-2xl animate-on-scroll border-2 border-accent/20">
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
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-accent via-accent-glow to-accent hover:opacity-90 transition-all premium-glow"
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
            <div className="mt-12 text-center text-muted-foreground animate-on-scroll">
              <p className="text-base">
                Föredrar du e-post? Skicka direkt till{" "}
                <a href="mailto:support@spotlightevents.online" className="text-accent hover:underline font-semibold">
                  support@spotlightevents.online
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Contact;
