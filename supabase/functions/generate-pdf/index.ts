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
    const { campaignId } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get campaign data
    const { data: campaign, error: campaignError } = await supabase
      .from("campaigns")
      .select("*, events(*)")
      .eq("id", campaignId)
      .single();

    if (campaignError) throw campaignError;

    // Generate HTML for PDF
    const html = generateCampaignHTML(campaign);

    // In a real implementation, you would use a PDF library like puppeteer
    // For now, we'll return the HTML and let the client handle PDF generation
    // Or use an external service like PDFShift, DocRaptor, etc.

    // Simple base64 encoding of HTML as placeholder
    const pdfData = btoa(html);

    // Save to attachments
    const { error: attachmentError } = await supabase
      .from("campaign_attachments")
      .insert({
        campaign_id: campaignId,
        tenant_id: campaign.tenant_id,
        file_name: `${campaign.title}-campaign.pdf`,
        file_type: "pdf",
        file_data: pdfData,
      });

    if (attachmentError) throw attachmentError;

    return new Response(
      JSON.stringify({ success: true, pdfData }),
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

function generateCampaignHTML(campaign: any): string {
  const aiData = campaign.ai_generated_data || {};
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${campaign.title}</title>
  <style>
    body {
      font-family: 'Helvetica', 'Arial', sans-serif;
      line-height: 1.6;
      color: #111;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
    }
    .header {
      border-bottom: 4px solid #d1b300;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    h1 {
      color: #111;
      font-size: 32px;
      margin: 0;
    }
    .subtitle {
      color: #666;
      font-size: 18px;
      margin-top: 10px;
    }
    .section {
      margin: 30px 0;
      padding: 20px;
      background: #f9f9f9;
      border-left: 4px solid #d1b300;
    }
    .section h2 {
      color: #111;
      font-size: 24px;
      margin-top: 0;
    }
    .ad-idea {
      margin: 20px 0;
      padding: 15px;
      background: white;
      border: 1px solid #ddd;
    }
    .ad-platform {
      font-weight: bold;
      color: #d1b300;
      font-size: 18px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${campaign.title}</h1>
    <div class="subtitle">${campaign.description}</div>
  </div>

  ${aiData.target_audience ? `
  <div class="section">
    <h2>Målgrupp</h2>
    <p>${aiData.target_audience}</p>
  </div>
  ` : ''}

  ${aiData.recommended_timing ? `
  <div class="section">
    <h2>Rekommenderad Timing</h2>
    <p>${aiData.recommended_timing}</p>
  </div>
  ` : ''}

  ${aiData.channels ? `
  <div class="section">
    <h2>Kanaler</h2>
    <p>${aiData.channels}</p>
  </div>
  ` : ''}

  ${aiData.expected_outcome ? `
  <div class="section">
    <h2>Förväntade Resultat</h2>
    <p>${aiData.expected_outcome}</p>
  </div>
  ` : ''}

  ${aiData.action_steps && aiData.action_steps.length ? `
  <div class="section">
    <h2>Genomförande</h2>
    <ol>
      ${aiData.action_steps.map((step: string) => `<li>${step}</li>`).join('')}
    </ol>
  </div>
  ` : ''}

  ${aiData.ad_ideas && aiData.ad_ideas.length ? `
  <div class="section">
    <h2>Annonsidéer</h2>
    ${aiData.ad_ideas.map((ad: any) => `
      <div class="ad-idea">
        <div class="ad-platform">${ad.platform}</div>
        <p><strong>Annonstext:</strong> ${ad.ad_copy}</p>
        <p><strong>Visuellt koncept:</strong> ${ad.visual_concept}</p>
        <p><strong>CTA:</strong> ${ad.cta}</p>
        <p><strong>Målgrupp:</strong> ${ad.targeting}</p>
        <p><strong>Budget:</strong> ${ad.budget_recommendation}</p>
      </div>
    `).join('')}
  </div>
  ` : ''}

  <div class="section">
    <p style="text-align: center; color: #666; font-size: 14px;">
      Genererad av Spotlight Campaign Generator
    </p>
  </div>
</body>
</html>
  `;
}