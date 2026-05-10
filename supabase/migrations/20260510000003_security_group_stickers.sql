-- Security hardening: groups + group_members RLS, and user_stickers quantity cap.
--
-- Fix A (Critical): groups and group_members had no RLS, allowing any
-- authenticated client to bypass the invite-code check enforced in
-- app/api/groups/route.ts by inserting directly into group_members.
-- All legitimate writes go through the API route using the service role
-- client (which bypasses RLS), so we only need SELECT for clients plus a
-- self-DELETE on group_members so members can leave a group.
--
-- Fix B (Critical): user_stickers.us_update lacked WITH CHECK, so a user
-- could UPDATE their own row to set quantity to any value. We re-create
-- the policy with WITH CHECK that pins ownership and caps quantity at
-- 0..200 (a realistic ceiling for a legitimate collector).

-- ---------------------------------------------------------------------------
-- Fix A: groups + group_members
-- ---------------------------------------------------------------------------

ALTER TABLE groups        ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- groups: authenticated users can read (needed for invite-code preview).
-- No INSERT/UPDATE/DELETE policies for regular users — the API route
-- using the service role client handles all writes and bypasses RLS.
DROP POLICY IF EXISTS grp_select ON groups;
CREATE POLICY grp_select
    ON groups
    FOR SELECT
    TO authenticated
    USING (true);

-- group_members: authenticated users can read all memberships
-- (chat participants, intercambios partners, predictor ranking).
DROP POLICY IF EXISTS gm_select ON group_members;
CREATE POLICY gm_select
    ON group_members
    FOR SELECT
    TO authenticated
    USING (true);

-- group_members: a user may delete only their own membership row
-- (i.e. leave a group). user_id is stored as text, so cast auth.uid().
DROP POLICY IF EXISTS gm_delete_self ON group_members;
CREATE POLICY gm_delete_self
    ON group_members
    FOR DELETE
    TO authenticated
    USING (user_id::uuid = auth.uid());

-- No INSERT or UPDATE policies for group_members — joins must go
-- through the API route, which validates the invite code and uses
-- the service role client.

-- ---------------------------------------------------------------------------
-- Fix B: user_stickers quantity cap on UPDATE
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS us_update ON user_stickers;
CREATE POLICY us_update
    ON user_stickers
    FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (
        user_id = auth.uid()
        AND quantity BETWEEN 0 AND 200
    );
