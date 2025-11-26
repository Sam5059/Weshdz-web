/*
  # Create Vehicle Brands and Models Tables for Algerian Market

  1. New Tables
    - `vehicle_brands`
      - `id` (uuid, primary key)
      - `name` (text) - Brand name
      - `name_ar` (text) - Arabic name
      - `logo_url` (text, nullable) - Brand logo
      - `popular` (boolean) - Popular in Algeria
      - `display_order` (integer) - Display order
      - `created_at` (timestamptz)
    
    - `vehicle_models`
      - `id` (uuid, primary key)
      - `brand_id` (uuid, foreign key) - References vehicle_brands
      - `name` (text) - Model name
      - `name_ar` (text, nullable) - Arabic name
      - `popular` (boolean) - Popular in Algeria
      - `display_order` (integer)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policy for public read access (anyone can view brands/models)
    - Add policy for authenticated users to suggest new brands/models (future feature)

  3. Initial Data
    - Popular car brands in Algeria: Renault, Peugeot, Hyundai, Kia, Toyota, etc.
    - Popular models for top brands
*/

-- Create vehicle_brands table
CREATE TABLE IF NOT EXISTS vehicle_brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_ar text,
  logo_url text,
  popular boolean DEFAULT false,
  display_order integer DEFAULT 999,
  created_at timestamptz DEFAULT now()
);

-- Create vehicle_models table
CREATE TABLE IF NOT EXISTS vehicle_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL REFERENCES vehicle_brands(id) ON DELETE CASCADE,
  name text NOT NULL,
  name_ar text,
  popular boolean DEFAULT false,
  display_order integer DEFAULT 999,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE vehicle_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_models ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Anyone can view vehicle brands"
  ON vehicle_brands
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view vehicle models"
  ON vehicle_models
  FOR SELECT
  TO public
  USING (true);

-- Insert popular car brands in Algeria (ordered by popularity)
INSERT INTO vehicle_brands (name, name_ar, popular, display_order) VALUES
  ('Renault', 'رينو', true, 1),
  ('Peugeot', 'بيجو', true, 2),
  ('Hyundai', 'هيونداي', true, 3),
  ('Kia', 'كيا', true, 4),
  ('Toyota', 'تويوتا', true, 5),
  ('Volkswagen', 'فولكس فاجن', true, 6),
  ('Dacia', 'داسيا', true, 7),
  ('Seat', 'سيات', true, 8),
  ('Nissan', 'نيسان', true, 9),
  ('Citroën', 'سيتروين', true, 10),
  ('Fiat', 'فيات', true, 11),
  ('Ford', 'فورد', true, 12),
  ('Chevrolet', 'شيفروليه', true, 13),
  ('Suzuki', 'سوزوكي', true, 14),
  ('Mazda', 'مازدا', true, 15),
  ('Mercedes-Benz', 'مرسيدس بنز', true, 16),
  ('BMW', 'بي إم دبليو', true, 17),
  ('Audi', 'أودي', true, 18),
  ('Opel', 'أوبل', true, 19),
  ('Skoda', 'سكودا', true, 20),
  ('Honda', 'هوندا', false, 21),
  ('Mitsubishi', 'ميتسوبيشي', false, 22),
  ('Isuzu', 'إيسوزو', false, 23),
  ('Jeep', 'جيب', false, 24),
  ('Land Rover', 'لاند روفر', false, 25),
  ('Mahindra', 'ماهيندرا', false, 26),
  ('Chery', 'شيري', false, 27),
  ('Haval', 'هافال', false, 28),
  ('MG', 'إم جي', false, 29),
  ('Autre', 'أخرى', false, 999)
ON CONFLICT DO NOTHING;

-- Insert popular models for top brands
-- Renault models
INSERT INTO vehicle_models (brand_id, name, name_ar, popular, display_order)
SELECT id, 'Clio', 'كليو', true, 1 FROM vehicle_brands WHERE name = 'Renault'
UNION ALL
SELECT id, 'Symbol', 'سيمبول', true, 2 FROM vehicle_brands WHERE name = 'Renault'
UNION ALL
SELECT id, 'Logan', 'لوغان', true, 3 FROM vehicle_brands WHERE name = 'Renault'
UNION ALL
SELECT id, 'Megane', 'ميغان', true, 4 FROM vehicle_brands WHERE name = 'Renault'
UNION ALL
SELECT id, 'Duster', 'داستر', true, 5 FROM vehicle_brands WHERE name = 'Renault'
UNION ALL
SELECT id, 'Sandero', 'ساندرو', true, 6 FROM vehicle_brands WHERE name = 'Renault'
UNION ALL
SELECT id, 'Captur', 'كابتور', true, 7 FROM vehicle_brands WHERE name = 'Renault'
UNION ALL
SELECT id, 'Talisman', 'تاليسمان', false, 8 FROM vehicle_brands WHERE name = 'Renault'
UNION ALL
SELECT id, 'Koleos', 'كوليوس', false, 9 FROM vehicle_brands WHERE name = 'Renault';

-- Peugeot models
INSERT INTO vehicle_models (brand_id, name, name_ar, popular, display_order)
SELECT id, '208', '208', true, 1 FROM vehicle_brands WHERE name = 'Peugeot'
UNION ALL
SELECT id, '301', '301', true, 2 FROM vehicle_brands WHERE name = 'Peugeot'
UNION ALL
SELECT id, '308', '308', true, 3 FROM vehicle_brands WHERE name = 'Peugeot'
UNION ALL
SELECT id, '2008', '2008', true, 4 FROM vehicle_brands WHERE name = 'Peugeot'
UNION ALL
SELECT id, '3008', '3008', true, 5 FROM vehicle_brands WHERE name = 'Peugeot'
UNION ALL
SELECT id, '5008', '5008', false, 6 FROM vehicle_brands WHERE name = 'Peugeot'
UNION ALL
SELECT id, '508', '508', false, 7 FROM vehicle_brands WHERE name = 'Peugeot'
UNION ALL
SELECT id, 'Partner', 'بارتنر', false, 8 FROM vehicle_brands WHERE name = 'Peugeot';

-- Hyundai models
INSERT INTO vehicle_models (brand_id, name, name_ar, popular, display_order)
SELECT id, 'i10', 'آي 10', true, 1 FROM vehicle_brands WHERE name = 'Hyundai'
UNION ALL
SELECT id, 'i20', 'آي 20', true, 2 FROM vehicle_brands WHERE name = 'Hyundai'
UNION ALL
SELECT id, 'Accent', 'أكسنت', true, 3 FROM vehicle_brands WHERE name = 'Hyundai'
UNION ALL
SELECT id, 'Elantra', 'إلنترا', true, 4 FROM vehicle_brands WHERE name = 'Hyundai'
UNION ALL
SELECT id, 'Tucson', 'توسان', true, 5 FROM vehicle_brands WHERE name = 'Hyundai'
UNION ALL
SELECT id, 'Santa Fe', 'سانتا في', false, 6 FROM vehicle_brands WHERE name = 'Hyundai'
UNION ALL
SELECT id, 'Kona', 'كونا', false, 7 FROM vehicle_brands WHERE name = 'Hyundai'
UNION ALL
SELECT id, 'Creta', 'كريتا', true, 8 FROM vehicle_brands WHERE name = 'Hyundai';

-- Kia models
INSERT INTO vehicle_models (brand_id, name, name_ar, popular, display_order)
SELECT id, 'Picanto', 'بيكانتو', true, 1 FROM vehicle_brands WHERE name = 'Kia'
UNION ALL
SELECT id, 'Rio', 'ريو', true, 2 FROM vehicle_brands WHERE name = 'Kia'
UNION ALL
SELECT id, 'Cerato', 'سيراتو', true, 3 FROM vehicle_brands WHERE name = 'Kia'
UNION ALL
SELECT id, 'Sportage', 'سبورتاج', true, 4 FROM vehicle_brands WHERE name = 'Kia'
UNION ALL
SELECT id, 'Sorento', 'سورينتو', false, 5 FROM vehicle_brands WHERE name = 'Kia'
UNION ALL
SELECT id, 'Seltos', 'سيلتوس', false, 6 FROM vehicle_brands WHERE name = 'Kia';

-- Toyota models
INSERT INTO vehicle_models (brand_id, name, name_ar, popular, display_order)
SELECT id, 'Yaris', 'ياريس', true, 1 FROM vehicle_brands WHERE name = 'Toyota'
UNION ALL
SELECT id, 'Corolla', 'كورولا', true, 2 FROM vehicle_brands WHERE name = 'Toyota'
UNION ALL
SELECT id, 'Hilux', 'هايلوكس', true, 3 FROM vehicle_brands WHERE name = 'Toyota'
UNION ALL
SELECT id, 'RAV4', 'راف 4', true, 4 FROM vehicle_brands WHERE name = 'Toyota'
UNION ALL
SELECT id, 'Land Cruiser', 'لاند كروزر', false, 5 FROM vehicle_brands WHERE name = 'Toyota'
UNION ALL
SELECT id, 'Prado', 'برادو', false, 6 FROM vehicle_brands WHERE name = 'Toyota'
UNION ALL
SELECT id, 'Camry', 'كامري', false, 7 FROM vehicle_brands WHERE name = 'Toyota';

-- Volkswagen models
INSERT INTO vehicle_models (brand_id, name, name_ar, popular, display_order)
SELECT id, 'Polo', 'بولو', true, 1 FROM vehicle_brands WHERE name = 'Volkswagen'
UNION ALL
SELECT id, 'Golf', 'غولف', true, 2 FROM vehicle_brands WHERE name = 'Volkswagen'
UNION ALL
SELECT id, 'Passat', 'باسات', true, 3 FROM vehicle_brands WHERE name = 'Volkswagen'
UNION ALL
SELECT id, 'Tiguan', 'تيغوان', true, 4 FROM vehicle_brands WHERE name = 'Volkswagen'
UNION ALL
SELECT id, 'Touareg', 'طوارق', false, 5 FROM vehicle_brands WHERE name = 'Volkswagen'
UNION ALL
SELECT id, 'Caddy', 'كادي', false, 6 FROM vehicle_brands WHERE name = 'Volkswagen';

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_vehicle_brands_popular ON vehicle_brands(popular, display_order);
CREATE INDEX IF NOT EXISTS idx_vehicle_models_brand_id ON vehicle_models(brand_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_models_popular ON vehicle_models(popular, display_order);
