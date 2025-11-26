/*
  # Add Subcategories Hierarchy
  
  1. Changes
    - Populate subcategories using parent_id to create hierarchy
    - Keep existing parent categories
    - Add subcategories for: Véhicules, Immobilier, Électronique, Mode, Services
    
  2. Structure
    - Parent categories (parent_id = NULL)
    - Subcategories (parent_id = parent category UUID)
    
  3. Categories Hierarchy
    
    🚗 Véhicules
      ├── Voitures
      ├── Motos
      ├── Camions
      └── Pièces Auto
      
    🏠 Immobilier
      ├── Appartements
      ├── Maisons
      ├── Terrains
      └── Locaux Commerciaux
      
    📱 Électronique
      ├── Téléphones
      ├── Ordinateurs
      ├── TV & Audio
      └── Électroménager
      
    👔 Mode
      ├── Vêtements Homme
      ├── Vêtements Femme
      ├── Chaussures
      └── Accessoires
      
    🛠️ Services
      ├── Services à domicile
      ├── Cours & Formation
      ├── Événementiel
      └── Réparation & Maintenance
  
  4. Security
    - No RLS changes needed (categories table already has RLS)
*/

-- Insert Véhicules subcategories
INSERT INTO categories (name, name_fr, name_ar, name_en, slug, parent_id, display_order)
VALUES
  ('Voitures', 'Voitures', 'سيارات', 'Cars', 'voitures', 
   (SELECT id FROM categories WHERE slug = 'vehicules'), 1),
  ('Motos', 'Motos', 'دراجات نارية', 'Motorcycles', 'motos', 
   (SELECT id FROM categories WHERE slug = 'vehicules'), 2),
  ('Camions', 'Camions', 'شاحنات', 'Trucks', 'camions', 
   (SELECT id FROM categories WHERE slug = 'vehicules'), 3),
  ('Pièces Auto', 'Pièces Auto', 'قطع غيار السيارات', 'Auto Parts', 'pieces-auto', 
   (SELECT id FROM categories WHERE slug = 'vehicules'), 4)
ON CONFLICT (slug) DO NOTHING;

-- Insert Immobilier subcategories
INSERT INTO categories (name, name_fr, name_ar, name_en, slug, parent_id, display_order)
VALUES
  ('Appartements', 'Appartements', 'شقق', 'Apartments', 'appartements', 
   (SELECT id FROM categories WHERE slug = 'immobilier'), 1),
  ('Maisons', 'Maisons', 'منازل', 'Houses', 'maisons', 
   (SELECT id FROM categories WHERE slug = 'immobilier'), 2),
  ('Terrains', 'Terrains', 'أراضي', 'Land', 'terrains', 
   (SELECT id FROM categories WHERE slug = 'immobilier'), 3),
  ('Locaux Commerciaux', 'Locaux Commerciaux', 'محلات تجارية', 'Commercial', 'locaux-commerciaux', 
   (SELECT id FROM categories WHERE slug = 'immobilier'), 4)
ON CONFLICT (slug) DO NOTHING;

-- Insert Électronique subcategories
INSERT INTO categories (name, name_fr, name_ar, name_en, slug, parent_id, display_order)
VALUES
  ('Téléphones', 'Téléphones', 'هواتف', 'Phones', 'telephones', 
   (SELECT id FROM categories WHERE slug = 'electronique'), 1),
  ('Ordinateurs', 'Ordinateurs', 'حواسيب', 'Computers', 'ordinateurs', 
   (SELECT id FROM categories WHERE slug = 'electronique'), 2),
  ('TV & Audio', 'TV & Audio', 'تلفزيون وصوت', 'TV & Audio', 'tv-audio', 
   (SELECT id FROM categories WHERE slug = 'electronique'), 3),
  ('Électroménager', 'Électroménager', 'أجهزة منزلية', 'Appliances', 'electromenager', 
   (SELECT id FROM categories WHERE slug = 'electronique'), 4)
ON CONFLICT (slug) DO NOTHING;

-- Insert Mode subcategories
INSERT INTO categories (name, name_fr, name_ar, name_en, slug, parent_id, display_order)
VALUES
  ('Vêtements Homme', 'Vêtements Homme', 'ملابس رجالية', 'Men Clothing', 'vetements-homme', 
   (SELECT id FROM categories WHERE slug = 'mode'), 1),
  ('Vêtements Femme', 'Vêtements Femme', 'ملابس نسائية', 'Women Clothing', 'vetements-femme', 
   (SELECT id FROM categories WHERE slug = 'mode'), 2),
  ('Chaussures', 'Chaussures', 'أحذية', 'Shoes', 'chaussures', 
   (SELECT id FROM categories WHERE slug = 'mode'), 3),
  ('Accessoires', 'Accessoires', 'إكسسوارات', 'Accessories', 'accessoires', 
   (SELECT id FROM categories WHERE slug = 'mode'), 4)
ON CONFLICT (slug) DO NOTHING;

-- Insert Services subcategories
INSERT INTO categories (name, name_fr, name_ar, name_en, slug, parent_id, display_order)
VALUES
  ('Services à domicile', 'Services à domicile', 'خدمات منزلية', 'Home Services', 'services-domicile', 
   (SELECT id FROM categories WHERE slug = 'services'), 1),
  ('Cours & Formation', 'Cours & Formation', 'دروس وتدريب', 'Courses', 'cours-formation', 
   (SELECT id FROM categories WHERE slug = 'services'), 2),
  ('Événementiel', 'Événementiel', 'تنظيم الفعاليات', 'Events', 'evenementiel', 
   (SELECT id FROM categories WHERE slug = 'services'), 3),
  ('Réparation & Maintenance', 'Réparation & Maintenance', 'إصلاح وصيانة', 'Repair', 'reparation-maintenance', 
   (SELECT id FROM categories WHERE slug = 'services'), 4)
ON CONFLICT (slug) DO NOTHING;

-- Insert Location Immobilière subcategories
INSERT INTO categories (name, name_fr, name_ar, name_en, slug, parent_id, display_order)
VALUES
  ('Appartements à louer', 'Appartements à louer', 'شقق للإيجار', 'Apartments for Rent', 'appartements-louer', 
   (SELECT id FROM categories WHERE slug = 'location-immobiliere'), 1),
  ('Maisons à louer', 'Maisons à louer', 'منازل للإيجار', 'Houses for Rent', 'maisons-louer', 
   (SELECT id FROM categories WHERE slug = 'location-immobiliere'), 2),
  ('Studios', 'Studios', 'استوديوهات', 'Studios', 'studios', 
   (SELECT id FROM categories WHERE slug = 'location-immobiliere'), 3),
  ('Bureaux à louer', 'Bureaux à louer', 'مكاتب للإيجار', 'Offices for Rent', 'bureaux-louer', 
   (SELECT id FROM categories WHERE slug = 'location-immobiliere'), 4)
ON CONFLICT (slug) DO NOTHING;