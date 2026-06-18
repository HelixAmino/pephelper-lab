/**
 * Local product catalog mirror.
 * ----------------------------------------------------------------------------
 * The canonical record lives in Supabase (`products` table). This file mirrors
 * that record for static use (router/SSR, cart math) and shares the same SKUs
 * and numeric IDs so the two stay aligned. Update both together.
 */

export interface Product {
  id: number;
  sku: string;
  slug: string;
  name: string;
  price: number;
  shortDescription: string;
  description: string;
  category: "supplies" | "bundle";
  imageAlt: string;
  addOnly?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: 39900,
    sku: "PH399.001",
    slug: "bac-water-1pack-10ml",
    name: "10ml Bacteriostatic Water",
    price: 8.5,
    shortDescription: "Single sterile 10ml multi-dose vial. Lab-grade.",
    description:
      "One 10ml sterile bacteriostatic water vial. Manufactured under cGMP conditions and intended strictly for in vitro research use only. Tamper-evident seal, individually inspected.",
    category: "supplies",
    imageAlt: "Single 10ml bacteriostatic water vial",
  },
  {
    id: 39901,
    sku: "PH399.003",
    slug: "bac-water-3pack-10ml",
    name: "3-Pack 10ml Bacteriostatic Water",
    price: 17.99,
    shortDescription: "Three sterile 10ml multi-dose vials. Lab-grade.",
    description:
      "Three 10ml sterile bacteriostatic water vials. Manufactured under cGMP conditions and intended strictly for in vitro research use only. Tamper-evident seal, individually inspected.",
    category: "supplies",
    imageAlt: "Three 10ml bacteriostatic water vials",
  },
  {
    id: 39902,
    sku: "PH399.006",
    slug: "bac-water-6pack-10ml",
    name: "6-Pack 10ml Bacteriostatic Water",
    price: 27.99,
    shortDescription: "Six sterile 10ml multi-dose vials. Lab-grade.",
    description:
      "Six 10ml sterile bacteriostatic water vials. Manufactured under cGMP conditions and intended strictly for in vitro research use only. Tamper-evident seal, individually inspected.",
    category: "supplies",
    imageAlt: "Six 10ml bacteriostatic water vials",
  },
  {
    id: 39903,
    sku: "PH399.010",
    slug: "bac-water-10pack-10ml",
    name: "10-Pack 10ml Bacteriostatic Water",
    price: 43.99,
    shortDescription: "Ten sterile 10ml multi-dose vials. Best value.",
    description:
      "Ten 10ml sterile bacteriostatic water vials. Manufactured under cGMP conditions and intended strictly for in vitro research use only. Tamper-evident seal, individually inspected.",
    category: "supplies",
    imageAlt: "Ten 10ml bacteriostatic water vials",
  },
  {
    id: 39905,
    sku: "PH399.030",
    slug: "insulin-syringes-30g-100ct",
    name: "100 x 1mL 100U 30ga x 5/16\" Insulin Syringes",
    price: 19.99,
    shortDescription: "100 sterile 1mL 100U 30ga x 5/16\" insulin syringes.",
    description:
      "Pack of 100 individually wrapped 1mL / 100 unit, 30 gauge x 5/16 inch (8mm) insulin syringes. Sterile, single-use, latex-free. For laboratory and research applications only.",
    category: "supplies",
    imageAlt: "Box of 100 1mL 100U 30-gauge 5/16-inch insulin syringes",
  },
  {
    id: 39906,
    sku: "PH399.030.3",
    slug: "insulin-syringes-3pack-30g",
    name: "3-Pack 100ct 1mL 30ga x 5/16\" Insulin Syringes",
    price: 47.99,
    shortDescription:
      "Three boxes of 100 sterile 1mL 100U 30ga x 5/16\" insulin syringes (300 total).",
    description:
      "Three boxes of 100 individually wrapped 1mL / 100 unit, 30 gauge x 5/16 inch (8mm) insulin syringes — 300 syringes total. Sterile, single-use, latex-free. For laboratory and research applications only.",
    category: "supplies",
    imageAlt:
      "Three boxes of 100 1mL 100U 30-gauge 5/16-inch insulin syringes",
  },
  {
    id: 39911,
    sku: "PH399.101",
    slug: "bundle-starter",
    name: "Starter Bundle",
    price: 34.99,
    shortDescription:
      "3 Vials 10ml BAC Water + 100 70% Alcohol Prep Pads + 100 1mL 30ga x 5/16\" Syringes.",
    description:
      "The perfect entry-level kit. Includes three Vials 10ml BAC Water, 100 sterile 70% alcohol prep pads, and 100 individually wrapped 1mL 100U 30ga x 5/16 inch (8mm) insulin syringes. Intended for in-vitro use only.",
    category: "bundle",
    imageAlt: "Starter bundle with bac water, prep pads, and syringes",
  },
  {
    id: 39912,
    sku: "PH399.102",
    slug: "bundle-value",
    name: "Value Bundle",
    price: 43.99,
    shortDescription:
      "6 Vials 10ml BAC Water + 100 70% Alcohol Prep Pads + 100 1mL 30ga x 5/16\" Syringes.",
    description:
      "Stock up and save. Includes six Vials 10ml BAC Water, 100 sterile 70% alcohol prep pads, and 100 individually wrapped 1mL 100U 30ga x 5/16 inch (8mm) insulin syringes. Intended for in-vitro use only.",
    category: "bundle",
    imageAlt: "Value bundle with bac water, prep pads, and syringes",
  },
  {
    id: 39913,
    sku: "PH399.103",
    slug: "bundle-ultimate",
    name: "Ultimate Bundle",
    price: 54.99,
    shortDescription:
      "10 Vials 10ml BAC Water + 100 70% Alcohol Prep Pads + 100 1mL 30ga x 5/16\" Syringes.",
    description:
      "Our best value for high-volume research workflows. Includes ten Vials 10ml BAC Water, 100 sterile 70% alcohol prep pads, and 100 individually wrapped 1mL 100U 30ga x 5/16 inch (8mm) insulin syringes. Intended for in-vitro use only.",
    category: "bundle",
    imageAlt: "Ultimate bundle with bac water, prep pads, and syringes",
  },
  {
    id: 39998,
    sku: "PH399.030.AO",
    slug: "insulin-syringes-addon",
    name: "100 x 1mL 30ga x 5/16\" Insulin Syringes (Add-on)",
    price: 18.99,
    shortDescription: "Sterile single-use 1mL 100U 30ga x 5/16\" syringes.",
    description:
      "Discounted add-on: 100 individually wrapped 1mL 100U 30 gauge x 5/16 inch (8mm) insulin syringes. Sterile, single-use, latex-free.",
    category: "supplies",
    imageAlt: "Box of 100 1mL 100U 30-gauge 5/16-inch insulin syringes",
    addOnly: true,
  },
  {
    id: 39999,
    sku: "PH399.020.AO",
    slug: "alcohol-prep-pads-addon",
    name: "100 70% Alcohol Prep Pads (Add-on)",
    price: 3.99,
    shortDescription: "70% isopropyl prep pads, sterile, 100 ct.",
    description:
      "Add-on: 100 sterile 70% isopropyl alcohol prep pads. Individually foil-wrapped to maintain sterility.",
    category: "supplies",
    imageAlt: "Pack of 100 70% alcohol prep pads",
    addOnly: true,
  },
];

export const PREP_PAD_ADDON_SKU = "PH399.020.AO";

export const PREP_PAD_TRIGGER_SKUS = new Set<string>([
  "PH399.001",
  "PH399.003",
  "PH399.006",
  "PH399.010",
  "PH399.030",
  "PH399.030.3",
]);

export const SYRINGE_ADDON_SKU = "PH399.030.AO";

export const SYRINGE_TRIGGER_SKUS = new Set<string>([
  "PH399.001",
  "PH399.003",
  "PH399.006",
  "PH399.010",
]);

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

interface PackInfo {
  singleSku: string;
  units: number;
}

const PACK_LOOKUP: Record<string, PackInfo> = {
  "PH399.003": { singleSku: "PH399.001", units: 3 },
  "PH399.006": { singleSku: "PH399.001", units: 6 },
  "PH399.010": { singleSku: "PH399.001", units: 10 },
  "PH399.030.3": { singleSku: "PH399.030", units: 3 },
};

interface BundleComponent {
  sku: string;
  qty: number;
}

const BUNDLE_COMPONENTS: Record<string, BundleComponent[]> = {
  "PH399.101": [
    { sku: "PH399.001", qty: 3 },
    { sku: "PH399.030", qty: 1 },
    { sku: "PH399.020.AO", qty: 1 },
  ],
  "PH399.102": [
    { sku: "PH399.001", qty: 6 },
    { sku: "PH399.030", qty: 1 },
    { sku: "PH399.020.AO", qty: 1 },
  ],
  "PH399.103": [
    { sku: "PH399.001", qty: 10 },
    { sku: "PH399.030", qty: 1 },
    { sku: "PH399.020.AO", qty: 1 },
  ],
};

export interface BundleSavings {
  individualTotal: number;
  savePercent: number;
}

function computeIndividualTotal(product: Product): number | null {
  const pack = PACK_LOOKUP[product.sku];
  if (pack) {
    const single = PRODUCTS.find((p) => p.sku === pack.singleSku);
    if (!single || single.price <= 0) return null;
    return pack.units * single.price;
  }
  const components = BUNDLE_COMPONENTS[product.sku];
  if (components) {
    let total = 0;
    for (const { sku, qty } of components) {
      const part = PRODUCTS.find((p) => p.sku === sku);
      if (!part || part.price <= 0) return null;
      total += qty * part.price;
    }
    return total;
  }
  return null;
}

export function getBundleSavings(product: Product): BundleSavings | null {
  const individualTotal = computeIndividualTotal(product);
  if (individualTotal === null) return null;
  if (individualTotal <= product.price) return null;
  const savePercent = Math.round(
    ((individualTotal - product.price) / individualTotal) * 100,
  );
  return { individualTotal, savePercent };
}
