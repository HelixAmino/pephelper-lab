import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const WC_BASE = "https://floorabovebrands.com/wp-json/wc/v3";
const SKU_PREFIX = "PH399.";

const TARGET_SKUS = [
  "PH399.001",
  "PH399.003",
  "PH399.006",
  "PH399.010",
  "PH399.020.AO",
  "PH399.030",
  "PH399.030.3",
  "PH399.030.AO",
  "PH399.101",
  "PH399.102",
  "PH399.103",
];

interface RunRequest {
  key: string;
  secret: string;
  brand_name?: string;
  dry_run?: boolean;
}

interface SkuResult {
  sku: string;
  product_id: number | null;
  status: "ok" | "skipped_not_found" | "skipped_prefix_guard" | "error";
  detail?: string;
}

function authHeader(key: string, secret: string): string {
  return "Basic " + btoa(`${key}:${secret}`);
}

async function wcGet(path: string, auth: string): Promise<Response> {
  return fetch(`${WC_BASE}${path}`, {
    method: "GET",
    headers: { Authorization: auth, Accept: "application/json" },
  });
}

async function wcSend(
  method: "POST" | "PUT",
  path: string,
  auth: string,
  body: unknown,
): Promise<Response> {
  return fetch(`${WC_BASE}${path}`, {
    method,
    headers: {
      Authorization: auth,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
}

async function resolveBrandTermId(
  auth: string,
  name: string,
): Promise<{ id: number; created: boolean } | { error: string }> {
  const searchRes = await wcGet(
    `/products/brands?search=${encodeURIComponent(name)}&per_page=100`,
    auth,
  );
  if (!searchRes.ok) {
    return { error: `brand search failed ${searchRes.status}: ${await searchRes.text()}` };
  }
  const terms = (await searchRes.json()) as Array<{ id: number; name: string; slug: string }>;
  const exact = terms.find((t) => t.name.toLowerCase() === name.toLowerCase());
  if (exact) return { id: exact.id, created: false };

  const createRes = await wcSend("POST", "/products/brands", auth, { name });
  if (!createRes.ok) {
    return { error: `brand create failed ${createRes.status}: ${await createRes.text()}` };
  }
  const created = (await createRes.json()) as { id: number };
  return { id: created.id, created: true };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: RunRequest;
  try {
    body = (await req.json()) as RunRequest;
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!body.key || !body.secret) {
    return new Response(JSON.stringify({ error: "missing_credentials" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const brandName = (body.brand_name ?? "PepHelper").trim();
  const dryRun = body.dry_run === true;
  const auth = authHeader(body.key, body.secret);

  const brand = await resolveBrandTermId(auth, brandName);
  if ("error" in brand) {
    return new Response(JSON.stringify({ error: "brand_resolve_failed", detail: brand.error }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const results: SkuResult[] = [];

  for (const sku of TARGET_SKUS) {
    if (!sku.startsWith(SKU_PREFIX)) {
      results.push({ sku, product_id: null, status: "skipped_prefix_guard" });
      continue;
    }

    const lookupRes = await wcGet(`/products?sku=${encodeURIComponent(sku)}`, auth);
    if (!lookupRes.ok) {
      results.push({
        sku,
        product_id: null,
        status: "error",
        detail: `lookup ${lookupRes.status}: ${await lookupRes.text()}`,
      });
      continue;
    }
    const matches = (await lookupRes.json()) as Array<{ id: number; sku: string }>;
    if (!matches.length) {
      results.push({ sku, product_id: null, status: "skipped_not_found" });
      continue;
    }
    const product = matches[0];

    if (!product.sku.startsWith(SKU_PREFIX)) {
      results.push({
        sku,
        product_id: product.id,
        status: "skipped_prefix_guard",
        detail: `returned sku ${product.sku} does not match ${SKU_PREFIX}*`,
      });
      continue;
    }

    if (dryRun) {
      results.push({ sku, product_id: product.id, status: "ok", detail: "dry_run" });
      continue;
    }

    const updateRes = await wcSend("PUT", `/products/${product.id}`, auth, {
      brands: [{ id: brand.id }],
    });
    if (!updateRes.ok) {
      results.push({
        sku,
        product_id: product.id,
        status: "error",
        detail: `update ${updateRes.status}: ${await updateRes.text()}`,
      });
      continue;
    }

    results.push({ sku, product_id: product.id, status: "ok" });
  }

  return new Response(
    JSON.stringify({
      brand: { id: brand.id, name: brandName, created: brand.created },
      dry_run: dryRun,
      results,
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});
