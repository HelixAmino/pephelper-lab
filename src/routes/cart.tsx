import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2, ArrowRight, Loader as Loader2 } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductImage } from "@/components/ProductImage";
import {
  useCart,
  updateQty,
  removeItem,
  addItem,
  useHydrated,
} from "@/lib/cart-store";
import { redirectToBackendCheckout } from "@/lib/checkout";
import { Checkbox } from "@/components/ui/checkbox";
import {
  PREP_PAD_ADDON_SKU,
  PREP_PAD_TRIGGER_SKUS,
  SYRINGE_ADDON_SKU,
  SYRINGE_TRIGGER_SKUS,
} from "@/lib/products";
import { toast } from "sonner";
import logoUrl from "@/assets/pephelper-logo.png";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your Cart — PepHelper" }] }),
  component: CartPage,
});

function CartPage() {
  const { lines, subtotal } = useCart();
  const hydrated = useHydrated();
  const [redirecting, setRedirecting] = useState(false);
  const [coupon, setCoupon] = useState("WELCOME10");

  const hasTriggerItem = lines.some((l) => PREP_PAD_TRIGGER_SKUS.has(l.sku));
  const addonInCart = lines.some((l) => l.sku === PREP_PAD_ADDON_SKU);
  const showAddonOffer = hasTriggerItem;

  const hasSyringeTrigger = lines.some((l) => SYRINGE_TRIGGER_SKUS.has(l.sku));
  const syringeAddonInCart = lines.some((l) => l.sku === SYRINGE_ADDON_SKU);
  const ownsSyringes = lines.some((l) => l.sku === "PH399.030");
  const showSyringeOffer = hasSyringeTrigger && !ownsSyringes;

  function toggleAddon(checked: boolean) {
    if (checked && !addonInCart) {
      addItem(PREP_PAD_ADDON_SKU, 1);
      toast.success("Alcohol prep pads added at $3.99");
    } else if (!checked && addonInCart) {
      removeItem(PREP_PAD_ADDON_SKU);
    }
  }

  function toggleSyringeAddon(checked: boolean) {
    if (checked && !syringeAddonInCart) {
      addItem(SYRINGE_ADDON_SKU, 1);
      toast.success("100ct insulin syringes added at $18.99");
    } else if (!checked && syringeAddonInCart) {
      removeItem(SYRINGE_ADDON_SKU);
    }
  }

  async function handleCheckout() {
    setRedirecting(true);
    try {
      await redirectToBackendCheckout(coupon.trim() || null);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't start checkout. Please try again.");
      setRedirecting(false);
    }
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <img src={logoUrl} alt="PepHelper" className="h-14 w-auto md:h-16" />
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-navy md:text-4xl">
          Your cart
        </h1>

        {!hydrated ? null : lines.length === 0 ? (
          <div className="mt-12 rounded-xl border border-border bg-card p-10 text-center">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Link
              to="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-navy px-5 py-3 text-sm font-semibold text-navy-foreground hover:bg-navy/90"
            >
              Browse products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <ul className="space-y-4 lg:col-span-2">
              {lines.map((l) => (
                <li
                  key={l.sku}
                  className="flex gap-4 rounded-xl border border-border bg-card p-4"
                >
                  <div className="w-24 shrink-0">
                    <ProductImage
                      alt={l.product.imageAlt}
                      src={l.image}
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-navy">
                          <Link to="/product/$slug" params={{ slug: l.product.slug }}>
                            {l.product.name}
                          </Link>
                        </h3>
                      </div>
                      <span className="font-semibold text-navy">
                        ${l.subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center rounded-md border border-border">
                        <button
                          onClick={() => updateQty(l.sku, l.quantity - 1)}
                          className="px-2 py-1.5 hover:bg-secondary"
                          aria-label="Decrease"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">
                          {l.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(l.sku, l.quantity + 1)}
                          className="px-2 py-1.5 hover:bg-secondary"
                          aria-label="Increase"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(l.sku)}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {showAddonOffer ? (
              <div className="lg:col-span-2 -mt-2 rounded-xl border border-teal/40 bg-teal/5 p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <Checkbox
                    checked={addonInCart}
                    onCheckedChange={(c) => toggleAddon(c === true)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-semibold text-navy">
                        Add 100ct 70% Alcohol Prep Pads
                      </span>
                      <span className="text-sm font-semibold text-teal">
                        $3.99
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Sterile, individually foil-wrapped. Available only as an
                      add-on with bac water or syringes.
                    </p>
                  </div>
                </label>
              </div>
            ) : null}

            {showSyringeOffer ? (
              <div className="lg:col-span-2 -mt-2 rounded-xl border border-teal/40 bg-teal/5 p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <Checkbox
                    checked={syringeAddonInCart}
                    onCheckedChange={(c) => toggleSyringeAddon(c === true)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-semibold text-navy">
                        Add 100ct 1mL 30ga x 5/16" Insulin Syringes
                      </span>
                      <span className="text-sm font-semibold text-teal">
                        $18.99{" "}
                        <span className="text-xs font-normal text-muted-foreground line-through">
                          $19.99
                        </span>
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Sterile, individually wrapped, latex-free. Discounted
                      add-on pricing when paired with bac water.
                    </p>
                  </div>
                </label>
              </div>
            ) : null}

            <aside className="h-fit rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold text-navy">Order summary</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-medium">${subtotal.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd className="font-semibold text-teal">Free</dd>
                </div>
              </dl>
              <p className="mt-4 rounded-md bg-teal/10 p-3 text-xs font-semibold text-teal">
                Free standard shipping on every order
              </p>
              <div className="mt-5">
                <label
                  htmlFor="coupon"
                  className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  Coupon code
                </label>
                <input
                  id="coupon"
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  autoComplete="off"
                  spellCheck={false}
                  className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-medium uppercase tracking-wide text-navy placeholder:text-muted-foreground placeholder:normal-case focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30"
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Applied automatically at checkout.
                </p>
              </div>
              <button
                onClick={handleCheckout}
                disabled={redirecting}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-navy px-5 py-3 text-sm font-semibold text-navy-foreground hover:bg-navy/90 disabled:opacity-60"
              >
                {redirecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Redirecting…
                  </>
                ) : (
                  <>
                    Proceed to Checkout <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </aside>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
