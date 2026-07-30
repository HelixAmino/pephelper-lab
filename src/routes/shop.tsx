import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS } from "@/lib/products";
import logoUrl from "@/assets/pephelper-logo.png";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Lab-Tested Sterile Supplies | PepHelper" },
      {
        name: "description",
        content:
          "Browse 100% sterile bacteriostatic water (COA available), 30G x 5/16\" syringes, alcohol swabs, and research bundles. Lab tested, purity guaranteed. Certificate of Analysis on file.",
      },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
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

        <section className="py-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.filter((p) => !p.addOnly).map((p) => (
              <ProductCard key={p.sku} product={p} />
            ))}
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
