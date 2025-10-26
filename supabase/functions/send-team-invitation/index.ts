import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvitePayload {
  email: string;
  token: string;
  role: string;
  inviterEmail?: string;
  tenantId?: string;
  appUrl?: string; // e.g. https://your-app.lovable.app
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const resend = new Resend(resendApiKey);

    const payload: InvitePayload = await req.json();
    const {
      email,
      token,
      role,
      inviterEmail = "",
      tenantId = "",
      appUrl = "https://spotlight-event-boost.lovable.app",
    } = payload;

    if (!email || !token) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: email, token" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const acceptUrl = `${appUrl}/auth?invite=${encodeURIComponent(token)}`;

    const subject = `Du har blivit inbjuden till Spotlight-teamet`;

    const html = `
      <div style="font-family: Arial, sans-serif; line-height:1.6; color:#111">
        <h2>Inbjudan till Spotlight</h2>
        <p>Hej!</p>
        <p>${inviterEmail ? `${inviterEmail} ` : "En administratör "}har bjudit in dig som <strong>${role}</strong> till ett team i Spotlight.</p>
        ${tenantId ? `<p>Tenant ID: <code>${tenantId}</code></p>` : ""}
        <p>Klicka på knappen nedan för att acceptera inbjudan:</p>
        <p>
          <a href="${acceptUrl}" target="_blank" style="display:inline-block;padding:12px 18px;background:#111;color:#fff;border-radius:8px;text-decoration:none">Acceptera inbjudan</a>
        </p>
        <p>Om knappen inte fungerar, kopiera och klistra in denna länk i din webbläsare:</p>
        <p><a href="${acceptUrl}" target="_blank">${acceptUrl}</a></p>
        <hr />
        <p style="font-size:12px;color:#666">Detta meddelande skickades automatiskt av Spotlight.</p>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: "Lovable <onboarding@resend.dev>",
      to: [email],
      subject,
      html,
      reply_to: inviterEmail || undefined,
    });

    if (error) {
      console.error("Resend error:", error);
      return new Response(JSON.stringify({ error: error.message || "Email error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, id: data?.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("send-team-invitation error:", err);
    return new Response(
      JSON.stringify({ error: err?.message || String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
