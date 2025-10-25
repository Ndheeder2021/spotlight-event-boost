import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BulkEmailRequest {
  emails: string[];
  senderName?: string;
  senderEmail?: string;
}

const extractCompanyName = (email: string): string => {
  // Extract domain from email
  const domain = email.split('@')[1];
  if (!domain) return '';
  
  // Remove common TLDs and format
  const companyName = domain
    .split('.')[0]
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return companyName;
};

const getMarketingEmailHtml = (companyName?: string) => `
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Spotlight Events - Event-marknadsföring för er verksamhet</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header with Logo -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              <img src="https://spotlightevents.online/logo.png" alt="Spotlight Events" style="height: 50px; margin-bottom: 15px;" />
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Spotlight Events</h1>
              <p style="margin: 10px 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">Maximera gästflödet vid lokala evenemang</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 22px; font-weight: 600;">
                Hej${companyName ? ` ${companyName}` : ''}!
              </h2>
              
              <p style="margin: 0 0 16px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Jag heter <strong>Nabeel Heeder</strong> och är grundare av <strong>Spotlight Events</strong> – en plattform som hjälper restauranger och hotell att öka synligheten och gästflödet i samband med större evenemang.
              </p>
              
              <p style="margin: 0 0 16px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Genom att analysera kommande event i området kan vi visa när det väntas fler besökare, och hjälpa er att planera kampanjer och marknadsföring i rätt tid.
              </p>
              
              <p style="margin: 0 0 16px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Flera verksamheter använder redan Spotlight för att maximera sin försäljning under helger med konserter, mässor och sportevenemang.
              </p>
              
              <div style="background-color: #f8f9ff; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <p style="margin: 0; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                  Jag tror att <strong>${companyName || 'er verksamhet'}</strong> skulle kunna ha stor nytta av samma insikter.
                </p>
              </div>
              
              <p style="margin: 0 0 30px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Skulle du vara öppen för en kort introduktion där jag visar hur ni kan använda Spotlight för att locka fler gäster under lokala event?
              </p>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="https://www.spotlightevents.online" 
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-size: 18px; font-weight: 600; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                  Besök Spotlight Events →
                </a>
              </div>
              
              <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e5e5;">
                <p style="margin: 0 0 8px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                  Med vänliga hälsningar,
                </p>
                <p style="margin: 0 0 4px; color: #1a1a1a; font-size: 16px; font-weight: 600;">
                  Nabeel Heeder
                </p>
                <p style="margin: 0 0 16px; color: #666; font-size: 14px;">
                  Grundare | Spotlight Events
                </p>
                <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
                  📩 <a href="mailto:nabeel@spotlightevents.online" style="color: #667eea; text-decoration: none;">nabeel@spotlightevents.online</a><br>
                  🌐 <a href="https://www.spotlightevents.online" style="color: #667eea; text-decoration: none;">www.spotlightevents.online</a>
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0 0 10px; color: #666; font-size: 14px;">
                Spotlight Events – Smart eventmarknadsföring för restauranger och hotell
              </p>
              <p style="margin: 0; color: #999; font-size: 12px;">
                Vill du inte få fler mail från oss? Svara med "avregistrera".
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { emails, senderName, senderEmail }: BulkEmailRequest = await req.json();

    if (!emails || emails.length === 0) {
      return new Response(
        JSON.stringify({ error: "Inga e-postadresser angivna" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Sending bulk emails to ${emails.length} recipients`);

    const fromAddress = senderEmail || "nabeel@spotlightevents.online";
    const fromName = senderName || "Nabeel Heeder";

    // Send emails in batches to avoid rate limits
    const results = [];
    const batchSize = 10;
    
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (email) => {
        try {
          const companyName = extractCompanyName(email);
          const emailResponse = await resend.emails.send({
            from: `${fromName} <${fromAddress}>`,
            to: [email],
            subject: "Öka gästflödet vid lokala evenemang – Spotlight Events",
            html: getMarketingEmailHtml(companyName),
          });

          console.log(`Email sent to ${email}:`, emailResponse);
          return { email, success: true, id: emailResponse.data?.id };
        } catch (error) {
          console.error(`Failed to send email to ${email}:`, error);
          return { 
            email, 
            success: false, 
            error: error instanceof Error ? error.message : String(error) 
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Small delay between batches
      if (i + batchSize < emails.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    console.log(`Bulk email complete: ${successCount} succeeded, ${failureCount} failed`);

    return new Response(
      JSON.stringify({
        message: `E-post skickade: ${successCount} lyckades, ${failureCount} misslyckades`,
        results,
        successCount,
        failureCount,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-bulk-marketing-email function:", error);
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
