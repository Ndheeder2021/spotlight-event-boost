import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Map Eventbrite categories to our event_category enum
const categoryMapping: { [key: string]: string } = {
  'music': 'concert',
  'concerts': 'concert',
  'performing-arts': 'concert',
  'sports-fitness': 'sport',
  'sports': 'sport',
  'food-drink': 'food',
  'food': 'food',
  'festivals': 'festival',
  'community': 'community',
  'business': 'other',
  'film-media': 'other',
  'arts': 'other',
  'science-tech': 'other',
  'default': 'other'
};

function mapCategory(eventbriteCategory: string): string {
  const normalizedCategory = eventbriteCategory?.toLowerCase() || '';
  return categoryMapping[normalizedCategory] || categoryMapping['default'];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const eventbriteApiKey = Deno.env.get('EVENTBRITE_API_KEY');
    if (!eventbriteApiKey) {
      console.error('EVENTBRITE_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'Eventbrite API key not configured' }),
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

    console.log(`Fetching events from Eventbrite: lat=${latitude}, lon=${longitude}, radius=${radius}km`);

    // Build Eventbrite API URL - correct endpoint structure
    const params = new URLSearchParams({
      'location.latitude': latitude.toString(),
      'location.longitude': longitude.toString(),
      'location.within': `${radius}km`,
      'expand': 'venue,category',
      'sort_by': 'date',
    });

    if (startDate) {
      params.append('start_date.range_start', startDate);
    }
    if (endDate) {
      params.append('start_date.range_end', endDate);
    }

    const eventbriteUrl = `https://www.eventbriteapi.com/v3/events/search?${params.toString()}`;

    console.log('Calling Eventbrite API:', eventbriteUrl);

    // Fetch events from Eventbrite
    const response = await fetch(eventbriteUrl, {
      headers: {
        'Authorization': `Bearer ${eventbriteApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Eventbrite API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: `Eventbrite API error: ${response.status}`, details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log(`Found ${data.events?.length || 0} events from Eventbrite`);

    if (!data.events || data.events.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No events found', imported: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Transform and insert events into our database
    const eventsToInsert = data.events
      .filter((event: any) => event.venue && event.venue.address) // Only events with valid venue
      .map((event: any) => {
        const venue = event.venue;
        const category = event.category?.name || 'Other';
        const capacity = event.capacity || 100; // Default capacity if not provided

        return {
          source: 'eventbrite',
          source_id: event.id,
          title: event.name?.text || 'Untitled Event',
          description: event.description?.text || event.summary || '',
          category: mapCategory(category),
          start_time: event.start?.utc || event.start?.local,
          end_time: event.end?.utc || event.end?.local,
          venue_name: venue.name || 'Unknown Venue',
          venue_lat: parseFloat(venue.latitude) || 0,
          venue_lon: parseFloat(venue.longitude) || 0,
          city: venue.address?.city || venue.address?.region || '',
          expected_attendance: capacity,
          p10: Math.floor(capacity * 0.5), // Estimate 50% for p10
          p90: Math.floor(capacity * 0.9), // Estimate 90% for p90
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
        total_found: data.events.length,
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
