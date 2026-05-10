-- Protect predictions.points_earned from client writes.
-- The scoring function (service role) updates this via SECURITY DEFINER RPC.

DO $outer$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'predictions') THEN

    CREATE OR REPLACE FUNCTION protect_predictions_points()
    RETURNS TRIGGER LANGUAGE plpgsql AS $func$
    BEGIN
      IF TG_OP = 'INSERT' THEN
        NEW.points_earned := NULL;
      ELSE
        NEW.points_earned := OLD.points_earned;
      END IF;
      RETURN NEW;
    END;
    $func$;

    DROP TRIGGER IF EXISTS predictions_protect_points ON predictions;
    CREATE TRIGGER predictions_protect_points
      BEFORE INSERT OR UPDATE ON predictions
      FOR EACH ROW
      EXECUTE FUNCTION protect_predictions_points();

  END IF;
END;
$outer$;
