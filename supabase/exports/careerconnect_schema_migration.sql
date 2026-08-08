-- CareerConnect — schema migration for target project iluyvtucsgjrpbdyqlof
-- Source: current Lovable Cloud managed backend (inspected, unchanged)
-- Apply this in the target project's SQL editor BEFORE switching backends.
-- Idempotent: safe to re-run.

-- 1) Shared trigger function -------------------------------------------------
CREATE OR REPLACE FUNCTION public.tg_touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $function$;

-- 2) public.app_users -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name     text NOT NULL,
  email         text UNIQUE,
  mobile        text UNIQUE,
  password_hash text NOT NULL,
  verified      boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT app_users_check CHECK (email IS NOT NULL OR mobile IS NOT NULL)
);

CREATE UNIQUE INDEX IF NOT EXISTS app_users_email_lower_idx
  ON public.app_users (lower(email)) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS app_users_mobile_idx
  ON public.app_users (mobile) WHERE mobile IS NOT NULL;

DROP TRIGGER IF EXISTS app_users_touch_updated_at ON public.app_users;
CREATE TRIGGER app_users_touch_updated_at
  BEFORE UPDATE ON public.app_users
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

GRANT ALL ON public.app_users TO service_role;
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
-- No policies in source: table is server-only (service role). Intentional.

-- 3) public.otp_codes -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.otp_codes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier  text NOT NULL,
  purpose     text NOT NULL,
  code_hash   text NOT NULL,
  expires_at  timestamptz NOT NULL,
  used_at     timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT otp_codes_purpose_check CHECK (purpose = ANY (ARRAY['register'::text, 'forgot'::text]))
);

CREATE INDEX IF NOT EXISTS otp_codes_lookup_idx
  ON public.otp_codes (identifier, purpose, created_at DESC);

GRANT ALL ON public.otp_codes TO service_role;
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;
-- No policies in source: table is server-only (service role). Intentional.

-- 4) Data ------------------------------------------------------------------
-- Both tables are EMPTY in the source backend (0 rows each) — nothing to copy.
-- Auth users cannot be moved with SQL; see careerconnect_auth_users_export.csv
-- and MIGRATION_EXPORT.md for the recreate/invite procedure.
