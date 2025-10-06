import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Calendar, MapPin, Users, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EventDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: any;
  type: "event" | "campaign" | "internal";
}

export const EventDetailsDialog = ({ open, onOpenChange, item, type }: EventDetailsDialogProps) => {
  const navigate = useNavigate();

  if (!item) return null;

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      music: "bg-purple-500",
      sport: "bg-green-500",
      festival: "bg-orange-500",
      conference: "bg-blue-500",
    };
    return colors[category?.toLowerCase()] || "bg-gray-500";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{item.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {type === "event" && (
            <>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {format(new Date(item.start_time), "PPP HH:mm", { locale: sv })}
              </div>

              {item.venue_name && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {item.venue_name}
                  {item.city && `, ${item.city}`}
                </div>
              )}

              {item.expected_attendance && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {item.expected_attendance.toLocaleString()} förväntade besökare
                </div>
              )}

              {item.category && (
                <Badge className={getCategoryColor(item.category)}>
                  {item.category}
                </Badge>
              )}

              {item.description && (
                <div className="pt-4">
                  <h4 className="font-semibold mb-2">Beskrivning</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              )}

              {item.raw_url && (
                <Button variant="outline" asChild className="w-full">
                  <a href={item.raw_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Öppna evenemangssida
                  </a>
                </Button>
              )}

              <Button
                onClick={() => {
                  onOpenChange(false);
                  navigate(`/event/${item.id}`);
                }}
                className="w-full"
              >
                Generera kampanj för detta event
              </Button>
            </>
          )}

          {type === "campaign" && (
            <>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {format(new Date(item.recommended_start), "PPP HH:mm", { locale: sv })}
              </div>

              <Badge variant={item.status === "published" ? "default" : "secondary"}>
                {item.status === "draft" ? "Utkast" : item.status === "scheduled" ? "Schemalagd" : "Publicerad"}
              </Badge>

              {item.description && (
                <div className="pt-4">
                  <h4 className="font-semibold mb-2">Beskrivning</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              )}

              <Button
                onClick={() => {
                  onOpenChange(false);
                  navigate(`/campaigns/${item.id}`);
                }}
                className="w-full"
              >
                Redigera kampanj
              </Button>
            </>
          )}

          {type === "internal" && (
            <>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {format(new Date(item.start_time), "PPP HH:mm", { locale: sv })} - {format(new Date(item.end_time), "HH:mm", { locale: sv })}
              </div>

              <Badge style={{ backgroundColor: item.color }}>
                {item.event_type === "live_band" ? "Live Band" : item.event_type === "promotion" ? "Kampanj" : "Anpassad"}
              </Badge>

              {item.description && (
                <div className="pt-4">
                  <h4 className="font-semibold mb-2">Beskrivning</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
