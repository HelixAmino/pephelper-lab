-- email_subscribers is service-role-only (edge functions: subscribe, verify-email).
-- Service role bypasses RLS, so the table works as intended without any policies.
-- These explicit deny policies make the intent explicit and silence linter warnings
-- about "RLS enabled, no policies exist".

CREATE POLICY "deny_select_anon_authenticated" ON email_subscribers
  FOR SELECT TO anon, authenticated USING (false);

CREATE POLICY "deny_insert_anon_authenticated" ON email_subscribers
  FOR INSERT TO anon, authenticated WITH CHECK (false);

CREATE POLICY "deny_update_anon_authenticated" ON email_subscribers
  FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);

CREATE POLICY "deny_delete_anon_authenticated" ON email_subscribers
  FOR DELETE TO anon, authenticated USING (false);
