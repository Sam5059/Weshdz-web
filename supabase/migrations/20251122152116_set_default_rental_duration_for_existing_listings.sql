/*
  # Définir rental_duration pour les annonces existantes
  
  1. Objectif
    - Ajouter rental_duration aux annonces de location qui n'en ont pas
    - Déterminer la durée appropriée selon le type d'annonce
  
  2. Logique
    - Locations de véhicules → 'jour' (location journalière typique)
    - Locations immobilières résidentielles (appartements, studios) → 'mois' (location mensuelle typique)
    - Locations de vacances → 'semaine' (location hebdomadaire typique)
    - Autres → 'jour' (par défaut)
  
  3. Catégories concernées
    - Véhicules: category_id des sous-catégories de véhicules
    - Immobilier: appartements, studios, maisons pour location longue durée
    - Vacances: locations saisonnières
*/

-- 1. Locations de véhicules → durée journalière
UPDATE listings
SET rental_duration = 'jour'
WHERE listing_type = 'louer'
  AND rental_duration IS NULL
  AND vehicle_type IS NOT NULL;

-- 2. Locations immobilières résidentielles (appartements, studios, maisons) → durée mensuelle
-- Catégorie "Immobilier" et sous-catégories pour location longue durée
UPDATE listings
SET rental_duration = 'mois'
WHERE listing_type = 'louer'
  AND rental_duration IS NULL
  AND property_type IS NOT NULL
  AND category_id IN (
    SELECT id FROM categories 
    WHERE slug LIKE '%appartement%' 
       OR slug LIKE '%studio%' 
       OR slug LIKE '%maison%'
       OR slug LIKE '%villa%'
  );

-- 3. Locations de vacances → durée hebdomadaire
-- Catégorie "Location vacances"
UPDATE listings
SET rental_duration = 'semaine'
WHERE listing_type = 'louer'
  AND rental_duration IS NULL
  AND category_id IN (
    SELECT id FROM categories 
    WHERE slug LIKE '%vacances%' 
       OR slug LIKE '%saisonnier%'
  );

-- 4. Fallback: toutes les autres locations → journalière par défaut
UPDATE listings
SET rental_duration = 'jour'
WHERE listing_type = 'louer'
  AND rental_duration IS NULL;

-- 5. Copier le price dans le champ de tarif correspondant si les champs de tarifs sont vides
UPDATE listings
SET daily_rate = price
WHERE listing_type = 'louer'
  AND rental_duration = 'jour'
  AND daily_rate IS NULL
  AND price IS NOT NULL;

UPDATE listings
SET weekly_rate = price
WHERE listing_type = 'louer'
  AND rental_duration = 'semaine'
  AND weekly_rate IS NULL
  AND price IS NOT NULL;

UPDATE listings
SET monthly_rate = price
WHERE listing_type = 'louer'
  AND rental_duration = 'mois'
  AND monthly_rate IS NULL
  AND price IS NOT NULL;
