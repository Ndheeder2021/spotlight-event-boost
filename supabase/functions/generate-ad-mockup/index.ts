import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { adIdea, campaignId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    console.log("Generating ad mockup for:", adIdea);

    // Generate image using Lovable AI (Nano banana model)
    const imagePrompt = `Create a professional ${adIdea.platform} advertisement mockup for a marketing campaign. 
Visual concept: ${adIdea.visual_concept}
Ad copy text: "${adIdea.ad_copy}"
Style: Modern, clean, professional marketing design with brand colors gold (#d1b300) and black.
The mockup should look like it could be used on ${adIdea.platform} social media platform.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: imagePrompt,
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable AI error:", response.status, errorText);
      throw new Error(`Failed to generate image: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error("No image generated");
    }

    // Save to attachments if campaignId provided
    if (campaignId) {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        {
          global: {
            headers: { Authorization: req.headers.get("Authorization")! },
          },
        }
      );

      const { data: campaign } = await supabase
        .from("campaigns")
        .select("tenant_id")
        .eq("id", campaignId)
        .single();

      if (campaign) {
        await supabase.from("campaign_attachments").insert({
          campaign_id: campaignId,
          tenant_id: campaign.tenant_id,
          file_name: `${adIdea.platform}-mockup.png`,
          file_type: "image",
          file_data: imageUrl,
          metadata: { platform: adIdea.platform, ad_copy: adIdea.ad_copy },
        });
      }
    }

    return new Response(
      JSON.stringify({ imageUrl }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error generating ad mockup:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});