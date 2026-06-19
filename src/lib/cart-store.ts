/**
 * Local cart store (placeholder).
 * ----------------------------------------------------------------------------
 * This is a temporary client-side cart so the UI is fully functional before
 * CoCart is wired up. Swap `addItem`, `updateQty`, and `removeItem` to call
 * the corresponding functions in `src/lib/cocart.ts` once your store is live.
 */
import { useEffect, useState, useSyncExternalStore } from "react";
import { PRODUCTS, type Product } from "./products";
import { PRODUCT_IMAGES, useProductImageMap } from "./product-images";

export interface CartLine {
  sku: string;
  quantity: number;
}

const STORAGE_KEY = "pephelper_cart";
const listeners = new Set<() => void>();

function read(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function write(lines: CartLine[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  listeners.forEach((l) => l());
}

export function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getCart(): CartLine[] {
  return read();
}

export function addItem(sku: string, quantity = 1) {
  const lines = read();
  const existing = lines.find((l) => l.sku === sku);
  if (existing) existing.quantity += quantity;
  else lines.push({ sku, quantity });
  write(lines);
  // TODO: also call cocart.addToCart(productId, quantity)
}

export function updateQty(sku: string, quantity: number) {
  const lines = read()
    .map((l) => (l.sku === sku ? { ...l, quantity } : l))
    .filter((l) => l.quantity > 0);
  write(lines);
  // TODO: cocart.updateCartItem(...)
}

export function removeItem(sku: string) {
  write(read().filter((l) => l.sku !== sku));
  // TODO: cocart.removeCartItem(...)
}

export function clearCart() {
  write([]);
}

export interface EnrichedLine extends CartLine {
  product: Product;
  image: string;
  subtotal: number;
}

export function useCart() {
  const lines = useSyncExternalStore(
    subscribe,
    () => JSON.stringify(read()),
    () => "[]",
  );
  const parsed: CartLine[] = JSON.parse(lines);
  const imageMap = useProductImageMap();

  const enriched: EnrichedLine[] = parsed
    .map((l) => {
      const product = PRODUCTS.find((p) => p.sku === l.sku);
      if (!product) return null;
      return {
        ...l,
        product,
        image: imageMap[product.slug] ?? PRODUCT_IMAGES[product.slug] ?? "",
        subtotal: product.price * l.quantity,
      };
    })
    .filter((x): x is EnrichedLine => x !== null);

  const subtotal = enriched.reduce((s, l) => s + l.subtotal, 0);
  const itemCount = enriched.reduce((s, l) => s + l.quantity, 0);

  return { lines: enriched, subtotal, itemCount };
}

/** Returns shipping cost given subtotal and chosen method. Standard ground is always free. */
export function calcShipping(
  _subtotal: number,
  method: "ground" | "priority",
): number {
  return method === "priority" ? 11.99 : 0;
}

// Hydration helper for components that need to know when client cart is ready
export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}
