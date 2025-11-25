/*
  # Population complète de toutes les marques et modèles de véhicules
  
  Ajoute toutes les marques populaires et leurs modèles pour le marché algérien
*/

-- Ajouter plus de marques populaires avec gestion des doublons
DO $$
DECLARE
  v_brand_id uuid;
BEGIN
  -- Audi
  INSERT INTO brands (name, name_ar, popular, display_order) 
  VALUES ('Audi', 'أودي', true, 11)
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_brand_id;
  
  IF v_brand_id IS NULL THEN
    SELECT id INTO v_brand_id FROM brands WHERE name = 'Audi';
  END IF;
  
  IF v_brand_id IS NOT NULL THEN
    INSERT INTO models (brand_id, name, name_ar, popular, display_order) VALUES
    (v_brand_id, 'A3', 'أودي أ3', true, 1),
    (v_brand_id, 'A4', 'أودي أ4', true, 2),
    (v_brand_id, 'A6', 'أودي أ6', true, 3),
    (v_brand_id, 'Q3', 'أودي كيو3', true, 4),
    (v_brand_id, 'Q5', 'أودي كيو5', true, 5),
    (v_brand_id, 'Q7', 'أودي كيو7', false, 6)
    ON CONFLICT DO NOTHING;
  END IF;

  -- BMW
  INSERT INTO brands (name, name_ar, popular, display_order) 
  VALUES ('BMW', 'بي إم دبليو', true, 12)
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_brand_id;
  
  IF v_brand_id IS NULL THEN
    SELECT id INTO v_brand_id FROM brands WHERE name = 'BMW';
  END IF;
  
  IF v_brand_id IS NOT NULL THEN
    INSERT INTO models (brand_id, name, name_ar, popular, display_order) VALUES
    (v_brand_id, 'Serie 1', 'سلسلة 1', true, 1),
    (v_brand_id, 'Serie 3', 'سلسلة 3', true, 2),
    (v_brand_id, 'Serie 5', 'سلسلة 5', true, 3),
    (v_brand_id, 'X1', 'إكس1', true, 4),
    (v_brand_id, 'X3', 'إكس3', true, 5),
    (v_brand_id, 'X5', 'إكس5', true, 6)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Mercedes-Benz
  INSERT INTO brands (name, name_ar, popular, display_order) 
  VALUES ('Mercedes-Benz', 'مرسيدس بنز', true, 13)
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_brand_id;
  
  IF v_brand_id IS NULL THEN
    SELECT id INTO v_brand_id FROM brands WHERE name = 'Mercedes-Benz';
  END IF;
  
  IF v_brand_id IS NOT NULL THEN
    INSERT INTO models (brand_id, name, name_ar, popular, display_order) VALUES
    (v_brand_id, 'Classe A', 'الفئة أ', true, 1),
    (v_brand_id, 'Classe C', 'الفئة سي', true, 2),
    (v_brand_id, 'Classe E', 'الفئة إي', true, 3),
    (v_brand_id, 'GLA', 'جي إل أي', true, 4),
    (v_brand_id, 'GLC', 'جي إل سي', true, 5),
    (v_brand_id, 'GLE', 'جي إل إي', true, 6)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Volkswagen
  INSERT INTO brands (name, name_ar, popular, display_order) 
  VALUES ('Volkswagen', 'فولكس واجن', true, 14)
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_brand_id;
  
  IF v_brand_id IS NULL THEN
    SELECT id INTO v_brand_id FROM brands WHERE name = 'Volkswagen';
  END IF;
  
  IF v_brand_id IS NOT NULL THEN
    INSERT INTO models (brand_id, name, name_ar, popular, display_order) VALUES
    (v_brand_id, 'Golf', 'جولف', true, 1),
    (v_brand_id, 'Polo', 'بولو', true, 2),
    (v_brand_id, 'Passat', 'باسات', true, 3),
    (v_brand_id, 'Tiguan', 'تيجوان', true, 4),
    (v_brand_id, 'T-Roc', 'تي روك', true, 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Kia
  INSERT INTO brands (name, name_ar, popular, display_order) 
  VALUES ('Kia', 'كيا', true, 15)
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_brand_id;
  
  IF v_brand_id IS NULL THEN
    SELECT id INTO v_brand_id FROM brands WHERE name = 'Kia';
  END IF;
  
  IF v_brand_id IS NOT NULL THEN
    INSERT INTO models (brand_id, name, name_ar, popular, display_order) VALUES
    (v_brand_id, 'Picanto', 'بيكانتو', true, 1),
    (v_brand_id, 'Rio', 'ريو', true, 2),
    (v_brand_id, 'Cerato', 'سيراتو', true, 3),
    (v_brand_id, 'Sportage', 'سبورتاج', true, 4),
    (v_brand_id, 'Sorento', 'سورنتو', true, 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Chery
  INSERT INTO brands (name, name_ar, popular, display_order) 
  VALUES ('Chery', 'شيري', true, 16)
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_brand_id;
  
  IF v_brand_id IS NULL THEN
    SELECT id INTO v_brand_id FROM brands WHERE name = 'Chery';
  END IF;
  
  IF v_brand_id IS NOT NULL THEN
    INSERT INTO models (brand_id, name, name_ar, popular, display_order) VALUES
    (v_brand_id, 'Tiggo 7', 'تيجو 7', true, 1),
    (v_brand_id, 'Tiggo 8', 'تيجو 8', true, 2),
    (v_brand_id, 'Arrizo 6', 'أريزو 6', true, 3),
    (v_brand_id, 'Tiggo 4', 'تيجو 4', true, 4)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Geely
  INSERT INTO brands (name, name_ar, popular, display_order) 
  VALUES ('Geely', 'جيلي', true, 17)
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_brand_id;
  
  IF v_brand_id IS NULL THEN
    SELECT id INTO v_brand_id FROM brands WHERE name = 'Geely';
  END IF;
  
  IF v_brand_id IS NOT NULL THEN
    INSERT INTO models (brand_id, name, name_ar, popular, display_order) VALUES
    (v_brand_id, 'Emgrand', 'إمجراند', true, 1),
    (v_brand_id, 'Coolray', 'كولراي', true, 2),
    (v_brand_id, 'Azkarra', 'أزكارا', true, 3)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Haval
  INSERT INTO brands (name, name_ar, popular, display_order) 
  VALUES ('Haval', 'هافال', true, 18)
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_brand_id;
  
  IF v_brand_id IS NULL THEN
    SELECT id INTO v_brand_id FROM brands WHERE name = 'Haval';
  END IF;
  
  IF v_brand_id IS NOT NULL THEN
    INSERT INTO models (brand_id, name, name_ar, popular, display_order) VALUES
    (v_brand_id, 'H6', 'إتش6', true, 1),
    (v_brand_id, 'Jolion', 'جوليون', true, 2),
    (v_brand_id, 'H9', 'إتش9', false, 3)
    ON CONFLICT DO NOTHING;
  END IF;

  -- MG
  INSERT INTO brands (name, name_ar, popular, display_order) 
  VALUES ('MG', 'إم جي', true, 19)
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_brand_id;
  
  IF v_brand_id IS NULL THEN
    SELECT id INTO v_brand_id FROM brands WHERE name = 'MG';
  END IF;
  
  IF v_brand_id IS NOT NULL THEN
    INSERT INTO models (brand_id, name, name_ar, popular, display_order) VALUES
    (v_brand_id, 'ZS', 'زد إس', true, 1),
    (v_brand_id, 'HS', 'إتش إس', true, 2),
    (v_brand_id, 'RX5', 'آر إكس 5', true, 3)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Fiat
  INSERT INTO brands (name, name_ar, popular, display_order) 
  VALUES ('Fiat', 'فيات', true, 20)
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_brand_id;
  
  IF v_brand_id IS NULL THEN
    SELECT id INTO v_brand_id FROM brands WHERE name = 'Fiat';
  END IF;
  
  IF v_brand_id IS NOT NULL THEN
    INSERT INTO models (brand_id, name, name_ar, popular, display_order) VALUES
    (v_brand_id, '500', '500', true, 1),
    (v_brand_id, 'Panda', 'باندا', true, 2),
    (v_brand_id, 'Tipo', 'تيبو', true, 3),
    (v_brand_id, 'Doblo', 'دوبلو', false, 4)
    ON CONFLICT DO NOTHING;
  END IF;

END $$;

SELECT 'Marques et modèles ajoutés avec succès' as status;
