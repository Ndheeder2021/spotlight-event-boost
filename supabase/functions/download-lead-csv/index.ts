import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BusinessLead {
  city: string;
  businessName: string;
  website: string;
  email: string;
  category: string;
}

function generateCSV(leads: BusinessLead[]): string {
  const headers = ["City", "Business Name", "Website", "Email", "Category"];
  const rows = leads.map(lead => [
    lead.city,
    lead.businessName,
    lead.website,
    lead.email,
    lead.category,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(",")),
  ].join("\n");

  return csvContent;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Extract user ID from JWT (function requires a valid JWT)
    const token = authHeader.replace(/^Bearer\s+/i, "");
    const [, payloadB64] = token.split(".");
    if (!payloadB64) {
      throw new Error("Invalid token");
    }
    const base64 = payloadB64.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (payloadB64.length % 4)) % 4);
    const payloadJson = JSON.parse(atob(base64));
    const userId = payloadJson.sub as string;
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const url = new URL(req.url);
    const jobId = url.searchParams.get("jobId");
    const cityFilter = url.searchParams.get("city");

    if (!jobId) {
      throw new Error("Job ID is required");
    }

    // Sanitize jobId to prevent path traversal
    const sanitizedJobId = jobId.replace(/[^a-zA-Z0-9-]/g, "");
    if (sanitizedJobId !== jobId) {
      throw new Error("Invalid job ID format");
    }

    // Fetch job results
    const { data: job, error: jobError } = await supabase
      .from("lead_finder_jobs")
      .select("*")
      .eq("id", jobId)
      .eq("user_id", userId)
      .single();

    if (jobError || !job) {
      throw new Error("Job not found or access denied");
    }

    if (job.status !== "completed") {
      throw new Error("Job is not completed yet");
    }

    let leads: BusinessLead[] = job.results_json as BusinessLead[];

    // Filter by city if specified
    if (cityFilter) {
      const sanitizedCity = cityFilter.replace(/[^a-zA-Z\s-]/g, "");
      leads = leads.filter(lead => 
        lead.city.toLowerCase().includes(sanitizedCity.toLowerCase())
      );
    }

    // Generate CSV
    const csv = generateCSV(leads);

    // Generate filename
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = cityFilter
      ? `${cityFilter.toLowerCase().replace(/\s+/g, "_")}_leads_${timestamp}.csv`
      : `all_cities_leads_${timestamp}.csv`;

    return new Response(csv, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error in download-lead-csv:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
