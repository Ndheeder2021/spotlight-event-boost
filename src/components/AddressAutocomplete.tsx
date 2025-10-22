import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "./ui/input";
import { MapPin, Search } from "lucide-react";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string, coordinates?: { lat: number; lon: number }) => void;
  placeholder?: string;
  required?: boolean;
}

export const AddressAutocomplete = ({ 
  value, 
  onChange, 
  placeholder = "Ange adress",
  required = false 
}: AddressAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("geocode-address", {
        body: { query },
      });

      if (error) {
        console.error("Error fetching address suggestions:", error);
        setSuggestions([]);
        return;
      }

      setSuggestions(data.features || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleInputChange = (newValue: string) => {
    onChange(newValue);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      fetchSuggestions(newValue);
    }, 300);
  };

  const handleSelectSuggestion = (suggestion: any) => {
    const address = suggestion.place_name;
    const [lon, lat] = suggestion.center;
    onChange(address, { lat, lon });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          className="pl-10 h-11 glass-card border-border/50 hover:border-primary/50 focus:border-primary transition-all shadow-sm hover:shadow-md focus:shadow-glow"
        />
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-[100] w-full mt-2 glass-card border-primary/20 rounded-lg shadow-glow max-h-60 overflow-auto animate-fade-in">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              type="button"
              className={`w-full text-left px-4 py-3 hover:bg-primary/10 hover:border-l-2 hover:border-primary transition-all flex items-start gap-3 group ${
                index !== suggestions.length - 1 ? 'border-b border-border/30' : ''
              }`}
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              <MapPin className="h-4 w-4 text-primary mt-0.5 group-hover:scale-110 transition-transform" />
              <div className="text-sm flex-1 group-hover:text-foreground transition-colors">
                {suggestion.place_name}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
