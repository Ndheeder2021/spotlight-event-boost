-- Add unique constraint on source_id to support upsert
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE t.relname = 'events' AND n.nspname = 'public' AND c.conname = 'events_source_id_unique_1'
  ) THEN
    ALTER TABLE public.events ADD CONSTRAINT events_source_id_unique_1 UNIQUE (source_id);
  END IF;
END$$;