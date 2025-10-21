import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { referralCode, userId, subscriptionPlan, amount } = await req.json();

    console.log("Tracking referral conversion:", { referralCode, userId, subscriptionPlan, amount });

    // Get referral data
    const { data: referral, error: referralError } = await supabaseClient
      .from('referrals')
      .select('*')
      .eq('referral_code', referralCode)
      .single();

    if (referralError || !referral) {
      throw new Error("Referral not found");
    }

    // Calculate commission (20% of the amount)
    const commissionAmount = amount * 0.20;

    // Update referred_users table
    const { error: updateError } = await supabaseClient
      .from('referred_users')
      .update({
        referred_user_id: userId,
        status: 'subscribed',
        commission_amount: commissionAmount,
        converted_at: new Date().toISOString()
      })
      .eq('referral_code', referralCode)
      .eq('referred_user_id', userId);

    if (updateError) {
      console.error("Error updating referred_users:", updateError);
    }

    // Update referral totals
    const { error: referralUpdateError } = await supabaseClient
      .from('referrals')
      .update({
        total_commission: (referral.total_commission || 0) + commissionAmount
      })
      .eq('referral_code', referralCode);

    if (referralUpdateError) {
      console.error("Error updating referral commission:", referralUpdateError);
    }

    console.log("Referral conversion tracked successfully");

    return new Response(
      JSON.stringify({ success: true, commissionAmount }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error in track-referral-conversion:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
