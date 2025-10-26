import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple in-memory rate limiting (for production, use Redis or similar)
const rateLimitMap = new Map<string, { attempts: number; resetAt: number }>();

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_ATTEMPTS = 5; // Max 5 attempts per minute per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    // New window or expired
    rateLimitMap.set(ip, { attempts: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    return false;
  }

  record.attempts++;
  return true;
}

// Cleanup old rate limit records periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetAt) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000); // Cleanup every 5 minutes

const validateTokenSchema = z.object({
  token: z.string().trim().uuid("Invalid token format"),
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("x-real-ip") || 
                     "unknown";

    // Check rate limit
    if (!checkRateLimit(clientIp)) {
      console.warn(`Rate limit exceeded for IP: ${clientIp}`);
      return new Response(
        JSON.stringify({ 
          error: "Too many attempts. Please try again later." 
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse and validate input
    const body = await req.json();
    const { token } = validateTokenSchema.parse(body);

    console.log(`Validating invitation token from IP: ${clientIp}`);

    // Use the secure SECURITY DEFINER function to get invitation
    const { data: invitation, error } = await supabase
      .rpc('get_invitation_by_token', { _token: token })
      .single() as { 
        data: { 
          email: string; 
          role: string; 
          tenant_id: string; 
          expires_at: string;
          id: string;
          invited_by: string;
          created_at: string;
        } | null; 
        error: any 
      };

    if (error) {
      console.error("Database error:", error);
      // Don't reveal if token doesn't exist - return generic error
      return new Response(
        JSON.stringify({ 
          error: "Invalid or expired invitation" 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    if (!invitation) {
      // Token doesn't exist or is expired/accepted
      return new Response(
        JSON.stringify({ 
          error: "Invalid or expired invitation" 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Return limited invitation info (no sensitive details)
    return new Response(
      JSON.stringify({ 
        valid: true,
        email: invitation.email,
        role: invitation.role,
        tenant_id: invitation.tenant_id,
        expires_at: invitation.expires_at
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Error:", error);
    
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid token format" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        error: "Invalid or expired invitation" 
      }),
      { 
        status: 404, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
