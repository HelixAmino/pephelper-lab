import { Check } from "lucide-react";

const ITEMS = [
  "USP-Grade Bacteriostatic Water",
  "Sterile-Filtered & Sealed",
  "Multi-Use Research Vials",
  "30G x 5/16\" Sterile Insulin Syringes",
  "70% Alcohol Prep Pads",
  "Free US Shipping",
  "Same-Day Dispatch",
];

export function Marquee() {
  const items = [...ITEMS, ...ITEMS];
  return (
    <div className="overflow-hidden border-y border-border bg-navy py-3 text-navy-foreground">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
        {items.map((label, i) => (
          <span
            key={`${label}-${i}`}
            className="flex items-center gap-2 text-sm font-medium tracking-wide"
          >
            <Check className="h-4 w-4 text-teal" />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
