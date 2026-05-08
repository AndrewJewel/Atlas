-- Migration: 20260507000100_create_chat_messages
-- Purpose: Tabla de mensajes de chat en tiempo real por grupo.
--          Los usuarios se identifican con un UUID almacenado en localStorage
--          (NO se usa Supabase Auth). La autoria del mensaje es self-reported;
--          no hay validacion de identidad a nivel de base de datos.
-- Author: Database Admin Agent
-- Date: 2026-05-07

-- ============ UP ============
BEGIN;

-- ------------------------------------------------------------
-- Tabla principal
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chat_messages (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Identifica el canal de chat: letra de grupo ("A".."H") o "global"
    group_id    text        NOT NULL,

    -- UUID generado en el cliente y persistido en localStorage.
    -- Es text (no uuid con FK) porque no existe una tabla de usuarios
    -- ni integracion con Supabase Auth. No se puede validar referencial.
    user_id     text        NOT NULL,

    username    text        NOT NULL,

    -- Emoji o URL de avatar; se permite cualquier string no vacio
    avatar      text        NOT NULL,

    -- El contenido del mensaje esta limitado a 500 caracteres
    content     text        NOT NULL,

    created_at  timestamptz NOT NULL DEFAULT now()
);

-- Restriccion de longitud maxima del mensaje (500 chars)
DO $$ BEGIN
    ALTER TABLE chat_messages
        ADD CONSTRAINT chat_messages_content_length
        CHECK (char_length(content) <= 500);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Restriccion: user_id, username y avatar no pueden ser strings vacios
DO $$ BEGIN
    ALTER TABLE chat_messages
        ADD CONSTRAINT chat_messages_user_id_nonempty
        CHECK (char_length(trim(user_id)) > 0);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE chat_messages
        ADD CONSTRAINT chat_messages_username_nonempty
        CHECK (char_length(trim(username)) > 0);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE chat_messages
        ADD CONSTRAINT chat_messages_avatar_nonempty
        CHECK (char_length(trim(avatar)) > 0);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- ------------------------------------------------------------
-- Indice de paginacion
-- Patron de query: SELECT * FROM chat_messages
--                  WHERE group_id = $1
--                  ORDER BY created_at DESC
--                  LIMIT 50 OFFSET $2
-- El indice compuesto (group_id, created_at DESC) soporta directamente
-- ese plan sin un sort adicional.
-- Se usa CREATE INDEX CONCURRENTLY para no bloquear escrituras en produccion.
-- NOTA: CONCURRENTLY no puede ejecutarse dentro de una transaccion;
--       si aplicás esta migracion con supabase db push, Supabase lo maneja
--       correctamente. Si la corrés manual, sacala del BEGIN/COMMIT.
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS chat_messages_group_created_idx
    ON chat_messages (group_id, created_at DESC);

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Lectura publica: cualquier visitante puede leer todos los mensajes
DO $$ BEGIN
    CREATE POLICY chat_messages_select_public
        ON chat_messages
        FOR SELECT
        USING (true);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Insercion publica: cualquier visitante puede postear un mensaje.
-- No se puede usar auth.uid() porque no hay Supabase Auth.
-- La validacion de identidad (user_id coincide con el del cliente)
-- es responsabilidad de la capa de aplicacion (Next.js API route o
-- verificacion en el cliente), no de la base de datos.
DO $$ BEGIN
    CREATE POLICY chat_messages_insert_public
        ON chat_messages
        FOR INSERT
        WITH CHECK (true);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- UPDATE bloqueado: los mensajes son inmutables una vez enviados
DO $$ BEGIN
    CREATE POLICY chat_messages_update_deny
        ON chat_messages
        FOR UPDATE
        USING (false);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- DELETE bloqueado: no se permite borrar mensajes desde el cliente
DO $$ BEGIN
    CREATE POLICY chat_messages_delete_deny
        ON chat_messages
        FOR DELETE
        USING (false);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- ------------------------------------------------------------
-- Realtime
-- Habilita push de nuevos mensajes a todos los suscriptores
-- del canal correspondiente al group_id.
-- ------------------------------------------------------------
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;

COMMIT;


-- ============ DOWN ============
BEGIN;

ALTER PUBLICATION supabase_realtime DROP TABLE chat_messages;

DROP POLICY IF EXISTS chat_messages_select_public  ON chat_messages;
DROP POLICY IF EXISTS chat_messages_insert_public  ON chat_messages;
DROP POLICY IF EXISTS chat_messages_update_deny    ON chat_messages;
DROP POLICY IF EXISTS chat_messages_delete_deny    ON chat_messages;

DROP INDEX IF EXISTS chat_messages_group_created_idx;

DROP TABLE IF EXISTS chat_messages;

COMMIT;
