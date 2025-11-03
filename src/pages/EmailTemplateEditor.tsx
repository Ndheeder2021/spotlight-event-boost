import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Upload, Save, Eye } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface EmailTemplate {
  headerTitle: string;
  headerSubtitle: string;
  headerColor: string;
  mainTitle: string;
  mainText: string;
  ctaText: string;
  ctaUrl: string;
  footerText: string;
  logoUrl?: string;
  heroImageUrl?: string;
}

const EmailTemplateEditor = () => {
  const [template, setTemplate] = useState<EmailTemplate>({
    headerTitle: "Välkommen till Spotlight Events",
    headerSubtitle: "Din guide till framgångsrik event marketing",
    headerColor: "linear-gradient(135deg, #5046e4 0%, #6b63ff 100%)",
    mainTitle: "Tack för ditt intresse!",
    mainText: "Vi är glada att du vill lära dig mer om hur Spotlight Events kan hjälpa dig att hitta de perfekta evenemangen för din marknadsföring.",
    ctaText: "Kom igång nu",
    ctaUrl: "https://spotlightevents.online/dashboard",
    footerText: "© 2024 Spotlight Events. Alla rättigheter förbehållna.",
  });

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'hero') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `email-assets/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('email-templates')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('email-templates')
        .getPublicUrl(filePath);

      setTemplate(prev => ({
        ...prev,
        [type === 'logo' ? 'logoUrl' : 'heroImageUrl']: publicUrl
      }));

      toast.success("Bild uppladdad!");
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Kunde inte ladda upp bild");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    // Save template to database or local storage
    localStorage.setItem('emailTemplate', JSON.stringify(template));
    toast.success("Mall sparad!");
  };

  const getEmailPreviewHtml = () => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${template.headerTitle}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; background-color: #f4f7fa; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    
    <!-- Header -->
    <div style="background: ${template.headerColor}; padding: 48px 40px; text-align: center;">
      ${template.logoUrl ? `<img src="${template.logoUrl}" alt="Logo" style="max-width: 150px; margin-bottom: 20px;" />` : ''}
      <h1 style="color: #ffffff; font-size: 28px; font-weight: 600; margin: 0; letter-spacing: -0.5px;">${template.headerTitle}</h1>
      <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin: 12px 0 0 0; font-weight: 400;">${template.headerSubtitle}</p>
    </div>

    ${template.heroImageUrl ? `
    <!-- Hero Image -->
    <div style="width: 100%; overflow: hidden;">
      <img src="${template.heroImageUrl}" alt="Hero" style="width: 100%; height: auto; display: block;" />
    </div>
    ` : ''}

    <!-- Main Content -->
    <div style="padding: 40px;">
      <h2 style="color: #1a1a1a; font-size: 24px; font-weight: 600; margin: 0 0 16px 0; line-height: 1.3;">${template.mainTitle}</h2>
      
      <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">${template.mainText}</p>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="${template.ctaUrl}" style="display: inline-block; background: linear-gradient(135deg, #5046e4 0%, #6b63ff 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(80, 70, 228, 0.3);">${template.ctaText}</a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f8fafc; padding: 32px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
      <p style="color: #718096; font-size: 14px; margin: 0; line-height: 1.5;">${template.footerText}</p>
    </div>
  </div>
</body>
</html>
    `;
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Email Mall Editor</h1>
            <p className="text-muted-foreground mt-1">Anpassa din email-mall för leads</p>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Spara Mall
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Header</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="logoUpload">Logo</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="logoUpload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'logo')}
                      disabled={uploading}
                    />
                    <Upload className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="headerTitle">Rubrik</Label>
                  <Input
                    id="headerTitle"
                    value={template.headerTitle}
                    onChange={(e) => setTemplate({ ...template, headerTitle: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="headerSubtitle">Underrubrik</Label>
                  <Input
                    id="headerSubtitle"
                    value={template.headerSubtitle}
                    onChange={(e) => setTemplate({ ...template, headerSubtitle: e.target.value })}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Hero Bild</h2>
              <div>
                <Label htmlFor="heroUpload">Ladda upp bild/video</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="heroUpload"
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => handleImageUpload(e, 'hero')}
                    disabled={uploading}
                  />
                  <Upload className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Innehåll</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="mainTitle">Huvudrubrik</Label>
                  <Input
                    id="mainTitle"
                    value={template.mainTitle}
                    onChange={(e) => setTemplate({ ...template, mainTitle: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="mainText">Huvudtext</Label>
                  <Textarea
                    id="mainText"
                    value={template.mainText}
                    onChange={(e) => setTemplate({ ...template, mainText: e.target.value })}
                    rows={6}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">CTA Knapp</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ctaText">Knapptext</Label>
                  <Input
                    id="ctaText"
                    value={template.ctaText}
                    onChange={(e) => setTemplate({ ...template, ctaText: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="ctaUrl">Länk URL</Label>
                  <Input
                    id="ctaUrl"
                    value={template.ctaUrl}
                    onChange={(e) => setTemplate({ ...template, ctaUrl: e.target.value })}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Footer</h2>
              <div>
                <Label htmlFor="footerText">Footer Text</Label>
                <Textarea
                  id="footerText"
                  value={template.footerText}
                  onChange={(e) => setTemplate({ ...template, footerText: e.target.value })}
                  rows={2}
                />
              </div>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-8 h-fit">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Förhandsvisning
                </h2>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 overflow-auto max-h-[800px]">
                <iframe
                  srcDoc={getEmailPreviewHtml()}
                  className="w-full h-[700px] bg-white rounded border-0"
                  title="Email Preview"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateEditor;
