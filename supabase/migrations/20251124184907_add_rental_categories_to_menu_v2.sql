/*
  # Ajout des catégories de location au menu principal

  1. Nouvelles catégories ajoutées :
    - Location Immobilière (location-immobiliere) - display_order: 20
    - Location Vacances (location-vacances) - display_order: 25
    - Location Véhicules (location-vehicules) - display_order: 26

  2. Modifications :
    - Réorganisation des display_order pour insérer les nouvelles catégories
    - Véhicules (10) → Immobilier (15) → Location Immobilière (20) → Location Vacances (25) → Location Véhicules (26) → Emploi (30)

  3. Notes :
    - Les catégories sont insérées entre Véhicules et Emploi
    - La colonne 'name' est remplie avec la version française
*/

-- Créer la catégorie Location Immobilière
INSERT INTO categories (name, slug, name_fr, name_en, name_ar, icon, parent_id, display_order)
VALUES (
  'Location Immobilière',
  'location-immobiliere',
  'Location Immobilière',
  'Property Rental',
  'إيجار عقاري',
  '🏘️',
  NULL,
  20
) ON CONFLICT (slug) DO NOTHING;

-- Créer la catégorie Location Vacances
INSERT INTO categories (name, slug, name_fr, name_en, name_ar, icon, parent_id, display_order)
VALUES (
  'Location Vacances',
  'location-vacances',
  'Location Vacances',
  'Vacation Rental',
  'تأجير عطلات',
  '🏖️',
  NULL,
  25
) ON CONFLICT (slug) DO NOTHING;

-- Créer la catégorie Location Véhicules
INSERT INTO categories (name, slug, name_fr, name_en, name_ar, icon, parent_id, display_order)
VALUES (
  'Location Véhicules',
  'location-vehicules',
  'Location Véhicules',
  'Vehicle Rental',
  'تأجير مركبات',
  '🚙',
  NULL,
  26
) ON CONFLICT (slug) DO NOTHING;

-- Mettre à jour le display_order de la catégorie Immobilier
UPDATE categories 
SET display_order = 15,
    name_en = 'Real Estate',
    name_ar = 'عقارات'
WHERE slug = 'immobilier';
