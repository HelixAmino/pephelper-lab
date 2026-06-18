import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — PepHelper" },
      { name: "description", content: "Terms of Service for pephelper.com." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <article className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-semibold text-navy md:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: 2026</p>

        <div className="mt-8 space-y-6 text-foreground/85 leading-relaxed">
          <p>
            Welcome to PepHelper, operated by <strong>FAP Wellness LLC</strong>{" "}
            ("we", "us"). By accessing or using pephelper.com, you agree to
            these Terms of Service.
          </p>

          <h2 className="text-xl font-semibold text-navy">1. Eligibility</h2>
          <p>
            You must be at least 18 years old and legally authorized to
            purchase laboratory research supplies in your jurisdiction.
          </p>

          <h2 className="text-xl font-semibold text-navy">2. Research use only</h2>
          <p>
            All products are sold strictly for in vitro laboratory research.
            You agree not to use them on humans or animals. See our{" "}
            <a className="text-teal hover:underline" href="/research-disclaimer">
              Research Disclaimer
            </a>
            .
          </p>

          <h2 className="text-xl font-semibold text-navy">3. Orders & payment</h2>
          <p>
            We reserve the right to refuse or cancel any order. Pricing and
            availability are subject to change without notice. Payment is
            processed through our payment provider; we do not store full card
            details on our servers.
          </p>

          <h2 className="text-xl font-semibold text-navy">4. Shipping</h2>
          <p>
            All orders ship free via USPS Ground Advantage or UPS Ground.
            Upgraded shipping available via USPS Priority Mail ($12 flat, 1–3 business
            days). Orders over $100 receive upgraded shipping free. Delivery
            times are estimates, not guarantees.
          </p>

          <h2 className="text-xl font-semibold text-navy">5. Returns</h2>
          <p>
            Due to the sterile nature of our products, all sales are final.
            If your order arrives damaged or incorrect, contact us within 7
            days at <a className="text-teal hover:underline" href="mailto:info@pephelper.com">info@pephelper.com</a>{" "}
            and we will make it right.
          </p>

          <h2 className="text-xl font-semibold text-navy">6. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, FAP Wellness LLC is not
            liable for any indirect, incidental, or consequential damages
            arising from the use or misuse of our products or this website.
          </p>

          <h2 className="text-xl font-semibold text-navy">7. Governing law</h2>
          <p>
            These terms are governed by the laws of the United States and the
            state in which FAP Wellness LLC is registered.
          </p>

          <h2 className="text-xl font-semibold text-navy">8. Contact</h2>
          <p>
            Questions about these terms? Email{" "}
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
