import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const NewsletterSignup = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error(t('newsletterInvalidEmail'));
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke("capture-lead", {
        body: {
          email,
          source: "newsletter",
          metadata: {
            subscribed_at: new Date().toISOString(),
          },
        },
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success(t('newsletterThankYou'));
    } catch (error) {
      console.error("Newsletter signup error:", error);
      toast.error(t('newsletterError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center gap-3 text-primary">
        <CheckCircle2 className="h-6 w-6" />
        <p className="font-medium">{t('newsletterSuccess')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <div className="relative flex-1">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="email"
          placeholder={t('newsletterEmailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="pl-10"
          required
        />
      </div>
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="whitespace-nowrap"
      >
        {isSubmitting ? t('newsletterSubscribing') : t('newsletterSubscribe')}
      </Button>
    </form>
  );
};
