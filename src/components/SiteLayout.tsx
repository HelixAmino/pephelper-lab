import { Link } from "@tanstack/react-router";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart, useHydrated } from "@/lib/cart-store";
import { LiveCart } from "@/components/LiveCart";
import logoUrl from "@/assets/pephelper-logo.png";

function Logo() {
  return (
    <Link to="/" className="flex items-center" aria-label="PepHelper home">
      <img
        src={logoUrl}
        alt="PepHelper"
        className="h-12 w-auto md:h-14"
      />
    </Link>
  );
}

function CartButton() {
  const { itemCount } = useCart();
  const hydrated = useHydrated();
  return (
    <Link
      to="/cart"
      className="relative inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-navy hover:bg-secondary"
      aria-label="Cart"
    >
      <ShoppingCart className="h-4 w-4" />
      <span className="hidden sm:inline">Cart</span>
      {hydrated && itemCount > 0 && (
        <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-teal px-1.5 text-xs font-semibold text-teal-foreground">
          {itemCount}
        </span>
      )}
    </Link>
  );
}

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { to: "/shop", label: "Shop" },
    { to: "/research-disclaimer", label: "Research Use" },
  ] as const;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Trust bar */}
      <div className="border-b border-border bg-navy text-xs text-navy-foreground/90">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-2 text-center">
          <span className="font-medium">
            Same-day shipping on orders before 2PM ET
          </span>
          <span className="hidden text-navy-foreground/40 sm:inline">·</span>
          <span className="hidden font-medium text-teal sm:inline">
            Free shipping on every order
          </span>
          <span className="hidden text-navy-foreground/40 sm:inline">·</span>
          <span className="hidden font-medium sm:inline">
            For laboratory & in vitro use
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Logo />
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm font-medium text-foreground/80 hover:text-teal"
                activeProps={{ className: "text-teal" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <CartButton />
            <button
              onClick={() => setOpen((o) => !o)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border md:hidden"
              aria-label="Menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="border-t border-border bg-background md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col px-4 py-2">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="py-3 text-sm font-medium text-foreground"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <LiveCart />

      <footer className="mt-16 border-t border-border bg-navy text-navy-foreground">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="inline-flex items-center rounded-md bg-white px-3 py-2">
              <img src={logoUrl} alt="PepHelper" className="h-12 w-auto" />
            </div>
            <p className="mt-4 max-w-sm text-sm text-navy-foreground/75">
              Sterile lab supplies not intended for in-vivo use. All PepHelper
              products are sold for research use only.
            </p>
            <p className="mt-4 text-xs text-navy-foreground/60">
              FAP Wellness LLC · info@pephelper.com
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-navy-foreground">Shop</h4>
            <ul className="mt-3 space-y-2 text-sm text-navy-foreground/75">
              <li><Link to="/shop" className="hover:text-teal">All Products</Link></li>
              <li><Link to="/cart" className="hover:text-teal">Cart</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-navy-foreground">Policies</h4>
            <ul className="mt-3 space-y-2 text-sm text-navy-foreground/75">
              <li><Link to="/research-disclaimer" className="hover:text-teal">Research Disclaimer</Link></li>
              <li><Link to="/terms" className="hover:text-teal">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-teal">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-navy-foreground/10">
          <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-navy-foreground/60">
            © {new Date().getFullYear()} FAP Wellness LLC. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
