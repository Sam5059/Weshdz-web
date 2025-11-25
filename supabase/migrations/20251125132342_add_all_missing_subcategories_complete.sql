/*
  # Ajout de TOUTES les sous-catégories manquantes
  
  Complète toutes les sous-catégories pour chaque catégorie principale
*/

-- Ajouter les sous-catégories pour toutes les catégories
DO $$
DECLARE
  v_cat_id uuid;
BEGIN
  -- VÉHICULES - Voitures
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'voitures';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO subcategories (category_id, name, name_fr, name_ar, name_en, slug, display_order) VALUES
    (v_cat_id, 'Citadines', 'Citadines', 'سيارات المدينة', 'City Cars', 'voitures-citadines', 1),
    (v_cat_id, 'Berlines', 'Berlines', 'سيدان', 'Sedans', 'voitures-berlines', 2),
    (v_cat_id, 'SUV', 'SUV', 'دفع رباعي', 'SUV', 'voitures-suv', 3),
    (v_cat_id, '4x4', '4x4', '4x4', '4x4', 'voitures-4x4', 4),
    (v_cat_id, 'Breaks', 'Breaks', 'ستيشن واغن', 'Station Wagons', 'voitures-breaks', 5),
    (v_cat_id, 'Coupés & Cabriolets', 'Coupés & Cabriolets', 'كوبيه وكشف', 'Coupes & Convertibles', 'voitures-coupes-cabriolets', 6),
    (v_cat_id, 'Monospaces', 'Monospaces', 'عائلية', 'Minivans', 'voitures-monospaces', 7),
    (v_cat_id, 'Utilitaires', 'Utilitaires', 'نفعية', 'Commercial Vehicles', 'voitures-utilitaires', 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- VÉHICULES - Motos
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'motos';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO subcategories (category_id, name, name_fr, name_ar, name_en, slug, display_order) VALUES
    (v_cat_id, 'Scooters', 'Scooters', 'سكوتر', 'Scooters', 'motos-scooters', 1),
    (v_cat_id, 'Motos routières', 'Motos routières', 'دراجات طرقية', 'Road Bikes', 'motos-routieres', 2),
    (v_cat_id, 'Motos cross', 'Motos cross', 'دراجات كروس', 'Cross Bikes', 'motos-cross', 3),
    (v_cat_id, 'Motos sport', 'Motos sport', 'دراجات رياضية', 'Sport Bikes', 'motos-sport', 4),
    (v_cat_id, 'Quads', 'Quads', 'رباعية', 'Quads', 'motos-quads', 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- VÉHICULES - Camions
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'camions';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO subcategories (category_id, name, name_fr, name_ar, name_en, slug, display_order) VALUES
    (v_cat_id, 'Camions légers', 'Camions légers', 'شاحنات خفيفة', 'Light Trucks', 'camions-legers', 1),
    (v_cat_id, 'Camions lourds', 'Camions lourds', 'شاحنات ثقيلة', 'Heavy Trucks', 'camions-lourds', 2),
    (v_cat_id, 'Semi-remorques', 'Semi-remorques', 'نصف مقطورة', 'Semi Trailers', 'camions-semi-remorques', 3),
    (v_cat_id, 'Camions frigorifiques', 'Camions frigorifiques', 'شاحنات تبريد', 'Refrigerated Trucks', 'camions-frigorifiques', 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- ÉLECTRONIQUE - Téléphones
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'telephones';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO subcategories (category_id, name, name_fr, name_ar, name_en, slug, display_order) VALUES
    (v_cat_id, 'Smartphones', 'Smartphones', 'هواتف ذكية', 'Smartphones', 'telephones-smartphones', 1),
    (v_cat_id, 'Téléphones fixes', 'Téléphones fixes', 'هواتف ثابتة', 'Landline Phones', 'telephones-fixes', 2),
    (v_cat_id, 'Accessoires', 'Accessoires', 'إكسسوارات', 'Accessories', 'telephones-accessoires', 3),
    (v_cat_id, 'Pièces détachées', 'Pièces détachées', 'قطع غيار', 'Spare Parts', 'telephones-pieces-detachees', 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- ÉLECTRONIQUE - Ordinateurs
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'ordinateurs';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO subcategories (category_id, name, name_fr, name_ar, name_en, slug, display_order) VALUES
    (v_cat_id, 'PC portables', 'PC portables', 'حواسيب محمولة', 'Laptops', 'ordinateurs-portables', 1),
    (v_cat_id, 'PC de bureau', 'PC de bureau', 'حواسيب مكتبية', 'Desktop PCs', 'ordinateurs-bureau', 2),
    (v_cat_id, 'Tablettes', 'Tablettes', 'أجهزة لوحية', 'Tablets', 'ordinateurs-tablettes', 3),
    (v_cat_id, 'Accessoires', 'Accessoires', 'إكسسوارات', 'Accessories', 'ordinateurs-accessoires', 4),
    (v_cat_id, 'Composants', 'Composants', 'مكونات', 'Components', 'ordinateurs-composants', 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- ÉLECTRONIQUE - TV & Audio
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'tv-audio';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO subcategories (category_id, name, name_fr, name_ar, name_en, slug, display_order) VALUES
    (v_cat_id, 'Téléviseurs', 'Téléviseurs', 'تلفزيونات', 'TVs', 'tv-audio-televiseurs', 1),
    (v_cat_id, 'Home cinéma', 'Home cinéma', 'سينما منزلية', 'Home Cinema', 'tv-audio-home-cinema', 2),
    (v_cat_id, 'Enceintes', 'Enceintes', 'مكبرات صوت', 'Speakers', 'tv-audio-enceintes', 3),
    (v_cat_id, 'Casques audio', 'Casques audio', 'سماعات', 'Headphones', 'tv-audio-casques', 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- ÉLECTRONIQUE - Électroménager
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'electromenager';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO subcategories (category_id, name, name_fr, name_ar, name_en, slug, display_order) VALUES
    (v_cat_id, 'Réfrigérateurs', 'Réfrigérateurs', 'ثلاجات', 'Refrigerators', 'electromenager-refrigerateurs', 1),
    (v_cat_id, 'Machines à laver', 'Machines à laver', 'غسالات', 'Washing Machines', 'electromenager-machines-laver', 2),
    (v_cat_id, 'Cuisinières', 'Cuisinières', 'مواقد', 'Cookers', 'electromenager-cuisinieres', 3),
    (v_cat_id, 'Micro-ondes', 'Micro-ondes', 'ميكروويف', 'Microwaves', 'electromenager-micro-ondes', 4),
    (v_cat_id, 'Climatiseurs', 'Climatiseurs', 'مكيفات', 'Air Conditioners', 'electromenager-climatiseurs', 5),
    (v_cat_id, 'Petit électroménager', 'Petit électroménager', 'أجهزة منزلية صغيرة', 'Small Appliances', 'electromenager-petit', 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- IMMOBILIER - Appartements
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'appartements';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO subcategories (category_id, name, name_fr, name_ar, name_en, slug, display_order) VALUES
    (v_cat_id, 'F2', 'F2', 'شقة غرفتين', 'F2', 'appartements-f2', 1),
    (v_cat_id, 'F3', 'F3', 'شقة 3 غرف', 'F3', 'appartements-f3', 2),
    (v_cat_id, 'F4', 'F4', 'شقة 4 غرف', 'F4', 'appartements-f4', 3),
    (v_cat_id, 'F5+', 'F5+', 'شقة 5 غرف فأكثر', 'F5+', 'appartements-f5-plus', 4),
    (v_cat_id, 'Duplex', 'Duplex', 'دوبلكس', 'Duplex', 'appartements-duplex', 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- IMMOBILIER - Maisons & Villas
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'maisons-villas';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO subcategories (category_id, name, name_fr, name_ar, name_en, slug, display_order) VALUES
    (v_cat_id, 'Maisons', 'Maisons', 'منازل', 'Houses', 'maisons-villas-maisons', 1),
    (v_cat_id, 'Villas', 'Villas', 'فيلات', 'Villas', 'maisons-villas-villas', 2),
    (v_cat_id, 'Fermettes', 'Fermettes', 'مزارع صغيرة', 'Farmhouses', 'maisons-villas-fermettes', 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- IMMOBILIER - Terrains
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'terrains';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO subcategories (category_id, name, name_fr, name_ar, name_en, slug, display_order) VALUES
    (v_cat_id, 'Terrains agricoles', 'Terrains agricoles', 'أراضي فلاحية', 'Agricultural Land', 'terrains-agricoles', 1),
    (v_cat_id, 'Terrains constructibles', 'Terrains constructibles', 'أراضي للبناء', 'Building Land', 'terrains-constructibles', 2),
    (v_cat_id, 'Terrains industriels', 'Terrains industriels', 'أراضي صناعية', 'Industrial Land', 'terrains-industriels', 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- IMMOBILIER - Locaux commerciaux
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'locaux-commerciaux';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO subcategories (category_id, name, name_fr, name_ar, name_en, slug, display_order) VALUES
    (v_cat_id, 'Boutiques', 'Boutiques', 'محلات', 'Shops', 'locaux-commerciaux-boutiques', 1),
    (v_cat_id, 'Bureaux', 'Bureaux', 'مكاتب', 'Offices', 'locaux-commerciaux-bureaux', 2),
    (v_cat_id, 'Entrepôts', 'Entrepôts', 'مخازن', 'Warehouses', 'locaux-commerciaux-entrepots', 3),
    (v_cat_id, 'Locaux industriels', 'Locaux industriels', 'محلات صناعية', 'Industrial Premises', 'locaux-commerciaux-industriels', 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- MODE & BEAUTÉ
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'mode-beaute';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO subcategories (category_id, name, name_fr, name_ar, name_en, slug, display_order) VALUES
    (v_cat_id, 'Vêtements femme', 'Vêtements femme', 'ملابس نسائية', 'Women''s Clothing', 'mode-beaute-vetements-femme', 1),
    (v_cat_id, 'Vêtements homme', 'Vêtements homme', 'ملابس رجالية', 'Men''s Clothing', 'mode-beaute-vetements-homme', 2),
    (v_cat_id, 'Chaussures', 'Chaussures', 'أحذية', 'Shoes', 'mode-beaute-chaussures', 3),
    (v_cat_id, 'Sacs & Accessoires', 'Sacs & Accessoires', 'حقائب وإكسسوارات', 'Bags & Accessories', 'mode-beaute-sacs-accessoires', 4),
    (v_cat_id, 'Bijoux & Montres', 'Bijoux & Montres', 'مجوهرات وساعات', 'Jewelry & Watches', 'mode-beaute-bijoux-montres', 5),
    (v_cat_id, 'Parfums & Cosmétiques', 'Parfums & Cosmétiques', 'عطور ومستحضرات', 'Perfumes & Cosmetics', 'mode-beaute-parfums-cosmetiques', 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- EMPLOI
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'emploi';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO subcategories (category_id, name, name_fr, name_ar, name_en, slug, display_order) VALUES
    (v_cat_id, 'Offres d''emploi', 'Offres d''emploi', 'عروض عمل', 'Job Offers', 'emploi-offres', 1),
    (v_cat_id, 'Demandes d''emploi', 'Demandes d''emploi', 'طلبات عمل', 'Job Requests', 'emploi-demandes', 2),
    (v_cat_id, 'Stages', 'Stages', 'تدريبات', 'Internships', 'emploi-stages', 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- SERVICES
  SELECT id INTO v_cat_id FROM categories WHERE slug = 'services';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO subcategories (category_id, name, name_fr, name_ar, name_en, slug, display_order) VALUES
    (v_cat_id, 'Services informatiques', 'Services informatiques', 'خدمات معلوماتية', 'IT Services', 'services-informatiques', 1),
    (v_cat_id, 'Cours & Formations', 'Cours & Formations', 'دروس وتكوين', 'Courses & Training', 'services-cours-formations', 2),
    (v_cat_id, 'Déménagement & Transport', 'Déménagement & Transport', 'نقل وتوصيل', 'Moving & Transport', 'services-demenagement-transport', 3),
    (v_cat_id, 'Réparations', 'Réparations', 'إصلاحات', 'Repairs', 'services-reparations', 4),
    (v_cat_id, 'Beauté & Bien-être', 'Beauté & Bien-être', 'جمال ورفاهية', 'Beauty & Wellness', 'services-beaute-bien-etre', 5),
    (v_cat_id, 'Événements', 'Événements', 'مناسبات', 'Events', 'services-evenements', 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;

SELECT 'Sous-catégories ajoutées avec succès' as status;
