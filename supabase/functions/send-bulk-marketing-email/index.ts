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

const getMarketingEmailHtml = (companyName?: string) => `
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prova EventRadar Gratis</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">EventRadar</h1>
              <p style="margin: 10px 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">AI-driven eventmarknadsföring</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">
                ${companyName ? `Hej ${companyName}!` : 'Hej!'}
              </h2>
              
              <p style="margin: 0 0 20px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Vi vill bjuda in er att prova <strong>EventRadar</strong> – plattformen som revolutionerar hur lokala företag marknadsför sig kring evenemang.
              </p>
              
              <div style="background-color: #f8f9ff; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <h3 style="margin: 0 0 15px; color: #667eea; font-size: 20px; font-weight: 600;">
                  🎁 Specialerbjudande
                </h3>
                <p style="margin: 0; color: #4a4a4a; font-size: 18px; font-weight: 500;">
                  2 veckors helt kostnadsfri provperiod
                </p>
                <p style="margin: 10px 0 0; color: #666; font-size: 14px;">
                  Inget kreditkort krävs • Ingen bindningstid • Avsluta när som helst
                </p>
              </div>
              
              <h3 style="margin: 30px 0 15px; color: #1a1a1a; font-size: 18px; font-weight: 600;">
                Vad får ni tillgång till?
              </h3>
              
              <ul style="margin: 0 0 30px; padding-left: 20px; color: #4a4a4a; font-size: 16px; line-height: 1.8;">
                <li style="margin-bottom: 12px;">
                  <strong style="color: #667eea;">AI-genererade kampanjer</strong> – Automatiska kampanjförslag baserade på lokala evenemang
                </li>
                <li style="margin-bottom: 12px;">
                  <strong style="color: #667eea;">Eventspaning</strong> – Upptäck relevanta evenemang i er närhet automatiskt
                </li>
                <li style="margin-bottom: 12px;">
                  <strong style="color: #667eea;">Färdiga reklammallar</strong> – Skapa professionella annonser på några sekunder
                </li>
                <li style="margin-bottom: 12px;">
                  <strong style="color: #667eea;">Analys & rapporter</strong> – Följ er kampanjprestanda i realtid
                </li>
              </ul>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="https://jujgbkdamkjabjuerqxt.supabase.co/auth?view=signup" 
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-size: 18px; font-weight: 600; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                  Starta din gratis testperiod →
                </a>
              </div>
              
              <div style="background-color: #fff8e6; border: 1px solid #ffd966; padding: 20px; margin: 30px 0; border-radius: 6px;">
                <p style="margin: 0; color: #856404; font-size: 15px; line-height: 1.6;">
                  <strong>💡 Tips:</strong> Företag som använder EventRadar ser i snitt en ökning på 40% i kundengagemang under större evenemang.
                </p>
              </div>
              
              <p style="margin: 30px 0 0; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Har ni frågor? Svara på detta mail eller kontakta oss direkt så hjälper vi er att komma igång!
              </p>
              
              <p style="margin: 20px 0 0; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Med vänliga hälsningar,<br>
                <strong>EventRadar-teamet</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0 0 10px; color: #666; font-size: 14px;">
                EventRadar – Smart eventmarknadsföring för lokala företag
              </p>
              <p style="margin: 0; color: #999; font-size: 12px;">
                Du får detta mail eftersom vi tror att EventRadar kan hjälpa ert företag att växa.
                <br>
                Vill du inte få fler mail från oss? Ingen fara, bara svara med "avregistrera".
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

    const fromAddress = senderEmail || "onboarding@resend.dev";
    const fromName = senderName || "EventRadar";

    // Send emails in batches to avoid rate limits
    const results = [];
    const batchSize = 10;
    
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (email) => {
        try {
          const emailResponse = await resend.emails.send({
            from: `${fromName} <${fromAddress}>`,
            to: [email],
            subject: "Prova EventRadar gratis i 2 veckor – Ingen bindningstid",
            html: getMarketingEmailHtml(),
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
