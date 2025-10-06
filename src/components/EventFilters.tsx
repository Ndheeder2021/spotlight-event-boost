import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";

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
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Sök event..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Kategori" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Alla kategorier</SelectItem>
          <SelectItem value="music">Musik</SelectItem>
          <SelectItem value="sport">Sport</SelectItem>
          <SelectItem value="festival">Festival</SelectItem>
          <SelectItem value="conference">Konferens</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Fler filter
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Avstånd: {distance} km</Label>
              <Slider
                value={[distance]}
                onValueChange={(value) => onDistanceChange(value[0])}
                min={1}
                max={20}
                step={1}
              />
            </div>
            <div className="space-y-2">
              <Label>Min publikstorlek: {minAttendance.toLocaleString()}</Label>
              <Slider
                value={[minAttendance]}
                onValueChange={(value) => onMinAttendanceChange(value[0])}
                min={0}
                max={5000}
                step={100}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
