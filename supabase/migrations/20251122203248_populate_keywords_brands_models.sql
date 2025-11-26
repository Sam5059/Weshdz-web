/*
  # Peuplement des mots-clés pour marques et modèles

  1. Marques de véhicules
    - Ajoute le nom de chaque marque comme mot-clé
    - Ajoute variantes et abréviations communes

  2. Modèles de véhicules
    - Ajoute le nom de chaque modèle comme mot-clé
    - Ajoute variantes populaires (ex: "Clio 4", "Golf 7")

  Cette migration automatise l'ajout de mots-clés pour toutes les marques
  et modèles existants dans la base de données.
*/

-- Ajouter mots-clés pour toutes les marques
INSERT INTO keywords (keyword, entity_type, entity_id, language, weight)
SELECT 
  LOWER(name) as keyword,
  'brand' as entity_type,
  id as entity_id,
  'fr' as language,
  10 as weight
FROM vehicle_brands
ON CONFLICT DO NOTHING;

-- Ajouter mots-clés pour tous les modèles
INSERT INTO keywords (keyword, entity_type, entity_id, language, weight)
SELECT 
  LOWER(name) as keyword,
  'model' as entity_type,
  id as entity_id,
  'fr' as language,
  10 as weight
FROM vehicle_models
ON CONFLICT DO NOTHING;

-- Ajouter variantes communes pour marques populaires
INSERT INTO keywords (keyword, entity_type, entity_id, language, weight)
SELECT LOWER(variant), 'brand', vb.id, 'fr', 9
FROM vehicle_brands vb
CROSS JOIN LATERAL (
  VALUES 
    (CASE WHEN vb.name = 'BMW' THEN 'bm' END),
    (CASE WHEN vb.name = 'Mercedes' THEN 'merc' END),
    (CASE WHEN vb.name = 'Mercedes' THEN 'benz' END),
    (CASE WHEN vb.name = 'Volkswagen' THEN 'vw' END),
    (CASE WHEN vb.name = 'Peugeot' THEN 'peugeot' END),
    (CASE WHEN vb.name = 'Renault' THEN 'reno' END)
) AS variants(variant)
WHERE variant IS NOT NULL
ON CONFLICT DO NOTHING;

-- Ajouter mots-clés pour modèles populaires avec variantes
DO $$
DECLARE
  brand_renault uuid;
  brand_peugeot uuid;
  brand_citroen uuid;
  brand_vw uuid;
  brand_bmw uuid;
  model_id uuid;
BEGIN
  -- Récupérer IDs marques
  SELECT id INTO brand_renault FROM vehicle_brands WHERE name = 'Renault';
  SELECT id INTO brand_peugeot FROM vehicle_brands WHERE name = 'Peugeot';
  SELECT id INTO brand_citroen FROM vehicle_brands WHERE name = 'Citroën';
  SELECT id INTO brand_vw FROM vehicle_brands WHERE name = 'Volkswagen';
  SELECT id INTO brand_bmw FROM vehicle_brands WHERE name = 'BMW';

  -- Renault Clio variantes
  IF brand_renault IS NOT NULL THEN
    SELECT id INTO model_id FROM vehicle_models WHERE brand_id = brand_renault AND name = 'Clio';
    IF model_id IS NOT NULL THEN
      INSERT INTO keywords (keyword, entity_type, entity_id, language, weight) VALUES
        ('clio 3', 'model', model_id, 'fr', 9),
        ('clio 4', 'model', model_id, 'fr', 9),
        ('clio 5', 'model', model_id, 'fr', 9)
      ON CONFLICT DO NOTHING;
    END IF;

    -- Renault Mégane variantes
    SELECT id INTO model_id FROM vehicle_models WHERE brand_id = brand_renault AND name = 'Megane';
    IF model_id IS NOT NULL THEN
      INSERT INTO keywords (keyword, entity_type, entity_id, language, weight) VALUES
        ('megane 3', 'model', model_id, 'fr', 9),
        ('megane 4', 'model', model_id, 'fr', 9)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  -- Peugeot 208 variantes
  IF brand_peugeot IS NOT NULL THEN
    SELECT id INTO model_id FROM vehicle_models WHERE brand_id = brand_peugeot AND name = '208';
    IF model_id IS NOT NULL THEN
      INSERT INTO keywords (keyword, entity_type, entity_id, language, weight) VALUES
        ('208 ii', 'model', model_id, 'fr', 9),
        ('208 2', 'model', model_id, 'fr', 9)
      ON CONFLICT DO NOTHING;
    END IF;

    -- Peugeot 308 variantes
    SELECT id INTO model_id FROM vehicle_models WHERE brand_id = brand_peugeot AND name = '308';
    IF model_id IS NOT NULL THEN
      INSERT INTO keywords (keyword, entity_type, entity_id, language, weight) VALUES
        ('308 ii', 'model', model_id, 'fr', 9),
        ('308 2', 'model', model_id, 'fr', 9)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  -- VW Golf variantes
  IF brand_vw IS NOT NULL THEN
    SELECT id INTO model_id FROM vehicle_models WHERE brand_id = brand_vw AND name = 'Golf';
    IF model_id IS NOT NULL THEN
      INSERT INTO keywords (keyword, entity_type, entity_id, language, weight) VALUES
        ('golf 5', 'model', model_id, 'fr', 9),
        ('golf 6', 'model', model_id, 'fr', 9),
        ('golf 7', 'model', model_id, 'fr', 9),
        ('golf 8', 'model', model_id, 'fr', 9)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  -- BMW Series variantes
  IF brand_bmw IS NOT NULL THEN
    SELECT id INTO model_id FROM vehicle_models WHERE brand_id = brand_bmw AND name = '3 Series';
    IF model_id IS NOT NULL THEN
      INSERT INTO keywords (keyword, entity_type, entity_id, language, weight) VALUES
        ('serie 3', 'model', model_id, 'fr', 9),
        ('serie3', 'model', model_id, 'fr', 9),
        ('320', 'model', model_id, 'fr', 8),
        ('330', 'model', model_id, 'fr', 8)
      ON CONFLICT DO NOTHING;
    END IF;

    SELECT id INTO model_id FROM vehicle_models WHERE brand_id = brand_bmw AND name = '5 Series';
    IF model_id IS NOT NULL THEN
      INSERT INTO keywords (keyword, entity_type, entity_id, language, weight) VALUES
        ('serie 5', 'model', model_id, 'fr', 9),
        ('serie5', 'model', model_id, 'fr', 9),
        ('520', 'model', model_id, 'fr', 8),
        ('530', 'model', model_id, 'fr', 8)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
END $$;
