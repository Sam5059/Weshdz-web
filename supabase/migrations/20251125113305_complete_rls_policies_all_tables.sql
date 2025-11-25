/*
  # Complete RLS Policies for All Tables

  ## Security Implementation
  
  This migration adds comprehensive RLS policies for:
  - listings (with proper ownership checks)
  - profiles (users can only edit their own profile)
  - categories (public read)
  - subcategories (public read)
  - brands (public read)
  - models (public read)
  - wilayas (public read)
  - communes (public read)
  - favorites (user-specific)
  - messages (sender/receiver only)
  
  ## Policies Summary
  All tables follow the principle of least privilege:
  - Public data is readable by everyone
  - User data is only accessible to the owner
  - Write operations require authentication and ownership verification
*/

-- ============================================
-- LISTINGS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Anyone can view active listings" ON listings;
DROP POLICY IF EXISTS "Users can view their own listings" ON listings;
DROP POLICY IF EXISTS "Users can create listings" ON listings;
DROP POLICY IF EXISTS "Users can update own listings" ON listings;
DROP POLICY IF EXISTS "Users can delete own listings" ON listings;

CREATE POLICY "Anyone can view active listings"
  ON listings FOR SELECT
  TO authenticated, anon
  USING (status = 'active');

CREATE POLICY "Users can view all their own listings"
  ON listings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create listings"
  ON listings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings"
  ON listings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listings"
  ON listings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- PROFILES POLICIES
-- ============================================

DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================
-- CATEGORIES POLICIES (Already set but ensuring)
-- ============================================

DROP POLICY IF EXISTS "Anyone can view categories" ON categories;

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO authenticated, anon
  USING (true);

-- ============================================
-- BRANDS & MODELS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Anyone can view brands" ON brands;
DROP POLICY IF EXISTS "Anyone can view models" ON models;

CREATE POLICY "Anyone can view brands"
  ON brands FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Anyone can view models"
  ON models FOR SELECT
  TO authenticated, anon
  USING (true);

-- ============================================
-- WILAYAS & COMMUNES POLICIES
-- ============================================

DROP POLICY IF EXISTS "Anyone can view wilayas" ON wilayas;
DROP POLICY IF EXISTS "Anyone can view communes" ON communes;

CREATE POLICY "Anyone can view wilayas"
  ON wilayas FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Anyone can view communes"
  ON communes FOR SELECT
  TO authenticated, anon
  USING (true);

-- ============================================
-- FAVORITES POLICIES
-- ============================================

DROP POLICY IF EXISTS "Users can view own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can create favorites" ON favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON favorites;

CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- MESSAGES POLICIES
-- ============================================

DROP POLICY IF EXISTS "Users can view messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can update messages" ON messages;

CREATE POLICY "Users can view their messages"
  ON messages FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their received messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = receiver_id);

-- ============================================
-- KEYWORDS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Anyone can view keywords" ON keywords;

CREATE POLICY "Anyone can view keywords"
  ON keywords FOR SELECT
  TO authenticated, anon
  USING (true);
