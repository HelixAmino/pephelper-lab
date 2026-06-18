-- Email subscribers for the WELCOME10 popup. Service-role-only access:
-- the frontend never reads or writes this table directly — edge functions do.

CREATE TABLE IF NOT EXISTS email_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  verification_token text UNIQUE NOT NULL,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_subscribers_token
  ON email_subscribers(verification_token);

ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
-- Intentionally no policies: only the service role (used by edge functions)
-- can read/write this table. Anon and authenticated clients are denied.
