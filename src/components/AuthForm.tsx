import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { AddressAutocomplete } from "./AddressAutocomplete";

interface AuthFormProps {
  onSuccess: () => void;
  initialMode?: "login" | "signup";
}

export const AuthForm = ({ onSuccess, initialMode = "login" }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [businessType, setBusinessType] = useState("restaurant");
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const validatePassword = (pwd: string) => {
    const minLength = pwd.length >= 8;
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    
    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
    };
  };

  const passwordValidation = validatePassword(password);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/`,
      });
      if (error) throw error;
      toast.success("Återställningslänk skickad! Kontrollera din e-post.");
      setIsForgotPassword(false);
      setIsLogin(true);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Välkommen tillbaka!");
        onSuccess();
      } else {
        // Validate signup fields
        if (!businessName.trim()) {
          toast.error("Företagsnamn är obligatoriskt");
          setLoading(false);
          return;
        }
        if (!phoneNumber.trim()) {
          toast.error("Telefonnummer är obligatoriskt");
          setLoading(false);
          return;
        }
        if (!address.trim()) {
          toast.error("Adress är obligatorisk");
          setLoading(false);
          return;
        }
        if (!businessType) {
          toast.error("Typ av verksamhet är obligatorisk");
          setLoading(false);
          return;
        }
        
        // Validate password
        if (!passwordValidation.isValid) {
          toast.error("Lösenordet uppfyller inte säkerhetskraven");
          setLoading(false);
          return;
        }
        
        // Validate password confirmation
        if (password !== confirmPassword) {
          toast.error("Lösenorden matchar inte");
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              business_name: businessName,
              phone_number: phoneNumber,
              business_type: businessType,
              address: address,
              lat: coordinates?.lat,
              lon: coordinates?.lon,
            },
          },
        });
        if (error) throw error;
        toast.success("Konto skapat! Kontrollera din e-post för att verifiera ditt konto.");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Forgot password view
  if (isForgotPassword) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Återställ lösenord</CardTitle>
          <CardDescription>
            Ange din e-postadress så skickar vi en återställningslänk
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-post</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="din@email.se"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Skicka återställningslänk
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                setIsForgotPassword(false);
                setIsLogin(true);
              }}
            >
              Tillbaka till inloggning
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{isLogin ? "Logga in" : "Skapa konto"}</CardTitle>
        <CardDescription>
          {isLogin ? "Logga in på ditt Spotlight-konto" : "Kom igång med Spotlight"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-post</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {!isLogin && (
            <>
              <div className="space-y-2">
                <Label htmlFor="businessName">Företagsnamn</Label>
                <Input
                  id="businessName"
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                  placeholder="Ex: Café Bröd & Salt"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType">Typ av verksamhet</Label>
                <Select value={businessType} onValueChange={setBusinessType} required>
                  <SelectTrigger id="businessType">
                    <SelectValue placeholder="Välj typ av verksamhet" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="cafe">Café</SelectItem>
                    <SelectItem value="bar">Bar</SelectItem>
                    <SelectItem value="fastfood">Snabbmat</SelectItem>
                    <SelectItem value="bakery">Bageri</SelectItem>
                    <SelectItem value="hotel">Hotell</SelectItem>
                    <SelectItem value="retail">Butik</SelectItem>
                    <SelectItem value="other">Annat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adress</Label>
                <AddressAutocomplete
                  value={address}
                  onChange={(newAddress, coords) => {
                    setAddress(newAddress);
                    if (coords) setCoordinates(coords);
                  }}
                  placeholder="Ex: Drottninggatan 1, Stockholm"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Telefonnummer</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  placeholder="Ex: 070-123 45 67"
                />
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label htmlFor="password">Lösenord</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            {!isLogin && password && (
              <div className="text-xs space-y-1 mt-2">
                <p className="font-medium text-muted-foreground">Lösenordskrav:</p>
                <div className="space-y-0.5">
                  <p className={passwordValidation.minLength ? "text-green-600" : "text-muted-foreground"}>
                    {passwordValidation.minLength ? "✓" : "○"} Minst 8 tecken
                  </p>
                  <p className={passwordValidation.hasUpperCase ? "text-green-600" : "text-muted-foreground"}>
                    {passwordValidation.hasUpperCase ? "✓" : "○"} En stor bokstav
                  </p>
                  <p className={passwordValidation.hasLowerCase ? "text-green-600" : "text-muted-foreground"}>
                    {passwordValidation.hasLowerCase ? "✓" : "○"} En liten bokstav
                  </p>
                  <p className={passwordValidation.hasNumber ? "text-green-600" : "text-muted-foreground"}>
                    {passwordValidation.hasNumber ? "✓" : "○"} En siffra
                  </p>
                  <p className={passwordValidation.hasSpecialChar ? "text-green-600" : "text-muted-foreground"}>
                    {passwordValidation.hasSpecialChar ? "✓" : "○"} Ett specialtecken (!@#$%...)
                  </p>
                </div>
              </div>
            )}
          </div>
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Bekräfta lösenord</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-destructive">Lösenorden matchar inte</p>
              )}
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLogin ? "Logga in" : "Skapa konto"}
          </Button>
          {isLogin && (
            <Button
              type="button"
              variant="link"
              className="w-full text-sm text-muted-foreground hover:text-accent"
              onClick={() => setIsForgotPassword(true)}
            >
              Glömt lösenord?
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Behöver du ett konto?" : "Har du redan ett konto?"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};