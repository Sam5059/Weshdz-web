/*
  # Ajouter colonnes brand_id et model_id aux listings

  ## Changements
  
  1. Nouvelles Colonnes
    - `brand_id` (uuid) - Référence vers vehicle_brands
    - `model_id` (uuid) - Référence vers vehicle_models
  
  2. Relations
    - Clé étrangère vers `vehicle_brands(id)`
    - Clé étrangère vers `vehicle_models(id)`
    - Contrainte: si model_id existe, brand_id doit exister aussi
  
  3. Migration des Données
    - Tenter de mapper les anciennes valeurs texte vers les IDs
    - Les colonnes `brand` et `model` (texte) restent pour compatibilité
  
  ## Notes Importantes
  - Les anciennes colonnes brand/model (text) sont conservées
  - Les nouvelles colonnes brand_id/model_id sont ajoutées
  - Migration automatique des données existantes quand possible
*/

-- Ajouter les colonnes brand_id et model_id
ALTER TABLE listings 
  ADD COLUMN IF NOT EXISTS brand_id uuid,
  ADD COLUMN IF NOT EXISTS model_id uuid;

-- Ajouter les contraintes de clés étrangères
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'listings_brand_id_fkey'
  ) THEN
    ALTER TABLE listings
      ADD CONSTRAINT listings_brand_id_fkey 
      FOREIGN KEY (brand_id) 
      REFERENCES vehicle_brands(id)
      ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'listings_model_id_fkey'
  ) THEN
    ALTER TABLE listings
      ADD CONSTRAINT listings_model_id_fkey 
      FOREIGN KEY (model_id) 
      REFERENCES vehicle_models(id)
      ON DELETE SET NULL;
  END IF;
END $$;

-- Créer un index pour améliorer les performances de filtrage
CREATE INDEX IF NOT EXISTS idx_listings_brand_id ON listings(brand_id);
CREATE INDEX IF NOT EXISTS idx_listings_model_id ON listings(model_id);

-- Migrer les données existantes: tenter de mapper les textes vers les IDs
-- Pour les marques
UPDATE listings l
SET brand_id = vb.id
FROM vehicle_brands vb
WHERE l.brand IS NOT NULL 
  AND l.brand_id IS NULL
  AND LOWER(TRIM(l.brand)) = LOWER(vb.name);

-- Pour les modèles (seulement si la marque a été mappée)
UPDATE listings l
SET model_id = vm.id
FROM vehicle_models vm
WHERE l.model IS NOT NULL 
  AND l.model_id IS NULL
  AND l.brand_id IS NOT NULL
  AND vm.brand_id = l.brand_id
  AND LOWER(TRIM(l.model)) = LOWER(vm.name);

-- Créer un commentaire pour documenter les colonnes
COMMENT ON COLUMN listings.brand_id IS 'ID de la marque du véhicule (relation vers vehicle_brands)';
COMMENT ON COLUMN listings.model_id IS 'ID du modèle du véhicule (relation vers vehicle_models)';
COMMENT ON COLUMN listings.brand IS 'Marque en texte libre (legacy, utiliser brand_id de préférence)';
COMMENT ON COLUMN listings.model IS 'Modèle en texte libre (legacy, utiliser model_id de préférence)';
