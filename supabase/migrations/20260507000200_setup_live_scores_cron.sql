-- Enable pg_net for HTTP calls from the database
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Enable pg_cron for scheduling
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Grant usage to postgres role
GRANT USAGE ON SCHEMA cron TO postgres;

-- Schedule live score fetch every minute via Supabase Edge Function
SELECT cron.schedule(
  'fetch-live-scores',
  '* * * * *',
  $$
  SELECT net.http_post(
    url     := 'https://whdinkhidkngtliloiwr.supabase.co/functions/v1/fetch-scores',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body    := '{}'::jsonb
  );
  $$
);
