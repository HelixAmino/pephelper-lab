import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — PepHelper" },
      {
        name: "description",
        content:
          "PepHelper does not sell or share customer data. Read our customer-first privacy policy.",
      },
    ],
  }),
  component: () => (
    <SiteLayout>
      <article className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-semibold text-navy md:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: 2026</p>

        <div className="mt-6 flex items-start gap-3 rounded-lg border border-teal/30 bg-teal/5 p-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
          <p className="text-sm text-navy">
            <strong>Our promise:</strong> We do not sell, rent, trade, or
            share your personal data with third parties for marketing or any
            other purpose. Your information stays with us, and only what we
            need to fulfill your order.
          </p>
        </div>

        <div className="mt-8 space-y-6 text-foreground/85 leading-relaxed">
          <h2 className="text-xl font-semibold text-navy">What we collect</h2>
          <p>To process and ship your order, we collect:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Your name and shipping address</li>
            <li>Your email address (for order confirmations and updates)</li>
            <li>Your phone number (only if needed for delivery)</li>
            <li>
              Payment information — processed directly by our payment
              processor; we never see or store your full card number
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-navy">How we use your data</h2>
          <p>
            Strictly to fulfill your order, send order-related communications,
            and meet our legal obligations (e.g., tax records). That is all.
          </p>

          <h2 className="text-xl font-semibold text-navy">What we don't do</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>We do not sell your data. Ever.</li>
            <li>We do not share your data with advertisers or data brokers.</li>
            <li>We do not send marketing email unless you explicitly opt in.</li>
            <li>We do not build profiles on you or track you across the web.</li>
          </ul>

          <h2 className="text-xl font-semibold text-navy">Service providers</h2>
          <p>
            We share the minimum data necessary with the following service
            providers to operate the store: our payment processor, our
            shipping carrier (USPS), and our order/store backend
            (WooCommerce). They are contractually limited to using your data
            only to perform their services for us.
          </p>

          <h2 className="text-xl font-semibold text-navy">Your rights</h2>
          <p>
            You may request a copy of the data we hold about you, ask us to
            correct it, or ask us to delete it (subject to legal record-
            keeping obligations). Email{" "}
            <a className="text-teal hover:underline" href="mailto:info@pephelper.com">
              info@pephelper.com
            </a>{" "}
            and we will respond within 30 days.
          </p>

          <h2 className="text-xl font-semibold text-navy">Cookies</h2>
          <p>
            We use only the essential cookies required for the site and your
            cart to function. No advertising or third-party tracking cookies.
          </p>

          <h2 className="text-xl font-semibold text-navy">Data retention</h2>
          <p>
            We keep order records only as long as required by tax and
            consumer-protection law, then we delete them.
          </p>

          <h2 className="text-xl font-semibold text-navy">Contact</h2>
          <p>
            <strong>FAP Wellness LLC</strong>
            <br />
            <a className="text-teal hover:underline" href="mailto:info@pephelper.com">
              info@pephelper.com
            </a>
          </p>
        </div>
      </article>
    </SiteLayout>
  ),
});
