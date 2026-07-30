import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { PRODUCTS } from "@/lib/products";

const BASE_URL = "https://pephelper.com";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().slice(0, 10);

        interface SitemapEntry {
          path: string;
          priority: string;
          changefreq: string;
        }

        const staticPages: SitemapEntry[] = [
          { path: "/", priority: "1.0", changefreq: "weekly" },
          { path: "/shop", priority: "0.9", changefreq: "weekly" },
          {
            path: "/research-disclaimer",
            priority: "0.3",
            changefreq: "yearly",
          },
          { path: "/terms", priority: "0.2", changefreq: "yearly" },
          { path: "/privacy", priority: "0.2", changefreq: "yearly" },
        ];

        const productPages: SitemapEntry[] = PRODUCTS.filter(
          (p) => !p.addOnly,
        ).map((p) => ({
          path: `/product/${p.slug}`,
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
              `<loc>${BASE_URL}${entry.path}</loc>` +
              `<lastmod>${today}</lastmod>` +
              `<changefreq>${entry.changefreq}</changefreq>` +
              `<priority>${entry.priority}</priority>` +
              `</url>`,
          ),
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
