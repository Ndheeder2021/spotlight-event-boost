import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    console.log('Starting AI chat with', messages.length, 'messages');

    const systemPrompt = `Du är en hjälpsam AI-assistent för Spotlight, en plattform för event-driven marknadsföring.

Din uppgift är att hjälpa potentiella och befintliga kunder med:
- Frågor om produkten och dess funktioner
- Prissättning och olika planer (Starter €29/mån, Professional €49/mån, Enterprise - kontakta oss)
- Hur plattformen fungerar (AI-driven eventupptäckt, automatisk kampanjgenerering)
- Tekniska frågor om integrationer
- Hjälp med att komma igång

Viktiga funktioner att nämna:
- AI-genererade kampanjer baserat på lokala evenemang
- Automatisk eventupptäckt
- Analytics och ROI-tracking
- A/B-testning
- Team-samarbete
- PDF-export och delning
- 14 dagars gratis provperiod

Svara alltid på svenska, var vänlig, professionell och hjälpsam. Håll svaren koncisa men informativa.
Om användaren frågar om något du inte är säker på, rekommendera att de kontaktar supporten på support@spotlightevents.online`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-mini-2025-08-07',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        max_completion_tokens: 800,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    // Stream the response back to the client
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error in ai-chat-support:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
