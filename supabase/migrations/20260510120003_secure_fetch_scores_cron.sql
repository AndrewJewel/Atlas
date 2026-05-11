-- C5: Actualizar el cron job para enviar el secret header
-- El secret se pasa como variable de entorno en Supabase y el cron lo referencia
-- Nota: Supabase pg_cron con pg_net no soporta variables de entorno dinámicas,
-- por lo que el secret se referencia via current_setting desde app.fetch_scores_secret.

-- Primero, eliminar el cron job existente
SELECT cron.unschedule('fetch-live-scores');

-- Recrear con header x-fetch-secret que lee el valor desde la configuración de PostgreSQL
-- IMPORTANTE: Configurar el valor real ejecutando en Supabase SQL Editor:
--   ALTER DATABASE postgres SET app.fetch_scores_secret = 'TU_SECRET_AQUI';
-- Y también agregar FETCH_SCORES_SECRET en Supabase Dashboard > Edge Functions > fetch-scores > Secrets
SELECT cron.schedule(
  'fetch-live-scores',
  '* * * * *',
  $$
  SELECT net.http_post(
    url     := 'https://whdinkhidkngtliloiwr.supabase.co/functions/v1/fetch-scores',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-fetch-secret', current_setting('app.fetch_scores_secret', true)
    ),
    body    := '{}'::jsonb
  ) AS request_id;
  $$
);
