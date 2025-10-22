import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { 
      apiVersion: "2025-08-27.basil" 
    });

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found");
      return new Response(JSON.stringify({ 
        subscribed: false,
        plan: "starter",
        trial: false
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      limit: 1,
    });

    // Check Stripe first
    if (subscriptions.data.length > 0) {
      const subscription = subscriptions.data[0];
      const isActive = subscription.status === "active" || subscription.status === "trialing";
      const isTrial = subscription.status === "trialing";
      const productId = subscription.items.data[0]?.price?.product as string;
      
      // Map product IDs to plan names
      let plan = "starter";
      const monthlyStarterId = "prod_THD16z0VLy3zOD";
      const yearlyStarterId = "prod_THD2bzwKOM79b3";
      const monthlyProfessionalId = "prod_THD2oIrUQoCOcj";
      const yearlyProfessionalId = "prod_THD2mpb0QFBbAV";
      
      if (productId === monthlyStarterId || productId === yearlyStarterId) {
        plan = "starter";
      } else if (productId === monthlyProfessionalId || productId === yearlyProfessionalId) {
        plan = "professional";
      } else if (productId === "prod_THCXfYyIapkHHI") {
        plan = "starter";
      } else if (productId === "prod_THCYsFeNGHdxlP") {
        plan = "professional";
      }

      const subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      const trialEnd = subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null;

      logStep("Stripe subscription found", { 
        subscriptionId: subscription.id, 
        status: subscription.status,
        plan,
        isTrial,
        trialEnd,
        subscriptionEnd 
      });

      return new Response(JSON.stringify({
        subscribed: isActive,
        plan,
        trial: isTrial,
        trial_end: trialEnd,
        subscription_end: subscriptionEnd,
        status: subscription.status
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // No Stripe subscription, check database
    logStep("No Stripe subscription, checking database");
    
    const { data: dbSubscription, error: dbError } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('stripe_customer_id', customerId)
      .eq('status', 'active')
      .single();

    if (dbError || !dbSubscription) {
      logStep("No database subscription found, checking tenant plan");

      // Fallback: trust tenant plan set via migration/manual update
      const { data: tenantIdData, error: tenantIdError } = await supabaseClient
        .rpc('get_user_tenant_id', { _user_id: user.id });
      if (tenantIdError || !tenantIdData) {
        logStep("No tenant id found for user", { tenantIdError: tenantIdError?.message });
        return new Response(JSON.stringify({ 
          subscribed: false,
          plan: "starter",
          trial: false
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      const tenantId = tenantIdData as string;
      const { data: tenant, error: tenantError } = await supabaseClient
        .from('tenants')
        .select('plan, status')
        .eq('id', tenantId)
        .maybeSingle();

      if (tenantError || !tenant) {
        logStep("Tenant not found or error", { tenantError: tenantError?.message });
        return new Response(JSON.stringify({ 
          subscribed: false,
          plan: "starter",
          trial: false
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      const planFromTenant = tenant.plan || 'starter';
      const isActiveTenant = (tenant.status || '').toLowerCase() === 'active';

      if (isActiveTenant && (planFromTenant === 'professional' || planFromTenant === 'enterprise')) {
        logStep("Tenant indicates active paid plan", { plan: planFromTenant });
        return new Response(JSON.stringify({
          subscribed: true,
          plan: planFromTenant,
          trial: false,
          subscription_end: null,
          status: 'active'
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      logStep("Tenant not on paid active plan", { plan: planFromTenant, status: tenant.status });
      return new Response(JSON.stringify({ 
        subscribed: false,
        plan: "starter",
        trial: false
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    logStep("Database subscription found", { 
      subscriptionId: dbSubscription.id,
      plan: dbSubscription.plan,
      subscriptionEnd: dbSubscription.current_period_end
    });

    return new Response(JSON.stringify({
      subscribed: true,
      plan: dbSubscription.plan,
      trial: false,
      subscription_end: dbSubscription.current_period_end,
      status: dbSubscription.status
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
