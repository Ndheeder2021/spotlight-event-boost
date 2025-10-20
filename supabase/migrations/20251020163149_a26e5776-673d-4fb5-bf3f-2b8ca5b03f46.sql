-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a cron job to run auto-import-events once per day at 2 AM
SELECT cron.schedule(
  'auto-import-events-daily',
  '0 2 * * *', -- Run at 2 AM every day
  $$
  SELECT
    net.http_post(
        url:='https://jujgbkdamkjabjuerqxt.supabase.co/functions/v1/auto-import-events',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1amdia2RhbWtqYWJqdWVycXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0OTM2NjMsImV4cCI6MjA3NTA2OTY2M30._Q3hfbA01x-bDVSDGf-MLOsJvwY4rxo-PI7nZBsQ7zQ"}'::jsonb,
        body:=concat('{"time": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);