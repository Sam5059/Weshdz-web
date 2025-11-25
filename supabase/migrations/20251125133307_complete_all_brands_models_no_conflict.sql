/*
  # Compléter toutes les marques et modèles
  
  Ajoute TOUTES les marques et modèles manquants sans doublons
*/

-- Supprimer les doublons de marques
DELETE FROM brands a USING brands b
WHERE a.id < b.id 
AND a.name = b.name;

-- Ajouter les marques manquantes
DO $$
BEGIN
  -- Chevrolet
  IF NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Chevrolet') THEN
    INSERT INTO brands (name, name_ar, popular, display_order) 
    VALUES ('Chevrolet', 'شيفروليه', false, 21);
  END IF;

  -- Jeep
  IF NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Jeep') THEN
    INSERT INTO brands (name, name_ar, popular, display_order) 
    VALUES ('Jeep', 'جيب', false, 22);
  END IF;

  -- Land Rover
  IF NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Land Rover') THEN
    INSERT INTO brands (name, name_ar, popular, display_order) 
    VALUES ('Land Rover', 'لاند روفر', false, 23);
  END IF;

  -- Porsche
  IF NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Porsche') THEN
    INSERT INTO brands (name, name_ar, popular, display_order) 
    VALUES ('Porsche', 'بورش', false, 24);
  END IF;

  -- Volvo
  IF NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Volvo') THEN
    INSERT INTO brands (name, name_ar, popular, display_order) 
    VALUES ('Volvo', 'فولفو', false, 25);
  END IF;

  -- Lexus
  IF NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Lexus') THEN
    INSERT INTO brands (name, name_ar, popular, display_order) 
    VALUES ('Lexus', 'لكزس', false, 26);
  END IF;

  -- Alfa Romeo
  IF NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Alfa Romeo') THEN
    INSERT INTO brands (name, name_ar, popular, display_order) 
    VALUES ('Alfa Romeo', 'ألفا روميو', false, 27);
  END IF;

  -- Mini
  IF NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Mini') THEN
    INSERT INTO brands (name, name_ar, popular, display_order) 
    VALUES ('Mini', 'ميني', false, 28);
  END IF;

  -- Smart
  IF NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Smart') THEN
    INSERT INTO brands (name, name_ar, popular, display_order) 
    VALUES ('Smart', 'سمارت', false, 29);
  END IF;

  -- Subaru
  IF NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Subaru') THEN
    INSERT INTO brands (name, name_ar, popular, display_order) 
    VALUES ('Subaru', 'سوبارو', false, 30);
  END IF;

  -- Isuzu
  IF NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Isuzu') THEN
    INSERT INTO brands (name, name_ar, popular, display_order) 
    VALUES ('Isuzu', 'إيسوزو', false, 31);
  END IF;

  -- Lada
  IF NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Lada') THEN
    INSERT INTO brands (name, name_ar, popular, display_order) 
    VALUES ('Lada', 'لادا', true, 32);
  END IF;

  -- Great Wall
  IF NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Great Wall') THEN
    INSERT INTO brands (name, name_ar, popular, display_order) 
    VALUES ('Great Wall', 'جريت وول', true, 33);
  END IF;

  -- BYD
  IF NOT EXISTS (SELECT 1 FROM brands WHERE name = 'BYD') THEN
    INSERT INTO brands (name, name_ar, popular, display_order) 
    VALUES ('BYD', 'بي واي دي', true, 34);
  END IF;

  -- Dfsk
  IF NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Dfsk') THEN
    INSERT INTO brands (name, name_ar, popular, display_order) 
    VALUES ('Dfsk', 'دي إف إس كي', true, 35);
  END IF;

  -- Mahindra
  IF NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Mahindra') THEN
    INSERT INTO brands (name, name_ar, popular, display_order) 
    VALUES ('Mahindra', 'ماهيندرا', false, 36);
  END IF;

  -- SsangYong
  IF NOT EXISTS (SELECT 1 FROM brands WHERE name = 'SsangYong') THEN
    INSERT INTO brands (name, name_ar, popular, display_order) 
    VALUES ('SsangYong', 'سانج يونج', false, 37);
  END IF;

  -- JAC
  IF NOT EXISTS (SELECT 1 FROM brands WHERE name = 'JAC') THEN
    INSERT INTO brands (name, name_ar, popular, display_order) 
    VALUES ('JAC', 'جاك', true, 38);
  END IF;

  -- Brilliance
  IF NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Brilliance') THEN
    INSERT INTO brands (name, name_ar, popular, display_order) 
    VALUES ('Brilliance', 'بريليانس', false, 39);
  END IF;

  -- Lifan
  IF NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Lifan') THEN
    INSERT INTO brands (name, name_ar, popular, display_order) 
    VALUES ('Lifan', 'ليفان', false, 40);
  END IF;

END $$;

-- Ajouter les modèles pour toutes les marques
DO $$
DECLARE
  v_brand_id uuid;
BEGIN
  
  -- Renault
  SELECT id INTO v_brand_id FROM brands WHERE name = 'Renault' LIMIT 1;
  IF v_brand_id IS NOT NULL THEN
    INSERT INTO models (brand_id, name, name_ar, popular, display_order)
    SELECT v_brand_id, m.name, m.name_ar, m.popular, m.display_order
    FROM (VALUES
      ('Megane', 'ميجان', true, 3),
      ('Captur', 'كابتور', true, 4),
      ('Duster', 'داستر', true, 5),
      ('Kangoo', 'كانجو', false, 6),
      ('Talisman', 'تاليسمان', false, 7)
    ) AS m(name, name_ar, popular, display_order)
    WHERE NOT EXISTS (
      SELECT 1 FROM models 
      WHERE brand_id = v_brand_id AND models.name = m.name
    );
  END IF;

  -- Peugeot
  SELECT id INTO v_brand_id FROM brands WHERE name = 'Peugeot' LIMIT 1;
  IF v_brand_id IS NOT NULL THEN
    INSERT INTO models (brand_id, name, name_ar, popular, display_order)
    SELECT v_brand_id, m.name, m.name_ar, m.popular, m.display_order
    FROM (VALUES
      ('208', '208', true, 3),
      ('2008', '2008', true, 4),
      ('3008', '3008', true, 5),
      ('5008', '5008', false, 6),
      ('508', '508', false, 7),
      ('Partner', 'بارتنر', false, 8)
    ) AS m(name, name_ar, popular, display_order)
    WHERE NOT EXISTS (
      SELECT 1 FROM models 
      WHERE brand_id = v_brand_id AND models.name = m.name
    );
  END IF;

  -- Toyota
  SELECT id INTO v_brand_id FROM brands WHERE name = 'Toyota' LIMIT 1;
  IF v_brand_id IS NOT NULL THEN
    INSERT INTO models (brand_id, name, name_ar, popular, display_order)
    SELECT v_brand_id, m.name, m.name_ar, m.popular, m.display_order
    FROM (VALUES
      ('Yaris', 'ياريس', true, 3),
      ('Corolla', 'كورولا', true, 4),
      ('RAV4', 'راف4', true, 5),
      ('Land Cruiser', 'لاند كروزر', true, 6),
      ('Camry', 'كامري', false, 7),
      ('Prado', 'برادو', false, 8)
    ) AS m(name, name_ar, popular, display_order)
    WHERE NOT EXISTS (
      SELECT 1 FROM models 
      WHERE brand_id = v_brand_id AND models.name = m.name
    );
  END IF;

  -- Hyundai
  SELECT id INTO v_brand_id FROM brands WHERE name = 'Hyundai' LIMIT 1;
  IF v_brand_id IS NOT NULL THEN
    INSERT INTO models (brand_id, name, name_ar, popular, display_order)
    SELECT v_brand_id, m.name, m.name_ar, m.popular, m.display_order
    FROM (VALUES
      ('i10', 'أي10', true, 3),
      ('i20', 'أي20', true, 4),
      ('Elantra', 'إلنترا', true, 5),
      ('Tucson', 'توسان', true, 6),
      ('Santa Fe', 'سانتا في', false, 7),
      ('Kona', 'كونا', false, 8),
      ('Creta', 'كريتا', true, 9)
    ) AS m(name, name_ar, popular, display_order)
    WHERE NOT EXISTS (
      SELECT 1 FROM models 
      WHERE brand_id = v_brand_id AND models.name = m.name
    );
  END IF;

  -- Nissan
  SELECT id INTO v_brand_id FROM brands WHERE name = 'Nissan' LIMIT 1;
  IF v_brand_id IS NOT NULL THEN
    INSERT INTO models (brand_id, name, name_ar, popular, display_order)
    SELECT v_brand_id, m.name, m.name_ar, m.popular, m.display_order
    FROM (VALUES
      ('Micra', 'ميكرا', true, 1),
      ('Sunny', 'صني', true, 2),
      ('Qashqai', 'كاشكاي', true, 3),
      ('X-Trail', 'إكس تريل', true, 4),
      ('Patrol', 'باترول', false, 5),
      ('Juke', 'جوك', false, 6),
      ('Navara', 'نافارا', false, 7)
    ) AS m(name, name_ar, popular, display_order)
    WHERE NOT EXISTS (
      SELECT 1 FROM models 
      WHERE brand_id = v_brand_id AND models.name = m.name
    );
  END IF;

  -- Ford
  SELECT id INTO v_brand_id FROM brands WHERE name = 'Ford' LIMIT 1;
  IF v_brand_id IS NOT NULL THEN
    INSERT INTO models (brand_id, name, name_ar, popular, display_order)
    SELECT v_brand_id, m.name, m.name_ar, m.popular, m.display_order
    FROM (VALUES
      ('Fiesta', 'فييستا', true, 1),
      ('Focus', 'فوكس', true, 2),
      ('Fusion', 'فيوجن', false, 3),
      ('Ranger', 'رينجر', false, 4),
      ('Kuga', 'كوجا', false, 5),
      ('Mustang', 'موستانج', false, 6)
    ) AS m(name, name_ar, popular, display_order)
    WHERE NOT EXISTS (
      SELECT 1 FROM models 
      WHERE brand_id = v_brand_id AND models.name = m.name
    );
  END IF;

  -- Dacia
  SELECT id INTO v_brand_id FROM brands WHERE name = 'Dacia' LIMIT 1;
  IF v_brand_id IS NOT NULL THEN
    INSERT INTO models (brand_id, name, name_ar, popular, display_order)
    SELECT v_brand_id, m.name, m.name_ar, m.popular, m.display_order
    FROM (VALUES
      ('Sandero', 'سانديرو', true, 1),
      ('Logan', 'لوجان', true, 2),
      ('Duster', 'داستر', true, 3),
      ('Dokker', 'دوكر', false, 4),
      ('Lodgy', 'لودجي', false, 5)
    ) AS m(name, name_ar, popular, display_order)
    WHERE NOT EXISTS (
      SELECT 1 FROM models 
      WHERE brand_id = v_brand_id AND models.name = m.name
    );
  END IF;

  -- Seat
  SELECT id INTO v_brand_id FROM brands WHERE name = 'Seat' LIMIT 1;
  IF v_brand_id IS NOT NULL THEN
    INSERT INTO models (brand_id, name, name_ar, popular, display_order)
    SELECT v_brand_id, m.name, m.name_ar, m.popular, m.display_order
    FROM (VALUES
      ('Ibiza', 'إبيزا', true, 1),
      ('Leon', 'ليون', true, 2),
      ('Arona', 'أرونا', true, 3),
      ('Ateca', 'أتيكا', false, 4)
    ) AS m(name, name_ar, popular, display_order)
    WHERE NOT EXISTS (
      SELECT 1 FROM models 
      WHERE brand_id = v_brand_id AND models.name = m.name
    );
  END IF;

  -- Citroën
  SELECT id INTO v_brand_id FROM brands WHERE name = 'Citroën' LIMIT 1;
  IF v_brand_id IS NOT NULL THEN
    INSERT INTO models (brand_id, name, name_ar, popular, display_order)
    SELECT v_brand_id, m.name, m.name_ar, m.popular, m.display_order
    FROM (VALUES
      ('C3', 'سي3', true, 1),
      ('C4', 'سي4', true, 2),
      ('C5', 'سي5', false, 3),
      ('Berlingo', 'برلينجو', false, 4),
      ('C-Elysée', 'سي إليزيه', true, 5)
    ) AS m(name, name_ar, popular, display_order)
    WHERE NOT EXISTS (
      SELECT 1 FROM models 
      WHERE brand_id = v_brand_id AND models.name = m.name
    );
  END IF;

  -- Opel
  SELECT id INTO v_brand_id FROM brands WHERE name = 'Opel' LIMIT 1;
  IF v_brand_id IS NOT NULL THEN
    INSERT INTO models (brand_id, name, name_ar, popular, display_order)
    SELECT v_brand_id, m.name, m.name_ar, m.popular, m.display_order
    FROM (VALUES
      ('Corsa', 'كورسا', true, 1),
      ('Astra', 'أسترا', true, 2),
      ('Insignia', 'إنسيجنيا', false, 3),
      ('Mokka', 'موكا', false, 4)
    ) AS m(name, name_ar, popular, display_order)
    WHERE NOT EXISTS (
      SELECT 1 FROM models 
      WHERE brand_id = v_brand_id AND models.name = m.name
    );
  END IF;

  -- Chevrolet
  SELECT id INTO v_brand_id FROM brands WHERE name = 'Chevrolet' LIMIT 1;
  IF v_brand_id IS NOT NULL THEN
    INSERT INTO models (brand_id, name, name_ar, popular, display_order)
    SELECT v_brand_id, m.name, m.name_ar, m.popular, m.display_order
    FROM (VALUES
      ('Spark', 'سبارك', true, 1),
      ('Aveo', 'أفيو', true, 2),
      ('Cruze', 'كروز', false, 3),
      ('Captiva', 'كابتيفا', false, 4)
    ) AS m(name, name_ar, popular, display_order)
    WHERE NOT EXISTS (
      SELECT 1 FROM models 
      WHERE brand_id = v_brand_id AND models.name = m.name
    );
  END IF;

  -- Lada
  SELECT id INTO v_brand_id FROM brands WHERE name = 'Lada' LIMIT 1;
  IF v_brand_id IS NOT NULL THEN
    INSERT INTO models (brand_id, name, name_ar, popular, display_order)
    SELECT v_brand_id, m.name, m.name_ar, m.popular, m.display_order
    FROM (VALUES
      ('Granta', 'جرانتا', true, 1),
      ('Vesta', 'فيستا', true, 2),
      ('Largus', 'لارجوس', false, 3),
      ('Niva', 'نيفا', false, 4)
    ) AS m(name, name_ar, popular, display_order)
    WHERE NOT EXISTS (
      SELECT 1 FROM models 
      WHERE brand_id = v_brand_id AND models.name = m.name
    );
  END IF;

  -- Great Wall
  SELECT id INTO v_brand_id FROM brands WHERE name = 'Great Wall' LIMIT 1;
  IF v_brand_id IS NOT NULL THEN
    INSERT INTO models (brand_id, name, name_ar, popular, display_order)
    SELECT v_brand_id, m.name, m.name_ar, m.popular, m.display_order
    FROM (VALUES
      ('Hover', 'هوفر', true, 1),
      ('Wingle', 'وينجل', true, 2),
      ('Poer', 'بوير', false, 3)
    ) AS m(name, name_ar, popular, display_order)
    WHERE NOT EXISTS (
      SELECT 1 FROM models 
      WHERE brand_id = v_brand_id AND models.name = m.name
    );
  END IF;

  -- BYD
  SELECT id INTO v_brand_id FROM brands WHERE name = 'BYD' LIMIT 1;
  IF v_brand_id IS NOT NULL THEN
    INSERT INTO models (brand_id, name, name_ar, popular, display_order)
    SELECT v_brand_id, m.name, m.name_ar, m.popular, m.display_order
    FROM (VALUES
      ('F3', 'إف3', true, 1),
      ('Song', 'سونج', true, 2),
      ('Tang', 'تانج', false, 3),
      ('Han', 'هان', false, 4)
    ) AS m(name, name_ar, popular, display_order)
    WHERE NOT EXISTS (
      SELECT 1 FROM models 
      WHERE brand_id = v_brand_id AND models.name = m.name
    );
  END IF;

  -- JAC
  SELECT id INTO v_brand_id FROM brands WHERE name = 'JAC' LIMIT 1;
  IF v_brand_id IS NOT NULL THEN
    INSERT INTO models (brand_id, name, name_ar, popular, display_order)
    SELECT v_brand_id, m.name, m.name_ar, m.popular, m.display_order
    FROM (VALUES
      ('J7', 'جي7', true, 1),
      ('S3', 'إس3', true, 2),
      ('S4', 'إس4', false, 3)
    ) AS m(name, name_ar, popular, display_order)
    WHERE NOT EXISTS (
      SELECT 1 FROM models 
      WHERE brand_id = v_brand_id AND models.name = m.name
    );
  END IF;

END $$;

SELECT 
  'Marques: ' || (SELECT COUNT(DISTINCT name) FROM brands)::text || 
  ' | Modèles: ' || (SELECT COUNT(*) FROM models)::text as resultat;
