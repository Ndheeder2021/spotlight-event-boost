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

    const eventTitle = event.title;
    const businessType = location.business_type || "restaurant";
    const expectedAttendance = event.expected_attendance;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    console.log("Generating campaigns for event:", eventTitle);

    const businessTypeText = businessType === 'restaurant' ? 'restaurang' : 
                             businessType === 'bar' ? 'bar' : 
                             businessType === 'cafe' ? 'kafé' : 'verksamhet';

    const prompt = `Du är en marknadsföringsstrateg för besöksnäringen i Sverige.
Skapa 2 detaljerade kampanjidéer för en ${businessTypeText} nära eventet "${eventTitle}" med ${expectedAttendance} förväntade besökare.

Varje kampanjidé ska vara specifik för verksamhetstypen och inkludera:
- title: En catchy titel på svenska
- description: Detaljerad beskrivning (60-80 ord) som förklarar kampanjens koncept, målgrupp och genomförande
- target_audience: Vem riktar sig kampanjen till
- recommended_timing: När kampanjen ska köras (t.ex. "2 veckor före eventet")
- channels: Vilka kanaler som ska användas (t.ex. "Sociala medier, email, affischer")
- expected_outcome: Förväntade resultat
- action_steps: Konkreta steg för att genomföra kampanjen (3-4 punkter)
- ad_ideas: Två annonsidéer (en för Meta och en för TikTok) med följande för varje:
  * platform: "Meta" eller "TikTok"
  * ad_copy: Annonstext (max 125 tecken för Meta, max 100 för TikTok)
  * visual_concept: Detaljerad beskrivning av visuellt koncept för bilden/videon
  * cta: Call-to-action text
  * targeting: Målgruppsspecifikation
  * budget_recommendation: Rekommenderad budget i SEK (baserat på svenska marknaden, t.ex. "3 000-5 000 SEK för en 7-dagars kampanj" eller "500-800 SEK/dag i 14 dagar")

VIKTIGT: Budgetrekommendationer ska vara realistiska för svenska marknaden och baseras på:
- Kampanjens längd och timing
- Förväntad räckvidd och antal besökare
- Plattformens kostnad per klick/visning i Sverige
- Verksamhetstypen och dess typiska marginaler

Anpassa kampanjerna specifikt för en ${businessTypeText}.`;


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

    // Add event contact information
    const responseData = {
      ...campaignsData,
      event_contact: {
        title: event.title,
        venue: event.venue_name,
        date: event.start_time,
        expected_attendance: event.expected_attendance,
        description: event.description || "Ingen beskrivning tillgänglig",
        event_url: event.raw_url || null
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