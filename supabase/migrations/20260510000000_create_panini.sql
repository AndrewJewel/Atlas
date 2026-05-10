-- Álbum Panini Mundial 2026

CREATE TABLE IF NOT EXISTS stickers (
    id         SERIAL   PRIMARY KEY,
    code       TEXT     NOT NULL UNIQUE,
    name       TEXT     NOT NULL,
    team_code  TEXT,
    team_name  TEXT,
    type       TEXT     NOT NULL CHECK (type IN ('player','badge','special')),
    position   TEXT     CHECK (position IS NULL OR position IN ('GK','DEF','MID','FWD')),
    is_shiny   BOOLEAN  NOT NULL DEFAULT FALSE,
    section    TEXT     NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_stk_team    ON stickers (team_code);
CREATE INDEX IF NOT EXISTS idx_stk_section ON stickers (section);

CREATE TABLE IF NOT EXISTS user_stickers (
    id         UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID     NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    sticker_id INTEGER  NOT NULL REFERENCES stickers(id) ON DELETE RESTRICT,
    quantity   INTEGER  NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_sticker UNIQUE (user_id, sticker_id)
);

CREATE INDEX IF NOT EXISTS idx_us_uid ON user_stickers (user_id);
CREATE INDEX IF NOT EXISTS idx_us_sid ON user_stickers (sticker_id);

CREATE TABLE IF NOT EXISTS trade_offers (
    id                   UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    from_user_id         UUID    NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    to_user_id           UUID    REFERENCES profiles(id) ON DELETE SET NULL,
    from_username        TEXT    NOT NULL,
    to_username          TEXT,
    offered_sticker_id   INTEGER NOT NULL REFERENCES stickers(id),
    requested_sticker_id INTEGER NOT NULL REFERENCES stickers(id),
    status               TEXT    NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected','cancelled')),
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_no_self  CHECK (from_user_id <> to_user_id),
    CONSTRAINT chk_diff_stk CHECK (offered_sticker_id <> requested_sticker_id)
);

CREATE INDEX IF NOT EXISTS idx_to_from   ON trade_offers (from_user_id);
CREATE INDEX IF NOT EXISTS idx_to_to     ON trade_offers (to_user_id);
CREATE INDEX IF NOT EXISTS idx_to_status ON trade_offers (status);

-- RLS
ALTER TABLE stickers       ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stickers  ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_offers   ENABLE ROW LEVEL SECURITY;

CREATE POLICY stk_read       ON stickers       FOR SELECT USING (true);

CREATE POLICY us_select      ON user_stickers  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY us_insert      ON user_stickers  FOR INSERT  WITH CHECK (user_id = auth.uid());
CREATE POLICY us_update      ON user_stickers  FOR UPDATE  USING (user_id = auth.uid());

CREATE POLICY to_select      ON trade_offers   FOR SELECT USING (
    from_user_id = auth.uid() OR to_user_id = auth.uid() OR to_user_id IS NULL
);
CREATE POLICY to_insert      ON trade_offers   FOR INSERT  WITH CHECK (from_user_id = auth.uid());
CREATE POLICY to_upd_from    ON trade_offers   FOR UPDATE  USING (from_user_id = auth.uid());
CREATE POLICY to_upd_to      ON trade_offers   FOR UPDATE  USING (to_user_id = auth.uid());
