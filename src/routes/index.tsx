import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  FlaskConical,
  Truck,
  BadgeCheck,
  ArrowRight,
  Star,
} from "lucide-react";
import { FreeShippingBanner } from "@/components/FreeShippingBanner";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { Marquee } from "@/components/Marquee";
import { Testimonials } from "@/components/Testimonials";
import { FAQSection } from "@/components/FAQSection";
import { PrecisionSection } from "@/components/PrecisionSection";
import { PRODUCTS } from "@/lib/products";
import heroVials from "@/assets/hero-vials.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PepHelper — Sterile Lab Supplies for Research" },
      {
        name: "description",
        content:
          "Lab-grade bacteriostatic water, 30G x 5/16\" syringes, and alcohol swabs. Intended for in-vitro use. Fast, free standard shipping on every order.",
      },
      { property: "og:title", content: "PepHelper — Sterile Lab Supplies" },
      {
        property: "og:description",
        content:
          "Trusted research supplies. For laboratory and in vitro use only.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const featured = PRODUCTS.filter((p) => !p.addOnly).slice(0, 6);
  const bundles = PRODUCTS.filter((p) => p.category === "bundle");

  const MOBILE_PRIORITY_SKUS = [
    "PH399.003",
    "PH399.006",
    "PH399.030",
    "PH399.101",
    "PH399.102",
  ];
  const mobileProducts = (() => {
    const all = PRODUCTS.filter((p) => !p.addOnly);
    const bySku = new Map(all.map((p) => [p.sku, p]));
    const ordered = MOBILE_PRIORITY_SKUS
      .map((sku) => bySku.get(sku))
      .filter((p): p is (typeof all)[number] => Boolean(p));
    const remaining = all.filter((p) => !MOBILE_PRIORITY_SKUS.includes(p.sku));
    return [...ordered, ...remaining];
  })();

  return (
    <SiteLayout>
      {/* Mobile-only top banner */}
      <section className="md:hidden border-b border-teal/30 bg-gradient-to-r from-teal via-teal/95 to-navy">
        <div className="relative overflow-hidden px-4 py-5 text-center text-white">
          <span
            className="pointer-events-none absolute -left-8 -top-10 h-24 w-24 rounded-full bg-white/15 blur-2xl"
            aria-hidden="true"
          />
          <span
            className="pointer-events-none absolute -right-8 -bottom-12 h-28 w-28 rounded-full bg-white/10 blur-2xl"
            aria-hidden="true"
          />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ring-1 ring-white/25">
              <BadgeCheck className="h-3.5 w-3.5" /> Pephelper promise
            </span>
            <p className="mt-2 text-lg font-extrabold leading-snug tracking-tight">
              No nonsense pricing,
              <br />
              free shipping always.
            </p>
            <p className="mt-1 inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/85">
              <Truck className="h-3.5 w-3.5" /> Ships same-day from the USA
            </p>
          </div>
        </div>
      </section>

      {/* Mobile-only Core Supplies — every product, ordered */}
      <section className="md:hidden mx-auto max-w-7xl px-4 py-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal">
          Core supplies
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-navy">
          Shop everything we stock
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Every PepHelper product, ready to ship.
        </p>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {mobileProducts.map((p) => (
            <ProductCard key={p.sku} product={p} />
          ))}
        </div>
      </section>

      {/* Hero (desktop only) */}
      <section className="hidden md:block relative overflow-hidden border-b border-border bg-gradient-to-b from-secondary to-background">
        <div className="mx-auto max-w-7xl px-4 pt-8 md:pt-6">
          <FreeShippingBanner />
        </div>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 md:py-10">
          <div className="flex flex-col justify-center animate-fade-up">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-teal/30 bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">
              <ShieldCheck className="h-3.5 w-3.5" /> Lab-grade · cGMP-sourced
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-navy md:text-5xl lg:text-6xl">
              Premium Laboratory Grade Supplies,{" "}
              <span className="text-teal">ready to ship.</span>
            </h1>
            <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Sterile · Multi-Use · USP-Grade
            </p>
            <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
              Bacteriostatic water, 30G x 5/16" insulin syringes, and alcohol
              swabs —
              individually inspected, tamper-sealed, and shipped same-day from
              the United States. Intended for in-vitro use.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-md bg-navy px-5 py-3 text-sm font-semibold text-navy-foreground transition hover:-translate-y-0.5 hover:bg-navy/90 hover:shadow-md"
              >
                Order now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/research-disclaimer"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-3 text-sm font-semibold text-navy transition hover:border-teal"
              >
                Research use policy
              </Link>
            </div>
            <div className="mt-6 flex items-center gap-3 text-sm">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-teal text-teal" />
                ))}
              </div>
              <span className="font-semibold text-navy">4.8/5</span>
              <span className="text-muted-foreground">
                · 500+ PepHelper buyers
              </span>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-teal/20 via-transparent to-navy/10 blur-3xl" />
            <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
              <img
                src={heroVials}
                alt="Sterile lab-grade glass vials with aluminum caps"
                width={1600}
                height={1024}
                className="h-full w-full object-cover transition duration-700 hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <Marquee />

      {/* Trust strip */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-2 md:grid-cols-4">
          {[
            { icon: ShieldCheck, t: "Sterile & sealed", d: "Tamper-evident, individually inspected." },
            { icon: BadgeCheck, t: "Quality assured", d: "Sourced from cGMP-compliant manufacturers." },
            { icon: Truck, t: "Free US shipping", d: "Every item ships free. No minimums." },
            { icon: FlaskConical, t: "Research only", d: "In vitro use." },
          ].map((f) => (
            <div key={f.t} className="flex gap-3">
              <f.icon className="mt-1 h-5 w-5 shrink-0 text-teal" />
              <div>
                <h3 className="text-sm font-semibold text-navy">{f.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products (desktop only) */}
      <section className="hidden md:block mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-teal">
              Core supplies
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-navy md:text-4xl">
              The essentials, ready to ship.
            </h2>
          </div>
          <Link to="/shop" className="text-sm font-semibold text-teal hover:underline">
            View all →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.sku} product={p} />
          ))}
        </div>
      </section>

      {/* Precision feature section */}
      <PrecisionSection />

      {/* Bundles (desktop only) */}
      <section className="hidden md:block border-t border-border bg-secondary/60">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal">
            Best value
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-navy md:text-4xl">
            Save with research bundles
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Pre-configured kits for common research workflows. Free shipping,
            same-day dispatch.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {bundles.map((p) => (
              <ProductCard key={p.sku} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ */}
      <FAQSection />

      {/* Compliance banner */}
      <section className="border-t border-border bg-navy text-navy-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-semibold">For research use only.</h3>
            <p className="mt-1 max-w-2xl text-sm text-navy-foreground/80">
              All PepHelper products are sold strictly for in vitro research.
              They are not drugs, food, cosmetics, or medical devices, and are
              not intended to diagnose, treat, or prevent any disease.
            </p>
          </div>
          <Link
            to="/research-disclaimer"
            className="inline-flex items-center gap-2 rounded-md bg-teal px-5 py-3 text-sm font-semibold text-teal-foreground hover:bg-teal/90"
          >
            Read full disclaimer
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
