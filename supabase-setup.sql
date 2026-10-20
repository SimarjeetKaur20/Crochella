-- Crochella Database Setup
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  discounted_price NUMERIC(10,2),
  images TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  stock_quantity INTEGER DEFAULT 0,
  sku TEXT UNIQUE,
  preparation_time TEXT DEFAULT '3-5 days',
  customization_options TEXT,
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_bestseller BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  delivery_address JSONB NOT NULL,
  order_notes TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal NUMERIC(10,2) NOT NULL,
  shipping_fee NUMERIC(10,2) DEFAULT 80,
  total NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'cod',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  fulfillment_status TEXT NOT NULL DEFAULT 'order-received',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site config table
CREATE TABLE IF NOT EXISTS site_config (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- Insert default config
INSERT INTO site_config (key, value) VALUES
  ('whatsapp_number', 'YOUR_WHATSAPP_NUMBER'),
  ('instagram_url', 'https://instagram.com/crochella'),
  ('email', 'crochella@email.com'),
  ('shipping_fee', '80'),
  ('free_shipping_above', '1500'),
  ('razorpay_enabled', 'false'),
  ('cod_enabled', 'true'),
  ('announcement_text', 'Handmade with Love | Every Stitch Tells a Story ✨')
ON CONFLICT (key) DO NOTHING;

-- Row Level Security

-- Products: anyone can read, only authenticated admins can write
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available products"
  ON products FOR SELECT
  USING (is_available = true);

CREATE POLICY "Admins can do everything on products"
  ON products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Orders: only admins can read, anyone can insert (place order)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can place an order"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view and update orders"
  ON orders FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Site config: anyone can read, only admins can write
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site config"
  ON site_config FOR SELECT
  USING (true);

CREATE POLICY "Admins can update site config"
  ON site_config FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Storage bucket for product images
-- Run this separately or in the Supabase dashboard Storage section:
-- Create a bucket named "product-images" with public access enabled.

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
