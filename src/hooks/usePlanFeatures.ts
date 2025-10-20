import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type PlanType = "starter" | "professional" | "enterprise";

interface PlanFeatures {
  canSaveCampaigns: boolean;
  canExportPDF: boolean;
  canShareCampaigns: boolean;
  canSendEmail: boolean;
  canViewAnalytics: boolean;
  canGenerateImages: boolean;
  canUseMultiLanguage: boolean;
  canABTest: boolean;
  canAddComments: boolean;
  maxCampaigns: number;
  maxCampaignsPerMonth: number;
  plan: PlanType;
}

const PLAN_FEATURES: Record<PlanType, PlanFeatures> = {
  starter: {
    canSaveCampaigns: true,
    canExportPDF: false,
    canShareCampaigns: false,
    canSendEmail: false,
    canViewAnalytics: false,
    canGenerateImages: false,
    canUseMultiLanguage: false,
    canABTest: false,
    canAddComments: false,
    maxCampaigns: 10,
    maxCampaignsPerMonth: 5,
    plan: "starter",
  },
  professional: {
    canSaveCampaigns: true,
    canExportPDF: true,
    canShareCampaigns: true,
    canSendEmail: true,
    canViewAnalytics: true,
    canGenerateImages: true,
    canUseMultiLanguage: true,
    canABTest: true,
    canAddComments: true,
    maxCampaigns: -1, // unlimited
    maxCampaignsPerMonth: -1, // unlimited
    plan: "professional",
  },
  enterprise: {
    canSaveCampaigns: true,
    canExportPDF: true,
    canShareCampaigns: true,
    canSendEmail: true,
    canViewAnalytics: true,
    canGenerateImages: true,
    canUseMultiLanguage: true,
    canABTest: true,
    canAddComments: true,
    maxCampaigns: -1, // unlimited
    maxCampaignsPerMonth: -1, // unlimited
    plan: "enterprise",
  },
};

export function usePlanFeatures() {
  const [features, setFeatures] = useState<PlanFeatures>(PLAN_FEATURES.starter);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: userRole } = await supabase
        .from("user_roles")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

      if (!userRole) {
        setLoading(false);
        return;
      }

      const { data: tenant } = await supabase
        .from("tenants")
        .select("plan")
        .eq("id", userRole.tenant_id)
        .single();

      if (tenant?.plan) {
        setFeatures(PLAN_FEATURES[tenant.plan as PlanType] || PLAN_FEATURES.starter);
      }
    } catch (error) {
      console.error("Error loading plan:", error);
    } finally {
      setLoading(false);
    }
  };

  return { features, loading };
}