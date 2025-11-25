-- Create base tables for WeshDZ

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  wilaya text DEFAULT '',
  commune text DEFAULT '',
  is_professional boolean DEFAULT false,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text,
  parent_id uuid REFERENCES categories(id),
  name_fr text,
  name_ar text,
  name_en text,
  display_order integer DEFAULT 999,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_select" ON categories FOR SELECT TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS communes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wilaya_code text NOT NULL,
  name_fr text NOT NULL,
  name_ar text,
  post_code text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE communes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "communes_select" ON communes FOR SELECT TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS vehicle_brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  popular boolean DEFAULT false,
  display_order integer DEFAULT 999,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vehicle_brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vehicle_brands_select" ON vehicle_brands FOR SELECT TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS vehicle_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES vehicle_brands(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vehicle_models ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vehicle_models_select" ON vehicle_models FOR SELECT TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES categories(id),
  title text NOT NULL,
  description text NOT NULL,
  price decimal(10,2),
  images text[] DEFAULT '{}',
  status text DEFAULT 'active',
  wilaya text NOT NULL,
  commune uuid REFERENCES communes(id),
  account_type text DEFAULT 'particulier',
  offer_type text DEFAULT 'offre',
  listing_type text DEFAULT 'vendre',
  brand_id uuid REFERENCES vehicle_brands(id),
  model_id uuid REFERENCES vehicle_models(id),
  year integer,
  mileage integer,
  fuel_type text,
  transmission text,
  property_type text,
  bedrooms integer,
  surface numeric,
  job_title text,
  contact_phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "listings_select" ON listings FOR SELECT TO authenticated USING (status = 'active' OR user_id = auth.uid());
CREATE POLICY "listings_insert" ON listings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "listings_update" ON listings FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "listings_delete" ON listings FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, listing_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "favorites_all" ON favorites FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  listing_id uuid REFERENCES listings(id),
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "messages_select" ON messages FOR SELECT TO authenticated USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "messages_insert" ON messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);

INSERT INTO storage.buckets (id, name, public) VALUES ('listings', 'listings', true) ON CONFLICT DO NOTHING;
CREATE POLICY "storage_select" ON storage.objects FOR SELECT USING (bucket_id = 'listings');
CREATE POLICY "storage_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'listings');

INSERT INTO categories (name, slug, icon, name_fr, name_ar, name_en) VALUES
('Véhicules', 'vehicules', '🚗', 'Véhicules', 'مركبات', 'Vehicles'),
('Immobilier', 'immobilier', '🏠', 'Immobilier', 'عقارات', 'Real Estate'),
('Électronique', 'electronique', '📱', 'Électronique', 'إلكترونيات', 'Electronics'),
('Emploi', 'emploi', '💼', 'Emploi', 'توظيف', 'Employment')
ON CONFLICT DO NOTHING;

INSERT INTO vehicle_brands (name, popular, display_order) VALUES
('Renault', true, 1), ('Peugeot', true, 2), ('Volkswagen', true, 3),
('Hyundai', true, 4), ('Toyota', true, 5), ('Ford', true, 6)
ON CONFLICT DO NOTHING;

INSERT INTO communes (wilaya_code, name_fr, name_ar, post_code) VALUES
('16', 'Alger Centre', 'الجزائر الوسطى', '16000'),
('16', 'Bab El Oued', 'باب الواد', '16030'),
('16', 'Hydra', 'حيدرة', '16035'),
('16', 'Cheraga', 'الشراقة', '16013')
ON CONFLICT DO NOTHING;