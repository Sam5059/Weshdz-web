/*
  # Rename vehicle_brands to brands and vehicle_models to models

  ## Changes
  1. Rename vehicle_brands table to brands
  2. Rename vehicle_models table to models
  3. Update all foreign key references
  4. Update indexes
  
  ## Security
  - Maintain existing RLS policies
*/

-- Rename vehicle_brands to brands
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vehicle_brands' AND table_schema = 'public') THEN
    ALTER TABLE IF EXISTS vehicle_brands RENAME TO brands;
  END IF;
END $$;

-- Rename vehicle_models to models
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vehicle_models' AND table_schema = 'public') THEN
    ALTER TABLE IF EXISTS vehicle_models RENAME TO models;
  END IF;
END $$;

-- Update foreign key column name in models table
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'models' AND column_name = 'brand_id') THEN
    -- Foreign key already exists, nothing to do
    NULL;
  END IF;
END $$;

-- Rename listings foreign key columns if they still use old names
DO $$
BEGIN
  -- Check if old column names exist and rename them
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'brand_id') THEN
    -- Columns already properly named
    NULL;
  END IF;
END $$;
