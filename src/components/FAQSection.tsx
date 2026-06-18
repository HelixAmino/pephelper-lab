import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = [
  {
    q: "Who is PepHelper bacteriostatic water for?",
    a: "PepHelper is designed for researchers, scientists, and lab professionals who require a reliable, sterile reconstitution solution for in-vitro research applications.",
  },
  {
    q: "What is bacteriostatic water used for?",
    a: "Bacteriostatic water is a sterile solution used to reconstitute or dilute compounds in research and laboratory settings. The 0.9% benzyl alcohol preservative allows the vial to be accessed multiple times while inhibiting bacterial growth.",
  },
  {
    q: "How is PepHelper different from sterile water?",
    a: "Unlike single-use sterile water, PepHelper bac water contains 0.9% benzyl alcohol which acts as a preservative — allowing multi-use access to the same vial while maintaining sterility throughout.",
  },
  {
    q: "How should the vials be stored?",
    a: "Store at room temperature away from direct light. Once opened, vials should be used within the standard multi-dose window consistent with your research protocols.",
  },
  {
    q: "Is there a satisfaction guarantee?",
    a: "Yes — if you're not satisfied with your order for any reason, contact us and we'll make it right.",
  },
  {
    q: "How fast do you ship?",
    a: "Orders placed before 2PM ET ship the same business day. We ship via USPS from the United States, and shipping is free on every order.",
  },
];

export function FAQSection() {
  return (
    <section className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal">
            Frequently asked questions
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-navy md:text-4xl">
            Still curious? Let's clear it up.
          </h2>
        </div>
        <Accordion type="single" collapsible className="mt-10">
          {FAQ.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base font-semibold text-navy hover:text-teal">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
