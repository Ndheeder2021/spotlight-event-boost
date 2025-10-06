import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const MAPBOX_TOKEN = Deno.env.get("MAPBOX_PUBLIC_TOKEN");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GeocodeRequest {
  query: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query }: GeocodeRequest = await req.json();

    if (!query || query.length < 3) {
      return new Response(
        JSON.stringify({ features: [] }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Geocoding query:", query);

    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?country=SE&types=address,place&access_token=${MAPBOX_TOKEN}`
    );

    if (!response.ok) {
      console.error("Mapbox API error:", response.status, await response.text());
      throw new Error(`Mapbox API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Geocoding results:", data.features?.length || 0, "results");

    return new Response(
      JSON.stringify(data),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in geocode-address function:", error);
    return new Response(
      JSON.stringify({ error: error.message, features: [] }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
