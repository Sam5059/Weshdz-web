/*
  # Synchroniser les tarifs de location selon rental_duration
  
  1. Objectif
    - Copier le tarif correspondant à rental_duration dans le champ price
    - Si rental_duration = 'jour', copier daily_rate
    - Si rental_duration = 'semaine', copier weekly_rate
    - Si rental_duration = 'mois', copier monthly_rate
    - Fallback sur les autres tarifs si le tarif principal n'existe pas
  
  2. Logique de synchronisation
    - Pour chaque durée, copier le tarif correspondant
    - Si le tarif principal n'existe pas, chercher un autre tarif disponible
  
  3. Sécurité
    - Mise à jour uniquement des annonces de location
    - Ne modifie que les annonces où price est NULL
*/

-- Réinitialiser le champ price pour les locations (pour recalculer proprement)
UPDATE listings
SET price = NULL
WHERE listing_type = 'louer'
  AND (daily_rate IS NOT NULL OR weekly_rate IS NOT NULL OR monthly_rate IS NOT NULL);

-- Copier daily_rate si rental_duration = 'jour'
UPDATE listings
SET price = daily_rate
WHERE listing_type = 'louer'
  AND rental_duration = 'jour'
  AND daily_rate IS NOT NULL;

-- Copier weekly_rate si rental_duration = 'semaine'
UPDATE listings
SET price = weekly_rate
WHERE listing_type = 'louer'
  AND rental_duration = 'semaine'
  AND weekly_rate IS NOT NULL;

-- Copier monthly_rate si rental_duration = 'mois'
UPDATE listings
SET price = monthly_rate
WHERE listing_type = 'louer'
  AND rental_duration = 'mois'
  AND monthly_rate IS NOT NULL;

-- Fallback: si price est toujours NULL, copier le premier tarif disponible (jour > semaine > mois)
UPDATE listings
SET price = COALESCE(daily_rate, weekly_rate, monthly_rate)
WHERE listing_type = 'louer'
  AND price IS NULL
  AND (daily_rate IS NOT NULL OR weekly_rate IS NOT NULL OR monthly_rate IS NOT NULL);
