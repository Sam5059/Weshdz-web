/*
  # Wesh-DZ Marketplace Schema

  ## Tables Created
  
  ### 1. profiles
  - Extended user profile information
  - Links to auth.users
  - Fields: id, email, full_name, phone, wilaya, commune, is_professional, avatar_url, created_at, updated_at
  
  ### 2. categories
  - Product/service categories
  - Fields: id, name, slug, description, icon, parent_id (for subcategories), created_at
  
  ### 3. listings
  - Product/service listings
  - Fields: id, user_id, category_id, title, description, price, negotiable, condition, images, status, wilaya, commune, delivery_available, created_at, updated_at
  
  ### 4. delivery_options
  - Delivery methods and zones
  - Fields: id, listing_id, delivery_type, zones, price, estimated_days, created_at
  
  ### 5. orders
  - Order management
  - Fields: id, buyer_id, seller_id, listing_id, quantity, total_price, delivery_address, status, payment_status, created_at, updated_at
  
  ### 6. messages
  - User messaging system
  - Fields: id, sender_id, receiver_id, listing_id, content, read, created_at

  ## Security
  - RLS enabled on all tables
  - Policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  wilaya text NOT NULL DEFAULT '',
  commune text NOT NULL DEFAULT '',
  is_professional boolean DEFAULT false,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text,
  parent_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL,
  negotiable boolean DEFAULT false,
  condition text CHECK (condition IN ('new', 'like_new', 'good', 'fair', 'service')) DEFAULT 'good',
  images text[] DEFAULT '{}',
  status text CHECK (status IN ('draft', 'active', 'sold', 'archived')) DEFAULT 'active',
  wilaya text NOT NULL,
  commune text NOT NULL,
  delivery_available boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active listings"
  ON listings FOR SELECT
  TO authenticated
  USING (status = 'active' OR user_id = auth.uid());

CREATE POLICY "Users can insert own listings"
  ON listings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own listings"
  ON listings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own listings"
  ON listings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create delivery_options table
CREATE TABLE IF NOT EXISTS delivery_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  delivery_type text CHECK (delivery_type IN ('home', 'yalidine', 'maystro', 'pickup')) NOT NULL,
  zones text[] DEFAULT '{}',
  price decimal(10,2) DEFAULT 0,
  estimated_days integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE delivery_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view delivery options"
  ON delivery_options FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Listing owners can manage delivery options"
  ON delivery_options FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = delivery_options.listing_id
      AND listings.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = delivery_options.listing_id
      AND listings.user_id = auth.uid()
    )
  );

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  listing_id uuid REFERENCES listings(id) ON DELETE SET NULL,
  quantity integer DEFAULT 1,
  total_price decimal(10,2) NOT NULL,
  delivery_address text NOT NULL,
  status text CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
  payment_status text CHECK (payment_status IN ('pending', 'paid', 'refunded')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders as buyer"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Buyers can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Buyers and sellers can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id)
  WITH CHECK (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  listing_id uuid REFERENCES listings(id) ON DELETE SET NULL,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update own received messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = receiver_id);

-- Insert default categories
INSERT INTO categories (name, slug, description, icon) VALUES
  ('Électronique', 'electronique', 'Téléphones, ordinateurs, accessoires', '📱'),
  ('Véhicules', 'vehicules', 'Voitures, motos, pièces détachées', '🚗'),
  ('Immobilier', 'immobilier', 'Appartements, maisons, terrains', '🏠'),
  ('Mode', 'mode', 'Vêtements, chaussures, accessoires', '👕'),
  ('Maison', 'maison', 'Meubles, électroménager, décoration', '🛋️'),
  ('Services', 'services', 'Services professionnels', '🔧'),
  ('Emploi', 'emploi', 'Offres et demandes d''emploi', '💼'),
  ('Loisirs', 'loisirs', 'Sports, jeux, hobbies', '⚽')
ON CONFLICT (slug) DO NOTHING;
