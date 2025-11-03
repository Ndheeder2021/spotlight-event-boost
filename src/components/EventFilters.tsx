import { Search, SlidersHorizontal } from "lucide-react";
import { AnimatedInput } from "./ui/animated-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { useTranslation } from "react-i18next";
import { Badge } from "./ui/badge";

interface EventFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  distance: number;
  onDistanceChange: (value: number) => void;
  minAttendance: number;
  onMinAttendanceChange: (value: number) => void;
}

export const EventFilters = ({
  searchQuery,
  onSearchChange,
  category,
  onCategoryChange,
  distance,
  onDistanceChange,
  minAttendance,
  onMinAttendanceChange,
}: EventFiltersProps) => {
  const { t } = useTranslation();
  const activeFiltersCount = (category !== "all" ? 1 : 0) + (distance !== 10 ? 1 : 0) + (minAttendance !== 0 ? 1 : 0);
  
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center animate-fade-in">
      {/* Search Input */}
      <div className="relative flex-1">
        <AnimatedInput
          type="text"
          placeholder={t('searchEvents')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={<Search className="h-5 w-5" />}
        />
      </div>

      {/* Category Select */}
      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full md:w-[200px] h-11 glass-card border-border/50 hover:border-accent/50 transition-colors hover-scale">
          <SelectValue placeholder={t('category')} />
        </SelectTrigger>
        <SelectContent className="glass-card">
          <SelectItem value="all">{t('allCategories')}</SelectItem>
          <SelectItem value="music">{t('music')}</SelectItem>
          <SelectItem value="sport">{t('sport')}</SelectItem>
          <SelectItem value="festival">{t('festival')}</SelectItem>
          <SelectItem value="conference">{t('conference')}</SelectItem>
        </SelectContent>
      </Select>

      {/* Advanced Filters Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="gap-2 h-11 relative glass-card border-2 hover:border-primary/50 hover-scale group"
          >
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <span>{t('moreFilters')}</span>
            {activeFiltersCount > 0 && (
              <Badge 
                variant="secondary" 
                className="ml-1 h-5 min-w-5 px-1.5 bg-primary text-primary-foreground rounded-full text-xs"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 glass-card border-border/50 premium-glow">
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-sm mb-4 gradient-text">{t('advancedFilters')}</h4>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">{t('distance')}</Label>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  {distance} km
                </Badge>
              </div>
              <Slider
                value={[distance]}
                onValueChange={(value) => onDistanceChange(value[0])}
                min={1}
                max={20}
                step={1}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">{t('distanceDesc')}</p>
            </div>
            
            <div className="h-px bg-border/50" />
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">{t('minAudience')}</Label>
                <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                  {minAttendance.toLocaleString()}
                </Badge>
              </div>
              <Slider
                value={[minAttendance]}
                onValueChange={(value) => onMinAttendanceChange(value[0])}
                min={0}
                max={5000}
                step={100}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">{t('minAudienceDesc')}</p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
