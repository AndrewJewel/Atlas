-- C2: Fix chat_messages SELECT — solo miembros del grupo pueden leer
-- chat_messages.group_id es TEXT, group_members.group_id es UUID → cast UUID a text
DROP POLICY IF EXISTS chat_messages_select_auth ON public.chat_messages;
DROP POLICY IF EXISTS chat_messages_select_member ON public.chat_messages;

CREATE POLICY chat_messages_select_member ON public.chat_messages
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id::text = chat_messages.group_id
        AND gm.user_id = auth.uid()
    )
  );

-- C3: Fix chat_messages INSERT — solo miembros del grupo pueden escribir
-- chat_messages.user_id es TEXT, auth.uid() es UUID → cast uid a text para WITH CHECK
DROP POLICY IF EXISTS chat_messages_insert_auth ON public.chat_messages;
DROP POLICY IF EXISTS chat_messages_insert_member ON public.chat_messages;

CREATE POLICY chat_messages_insert_member ON public.chat_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()::text
    AND EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id::text = chat_messages.group_id
        AND gm.user_id = auth.uid()
    )
  );

-- C4: Fix get_group_ranking — validar membresía del caller
-- La función original retorna user_id uuid; se preserva esa firma para no romper clientes.
-- Se añade EXISTS que verifica que auth.uid() sea miembro del grupo antes de devolver datos.
DROP FUNCTION IF EXISTS public.get_group_ranking(uuid);

CREATE OR REPLACE FUNCTION public.get_group_ranking(p_group_id uuid)
RETURNS TABLE (
  user_id uuid,
  username text,
  team_flag text,
  total_points bigint,
  total_predictions bigint
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT
    p.user_id,
    pr.username,
    pr.team_flag,
    COALESCE(SUM(p.points_earned), 0)::bigint AS total_points,
    COUNT(p.id)::bigint                        AS total_predictions
  FROM public.predictions p
  JOIN public.profiles pr    ON pr.id = p.user_id
  JOIN public.group_members gm
       ON gm.user_id = p.user_id
      AND gm.group_id = p_group_id
  WHERE EXISTS (
    SELECT 1 FROM public.group_members caller
    WHERE caller.group_id = p_group_id
      AND caller.user_id = auth.uid()
  )
  GROUP BY p.user_id, pr.username, pr.team_flag
  ORDER BY total_points DESC, total_predictions DESC;
$$;
