import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS, CATEGORY_META } from "@/lib/products";
import { canonicalLink, ogMeta, breadcrumbJsonLd } from "@/lib/seo";
import logoUrl from "@/assets/pephelper-logo.png";

type FilterKey = "all" | "supplies" | "pens" | "cold-storage" | "vial-storage";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "supplies", label: CATEGORY_META.supplies.label },
  { key: "pens", label: CATEGORY_META.pens.label },
  { key: "cold-storage", label: CATEGORY_META["cold-storage"].label },
  { key: "vial-storage", label: CATEGORY_META["vial-storage"].label },
];

const SUPPLIES_AND_PENS = new Set(["PH399.050", "PH399.060"]);

function matchesFilter(filter: FilterKey, category: string, sku: string): boolean {
  switch (filter) {
    case "all":
      return true;
    case "supplies":
      return category === "supplies" || category === "bundle" || SUPPLIES_AND_PENS.has(sku);
    case "pens":
      return category === "pens";
    case "cold-storage":
      return category === "cold-storage";
    case "vial-storage":
      return category === "vial-storage";
    default:
      return true;
  }
}

function filterDescription(filter: FilterKey): string | null {
  switch (filter) {
    case "supplies":
      return `${CATEGORY_META.supplies.description} ${CATEGORY_META.bundle.description}`;
    case "pens":
      return CATEGORY_META.pens.description;
    case "cold-storage":
      return CATEGORY_META["cold-storage"].description;
    case "vial-storage":
      return CATEGORY_META["vial-storage"].description;
    default:
      return null;
  }
}

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): { cat?: FilterKey } => {
    const raw = search.cat as string | undefined;
    const valid: FilterKey[] = ["all", "supplies", "pens", "cold-storage", "vial-storage"];
    return raw && valid.includes(raw as FilterKey) ? { cat: raw as FilterKey } : {};
  },
  head: () => ({
    meta: [
      { title: "Shop \u2014 Lab-Tested Sterile Supplies | PepHelper" },
      {
        name: "description",
        content:
          'Browse 100% sterile bacteriostatic water (COA available), 30G x 5/16" syringes, alcohol swabs, and research bundles. Lab tested, purity guaranteed. Certificate of Analysis on file.',
      },
      ...ogMeta({
        title: "Shop \u2014 Lab-Tested Sterile Supplies | PepHelper",
        description:
          "100% sterile bacteriostatic water with COA, syringes, and research bundles. Purity guaranteed.",
        path: "/shop",
      }),
    ],
    links: [canonicalLink("/shop")],
    scripts: [
      {
        type: "application/ld+json",
        children: breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
        ]),
      },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const { cat } = Route.useSearch();
  const navigate = useNavigate();
  const activeFilter: FilterKey = cat ?? "all";

  function setActiveFilter(key: FilterKey) {
    navigate({ to: "/shop", search: key === "all" ? {} : { cat: key }, replace: true });
  }

  const filtered = PRODUCTS.filter(
    (p) => !p.addOnly && matchesFilter(activeFilter, p.category, p.sku),
  );

  const FEATURED_ORDER: Record<string, number> = {
    "PH399.003": 0,
    "PH399.040": 1,
  };

  const sorted = activeFilter === "all"
    ? [...filtered].sort((a, b) => {
        const oa = FEATURED_ORDER[a.sku] ?? 99;
        const ob = FEATURED_ORDER[b.sku] ?? 99;
        return oa - ob;
      })
    : filtered;

  const description = filterDescription(activeFilter);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-12">
        <header className="border-b border-border pb-8">
          <img src={logoUrl} alt="PepHelper" className="h-14 w-auto md:h-16" />
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-navy md:text-4xl">
            Shop
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Sterile, research-grade supplies. All products are intended for
            in-vitro research use.
          </p>
        </header>

        <nav
          className="flex flex-wrap gap-2 pt-6"
          aria-label="Product category filters"
        >
          {FILTERS.map(({ key, label }) => {
            const isActive = key === activeFilter;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveFilter(key)}
                className={
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors " +
                  (isActive
                    ? "bg-teal text-white shadow-sm"
                    : "border border-border text-muted-foreground hover:border-teal hover:text-teal")
                }
                aria-pressed={isActive}
              >
                {label}
              </button>
            );
          })}
        </nav>

        {description && (
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        )}

        <section className="py-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((p) => (
              <ProductCard key={p.sku} product={p} />
            ))}
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
