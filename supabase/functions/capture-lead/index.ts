import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface LeadRequest {
  email: string;
  source: string;
  metadata?: Record<string, any>;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, source, metadata = {} }: LeadRequest = await req.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert lead into database
    const { data, error } = await supabase
      .from("leads")
      .insert({
        email: email.toLowerCase().trim(),
        source,
        metadata,
      })
      .select()
      .single();

    if (error) {
      // If email already exists, update the metadata
      if (error.code === '23505') {
        const { data: updateData, error: updateError } = await supabase
          .from("leads")
          .update({
            metadata: {
              ...metadata,
              last_interaction: new Date().toISOString(),
            }
          })
          .eq('email', email.toLowerCase().trim())
          .select()
          .single();

        if (updateError) {
          throw updateError;
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Lead updated successfully",
            data: updateData 
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }
      
      throw error;
    }

    console.log("Lead captured successfully:", data);

    // TODO: Send email with guide
    // You can call another edge function here to send the email with the guide

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Lead captured successfully",
        data 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in capture-lead function:", error);
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
