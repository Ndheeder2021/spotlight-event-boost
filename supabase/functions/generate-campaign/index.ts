import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CampaignRequest {
  eventId: string;
  locationId: string;
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
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    const { eventId, locationId }: CampaignRequest = await req.json();

    // Fetch event data
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (eventError || !event) {
      throw new Error("Event not found");
    }

    // Fetch location data
    const { data: location, error: locationError } = await supabase
      .from("locations")
      .select("*")
      .eq("id", locationId)
      .single();

    if (locationError || !location) {
      throw new Error("Location not found");
    }

    // Calculate distance between event and location
    const eventLat = event.venue_lat;
    const eventLon = event.venue_lon;
    const locationLat = location.lat;
    const locationLon = location.lon;
    
    // Haversine formula for distance calculation
    const R = 6371; // Earth's radius in km
    const dLat = (locationLat - eventLat) * Math.PI / 180;
    const dLon = (locationLon - eventLon) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(eventLat * Math.PI / 180) * Math.cos(locationLat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distanceKm = R * c;

    // Estimate potential customers based on event attendance and distance
    // Closer = higher conversion rate
    let estimatedCustomerRate = 0;
    if (distanceKm <= 0.5) estimatedCustomerRate = 0.15; // 15% within 500m
    else if (distanceKm <= 1) estimatedCustomerRate = 0.10; // 10% within 1km
    else if (distanceKm <= 2) estimatedCustomerRate = 0.05; // 5% within 2km
    else if (distanceKm <= 5) estimatedCustomerRate = 0.02; // 2% within 5km
    else estimatedCustomerRate = 0.01; // 1% beyond 5km

    const estimatedCustomers = Math.round(event.expected_attendance * estimatedCustomerRate);

    const eventTitle = event.title;
    const businessType = location.business_type || "restaurant";
    const expectedAttendance = event.expected_attendance;
    const eventCity = event.city || "staden";
    const venueName = event.venue_name;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    console.log("Generating campaigns for event:", eventTitle, "Distance:", distanceKm.toFixed(2), "km");

    const businessTypeText = businessType === 'restaurant' ? 'restaurang' : 
                             businessType === 'bar' ? 'bar' : 
                             businessType === 'cafe' ? 'kafé' : 'verksamhet';

    const prompt = `Du är en marknadsföringsstrateg för besöksnäringen.

KONTEXT:
- Event: "${eventTitle}" i ${eventCity}
- Plats: ${venueName}
- Förväntade eventbesökare: ${expectedAttendance.toLocaleString()}
- Verksamhet: ${businessTypeText}
- Avstånd från verksamhet till event: ${distanceKm.toFixed(1)} km
- Uppskattat antal potentiella kunder från eventet: ${estimatedCustomers.toLocaleString()} personer (${(estimatedCustomerRate * 100).toFixed(1)}% konverteringsgrad baserat på avstånd)

Skapa 2 detaljerade kampanjidéer för denna ${businessTypeText} som kan dra nytta av närheten till eventet.

Varje kampanjidé ska vara specifik för verksamhetstypen och inkludera:
- title: En catchy titel på svenska
- description: Detaljerad beskrivning (60-80 ord) som förklarar kampanjens koncept, målgrupp och genomförande
- target_audience: Vem riktar sig kampanjen till
- recommended_timing: När kampanjen ska köras (t.ex. "2 veckor före eventet")
- channels: Vilka kanaler som ska användas (t.ex. "Sociala medier, email, affischer")
- expected_outcome: Förväntade resultat baserat på ${estimatedCustomers} potentiella kunder
- action_steps: Konkreta steg för att genomföra kampanjen (3-4 punkter)
- ad_ideas: Två annonsidéer (en för Meta och en för TikTok) med följande för varje:
  * platform: "Meta" eller "TikTok"
  * ad_copy: Annonstext (max 125 tecken för Meta, max 100 för TikTok)
  * visual_concept: Detaljerad beskrivning av visuellt koncept för bilden/videon
  * cta: Call-to-action text
  * targeting: Målgruppsspecifikation (geografisk: ${distanceKm.toFixed(0)} km radie, demografisk baserat på eventtyp)
  * budget_recommendation: Rekommenderad budget i lokal valuta med realistic beräkning baserat på:
    - ${estimatedCustomers} potentiella kunder
    - Cost-per-click/impression för regionen
    - Kampanjens längd
    - Förväntad räckvidd
    Format: "X-Y [valuta] för en Z-dagars kampanj" eller "X-Y [valuta]/dag i Z dagar"

VIKTIGT för budgetrekommendationer:
- Basera budget på faktisk räckvidd: ${estimatedCustomers} personer är målgruppen
- Använd realistiska CPC/CPM för regionen (ex: Meta CPC $0.50-2.00, TikTok CPM $5-15)
- Räkna: Budget = (Målgrupp × Önskad frekvens × Kostnad per kontakt)
- Var specifik med valutor och tidsperioder
- Högre budget för större events och närmare avstånd

Anpassa kampanjerna specifikt för en ${businessTypeText} på ${distanceKm.toFixed(1)} km avstånd.`;


    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a marketing expert for hospitality businesses." },
          { role: "user", content: prompt }
        ],
        tools: [{
          type: "function",
          function: {
            name: "suggest_campaigns",
            description: "Generate detailed campaign suggestions for hospitality businesses",
            parameters: {
              type: "object",
              properties: {
                campaigns: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                      target_audience: { type: "string" },
                      recommended_timing: { type: "string" },
                      channels: { type: "string" },
                      expected_outcome: { type: "string" },
                      action_steps: {
                        type: "array",
                        items: { type: "string" }
                      },
                      ad_ideas: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            platform: { type: "string", enum: ["Meta", "TikTok"] },
                            ad_copy: { type: "string" },
                            visual_concept: { type: "string" },
                            cta: { type: "string" },
                            targeting: { type: "string" },
                            budget_recommendation: { type: "string" }
                          },
                          required: ["platform", "ad_copy", "visual_concept", "cta", "targeting", "budget_recommendation"]
                        }
                      }
                    },
                    required: ["title", "description", "target_audience", "recommended_timing", "channels", "expected_outcome", "action_steps", "ad_ideas"],
                    additionalProperties: false
                  }
                }
              },
              required: ["campaigns"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "suggest_campaigns" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall || !toolCall.function?.arguments) {
      throw new Error("No valid response from AI");
    }

    const campaignsData = JSON.parse(toolCall.function.arguments);
    console.log("Generated campaigns:", campaignsData);

    // Clean description from PredictHQ references
    let cleanDescription = event.description || "Ingen beskrivning tillgänglig";
    cleanDescription = cleanDescription.replace(/Sourced from predicthq\.com/gi, '').trim();
    if (!cleanDescription || cleanDescription === '') {
      cleanDescription = `${event.title} på ${event.venue_name}`;
    }

    // Add event contact information
    const responseData = {
      ...campaignsData,
      event_contact: {
        title: event.title,
        venue: event.venue_name,
        date: event.start_time,
        expected_attendance: event.expected_attendance,
        description: cleanDescription,
        event_url: event.raw_url && !event.raw_url.includes('predicthq') ? event.raw_url : null
      }
    };

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error in generate-campaign:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});