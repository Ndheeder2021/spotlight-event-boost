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

    const { latitude, longitude, radius = 10, startDate, endDate } = await req.json();

    if (!latitude || !longitude) {
      return new Response(
        JSON.stringify({ error: 'Latitude and longitude are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching events from Ticketmaster: lat=${latitude}, lon=${longitude}, radius=${radius}km`);

    // Build Ticketmaster API URL
    const params = new URLSearchParams({
      'apikey': ticketmasterApiKey,
      'latlong': `${latitude},${longitude}`,
      'radius': radius.toString(),
      'unit': 'km',
      'size': '100',
      'sort': 'date,asc',
    });

    if (startDate) {
      params.append('startDateTime', new Date(startDate).toISOString().replace(/\.\d{3}Z$/, 'Z'));
    }
    if (endDate) {
      params.append('endDateTime', new Date(endDate).toISOString().replace(/\.\d{3}Z$/, 'Z'));
    }

    const ticketmasterUrl = `https://app.ticketmaster.com/discovery/v2/events.json?${params.toString()}`;

    console.log('Calling Ticketmaster API');

    // Fetch events from Ticketmaster
    const response = await fetch(ticketmasterUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ticketmaster API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: `Ticketmaster API error: ${response.status}`, details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const events = data._embedded?.events || [];
    console.log(`Found ${events.length} events from Ticketmaster`);

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
