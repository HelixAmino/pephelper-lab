import { useEffect, useState } from "react";
import { Truck, ShieldCheck, Sparkles, Loader as Loader2, MailCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const STORAGE_KEY = "pephelper_welcome_modal_v1";
const OPEN_DELAY_MS = 2500;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

type Status = "idle" | "submitting" | "sent" | "error";

export function EmailSignupModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(STORAGE_KEY) === "dismissed";
    } catch {
      // ignore
    }
    if (dismissed) return;
    const t = window.setTimeout(() => setOpen(true), OPEN_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      try {
        localStorage.setItem(STORAGE_KEY, "dismissed");
      } catch {
        // ignore
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!EMAIL_RE.test(value)) {
      setErrorMsg("Please enter a valid email address.");
      setStatus("error");
      return;
    }
    setErrorMsg("");
    setStatus("submitting");
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          apikey: SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          email: value,
          site_url: window.location.origin,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setErrorMsg(
          data.error === "invalid_email"
            ? "Please enter a valid email address."
            : "Something went wrong. Please try again.",
        );
        setStatus("error");
        return;
      }
      setStatus("sent");
      try {
        localStorage.setItem(STORAGE_KEY, "dismissed");
      } catch {
        // ignore
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-hidden border-border bg-card p-0 sm:max-w-md">
        <div className="bg-gradient-to-br from-teal via-teal/90 to-navy px-6 py-7 text-center text-white">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest ring-1 ring-white/25">
            <Sparkles className="h-3.5 w-3.5" /> Members save 10%
          </div>
          <DialogTitle className="mt-3 text-2xl font-semibold tracking-tight">
            Join PepHelper, save 10%
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm text-white/85">
            Drop your email and we'll send a one-click confirmation. Your code
            unlocks instantly on the next page.
          </DialogDescription>
        </div>

        <div className="px-6 py-6">
          {status === "sent" ? (
            <div className="text-center">
              <div className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-teal/10 text-teal">
                <MailCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-lg font-semibold text-navy">
                Check your inbox
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                We sent a confirmation link to{" "}
                <span className="font-semibold text-navy">{email}</span>. Click
                the button in that email to reveal your 10% off code.
              </p>
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="mt-5 inline-flex items-center justify-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-semibold text-navy transition hover:border-teal"
              >
                Got it
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <label htmlFor="welcome-email" className="sr-only">
                Email address
              </label>
              <input
                id="welcome-email"
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                placeholder="you@example.com"
                className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20"
                disabled={status === "submitting"}
              />
              {status === "error" && errorMsg && (
                <p className="text-xs font-semibold text-destructive">
                  {errorMsg}
                </p>
              )}
              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-navy px-5 py-3 text-sm font-semibold text-navy-foreground transition hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                  </>
                ) : (
                  <>Get my 10% off code</>
                )}
              </button>
              <div className="flex items-center justify-center gap-4 pt-2 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5 text-teal" /> Free US shipping
                </span>
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-teal" /> No spam
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="block w-full pt-1 text-center text-xs text-muted-foreground hover:text-navy"
              >
                No thanks
              </button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
