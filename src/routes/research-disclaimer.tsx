import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/research-disclaimer")({
  head: () => ({
    meta: [
      { title: "Research Disclaimer — PepHelper" },
      {
        name: "description",
        content:
          "All PepHelper products are sold strictly for in vitro research use only.",
      },
    ],
  }),
  component: () => (
    <SiteLayout>
      <article className="mx-auto max-w-3xl px-4 py-12 prose prose-slate">
        <h1 className="text-3xl font-semibold text-navy md:text-4xl">
          Research Disclaimer
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: 2026</p>

        <div className="mt-8 space-y-6 text-foreground/85 leading-relaxed">
          <p>
            All products sold by FAP Wellness LLC through pephelper.com are
            intended <strong>exclusively for in vitro laboratory research use</strong>.
            They are not drugs, food, dietary supplements, cosmetics, or
            medical devices.
          </p>
          <p>
            Our products are <strong>not intended to diagnose, treat, cure, or
            prevent any disease</strong>, and are not suitable for in-vivo use,
            consumption, or administration.
          </p>
          <h2 className="text-xl font-semibold text-navy">Customer responsibilities</h2>
          <p>
            By purchasing from PepHelper, you confirm that you are a qualified
            researcher or laboratory professional and agree to use these
            products solely for legitimate scientific research, conducted in
            an appropriate laboratory setting and in compliance with all
            applicable laws, regulations, and safety standards.
          </p>
          <h2 className="text-xl font-semibold text-navy">No medical advice</h2>
          <p>
            Nothing on this website constitutes medical advice. Always consult
            a licensed healthcare professional for medical questions or
            conditions.
          </p>
          <h2 className="text-xl font-semibold text-navy">Contact</h2>
          <p>
            Questions? Reach us at{" "}
            <a className="text-teal hover:underline" href="mailto:info@pephelper.com">
              info@pephelper.com
            </a>
            .
          </p>
        </div>
      </article>
    </SiteLayout>
  ),
});
