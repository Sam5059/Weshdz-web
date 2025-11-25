/*
  # Synchroniser les tarifs de location dans le champ price
  
  1. Objectif
    - Copier les valeurs de daily_rate, weekly_rate ou monthly_rate dans le champ price
    - Cela simplifie l'affichage des prix dans l'interface utilisateur
    - Les champs spécifiques de tarifs (daily_rate, weekly_rate, monthly_rate) restent disponibles pour les détails
  
  2. Logique de copie
    - Priorité 1: daily_rate (tarif journalier)
    - Priorité 2: weekly_rate (tarif hebdomadaire)
    - Priorité 3: monthly_rate (tarif mensuel)
  
  3. Cas d'usage
    - Locations de vacances existantes sans champ price renseigné
    - Locations d'équipements avec tarifs spécifiques
  
  4. Sécurité
    - Mise à jour uniquement des annonces où price est NULL
    - Les annonces avec un prix existant ne sont pas modifiées
*/

-- Mettre à jour le champ price pour les annonces de location qui ont un tarif journalier
UPDATE listings
SET price = daily_rate
WHERE listing_type = 'louer'
  AND price IS NULL
  AND daily_rate IS NOT NULL;

-- Mettre à jour le champ price pour les annonces de location qui ont un tarif hebdomadaire (si pas de tarif journalier)
UPDATE listings
SET price = weekly_rate
WHERE listing_type = 'louer'
  AND price IS NULL
  AND weekly_rate IS NOT NULL;

-- Mettre à jour le champ price pour les annonces de location qui ont un tarif mensuel (si pas de tarifs journalier ni hebdomadaire)
UPDATE listings
SET price = monthly_rate
WHERE listing_type = 'louer'
  AND price IS NULL
  AND monthly_rate IS NOT NULL;
