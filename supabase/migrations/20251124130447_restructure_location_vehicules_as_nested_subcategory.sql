/*
  # Restructurer Location Véhicules comme sous-catégorie de Véhicules

  1. Modifications
    - Remettre `location-vehicules` comme sous-catégorie de `vehicules`
    - Créer les sous-sous-catégories sous `location-vehicules`

  2. Structure finale à 3 niveaux
    - Véhicules (niveau 1)
      - Voitures (niveau 2)
      - Motos (niveau 2)
      - Camions (niveau 2)
      - Pièces Auto (niveau 2)
      - Location Véhicules (niveau 2) → qui contient :
        - Voitures location (niveau 3)
        - Motos location (niveau 3)
        - Camions location (niveau 3)
        - Utilitaires location (niveau 3)
*/

-- Remettre Location Véhicules comme sous-catégorie de Véhicules
UPDATE categories 
SET parent_id = 'dfdd7caf-f266-4d55-9fe4-86adb93f8737',
    display_order = 5
WHERE slug = 'location-vehicules';

-- Les sous-catégories de location gardent leur parent_id vers location-vehicules
-- (elles sont déjà correctement configurées)
