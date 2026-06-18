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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

function buildEmail(verifyUrl: string) {
  const safe = verifyUrl.replace(/"/g, "&quot;");
  return {
    subject: "Confirm your email — your 10% PepHelper code is waiting",
    html: `<!doctype html>
<html><body style="margin:0;background:#f4f6f8;font-family:Inter,Arial,sans-serif;color:#0b2a3b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
        <tr><td style="background:linear-gradient(90deg,#0d9488,#0b2a3b);padding:28px 32px;color:#fff;">
          <div style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;opacity:.9;">PepHelper Members</div>
          <div style="font-size:24px;font-weight:700;margin-top:6px;">Confirm your email to unlock 10% off</div>
        </td></tr>
        <tr><td style="padding:28px 32px 8px;font-size:15px;line-height:1.55;">
          <p style="margin:0 0 14px;">Thanks for signing up. Click the button below to confirm your email — your 10% off code will appear instantly on the next page.</p>
        </td></tr>
        <tr><td align="center" style="padding:14px 32px 32px;">
          <a href="${safe}" style="display:inline-block;background:#0d9488;color:#fff;text-decoration:none;font-weight:700;padding:14px 28px;border-radius:8px;font-size:15px;">Confirm email &amp; reveal code</a>
          <div style="font-size:12px;color:#64748b;margin-top:18px;">Or paste this link into your browser:<br><span style="word-break:break-all;">${safe}</span></div>
        </td></tr>
        <tr><td style="padding:18px 32px 28px;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b;">
          If you didn't request this, ignore this email.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`,
    text: `Confirm your email to unlock 10% off at PepHelper:\n\n${verifyUrl}\n\nIf you didn't request this, ignore this email.`,
  };
}

async function sendEmail(to: string, verifyUrl: string): Promise<{ sent: boolean; error?: string }> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("WELCOME_FROM_EMAIL") ?? "PepHelper <onboarding@resend.dev>";
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping email send. Verify URL:", verifyUrl);
    return { sent: false, error: "email_provider_not_configured" };
  }
  const { subject, html, text } = buildEmail(verifyUrl);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html, text }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error("Resend send failed", res.status, body);
    return { sent: false, error: `resend_${res.status}` };
  }
  return { sent: true };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json(405, { error: "method_not_allowed" });
  }

  let payload: { email?: unknown; site_url?: unknown };
  try {
    payload = await req.json();
  } catch {
    return json(400, { error: "invalid_json" });
  }

  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return json(400, { error: "invalid_email" });
  }

  const siteUrlRaw =
    (typeof payload.site_url === "string" ? payload.site_url : "") ||
    Deno.env.get("PUBLIC_SITE_URL") ||
    "";
  let origin: string;
  try {
    origin = new URL(siteUrlRaw).origin;
  } catch {
    const referer = req.headers.get("referer");
    if (referer) {
      try {
        origin = new URL(referer).origin;
      } catch {
        origin = "https://pephelper.com";
      }
    } else {
      origin = "https://pephelper.com";
    }
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");

  const { data: existing, error: selectErr } = await supabase
    .from("email_subscribers")
    .select("id, verified_at")
    .eq("email", email)
    .maybeSingle();
  if (selectErr) {
    console.error("select error", selectErr);
    return json(500, { error: "db_error" });
  }

  if (existing?.verified_at) {
    return json(200, { ok: true, already_verified: true });
  }

  if (existing) {
    const { error: updErr } = await supabase
      .from("email_subscribers")
      .update({ verification_token: token, updated_at: new Date().toISOString() })
      .eq("id", existing.id);
    if (updErr) {
      console.error("update error", updErr);
      return json(500, { error: "db_error" });
    }
  } else {
    const { error: insErr } = await supabase
      .from("email_subscribers")
      .insert({ email, verification_token: token });
    if (insErr) {
      console.error("insert error", insErr);
      return json(500, { error: "db_error" });
    }
  }

  const verifyUrl = `${origin}/welcome?token=${token}`;
  const send = await sendEmail(email, verifyUrl);

  return json(200, { ok: true, email_sent: send.sent, ...(send.error ? { warning: send.error } : {}) });
});
