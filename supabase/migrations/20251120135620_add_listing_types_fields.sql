/*
  # Add Listing Types and Account Type Fields

  1. New Columns
    - `account_type` (text) - Type de compte: 'particulier' ou 'professionnel'
    - `offer_type` (text) - Type d'annonce: 'offre' ou 'demande'
    - `listing_type` (text) - Type d'offre: 'vendre', 'donner', 'echanger'

  2. Changes
    - Add these columns to listings table with default values
    - Update existing records to have default values
*/

DO $$
BEGIN
  -- Add account_type column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'account_type'
  ) THEN
    ALTER TABLE listings ADD COLUMN account_type text DEFAULT 'particulier';
  END IF;

  -- Add offer_type column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'offer_type'
  ) THEN
    ALTER TABLE listings ADD COLUMN offer_type text DEFAULT 'offre';
  END IF;

  -- Add listing_type column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'listing_type'
  ) THEN
    ALTER TABLE listings ADD COLUMN listing_type text DEFAULT 'vendre';
  END IF;
END $$;
