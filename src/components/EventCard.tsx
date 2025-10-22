import { Calendar, MapPin, Users, Sparkles, Bookmark } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    category: string;
    start_time: string;
    venue_name: string;
    expected_attendance: number;
  };
  onClick: () => void;
  onGenerateCampaign?: (eventId: string) => void;
  onSaveEvent?: (eventId: string) => void;
  isSaved?: boolean;
}

export const EventCard = ({ event, onClick, onGenerateCampaign, onSaveEvent, isSaved }: EventCardProps) => {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      music: "bg-purple-500/10 text-purple-600 border-purple-500/20",
      sport: "bg-green-500/10 text-green-600 border-green-500/20",
      festival: "bg-orange-500/10 text-orange-600 border-orange-500/20",
      conference: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    };
    return colors[category.toLowerCase()] || "bg-primary/10 text-primary border-primary/20";
  };

  return (
    <Card className="glass-card hover-lift group cursor-pointer border-border/50 overflow-hidden h-full flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <CardHeader className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-xl font-bold leading-tight flex-1" onClick={onClick}>
            {event.title}
          </CardTitle>
          <Badge className={`${getCategoryColor(event.category)} border`}>
            {event.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 flex-1 flex flex-col relative z-10">
        <div className="space-y-3 flex-1" onClick={onClick}>
          <div className="flex items-center gap-3 text-sm text-foreground/70 hover:text-foreground transition-colors">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <span className="font-medium">
              {format(new Date(event.start_time), "PPP", { locale: sv })}
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-foreground/70 hover:text-foreground transition-colors">
            <div className="p-1.5 rounded-md bg-accent/10">
              <MapPin className="h-4 w-4 text-accent" />
            </div>
            <span className="font-medium">{event.venue_name}</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-foreground/70 hover:text-foreground transition-colors">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <span className="font-medium">
              {event.expected_attendance.toLocaleString()} förväntade gäster
            </span>
          </div>
        </div>
        
        <div className="flex gap-2 pt-2">
          {onGenerateCampaign && (
            <Button
              size="lg"
              className="flex-1 hover-scale"
              onClick={(e) => {
                e.stopPropagation();
                onGenerateCampaign(event.id);
              }}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Skapa kampanj
            </Button>
          )}
          {onSaveEvent && (
            <Button
              size="lg"
              variant={isSaved ? "secondary" : "outline"}
              className="hover-scale"
              onClick={(e) => {
                e.stopPropagation();
                onSaveEvent(event.id);
              }}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};