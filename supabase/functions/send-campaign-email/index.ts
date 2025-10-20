import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  campaignId: string;
  recipientEmail: string;
  campaign: any;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    const { campaignId, recipientEmail, campaign }: EmailRequest = await req.json();

    console.log("Sending campaign email to:", recipientEmail);

    // Build HTML email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%);
              color: #1a1a1a;
              padding: 30px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background: #ffffff;
              padding: 30px;
              border: 1px solid #e0e0e0;
            }
            .section {
              margin-bottom: 25px;
              padding: 15px;
              background: #f9f9f9;
              border-radius: 6px;
            }
            .section h3 {
              margin-top: 0;
              color: #D4AF37;
            }
            .footer {
              background: #f5f5f5;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-radius: 0 0 8px 8px;
            }
            .ad-box {
              border: 2px solid #D4AF37;
              padding: 15px;
              margin: 10px 0;
              border-radius: 6px;
              background: #fff;
            }
            .platform-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .meta-badge {
              background: #1877f2;
              color: white;
            }
            .tiktok-badge {
              background: #000000;
              color: white;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎯 Kampanjförslag</h1>
            <p>${campaign.title}</p>
          </div>
          
          <div class="content">
            <div class="section">
              <h3>📋 Beskrivning</h3>
              <p>${campaign.description}</p>
            </div>

            <div class="section">
              <h3>👥 Målgrupp</h3>
              <p>${campaign.target_audience}</p>
            </div>

            <div class="section">
              <h3>📅 Rekommenderad timing</h3>
              <p>${campaign.recommended_timing}</p>
            </div>

            <div class="section">
              <h3>📢 Kanaler</h3>
              <p>${campaign.channels}</p>
            </div>

            <div class="section">
              <h3>🎯 Förväntade resultat</h3>
              <p>${campaign.expected_outcome}</p>
            </div>

            <div class="section">
              <h3>✅ Genomförande</h3>
              <ol>
                ${campaign.action_steps.map((step: string) => `<li>${step}</li>`).join('')}
              </ol>
            </div>

            ${campaign.ad_ideas ? `
              <div class="section">
                <h3>📱 Annonsidéer för Sociala Medier</h3>
                ${campaign.ad_ideas.map((ad: any) => `
                  <div class="ad-box">
                    <span class="platform-badge ${ad.platform === 'Meta' ? 'meta-badge' : 'tiktok-badge'}">
                      ${ad.platform}
                    </span>
                    <p><strong>Annonstext:</strong> "${ad.ad_copy}"</p>
                    <p><strong>Visuellt koncept:</strong> ${ad.visual_concept}</p>
                    <p><strong>Call-to-action:</strong> ${ad.cta}</p>
                    <p><strong>Målgrupp:</strong> ${ad.targeting}</p>
                    <p><strong>Budget:</strong> ${ad.budget_recommendation}</p>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <div class="footer">
            <p>Detta är ett AI-genererat kampanjförslag från Spotlight Events</p>
            <p>© ${new Date().getFullYear()} Spotlight Events</p>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Spotlight Events <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: `Kampanjförslag: ${campaign.title}`,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-campaign-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});