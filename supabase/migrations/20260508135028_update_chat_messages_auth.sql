-- Migration: 20260508135028_update_chat_messages_auth
-- Purpose: Reforzar seguridad del chat.
--          La política INSERT anterior era completamente abierta (WITH CHECK true).
--          Ahora se requiere:
--            1. Sesión autenticada (authenticated role).
--            2. El user_id del mensaje debe coincidir con auth.uid()
--               — evita que un usuario envíe mensajes suplantando a otro.

BEGIN;

-- Reemplazar política permisiva por una que valida identidad
DROP POLICY IF EXISTS chat_messages_insert_public ON chat_messages;

CREATE POLICY chat_messages_insert_auth
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()::text
  );

COMMIT;


-- ============ DOWN ============
-- BEGIN;
-- DROP POLICY IF EXISTS chat_messages_insert_auth ON chat_messages;
-- CREATE POLICY chat_messages_insert_public
--   ON chat_messages FOR INSERT WITH CHECK (true);
-- COMMIT;
