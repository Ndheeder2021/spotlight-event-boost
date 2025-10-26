import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const trackSignupSchema = z.object({
  referral_code: z.string().trim().min(1).max(100),
  referred_email: z.string().trim().email().max(255),
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
    const { referral_code, referred_email } = trackSignupSchema.parse(body);

    // Insert into referred_users
    const { error: insertError } = await supabase
      .from('referred_users')
      .insert({
        referral_code: referral_code,
        referred_email: referred_email.toLowerCase(),
        status: 'signed_up'
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      // Don't fail if already exists
      if (insertError.code !== '23505') {
        throw new Error("Failed to track referred user");
      }
    }

    // Get current referral data
    const { data: referralData, error: selectError } = await supabase
      .from('referrals')
      .select('referred_count')
      .eq('referral_code', referral_code)
      .single();

    if (selectError) {
      console.error("Select error:", selectError);
      throw new Error("Referral code not found");
    }

    // Update referral count
    const { error: updateError } = await supabase
      .from('referrals')
      .update({ 
        referred_count: (referralData.referred_count || 0) + 1 
      })
      .eq('referral_code', referral_code);

    if (updateError) {
      console.error("Update error:", updateError);
      throw new Error("Failed to update referral count");
    }

    return new Response(
      JSON.stringify({ success: true }),
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
