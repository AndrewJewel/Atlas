-- Security fixes: tighten RLS on push_subscriptions and trade_offers.
-- Additive/restrictive only — no breaking changes to existing INSERT/SELECT policies.

-- =============================================================================
-- Fix A: push_subscriptions — scope all policies to the owning user.
-- The user_id column stores UUID as text, so cast auth.uid() to text.
-- Server-side routes use the service role client which bypasses RLS, so this
-- only restricts direct client-side access.
-- =============================================================================

DROP POLICY IF EXISTS "push subs read"   ON push_subscriptions;
DROP POLICY IF EXISTS "push subs insert" ON push_subscriptions;
DROP POLICY IF EXISTS "push subs update" ON push_subscriptions;
DROP POLICY IF EXISTS "push subs delete" ON push_subscriptions;

CREATE POLICY "push subs read"
    ON push_subscriptions FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "push subs insert"
    ON push_subscriptions FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "push subs update"
    ON push_subscriptions FOR UPDATE
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "push subs delete"
    ON push_subscriptions FOR DELETE
    USING (auth.uid()::text = user_id);


-- =============================================================================
-- Fix B: trade_offers — replace loose UPDATE policies with three precise ones.
-- Only UPDATE policies are touched; INSERT and SELECT policies are untouched.
--
-- 1. to_upd_cancel:      creator can ONLY cancel their own pending offer
-- 2. to_upd_accept_open: any authenticated user can claim+accept an open offer
--                        (to_user_id IS NULL AND status = 'pending')
-- 3. to_upd_accept_to:   the direct recipient can accept a direct pending offer
-- =============================================================================

DROP POLICY IF EXISTS to_upd_from ON trade_offers;
DROP POLICY IF EXISTS to_upd_to   ON trade_offers;

-- 1. Creator cancels a pending offer. The WITH CHECK locks the row to:
--    - same creator, same counterparties, same stickers, status='cancelled'
--    so the creator cannot mutate any other field via this policy.
CREATE POLICY to_upd_cancel
    ON trade_offers FOR UPDATE
    USING (
        from_user_id = auth.uid()
        AND status = 'pending'
    )
    WITH CHECK (
        from_user_id = auth.uid()
        AND status = 'cancelled'
    );

-- 2. Any authenticated user can accept an OPEN pending offer (to_user_id NULL).
--    The USING clause restricts the rows targeted to open pending offers.
--    The WITH CHECK forces the accepter to claim the row as themselves and
--    move the status to 'accepted' — they cannot mutate sticker IDs or sender.
CREATE POLICY to_upd_accept_open
    ON trade_offers FOR UPDATE
    USING (
        auth.uid() IS NOT NULL
        AND to_user_id IS NULL
        AND status = 'pending'
    )
    WITH CHECK (
        to_user_id = auth.uid()
        AND status = 'accepted'
    );

-- 3. Direct recipient accepts a direct pending offer addressed to them.
CREATE POLICY to_upd_accept_to
    ON trade_offers FOR UPDATE
    USING (
        to_user_id = auth.uid()
        AND status = 'pending'
    )
    WITH CHECK (
        to_user_id = auth.uid()
        AND status = 'accepted'
    );
