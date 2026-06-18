CREATE TABLE IF NOT EXISTS products (
  id bigint PRIMARY KEY,
  sku text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  price numeric(10,2) NOT NULL,
  short_description text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  category text NOT NULL CHECK (category IN ('supplies','bundle')),
  image_alt text NOT NULL DEFAULT '',
  add_only boolean NOT NULL DEFAULT false,
  woo_product_id bigint,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "no_public_insert_products" ON products FOR INSERT
  TO authenticated WITH CHECK (false);

CREATE POLICY "no_public_update_products" ON products FOR UPDATE
  TO authenticated USING (false) WITH CHECK (false);

CREATE POLICY "no_public_delete_products" ON products FOR DELETE
  TO authenticated USING (false);

CREATE INDEX IF NOT EXISTS products_category_idx ON products (category);
CREATE INDEX IF NOT EXISTS products_add_only_idx ON products (add_only);