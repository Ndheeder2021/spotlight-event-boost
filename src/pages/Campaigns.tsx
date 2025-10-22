import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { toast } from "sonner";
import { Loader2, Megaphone, Calendar, Clock } from "lucide-react";

interface Campaign {
  id: string;
  title: string;
  description: string;
  status: string;
  recommended_start: string;
  recommended_end: string;
  event_id: string;
  events?: {
    title: string;
  };
}

export default function Campaigns() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/");
        return;
      }

      const { data: userRole } = await supabase
        .from("user_roles")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

      if (!userRole) throw new Error("No tenant found");

      const { data, error } = await supabase
        .from("campaigns")
        .select(`
          *,
          events:event_id (
            title
          )
        `)
        .eq("tenant_id", userRole.tenant_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      draft: { className: "bg-secondary/80 text-secondary-foreground border-secondary/30", text: "Utkast" },
      scheduled: { className: "bg-accent/10 text-accent border-accent/30", text: "Schemalagd" },
      published: { className: "bg-primary/10 text-primary border-primary/30", text: "Publicerad" },
    };
    const config = statusMap[status as keyof typeof statusMap] || statusMap.draft;
    return (
      <Badge className={`${config.className} border`}>
        {config.text}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5 flex items-center justify-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-card">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-lg font-medium">Laddar kampanjer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="mb-12 space-y-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="h-12 w-1 bg-gradient-to-b from-primary to-accent rounded-full" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                Sparade Events & Kampanjer
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Dina sparade events och AI-genererade kampanjer
              </p>
            </div>
          </div>
        </div>

        {campaigns.length === 0 ? (
          <div className="animate-fade-in">
            <Card className="glass-card max-w-2xl mx-auto border-0">
              <CardContent className="flex flex-col items-center justify-center py-20">
                <div className="p-4 rounded-2xl bg-primary/10 mb-6">
                  <Megaphone className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Inga sparade events än</h3>
                <p className="text-muted-foreground text-center text-lg max-w-md">
                  Gå till Dashboard och spara events genom att klicka på bookmark-ikonen
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign, index) => (
              <div key={campaign.id} className={`animate-fade-in stagger-${(index % 5) + 1}`}>
                <Card
                  className="glass-card hover-lift group cursor-pointer border-border/50 h-full flex flex-col overflow-hidden"
                  onClick={() => navigate(`/campaigns/${campaign.id}`)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <CardHeader className="relative z-10">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <CardTitle className="text-xl font-bold line-clamp-2 flex-1">
                        {campaign.title}
                      </CardTitle>
                      {getStatusBadge(campaign.status)}
                    </div>
                    <CardDescription className="text-base flex items-center gap-2">
                      <Megaphone className="h-4 w-4 text-accent shrink-0" />
                      <span className="line-clamp-1">{campaign.events?.title || "Okänt event"}</span>
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col relative z-10 space-y-4">
                    <p className="text-sm text-foreground/70 line-clamp-3 flex-1">
                      {campaign.description}
                    </p>
                    
                    <div className="space-y-2 pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2 text-sm text-foreground/70">
                        <div className="p-1 rounded bg-primary/10">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span className="font-medium">
                          {format(new Date(campaign.recommended_start), "PPP", { locale: sv })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-foreground/70">
                        <div className="p-1 rounded bg-accent/10">
                          <Clock className="h-3.5 w-3.5 text-accent" />
                        </div>
                        <span className="font-medium">
                          {format(new Date(campaign.recommended_start), "HH:mm", { locale: sv })} - {format(new Date(campaign.recommended_end), "HH:mm", { locale: sv })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
