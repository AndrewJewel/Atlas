-- Security hardening: remaining RLS issues
-- 1) user_stickers INSERT: enforce quantity cap (UPDATE was already capped in a previous migration)
-- 2) chat_messages SELECT: restrict to authenticated role (was public via USING (true))

-- Fix A: Cap quantity on INSERT into user_stickers (0..200), matching the UPDATE policy bound.
DROP POLICY IF EXISTS us_insert ON user_stickers;
CREATE POLICY us_insert ON user_stickers FOR INSERT
  WITH CHECK (user_id = auth.uid() AND quantity BETWEEN 0 AND 200);

-- Fix B: Require authenticated role to read chat_messages (prevents anon-key data exfiltration).
DROP POLICY IF EXISTS chat_messages_select_public ON chat_messages;
CREATE POLICY chat_messages_select_auth ON chat_messages FOR SELECT
  TO authenticated USING (true);
