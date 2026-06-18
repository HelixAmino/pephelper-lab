import { Link, useLocation } from "@tanstack/react-router";
import { ShoppingCart, Minus, Plus, X, ArrowRight, Timer, Truck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  useCart,
  updateQty,
  removeItem,
  addItem,
  useHydrated,
} from "@/lib/cart-store";
import {
  PREP_PAD_ADDON_SKU,
  PREP_PAD_TRIGGER_SKUS,
  SYRINGE_ADDON_SKU,
  SYRINGE_TRIGGER_SKUS,
} from "@/lib/products";
import { useProductImageMap } from "@/lib/use-product-images";

const RESERVE_SECONDS = 10 * 60;

function useReservationTimer(active: boolean) {
  const [seconds, setSeconds] = useState(RESERVE_SECONDS);

  useEffect(() => {
    if (!active) {
      setSeconds(RESERVE_SECONDS);
      return;
    }
    const id = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [active]);

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function LiveCart() {
  const { lines, subtotal, itemCount } = useCart();
  const hydrated = useHydrated();
  const imageMap = useProductImageMap();
  const { pathname } = useLocation();
  const active = hydrated && lines.length > 0;
  const timer = useReservationTimer(active);

  const prevCount = useRef(itemCount);
  const [pop, setPop] = useState(false);
  useEffect(() => {
    if (itemCount > prevCount.current) {
      setPop(true);
      const id = setTimeout(() => setPop(false), 600);
      prevCount.current = itemCount;
      return () => clearTimeout(id);
    }
    prevCount.current = itemCount;
  }, [itemCount]);

  if (!hydrated) return null;
  if (lines.length === 0) return null;
  if (pathname === "/cart") return null;

  const lineSkus = new Set(lines.map((l) => l.sku));
  const hasPrepPadTrigger = lines.some((l) => PREP_PAD_TRIGGER_SKUS.has(l.sku));
  const hasSyringeTrigger = lines.some((l) => SYRINGE_TRIGGER_SKUS.has(l.sku));
  const upgrades: Array<{
    key: string;
    sku: string;
    show: boolean;
    title: string;
    price: number;
    strike?: number;
  }> = [
    {
      key: "prep",
      sku: PREP_PAD_ADDON_SKU,
      show: hasPrepPadTrigger && !lineSkus.has(PREP_PAD_ADDON_SKU),
      title: "Add 100ct alcohol prep pads",
      price: 3.99,
    },
    {
      key: "syringes",
      sku: SYRINGE_ADDON_SKU,
      show:
        hasSyringeTrigger &&
        !lineSkus.has(SYRINGE_ADDON_SKU) &&
        !lineSkus.has("PH399.030"),
      title: "Add 100ct 1mL 30ga x 5/16\" syringes",
      price: 18.99,
      strike: 19.99,
    },
  ].filter((u) => u.show);

  return (
    <aside
      aria-label="Live cart"
      className="pointer-events-none fixed right-4 top-28 z-30 hidden w-80 animate-slide-in-right md:block"
    >
      <div
        className={`pointer-events-auto overflow-hidden rounded-xl border border-border bg-card shadow-xl ${
          pop ? "animate-cart-pop ring-2 ring-teal/60" : ""
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2 text-navy">
            <ShoppingCart className="h-4 w-4" />
            <span className="text-sm font-semibold">
              Your cart ({itemCount})
            </span>
          </div>
          <Link
            to="/cart"
            className="text-xs font-medium text-teal hover:underline"
          >
            View cart
          </Link>
        </div>

        <div className="flex items-center gap-2 border-b border-border bg-secondary/60 px-4 py-2 text-xs">
          <Timer className="h-3.5 w-3.5 text-teal" />
          <span className="text-muted-foreground">Items reserved for</span>
          <span className="ml-auto font-mono font-semibold text-navy tabular-nums">
            {timer}
          </span>
        </div>

        <ul className="max-h-72 divide-y divide-border overflow-y-auto">
          {lines.map((l) => (
            <li key={l.sku} className="flex gap-3 px-4 py-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-border bg-card">
                {imageMap[l.sku] ? (
                  <img
                    src={imageMap[l.sku]}
                    alt={l.product.imageAlt}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="flex flex-1 flex-col">
                <Link
                  to="/product/$slug"
                  params={{ slug: l.product.slug }}
                  className="line-clamp-2 text-sm font-medium text-navy hover:text-teal"
                >
                  {l.product.name}
                </Link>
                <div className="mt-1.5 flex items-center justify-between">
                  <div className="flex items-center rounded-md border border-border">
                    <button
                      onClick={() => updateQty(l.sku, l.quantity - 1)}
                      className="px-1.5 py-1 hover:bg-secondary"
                      aria-label="Decrease"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-7 text-center text-xs font-semibold">
                      {l.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(l.sku, l.quantity + 1)}
                      className="px-1.5 py-1 hover:bg-secondary"
                      aria-label="Increase"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="text-sm font-semibold text-navy">
                    ${l.subtotal.toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => removeItem(l.sku)}
                aria-label="Remove"
                className="self-start text-muted-foreground hover:text-destructive"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>

        {upgrades.length > 0 && (
          <div className="border-t border-border bg-teal/5 px-3 py-3">
            <div className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-wide text-teal">
              Pair with your order
            </div>
            <ul className="space-y-2">
              {upgrades.map((u) => (
                <li
                  key={u.key}
                  className="flex items-center gap-2 rounded-lg border border-teal/30 bg-card px-2.5 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-semibold text-navy">
                      {u.title}
                    </div>
                    <div className="mt-0.5 flex items-baseline gap-1.5 text-xs">
                      <span className="font-semibold text-teal">
                        ${u.price.toFixed(2)}
                      </span>
                      {u.strike !== undefined ? (
                        <span className="text-[11px] text-muted-foreground line-through">
                          ${u.strike.toFixed(2)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <button
                    onClick={() => addItem(u.sku, 1)}
                    className="inline-flex items-center gap-1 rounded-md bg-teal px-2.5 py-1.5 text-xs font-semibold text-teal-foreground transition hover:bg-teal/90"
                    aria-label={`Add ${u.title}`}
                  >
                    <Plus className="h-3 w-3" /> Add
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="border-t border-border px-4 py-3">
          <div className="flex items-center gap-1.5 rounded-md bg-teal/10 px-2.5 py-1.5 text-xs font-semibold text-teal">
            <Truck className="h-3.5 w-3.5" />
            Free standard shipping included
          </div>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold text-navy">
              ${subtotal.toFixed(2)}
            </span>
          </div>
          <Link
            to="/cart"
            className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-navy px-3 py-2 text-xs font-semibold text-navy-foreground transition hover:bg-navy/90"
          >
            Checkout <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
