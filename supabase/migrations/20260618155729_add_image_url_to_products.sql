-- Add image_url to products so the frontend can fetch cart thumbnails via API.
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url text NOT NULL DEFAULT '';

UPDATE products SET image_url = '/images/singlebac.jpg' WHERE sku = 'PH399.001';
UPDATE products SET image_url = '/images/3bac.jpg'      WHERE sku = 'PH399.003';
UPDATE products SET image_url = '/images/6bac.jpg'      WHERE sku = 'PH399.006';
UPDATE products SET image_url = '/images/10bac.jpg'     WHERE sku = 'PH399.010';
UPDATE products SET image_url = '/images/pin.jpg'       WHERE sku = 'PH399.030';
UPDATE products SET image_url = '/images/pin.jpg'       WHERE sku = 'PH399.030.3';
UPDATE products SET image_url = '/images/pin.jpg'       WHERE sku = 'PH399.030.AO';
UPDATE products SET image_url = '/images/prepad.png'    WHERE sku = 'PH399.020.AO';
UPDATE products SET image_url = '/images/3bundle.jpg'   WHERE sku = 'PH399.101';
UPDATE products SET image_url = '/images/bigbundle.jpg' WHERE sku = 'PH399.102';
UPDATE products SET image_url = '/images/bigbundle.jpg' WHERE sku = 'PH399.103';
