-- A5: Quitar acceso anónimo a get_global_ranking
REVOKE EXECUTE ON FUNCTION public.get_global_ranking() FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_global_ranking() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_global_ranking() TO authenticated;

-- A5: Quitar acceso anónimo a get_group_ranking
REVOKE EXECUTE ON FUNCTION public.get_group_ranking(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_group_ranking(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_group_ranking(uuid) TO authenticated;

-- A6: Quitar acceso externo a handle_new_user (solo debe ejecutarse via trigger)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
-- El trigger sigue funcionando porque usa SECURITY DEFINER
