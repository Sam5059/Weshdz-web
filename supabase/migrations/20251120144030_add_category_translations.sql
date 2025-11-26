/*
  # Ajouter les traductions pour les catégories

  1. Modifications
    - Ajouter les colonnes `name_fr`, `name_ar`, `name_en` à la table `categories`
    - Mettre à jour les catégories existantes avec les traductions
    - Définir `name_fr` comme valeur par défaut pour les nouvelles catégories

  2. Notes
    - `name_fr` : Nom en français
    - `name_ar` : Nom en arabe
    - `name_en` : Nom en anglais
    - La colonne `name` existante reste pour la compatibilité
*/

-- Ajouter les colonnes de traduction si elles n'existent pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'categories' AND column_name = 'name_fr'
  ) THEN
    ALTER TABLE categories ADD COLUMN name_fr text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'categories' AND column_name = 'name_ar'
  ) THEN
    ALTER TABLE categories ADD COLUMN name_ar text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'categories' AND column_name = 'name_en'
  ) THEN
    ALTER TABLE categories ADD COLUMN name_en text;
  END IF;
END $$;

-- Mettre à jour les catégories existantes avec les traductions
-- Véhicules
UPDATE categories SET 
  name_fr = 'Véhicules',
  name_ar = 'مركبات',
  name_en = 'Vehicles'
WHERE name = 'Véhicules' AND parent_id IS NULL;

-- Électronique
UPDATE categories SET 
  name_fr = 'Électronique',
  name_ar = 'إلكترونيات',
  name_en = 'Electronics'
WHERE name = 'Électronique' AND parent_id IS NULL;

-- Immobilier
UPDATE categories SET 
  name_fr = 'Immobilier',
  name_ar = 'عقارات',
  name_en = 'Real Estate'
WHERE name = 'Immobilier' AND parent_id IS NULL;

-- Mode
UPDATE categories SET 
  name_fr = 'Mode',
  name_ar = 'موضة',
  name_en = 'Fashion'
WHERE name = 'Mode' AND parent_id IS NULL;

-- Maison
UPDATE categories SET 
  name_fr = 'Maison',
  name_ar = 'منزل',
  name_en = 'Home'
WHERE name = 'Maison' AND parent_id IS NULL;

-- Services
UPDATE categories SET 
  name_fr = 'Services',
  name_ar = 'خدمات',
  name_en = 'Services'
WHERE name = 'Services' AND parent_id IS NULL;

-- Emploi
UPDATE categories SET 
  name_fr = 'Emploi',
  name_ar = 'وظائف',
  name_en = 'Jobs'
WHERE name = 'Emploi' AND parent_id IS NULL;

-- Loisirs
UPDATE categories SET 
  name_fr = 'Loisirs',
  name_ar = 'ترفيه',
  name_en = 'Leisure'
WHERE name = 'Loisirs' AND parent_id IS NULL;

-- Location Immobilière
UPDATE categories SET 
  name_fr = 'Location Immobilière',
  name_ar = 'تأجير العقارات',
  name_en = 'Property Rental'
WHERE name = 'Location Immobilière' AND parent_id IS NULL;

-- Sous-catégories pour Véhicules
UPDATE categories SET 
  name_fr = 'Voitures',
  name_ar = 'سيارات',
  name_en = 'Cars'
WHERE name = 'Voitures' AND parent_id IS NOT NULL;

UPDATE categories SET 
  name_fr = 'Motos',
  name_ar = 'دراجات نارية',
  name_en = 'Motorcycles'
WHERE name = 'Motos' AND parent_id IS NOT NULL;

UPDATE categories SET 
  name_fr = 'Pièces auto',
  name_ar = 'قطع غيار السيارات',
  name_en = 'Car Parts'
WHERE name = 'Pièces auto' AND parent_id IS NOT NULL;

-- Sous-catégories pour Électronique
UPDATE categories SET 
  name_fr = 'Téléphones',
  name_ar = 'هواتف',
  name_en = 'Phones'
WHERE name = 'Téléphones' AND parent_id IS NOT NULL;

UPDATE categories SET 
  name_fr = 'Ordinateurs',
  name_ar = 'حواسيب',
  name_en = 'Computers'
WHERE name = 'Ordinateurs' AND parent_id IS NOT NULL;

UPDATE categories SET 
  name_fr = 'Tablettes',
  name_ar = 'أجهزة لوحية',
  name_en = 'Tablets'
WHERE name = 'Tablettes' AND parent_id IS NOT NULL;

-- Sous-catégories pour Immobilier
UPDATE categories SET 
  name_fr = 'Appartements',
  name_ar = 'شقق',
  name_en = 'Apartments'
WHERE name = 'Appartements' AND parent_id IS NOT NULL;

UPDATE categories SET 
  name_fr = 'Maisons',
  name_ar = 'منازل',
  name_en = 'Houses'
WHERE name = 'Maisons' AND parent_id IS NOT NULL;

UPDATE categories SET 
  name_fr = 'Terrains',
  name_ar = 'أراضي',
  name_en = 'Land'
WHERE name = 'Terrains' AND parent_id IS NOT NULL;

-- Sous-catégories pour Mode
UPDATE categories SET 
  name_fr = 'Vêtements Homme',
  name_ar = 'ملابس رجالية',
  name_en = 'Men''s Clothing'
WHERE name = 'Vêtements Homme' AND parent_id IS NOT NULL;

UPDATE categories SET 
  name_fr = 'Vêtements Femme',
  name_ar = 'ملابس نسائية',
  name_en = 'Women''s Clothing'
WHERE name = 'Vêtements Femme' AND parent_id IS NOT NULL;

UPDATE categories SET 
  name_fr = 'Accessoires',
  name_ar = 'إكسسوارات',
  name_en = 'Accessories'
WHERE name = 'Accessoires' AND parent_id IS NOT NULL;
