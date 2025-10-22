import { Shield, Lock, CheckCircle, Award, Globe, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

export function TrustBadges() {
  const { t } = useTranslation();
  
  const badges = [
    {
      icon: Lock,
      title: t('trustBadgeSSL'),
      description: t('trustBadgeSSLDesc'),
    },
    {
      icon: Shield,
      title: t('trustBadgeGDPR'),
      description: t('trustBadgeGDPRDesc'),
    },
    {
      icon: Zap,
      title: t('trustBadgeUptime'),
      description: t('trustBadgeUptimeDesc'),
    },
    {
      icon: CheckCircle,
      title: t('trustBadgeISO'),
      description: t('trustBadgeISODesc'),
    },
    {
      icon: Globe,
      title: t('trustBadgeEU'),
      description: t('trustBadgeEUDesc'),
    },
    {
      icon: Award,
      title: t('trustBadgeSOC'),
      description: t('trustBadgeSOCDesc'),
    },
  ];

  return (
    <section className="py-12 border-t bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4 text-sm px-4 py-1">
            {t('trustBadgesTitle')}
          </Badge>
          <h3 className="text-lg font-semibold text-muted-foreground">
            {t('trustBadgesSubtitle')}
          </h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-7xl mx-auto">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-4 rounded-xl bg-card border-2 border-border transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover-lift group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                <badge.icon className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h4 className="font-bold text-sm mb-1 transition-colors duration-300 group-hover:text-primary">
                {badge.title}
              </h4>
              <p className="text-xs text-muted-foreground">
                {badge.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 hover:text-foreground transition-colors duration-300">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span>{t('trustBadgePCI')}</span>
          </div>
          <div className="flex items-center gap-2 hover:text-foreground transition-colors duration-300">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span>{t('trustBadgeMonitoring')}</span>
          </div>
          <div className="flex items-center gap-2 hover:text-foreground transition-colors duration-300">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span>{t('trustBadgeBackups')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
