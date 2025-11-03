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
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; background-color: #f4f7fa; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #5046e4 0%, #6b63ff 100%); padding: 48px 40px; text-align: center;">
      <h1 style="color: #ffffff; font-size: 28px; font-weight: 600; margin: 0; letter-spacing: -0.5px;">Välkommen till Spotlight Events</h1>
      <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin: 12px 0 0 0; font-weight: 400;">Din guide till framgångsrik event marketing</p>
    </div>

    <!-- Content -->
    <div style="padding: 48px 40px;">
      <p style="color: #1a1a1a; font-size: 16px; line-height: 24px; margin: 0 0 24px 0;">
        Hej ${name},
      </p>
      
      <p style="color: #4a4a4a; font-size: 15px; line-height: 24px; margin: 0 0 32px 0;">
        Tack för ditt intresse för Spotlight Events. Vi är glada att kunna dela med oss av vår omfattande guide om eventbaserad marknadsföring.
      </p>

      <!-- Guide Benefits -->
      <div style="background-color: #f8f9fb; border-left: 4px solid #5046e4; border-radius: 8px; padding: 32px; margin: 0 0 40px 0;">
        <h2 style="color: #1a1a1a; font-size: 20px; font-weight: 600; margin: 0 0 20px 0;">Vad guiden innehåller</h2>
        
        <div style="margin-bottom: 16px;">
          <div style="display: inline-block; width: 24px; height: 24px; background-color: #5046e4; border-radius: 4px; text-align: center; line-height: 24px; margin-right: 12px; vertical-align: middle;">
            <span style="color: #ffffff; font-size: 14px; font-weight: bold;">✓</span>
          </div>
          <span style="color: #2d2d2d; font-size: 15px; line-height: 24px; vertical-align: middle;">7 beprövade strategier för event marketing</span>
        </div>
        
        <div style="margin-bottom: 16px;">
          <div style="display: inline-block; width: 24px; height: 24px; background-color: #5046e4; border-radius: 4px; text-align: center; line-height: 24px; margin-right: 12px; vertical-align: middle;">
            <span style="color: #ffffff; font-size: 14px; font-weight: bold;">✓</span>
          </div>
          <span style="color: #2d2d2d; font-size: 15px; line-height: 24px; vertical-align: middle;">Kampanjmallar redo att användas</span>
        </div>
        
        <div style="margin-bottom: 16px;">
          <div style="display: inline-block; width: 24px; height: 24px; background-color: #5046e4; border-radius: 4px; text-align: center; line-height: 24px; margin-right: 12px; vertical-align: middle;">
            <span style="color: #ffffff; font-size: 14px; font-weight: bold;">✓</span>
          </div>
          <span style="color: #2d2d2d; font-size: 15px; line-height: 24px; vertical-align: middle;">Omfattande checklista för varje event-typ</span>
        </div>
        
        <div>
          <div style="display: inline-block; width: 24px; height: 24px; background-color: #5046e4; border-radius: 4px; text-align: center; line-height: 24px; margin-right: 12px; vertical-align: middle;">
            <span style="color: #ffffff; font-size: 14px; font-weight: bold;">✓</span>
          </div>
          <span style="color: #2d2d2d; font-size: 15px; line-height: 24px; vertical-align: middle;">ROI-kalkylator för mätbar avkastning</span>
        </div>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 0 0 48px 0;">
        <a href="https://spotlight-event-marketing.com/guide.pdf" 
           style="display: inline-block; background-color: #5046e4; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(80, 70, 228, 0.3); transition: all 0.3s ease;">
          Ladda ner din guide
        </a>
      </div>

      <!-- Separator -->
      <div style="border-top: 1px solid #e8eaed; margin: 48px 0;"></div>

      <!-- Platform Benefits -->
      <div style="background: linear-gradient(135deg, #f8f9fb 0%, #ffffff 100%); border: 1px solid #e8eaed; border-radius: 12px; padding: 40px; text-align: center; margin: 0 0 32px 0;">
        <h3 style="color: #1a1a1a; font-size: 22px; font-weight: 600; margin: 0 0 16px 0;">Redo att automatisera din event marketing?</h3>
        <p style="color: #4a4a4a; font-size: 15px; line-height: 24px; margin: 0 0 28px 0;">
          Spotlight Events automatiserar hela processen – från eventbevakning till AI-genererade kampanjer och detaljerad analys.
        </p>
        
        <div style="text-align: left; margin: 0 0 32px 0;">
          <div style="margin-bottom: 14px;">
            <span style="color: #5046e4; font-size: 18px; margin-right: 8px;">●</span>
            <span style="color: #2d2d2d; font-size: 15px; line-height: 24px;">Skapa kampanjer på 60 sekunder med AI</span>
          </div>
          <div style="margin-bottom: 14px;">
            <span style="color: #5046e4; font-size: 18px; margin-right: 8px;">●</span>
            <span style="color: #2d2d2d; font-size: 15px; line-height: 24px;">Automatisk bevakning av lokala events</span>
          </div>
          <div style="margin-bottom: 14px;">
            <span style="color: #5046e4; font-size: 18px; margin-right: 8px;">●</span>
            <span style="color: #2d2d2d; font-size: 15px; line-height: 24px;">Real-time analytics och ROI-tracking</span>
          </div>
          <div>
            <span style="color: #5046e4; font-size: 18px; margin-right: 8px;">●</span>
            <span style="color: #2d2d2d; font-size: 15px; line-height: 24px;">Från 299 kr/månad med 14 dagars gratis provperiod</span>
          </div>
        </div>

        <a href="https://64879faf-7b1e-407e-8edb-6e8199bc4d8d.lovableproject.com/auth" 
           style="display: inline-block; background-color: #5046e4; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 600; box-shadow: 0 2px 8px rgba(80, 70, 228, 0.25);">
          Starta gratis provperiod
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f8f9fb; padding: 32px 40px; text-align: center; border-top: 1px solid #e8eaed;">
      <p style="color: #6b7280; font-size: 14px; line-height: 20px; margin: 0 0 8px 0;">
        <a href="https://64879faf-7b1e-407e-8edb-6e8199bc4d8d.lovableproject.com" style="color: #5046e4; text-decoration: none; font-weight: 500;">Spotlight Events</a>
      </p>
      <p style="color: #9ca3af; font-size: 13px; line-height: 18px; margin: 0;">
        AI-driven event marketing för lokala företag
      </p>
      <p style="color: #9ca3af; font-size: 12px; line-height: 18px; margin: 16px 0 0 0;">
        Du får detta email för att du begärde vår Event Marketing Guide
      </p>
    </div>
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
