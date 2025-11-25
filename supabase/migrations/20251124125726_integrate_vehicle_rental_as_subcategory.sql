/*
  # Intégrer Location Véhicules comme sous-catégorie de Véhicules

  1. Modifications
    - Mettre à jour `location-vehicules` pour qu'elle devienne une sous-catégorie de `vehicules`
    - Définir le parent_id de `location-vehicules` vers la catégorie `vehicules`
    - Ajuster le display_order pour qu'elle apparaisse après les autres sous-catégories

  2. Impact
    - Location Véhicules apparaîtra dans le dropdown Véhicules
    - Les annonces existantes de location véhicules resteront intactes
    - Le menu sera plus cohérent avec toutes les catégories véhicules regroupées
*/

-- Mettre à jour Location Véhicules pour qu'elle devienne sous-catégorie de Véhicules
UPDATE categories 
SET parent_id = 'dfdd7caf-f266-4d55-9fe4-86adb93f8737',
    display_order = 5
WHERE slug = 'location-vehicules';
