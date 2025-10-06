import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { campaign } = await req.json();

    // Create HTML for PDF
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; }
    h1 { color: #333; border-bottom: 3px solid #0EA5E9; padding-bottom: 10px; }
    h2 { color: #0EA5E9; margin-top: 30px; }
    .section { margin: 20px 0; }
    .label { font-weight: bold; color: #666; }
    .content { margin: 10px 0; }
    .ad-box { border: 2px solid #0EA5E9; padding: 20px; margin: 15px 0; border-radius: 8px; }
    ol { margin-left: 20px; }
    li { margin: 5px 0; }
  </style>
</head>
<body>
  <h1>${campaign.title}</h1>
  
  <div class="section">
    <p class="label">Beskrivning:</p>
    <p class="content">${campaign.description}</p>
  </div>

  ${campaign.target_audience ? `
  <div class="section">
    <p class="label">Målgrupp:</p>
    <p class="content">${campaign.target_audience}</p>
  </div>
  ` : ''}

  ${campaign.recommended_timing ? `
  <div class="section">
    <p class="label">Rekommenderad timing:</p>
    <p class="content">${campaign.recommended_timing}</p>
  </div>
  ` : ''}

  ${campaign.channels ? `
  <div class="section">
    <p class="label">Kanaler:</p>
    <p class="content">${campaign.channels}</p>
  </div>
  ` : ''}

  ${campaign.expected_outcome ? `
  <div class="section">
    <p class="label">Förväntade resultat:</p>
    <p class="content">${campaign.expected_outcome}</p>
  </div>
  ` : ''}

  ${campaign.action_steps && campaign.action_steps.length > 0 ? `
  <h2>Genomförandesteg</h2>
  <ol>
    ${campaign.action_steps.map((step: string) => `<li>${step}</li>`).join('')}
  </ol>
  ` : ''}

  ${campaign.ad_ideas && campaign.ad_ideas.length > 0 ? `
  <h2>Annonsidéer</h2>
  ${campaign.ad_ideas.map((ad: any) => `
    <div class="ad-box">
      <h3>${ad.platform}</h3>
      <div class="section">
        <p class="label">Annonstext:</p>
        <p class="content">${ad.ad_copy}</p>
      </div>
      <div class="section">
        <p class="label">Visuellt koncept:</p>
        <p class="content">${ad.visual_concept}</p>
      </div>
      <div class="section">
        <p class="label">Call-to-Action:</p>
        <p class="content">${ad.cta}</p>
      </div>
      <div class="section">
        <p class="label">Målgrupp:</p>
        <p class="content">${ad.targeting}</p>
      </div>
      <div class="section">
        <p class="label">Budget:</p>
        <p class="content">${ad.budget_recommendation}</p>
      </div>
    </div>
  `).join('')}
  ` : ''}
</body>
</html>
    `;

    // Return HTML as base64 (client will print to PDF)
    const base64Html = btoa(unescape(encodeURIComponent(html)));

    return new Response(
      JSON.stringify({
        pdf: base64Html,
        html: html,
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
