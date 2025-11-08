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
        
        <div className="flex flex-wrap items-center justify-center gap-4 max-w-6xl mx-auto">
          {badges.map((badge, index) => {
            // Create organic, human-like positioning with slight rotations
            const rotations = ['-2deg', '1deg', '-1deg', '2deg', '-1.5deg', '1.5deg'];
            const scales = [1, 1.05, 0.98, 1.02, 0.97, 1.03];
            
            return (
              <div
                key={index}
                className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-card border-2 border-border transition-all duration-500 hover:border-primary hover:shadow-2xl group cursor-pointer"
                style={{ 
                  transform: `rotate(${rotations[index]}) scale(${scales[index]})`,
                  animationDelay: `${index * 100}ms`,
                  marginTop: index % 2 === 0 ? '0' : '1rem',
                  marginBottom: index % 3 === 0 ? '1rem' : '0',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'rotate(0deg) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = `rotate(${rotations[index]}) scale(${scales[index]})`;
                }}
              >
                {/* Decorative corner accent */}
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative h-14 w-14 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4 transition-all duration-500 group-hover:bg-primary/20 group-hover:rotate-12 group-hover:scale-125 border border-primary/10">
                  <badge.icon className="h-7 w-7 text-primary transition-all duration-500 group-hover:scale-110" />
                </div>
                
                <h4 className="font-bold text-base mb-2 transition-all duration-300 group-hover:text-primary group-hover:scale-105">
                  {badge.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-[140px] transition-colors duration-300 group-hover:text-foreground">
                  {badge.description}
                </p>
                
                {/* Hand-drawn style underline */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary/0 group-hover:bg-primary/40 transition-all duration-500 rounded-full group-hover:w-16" />
              </div>
            );
          })}
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
