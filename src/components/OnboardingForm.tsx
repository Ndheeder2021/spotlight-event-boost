import { useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import { Loader2, Info } from "lucide-react";

interface OnboardingFormProps {
  userId: string;
  onComplete: () => void;
}

export const OnboardingForm = ({ userId, onComplete }: OnboardingFormProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    businessName: string;
    businessType: "restaurant" | "cafe" | "bar";
    address: string;
    lat: number;
    lon: number;
    businessDescription: string;
    targetCustomerProfile: string;
  }>({
    businessName: "",
    businessType: "restaurant",
    address: "",
    lat: 59.3293,
    lon: 18.0686,
    businessDescription: "",
    targetCustomerProfile: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("locations")
        .update({
          name: formData.businessName,
          business_type: formData.businessType,
          address_line: formData.address,
          lat: formData.lat,
          lon: formData.lon,
          business_description: formData.businessDescription || null,
          target_customer_profile: formData.targetCustomerProfile || null,
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
              onValueChange={(value) => setFormData({ ...formData, businessType: value as "restaurant" | "cafe" | "bar" })}
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

          <div className="space-y-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              <span>{t('optional')}: Hjälp AI:n skapa bättre kampanjer</span>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessDescription">
                {t('businessDescriptionLabel')}
                <span className="text-xs text-muted-foreground ml-2">({t('optional')})</span>
              </Label>
              <Textarea
                id="businessDescription"
                value={formData.businessDescription}
                onChange={(e) => {
                  if (e.target.value.length <= 500) {
                    setFormData({ ...formData, businessDescription: e.target.value });
                  }
                }}
                placeholder={t('businessDescriptionPlaceholder')}
                className="min-h-[80px]"
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.businessDescription.length}/500
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetCustomer">
                {t('targetCustomerLabel')}
                <span className="text-xs text-muted-foreground ml-2">({t('optional')})</span>
              </Label>
              <Textarea
                id="targetCustomer"
                value={formData.targetCustomerProfile}
                onChange={(e) => {
                  if (e.target.value.length <= 300) {
                    setFormData({ ...formData, targetCustomerProfile: e.target.value });
                  }
                }}
                placeholder={t('targetCustomerPlaceholder')}
                className="min-h-[60px]"
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.targetCustomerProfile.length}/300
              </p>
            </div>

            <p className="text-xs text-muted-foreground italic">
              Du kan lägga till mer information senare i inställningar
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("heroCtaPrimary")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};