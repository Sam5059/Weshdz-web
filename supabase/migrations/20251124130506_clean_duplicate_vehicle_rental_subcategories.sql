/*
  # Nettoyer les doublons de sous-catégories de location

  1. Suppressions
    - Supprimer les anciennes sous-catégories en doublon
    - Garder uniquement location-voitures, location-motos, location-camions, location-utilitaires
*/

-- Supprimer les doublons
DELETE FROM categories 
WHERE slug IN ('voitures-location', 'motos-location', 'camions-location', 'utilitaires')
AND parent_id = (SELECT id FROM categories WHERE slug = 'location-vehicules');
