/*
  # Ajouter l'ordre d'affichage aux catégories

  1. Modifications
    - Ajouter la colonne `display_order` à la table `categories`
    - Réorganiser les catégories selon la popularité
    - Ordre: Stores PRO → Véhicules → Immobilier → Électronique → Mode → Maison → Services → Emploi → Loisirs → Location Immobilière

  2. Ordre d'affichage
    - 1: Stores PRO
    - 10: Véhicules
    - 20: Immobilier  
    - 30: Électronique
    - 40: Mode
    - 50: Maison
    - 60: Services
    - 70: Emploi
    - 80: Loisirs
    - 90: Location Immobilière
*/

-- Ajouter la colonne display_order si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'categories' AND column_name = 'display_order'
  ) THEN
    ALTER TABLE categories ADD COLUMN display_order integer DEFAULT 999;
  END IF;
END $$;

-- Mettre à jour l'ordre d'affichage des catégories principales
-- Véhicules
UPDATE categories 
SET display_order = 10
WHERE name = 'Véhicules' AND parent_id IS NULL;

-- Immobilier
UPDATE categories 
SET display_order = 20
WHERE name = 'Immobilier' AND parent_id IS NULL;

-- Électronique
UPDATE categories 
SET display_order = 30
WHERE name = 'Électronique' AND parent_id IS NULL;

-- Mode
UPDATE categories 
SET display_order = 40
WHERE name = 'Mode' AND parent_id IS NULL;

-- Maison
UPDATE categories 
SET display_order = 50
WHERE name = 'Maison' AND parent_id IS NULL;

-- Services
UPDATE categories 
SET display_order = 60
WHERE name = 'Services' AND parent_id IS NULL;

-- Emploi
UPDATE categories 
SET display_order = 70
WHERE name = 'Emploi' AND parent_id IS NULL;

-- Loisirs
UPDATE categories 
SET display_order = 80
WHERE name = 'Loisirs' AND parent_id IS NULL;

-- Location Immobilière
UPDATE categories 
SET display_order = 90
WHERE name = 'Location Immobilière' AND parent_id IS NULL;

-- Créer un index pour l'ordre d'affichage
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order);
