/*
  # Add Missing Vehicle Models for Popular Brands

  1. Purpose
    - Add commonly sold vehicle models in Algeria that are missing from the database
    - Focus on Renault, Peugeot, Volkswagen, Toyota, Hyundai and other popular brands
    
  2. Changes
    - Insert missing models for Renault (Kangoo, Twingo, Scenic, etc.)
    - Insert missing models for Peugeot (Partner, Boxer, Expert, etc.)
    - Insert missing models for Volkswagen (Tiguan, Touareg, Polo, etc.)
    - Insert missing models for other brands
    
  3. Notes
    - Uses INSERT with ON CONFLICT DO NOTHING to avoid duplicates
    - Models are sorted alphabetically within each brand
*/

-- Add missing Renault models
INSERT INTO vehicle_models (brand_id, name, name_ar) 
SELECT 
  (SELECT id FROM vehicle_brands WHERE name = 'Renault'),
  model.name,
  model.name_ar
FROM (VALUES
  ('Kangoo', 'كانغو'),
  ('Kangoo Express', 'كانغو إكسبريس'),
  ('Twingo', 'توينغو'),
  ('Scenic', 'سينيك'),
  ('Espace', 'إسباس'),
  ('Fluence', 'فلوانس'),
  ('Kadjar', 'كادجار'),
  ('Zoe', 'زوي'),
  ('Master', 'ماستر'),
  ('Trafic', 'ترافيك'),
  ('Dokker', 'دوكر'),
  ('Lodgy', 'لودجي'),
  ('Arkana', 'أركانا'),
  ('Austral', 'أوسترال'),
  ('R19', 'آر 19'),
  ('R21', 'آر 21'),
  ('Laguna', 'لاغونا'),
  ('Latitude', 'لاتيتود'),
  ('Alaskan', 'ألاسكان')
) AS model(name, name_ar)
ON CONFLICT DO NOTHING;

-- Add missing Peugeot models
INSERT INTO vehicle_models (brand_id, name, name_ar)
SELECT 
  (SELECT id FROM vehicle_brands WHERE name = 'Peugeot'),
  model.name,
  model.name_ar
FROM (VALUES
  ('Partner', 'بارتنر'),
  ('Boxer', 'بوكسر'),
  ('Expert', 'إكسبير'),
  ('Rifter', 'ريفتر'),
  ('Traveller', 'ترافيلر'),
  ('2008', '2008'),
  ('3008', '3008'),
  ('5008', '5008'),
  ('301', '301'),
  ('308', '308'),
  ('408', '408'),
  ('508', '508'),
  ('206', '206'),
  ('207', '207'),
  ('307', '307'),
  ('407', '407'),
  ('RCZ', 'آر سي زد'),
  ('e-208', 'إي-208'),
  ('e-2008', 'إي-2008')
) AS model(name, name_ar)
ON CONFLICT DO NOTHING;

-- Add missing Volkswagen models
INSERT INTO vehicle_models (brand_id, name, name_ar)
SELECT 
  (SELECT id FROM vehicle_brands WHERE name = 'Volkswagen'),
  model.name,
  model.name_ar
FROM (VALUES
  ('Polo', 'بولو'),
  ('Golf', 'غولف'),
  ('Tiguan', 'تيغوان'),
  ('Touareg', 'توارغ'),
  ('Passat', 'باسات'),
  ('Jetta', 'جيتا'),
  ('Arteon', 'أرتيون'),
  ('T-Roc', 'تي-روك'),
  ('T-Cross', 'تي-كروس'),
  ('Caddy', 'كادي'),
  ('Transporter', 'ترانسبورتر'),
  ('Crafter', 'كرافتر'),
  ('Amarok', 'أماروك'),
  ('ID.3', 'آي دي.3'),
  ('ID.4', 'آي دي.4'),
  ('Touran', 'توران'),
  ('Sharan', 'شاران'),
  ('Scirocco', 'شيروكو')
) AS model(name, name_ar)
ON CONFLICT DO NOTHING;

-- Add missing Toyota models
INSERT INTO vehicle_models (brand_id, name, name_ar)
SELECT 
  (SELECT id FROM vehicle_brands WHERE name = 'Toyota'),
  model.name,
  model_ar
FROM (VALUES
  ('Hilux', 'هايلوكس'),
  ('Land Cruiser', 'لاند كروزر'),
  ('Prado', 'برادو'),
  ('RAV4', 'راف4'),
  ('Corolla', 'كورولا'),
  ('Camry', 'كامري'),
  ('Yaris', 'ياريس'),
  ('Auris', 'أوريس'),
  ('Avensis', 'أفينسيس'),
  ('C-HR', 'سي-إتش-آر'),
  ('Fortuner', 'فورتشنر'),
  ('Prius', 'بريوس'),
  ('Proace', 'برواس'),
  ('Proace City', 'برواس سيتي'),
  ('Aygo', 'أيغو'),
  ('GT86', 'جي تي 86'),
  ('Supra', 'سوبرا'),
  ('Highlander', 'هايلاندر')
) AS model(name, model_ar)
ON CONFLICT DO NOTHING;

-- Add missing Hyundai models
INSERT INTO vehicle_models (brand_id, name, name_ar)
SELECT 
  (SELECT id FROM vehicle_brands WHERE name = 'Hyundai'),
  model.name,
  model.name_ar
FROM (VALUES
  ('i10', 'آي10'),
  ('i20', 'آي20'),
  ('i30', 'آي30'),
  ('Elantra', 'إلنترا'),
  ('Sonata', 'سوناتا'),
  ('Tucson', 'توسان'),
  ('Santa Fe', 'سانتا في'),
  ('Kona', 'كونا'),
  ('Creta', 'كريتا'),
  ('Venue', 'فينيو'),
  ('Ioniq', 'أيونيك'),
  ('Palisade', 'باليسيد'),
  ('Staria', 'ستاريا'),
  ('H1', 'إتش1'),
  ('H100', 'إتش100'),
  ('Accent', 'أكسنت'),
  ('Veloster', 'فيلوستر')
) AS model(name, name_ar)
ON CONFLICT DO NOTHING;

-- Add missing Dacia models
INSERT INTO vehicle_models (brand_id, name, name_ar)
SELECT 
  (SELECT id FROM vehicle_brands WHERE name = 'Dacia'),
  model.name,
  model.name_ar
FROM (VALUES
  ('Logan', 'لوغان'),
  ('Sandero', 'ساندرو'),
  ('Duster', 'داستر'),
  ('Lodgy', 'لودجي'),
  ('Dokker', 'دوكر'),
  ('Spring', 'سبرينغ'),
  ('Jogger', 'جوغر')
) AS model(name, name_ar)
ON CONFLICT DO NOTHING;

-- Add missing Citroën models
INSERT INTO vehicle_models (brand_id, name, name_ar)
SELECT 
  (SELECT id FROM vehicle_brands WHERE name = 'Citroën'),
  model.name,
  model.name_ar
FROM (VALUES
  ('Berlingo', 'برلينغو'),
  ('C3', 'سي3'),
  ('C4', 'سي4'),
  ('C5', 'سي5'),
  ('C-Elysée', 'سي-إليزيه'),
  ('Jumpy', 'جمبي'),
  ('Jumper', 'جمبر'),
  ('SpaceTourer', 'سبيس تورير'),
  ('C3 Aircross', 'سي3 إيركروس'),
  ('C5 Aircross', 'سي5 إيركروس'),
  ('ë-C4', 'إي-سي4'),
  ('Ami', 'أمي')
) AS model(name, name_ar)
ON CONFLICT DO NOTHING;

-- Add missing Nissan models
INSERT INTO vehicle_models (brand_id, name, name_ar)
SELECT 
  (SELECT id FROM vehicle_brands WHERE name = 'Nissan'),
  model.name,
  model.name_ar
FROM (VALUES
  ('Micra', 'ميكرا'),
  ('Sunny', 'صني'),
  ('Sentra', 'سينترا'),
  ('Altima', 'ألتيما'),
  ('Maxima', 'ماكسيما'),
  ('Juke', 'جوك'),
  ('Qashqai', 'كاشكاي'),
  ('X-Trail', 'إكس-تريل'),
  ('Patrol', 'باترول'),
  ('Pathfinder', 'باثفايندر'),
  ('Kicks', 'كيكس'),
  ('Note', 'نوت'),
  ('Leaf', 'ليف'),
  ('Navara', 'نافارا'),
  ('Urvan', 'أورفان'),
  ('GT-R', 'جي تي-آر'),
  ('370Z', '370زد'),
  ('Ariya', 'أريا')
) AS model(name, name_ar)
ON CONFLICT DO NOTHING;

-- Add missing Ford models
INSERT INTO vehicle_models (brand_id, name, name_ar)
SELECT 
  (SELECT id FROM vehicle_brands WHERE name = 'Ford'),
  model.name,
  model.name_ar
FROM (VALUES
  ('Fiesta', 'فييستا'),
  ('Focus', 'فوكس'),
  ('Mondeo', 'موندو'),
  ('Mustang', 'موستانغ'),
  ('EcoSport', 'إيكوسبورت'),
  ('Kuga', 'كوغا'),
  ('Edge', 'إيدج'),
  ('Explorer', 'إكسبلورر'),
  ('Ranger', 'رينجر'),
  ('Transit', 'ترانزيت'),
  ('Transit Custom', 'ترانزيت كاستوم'),
  ('Transit Connect', 'ترانزيت كونيكت'),
  ('Tourneo', 'تورنيو'),
  ('Puma', 'بوما'),
  ('Bronco', 'برونكو'),
  ('Maverick', 'مافريك')
) AS model(name, name_ar)
ON CONFLICT DO NOTHING;

-- Add missing Kia models
INSERT INTO vehicle_models (brand_id, name, name_ar)
SELECT 
  (SELECT id FROM vehicle_brands WHERE name = 'Kia'),
  model.name,
  model.name_ar
FROM (VALUES
  ('Picanto', 'بيكانتو'),
  ('Rio', 'ريو'),
  ('Cerato', 'سيراتو'),
  ('Optima', 'أوبتيما'),
  ('K5', 'كي5'),
  ('Stinger', 'ستينغر'),
  ('Sportage', 'سبورتاج'),
  ('Sorento', 'سورينتو'),
  ('Seltos', 'سيلتوس'),
  ('Carnival', 'كارنيفال'),
  ('Soul', 'سول'),
  ('Niro', 'نيرو'),
  ('EV6', 'إي في6'),
  ('Stonic', 'ستونيك')
) AS model(name, name_ar)
ON CONFLICT DO NOTHING;

-- Add missing Chevrolet models
INSERT INTO vehicle_models (brand_id, name, name_ar)
SELECT 
  (SELECT id FROM vehicle_brands WHERE name = 'Chevrolet'),
  model.name,
  model.name_ar
FROM (VALUES
  ('Spark', 'سبارك'),
  ('Aveo', 'أفيو'),
  ('Cruze', 'كروز'),
  ('Malibu', 'ماليبو'),
  ('Camaro', 'كامارو'),
  ('Corvette', 'كورفيت'),
  ('Trax', 'تراكس'),
  ('Equinox', 'إيكوينوكس'),
  ('Blazer', 'بليزر'),
  ('Tahoe', 'تاهو'),
  ('Suburban', 'سوبوربان'),
  ('Silverado', 'سيلفرادو'),
  ('Colorado', 'كولورادو'),
  ('Captiva', 'كابتيفا')
) AS model(name, name_ar)
ON CONFLICT DO NOTHING;

-- Add missing Mercedes-Benz models
INSERT INTO vehicle_models (brand_id, name, name_ar)
SELECT 
  (SELECT id FROM vehicle_brands WHERE name = 'Mercedes-Benz'),
  model.name,
  model.name_ar
FROM (VALUES
  ('A-Class', 'فئة-أ'),
  ('B-Class', 'فئة-ب'),
  ('C-Class', 'فئة-سي'),
  ('E-Class', 'فئة-إي'),
  ('S-Class', 'فئة-إس'),
  ('CLA', 'سي إل أ'),
  ('CLS', 'سي إل إس'),
  ('GLA', 'جي إل أ'),
  ('GLB', 'جي إل بي'),
  ('GLC', 'جي إل سي'),
  ('GLE', 'جي إل إي'),
  ('GLS', 'جي إل إس'),
  ('G-Class', 'جي-كلاس'),
  ('AMG GT', 'إيه إم جي جي تي'),
  ('Vito', 'فيتو'),
  ('Sprinter', 'سبرنتر'),
  ('EQC', 'إي كيو سي'),
  ('EQA', 'إي كيو أ'),
  ('EQB', 'إي كيو بي')
) AS model(name, name_ar)
ON CONFLICT DO NOTHING;

-- Add missing BMW models
INSERT INTO vehicle_models (brand_id, name, name_ar)
SELECT 
  (SELECT id FROM vehicle_brands WHERE name = 'BMW'),
  model.name,
  model.name_ar
FROM (VALUES
  ('1 Series', 'الفئة الأولى'),
  ('2 Series', 'الفئة الثانية'),
  ('3 Series', 'الفئة الثالثة'),
  ('4 Series', 'الفئة الرابعة'),
  ('5 Series', 'الفئة الخامسة'),
  ('6 Series', 'الفئة السادسة'),
  ('7 Series', 'الفئة السابعة'),
  ('8 Series', 'الفئة الثامنة'),
  ('X1', 'إكس1'),
  ('X2', 'إكس2'),
  ('X3', 'إكس3'),
  ('X4', 'إكس4'),
  ('X5', 'إكس5'),
  ('X6', 'إكس6'),
  ('X7', 'إكس7'),
  ('Z4', 'زد4'),
  ('i3', 'آي3'),
  ('i4', 'آي4'),
  ('iX', 'آي إكس'),
  ('M3', 'إم3'),
  ('M4', 'إم4'),
  ('M5', 'إم5')
) AS model(name, name_ar)
ON CONFLICT DO NOTHING;

-- Add missing Audi models
INSERT INTO vehicle_models (brand_id, name, name_ar)
SELECT 
  (SELECT id FROM vehicle_brands WHERE name = 'Audi'),
  model.name,
  model.name_ar
FROM (VALUES
  ('A1', 'أ1'),
  ('A3', 'أ3'),
  ('A4', 'أ4'),
  ('A5', 'أ5'),
  ('A6', 'أ6'),
  ('A7', 'أ7'),
  ('A8', 'أ8'),
  ('Q2', 'كيو2'),
  ('Q3', 'كيو3'),
  ('Q4 e-tron', 'كيو4 إي-ترون'),
  ('Q5', 'كيو5'),
  ('Q7', 'كيو7'),
  ('Q8', 'كيو8'),
  ('TT', 'تي تي'),
  ('R8', 'آر8'),
  ('e-tron', 'إي-ترون'),
  ('RS3', 'آر إس3'),
  ('RS4', 'آر إس4'),
  ('RS6', 'آر إس6')
) AS model(name, name_ar)
ON CONFLICT DO NOTHING;