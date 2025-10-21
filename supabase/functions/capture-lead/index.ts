import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY") as string);

interface LeadRequest {
  email: string;
  source: string;
  metadata?: Record<string, any>;
}

const getGuideEmailHtml = (name: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Din Event Marketing Guide</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; background-color: #f6f9fc; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px 20px;">
    <h1 style="color: #333; font-size: 32px; font-weight: bold; margin: 0 0 24px 0;">🎉 Tack för ditt intresse!</h1>
    
    <p style="color: #333; font-size: 16px; line-height: 24px; margin: 16px 0;">
      Hej ${name},
    </p>
    
    <p style="color: #333; font-size: 16px; line-height: 24px; margin: 16px 0;">
      Tack för att du vill lära dig mer om event marketing! Här kommer din gratis guide med allt du behöver för att lyckas med eventbaserad marknadsföring.
    </p>

    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 24px; margin: 32px 0;">
      <h2 style="color: #333; font-size: 24px; font-weight: bold; margin: 0 0 16px 0;">📚 I din guide får du:</h2>
      
      <p style="color: #333; font-size: 16px; line-height: 28px; margin: 8px 0;">✓ 7 beprövade strategier för event marketing</p>
      <p style="color: #333; font-size: 16px; line-height: 28px; margin: 8px 0;">✓ Kampanjmallar du kan använda direkt</p>
      <p style="color: #333; font-size: 16px; line-height: 28px; margin: 8px 0;">✓ Checklista för varje event-typ</p>
      <p style="color: #333; font-size: 16px; line-height: 28px; margin: 8px 0;">✓ ROI-kalkylator för eventbaserad marknadsföring</p>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="https://spotlight-event-marketing.com/guide.pdf" 
         style="background-color: #5046e4; color: #fff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 18px; font-weight: bold; display: inline-block;">
        📥 Ladda ner din guide här
      </a>
    </div>

    <hr style="border: none; border-top: 1px solid #e6ebf1; margin: 32px 0;">

    <div style="background-color: #f0f7ff; border-radius: 8px; padding: 32px; margin: 32px 0; text-align: center;">
      <h3 style="color: #333; font-size: 20px; font-weight: bold; margin: 0 0 12px 0;">Redo att ta nästa steg?</h3>
      <p style="color: #333; font-size: 16px; line-height: 24px; margin: 16px 0;">
        Med Spotlight kan du automatisera hela processen - från att hitta events till att skapa kampanjer med AI.
      </p>
      
      <p style="color: #555; font-size: 15px; line-height: 24px; margin: 16px 0;">
        🚀 Skapa kampanjer på 60 sekunder med AI<br>
        📍 Automatisk bevakning av lokala events<br>
        📊 Real-time analytics & ROI-tracking<br>
        💰 Från $29/månad med 14 dagars gratis provperiod
      </p>

      <a href="https://64879faf-7b1e-407e-8edb-6e8199bc4d8d.lovableproject.com/auth" 
         style="background-color: #5046e4; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block; margin-top: 16px;">
        Starta gratis provperiod →
      </a>
    </div>

    <hr style="border: none; border-top: 1px solid #e6ebf1; margin: 32px 0;">

    <p style="color: #898989; font-size: 14px; line-height: 22px; text-align: center; margin: 16px 0;">
      <a href="https://64879faf-7b1e-407e-8edb-6e8199bc4d8d.lovableproject.com" style="color: #5046e4; text-decoration: underline;">Spotlight</a> - AI-driven event marketing för lokala företag
    </p>

    <p style="color: #b0b0b0; font-size: 12px; line-height: 20px; text-align: center; margin: 12px 0;">
      Du får detta email för att du bad om vår Event Marketing Guide.
    </p>
  </div>
</body>
</html>
`;

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, source, metadata = {} }: LeadRequest = await req.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert lead into database
    const { data, error } = await supabase
      .from("leads")
      .insert({
        email: email.toLowerCase().trim(),
        source,
        metadata,
      })
      .select()
      .single();

    if (error) {
      // If email already exists, update the metadata
      if (error.code === '23505') {
        const { data: updateData, error: updateError } = await supabase
          .from("leads")
          .update({
            metadata: {
              ...metadata,
              last_interaction: new Date().toISOString(),
            }
          })
          .eq('email', email.toLowerCase().trim())
          .select()
          .single();

        if (updateError) {
          throw updateError;
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Lead updated successfully",
            data: updateData 
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }
      
      throw error;
    }

    console.log("Lead captured successfully:", data);

    // Send email with guide
    try {
      const emailHtml = getGuideEmailHtml(email.split('@')[0]);

      const emailResponse = await resend.emails.send({
        from: 'Spotlight <onboarding@resend.dev>',
        to: [email],
        subject: '🎉 Din Event Marketing Guide är här!',
        html: emailHtml,
      });

      console.log("Guide email sent successfully:", emailResponse);
    } catch (emailError) {
      console.error("Error sending guide email:", emailError);
      // Don't fail the entire request if email fails
      // The lead is already captured in the database
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Lead captured successfully",
        data 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in capture-lead function:", error);
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
