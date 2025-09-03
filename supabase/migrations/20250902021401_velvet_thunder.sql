/*
  # Create products table for inventory management

  1. New Tables
    - `prestashop_products`
      - `id` (uuid, primary key)
      - `prestashop_id` (integer, unique)
      - `name` (text, product name)
      - `reference` (text, SKU/reference code)
      - `price` (numeric, selling price)
      - `category_id` (integer, category reference)
      - `stock_quantity` (integer, current stock)
      - `active` (boolean, product status)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `prestashop_products` table
    - Add policy for authenticated users to view products

  3. Features
    - Automatic timestamp updates
    - Unique constraints on prestashop_id
    - Indexes for performance
*/

-- Create products table
CREATE TABLE IF NOT EXISTS prestashop_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prestashop_id integer UNIQUE NOT NULL,
  name text NOT NULL,
  reference text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  category_id integer,
  stock_quantity integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE prestashop_products ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to view products
CREATE POLICY "Users can view products"
  ON prestashop_products
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_prestashop_products_prestashop_id 
  ON prestashop_products(prestashop_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_prestashop_products_updated_at
  BEFORE UPDATE ON prestashop_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();