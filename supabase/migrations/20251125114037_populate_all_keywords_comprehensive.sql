/*
  # Populate Keywords Table - Complete

  ## Purpose
  Populate keywords for all entities to enable smart search functionality
  
  ## Keywords Added
  1. Categories keywords (main categories)
  2. Subcategories keywords
  3. Brands keywords (vehicle brands)
  4. Models keywords (vehicle models)
  5. Common search terms
*/

-- Insert category keywords
INSERT INTO keywords (keyword, entity_type, entity_id, language, weight)
SELECT 
  LOWER(name_fr) as keyword,
  'category' as entity_type,
  id as entity_id,
  'fr' as language,
  10 as weight
FROM categories
WHERE parent_id IS NULL AND name_fr IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO keywords (keyword, entity_type, entity_id, language, weight)
SELECT 
  LOWER(name_ar) as keyword,
  'category' as entity_type,
  id as entity_id,
  'ar' as language,
  10 as weight
FROM categories
WHERE parent_id IS NULL AND name_ar IS NOT NULL
ON CONFLICT DO NOTHING;

-- Insert subcategory keywords
INSERT INTO keywords (keyword, entity_type, entity_id, language, weight)
SELECT 
  LOWER(name_fr) as keyword,
  'subcategory' as entity_type,
  id as entity_id,
  'fr' as language,
  9 as weight
FROM subcategories
WHERE name_fr IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO keywords (keyword, entity_type, entity_id, language, weight)
SELECT 
  LOWER(name_ar) as keyword,
  'subcategory' as entity_type,
  id as entity_id,
  'ar' as language,
  9 as weight
FROM subcategories
WHERE name_ar IS NOT NULL
ON CONFLICT DO NOTHING;

-- Insert brand keywords
INSERT INTO keywords (keyword, entity_type, entity_id, language, weight)
SELECT 
  LOWER(name) as keyword,
  'brand' as entity_type,
  id as entity_id,
  'fr' as language,
  8 as weight
FROM brands
WHERE name IS NOT NULL
ON CONFLICT DO NOTHING;

-- Insert model keywords
INSERT INTO keywords (keyword, entity_type, entity_id, language, weight)
SELECT 
  LOWER(name) as keyword,
  'model' as entity_type,
  id as entity_id,
  'fr' as language,
  7 as weight
FROM models
WHERE name IS NOT NULL
ON CONFLICT DO NOTHING;

-- Insert common vehicle keywords
INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
('voiture', 'common', 'fr', 8),
('auto', 'common', 'fr', 8),
('automobile', 'common', 'fr', 8),
('véhicule', 'common', 'fr', 8),
('moto', 'common', 'fr', 8),
('camion', 'common', 'fr', 7),
('diesel', 'common', 'fr', 6),
('essence', 'common', 'fr', 6),
('automatique', 'common', 'fr', 6),
('manuelle', 'common', 'fr', 6),
('neuf', 'common', 'fr', 6),
('occasion', 'common', 'fr', 6),
('سيارة', 'common', 'ar', 8),
('دراجة', 'common', 'ar', 8),
('شاحنة', 'common', 'ar', 7),
('جديد', 'common', 'ar', 6),
('مستعمل', 'common', 'ar', 6)
ON CONFLICT DO NOTHING;

-- Insert common real estate keywords
INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
('maison', 'common', 'fr', 8),
('appartement', 'common', 'fr', 8),
('villa', 'common', 'fr', 8),
('studio', 'common', 'fr', 7),
('terrain', 'common', 'fr', 8),
('local', 'common', 'fr', 7),
('duplex', 'common', 'fr', 7),
('vente', 'common', 'fr', 7),
('location', 'common', 'fr', 7),
('louer', 'common', 'fr', 7),
('acheter', 'common', 'fr', 7),
('منزل', 'common', 'ar', 8),
('شقة', 'common', 'ar', 8),
('فيلا', 'common', 'ar', 8),
('أرض', 'common', 'ar', 8),
('محل', 'common', 'ar', 7),
('للبيع', 'common', 'ar', 7),
('للإيجار', 'common', 'ar', 7)
ON CONFLICT DO NOTHING;

-- Insert common electronics keywords
INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
('téléphone', 'common', 'fr', 8),
('mobile', 'common', 'fr', 8),
('ordinateur', 'common', 'fr', 8),
('laptop', 'common', 'fr', 8),
('tablette', 'common', 'fr', 8),
('tv', 'common', 'fr', 8),
('télévision', 'common', 'fr', 8),
('console', 'common', 'fr', 7),
('playstation', 'common', 'fr', 7),
('xbox', 'common', 'fr', 7),
('هاتف', 'common', 'ar', 8),
('جوال', 'common', 'ar', 8),
('كمبيوتر', 'common', 'ar', 8),
('لابتوب', 'common', 'ar', 8),
('تلفزيون', 'common', 'ar', 8)
ON CONFLICT DO NOTHING;

-- Insert common fashion keywords
INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
('vêtements', 'common', 'fr', 7),
('chaussures', 'common', 'fr', 7),
('sac', 'common', 'fr', 7),
('robe', 'common', 'fr', 7),
('chemise', 'common', 'fr', 7),
('pantalon', 'common', 'fr', 7),
('jeans', 'common', 'fr', 7),
('montre', 'common', 'fr', 7),
('parfum', 'common', 'fr', 7),
('ملابس', 'common', 'ar', 7),
('أحذية', 'common', 'ar', 7),
('حقيبة', 'common', 'ar', 7)
ON CONFLICT DO NOTHING;

-- Insert common employment keywords
INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
('emploi', 'common', 'fr', 8),
('travail', 'common', 'fr', 8),
('job', 'common', 'fr', 8),
('recrutement', 'common', 'fr', 7),
('stage', 'common', 'fr', 7),
('freelance', 'common', 'fr', 7),
('cdi', 'common', 'fr', 7),
('cdd', 'common', 'fr', 7),
('عمل', 'common', 'ar', 8),
('وظيفة', 'common', 'ar', 8),
('توظيف', 'common', 'ar', 7)
ON CONFLICT DO NOTHING;

-- Insert common services keywords
INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
('service', 'common', 'fr', 7),
('réparation', 'common', 'fr', 7),
('maintenance', 'common', 'fr', 7),
('plombier', 'common', 'fr', 7),
('électricien', 'common', 'fr', 7),
('menuisier', 'common', 'fr', 7),
('peintre', 'common', 'fr', 7),
('خدمة', 'common', 'ar', 7),
('صيانة', 'common', 'ar', 7),
('إصلاح', 'common', 'ar', 7)
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_keywords_keyword ON keywords(keyword);
CREATE INDEX IF NOT EXISTS idx_keywords_entity_type ON keywords(entity_type);
CREATE INDEX IF NOT EXISTS idx_keywords_language ON keywords(language);
CREATE INDEX IF NOT EXISTS idx_keywords_weight ON keywords(weight DESC);
CREATE INDEX IF NOT EXISTS idx_keywords_keyword_lower ON keywords(LOWER(keyword));
