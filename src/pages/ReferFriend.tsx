import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Zap, Copy, Check, Gift, TrendingUp, Users, DollarSign } from "lucide-react";

export default function ReferFriend() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [referralData, setReferralData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check URL for referral code
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    
    if (refCode) {
      // Store referral code in localStorage for later use during signup
      localStorage.setItem('referral_code', refCode);
      toast.success(t('referFriendCodeSaved'));
    }
  }, [t]);

  const generateReferralCode = async () => {
    if (!email) {
      toast.error(t('referFriendEnterEmail'));
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(t('referFriendValidEmail'));
      return;
    }

    setLoading(true);

    try {
      // Use secure Edge Function to create/get referral
      const { data, error } = await supabase.functions.invoke('create-referral', {
        body: { email: email.toLowerCase() }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setReferralData(data.referral);

      if (data.isNew) {
        toast.success(t('referFriendCreatedWithEmail'));
      } else {
        toast.success(t('referFriendWelcomeBack'));
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || t('referFriendError'));
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}/?ref=${referralData.referral_code}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success(t('referFriendCopied'));
    setTimeout(() => setCopied(false), 2000);
  };

  const referralLink = referralData ? `${window.location.origin}/?ref=${referralData.referral_code}` : '';

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 animate-gradient-shift"></div>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-3xl"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 sticky top-0 bg-black/20 backdrop-blur-md z-50">
          <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Zap className="h-6 w-6 text-white" fill="currentColor" />
              <span className="text-xl font-bold text-white">Spotlight</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-sm font-medium text-white/80 hover:text-white transition-colors hidden sm:inline">
                {t('referFriendHome')}
              </Link>
              <Link to="/pricing" className="text-sm font-medium text-white/80 hover:text-white transition-colors hidden sm:inline">
                {t('referFriendPricing')}
              </Link>
              <Link to="/auth">
                <Button className="bg-white hover:bg-white/90 text-black">
                  {t('referFriendLogin')}
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 py-20 lg:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-8 animate-fade-in">
              <Gift className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">{t('referFriendBadge')}</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white animate-fade-in">
              {t('referFriendTitle')}{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {t('referFriendTitleHighlight')}
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-white/80 max-w-3xl mx-auto animate-fade-in">
              {t('referFriendSubtitle')}
            </p>
          </div>

          {/* Main Card */}
          {!referralData ? (
            <div className="max-w-2xl mx-auto mb-16 animate-fade-in">
              <div className="flex gap-3 mb-4">
                <Input
                  type="email"
                  placeholder={t('referFriendEmailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 text-base bg-white/95 backdrop-blur-sm border-white/20 text-gray-900 placeholder:text-gray-500"
                  onKeyPress={(e) => e.key === 'Enter' && generateReferralCode()}
                />
                <Button
                  onClick={generateReferralCode}
                  disabled={loading}
                  className="h-14 px-8 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  {loading ? t('referFriendCreatingButton') : t('referFriendEnterButton')}
                </Button>
              </div>
              <p className="text-xs text-white/60 text-center">
                {t('referFriendDisclaimer')}
              </p>
            </div>
          ) : (
            <Card className="max-w-2xl mx-auto mb-16 bg-white/95 backdrop-blur-sm border-white/20 animate-scale-in">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">{t('referFriendLinkLabel')}</label>
                  <div className="flex gap-2">
                    <Input
                      value={referralLink}
                      readOnly
                      className="h-12 font-mono text-sm bg-gray-50 border-gray-200 text-gray-900"
                    />
                    <Button
                      onClick={copyReferralLink}
                      variant="outline"
                      className="h-12 px-6 border-gray-200 hover:bg-gray-50"
                    >
                      {copied ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{referralData.referred_count}</p>
                    <p className="text-sm text-gray-600">{t('referFriendReferences')}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">${referralData.total_commission}</p>
                    <p className="text-sm text-gray-600">{t('referFriendEarned')}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{(referralData.commission_rate * 100).toFixed(0)}%</p>
                    <p className="text-sm text-gray-600">{t('referFriendCommission')}</p>
                  </div>
                </div>

                <div className="text-center text-sm text-gray-600">
                  <p>{t('referFriendShareText')}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* How it Works */}
          <div className="mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12 text-white">{t('referFriendHowTitle')}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <Card className="relative text-center p-8 bg-white/95 backdrop-blur-sm border-white/20 hover:scale-105 transition-all duration-200 rounded-2xl">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/50">
                    <Gift className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{t('referFriendStep1Title')}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t('referFriendStep1Desc')}
                  </p>
                </Card>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <Card className="relative text-center p-8 bg-white/95 backdrop-blur-sm border-white/20 hover:scale-105 transition-all duration-200 rounded-2xl">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/50">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{t('referFriendStep2Title')}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t('referFriendStep2Desc')}
                  </p>
                </Card>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <Card className="relative text-center p-8 bg-white/95 backdrop-blur-sm border-white/20 hover:scale-105 transition-all duration-200 rounded-2xl">
                  <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/50">
                    <DollarSign className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{t('referFriendStep3Title')}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t('referFriendStep3Desc')}
                  </p>
                </Card>
              </div>
            </div>
          </div>

        </div>
      </section>
      </div>
    </div>
  );
}
