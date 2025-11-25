/*
  # Restaurer Location Véhicules comme catégorie principale avec sous-catégories

  1. Modifications
    - Restaurer `location-vehicules` comme catégorie principale (parent_id = NULL)
    - Créer les sous-catégories de location : Voitures location, Motos location, Camions location, Utilitaires location

  2. Structure
    - Location Véhicules (parent)
      - Voitures location
      - Motos location  
      - Camions location
      - Utilitaires location

  3. Sécurité
    - Toutes les règles RLS existantes s'appliquent automatiquement
*/

-- Restaurer Location Véhicules comme catégorie principale
UPDATE categories 
SET parent_id = NULL,
    display_order = 11
WHERE slug = 'location-vehicules';

-- Créer les sous-catégories de Location Véhicules
INSERT INTO categories (slug, name, name_fr, name_ar, name_en, icon, parent_id, display_order)
SELECT 'location-voitures', 'Voitures location', 'Voitures location', 'تأجير السيارات', 'Car rental', '🚗', id, 1
FROM categories WHERE slug = 'location-vehicules'
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  parent_id = EXCLUDED.parent_id,
  display_order = EXCLUDED.display_order;

INSERT INTO categories (slug, name, name_fr, name_ar, name_en, icon, parent_id, display_order)
SELECT 'location-motos', 'Motos location', 'Motos location', 'تأجير الدراجات', 'Motorcycle rental', '🏍️', id, 2
FROM categories WHERE slug = 'location-vehicules'
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  parent_id = EXCLUDED.parent_id,
  display_order = EXCLUDED.display_order;

INSERT INTO categories (slug, name, name_fr, name_ar, name_en, icon, parent_id, display_order)
SELECT 'location-camions', 'Camions location', 'Camions location', 'تأجير الشاحنات', 'Truck rental', '🚚', id, 3
FROM categories WHERE slug = 'location-vehicules'
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  parent_id = EXCLUDED.parent_id,
  display_order = EXCLUDED.display_order;

INSERT INTO categories (slug, name, name_fr, name_ar, name_en, icon, parent_id, display_order)
SELECT 'location-utilitaires', 'Utilitaires location', 'Utilitaires location', 'تأجير السيارات النفعية', 'Utility vehicle rental', '🚐', id, 4
FROM categories WHERE slug = 'location-vehicules'
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  parent_id = EXCLUDED.parent_id,
  display_order = EXCLUDED.display_order;
