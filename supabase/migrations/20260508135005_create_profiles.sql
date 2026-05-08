-- Migration: 20260508135005_create_profiles
-- Purpose: User profiles linked to Supabase Auth.
--          Profile rows are created server-side via trigger (SECURITY DEFINER)
--          so the client never needs INSERT permission on this table.
--          Username/team are set by the client via UPDATE after onboarding.

BEGIN;

-- ============================================================
-- Tabla de perfiles
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username    TEXT        UNIQUE CHECK (
                            char_length(trim(username)) BETWEEN 3 AND 20
                          ),
  team_code   TEXT,
  team_name   TEXT,
  team_flag   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Todos los usuarios autenticados pueden leer perfiles (para mostrar usernames en chat)
CREATE POLICY profiles_select
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- Solo el propio usuario puede actualizar su perfil
CREATE POLICY profiles_update_own
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- NO hay política INSERT para usuarios normales.
-- El trigger handle_new_user (SECURITY DEFINER) crea la fila.

-- ============================================================
-- Trigger: crear perfil vacío al registrarse
-- SECURITY DEFINER + search_path fijo = no privilege escalation.
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Trigger: actualizar updated_at automáticamente
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMIT;


-- ============ DOWN ============
-- BEGIN;
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- DROP FUNCTION IF EXISTS public.handle_new_user();
-- DROP TRIGGER IF EXISTS profiles_set_updated_at ON profiles;
-- DROP FUNCTION IF EXISTS public.set_updated_at();
-- DROP TABLE IF EXISTS profiles;
-- COMMIT;
