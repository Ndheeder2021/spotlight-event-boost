import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./cookie-consent.css";

export const CookieConsent = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  const handlePreferences = () => {
    // Open preferences or redirect to cookies page
    window.location.href = "/cookies";
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-consent-overlay">
      <div className="cookie-card">
        <h2 className="title">{t('cookieConsentTitle') || 'Cookie Notice'}</h2>
        <p className="description">
          {t('cookieConsentDescription') || 'We use cookies to improve your experience. By using our site, you agree to our '}{" "}
          <Link to="/cookies">{t('cookiePolicy') || 'cookie policy'}</Link>.
        </p>
        <div className="actions">
          <button className="pref" onClick={handlePreferences}>
            {t('cookiePreferences') || 'Manage preferences'}
          </button>
          <button className="accept" onClick={handleAccept}>
            {t('cookieAccept') || 'Accept all'}
          </button>
        </div>
      </div>
    </div>
  );
};
