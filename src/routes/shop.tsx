import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS, CATEGORY_META } from "@/lib/products";
import { canonicalLink, ogMeta, breadcrumbJsonLd } from "@/lib/seo";
import logoUrl from "@/assets/pephelper-logo.png";

/* ------------------------------------------------------------------ */
/*  Filter definitions                                                */
/* ------------------------------------------------------------------ */

type FilterKey = "all" | "supplies" | "pens" | "cold-storage" | "vial-storage";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "supplies", label: CATEGORY_META.supplies.label },
  { key: "pens", label: CATEGORY_META.pens.label },
  { key: "cold-storage", label: CATEGORY_META["cold-storage"].label },
  { key: "vial-storage", label: CATEGORY_META["vial-storage"].label },
];

/** Which product categories each filter key includes */
function matchesFilter(
  filter: FilterKey,
  category: string,
): boolean {
  switch (filter) {
    case "all":
      return true;
    case "supplies":
      return category === "supplies" || category === "bundle";
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

/** Description shown beneath the heading when a specific filter is active */
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

/* ------------------------------------------------------------------ */
/*  Route                                                             */
/* ------------------------------------------------------------------ */

const VALID_FILTERS = new Set<string>(FILTERS.map((f) => f.key));

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): { category?: FilterKey } => {
    const raw = typeof search.category === "string" ? search.category : undefined;
    if (!raw || !VALID_FILTERS.has(raw)) return {};
    return { category: raw as FilterKey };
  },
  head: () => ({
    meta: [
      { title: "Shop — Lab-Tested Sterile Supplies | PepHelper" },
      {
        name: "description",
        content:
          "Browse 100% sterile bacteriostatic water (COA available), 30G x 5/16\" syringes, alcohol swabs, and research bundles. Lab tested, purity guaranteed. Certificate of Analysis on file.",
      },
      ...ogMeta({
        title: "Shop — Lab-Tested Sterile Supplies | PepHelper",
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

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

function ShopPage() {
  const { category } = Route.useSearch();
  const activeFilter: FilterKey = category ?? "all";
  const navigate = useNavigate();

  const setFilter = (key: FilterKey) => {
    navigate({
      to: "/shop",
      search: key === "all" ? {} : { category: key },
      replace: true,
    });
  };

  const filtered = PRODUCTS.filter(
    (p) => !p.addOnly && matchesFilter(activeFilter, p.category),
  );

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
            Sterile, research-grade supplies. All products are intended for in-vitro research use.
          </p>
        </header>

        {/* Category filter tabs */}
        <nav className="flex flex-wrap gap-2 pt-6" aria-label="Product category filters">
          {FILTERS.map(({ key, label }) => {
            const isActive = key === activeFilter;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors " +
                  (isActive
                    ? "bg-teal-600 text-white shadow-sm"
                    : "border border-border text-muted-foreground hover:border-teal-600 hover:text-teal-600")
                }
                aria-pressed={isActive}
              >
                {label}
              </button>
            );
          })}
        </nav>

        {/* Category description */}
        {description && (
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        )}

        <section className="py-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.sku} product={p} />
            ))}
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
