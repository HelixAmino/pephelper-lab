import { Star } from "lucide-react";

interface Review {
  name: string;
  title: string;
  body: string;
}

const REVIEWS: Review[] = [
  {
    name: "James R.",
    title: "Exactly what I needed",
    body: "I've sourced bac water for my lab work for a while now and PepHelper is hands down the most consistent supplier I've come across. Vials arrive sealed, packaging is secure, and the spec is exactly as labeled.",
  },
  {
    name: "Derek M.",
    title: "Best source I've found",
    body: "Premium feel — noticeably thicker glass and tight seals. Ordered Tuesday morning, shipped same day. No leakage, no cloudiness. This is now my go-to for reconstitution supplies.",
  },
  {
    name: "Sarah K.",
    title: "Great product, great value",
    body: "The bundle was recommended in a research forum and I'm glad I tried it. Solid vials, intact seals, transparent specs on the label. Free shipping put it over the top.",
  },
  {
    name: "Marcus T.",
    title: "Reliable every order",
    body: "Four orders in and the consistency is what keeps me coming back. Every vial sealed, no cloudiness, glass quality clearly higher grade. Free shipping every time is a nice touch.",
  },
  {
    name: "Rachel N.",
    title: "Finally a supplier I trust",
    body: "Specs clearly labeled, vials USP-grade, solution clean and clear with no particulates. Three orders, identical quality each time. That consistency matters more than anything.",
  },
  {
    name: "Anthony S.",
    title: "Bundles are the way to go",
    body: "Went with the bundle on my first order based on price per unit and it was the right call. Seals tight, glass clean, solution crystal clear. At this price point with free shipping there's no reason to go anywhere else.",
  },
];

function Stars() {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-teal text-teal" />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="flex items-center gap-2">
            <Stars />
            <span className="text-sm font-semibold text-navy">4.8/5</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Rated by 500+ PepHelper buyers
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-navy md:text-4xl">
            Trusted by <span className="text-teal">researchers</span> across
            North America
          </h2>
        </div>
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r) => (
            <li
              key={r.name}
              className="flex flex-col gap-3 rounded-xl border border-border bg-background p-5 transition hover:border-teal/40 hover:shadow-sm"
            >
              <Stars />
              <h3 className="font-semibold text-navy">{r.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {r.body}
              </p>
              <p className="mt-auto pt-2 text-xs font-semibold uppercase tracking-wider text-navy/70">
                — {r.name}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
