/*
  # Ajout des traductions manquantes pour les catégories

  1. Traductions ajoutées
    - **Location Véhicules** → FR: Location Véhicules, EN: Vehicle Rental, AR: تأجير المركبات
    - **Location Vacances** → FR: Location Vacances, EN: Vacation Rentals, AR: إيجارات العطلات
    - **Mode & Beauté** → FR: Mode & Beauté, EN: Fashion & Beauty, AR: الموضة والجمال
    - **Location Équipements** → FR: Location Équipements, EN: Equipment Rental, AR: تأجير المعدات
    - **Maison & Jardin** → FR: Maison & Jardin, EN: Home & Garden, AR: المنزل والحديقة
    - **Animaux** → FR: Animaux, EN: Animals, AR: حيوانات
    - **Bébé & Enfants** → FR: Bébé & Enfants, EN: Baby & Kids, AR: أطفال ورضع
    - **Matériel Professionnel** → FR: Matériel Professionnel, EN: Professional Equipment, AR: معدات مهنية

  2. Notes
    - Mise à jour des catégories principales uniquement (parent_id IS NULL)
    - Conservation des valeurs name existantes comme fallback
*/

-- Location Véhicules
UPDATE categories 
SET 
  name_fr = 'Location Véhicules',
  name_en = 'Vehicle Rental',
  name_ar = 'تأجير المركبات'
WHERE slug = 'location-vehicules' AND parent_id IS NULL;

-- Location Vacances
UPDATE categories 
SET 
  name_fr = 'Location Vacances',
  name_en = 'Vacation Rentals',
  name_ar = 'إيجارات العطلات'
WHERE slug = 'location-vacances' AND parent_id IS NULL;

-- Mode & Beauté
UPDATE categories 
SET 
  name_fr = 'Mode & Beauté',
  name_en = 'Fashion & Beauty',
  name_ar = 'الموضة والجمال'
WHERE slug = 'mode-beaute' AND parent_id IS NULL;

-- Location Équipements
UPDATE categories 
SET 
  name_fr = 'Location Équipements',
  name_en = 'Equipment Rental',
  name_ar = 'تأجير المعدات'
WHERE slug = 'location-equipements' AND parent_id IS NULL;

-- Maison & Jardin
UPDATE categories 
SET 
  name_fr = 'Maison & Jardin',
  name_en = 'Home & Garden',
  name_ar = 'المنزل والحديقة'
WHERE slug = 'maison-jardin' AND parent_id IS NULL;

-- Animaux
UPDATE categories 
SET 
  name_fr = 'Animaux',
  name_en = 'Animals',
  name_ar = 'حيوانات'
WHERE slug = 'animaux' AND parent_id IS NULL;

-- Bébé & Enfants
UPDATE categories 
SET 
  name_fr = 'Bébé & Enfants',
  name_en = 'Baby & Kids',
  name_ar = 'أطفال ورضع'
WHERE slug = 'bebe-enfants' AND parent_id IS NULL;

-- Matériel Professionnel
UPDATE categories 
SET 
  name_fr = 'Matériel Professionnel',
  name_en = 'Professional Equipment',
  name_ar = 'معدات مهنية'
WHERE slug = 'materiel-professionnel' AND parent_id IS NULL;
