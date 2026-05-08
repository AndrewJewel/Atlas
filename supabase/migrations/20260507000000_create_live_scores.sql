-- Migration: 20260507000000_create_live_scores
-- Purpose: Tabla de scores en tiempo real para partidos del Mundial 2026.
--          Actualizada por un Vercel Cron (service_role) cada 60s via ESPN API.
--          Los clientes se suscriben via Supabase Realtime (WebSocket).
-- Author: Database Admin Agent
-- Date: 2026-05-07

-- ============ UP ============
BEGIN;

-- ------------------------------------------------------------
-- Tabla principal
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS live_scores (
    -- PK en formato "homeCode-awayCode", ej: "ARG-BRA"
    -- Usar text en lugar de uuid porque el ID es legible y determinista
    id          text        PRIMARY KEY,

    home_code   text        NOT NULL,
    away_code   text        NOT NULL,

    home_score  int         NOT NULL DEFAULT 0,
    away_score  int         NOT NULL DEFAULT 0,

    -- Valores esperados: scheduled | live | finished
    -- Se usa text en lugar de ENUM para facilitar migraciones futuras
    -- sin necesidad de ALTER TYPE
    status      text        NOT NULL DEFAULT 'scheduled',

    -- Minuto de juego como text para soportar valores como "45+2", "HT", "FT"
    minute      text        NOT NULL DEFAULT '',

    -- Fecha en formato YYYY-MM-DD (no TIMESTAMPTZ porque viene de ESPN API como string)
    match_date  text,

    updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Validar que status solo contenga valores conocidos
-- Se hace con CHECK para no depender de un ENUM que requeriria ALTER TYPE para extender
DO $$ BEGIN
    ALTER TABLE live_scores
        ADD CONSTRAINT live_scores_status_check
        CHECK (status IN ('scheduled', 'live', 'finished'));
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
ALTER TABLE live_scores ENABLE ROW LEVEL SECURITY;

-- Lectura publica: cualquier rol anonimo o autenticado puede leer
DO $$ BEGIN
    CREATE POLICY live_scores_select_public
        ON live_scores
        FOR SELECT
        USING (true);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- INSERT bloqueado para roles no-service: el cron usa service_role key
-- que bypasea RLS por definicion; esta politica cierra la puerta a otros roles
DO $$ BEGIN
    CREATE POLICY live_scores_insert_deny
        ON live_scores
        FOR INSERT
        WITH CHECK (false);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- UPDATE bloqueado para roles no-service (mismo razonamiento que INSERT)
DO $$ BEGIN
    CREATE POLICY live_scores_update_deny
        ON live_scores
        FOR UPDATE
        USING (false);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- DELETE bloqueado para roles no-service
DO $$ BEGIN
    CREATE POLICY live_scores_delete_deny
        ON live_scores
        FOR DELETE
        USING (false);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- ------------------------------------------------------------
-- Realtime
-- Habilita que los clientes reciban cambios en tiempo real via WebSocket.
-- El cron actualiza filas y Supabase emite el evento a todos los suscriptores.
-- ------------------------------------------------------------
ALTER PUBLICATION supabase_realtime ADD TABLE live_scores;

COMMIT;


-- ============ DOWN ============
BEGIN;

-- Remover la tabla de Realtime antes de dropearla
ALTER PUBLICATION supabase_realtime DROP TABLE live_scores;

-- Eliminar politicas (se eliminan automaticamente con DROP TABLE,
-- pero se listan explicitamente para claridad del rollback)
DROP POLICY IF EXISTS live_scores_select_public  ON live_scores;
DROP POLICY IF EXISTS live_scores_insert_deny    ON live_scores;
DROP POLICY IF EXISTS live_scores_update_deny    ON live_scores;
DROP POLICY IF EXISTS live_scores_delete_deny    ON live_scores;

DROP TABLE IF EXISTS live_scores;

COMMIT;
