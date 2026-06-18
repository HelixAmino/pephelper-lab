import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const COCART_BASE = "https://floorabovebrands.com/wp-json/cocart/v2";

interface IncomingLine {
  sku: string;
  quantity: number;
}

interface SyncRequest {
  lines: IncomingLine[];
  cart_key?: string | null;
}

async function cocart(
  path: string,
  init: RequestInit,
  cartKey: string | null,
): Promise<{ res: Response; cartKey: string | null }> {
  const url = new URL(`${COCART_BASE}${path}`);
  if (cartKey) url.searchParams.set("cart_key", cartKey);
  const res = await fetch(url.toString(), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init.headers ?? {}),
    },
  });
  const returnedKey = res.headers.get("CoCart-API-Cart-Key");
  return { res, cartKey: returnedKey ?? cartKey };
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

  let body: SyncRequest;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!Array.isArray(body.lines)) {
    return new Response(JSON.stringify({ error: "missing_lines" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let cartKey: string | null = body.cart_key ?? null;

  const cleared = await cocart("/cart/clear", { method: "POST" }, cartKey);
  cartKey = cleared.cartKey;

  const errors: Array<{ sku: string; status: number; body: string }> = [];

  for (const line of body.lines) {
    const out = await cocart(
      "/cart/add-item",
      {
        method: "POST",
        body: JSON.stringify({
          id: line.sku,
          quantity: String(line.quantity),
        }),
      },
      cartKey,
    );
    cartKey = out.cartKey;
    if (!out.res.ok) {
      errors.push({
        sku: line.sku,
        status: out.res.status,
        body: await out.res.text(),
      });
    }
  }

  return new Response(
    JSON.stringify({
      cart_key: cartKey,
      checkout_url: cartKey
        ? `https://floorabovebrands.com/checkout/?cart_key=${encodeURIComponent(cartKey)}`
        : null,
      errors,
    }),
    {
      status: errors.length === body.lines.length ? 502 : 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});
