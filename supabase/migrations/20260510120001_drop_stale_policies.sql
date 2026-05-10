-- C1: Eliminar policies stale que permiten escritura directa desde el cliente
-- Policies legítimas (versionadas en migrations):
--   groups:        grp_select
--   group_members: gm_select, gm_delete_self

-- Stale policies en public.groups
DROP POLICY IF EXISTS groups_insert_owner ON public.groups;
DROP POLICY IF EXISTS groups_update_owner ON public.groups;
DROP POLICY IF EXISTS groups_delete_owner ON public.groups;
DROP POLICY IF EXISTS groups_select_all   ON public.groups;

-- Stale policies en public.group_members
DROP POLICY IF EXISTS group_members_insert_self   ON public.group_members;
DROP POLICY IF EXISTS group_members_delete_self   ON public.group_members;
DROP POLICY IF EXISTS group_members_select_auth   ON public.group_members;
