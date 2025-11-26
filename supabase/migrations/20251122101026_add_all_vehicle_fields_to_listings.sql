/*
  # Add Complete Vehicle Fields to Listings Table

  1. New Columns Added to `listings` table
    
    **Core Vehicle Fields:**
    - `vehicle_type` (text) - Type de véhicule: voiture, moto, camion, utilitaire, autre
    - `brand` (text) - Marque du véhicule
    - `model` (text) - Modèle du véhicule
    - `year` (integer) - Année de fabrication (1950-2026)
    - `mileage` (integer) - Kilométrage (0-999999 km)
    - `fuel_type` (text) - Carburant: essence, diesel, hybride, electrique, gpl
    - `transmission` (text) - Boîte: manuelle, automatique
    - `color` (text) - Couleur du véhicule
    
    **Additional Characteristics:**
    - `doors` (integer) - Nombre de portes (2-5)
    - `engine_capacity` (text) - Cylindrée (ex: 1600cc)
    - `horsepower` (integer) - Puissance fiscale (1-50 CV)
    - `seats` (integer) - Nombre de places (2-20)
    - `features` (text[]) - Équipements
    
    **Contact Information:**
    - `contact_name` (text) - Nom du contact
    - `contact_phone` (text) - Téléphone
    - `contact_email` (text) - Email (optionnel)
    - `whatsapp_available` (boolean) - WhatsApp disponible
    
  2. Validation Constraints
    - Vehicle type: voiture, moto, camion, utilitaire, autre
    - Fuel type: essence, diesel, hybride, electrique, gpl
    - Transmission: manuelle, automatique
    - Year: 1950-2026
    - Mileage: 0-999999
    - Doors: 2-5
    - Horsepower: 1-50
    - Seats: 2-20
    
  3. Security
    - All fields are nullable for compatibility with other categories
    - RLS policies remain unchanged (inherited from listings table)
*/

-- Add vehicle type with constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'vehicle_type'
  ) THEN
    ALTER TABLE listings ADD COLUMN vehicle_type text;
  END IF;
END $$;

ALTER TABLE listings DROP CONSTRAINT IF EXISTS check_vehicle_type;
ALTER TABLE listings ADD CONSTRAINT check_vehicle_type 
  CHECK (vehicle_type IS NULL OR vehicle_type IN ('voiture', 'moto', 'camion', 'utilitaire', 'autre'));

-- Add brand
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'brand'
  ) THEN
    ALTER TABLE listings ADD COLUMN brand text;
  END IF;
END $$;

-- Add model
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'model'
  ) THEN
    ALTER TABLE listings ADD COLUMN model text;
  END IF;
END $$;

-- Add year with constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'year'
  ) THEN
    ALTER TABLE listings ADD COLUMN year integer;
  END IF;
END $$;

ALTER TABLE listings DROP CONSTRAINT IF EXISTS check_year;
ALTER TABLE listings ADD CONSTRAINT check_year 
  CHECK (year IS NULL OR (year >= 1950 AND year <= 2026));

-- Add mileage with constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'mileage'
  ) THEN
    ALTER TABLE listings ADD COLUMN mileage integer;
  END IF;
END $$;

ALTER TABLE listings DROP CONSTRAINT IF EXISTS check_mileage;
ALTER TABLE listings ADD CONSTRAINT check_mileage 
  CHECK (mileage IS NULL OR (mileage >= 0 AND mileage <= 999999));

-- Add fuel type with constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'fuel_type'
  ) THEN
    ALTER TABLE listings ADD COLUMN fuel_type text;
  END IF;
END $$;

ALTER TABLE listings DROP CONSTRAINT IF EXISTS check_fuel_type;
ALTER TABLE listings ADD CONSTRAINT check_fuel_type 
  CHECK (fuel_type IS NULL OR fuel_type IN ('essence', 'diesel', 'hybride', 'electrique', 'gpl'));

-- Add transmission with constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'transmission'
  ) THEN
    ALTER TABLE listings ADD COLUMN transmission text;
  END IF;
END $$;

ALTER TABLE listings DROP CONSTRAINT IF EXISTS check_transmission;
ALTER TABLE listings ADD CONSTRAINT check_transmission 
  CHECK (transmission IS NULL OR transmission IN ('manuelle', 'automatique'));

-- Add color
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'color'
  ) THEN
    ALTER TABLE listings ADD COLUMN color text;
  END IF;
END $$;

-- Add doors with constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'doors'
  ) THEN
    ALTER TABLE listings ADD COLUMN doors integer;
  END IF;
END $$;

ALTER TABLE listings DROP CONSTRAINT IF EXISTS check_doors;
ALTER TABLE listings ADD CONSTRAINT check_doors 
  CHECK (doors IS NULL OR (doors >= 2 AND doors <= 5));

-- Add engine capacity
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'engine_capacity'
  ) THEN
    ALTER TABLE listings ADD COLUMN engine_capacity text;
  END IF;
END $$;

-- Add horsepower with constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'horsepower'
  ) THEN
    ALTER TABLE listings ADD COLUMN horsepower integer;
  END IF;
END $$;

ALTER TABLE listings DROP CONSTRAINT IF EXISTS check_horsepower;
ALTER TABLE listings ADD CONSTRAINT check_horsepower 
  CHECK (horsepower IS NULL OR (horsepower >= 1 AND horsepower <= 50));

-- Add seats with constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'seats'
  ) THEN
    ALTER TABLE listings ADD COLUMN seats integer;
  END IF;
END $$;

ALTER TABLE listings DROP CONSTRAINT IF EXISTS check_seats;
ALTER TABLE listings ADD CONSTRAINT check_seats 
  CHECK (seats IS NULL OR (seats >= 2 AND seats <= 20));

-- Add features array
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'features'
  ) THEN
    ALTER TABLE listings ADD COLUMN features text[] DEFAULT '{}';
  END IF;
END $$;

-- Add contact name
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'contact_name'
  ) THEN
    ALTER TABLE listings ADD COLUMN contact_name text;
  END IF;
END $$;

-- Add contact phone
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'contact_phone'
  ) THEN
    ALTER TABLE listings ADD COLUMN contact_phone text;
  END IF;
END $$;

-- Add contact email
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'contact_email'
  ) THEN
    ALTER TABLE listings ADD COLUMN contact_email text;
  END IF;
END $$;

-- Add whatsapp available
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'whatsapp_available'
  ) THEN
    ALTER TABLE listings ADD COLUMN whatsapp_available boolean DEFAULT false;
  END IF;
END $$;

-- Add helpful comments
COMMENT ON COLUMN listings.vehicle_type IS 'Type de véhicule: voiture, moto, camion, utilitaire, autre';
COMMENT ON COLUMN listings.fuel_type IS 'Type de carburant: essence, diesel, hybride, electrique, gpl';
COMMENT ON COLUMN listings.transmission IS 'Boîte de vitesse: manuelle, automatique';
COMMENT ON COLUMN listings.features IS 'Équipements: climatisation, abs, airbags, gps, camera_recul, toit_ouvrant, regulateur_vitesse, jantes_alliage, sieges_cuir, radar_recul';
COMMENT ON COLUMN listings.contact_name IS 'Nom du contact pour cette annonce';
COMMENT ON COLUMN listings.contact_phone IS 'Téléphone de contact (format: 05XX XX XX XX, 06XX XX XX XX, 07XX XX XX XX)';
COMMENT ON COLUMN listings.contact_email IS 'Email de contact optionnel';
COMMENT ON COLUMN listings.whatsapp_available IS 'WhatsApp disponible sur ce numéro';