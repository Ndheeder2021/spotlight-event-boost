import { Shield, Lock, CheckCircle, Award, Globe, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function TrustBadges() {
  const badges = [
    {
      icon: Lock,
      title: "SSL Säker",
      description: "256-bit kryptering",
    },
    {
      icon: Shield,
      title: "GDPR Compliant",
      description: "EU-godkänd",
    },
    {
      icon: Zap,
      title: "99.9% Uptime",
      description: "Garanterad tillgänglighet",
    },
    {
      icon: CheckCircle,
      title: "ISO 27001",
      description: "Certifierad säkerhet",
    },
    {
      icon: Globe,
      title: "EU Datacenter",
      description: "Data i Sverige",
    },
    {
      icon: Award,
      title: "SOC 2 Type II",
      description: "Tredjepartsgranskad",
    },
  ];

  return (
    <section className="py-12 border-t bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4 text-sm px-4 py-1">
            Säkerhet & Compliance
          </Badge>
          <h3 className="text-lg font-semibold text-muted-foreground">
            Pålitlig och säker plattform du kan lita på
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
            <span>PCI DSS Compliant</span>
          </div>
          <div className="flex items-center gap-2 hover:text-foreground transition-colors duration-300">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span>24/7 Övervakning</span>
          </div>
          <div className="flex items-center gap-2 hover:text-foreground transition-colors duration-300">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span>Automatiska backups</span>
          </div>
        </div>
      </div>
    </section>
  );
}
