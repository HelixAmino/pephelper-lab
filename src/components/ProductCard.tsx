import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { ProductImage } from "./ProductImage";
import { getBundleSavings, type Product } from "@/lib/products";
import { PRODUCT_IMAGES } from "@/lib/product-images";
import { addItem } from "@/lib/cart-store";

export function ProductCard({ product }: { product: Product }) {
  const savings = getBundleSavings(product);
  const [added, setAdded] = useState(false);

  function handleQuickAdd(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product.sku, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <Link
      to="/product/$slug"
      params={{ slug: product.slug }}
      className="group flex flex-col rounded-xl border border-border bg-card p-4 transition duration-300 hover:-translate-y-1 hover:border-teal hover:shadow-lg"
    >
      <div className="relative">
        <ProductImage
          alt={product.imageAlt}
          src={PRODUCT_IMAGES[product.slug]}
        />
        <button
          type="button"
          onClick={handleQuickAdd}
          aria-label={
            added ? `${product.name} added to cart` : `Quick add ${product.name} to cart`
          }
          className={`absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold uppercase tracking-wide shadow-md ring-1 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 ${
            added
              ? "bg-emerald-600 text-white ring-emerald-700/40"
              : "bg-emerald-500 text-white ring-emerald-600/40 hover:bg-emerald-600 hover:ring-emerald-700/50"
          }`}
        >
          {added ? (
            <>
              <Check className="h-3.5 w-3.5" /> Added
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" /> Quick add
            </>
          )}
        </button>
      </div>
      <div className="mt-4 flex flex-1 flex-col">
        <h3 className="font-semibold text-navy group-hover:text-teal">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {product.shortDescription}
        </p>
        <div className="mt-4 flex items-end justify-between gap-3">
          {savings ? (
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground line-through">
                ${savings.individualTotal.toFixed(2)}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-emerald-600">
                  ${product.price.toFixed(2)}
                </span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                  Save {savings.savePercent}%
                </span>
              </div>
            </div>
          ) : (
            <span className="text-lg font-semibold text-navy">
              ${product.price.toFixed(2)}
            </span>
          )}
          <span className="text-xs text-teal font-medium">View →</span>
        </div>
      </div>
    </Link>
  );
}
