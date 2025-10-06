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
      music: "bg-purple-500",
      sport: "bg-green-500",
      festival: "bg-orange-500",
      conference: "bg-blue-500",
    };
    return colors[category.toLowerCase()] || "bg-gray-500";
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg cursor-pointer" onClick={onClick}>
            {event.title}
          </CardTitle>
          <Badge className={getCategoryColor(event.category)}>
            {event.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2 cursor-pointer" onClick={onClick}>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {format(new Date(event.start_time), "PPP", { locale: sv })}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {event.venue_name}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {event.expected_attendance.toLocaleString()} förväntade gäster
          </div>
        </div>
        
        <div className="flex gap-2 pt-2">
          {onGenerateCampaign && (
            <Button
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onGenerateCampaign(event.id);
              }}
            >
              <Sparkles className="h-4 w-4 mr-1" />
              Skapa kampanj
            </Button>
          )}
          {onSaveEvent && (
            <Button
              size="sm"
              variant={isSaved ? "secondary" : "outline"}
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