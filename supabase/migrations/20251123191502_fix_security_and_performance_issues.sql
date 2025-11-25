/*
  # Fix Security and Performance Issues
  
  1. Indexes
    - Add missing indexes on all foreign keys for optimal performance
    - Remove unused indexes to reduce maintenance overhead
  
  2. RLS Optimization
    - Optimize all RLS policies by wrapping auth.uid() with (select auth.uid())
    - This prevents re-evaluation for each row and improves performance at scale
    - Fix multiple permissive policies on delivery_options
  
  3. Extensions
    - Move pg_trgm extension from public schema to extensions schema
*/

-- =====================================================
-- PART 1: ADD MISSING INDEXES ON FOREIGN KEYS
-- =====================================================

-- Categories table
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);

-- Delivery options table
CREATE INDEX IF NOT EXISTS idx_delivery_options_listing_id ON delivery_options(listing_id);

-- Listings table
CREATE INDEX IF NOT EXISTS idx_listings_category_id ON listings(category_id);
CREATE INDEX IF NOT EXISTS idx_listings_commune ON listings(commune);
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_brand_id ON listings(brand_id);
CREATE INDEX IF NOT EXISTS idx_listings_model_id ON listings(model_id);

-- Messages table
CREATE INDEX IF NOT EXISTS idx_messages_listing_id ON messages(listing_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);

-- Orders table
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_listing_id ON orders(listing_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON orders(seller_id);

-- =====================================================
-- PART 2: REMOVE UNUSED INDEXES
-- =====================================================

DROP INDEX IF EXISTS idx_listings_availability_start;
DROP INDEX IF EXISTS idx_listings_availability_end;
DROP INDEX IF EXISTS idx_listings_promotion_active;
DROP INDEX IF EXISTS idx_listings_promo_end_date;
DROP INDEX IF EXISTS idx_listings_vacation_destination;
DROP INDEX IF EXISTS idx_listings_capacity;
DROP INDEX IF EXISTS idx_vehicle_brands_popular;
DROP INDEX IF EXISTS idx_vehicle_models_popular;
DROP INDEX IF EXISTS idx_keywords_keyword;
DROP INDEX IF EXISTS idx_keywords_language;

-- =====================================================
-- PART 3: OPTIMIZE RLS POLICIES WITH (select auth.uid())
-- =====================================================

-- Profiles table
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = (select auth.uid()));

-- Listings table
DROP POLICY IF EXISTS "Anyone can view active listings" ON listings;
DROP POLICY IF EXISTS "Users can insert own listings" ON listings;
DROP POLICY IF EXISTS "Users can update own listings" ON listings;
DROP POLICY IF EXISTS "Users can delete own listings" ON listings;

CREATE POLICY "Anyone can view active listings"
  ON listings FOR SELECT
  TO public
  USING (status = 'active' OR user_id = (select auth.uid()));

CREATE POLICY "Users can insert own listings"
  ON listings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own listings"
  ON listings FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own listings"
  ON listings FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Delivery options table - FIX: Remove duplicate permissive policies
DROP POLICY IF EXISTS "Anyone can view delivery options" ON delivery_options;
DROP POLICY IF EXISTS "Listing owners can manage delivery options" ON delivery_options;

-- Single policy for SELECT
CREATE POLICY "Anyone can view delivery options"
  ON delivery_options FOR SELECT
  TO public
  USING (true);

-- Separate policies for INSERT, UPDATE, DELETE
CREATE POLICY "Listing owners can insert delivery options"
  ON delivery_options FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = delivery_options.listing_id
      AND listings.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Listing owners can update delivery options"
  ON delivery_options FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = delivery_options.listing_id
      AND listings.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Listing owners can delete delivery options"
  ON delivery_options FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = delivery_options.listing_id
      AND listings.user_id = (select auth.uid())
    )
  );

-- Orders table
DROP POLICY IF EXISTS "Users can view own orders as buyer" ON orders;
DROP POLICY IF EXISTS "Buyers can create orders" ON orders;
DROP POLICY IF EXISTS "Buyers and sellers can update orders" ON orders;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (buyer_id = (select auth.uid()) OR seller_id = (select auth.uid()));

CREATE POLICY "Buyers can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (buyer_id = (select auth.uid()));

CREATE POLICY "Buyers and sellers can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (buyer_id = (select auth.uid()) OR seller_id = (select auth.uid()))
  WITH CHECK (buyer_id = (select auth.uid()) OR seller_id = (select auth.uid()));

-- Messages table
DROP POLICY IF EXISTS "Users can view own messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can update own received messages" ON messages;

CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  TO authenticated
  USING (sender_id = (select auth.uid()) OR receiver_id = (select auth.uid()));

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = (select auth.uid()));

CREATE POLICY "Users can update own received messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (receiver_id = (select auth.uid()))
  WITH CHECK (receiver_id = (select auth.uid()));

-- Favorites table
DROP POLICY IF EXISTS "Users can view own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can add own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can remove own favorites" ON favorites;

CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can add own favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can remove own favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Search history table
DROP POLICY IF EXISTS "Users can view own search history" ON search_history;
DROP POLICY IF EXISTS "Users can add own search history" ON search_history;
DROP POLICY IF EXISTS "Users can delete own search history" ON search_history;

CREATE POLICY "Users can view own search history"
  ON search_history FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can add own search history"
  ON search_history FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own search history"
  ON search_history FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- =====================================================
-- PART 4: MOVE pg_trgm EXTENSION TO EXTENSIONS SCHEMA
-- =====================================================

-- Create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Move pg_trgm extension
DROP EXTENSION IF EXISTS pg_trgm CASCADE;
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;
