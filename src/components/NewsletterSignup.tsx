import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import "./newsletter-signup.css";

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
      <div className="newsletter-success">
        <CheckCircle2 className="h-6 w-6" />
        <p className="font-medium">{t('newsletterSuccess')}</p>
      </div>
    );
  }

  return (
    <div className="newsletter-form">
      <h3 className="newsletter-title">{t('newsletterTitle') || 'Stay Updated'}</h3>
      <p className="newsletter-description">
        Newsletter
      </p>
      <form onSubmit={handleSubmit}>
        <div className="newsletter-form-inputs">
          <input
            type="email"
            placeholder={t('newsletterEmailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('newsletterSubscribing') : t('newsletterSubscribe')}
          </button>
        </div>
      </form>
    </div>
  );
};
