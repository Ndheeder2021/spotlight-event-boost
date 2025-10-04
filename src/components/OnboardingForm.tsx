import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface OnboardingFormProps {
  userId: string;
  onComplete: () => void;
}

export const OnboardingForm = ({ userId, onComplete }: OnboardingFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "restaurant",
    address: "",
    lat: 59.3293,
    lon: 18.0686,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          business_name: formData.businessName,
          business_type: formData.businessType,
          address: formData.address,
          lat: formData.lat,
          lon: formData.lon,
        })
        .eq("id", userId);

      if (error) throw error;
      toast.success("Profil skapad!");
      onComplete();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Välkommen till Spotlight</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Verksamhetens namn</Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessType">Typ av verksamhet</Label>
            <Select
              value={formData.businessType}
              onValueChange={(value) => setFormData({ ...formData, businessType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cafe">Café</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
                <SelectItem value="restaurant">Restaurang</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Adress</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Drottninggatan 1, Stockholm"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Kom igång
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};