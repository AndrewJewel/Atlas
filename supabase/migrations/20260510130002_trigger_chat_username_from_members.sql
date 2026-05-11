-- A2 Security Fix: enforce real username/avatar from group_members on chat insert
-- Prevents identity spoofing by overwriting username/avatar with values
-- from group_members (the authoritative source) on every INSERT.
--
-- Type notes verified before writing:
--   chat_messages.group_id  -> text   (cast to uuid for JOIN)
--   chat_messages.user_id   -> text
--   chat_messages.avatar    -> text
--   group_members.group_id  -> uuid
--   group_members.user_id   -> uuid   (auth.uid() returns uuid, no cast needed)
--   group_members.avatar    -> jsonb  (cast to text when assigning to NEW.avatar)

CREATE OR REPLACE FUNCTION public.enforce_chat_identity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_username text;
  v_avatar   jsonb;
BEGIN
  -- Obtener username y avatar reales del miembro en ese grupo
  -- group_members.group_id es uuid, chat_messages.group_id es text -> cast
  -- group_members.user_id es uuid, auth.uid() devuelve uuid -> sin cast
  SELECT gm.username, gm.avatar
  INTO v_username, v_avatar
  FROM public.group_members gm
  WHERE gm.group_id = NEW.group_id::uuid
    AND gm.user_id  = auth.uid();

  -- Si no es miembro del grupo, bloquear el insert
  IF v_username IS NULL THEN
    RAISE EXCEPTION 'User is not a member of this group';
  END IF;

  -- Sobreescribir con valores reales del perfil
  -- chat_messages.avatar es text, group_members.avatar es jsonb -> cast a text
  NEW.username := v_username;
  NEW.avatar   := v_avatar::text;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_chat_identity_trigger ON public.chat_messages;
CREATE TRIGGER enforce_chat_identity_trigger
  BEFORE INSERT ON public.chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_chat_identity();
