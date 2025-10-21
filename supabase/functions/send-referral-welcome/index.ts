import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import React from "npm:react@18.3.1";
import { renderAsync } from "https://esm.sh/@react-email/components@0.0.15";
import { ReferralWelcome } from "../_shared/email-templates/referral-welcome.tsx";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ReferralWelcomeRequest {
  email: string;
  referralCode: string;
  commissionRate: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, referralCode, commissionRate }: ReferralWelcomeRequest = await req.json();

    console.log("Sending referral welcome email to:", email, "with code:", referralCode);

    const origin = req.headers.get("origin") || "https://spotlightevents.online";
    const referralLink = `${origin}/refer-a-friend?ref=${referralCode}`;

    const emailHtml = await renderAsync(
      React.createElement(ReferralWelcome, {
        email,
        referralCode,
        referralLink,
        commissionRate: commissionRate * 100, // Convert to percentage
      })
    );

    const emailResponse = await resend.emails.send({
      from: "Spotlight Events <noreply@spotlightevents.online>",
      to: [email],
      subject: "🎉 Välkommen till Spotlight Referral Program - Din unika länk är klar!",
      html: emailHtml,
    });

    console.log("Referral welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-referral-welcome function:", error);
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
