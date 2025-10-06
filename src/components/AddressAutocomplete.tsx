import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";

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
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?country=SE&types=address,place&access_token=pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbTc4OXNiemYwMW1iMmtzNWI2Y2RqMnJpIn0.4kCLSULg0-S9W0hM_cw7qg`
      );
      const data = await response.json();
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
      <Input
        type="text"
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              type="button"
              className="w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              <div className="text-sm">{suggestion.place_name}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
