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

// Rate limiting map: IP -> [timestamps]
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 3; // Max 3 requests per window

// Clean old entries every 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of rateLimitMap.entries()) {
    const validTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
    if (validTimestamps.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      rateLimitMap.set(ip, validTimestamps);
    }
  }
}, 30 * 60 * 1000);

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  
  // Remove expired timestamps
  const validTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
  
  if (validTimestamps.length >= MAX_REQUESTS) {
    return false; // Rate limit exceeded
  }
  
  // Add current timestamp
  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  
  return true; // Request allowed
}

function getClientIP(req: Request): string {
  // Try to get real IP from various headers
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  
  return "unknown";
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(req);
    
    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ 
          error: "Too many requests. Please try again in 15 minutes." 
        }),
        {
          status: 429,
          headers: { 
            "Content-Type": "application/json", 
            ...corsHeaders,
            "Retry-After": "900" // 15 minutes in seconds
          },
        }
      );
    }

    const { name, email, subject, message }: ContactEmailRequest = await req.json();

    // Validate input lengths (server-side validation)
    if (!name || name.trim().length === 0 || name.length > 100) {
      throw new Error("Invalid name");
    }
    if (!email || email.trim().length === 0 || email.length > 255 || !email.includes("@")) {
      throw new Error("Invalid email");
    }
    if (!subject || subject.trim().length === 0 || subject.length > 200) {
      throw new Error("Invalid subject");
    }
    if (!message || message.trim().length < 10 || message.length > 2000) {
      throw new Error("Invalid message");
    }

    console.log("Processing contact form submission from:", email, "IP:", clientIP);

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
