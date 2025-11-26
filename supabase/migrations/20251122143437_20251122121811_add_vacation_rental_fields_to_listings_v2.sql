/*
  # Ajouter les champs pour les locations de vacances

  1. Nouveaux champs pour hébergements vacances
    - `accommodation_type` (text) - Type d'hébergement (appartement, villa, maison, etc.)
    - `vacation_destination` (text) - Destination vacances (bord de mer, montagne, sahara, etc.)
    - `capacity` (integer) - Capacité en nombre de personnes
    - `beds` (integer) - Nombre de lits
    - `vacation_amenities` (jsonb) - Équipements et commodités de l'hébergement
    - `distance_to_beach` (text) - Distance jusqu'à la plage ou point d'intérêt
    - `availability_start` (date) - Date de début de disponibilité
    - `availability_end` (date) - Date de fin de disponibilité
    - `available_all_year` (boolean) - Disponible toute l'année

  2. Notes
    - Les champs `bedrooms` et `bathrooms` existent déjà
    - Les nouveaux champs sont optionnels sauf pour les locations vacances
    - `vacation_amenities` stocke un tableau JSON des équipements
    - Les dates de disponibilité permettent de définir la période de location
*/

-- Ajouter les nouveaux champs pour locations vacances
DO $$
BEGIN
  -- Type d'hébergement vacances
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'listings' AND column_name = 'accommodation_type'
  ) THEN
    ALTER TABLE listings ADD COLUMN accommodation_type text;
  END IF;

  -- Destination vacances (bord de mer, montagne, sahara)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'listings' AND column_name = 'vacation_destination'
  ) THEN
    ALTER TABLE listings ADD COLUMN vacation_destination text;
  END IF;

  -- Capacité en personnes
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'listings' AND column_name = 'capacity'
  ) THEN
    ALTER TABLE listings ADD COLUMN capacity integer;
  END IF;

  -- Nombre de lits
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'listings' AND column_name = 'beds'
  ) THEN
    ALTER TABLE listings ADD COLUMN beds integer;
  END IF;

  -- Équipements de l'hébergement vacances (WiFi, piscine, vue mer, etc.)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'listings' AND column_name = 'vacation_amenities'
  ) THEN
    ALTER TABLE listings ADD COLUMN vacation_amenities jsonb DEFAULT '[]'::jsonb;
  END IF;

  -- Distance jusqu'à la plage ou point d'intérêt
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'distance_to_beach'
  ) THEN
    ALTER TABLE listings ADD COLUMN distance_to_beach text;
  END IF;

  -- Date de début de disponibilité
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'availability_start'
  ) THEN
    ALTER TABLE listings ADD COLUMN availability_start date;
  END IF;

  -- Date de fin de disponibilité
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'availability_end'
  ) THEN
    ALTER TABLE listings ADD COLUMN availability_end date;
  END IF;

  -- Disponible toute l'année
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'available_all_year'
  ) THEN
    ALTER TABLE listings ADD COLUMN available_all_year boolean DEFAULT false;
  END IF;
END $$;

-- Ajouter des index pour améliorer les performances de recherche
CREATE INDEX IF NOT EXISTS idx_listings_vacation_destination ON listings(vacation_destination) WHERE vacation_destination IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_listings_accommodation_type ON listings(accommodation_type) WHERE accommodation_type IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_listings_capacity ON listings(capacity) WHERE capacity IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_listings_availability_start ON listings(availability_start) WHERE availability_start IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_listings_availability_end ON listings(availability_end) WHERE availability_end IS NOT NULL;

-- Ajouter des commentaires pour la documentation
COMMENT ON COLUMN listings.accommodation_type IS 'Type d''hébergement vacances: appartement, villa, maison, chalet, etc.';
COMMENT ON COLUMN listings.vacation_destination IS 'Destination: bord de mer, montagne, sahara, ville';
COMMENT ON COLUMN listings.capacity IS 'Capacité maximale en nombre de personnes';
COMMENT ON COLUMN listings.beds IS 'Nombre de lits disponibles';
COMMENT ON COLUMN listings.vacation_amenities IS 'Équipements: WiFi, piscine, vue mer, climatisation, etc. (JSON array)';
COMMENT ON COLUMN listings.distance_to_beach IS 'Distance jusqu''à la plage ou point d''intérêt principal';
COMMENT ON COLUMN listings.availability_start IS 'Date de début de disponibilité pour la location';
COMMENT ON COLUMN listings.availability_end IS 'Date de fin de disponibilité pour la location';
COMMENT ON COLUMN listings.available_all_year IS 'Indique si l''hébergement est disponible toute l''année';
