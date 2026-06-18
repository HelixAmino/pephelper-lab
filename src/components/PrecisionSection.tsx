import { Beaker, FileCheck as FileCheck2, Factory } from "lucide-react";

const FEATURES = [
  {
    icon: Beaker,
    title: "Batch tested for purity",
    body: "Every production batch is tested to verify sterility, benzyl alcohol concentration, and solution clarity before it ships.",
  },
  {
    icon: FileCheck2,
    title: "Full formula transparency",
    body: "No hidden additives. Just deionized water and 0.9% USP-grade benzyl alcohol — exactly what's on the label, nothing more.",
  },
  {
    icon: Factory,
    title: "cGMP-certified manufacturing",
    body: "Produced in a cGMP-compliant facility under controlled conditions, meeting the standards researchers expect from a professional supplier.",
  },
];

export function PrecisionSection() {
  return (
    <section className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal">
            Precision Matters
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-navy md:text-4xl">
            Precision-made. Lab-verified.{" "}
            <span className="text-teal">Research-ready.</span>
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Every vial is manufactured to strict quality standards — formulated
            for researchers who can't afford inconsistency.
          </p>
        </div>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {FEATURES.map((f) => (
            <li
              key={f.title}
              className="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:border-teal/40 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal/10 text-teal transition group-hover:bg-teal group-hover:text-teal-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-navy">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
