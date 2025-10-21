import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";
import { Resend } from "https://esm.sh/resend@2.0.0";
import React from "npm:react@18.3.1";
import { renderAsync } from "https://esm.sh/@react-email/components@0.0.15";
import { ContactThankYou } from "../_shared/email-templates/contact-thank-you.tsx";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message }: ContactEmailRequest = await req.json();

    console.log("Processing contact form submission from:", email);

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Save to database
    const { error } = await supabase
      .from("contact_messages")
      .insert({
        name,
        email,
        subject,
        message,
        status: "new",
      });

    if (error) {
      console.error("Database error:", error);
      throw error;
    }

    console.log("Contact message saved successfully");

    // Send thank you email
    try {
      const emailHtml = await renderAsync(
        React.createElement(ContactThankYou, {
          name,
          subject,
        })
      );

      await resend.emails.send({
        from: "Spotlight Events Support <support@spotlightevents.online>",
        to: [email],
        subject: "Tack för ditt meddelande - Spotlight Events",
        html: emailHtml,
      });

      console.log("Thank you email sent successfully to:", email);
    } catch (emailError) {
      console.error("Failed to send thank you email:", emailError);
      // Don't fail the request if email fails
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
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
