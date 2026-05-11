-- B3: Fix mutable search_path en funciones (schema poisoning protection)
ALTER FUNCTION public.protect_predictions_points() SET search_path = public, pg_temp;
ALTER FUNCTION public.set_updated_at() SET search_path = public, pg_temp;

-- B8: Trigger para garantizar inmutabilidad de campos críticos en trade_offers UPDATE
-- (Las policies RLS no pueden comparar NEW vs OLD, por eso se necesita un trigger)
CREATE OR REPLACE FUNCTION public.enforce_trade_offer_immutability()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.from_user_id <> OLD.from_user_id THEN
    RAISE EXCEPTION 'from_user_id cannot be modified';
  END IF;
  IF NEW.offered_sticker_id <> OLD.offered_sticker_id THEN
    RAISE EXCEPTION 'offered_sticker_id cannot be modified';
  END IF;
  IF NEW.requested_sticker_id <> OLD.requested_sticker_id THEN
    RAISE EXCEPTION 'requested_sticker_id cannot be modified';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_trade_offer_immutability_trigger ON public.trade_offers;
CREATE TRIGGER enforce_trade_offer_immutability_trigger
  BEFORE UPDATE ON public.trade_offers
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_trade_offer_immutability();
