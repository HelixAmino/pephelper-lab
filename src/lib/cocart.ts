/**
 * CoCart API client
 * ----------------------------------------------------------------------------
 * This frontend is HEADLESS. All product, cart, and checkout data is meant to
 * come from a WooCommerce store via the CoCart REST API.
 *
 * TODO — Replace the placeholders below with your real values:
 *   1. COCART_API_BASE_URL — e.g. "https://pephelper.com/wp-json/cocart/v2"
 *   2. WOOCOMMERCE_CONSUMER_KEY / WOOCOMMERCE_CONSUMER_SECRET
 *      (only needed if you call the WooCommerce REST API directly for product
 *       management — most read flows can use CoCart's public endpoints)
 *   3. Any auth header CoCart Pro requires (JWT, basic auth, etc.)
 *
 * Recommended: store keys as Lovable Cloud secrets and proxy through a
 * server function so consumer secrets never ship to the browser.
 *
 * Reference: https://docs.cocart.xyz/
 */

// =====================================================================
// CONFIG — REPLACE THESE
// =====================================================================
export const COCART_API_BASE_URL =
  import.meta.env.VITE_COCART_API_BASE_URL ??
  "https://floorabovebrands.com/wp-json/cocart/v2";

// Publishable / consumer key (only safe in browser if read-only):
export const WOOCOMMERCE_CONSUMER_KEY =
  import.meta.env.VITE_WOOCOMMERCE_CONSUMER_KEY ?? "ck_REPLACE_ME";

// SECRET — do NOT ship to the browser. Use a server function.
// export const WOOCOMMERCE_CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

// CoCart cart key is persisted client-side so guest carts survive reloads.
const CART_KEY_STORAGE = "cocart_cart_key";

export function getCartKey(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CART_KEY_STORAGE);
}

export function setCartKey(key: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY_STORAGE, key);
}

async function cocartFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const cartKey = getCartKey();
  const url = new URL(`${COCART_API_BASE_URL}${path}`);
  if (cartKey) url.searchParams.set("cart_key", cartKey);

  const res = await fetch(url.toString(), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  // CoCart returns the cart key in a response header on creation
  const returnedKey = res.headers.get("CoCart-API-Cart-Key");
  if (returnedKey) setCartKey(returnedKey);

  if (!res.ok) {
    throw new Error(`CoCart ${res.status}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

// ---------- Products ----------
// CoCart Products endpoint: /products
export interface CoCartProduct {
  id: number;
  name: string;
  slug: string;
  sku: string;
  price: string;
  description: string;
  short_description: string;
  images: { src: string; alt: string }[];
}

export async function fetchProducts(): Promise<CoCartProduct[]> {
  // return cocartFetch<CoCartProduct[]>("/products");
  throw new Error("Wire up CoCart products endpoint");
}

export async function fetchProductBySlug(slug: string): Promise<CoCartProduct> {
  // return cocartFetch<CoCartProduct>(`/products/${slug}`);
  throw new Error("Wire up CoCart product endpoint");
}

// ---------- Cart ----------
export async function getCart() {
  return cocartFetch("/cart");
}

export async function addToCart(productId: number, quantity = 1) {
  return cocartFetch("/cart/add-item", {
    method: "POST",
    body: JSON.stringify({ id: String(productId), quantity: String(quantity) }),
  });
}

export async function updateCartItem(itemKey: string, quantity: number) {
  return cocartFetch(`/cart/item/${itemKey}`, {
    method: "POST",
    body: JSON.stringify({ quantity: String(quantity) }),
  });
}

export async function removeCartItem(itemKey: string) {
  return cocartFetch(`/cart/item/${itemKey}`, { method: "DELETE" });
}

// ---------- Checkout ----------
// CoCart Pro exposes /checkout. Pass billing/shipping/payment data here.
export async function submitCheckout(payload: unknown) {
  return cocartFetch("/checkout", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
