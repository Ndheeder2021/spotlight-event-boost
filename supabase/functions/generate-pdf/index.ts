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
    console.log("PDF generation request received");
    
    const { campaignId } = await req.json();
    console.log("Campaign ID:", campaignId);

    if (!campaignId) {
      return new Response(JSON.stringify({ error: "Campaign ID required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get campaign data from database
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const { data: campaign, error: campaignError } = await supabase
      .from("campaigns")
      .select("*")
      .eq("id", campaignId)
      .single();

    if (campaignError || !campaign) {
      console.error("Campaign error:", campaignError);
      return new Response(JSON.stringify({ error: "Campaign not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Campaign found:", campaign.title);

    // Use AI generated data for PDF content
    const campaignData = campaign.ai_generated_data || {};

    // Create HTML for PDF
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${campaign.title}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
    h1 { color: #333; border-bottom: 3px solid #8B5CF6; padding-bottom: 10px; }
    h2 { color: #8B5CF6; margin-top: 30px; }
    h3 { color: #6366F1; }
    .section { margin: 20px 0; }
    .label { font-weight: bold; color: #666; }
    .content { margin: 10px 0; }
    .ad-box { border: 2px solid #8B5CF6; padding: 20px; margin: 15px 0; border-radius: 8px; background: #f9fafb; }
    ol { margin-left: 20px; }
    li { margin: 5px 0; }
    @media print {
      body { padding: 20px; }
      .ad-box { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <h1>${campaign.title}</h1>
  
  <div class="section">
    <p class="label">Beskrivning:</p>
    <p class="content">${campaign.description || 'Ingen beskrivning tillgänglig'}</p>
  </div>

  ${campaignData.target_audience ? `
  <div class="section">
    <p class="label">Målgrupp:</p>
    <p class="content">${campaignData.target_audience}</p>
  </div>
  ` : ''}

  ${campaignData.recommended_timing ? `
  <div class="section">
    <p class="label">Rekommenderad timing:</p>
    <p class="content">${campaignData.recommended_timing}</p>
  </div>
  ` : ''}

  ${campaignData.channels ? `
  <div class="section">
    <p class="label">Kanaler:</p>
    <p class="content">${campaignData.channels}</p>
  </div>
  ` : ''}

  ${campaignData.expected_outcome ? `
  <div class="section">
    <p class="label">Förväntade resultat:</p>
    <p class="content">${campaignData.expected_outcome}</p>
  </div>
  ` : ''}

  ${campaignData.action_steps && campaignData.action_steps.length > 0 ? `
  <h2>Genomförandesteg</h2>
  <ol>
    ${campaignData.action_steps.map((step: string) => `<li>${step}</li>`).join('')}
  </ol>
  ` : ''}

  ${campaignData.ad_ideas && campaignData.ad_ideas.length > 0 ? `
  <h2>Annonsidéer</h2>
  ${campaignData.ad_ideas.map((ad: any) => `
    <div class="ad-box">
      <h3>${ad.platform || 'Annonseringplattform'}</h3>
      <div class="section">
        <p class="label">Annonstext:</p>
        <p class="content">${ad.ad_copy || 'Ingen text tillgänglig'}</p>
      </div>
      <div class="section">
        <p class="label">Visuellt koncept:</p>
        <p class="content">${ad.visual_concept || 'Inget koncept beskrivet'}</p>
      </div>
      <div class="section">
        <p class="label">Call-to-Action:</p>
        <p class="content">${ad.cta || 'Ingen CTA angiven'}</p>
      </div>
      <div class="section">
        <p class="label">Målgrupp:</p>
        <p class="content">${ad.targeting || 'Ingen målgrupp angiven'}</p>
      </div>
      <div class="section">
        <p class="label">Budget:</p>
        <p class="content">${ad.budget_recommendation || 'Ingen budget angiven'}</p>
      </div>
    </div>
  `).join('')}
  ` : ''}
</body>
</html>
    `;

    console.log("PDF HTML generated successfully");

    return new Response(
      JSON.stringify({
        html: html,
        success: true
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error generating PDF:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
