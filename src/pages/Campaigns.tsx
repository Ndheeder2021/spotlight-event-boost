import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { toast } from "sonner";
import { Loader2, Megaphone } from "lucide-react";

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
      draft: { variant: "secondary" as const, text: "Utkast" },
      scheduled: { variant: "default" as const, text: "Schemalagd" },
      published: { variant: "default" as const, text: "Publicerad" },
    };
    const config = statusMap[status as keyof typeof statusMap] || statusMap.draft;
    return (
      <Badge variant={config.variant}>
        {config.text}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Sparade Events & Kampanjer</h1>
        <p className="text-muted-foreground">Dina sparade events och AI-genererade kampanjer</p>
      </div>

      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Megaphone className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Inga sparade events än</h3>
            <p className="text-muted-foreground text-center">
              Gå till Dashboard och spara events genom att klicka på bookmark-ikonen
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <Card
              key={campaign.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/campaigns/${campaign.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg line-clamp-2">{campaign.title}</CardTitle>
                  {getStatusBadge(campaign.status)}
                </div>
                <CardDescription className="line-clamp-1">
                  Event: {campaign.events?.title || "Okänt event"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {campaign.description}
                </p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>
                    Start: {format(new Date(campaign.recommended_start), "PPP HH:mm", { locale: sv })}
                  </p>
                  <p>
                    Slut: {format(new Date(campaign.recommended_end), "PPP HH:mm", { locale: sv })}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
