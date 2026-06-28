# Project guardrails — READ BEFORE TOUCHING THE BACKEND

## WooCommerce / floorabovebrands.com

The WordPress + WooCommerce backend at `https://floorabovebrands.com` hosts a
shared catalog used by multiple frontends. Most products there are NOT owned
by this project.

**Hard rules — no exceptions:**

1. The ONLY products this project is allowed to create, modify, or delete on
   the WooCommerce backend are those whose SKU starts with `PH399.`.
2. NEVER call any endpoint that mutates a non-`PH399.*` product. This includes
   `POST /wp-json/wc/v3/products`, `PUT /wp-json/wc/v3/products/{id}`,
   `DELETE /wp-json/wc/v3/products/{id}`, batch endpoints, or anything that
   could touch product records.
3. NEVER bulk-update, batch-modify, or run scripted edits against the WC REST
   API without first listing every targeted SKU and confirming with the user.
4. The cart-side endpoints (`/wp-json/cocart/v2/cart/*`) are safe — they only
   build a guest cart and never modify product records. The current
   `cocart-sync` edge function uses only those.
5. CoCart resolves products by SKU directly (`{"id":"PH399.003", ...}`) — there
   is no need to store WooCommerce product IDs in Supabase or in the frontend.

## Source-of-truth

- Product catalog lives in Supabase `products` table for this project's PH399
  SKUs. The frontend `src/lib/products.ts` mirrors it for SSR.
- Prices in the frontend are the source of truth when seeding Supabase.

## Product specs (do not drift)

- Insulin syringes (`PH399.030`, `PH399.030.AO`, and bundles `PH399.101–103`):
  **1 mL / 100 U, 30 gauge, 5/16 inch (8 mm) needle**, sterile, single-use,
  latex-free, individually wrapped, 100 per box. Any description must include
  the `30ga x 5/16"` (or `30 gauge x 5/16 inch (8mm)`) needle dimension.

## WC REST credentials — DO NOT ASK THE USER FOR THESE

The WooCommerce REST consumer key/secret are stored permanently in Supabase,
NOT in `.env` and NOT in edge-function secrets (no MCP tool can set those).
Before claiming you don't have them, run:

```sql
SELECT key, value FROM app_secrets
 WHERE key IN ('WC_CONSUMER_KEY', 'WC_CONSUMER_SECRET');
```

via `mcp__supabase__execute_sql`. The `app_secrets` table has deny-all RLS so
only edge functions (service role) can read it; the service-role MCP query
above bypasses RLS and will return both rows. If those rows are missing,
THEN ask the user — but check first.

Any edge function that needs them should read them with the service-role
client at the start of the handler, not from `Deno.env.get`.

## If asked to write to WooCommerce

Stop and confirm scope. Even with credentials available, restrict every call
by SKU prefix (`PH399.*`) and print the targeted SKU(s) before each write.
