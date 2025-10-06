-- Add unique constraint on source_id to prevent duplicate events from external sources
CREATE UNIQUE INDEX IF NOT EXISTS events_source_id_unique 
ON public.events (source_id) 
WHERE source_id IS NOT NULL;