import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper to schedule background work safely in Edge runtime
function waitUntil(p: Promise<any>) {
  const er: any = (globalThis as any).EdgeRuntime;
  if (er && typeof er.waitUntil === 'function') {
    er.waitUntil(p);
  } else {
    // Best-effort fallback
    setTimeout(() => { p.catch((e) => console.error('Background task error:', e)); }, 0);
  }
}

interface LeadFinderRequest {
  cities: string[];
  businessTypes: string[];
  maxResultsPerCity: number;
}

interface BusinessLead {
  city: string;
  businessName: string;
  website: string;
  email: string;
  category: string;
}

// Extract emails from HTML content
function extractEmails(html: string): string[] {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emails = html.match(emailRegex) || [];
  
  // Filter out personal emails and duplicates
  const personalDomains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'live.com', 'icloud.com', 'aol.com'];
  const businessEmails = emails.filter(email => {
    const domain = email.split('@')[1]?.toLowerCase();
    return domain && !personalDomains.includes(domain);
  });
  
  return [...new Set(businessEmails)]; // Deduplicate
}

// Crawl website to find contact emails
async function crawlWebsiteForEmails(websiteUrl: string): Promise<string[]> {
  try {
    const url = new URL(websiteUrl);
    const baseUrl = `${url.protocol}//${url.hostname}`;
    
    // Try common contact page paths
    const pathsToCheck = [
      '/',
      '/contact',
      '/kontakt',
      '/om-oss',
      '/about',
      '/about-us',
    ];
    
    const allEmails: string[] = [];
    
    for (const path of pathsToCheck) {
      try {
        const response = await fetch(`${baseUrl}${path}`, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LeadFinderBot/1.0)' },
          signal: AbortSignal.timeout(5000), // 5 second timeout
        });
        
        if (response.ok) {
          const html = await response.text();
          const emails = extractEmails(html);
          allEmails.push(...emails);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log(`Failed to fetch ${baseUrl}${path}:`, errorMessage);
      }
      
      // Small delay between requests to be polite
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    return [...new Set(allEmails)]; // Deduplicate
  } catch (error) {
    console.error(`Error crawling ${websiteUrl}:`, error);
    return [];
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    // Decode JWT locally (base64url-safe)
    const bearer = authHeader.replace(/^Bearer\s+/i, "").trim();
    let userId: string | null = null;
    try {
      const payloadPart = bearer.split(".")[1];
      const pad = payloadPart.length % 4 ? "=".repeat(4 - (payloadPart.length % 4)) : "";
      const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/") + pad;
      const json = JSON.parse(atob(base64));
      userId = (json.sub || json.user_id || null) as string | null;
    } catch (e) {
      console.error("JWT decode failed, will fallback to auth.getUser():", e);
    }

    if (!userId) {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("Auth fallback failed:", userError?.message || 'no user');
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      userId = user.id;
    }

    console.log("User authenticated:", userId);

    // Verify user is admin via user_roles
    const { data: roles, error: rolesError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (rolesError) {
      console.error("Error fetching user roles:", rolesError);
      return new Response(
        JSON.stringify({ error: "Failed to verify admin status" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!roles) {
      console.error("User is not admin");
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { cities, businessTypes, maxResultsPerCity }: LeadFinderRequest = await req.json();

    if (!cities?.length || !businessTypes?.length) {
      throw new Error("Cities and business types are required");
    }

    // Rate limiting check
    const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();
    const { data: recentJobs } = await supabase
      .from("lead_finder_jobs")
      .select("id")
      .eq("user_id", userId)
      .gte("created_at", oneMinuteAgo);

    if (recentJobs && recentJobs.length > 0) {
      throw new Error("Please wait one minute between job runs");
    }

    // Calculate total steps
    const totalSteps = cities.length * businessTypes.length;

    // Create job record
    const { data: job, error: jobError } = await supabase
      .from("lead_finder_jobs")
      .insert({
        user_id: userId,
        cities,
        business_types: businessTypes,
        max_results_per_city: maxResultsPerCity,
        status: "running",
        total_steps: totalSteps,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (jobError) throw jobError;

    // Kick off background processing and return immediately
    const jobId = job.id as string;
    waitUntil((async () => {
      try {
        const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
        const service = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          SERVICE_KEY
        );

        const GOOGLE_PLACES_API_KEY = Deno.env.get("GOOGLE_PLACES_API_KEY");
        if (!GOOGLE_PLACES_API_KEY) {
          await service
            .from("lead_finder_jobs")
            .update({ status: "failed", error_message: "Google Places API key not configured" })
            .eq("id", jobId);
          return;
        }

        const allLeads: BusinessLead[] = [];
        let currentStep = 0;

        for (const city of cities) {
          for (const businessType of businessTypes) {
            // Update progress at the start of this step
            const prevProgress = Math.round(((currentStep) / Math.max(totalSteps, 1)) * 100);
            await service.from("lead_finder_jobs").update({ progress: Math.max(prevProgress - Math.round(100/Math.max(totalSteps,1)), 0) }).eq("id", jobId);

            currentStep++;
            console.log(`Processing ${city} - ${businessType} (${currentStep}/${totalSteps})`);

            try {
              const searchQuery = `${businessType}s in ${city}`;
              let nextPageToken: string | null = null;
              let resultsForThisCategory = 0;

              do {
                const searchUrl = new URL("https://places.googleapis.com/v1/places:searchText");
                const searchResponse: Response = await fetch(searchUrl, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
                    "X-Goog-FieldMask": "places.id,places.displayName,places.websiteUri,nextPageToken",
                  },
                  body: JSON.stringify({
                    textQuery: searchQuery,
                    pageSize: Math.min(20, maxResultsPerCity - resultsForThisCategory),
                    ...(nextPageToken && { pageToken: nextPageToken }),
                  }),
                });

                if (!searchResponse.ok) {
                  const errorText = await searchResponse.text();
                  console.error(`Google Places API error: ${searchResponse.status} - ${errorText}`);
                  break;
                }

                const searchData: any = await searchResponse.json();
                const places = searchData.places || [];
                nextPageToken = searchData.nextPageToken || null;

                for (const place of places) {
                  if (resultsForThisCategory >= maxResultsPerCity) break;
                  const businessName = place.displayName?.text || "Unknown";
                  const website = place.websiteUri || "";
                  if (!website) continue;

                  console.log(`Crawling ${website} for emails...`);
                  const emails = await crawlWebsiteForEmails(website);

                  // Only add the first email found per business
                  const email = emails.length > 0 ? emails[0] : "";
                  allLeads.push({ city, businessName, website, email, category: businessType });
                  resultsForThisCategory++;
                }

                // Update partial progress within this step after each page
                const stepWeight = 100 / Math.max(totalSteps, 1);
                const base = Math.round(((currentStep - 1) / Math.max(totalSteps, 1)) * 100);
                const partial = Math.min(stepWeight * (resultsForThisCategory / Math.max(maxResultsPerCity, 1)), stepWeight * 0.95);
                const updatedProgress = Math.min(99, Math.round(base + partial));
                await service.from("lead_finder_jobs").update({ progress: updatedProgress }).eq("id", jobId);

                if (nextPageToken) {
                  await new Promise(resolve => setTimeout(resolve, 2000));
                }
              } while (nextPageToken && resultsForThisCategory < maxResultsPerCity);
            } catch (err) {
              console.error(`Error processing ${city} - ${businessType}:`, err);
            }

            const progressPercent = Math.round((currentStep / totalSteps) * 100);
            await service.from("lead_finder_jobs").update({ progress: progressPercent }).eq("id", jobId);
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

        await service
          .from("lead_finder_jobs")
          .update({ status: "completed", progress: 100, results_json: allLeads, completed_at: new Date().toISOString() })
          .eq("id", jobId);

        console.log(`Job ${jobId} completed with ${allLeads.length} leads`);
      } catch (bgErr) {
        console.error("Background job failed:", bgErr);
        const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
        const service = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          SERVICE_KEY
        );
        await service
          .from("lead_finder_jobs")
          .update({ status: "failed", error_message: bgErr instanceof Error ? bgErr.message : String(bgErr) })
          .eq("id", jobId);
      }
    })());

    // Respond immediately so the client doesn't time out
    return new Response(
      JSON.stringify({ success: true, jobId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in start-lead-finder:", error);
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
