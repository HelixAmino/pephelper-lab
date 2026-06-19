import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anonKey) {
  throw new Error(
    `Missing Supabase env vars at build time. ` +
      `VITE_SUPABASE_URL=${url ? "set" : "MISSING"}, ` +
      `VITE_SUPABASE_ANON_KEY=${anonKey ? "set" : "MISSING"}. ` +
      `Check the .env file on the build machine before running 'vite build'.`,
  );
}

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
