CREATE TABLE IF NOT EXISTS app_secrets (
  key text PRIMARY KEY,
  value text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE app_secrets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "deny_select_anon_authenticated" ON app_secrets
  FOR SELECT TO anon, authenticated USING (false);

CREATE POLICY "deny_insert_anon_authenticated" ON app_secrets
  FOR INSERT TO anon, authenticated WITH CHECK (false);

CREATE POLICY "deny_update_anon_authenticated" ON app_secrets
  FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);

CREATE POLICY "deny_delete_anon_authenticated" ON app_secrets
  FOR DELETE TO anon, authenticated USING (false);