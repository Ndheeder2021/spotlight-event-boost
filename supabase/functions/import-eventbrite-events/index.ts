import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Map Ticketmaster classifications to our event_category enum
const categoryMapping: { [key: string]: string } = {
  'music': 'concert',
  'concert': 'concert',
  'sports': 'sport',
  'sport': 'sport',
  'arts & theatre': 'concert',
  'film': 'other',
  'miscellaneous': 'other',
  'food & drink': 'food',
  'festival': 'festival',
  'community': 'community',
  'default': 'other'
};

function mapCategory(classification: string): string {
  const normalizedCategory = classification?.toLowerCase() || '';
  return categoryMapping[normalizedCategory] || categoryMapping['default'];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ticketmasterApiKey = Deno.env.get('TICKETMASTER_API_KEY');
    if (!ticketmasterApiKey) {
      console.error('TICKETMASTER_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'Ticketmaster API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { latitude, longitude, radius = 25, startDate, endDate } = await req.json();

    // Normalize and clamp radius between 20 and 150 km
    const searchRadius = Math.max(20, Math.min(Number(radius) || 25, 150));

    if (!latitude || !longitude) {
      return new Response(
        JSON.stringify({ error: 'Latitude and longitude are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching events from Ticketmaster: lat=${latitude}, lon=${longitude}, radius=${searchRadius}km`);

    // Build common params
    const baseParams = new URLSearchParams({
      apikey: ticketmasterApiKey,
      latlong: `${latitude},${longitude}`,
      unit: 'km',
      size: '200',
      sort: 'date,asc',
      locale: 'sv-se',
    });

    // Date window: default to next 180 days if not provided
    const startISO = startDate
      ? new Date(startDate).toISOString().replace(/\.\d{3}Z$/, 'Z')
      : new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
    const endISO = endDate
      ? new Date(endDate).toISOString().replace(/\.\d{3}Z$/, 'Z')
      : new Date(Date.now() + 1000 * 60 * 60 * 24 * 180)
          .toISOString()
          .replace(/\.\d{3}Z$/, 'Z');

    baseParams.append('startDateTime', startISO);
    baseParams.append('endDateTime', endISO);

    // Helper to call an endpoint with a given radius
    const callDiscovery = async (baseUrl: string, radiusKm: number) => {
      const params = new URLSearchParams(baseParams);
      params.set('radius', String(radiusKm));
      const url = `${baseUrl}?${params.toString()}`;
      console.log('Calling Ticketmaster API:', url.replace(ticketmasterApiKey, 'API_KEY_HIDDEN'));
      const res = await fetch(url);
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Ticketmaster API error:', res.status, errorText);
        return { events: [], status: res.status, errorText };
      }
      const data = await res.json();
      const evts = data._embedded?.events || [];
      console.log(`Ticketmaster returned ${evts.length} events from ${baseUrl}`);
      return { events: evts };
    };

    // Attempt 1: EU endpoint without explicit country filter
    const EU_BASE = 'https://app.ticketmaster.eu/discovery/v2/events.json';
    const GLOBAL_BASE = 'https://app.ticketmaster.com/discovery/v2/events.json';

    let combined: any[] = [];
    let { events: ev1 } = await callDiscovery(EU_BASE, searchRadius);
    combined = ev1;

    // Attempt 2: increase radius to 100km if none
    if (combined.length === 0 && searchRadius < 100) {
      const { events: ev2 } = await callDiscovery(EU_BASE, 100);
      combined = ev2;
    }

    // Attempt 3: fallback to global endpoint
    if (combined.length === 0) {
      const { events: ev3 } = await callDiscovery(GLOBAL_BASE, Math.max(searchRadius, 100));
      combined = ev3;
    }

    // Deduplicate by id and finalize
    const seen = new Set<string>();
    const events = combined.filter((e: any) => {
      if (!e?.id || seen.has(e.id)) return false;
      seen.add(e.id);
      return true;
    });
    console.log(`Found ${events.length} events after fallbacks`);

    if (events.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No events found', imported: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Transform and insert events into our database
    const eventsToInsert = events
      .filter((event: any) => {
        const venue = event._embedded?.venues?.[0];
        return venue && venue.location;
      })
      .map((event: any) => {
        const venue = event._embedded?.venues?.[0];
        const classification = event.classifications?.[0]?.segment?.name || 'Other';
        
        // Calculate capacity from priceRanges or use default
        const capacity = event.seatmap?.staticUrl ? 500 : 200;

        return {
          source: 'ticketmaster',
          source_id: event.id,
          title: event.name || 'Untitled Event',
          description: event.info || event.pleaseNote || '',
          category: mapCategory(classification),
          start_time: event.dates?.start?.dateTime || event.dates?.start?.localDate,
          end_time: event.dates?.end?.dateTime || event.dates?.end?.approximate?.endDateTime || event.dates?.start?.dateTime,
          venue_name: venue.name || 'Unknown Venue',
          venue_lat: parseFloat(venue.location?.latitude) || 0,
          venue_lon: parseFloat(venue.location?.longitude) || 0,
          city: venue.city?.name || venue.address?.city || '',
          expected_attendance: capacity,
          p10: Math.floor(capacity * 0.5),
          p90: Math.floor(capacity * 0.9),
          raw_url: event.url || '',
        };
      });

    console.log(`Inserting ${eventsToInsert.length} events into database`);

    // Insert events, ignore conflicts on source_id
    const { data: insertedEvents, error: insertError } = await supabase
      .from('events')
      .upsert(eventsToInsert, { 
        onConflict: 'source_id',
        ignoreDuplicates: false 
      })
      .select();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to save events', details: insertError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Successfully imported ${insertedEvents?.length || 0} events`);

    return new Response(
      JSON.stringify({ 
        message: 'Events imported successfully',
        imported: insertedEvents?.length || 0,
        total_found: events.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in import-eventbrite-events function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
