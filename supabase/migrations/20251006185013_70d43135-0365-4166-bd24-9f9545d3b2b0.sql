-- Support upsert in import-eventbrite-events by matching ON CONFLICT target
-- Add a unique index on events.source_id (allows multiple NULLs, safe for manual events)
CREATE UNIQUE INDEX IF NOT EXISTS events_source_id_unique ON public.events (source_id);