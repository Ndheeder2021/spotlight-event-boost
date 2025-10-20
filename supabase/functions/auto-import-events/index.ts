import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Starting automatic event import for all tenants');

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch all locations with their tenant info
    const { data: locations, error: locationsError } = await supabaseClient
      .from('locations')
      .select('id, tenant_id, lat, lon, radius_km, name')
      .not('lat', 'is', null)
      .not('lon', 'is', null);

    if (locationsError) {
      console.error('Error fetching locations:', locationsError);
      throw locationsError;
    }

    if (!locations || locations.length === 0) {
      console.log('No locations found to import events for');
      return new Response(
        JSON.stringify({ message: 'No locations found', imported: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    console.log(`Found ${locations.length} locations to process`);

    let totalImported = 0;
    const results = [];

    // Import events for each location
    for (const location of locations) {
      try {
        console.log(`Processing location ${location.id} (${location.name})`);
        
        const radiusKm = location.radius_km || 20;
        const startDate = new Date().toISOString();
        const endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(); // 90 days ahead

        // Call the import function for this location
        const { data: importResult, error: importError } = await supabaseClient.functions.invoke(
          'import-eventbrite-events',
          {
            body: {
              latitude: location.lat,
              longitude: location.lon,
              radius: radiusKm,
              startDate,
              endDate,
            },
          }
        );

        if (importError) {
          console.error(`Error importing events for location ${location.id}:`, importError);
          results.push({
            location_id: location.id,
            location_name: location.name,
            success: false,
            error: importError.message,
          });
        } else {
          const imported = importResult?.imported || 0;
          totalImported += imported;
          console.log(`Successfully imported ${imported} events for location ${location.id}`);
          results.push({
            location_id: location.id,
            location_name: location.name,
            success: true,
            imported,
          });
        }

        // Add a small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Exception processing location ${location.id}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.push({
          location_id: location.id,
          location_name: location.name,
          success: false,
          error: errorMessage,
        });
      }
    }

    console.log(`Auto-import completed. Total events imported: ${totalImported}`);

    return new Response(
      JSON.stringify({
        message: 'Auto-import completed',
        total_imported: totalImported,
        locations_processed: locations.length,
        results,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Auto-import error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
