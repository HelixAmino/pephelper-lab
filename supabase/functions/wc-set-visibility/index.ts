import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const WC_BASE = "https://floorabovebrands.com/wp-json/wc/v3";
const ALLOWED_SKU_PREFIX = "PH399.";
const ALLOWED_VISIBILITY = new Set(["visible", "catalog", "search", "hidden"]);

type PerSkuResult = {
  sku: string;
  ok: boolean;
  product_id?: number;
  before?: string;
  after?: string;
  error?: string;
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function basicAuth(key: string, secret: string) {
  return "Basic " + btoa(`${key}:${secret}`);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  let payload: { skus?: unknown; visibility?: unknown };
  try {
    payload = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const visibility = String(payload.visibility ?? "");
  if (!ALLOWED_VISIBILITY.has(visibility)) {
    return json(
      { error: "invalid_visibility", allowed: [...ALLOWED_VISIBILITY] },
      400,
    );
  }

  if (!Array.isArray(payload.skus) || payload.skus.length === 0) {
    return json({ error: "skus_required" }, 400);
  }
  const skus = payload.skus.map((s) => String(s));
  const rejected = skus.filter((s) => !s.startsWith(ALLOWED_SKU_PREFIX));
  if (rejected.length > 0) {
    return json(
      { error: "sku_outside_allowed_prefix", prefix: ALLOWED_SKU_PREFIX, rejected },
      403,
    );
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    return json({ error: "supabase_env_missing" }, 500);
  }
  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: secretRows, error: secretsErr } = await admin
    .from("app_secrets")
    .select("key,value")
    .in("key", ["WC_CONSUMER_KEY", "WC_CONSUMER_SECRET"]);
  if (secretsErr) return json({ error: "secret_read_failed", detail: secretsErr.message }, 500);
  const secretMap = new Map((secretRows ?? []).map((r) => [r.key, r.value]));
  const ck = secretMap.get("WC_CONSUMER_KEY");
  const cs = secretMap.get("WC_CONSUMER_SECRET");
  if (!ck || !cs) return json({ error: "wc_credentials_missing_in_app_secrets" }, 500);

  const authHeader = basicAuth(ck, cs);
  const results: PerSkuResult[] = [];

  for (const sku of skus) {
    try {
      const lookup = await fetch(`${WC_BASE}/products?sku=${encodeURIComponent(sku)}`, {
        headers: { Authorization: authHeader, Accept: "application/json" },
      });
      if (!lookup.ok) {
        results.push({ sku, ok: false, error: `lookup_failed_${lookup.status}` });
        continue;
      }
      const matches = (await lookup.json()) as Array<{
        id: number;
        sku: string;
        catalog_visibility: string;
      }>;
      const product = matches.find((p) => p.sku === sku);
      if (!product) {
        results.push({ sku, ok: false, error: "product_not_found_in_wc" });
        continue;
      }
      if (!product.sku.startsWith(ALLOWED_SKU_PREFIX)) {
        results.push({ sku, ok: false, product_id: product.id, error: "wc_returned_unexpected_sku" });
        continue;
      }
      const before = product.catalog_visibility;
      const upd = await fetch(`${WC_BASE}/products/${product.id}`, {
        method: "PUT",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ catalog_visibility: visibility }),
      });
      if (!upd.ok) {
        const text = await upd.text();
        results.push({
          sku,
          ok: false,
          product_id: product.id,
          before,
          error: `update_failed_${upd.status}_${text.slice(0, 160)}`,
        });
        continue;
      }
      const updated = (await upd.json()) as { catalog_visibility: string };
      results.push({
        sku,
        ok: true,
        product_id: product.id,
        before,
        after: updated.catalog_visibility,
      });
    } catch (e) {
      results.push({ sku, ok: false, error: String(e instanceof Error ? e.message : e) });
    }
  }

  const summary = {
    requested: skus.length,
    succeeded: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    visibility,
    results,
  };
  return json(summary, summary.failed === 0 ? 200 : 207);
});
