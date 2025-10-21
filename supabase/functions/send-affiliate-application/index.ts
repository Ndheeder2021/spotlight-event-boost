import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AffiliateApplicationRequest {
  name: string;
  email: string;
  company?: string;
  website?: string;
  description: string;
  audience: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, company, website, description, audience }: AffiliateApplicationRequest = await req.json();

    console.log("Processing affiliate application from:", email);

    // Send application email to affiliate team
    const emailResponse = await resend.emails.send({
      from: "Spotlight Affiliate <onboarding@resend.dev>",
      to: ["affiliate@spotlightevents.online"],
      reply_to: email,
      subject: `Ny Affiliate-ansökan från ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                border-radius: 8px;
                margin-bottom: 30px;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
              }
              .section {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 20px;
              }
              .section h2 {
                margin-top: 0;
                font-size: 18px;
                color: #667eea;
              }
              .field {
                margin-bottom: 15px;
              }
              .field-label {
                font-weight: 600;
                color: #666;
                display: block;
                margin-bottom: 5px;
              }
              .field-value {
                color: #333;
                word-wrap: break-word;
              }
              .footer {
                text-align: center;
                color: #999;
                font-size: 12px;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>⚡ Ny Affiliate-ansökan</h1>
            </div>
            
            <div class="section">
              <h2>Kontaktinformation</h2>
              <div class="field">
                <span class="field-label">Namn:</span>
                <span class="field-value">${name}</span>
              </div>
              <div class="field">
                <span class="field-label">E-post:</span>
                <span class="field-value"><a href="mailto:${email}">${email}</a></span>
              </div>
              ${company ? `
              <div class="field">
                <span class="field-label">Företag:</span>
                <span class="field-value">${company}</span>
              </div>
              ` : ''}
              ${website ? `
              <div class="field">
                <span class="field-label">Webbplats:</span>
                <span class="field-value"><a href="${website}" target="_blank">${website}</a></span>
              </div>
              ` : ''}
            </div>

            <div class="section">
              <h2>Marknadsföringsstrategi</h2>
              <div class="field">
                <span class="field-label">Hur planerar de att marknadsföra Spotlight:</span>
                <p class="field-value">${description}</p>
              </div>
            </div>

            <div class="section">
              <h2>Målgrupp</h2>
              <div class="field">
                <span class="field-label">Beskrivning av målgrupp:</span>
                <p class="field-value">${audience}</p>
              </div>
            </div>

            <div class="footer">
              <p>Detta är en automatisk notifiering från Spotlight Affiliate-systemet</p>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Application email sent successfully:", emailResponse);

    // Send confirmation email to applicant
    await resend.emails.send({
      from: "Spotlight Affiliate <onboarding@resend.dev>",
      to: [email],
      subject: "Tack för din Affiliate-ansökan till Spotlight",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                border-radius: 8px;
                margin-bottom: 30px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
              }
              .content {
                padding: 20px 0;
              }
              .content p {
                margin-bottom: 15px;
              }
              .highlight {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #667eea;
                margin: 20px 0;
              }
              .footer {
                text-align: center;
                color: #999;
                font-size: 12px;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>⚡ Tack för din ansökan!</h1>
            </div>
            
            <div class="content">
              <p>Hej ${name},</p>
              
              <p>Tack för att du visar intresse för Spotlights affiliate-program! Vi har mottagit din ansökan och uppskattar verkligen att du vill bli en del av vårt nätverk.</p>
              
              <div class="highlight">
                <p><strong>Vad händer nu?</strong></p>
                <p>Vårt team kommer att granska din ansökan noggrant. Du kan förvänta dig ett svar från oss inom 2-3 arbetsdagar.</p>
              </div>
              
              <p>Om din ansökan godkänns kommer du att få:</p>
              <ul>
                <li>Tillgång till din personliga affiliate-dashboard</li>
                <li>Unika spårningslänkar</li>
                <li>Marknadsföringsmaterial</li>
                <li>Dedikerad support från vårt affiliate-team</li>
              </ul>
              
              <p>Har du några frågor medan du väntar? Tveka inte att kontakta oss på <a href="mailto:affiliate@spotlightevents.online">affiliate@spotlightevents.online</a>.</p>
              
              <p>Med vänliga hälsningar,<br>
              Spotlight Affiliate Team</p>
            </div>

            <div class="footer">
              <p>© ${new Date().getFullYear()} Spotlight. Alla rättigheter förbehållna.</p>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Confirmation email sent to applicant");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-affiliate-application function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
