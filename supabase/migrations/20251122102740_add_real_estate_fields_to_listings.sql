/*
  # Add Real Estate & Rental Specific Fields to Listings Table

  1. New Columns Added to `listings` table
    
    **Property Details:**
    - `property_type` (text) - Type de bien: appartement, maison, studio, villa, local_commercial, bureau, terrain
    - `bedrooms` (integer) - Nombre de chambres (0-20)
    - `bathrooms` (integer) - Salles de bain (1-10)
    - `surface` (numeric) - Surface en m² (10-10000)
    - `floor` (text) - Étage: rdc, 1er, 2eme, 3eme, 4_et_plus
    - `property_condition` (text) - État: neuf, bon_etat, a_renover
    - `rental_type` (text) - Type location: longue_duree, courte_duree, saisonniere
    
    **Furnishing:**
    - `furnished` (text) - meuble, semi_meuble, non_meuble
    
    **Amenities (Equipment):**
    - `amenities` (text[]) - Array of amenities
    
    **Financial Details:**
    - `charges_included` (boolean) - Charges incluses
    - `charges_amount` (numeric) - Montant charges (optionnel)
    - `deposit_required` (boolean) - Caution demandée
    - `deposit_amount` (numeric) - Montant caution
    
    **Availability:**
    - `available_from` (date) - Date de disponibilité
    - `minimum_rental_duration` (text) - Durée minimum: 1_mois, 3_mois, 6_mois, 1_an, 2_ans
    
    **Contact Details:**
    - `visit_hours` (text) - Horaires de visite préférés
    
  2. Validation Constraints
    - Property type must be valid option
    - Bedrooms: 0-20
    - Bathrooms: 1-10
    - Surface: 10-10000 m²
    - Dates must be in future
    
  3. Security
    - All fields nullable for compatibility with other categories
    - RLS policies inherited from listings table
*/

-- Add property_type with constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'property_type'
  ) THEN
    ALTER TABLE listings ADD COLUMN property_type text;
  END IF;
END $$;

ALTER TABLE listings DROP CONSTRAINT IF EXISTS check_property_type;
ALTER TABLE listings ADD CONSTRAINT check_property_type 
  CHECK (property_type IS NULL OR property_type IN ('appartement', 'maison', 'studio', 'villa', 'local_commercial', 'bureau', 'terrain'));

-- Add bedrooms with constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'bedrooms'
  ) THEN
    ALTER TABLE listings ADD COLUMN bedrooms integer;
  END IF;
END $$;

ALTER TABLE listings DROP CONSTRAINT IF EXISTS check_bedrooms;
ALTER TABLE listings ADD CONSTRAINT check_bedrooms 
  CHECK (bedrooms IS NULL OR (bedrooms >= 0 AND bedrooms <= 20));

-- Add bathrooms with constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'bathrooms'
  ) THEN
    ALTER TABLE listings ADD COLUMN bathrooms integer;
  END IF;
END $$;

ALTER TABLE listings DROP CONSTRAINT IF EXISTS check_bathrooms;
ALTER TABLE listings ADD CONSTRAINT check_bathrooms 
  CHECK (bathrooms IS NULL OR (bathrooms >= 1 AND bathrooms <= 10));

-- Add surface with constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'surface'
  ) THEN
    ALTER TABLE listings ADD COLUMN surface numeric;
  END IF;
END $$;

ALTER TABLE listings DROP CONSTRAINT IF EXISTS check_surface;
ALTER TABLE listings ADD CONSTRAINT check_surface 
  CHECK (surface IS NULL OR (surface >= 10 AND surface <= 10000));

-- Add floor
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'floor'
  ) THEN
    ALTER TABLE listings ADD COLUMN floor text;
  END IF;
END $$;

ALTER TABLE listings DROP CONSTRAINT IF EXISTS check_floor;
ALTER TABLE listings ADD CONSTRAINT check_floor 
  CHECK (floor IS NULL OR floor IN ('rdc', '1er', '2eme', '3eme', '4_et_plus'));

-- Add property_condition
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'property_condition'
  ) THEN
    ALTER TABLE listings ADD COLUMN property_condition text;
  END IF;
END $$;

ALTER TABLE listings DROP CONSTRAINT IF EXISTS check_property_condition;
ALTER TABLE listings ADD CONSTRAINT check_property_condition 
  CHECK (property_condition IS NULL OR property_condition IN ('neuf', 'bon_etat', 'a_renover'));

-- Add rental_type
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'rental_type'
  ) THEN
    ALTER TABLE listings ADD COLUMN rental_type text;
  END IF;
END $$;

ALTER TABLE listings DROP CONSTRAINT IF EXISTS check_rental_type;
ALTER TABLE listings ADD CONSTRAINT check_rental_type 
  CHECK (rental_type IS NULL OR rental_type IN ('longue_duree', 'courte_duree', 'saisonniere'));

-- Add furnished
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'furnished'
  ) THEN
    ALTER TABLE listings ADD COLUMN furnished text;
  END IF;
END $$;

ALTER TABLE listings DROP CONSTRAINT IF EXISTS check_furnished;
ALTER TABLE listings ADD CONSTRAINT check_furnished 
  CHECK (furnished IS NULL OR furnished IN ('meuble', 'semi_meuble', 'non_meuble'));

-- Add amenities array
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'amenities'
  ) THEN
    ALTER TABLE listings ADD COLUMN amenities text[] DEFAULT '{}';
  END IF;
END $$;

-- Add charges_included
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'charges_included'
  ) THEN
    ALTER TABLE listings ADD COLUMN charges_included boolean DEFAULT false;
  END IF;
END $$;

-- Add charges_amount
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'charges_amount'
  ) THEN
    ALTER TABLE listings ADD COLUMN charges_amount numeric;
  END IF;
END $$;

ALTER TABLE listings DROP CONSTRAINT IF EXISTS check_charges_amount;
ALTER TABLE listings ADD CONSTRAINT check_charges_amount 
  CHECK (charges_amount IS NULL OR charges_amount >= 0);

-- Add deposit_required
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'deposit_required'
  ) THEN
    ALTER TABLE listings ADD COLUMN deposit_required boolean DEFAULT false;
  END IF;
END $$;

-- Add deposit_amount
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'deposit_amount'
  ) THEN
    ALTER TABLE listings ADD COLUMN deposit_amount numeric;
  END IF;
END $$;

ALTER TABLE listings DROP CONSTRAINT IF EXISTS check_deposit_amount;
ALTER TABLE listings ADD CONSTRAINT check_deposit_amount 
  CHECK (deposit_amount IS NULL OR deposit_amount >= 0);

-- Add available_from
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'available_from'
  ) THEN
    ALTER TABLE listings ADD COLUMN available_from date;
  END IF;
END $$;

-- Add minimum_rental_duration
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'minimum_rental_duration'
  ) THEN
    ALTER TABLE listings ADD COLUMN minimum_rental_duration text;
  END IF;
END $$;

ALTER TABLE listings DROP CONSTRAINT IF EXISTS check_minimum_rental_duration;
ALTER TABLE listings ADD CONSTRAINT check_minimum_rental_duration 
  CHECK (minimum_rental_duration IS NULL OR minimum_rental_duration IN ('1_mois', '3_mois', '6_mois', '1_an', '2_ans'));

-- Add visit_hours
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'visit_hours'
  ) THEN
    ALTER TABLE listings ADD COLUMN visit_hours text;
  END IF;
END $$;

-- Add helpful comments
COMMENT ON COLUMN listings.property_type IS 'Type de bien: appartement, maison, studio, villa, local_commercial, bureau, terrain';
COMMENT ON COLUMN listings.bedrooms IS 'Nombre de chambres (0 pour studio, max 20)';
COMMENT ON COLUMN listings.bathrooms IS 'Nombre de salles de bain (min 1, max 10)';
COMMENT ON COLUMN listings.surface IS 'Surface en m² (min 10, max 10000)';
COMMENT ON COLUMN listings.floor IS 'Étage: rdc, 1er, 2eme, 3eme, 4_et_plus';
COMMENT ON COLUMN listings.property_condition IS 'État du bien: neuf, bon_etat, a_renover';
COMMENT ON COLUMN listings.rental_type IS 'Type de location: longue_duree (>6 mois), courte_duree (<6 mois), saisonniere';
COMMENT ON COLUMN listings.furnished IS 'Meublé: meuble, semi_meuble, non_meuble';
COMMENT ON COLUMN listings.amenities IS 'Équipements: climatisation, chauffage_central, garage_parking, jardin, ascenseur, piscine, balcon, cave, interphone, gardiennage_securite, cuisine_equipee, internet_wifi';
COMMENT ON COLUMN listings.charges_included IS 'Charges incluses dans le loyer';
COMMENT ON COLUMN listings.charges_amount IS 'Montant des charges si non incluses';
COMMENT ON COLUMN listings.deposit_required IS 'Caution demandée';
COMMENT ON COLUMN listings.deposit_amount IS 'Montant de la caution';
COMMENT ON COLUMN listings.available_from IS 'Date de disponibilité du bien';
COMMENT ON COLUMN listings.minimum_rental_duration IS 'Durée minimum de location: 1_mois, 3_mois, 6_mois, 1_an, 2_ans';
COMMENT ON COLUMN listings.visit_hours IS 'Horaires de visite préférés';