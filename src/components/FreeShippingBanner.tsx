import { Truck, BadgeCheck } from "lucide-react";

export function FreeShippingBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-teal/40 bg-gradient-to-r from-teal via-teal/90 to-navy p-[1px] shadow-md">
      <div className="relative flex flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal/95 via-teal/85 to-navy/95 px-5 py-4 text-center sm:flex-row sm:gap-4 sm:py-3">
        <span className="absolute -left-6 -top-6 h-16 w-16 rounded-full bg-white/15 blur-2xl" aria-hidden="true" />
        <span className="absolute -right-6 -bottom-8 h-20 w-20 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
        <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white ring-1 ring-white/30">
          <BadgeCheck className="h-3.5 w-3.5" /> No-Nonsense Pricing
        </span>
        <p className="flex items-center gap-2 text-sm font-bold text-white sm:text-base">
          <Truck className="h-5 w-5 shrink-0" />
          <span className="text-lg font-extrabold tracking-tight sm:text-xl">FREE Shipping</span>
          <span className="font-semibold text-white/90">on every item</span>
        </p>
      </div>
    </div>
  );
}
