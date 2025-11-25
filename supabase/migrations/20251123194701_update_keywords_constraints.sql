/*
  # Mise à jour des contraintes de la table keywords

  1. Modifications
    - Supprimer les contraintes restrictives sur entity_type
    - Modifier la contrainte weight (1-100 au lieu de 1-10)
    - Permet d'ajouter des keywords pour TOUS les types d'entités

  2. Nouveaux types d'entités supportés
    - animal_type_* : Types d'animaux (chat, chien, oiseau, etc.)
    - dog_breed, cat_breed : Races d'animaux
    - electronic_brand_* : Marques électroniques
    - device_type_* : Types d'appareils
    - property_type_* : Types de biens immobiliers
    - contract_type_* : Types de contrats
    - job_title_* : Titres de postes
    - clothing_type_* : Types de vêtements
    - service_type_* : Types de services
    - book_genre_* : Genres de livres
    - furniture_type_* : Types de meubles
    - baby_item_* : Articles bébé
    - leisure_type_* : Types de loisirs
    - Et bien d'autres...

  3. Sécurité
    - La table reste protégée par RLS
*/

-- Supprimer l'ancienne contrainte sur entity_type (trop restrictive)
ALTER TABLE keywords DROP CONSTRAINT IF EXISTS keywords_entity_type_check;

-- Supprimer l'ancienne contrainte sur weight
ALTER TABLE keywords DROP CONSTRAINT IF EXISTS keywords_weight_check;

-- Ajouter nouvelle contrainte sur weight (1-100)
ALTER TABLE keywords ADD CONSTRAINT keywords_weight_check 
  CHECK (weight >= 1 AND weight <= 100);

-- Ajouter une contrainte basique pour entity_type (non vide)
ALTER TABLE keywords ADD CONSTRAINT keywords_entity_type_not_empty 
  CHECK (entity_type IS NOT NULL AND length(trim(entity_type)) > 0);

-- Nettoyer la table pour repartir de zéro
TRUNCATE keywords;
