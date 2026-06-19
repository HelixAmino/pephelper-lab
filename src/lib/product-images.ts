/**
 * Product image URLs sourced from the Supabase backend.
 * ----------------------------------------------------------------------------
 * Image bytes live in the `product-images` Storage bucket. The `products`
 * table's `image_url` column holds the public URL for each SKU. The static
 * `PRODUCT_IMAGES` map below mirrors those URLs so the first paint (SSR)
 * has a thumbnail without a roundtrip; `useProductImageMap()` then refreshes
 * the map live from Supabase on the client so URL changes propagate without
 * a redeploy.
 */
import { useEffect, useState } from "react";
import { supabase } from "./supabase";

const STORAGE_BASE =
  "https://kdvdydupksducufbauhm.supabase.co/storage/v1/object/public/product-images";

export const PRODUCT_IMAGES: Record<string, string> = {
  "bac-water-1pack-10ml": `${STORAGE_BASE}/singlebac.jpg`,
  "bac-water-3pack-10ml": `${STORAGE_BASE}/3bac.jpg`,
  "bac-water-6pack-10ml": `${STORAGE_BASE}/6bac.jpg`,
  "bac-water-10pack-10ml": `${STORAGE_BASE}/10bac.jpg`,
  "insulin-syringes-30g-100ct": `${STORAGE_BASE}/pin.jpg`,
  "insulin-syringes-3pack-30g": `${STORAGE_BASE}/pin.jpg`,
  "insulin-syringes-addon": `${STORAGE_BASE}/pin.jpg`,
  "alcohol-prep-pads-addon": `${STORAGE_BASE}/prepad.png`,
  "bundle-starter": `${STORAGE_BASE}/3bundle.jpg`,
  "bundle-value": `${STORAGE_BASE}/bigbundle.jpg`,
  "bundle-ultimate": `${STORAGE_BASE}/bigbundle.jpg`,
};

export function useProductImageMap(): Record<string, string> {
  const [map, setMap] = useState<Record<string, string>>(PRODUCT_IMAGES);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("products")
      .select("slug, image_url")
      .then(({ data, error }) => {
        if (cancelled || error || !data) return;
        const next: Record<string, string> = { ...PRODUCT_IMAGES };
        for (const row of data) {
          if (row.slug && row.image_url) next[row.slug] = row.image_url;
        }
        setMap(next);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return map;
}
