import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { TestTube2, Plus, TrendingUp, Users, Eye, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ABVariant {
  id: string;
  name: string;
  description: string;
  views: number;
  conversions: number;
  conversionRate: number;
}

interface ABTestManagerProps {
  campaignId: string;
  tenantId: string;
}

export function ABTestManager({ campaignId, tenantId }: ABTestManagerProps) {
  const [variants, setVariants] = useState<ABVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newVariantName, setNewVariantName] = useState("");
  const [newVariantDesc, setNewVariantDesc] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadVariants();
  }, [campaignId]);

  const loadVariants = async () => {
    try {
      // Load analytics data for variants
      const { data, error } = await supabase
        .from("campaign_analytics")
        .select("*")
        .eq("campaign_id", campaignId)
        .in("metric_type", ["ab_test_view", "ab_test_conversion"]);

      if (error) throw error;

      // Group by variant and calculate stats
      const variantMap = new Map<string, ABVariant>();
      
      data?.forEach((metric) => {
        const metadata = metric.metadata as any;
        const variantId = metadata?.variant_id || "original";
        const variantName = metadata?.variant_name || "Original";
        
        if (!variantMap.has(variantId)) {
          variantMap.set(variantId, {
            id: variantId,
            name: variantName,
            description: metadata?.variant_description || "",
            views: 0,
            conversions: 0,
            conversionRate: 0,
          });
        }

        const variant = variantMap.get(variantId)!;
        if (metric.metric_type === "ab_test_view") {
          variant.views += Number(metric.metric_value);
        } else if (metric.metric_type === "ab_test_conversion") {
          variant.conversions += Number(metric.metric_value);
        }
      });

      // Calculate conversion rates
      const variantsList = Array.from(variantMap.values()).map(v => ({
        ...v,
        conversionRate: v.views > 0 ? (v.conversions / v.views) * 100 : 0,
      }));

      setVariants(variantsList);
    } catch (error: any) {
      toast.error("Kunde inte ladda A/B-test data");
    } finally {
      setLoading(false);
    }
  };

  const createVariant = async () => {
    if (!newVariantName.trim()) {
      toast.error("Ange ett namn för varianten");
      return;
    }

    setCreating(true);
    try {
      const variantId = `variant_${Date.now()}`;

      // Create initial analytics entries for the variant
      const { error } = await supabase
        .from("campaign_analytics")
        .insert([
          {
            campaign_id: campaignId,
            tenant_id: tenantId,
            metric_type: "ab_test_view",
            metric_value: 0,
            metadata: {
              variant_id: variantId,
              variant_name: newVariantName,
              variant_description: newVariantDesc,
            },
          },
          {
            campaign_id: campaignId,
            tenant_id: tenantId,
            metric_type: "ab_test_conversion",
            metric_value: 0,
            metadata: {
              variant_id: variantId,
              variant_name: newVariantName,
              variant_description: newVariantDesc,
            },
          },
        ]);

      if (error) throw error;

      toast.success("Variant skapad!");
      setNewVariantName("");
      setNewVariantDesc("");
      setShowCreateDialog(false);
      loadVariants();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setCreating(false);
    }
  };

  const recordView = async (variantId: string) => {
    try {
      const { data: existing } = await supabase
        .from("campaign_analytics")
        .select("*")
        .eq("campaign_id", campaignId)
        .eq("metric_type", "ab_test_view")
        .eq("metadata->>variant_id", variantId)
        .single();

      if (existing) {
        await supabase
          .from("campaign_analytics")
          .update({ metric_value: Number(existing.metric_value) + 1 })
          .eq("id", existing.id);
      }

      loadVariants();
    } catch (error: any) {
      console.error("Error recording view:", error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TestTube2 className="h-5 w-5" />
              A/B Testing
            </CardTitle>
            <CardDescription>
              Testa olika varianter av din kampanj
            </CardDescription>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Ny variant
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {variants.length === 0 ? (
          <div className="text-center py-8">
            <TestTube2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Inga A/B-testvarianter ännu. Skapa din första variant för att börja testa!
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Skapa variant
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {variants.map((variant) => (
              <div
                key={variant.id}
                className="p-4 rounded-lg border hover:border-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{variant.name}</h4>
                    {variant.description && (
                      <p className="text-sm text-muted-foreground">{variant.description}</p>
                    )}
                  </div>
                  {variant.conversionRate > 0 && (
                    <Badge variant={variant.conversionRate > 5 ? "default" : "secondary"}>
                      {variant.conversionRate.toFixed(1)}% CR
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">{variant.views}</p>
                      <p className="text-xs text-muted-foreground">Visningar</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">{variant.conversions}</p>
                      <p className="text-xs text-muted-foreground">Konverteringar</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">{variant.conversionRate.toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">Konverteringsgrad</p>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3"
                  onClick={() => recordView(variant.id)}
                >
                  Simulera visning
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Create Variant Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Skapa ny A/B-testvariant</DialogTitle>
            <DialogDescription>
              Skapa en ny variant för att testa olika versioner av din kampanj
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="variant-name">Variantnamn *</Label>
              <Input
                id="variant-name"
                value={newVariantName}
                onChange={(e) => setNewVariantName(e.target.value)}
                placeholder="t.ex. Version B"
              />
            </div>
            <div>
              <Label htmlFor="variant-desc">Beskrivning</Label>
              <Input
                id="variant-desc"
                value={newVariantDesc}
                onChange={(e) => setNewVariantDesc(e.target.value)}
                placeholder="Vad är annorlunda i denna variant?"
              />
            </div>
            <Button
              onClick={createVariant}
              disabled={creating}
              className="w-full"
            >
              {creating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Skapa variant
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
