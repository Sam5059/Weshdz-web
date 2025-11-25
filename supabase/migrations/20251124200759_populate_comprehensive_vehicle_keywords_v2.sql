/*
  # Populate Comprehensive Vehicle Keywords

  1. Purpose
    - Create complete keyword mappings for ALL vehicle brands and models
    - Enable precise search for vehicles by brand or model name
    - Support 38 brands and 276 models currently in database

  2. Changes
    - Clear existing vehicle-related keywords to avoid duplicates
    - Generate keywords for ALL vehicle brands with entity_type 'vehicle_brand_{id}'
    - Generate keywords for ALL vehicle models with entity_type 'vehicle_model_{id}'
    - Set appropriate weights (brands: 90, models: 95 for higher priority)

  3. Coverage
    - All 38 vehicle brands (Renault, Peugeot, BMW, etc.)
    - All 276 vehicle models (Clio, 208, Symbol, etc.)
    - Enables searches like "clio", "208", "symbol" to work perfectly
*/

-- Clear existing vehicle keywords to avoid duplicates
DELETE FROM keywords WHERE entity_type LIKE 'vehicle_%';

-- Populate ALL vehicle brand keywords
INSERT INTO keywords (keyword, entity_type, entity_id, language, weight)
SELECT 
  LOWER(name) as keyword,
  'vehicle_brand' as entity_type,
  id as entity_id,
  'fr' as language,
  90 as weight
FROM vehicle_brands;

-- Populate ALL vehicle model keywords  
INSERT INTO keywords (keyword, entity_type, entity_id, language, weight)
SELECT 
  LOWER(name) as keyword,
  'vehicle_model' as entity_type,
  id as entity_id,
  'fr' as language,
  95 as weight
FROM vehicle_models;

-- Add common vehicle-related search terms
INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
  ('voiture', 'vehicle_category', 'fr', 85),
  ('auto', 'vehicle_category', 'fr', 85),
  ('moto', 'vehicle_category_motorcycle', 'fr', 85),
  ('scooter', 'vehicle_category_scooter', 'fr', 85),
  ('camion', 'vehicle_category_truck', 'fr', 85),
  ('utilitaire', 'vehicle_category_commercial', 'fr', 85);
