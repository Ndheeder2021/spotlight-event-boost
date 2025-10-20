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

    console.log("Generating ad mockup for:", adIdea);

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY not configured");
    }

    // Generate image using OpenAI's gpt-image-1 model
    const imagePrompt = `Create a professional ${adIdea.platform} social media advertisement mockup for a marketing campaign. 

Visual concept: ${adIdea.visual_concept}

Ad copy text to include: "${adIdea.ad_copy}"

Call-to-action button: "${adIdea.cta}"

Style requirements:
- Modern, clean, and professional marketing design
- Use brand colors: gold (#d1b300) and black
- ${adIdea.platform === "Meta" ? "Format should look like a Facebook/Instagram ad with proper dimensions" : "Format should be vertical/mobile-first for TikTok with dynamic, engaging visuals"}
- Include the ad copy text prominently in the design
- Add a clear call-to-action button with "${adIdea.cta}"
- Professional product/food photography style
- High quality, photorealistic rendering`;

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: imagePrompt,
        n: 1,
        size: adIdea.platform === "Meta" ? "1536x1024" : "1024x1536",
        quality: "high",
        output_format: "png",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI error:", response.status, errorText);
      throw new Error(`Failed to generate image: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const imageUrl = data.data?.[0]?.b64_json;

    if (!imageUrl) {
      console.error("No image in response:", data);
      throw new Error("No image generated");
    }

    // Convert base64 to data URL
    const dataUrl = `data:image/png;base64,${imageUrl}`;

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
          file_data: dataUrl,
          metadata: { platform: adIdea.platform, ad_copy: adIdea.ad_copy },
        });
      }
    }

    return new Response(
      JSON.stringify({ imageUrl: dataUrl }),
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