import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Map PredictHQ categories to our event_category enum
const categoryMapping: { [key: string]: string } = {
  'music': 'concert',
  'concert': 'concert',
  'sports': 'sports',
  'sport': 'sports',
  'arts & theatre': 'theatre',
  'arts': 'theatre',
  'theatre': 'theatre',
  'performing-arts': 'theatre',
  'film': 'other',
  'movies': 'other',
  'miscellaneous': 'other',
  'food & drink': 'other',
  'festival': 'festival',
  'community': 'community',
  'conference': 'conference',
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
    const startISO = startDate || new Date().toISOString();
    const endISO = endDate || new Date(Date.now() + 1000 * 60 * 60 * 24 * 180).toISOString();

    // 1. Fetch physical events
    const eventsParams = new URLSearchParams({
      'within': `${searchRadius}km@${latitude},${longitude}`,
      'active.gte': startISO,
      'active.lte': endISO,
      'sort': 'start',
      'limit': '500',
    });

    const eventsUrl = `https://api.predicthq.com/v1/events/?${eventsParams.toString()}`;
    console.log('Calling PredictHQ Events API:', eventsUrl);

    const eventsResponse = await fetch(eventsUrl, {
      headers: {
        'Authorization': `Bearer ${predictHqApiKey}`,
        'Accept': 'application/json',
      },
    });

    if (!eventsResponse.ok) {
      const errorText = await eventsResponse.text();
      console.error('PredictHQ Events API error:', eventsResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch events from PredictHQ', details: errorText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const eventsData = await eventsResponse.json();
    const events = eventsData.results || [];
    console.log(`Found ${events.length} physical events from PredictHQ`);

    // 2. Fetch Live TV broadcasts for the same area
    const broadcastsParams = new URLSearchParams({
      'location.origin': `${latitude},${longitude}`,
      'start.gte': startISO,
      'start.lt': endISO,
      'broadcast_status': 'predicted,scheduled',
      'sort': 'start',
      'limit': '500',
    });

    const broadcastsUrl = `https://api.predicthq.com/v1/broadcasts/?${broadcastsParams.toString()}`;
    console.log('Calling PredictHQ Broadcasts API:', broadcastsUrl);

    const broadcastsResponse = await fetch(broadcastsUrl, {
      headers: {
        'Authorization': `Bearer ${predictHqApiKey}`,
        'Accept': 'application/json',
      },
    });

    let broadcasts = [];
    if (broadcastsResponse.ok) {
      const broadcastsData = await broadcastsResponse.json();
      broadcasts = broadcastsData.results || [];
      console.log(`Found ${broadcasts.length} TV broadcasts from PredictHQ`);
    } else {
      console.warn('Could not fetch broadcasts (may require Live TV Events access)');
    }

    const allEvents = [...events, ...broadcasts];
    console.log(`Found ${allEvents.length} total events (physical + TV broadcasts) from PredictHQ`);

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

    // Process all events (both physical and TV broadcasts)
    const eventsToInsert = allEvents
      .filter((item: any) => {
        // For physical events: check location
        if (item.location && item.location.length >= 2) {
          const evLat = item.location[1];
          const evLon = item.location[0];
          return distanceKm(Number(latitude), Number(longitude), evLat, evLon) <= searchRadius;
        }
        // For broadcasts: always include (they're already location-filtered by API)
        if (item.broadcast_id) {
          return true;
        }
        return false;
      })
      .map((item: any) => {
        // Handle TV broadcasts
        if (item.broadcast_id) {
          const event = item.event;
          const category = event?.category || 'sports';
          const viewership = item.phq_viewership || 1000;
          
          // Use the actual event location (where match is played)
          const eventLat = event?.location?.geopoint?.lat || Number(latitude);
          const eventLon = event?.location?.geopoint?.lon || Number(longitude);
          
          // Create venue name from broadcast location
          const broadcastLocation = item.location?.places?.[0];
          const venueName = broadcastLocation ? 
            `TV: ${broadcastLocation.name}, ${broadcastLocation.region}` : 
            'TV Broadcast';
          
          return {
            source: 'predicthq-broadcast',
            source_id: item.broadcast_id,
            title: event?.title || 'Live TV Event',
            description: `Live TV broadcast with ${viewership.toLocaleString()} predicted viewers in your area`,
            category: mapCategory(category),
            start_time: item.dates?.start || event?.dates?.start,
            end_time: event?.dates?.predicted_end || event?.dates?.start,
            venue_name: venueName,
            venue_lat: eventLat,
            venue_lon: eventLon,
            city: broadcastLocation?.name || '',
            expected_attendance: viewership, // Use viewership as "attendance"
            p10: Math.floor(viewership * 0.8),
            p90: Math.floor(viewership * 1.2),
            raw_url: null,
          };
        }
        
        // Handle physical events (existing logic)
        const category = item.category || 'other';
        const phqAttendance = item.phq_attendance || item.predicted_attendance || 500;
        const venueName = item.entities?.find((e: any) => e.type === 'venue')?.name || 'Unknown Venue';
        const eventDescription = item.description || `${item.title || 'Event'} på ${venueName}`;
        
        return {
          source: 'predicthq',
          source_id: item.id,
          title: item.title || 'Untitled Event',
          description: eventDescription,
          category: mapCategory(category),
          start_time: item.start,
          end_time: item.end || item.start,
          venue_name: venueName,
          venue_lat: item.location[1],
          venue_lon: item.location[0],
          city: item.entities?.find((e: any) => e.type === 'venue')?.formatted_address?.split(',')[0] || '',
          expected_attendance: phqAttendance,
          p10: Math.floor(phqAttendance * 0.5),
          p90: Math.floor(phqAttendance * 1.2),
          raw_url: null,
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
        total_found: allEvents.length,
        physical_events: events.length,
        tv_broadcasts: broadcasts.length,
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
