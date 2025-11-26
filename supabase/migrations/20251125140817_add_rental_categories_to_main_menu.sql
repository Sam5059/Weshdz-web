/*
  # Ajout des catégories de location au menu principal

  1. Nouvelles Catégories
    - Location Immobilière (🏘️)
    - Location Vacances (🏖️)
    - Location Véhicules (🚙)
    - Location Équipements (🔨)

  2. Ordre final du menu :
    1. Véhicules
    2. Immobilier (vente)
    3. Location Immobilière
    4. Location Vacances
    5. Location Véhicules
    6. Emploi
    7. Électronique
    8. Services
    9. Mode & Beauté
    10. Maison & Jardin
    11. Loisirs & Divertissement
    12. Animaux
    13. Bébé & Enfant
    14. Location Équipements
*/

-- Réorganiser les display_order des catégories existantes
UPDATE categories SET display_order = 6 WHERE slug = 'emploi';
UPDATE categories SET display_order = 7 WHERE slug = 'electronique';
UPDATE categories SET display_order = 8 WHERE slug = 'services';
UPDATE categories SET display_order = 9 WHERE slug = 'mode-beaute';
UPDATE categories SET display_order = 10 WHERE slug = 'maison-jardin';
UPDATE categories SET display_order = 11 WHERE slug = 'loisirs';
UPDATE categories SET display_order = 12 WHERE slug = 'animaux';
UPDATE categories SET display_order = 13 WHERE slug = 'bebe-enfant';

-- Insérer les nouvelles catégories de location
INSERT INTO categories (id, name, slug, name_fr, name_en, name_ar, icon, parent_id, display_order, created_at)
VALUES
  (
    gen_random_uuid(),
    'Location Immobilière',
    'location-immobiliere',
    'Location Immobilière',
    'Property Rental',
    'إيجار عقاري',
    '🏘️',
    NULL,
    3,
    now()
  ),
  (
    gen_random_uuid(),
    'Location Vacances',
    'location-vacances',
    'Location Vacances',
    'Vacation Rental',
    'تأجير عطلات',
    '🏖️',
    NULL,
    4,
    now()
  ),
  (
    gen_random_uuid(),
    'Location Véhicules',
    'location-vehicules',
    'Location Véhicules',
    'Vehicle Rental',
    'تأجير مركبات',
    '🚙',
    NULL,
    5,
    now()
  ),
  (
    gen_random_uuid(),
    'Location Équipements',
    'location-equipements',
    'Location Équipements',
    'Equipment Rental',
    'تأجير معدات',
    '🔨',
    NULL,
    14,
    now()
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  name_fr = EXCLUDED.name_fr,
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  icon = EXCLUDED.icon,
  display_order = EXCLUDED.display_order;
