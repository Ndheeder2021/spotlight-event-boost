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
    const predictHqApiKey = Deno.env.get('PREDICTHQ_API_KEY');
    if (!predictHqApiKey) {
      console.error('PREDICTHQ_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'PredictHQ API key not configured' }),
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

    console.log(`Fetching events from PredictHQ: lat=${latitude}, lon=${longitude}, radius=${searchRadius}km`);

    // Date window: default to next 180 days if not provided
    const startISO = startDate || new Date().toISOString().split('T')[0];
    const endISO = endDate || new Date(Date.now() + 1000 * 60 * 60 * 24 * 180).toISOString().split('T')[0];

    // Build PredictHQ API request
    const params = new URLSearchParams({
      'location_around.origin': `${latitude},${longitude}`,
      'location_around.offset': `${searchRadius}km`,
      'active.gte': startISO,
      'active.lte': endISO,
      'sort': 'start',
      'limit': '500',
    });

    const url = `https://api.predicthq.com/v1/events/?${params.toString()}`;
    console.log('Calling PredictHQ API:', url);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${predictHqApiKey}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('PredictHQ API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch events from PredictHQ', details: errorText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const events = data.results || [];
    console.log(`Found ${events.length} events from PredictHQ`);

    // Distance helper (Haversine)
    const toRad = (v: number) => (v * Math.PI) / 180;
    const distanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371; // km
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    // Keep only events within requested radius
    const nearbyEvents = events.filter((event: any) => {
      if (!event.location || event.location.length < 2) return false;
      const evLat = event.location[1];
      const evLon = event.location[0];
      return distanceKm(Number(latitude), Number(longitude), evLat, evLon) <= searchRadius;
    });

    console.log(`Nearby events within ${searchRadius}km: ${nearbyEvents.length}`);

    if (nearbyEvents.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No events found within radius', imported: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Transform and insert events into our database
    const eventsToInsert = nearbyEvents
      .filter((event: any) => {
        return event.location && event.location.length >= 2;
      })
      .map((event: any) => {
        const category = event.category || 'other';
        const phqAttendance = event.phq_attendance || event.predicted_attendance || 500;
        
        return {
          source: 'predicthq',
          source_id: event.id,
          title: event.title || 'Untitled Event',
          description: event.description || '',
          category: mapCategory(category),
          start_time: event.start,
          end_time: event.end || event.start,
          venue_name: event.entities?.find((e: any) => e.type === 'venue')?.name || 'Unknown Venue',
          venue_lat: event.location[1],
          venue_lon: event.location[0],
          city: event.entities?.find((e: any) => e.type === 'venue')?.formatted_address?.split(',')[0] || '',
          expected_attendance: phqAttendance,
          p10: Math.floor(phqAttendance * 0.5),
          p90: Math.floor(phqAttendance * 1.2),
          raw_url: `https://www.predicthq.com/events/${event.id}`,
        };
      });

    console.log(`Inserting ${eventsToInsert.length} events into database`);

    // Insert events - ignore duplicates based on source_id
    // Note: We filter out items with null source_id before upserting
    const eventsWithSourceId = eventsToInsert.filter((e: any) => e.source_id);
    
    const { data: insertedEvents, error: insertError } = await supabase
      .from('events')
      .upsert(eventsWithSourceId, { 
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
