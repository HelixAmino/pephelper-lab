import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json(405, { error: "method_not_allowed" });
  }

  let payload: { token?: unknown };
  try {
    payload = await req.json();
  } catch {
    return json(400, { error: "invalid_json" });
  }

  const token = typeof payload.token === "string" ? payload.token.trim() : "";
  if (!token || token.length < 16 || token.length > 128) {
    return json(400, { error: "invalid_token" });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const { data: row, error: selErr } = await supabase
    .from("email_subscribers")
    .select("id, email, verified_at")
    .eq("verification_token", token)
    .maybeSingle();
  if (selErr) {
    console.error("select error", selErr);
    return json(500, { error: "db_error" });
  }
  if (!row) {
    return json(404, { error: "token_not_found" });
  }

  if (!row.verified_at) {
    const { error: updErr } = await supabase
      .from("email_subscribers")
      .update({ verified_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("id", row.id);
    if (updErr) {
      console.error("update error", updErr);
      return json(500, { error: "db_error" });
    }
  }

  return json(200, { ok: true, email: row.email, code: "WELCOME10", percent_off: 10 });
});
