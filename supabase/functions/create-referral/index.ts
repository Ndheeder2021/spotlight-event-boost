import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const createReferralSchema = z.object({
  email: z.string().trim().email().max(255),
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse and validate input
    const body = await req.json();
    const { email } = createReferralSchema.parse(body);

    // Check if referral already exists
    const { data: existing, error: checkError } = await supabase
      .from("referrals")
      .select("*")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (checkError) {
      console.error("Check error:", checkError);
      throw new Error("Failed to check existing referral");
    }

    if (existing) {
      return new Response(
        JSON.stringify({ referral: existing, isNew: false }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Generate new referral code
    const { data: codeData, error: codeError } = await supabase
      .rpc('generate_referral_code');

    if (codeError) {
      console.error("Code generation error:", codeError);
      throw new Error("Failed to generate referral code");
    }

    // Create new referral
    const { data: newReferral, error: insertError } = await supabase
      .from("referrals")
      .insert({
        email: email.toLowerCase(),
        referral_code: codeData
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error("Failed to create referral");
    }

    // Send welcome email
    try {
      await supabase.functions.invoke('send-referral-welcome', {
        body: {
          email: email,
          referralCode: codeData,
          commissionRate: 0.20
        }
      });
    } catch (emailError) {
      console.error("Email error (non-fatal):", emailError);
      // Don't fail the request if email fails
    }

    return new Response(
      JSON.stringify({ referral: newReferral, isNew: true }),
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
          error: "Invalid input data", 
          details: error.errors 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
