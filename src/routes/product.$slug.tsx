import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Check, Minus, Plus, ArrowLeft } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductImage } from "@/components/ProductImage";
import { getProduct, getBundleSavings } from "@/lib/products";
import { PRODUCT_IMAGES } from "@/lib/product-images";
import { addItem } from "@/lib/cart-store";
import { toast } from "sonner";
import {
  canonicalLink,
  ogMeta,
  productJsonLd,
  breadcrumbJsonLd,
} from "@/lib/seo";
import logoUrl from "@/assets/pephelper-logo.png";

const SYRINGE_UNIT_COUNTS: Record<string, number> = {
  "PH399.030": 100,
  "PH399.030.3": 300,
  "PH399.030.AO": 100,
};

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => {
    const product = getProduct(params.slug);
    const path = `/product/${params.slug}`;
    if (!product) {
      return {
        meta: [
          { title: "Product — PepHelper" },
          {
            name: "description",
            content:
              "Research-grade lab supplies. Certificate of Analysis on file.",
          },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const imageUrl = PRODUCT_IMAGES[product.slug] || undefined;
    const title = `${product.name} — Sterile, Lab Tested | PepHelper`;
    const description = product.metaDescription;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        ...ogMeta({
          title,
          description,
          path,
          image: imageUrl,
          type: "product",
        }),
      ],
      links: [canonicalLink(path)],
      scripts: [
        { type: "application/ld+json", children: productJsonLd(product) },
        {
          type: "application/ld+json",
          children: breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
            { name: product.name, path },
          ]),
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
        <Link to="/shop" search={{}} className="mt-4 inline-block text-teal hover:underline">
          ← Back to shop
        </Link>
      </div>
    </SiteLayout>
  ),
});

function ImageGallery({ images }: { images: { src: string; alt: string }[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const current = images[selectedIndex];

  return (
    <div>
      {/* Main image */}
      <div className="aspect-square w-full overflow-hidden rounded-lg border border-border bg-white">
        <img
          src={current.src}
          alt={current.alt}
          className="h-full w-full object-contain"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 bg-white transition-colors ${
                i === selectedIndex
                  ? "border-teal ring-1 ring-teal/30"
                  : "border-border hover:border-teal/50"
              }`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="h-full w-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductDescription({ description }: { description: string }) {
  const isHtml = description.includes("<");

  if (isHtml) {
    return (
      <div
        className={[
          "mt-5",
          "[&_h4]:mt-6 [&_h4]:mb-2 [&_h4]:text-sm [&_h4]:font-semibold [&_h4]:uppercase [&_h4]:tracking-wide [&_h4]:text-navy",
          "[&_ul]:ml-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:text-sm [&_ul]:text-muted-foreground",
          "[&_p]:text-base [&_p]:text-muted-foreground",
          "[&_strong]:text-foreground/90 [&_strong]:font-medium",
          "[&_li]:text-muted-foreground",
        ].join(" ")}
        dangerouslySetInnerHTML={{ __html: description }}
      />
    );
  }

  return (
    <p className="mt-5 text-base text-muted-foreground">{description}</p>
  );
}

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
          <Link to="/shop" search={{}} className="mt-4 inline-block text-teal hover:underline">
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
  const syringeUnits = SYRINGE_UNIT_COUNTS[product.sku];
  const pricePerSyringe = syringeUnits ? product.price / syringeUnits : null;

  const hasGalleryImages = product.images && product.images.length > 0;

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <img src={logoUrl} alt="PepHelper" className="h-14 w-auto md:h-16" />
        <Link to="/shop" search={{}} className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-teal">
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>

        <div className="mt-6 grid gap-10 md:grid-cols-2">
          <div>
            {hasGalleryImages ? (
              <ImageGallery images={product.images!} />
            ) : (
              <ProductImage alt={product.imageAlt} src={PRODUCT_IMAGES[product.slug]} />
            )}
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
            {pricePerSyringe !== null ? (
              <div className="mt-1.5 text-xs text-muted-foreground">
                ${pricePerSyringe.toFixed(3)} per syringe · {syringeUnits} ct
              </div>
            ) : null}

            <ProductDescription description={product.description} />

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
