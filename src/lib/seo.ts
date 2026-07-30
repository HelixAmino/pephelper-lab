import { PRODUCT_IMAGES } from "@/lib/product-images";
import type { Product } from "@/lib/products";

const BASE_URL = "https://pephelper.com";
const OG_IMAGE = `${BASE_URL}/images/bigbundle.jpg`;

export function canonicalLink(path: string) {
  return { rel: "canonical", href: `${BASE_URL}${path}` };
}

export function ogMeta(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: string;
}) {
  const url = `${BASE_URL}${opts.path}`;
  const image = opts.image ?? OG_IMAGE;
  return [
    { property: "og:title", content: opts.title },
    { property: "og:description", content: opts.description },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:site_name", content: "PepHelper" },
    { property: "og:type", content: opts.type ?? "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: opts.title },
    { name: "twitter:description", content: opts.description },
    { name: "twitter:image", content: image },
  ];
}

export function organizationJsonLd(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PepHelper",
    legalName: "FAP Wellness LLC",
    url: BASE_URL,
    logo: `${BASE_URL}/favicon.jpeg`,
    description:
      "Lab-grade bacteriostatic water, syringes, and alcohol swabs for in-vitro research. 100% sterile, COA available.",
  });
}

export function websiteJsonLd(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PepHelper",
    url: BASE_URL,
  });
}

export function productJsonLd(product: Product): string {
  const imageUrl =
    PRODUCT_IMAGES[product.slug] ?? `${BASE_URL}/images/bigbundle.jpg`;

  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: imageUrl,
    url: `${BASE_URL}/product/${product.slug}`,
    brand: { "@type": "Brand", name: "PepHelper" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "500",
      bestRating: "5",
    },
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/product/${product.slug}`,
      priceCurrency: "USD",
      price: product.price.toFixed(2),
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "FAP Wellness LLC" },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "USD",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "US",
        },
      },
    },
  });
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.path}`,
    })),
  });
}

export function faqJsonLd(items: { q: string; a: string }[]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  });
}
