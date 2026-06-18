import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { PRODUCT_IMAGES } from "./product-images";
import { PRODUCTS } from "./products";

const SKU_FALLBACK: Record<string, string> = Object.fromEntries(
  PRODUCTS.map((p) => [p.sku, PRODUCT_IMAGES[p.slug] ?? ""]).filter(
    ([, url]) => url,
  ),
);

let cache: Record<string, string> | null = null;
let inflight: Promise<Record<string, string>> | null = null;

async function fetchMap(): Promise<Record<string, string>> {
  if (cache) return cache;
  if (inflight) return inflight;
  inflight = (async () => {
    const { data, error } = await supabase
      .from("products")
      .select("sku, image_url");
    if (error || !data) {
      inflight = null;
      return SKU_FALLBACK;
    }
    const map: Record<string, string> = { ...SKU_FALLBACK };
    for (const row of data) {
      if (row.sku && row.image_url) map[row.sku] = row.image_url;
    }
    cache = map;
    inflight = null;
    return map;
  })();
  return inflight;
}

export function useProductImageMap(): Record<string, string> {
  const [map, setMap] = useState<Record<string, string>>(
    () => cache ?? SKU_FALLBACK,
  );

  useEffect(() => {
    let cancelled = false;
    fetchMap().then((next) => {
      if (!cancelled) setMap(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return map;
}
