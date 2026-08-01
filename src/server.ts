import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

const SITEMAP_PRODUCT_SLUGS = [
  "bac-water-1pack-10ml",
  "bac-water-3pack-10ml",
  "bac-water-6pack-10ml",
  "bac-water-10pack-10ml",
  "insulin-syringes-30g-100ct",
  "insulin-syringes-3pack-30g",
  "bundle-starter",
  "bundle-value",
  "bundle-ultimate",
];

function generateSitemap(): Response {
  const today = new Date().toISOString().slice(0, 10);

  const staticPages = [
    { path: "/", priority: "1.0", changefreq: "weekly" },
    { path: "/shop", priority: "0.9", changefreq: "weekly" },
    { path: "/research-disclaimer", priority: "0.3", changefreq: "yearly" },
    { path: "/terms", priority: "0.2", changefreq: "yearly" },
    { path: "/privacy", priority: "0.2", changefreq: "yearly" },
  ];

  const productPages = SITEMAP_PRODUCT_SLUGS.map((slug) => ({
    path: `/product/${slug}`,
    priority: "0.8",
    changefreq: "weekly",
  }));

  const all = [...staticPages, ...productPages];

  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...all.map(
      (entry) =>
        `  <url>` +
        `<loc>https://pephelper.com${entry.path}</loc>` +
        `<lastmod>${today}</lastmod>` +
        `<changefreq>${entry.changefreq}</changefreq>` +
        `<priority>${entry.priority}</priority>` +
        `</url>`,
    ),
    `</urlset>`,
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => ((m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry)),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(error?: unknown): Response {
  return new Response(renderErrorPage(error), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  const captured = consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`);
  console.error(captured);
  return brandedErrorResponse(captured);
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const url = new URL(request.url);
    if (url.pathname === "/sitemap.xml") {
      return generateSitemap();
    }

    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return brandedErrorResponse(error);
    }
  },
};
