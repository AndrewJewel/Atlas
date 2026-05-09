-- Migration: 20260509000000_create_champion_2026
-- Purpose: Tabla que almacena el campeón del Mundial 2026.
--          La popula automáticamente la edge function fetch-scores
--          cuando detecta que el partido final (2026-07-19) terminó.

BEGIN;

CREATE TABLE IF NOT EXISTS champion_2026 (
  id          integer     PRIMARY KEY DEFAULT 1,
  winner_code text        NOT NULL,
  winner_name text        NOT NULL,
  runner_up_code text     NOT NULL,
  runner_up_name text     NOT NULL,
  score       text        NOT NULL,
  conf        text        NOT NULL CHECK (conf IN ('CONMEBOL', 'UEFA')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Solo puede haber una fila (la fila id=1 del campeón 2026)
ALTER TABLE champion_2026 ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY champion_2026_select_public
    ON champion_2026 FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY champion_2026_insert_deny
    ON champion_2026 FOR INSERT WITH CHECK (false);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY champion_2026_update_deny
    ON champion_2026 FOR UPDATE USING (false);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

COMMIT;
