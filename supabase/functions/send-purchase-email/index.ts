import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";
import { Resend } from "https://esm.sh/resend@2.0.0";
import React from "npm:react@18.3.1";
import { renderAsync } from "https://esm.sh/@react-email/components@0.0.15";
import { PurchaseThankYou } from "../_shared/email-templates/purchase-thank-you.tsx";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PurchaseEmailRequest {
  email: string;
  name: string;
  planName: string;
  amount: string;
  billingPeriod: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, planName, amount, billingPeriod }: PurchaseEmailRequest = await req.json();

    console.log("Sending purchase confirmation email to:", email);

    const dashboardLink = `${req.headers.get("origin") || "https://spotlightevents.online"}/dashboard`;

    const emailHtml = await renderAsync(
      React.createElement(PurchaseThankYou, {
        name,
        planName,
        amount,
        billingPeriod,
        dashboardLink,
      })
    );

    const emailResponse = await resend.emails.send({
      from: "Spotlight Events <noreply@spotlightevents.online>",
      to: [email],
      subject: `Tack för ditt köp - ${planName}`,
      html: emailHtml,
    });

    console.log("Purchase confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-purchase-email function:", error);
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
