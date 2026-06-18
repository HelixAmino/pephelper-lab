import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CircleCheck as CheckCircle2, Copy, TriangleAlert as AlertTriangle, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

interface VerifyResponse {
  ok: boolean;
  email?: string;
  code?: string;
  percent_off?: number;
  error?: string;
}

export const Route = createFileRoute("/welcome")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === "string" ? search.token : "",
  }),
  head: () => ({
    meta: [
      { title: "Welcome — Your 10% off code | PepHelper" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WelcomePage,
});

type Status = "verifying" | "success" | "error";

function WelcomePage() {
  const { token } = Route.useSearch();
  const [status, setStatus] = useState<Status>("verifying");
  const [code, setCode] = useState<string>("WELCOME10");
  const [percentOff, setPercentOff] = useState<number>(10);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!token) {
        setStatus("error");
        setErrorMsg("Missing verification token. Please use the link from your email.");
        return;
      }
      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/verify-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            apikey: SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ token }),
        });
        const data = (await res.json()) as VerifyResponse;
        if (cancelled) return;
        if (!res.ok || !data.ok) {
          setStatus("error");
          setErrorMsg(
            data.error === "token_not_found"
              ? "This link is no longer valid. Try requesting a new one."
              : "We couldn't verify this link. Please try again.",
          );
          return;
        }
        setCode(data.code ?? "WELCOME10");
        setPercentOff(data.percent_off ?? 10);
        setStatus("success");
      } catch (e) {
        if (cancelled) return;
        console.error(e);
        setStatus("error");
        setErrorMsg("Network error. Please try again.");
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-4 py-16">
        {status === "verifying" && (
          <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-teal/30 border-t-teal" />
            <h1 className="mt-6 text-2xl font-semibold text-navy">
              Confirming your email…
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">Just a moment.</p>
          </div>
        )}

        {status === "success" && (
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="bg-gradient-to-r from-teal via-teal/90 to-navy px-8 py-10 text-center text-white">
              <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-white/80">
                Email confirmed
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                Welcome to PepHelper
              </h1>
              <p className="mt-3 text-sm text-white/90">
                Here's your member discount — {percentOff}% off your next order.
              </p>
            </div>
            <div className="px-8 py-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Your code
              </p>
              <div className="mt-3 flex items-center justify-center gap-3">
                <span className="rounded-lg border-2 border-dashed border-teal bg-teal/5 px-6 py-3 font-mono text-2xl font-bold tracking-[0.2em] text-navy">
                  {code}
                </span>
                <button
                  type="button"
                  onClick={copyCode}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-semibold text-navy transition hover:border-teal hover:text-teal"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Apply <span className="font-semibold text-navy">{code}</span> at
                checkout to take {percentOff}% off your order.
              </p>
              <Link
                to="/shop"
                className="mt-7 inline-flex items-center gap-2 rounded-md bg-navy px-6 py-3 text-sm font-semibold text-navy-foreground transition hover:-translate-y-0.5 hover:bg-navy/90 hover:shadow-md"
              >
                Start shopping <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
            <div className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h1 className="mt-5 text-2xl font-semibold text-navy">
              We couldn't confirm your email
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{errorMsg}</p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 text-sm font-semibold text-navy transition hover:border-teal"
            >
              Back to home
            </Link>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
