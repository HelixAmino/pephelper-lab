/**
 * Static product image mirror.
 * ----------------------------------------------------------------------------
 * Mirrors the `image_url` column on the `products` Supabase table so the
 * frontend can render thumbnails synchronously (SSR, first paint). Cart
 * components also fetch the same data live via `useProductImageMap()` to
 * stay aligned with the backend if URLs ever change.
 */
export const PRODUCT_IMAGES: Record<string, string> = {
  "bac-water-1pack-10ml": "/images/singlebac.jpg",
  "bac-water-3pack-10ml": "/images/3bac.jpg",
  "bac-water-6pack-10ml": "/images/6bac.jpg",
  "bac-water-10pack-10ml": "/images/10bac.jpg",
  "insulin-syringes-30g-100ct": "/images/pin.jpg",
  "insulin-syringes-3pack-30g": "/images/pin.jpg",
  "insulin-syringes-addon": "/images/pin.jpg",
  "alcohol-prep-pads-addon": "/images/prepad.png",
  "bundle-starter": "/images/3bundle.jpg",
  "bundle-value": "/images/bigbundle.jpg",
  "bundle-ultimate": "/images/bigbundle.jpg",
};
