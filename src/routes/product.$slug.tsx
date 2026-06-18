import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Check, Minus, Plus, ArrowLeft } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductImage } from "@/components/ProductImage";
import { getProduct, getBundleSavings } from "@/lib/products";
import { PRODUCT_IMAGES } from "@/lib/product-images";
import { addItem } from "@/lib/cart-store";
import { toast } from "sonner";
import logoUrl from "@/assets/pephelper-logo.png";

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => {
    const product = getProduct(params.slug);
    return {
      meta: [
        { title: product ? `${product.name} — PepHelper` : "Product — PepHelper" },
        {
          name: "description",
          content: product?.shortDescription ?? "Research-grade lab supplies.",
        },
      ],
    };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <img src={logoUrl} alt="PepHelper" className="mx-auto h-16 w-auto md:h-20" />
        <h1 className="mt-6 text-2xl font-semibold text-navy">Product not found</h1>
        <Link to="/shop" className="mt-4 inline-block text-teal hover:underline">
          ← Back to shop
        </Link>
      </div>
    </SiteLayout>
  ),
});

function ProductPage() {
  const { slug } = Route.useParams();
  const product = getProduct(slug);
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <img src={logoUrl} alt="PepHelper" className="mx-auto h-16 w-auto md:h-20" />
          <h1 className="mt-6 text-2xl font-semibold text-navy">Product not found</h1>
          <Link to="/shop" className="mt-4 inline-block text-teal hover:underline">
            ← Back to shop
          </Link>
        </div>
      </SiteLayout>
    );
  }

  function handleAdd() {
    addItem(product!.sku, qty);
    toast.success(`Added ${qty} × ${product!.name} to cart`);
  }

  function handleBuyNow() {
    addItem(product!.sku, qty);
    navigate({ to: "/cart" });
  }

  const savings = getBundleSavings(product);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <img src={logoUrl} alt="PepHelper" className="h-14 w-auto md:h-16" />
        <Link to="/shop" className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-teal">
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>

        <div className="mt-6 grid gap-10 md:grid-cols-2">
          <div>
            <ProductImage alt={product.imageAlt} src={PRODUCT_IMAGES[product.slug]} />
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl font-semibold tracking-tight text-navy md:text-4xl">
              {product.name}
            </h1>
            {savings ? (
              <div className="mt-3 flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-semibold text-emerald-600">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  ${savings.individualTotal.toFixed(2)}
                </span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  Save {savings.savePercent}%
                </span>
              </div>
            ) : (
              <div className="mt-3 text-3xl font-semibold text-navy">
                ${product.price.toFixed(2)}
              </div>
            )}

            <p className="mt-5 text-base text-muted-foreground">
              {product.description}
            </p>

            <ul className="mt-6 space-y-2 text-sm">
              {[
                "Sterile & individually sealed",
                "Sourced from cGMP-compliant manufacturers",
                "Ships USPS from the United States",
                "Intended for in-vitro use",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                  <span className="text-foreground/80">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center">
              <div className="flex items-center rounded-md border border-border">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-navy hover:bg-secondary"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="px-3 py-2 text-navy hover:bg-secondary"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={handleAdd}
                className="flex-1 rounded-md border border-navy bg-card px-5 py-3 text-sm font-semibold text-navy hover:bg-secondary"
              >
                Add to cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 rounded-md bg-teal px-5 py-3 text-sm font-semibold text-teal-foreground hover:bg-teal/90"
              >
                Buy now
              </button>
            </div>

            <div className="mt-6 flex items-start gap-2 rounded-lg border border-teal/30 bg-teal/5 p-4 text-sm">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
              <p className="text-navy/80">
                <strong className="text-navy">Research use only.</strong> This
                product is sold for in vitro laboratory research. It is not
                intended for in-vivo use.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
