-- C5: Actualizar cron job para enviar x-fetch-secret al invocar fetch-scores
SELECT cron.unschedule('fetch-live-scores');

SELECT cron.schedule(
  'fetch-live-scores',
  '* * * * *',
  $$
  SELECT net.http_post(
    url := 'https://whdinkhidkngtliloiwr.supabase.co/functions/v1/fetch-scores',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-fetch-secret', 'd4ac443e-a083-427a-bcb8-404f96fa1a54'
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $$
);
