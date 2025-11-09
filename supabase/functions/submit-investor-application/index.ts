import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const investorApplicationSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  company: z.string().trim().max(100).optional(),
  countryCode: z.string().trim().max(10).optional(),
  phone: z.string().trim().max(20).optional(),
  investment_range: z.enum(["100k-500k", "500k-1m", "1m-5m", "5m+"]),
  message: z.string().trim().min(10).max(2000),
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
    const validatedData = investorApplicationSchema.parse(body);

    // Rate limiting: Check for recent submissions from this email
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const { data: recentSubmissions, error: checkError } = await supabase
      .from("investor_applications")
      .select("id")
      .eq("email", validatedData.email)
      .gte("created_at", oneDayAgo);

    if (checkError) {
      console.error("Rate limit check error:", checkError);
      throw new Error("Failed to check rate limit");
    }

    // Allow max 3 submissions per email per day
    if (recentSubmissions && recentSubmissions.length >= 3) {
      return new Response(
        JSON.stringify({ 
          error: "Rate limit exceeded. Please try again later." 
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Combine country code and phone number if both exist
    const fullPhone = validatedData.countryCode && validatedData.phone 
      ? `${validatedData.countryCode} ${validatedData.phone}`
      : validatedData.phone || null;

    // Insert the application
    const { error: insertError } = await supabase
      .from("investor_applications")
      .insert([{
        name: validatedData.name,
        email: validatedData.email,
        company: validatedData.company || null,
        phone: fullPhone,
        investment_range: validatedData.investment_range,
        message: validatedData.message,
      }]);

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error("Failed to submit application");
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
