import { getCart as getLocalCart } from "./cart-store";
import { getCartKey, setCartKey } from "./cocart";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const SYNC_ENDPOINT = `${SUPABASE_URL}/functions/v1/cocart-sync`;

export const BACKEND_CHECKOUT_URL = "https://floorabovebrands.com/checkout/";

interface SyncResponse {
  cart_key: string | null;
  checkout_url: string | null;
  errors: Array<{ sku: string; status: number; body: string }>;
  coupon_applied: boolean;
  coupon_error: { status: number; body: string } | null;
}

export async function syncLocalCartToCoCart(
  coupon?: string | null,
): Promise<SyncResponse> {
  const lines = getLocalCart();
  const res = await fetch(SYNC_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ lines, cart_key: getCartKey(), coupon: coupon ?? null }),
  });

  if (!res.ok) {
    throw new Error(`cart sync failed: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as SyncResponse;
  if (data.cart_key) setCartKey(data.cart_key);
  return data;
}

export async function redirectToBackendCheckout(coupon?: string | null) {
  const { cart_key, checkout_url, errors } = await syncLocalCartToCoCart(coupon);
  if (errors.length > 0) {
    console.warn("cocart sync errors", errors);
  }
  if (!cart_key) {
    throw new Error("CoCart did not return a cart key");
  }
  window.location.href =
    checkout_url ??
    `${BACKEND_CHECKOUT_URL}?cart_key=${encodeURIComponent(cart_key)}`;
}
