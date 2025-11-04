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
  businessName?: string;
  city?: string;
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

const getMarketingEmailHtml = (companyName?: string, businessName?: string, city?: string) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
  <meta name="x-apple-disable-message-reformatting">
</head>
<body style="width:100%;-webkit-text-size-adjust:100%;text-size-adjust:100%;background-color:#f0f1f5;margin:0;padding:0">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#f0f1f5" style="background-color:#f0f1f5">
    <tbody>
      <tr>
        <td style="background-color:#f0f1f5">
          <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;margin:0 auto;background-color:#ffffff">
            <tbody>
              <!-- Logo Header -->
              <tr>
                <td style="padding:10px 0px 0px 0px">
                  <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                    <tbody>
                      <tr>
                        <td style="padding:10px 0 10px 0">
                          <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                            <tbody>
                              <tr>
                                <td style="padding:0px 20px">
                                  <table border="0" cellpadding="0" cellspacing="0" align="center" style="width:100%;background-color:#7630d7;border-radius:45px">
                                    <tbody>
                                      <tr>
                                        <td style="text-align:center;padding:5px">
                                          <a href="https://www.spotlightevents.online" target="_blank" style="display:block;text-decoration:none">
                                            <img src="https://www.spotlightevents.online/email-assets/spotlight-logo.png" alt="SpotlightEvents" width="495" style="display:block;width:100%;max-width:495px;height:auto">
                                          </a>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                              
                              <!-- Main Headline -->
                              <tr>
                                <td style="font-size:0;height:16px" height="16">&nbsp;</td>
                              </tr>
                              <tr>
                                <td dir="ltr" style="font-size:21px;text-align:center;padding:0px 20px;font-family:Arial,Helvetica,sans-serif">
                                  <span style="white-space:pre-wrap">Get more guests from nearby events – </span>
                                  <span style="font-weight:700;font-style:italic;white-space:pre-wrap">free for 14 days</span>
                                </td>
                              </tr>
                              
                              <!-- Description -->
                              <tr>
                                <td style="font-size:0;height:16px" height="16">&nbsp;</td>
                              </tr>
                              <tr>
                                <td dir="ltr" style="font-size:14px;text-align:justify;padding:0px 20px;font-family:Arial,Helvetica,sans-serif;line-height:1.5">
                                  SpotlightEvents automatically finds local concerts, matches, and festivals near ${businessName || 'your business'} in ${city || 'your area'}, helping you attract more guests when it matters most.
                                </td>
                              </tr>
                              
                              <!-- CTA Button -->
                              <tr>
                                <td style="font-size:0;height:16px" height="16">&nbsp;</td>
                              </tr>
                              <tr>
                                <td style="padding:0px 20px">
                                  <table cellpadding="0" cellspacing="0" border="0" style="width:100%">
                                    <tbody>
                                      <tr>
                                        <td align="center">
                                          <a href="https://www.spotlightevents.online?utm_source=email&utm_medium=bulk&utm_campaign=canva_template" 
                                             style="display:inline-block;padding:12px 24px;background:linear-gradient(90deg,#7e1ad8,#992bff,#d6abff);color:#ffffff;font-size:18px;font-weight:bold;text-decoration:none;border-radius:12px;border:2px solid #992bff">
                                            Start free trial
                                          </a>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                              
                              <!-- Benefits -->
                              <tr>
                                <td style="font-size:0;height:20px" height="20">&nbsp;</td>
                              </tr>
                              <tr>
                                <td style="padding:0px 20px">
                                  <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                    <tr>
                                      <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;padding:8px 0">
                                        🎯 Perfect timing – we alert you before major events nearby
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;padding:8px 0">
                                        📈 More bookings – get ready-to-use promo ideas instantly
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;padding:8px 0">
                                        ⏱️ No hassle – setup takes 2 minutes, no credit card needed
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              
                              <!-- Analytics Preview Image -->
                              <tr>
                                <td style="font-size:0;height:20px" height="20">&nbsp;</td>
                              </tr>
                              <tr>
                                <td style="padding:0px 20px">
                                  <img src="https://www.spotlightevents.online/email-assets/analytics-preview.gif" 
                                       alt="Real-time event insights" 
                                       width="560" 
                                       style="display:block;width:100%;max-width:560px;height:auto;border-radius:12px">
                                </td>
                              </tr>
                              
                              <!-- Secondary CTA -->
                              <tr>
                                <td style="font-size:0;height:20px" height="20">&nbsp;</td>
                              </tr>
                              <tr>
                                <td dir="ltr" style="font-size:16px;text-align:center;padding:0px 20px;font-family:Arial,Helvetica,sans-serif;font-style:italic">
                                  "Real-time event insights around your venue."
                                </td>
                              </tr>
                              <tr>
                                <td style="font-size:0;height:16px" height="16">&nbsp;</td>
                              </tr>
                              <tr>
                                <td dir="ltr" style="font-size:14px;text-align:center;padding:0px 20px;font-family:Arial,Helvetica,sans-serif;font-weight:bold">
                                  14 days free. No credit card. Cancel anytime.
                                </td>
                              </tr>
                              
                              <!-- How It Works Button -->
                              <tr>
                                <td style="font-size:0;height:16px" height="16">&nbsp;</td>
                              </tr>
                              <tr>
                                <td style="padding:0px 20px">
                                  <table cellpadding="0" cellspacing="0" border="0" style="width:100%">
                                    <tbody>
                                      <tr>
                                        <td align="center">
                                          <a href="https://www.spotlightevents.online/how-it-works" 
                                             style="display:inline-block;padding:10px 20px;background-color:#ffffff;color:#7630d7;font-size:16px;font-weight:600;text-decoration:none;border-radius:8px;border:2px solid #7630d7">
                                            See How It Works
                                          </a>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                              
                              <!-- FAQ Section -->
                              <tr>
                                <td style="font-size:0;height:24px" height="24">&nbsp;</td>
                              </tr>
                              <tr>
                                <td style="padding:0px 20px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#666">
                                  ❓ <strong>What happens after 14 days?</strong> → You can upgrade or cancel anytime.<br>
                                  🔐 <strong>GDPR & data?</strong> → We only use public event data + your business info.<br>
                                  🧩 <strong>Integrations?</strong> → Connect with your calendar or marketing tools.
                                </td>
                              </tr>
                              
                              <!-- Signature -->
                              <tr>
                                <td style="font-size:0;height:24px" height="24">&nbsp;</td>
                              </tr>
                              <tr>
                                <td style="padding:0px 20px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6">
                                  <strong>Nabeel Heeder</strong><br>
                                  Founder, ⚡SpotlightEvents<br>
                                  <a href="mailto:nabeel@spotlightevents.online" style="color:#7630d7">nabeel@spotlightevents.online</a>
                                </td>
                              </tr>
                              
                              <tr>
                                <td style="font-size:0;height:30px" height="30">&nbsp;</td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>
`;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { emails, senderName, senderEmail, businessName, city }: BulkEmailRequest = await req.json();

    if (!emails || emails.length === 0) {
      return new Response(
        JSON.stringify({ error: "No email addresses provided" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Sending bulk emails to ${emails.length} recipients`);

    const fromAddress = senderEmail || "news@spotlightevents.online";
    const fromName = senderName || "Spotlight News";

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
            subject: "Get more guests from nearby events – free for 14 days",
            html: getMarketingEmailHtml(companyName, businessName, city),
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
        message: `Emails sent: ${successCount} succeeded, ${failureCount} failed`,
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
