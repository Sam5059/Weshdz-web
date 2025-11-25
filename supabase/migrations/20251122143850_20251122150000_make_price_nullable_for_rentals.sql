/*
  # Rendre le champ price optionnel pour les locations

  1. Modifications
    - Modifier la colonne `price` pour accepter les valeurs NULL
    - Cela permet de gérer les annonces qui utilisent des tarifs de location (daily_rate, weekly_rate, monthly_rate)
      au lieu d'un prix fixe

  2. Cas d'usage
    - Locations de vacances: utilisent daily_rate, weekly_rate, monthly_rate au lieu de price
    - Locations d'équipements: peuvent utiliser daily_rate au lieu de price
    - Ventes classiques: continuent d'utiliser price normalement

  3. Sécurité
    - Les politiques RLS existantes ne sont pas affectées
*/

-- Rendre la colonne price nullable
ALTER TABLE listings ALTER COLUMN price DROP NOT NULL;

-- Ajouter un commentaire explicatif
COMMENT ON COLUMN listings.price IS 'Prix de vente ou location (optionnel si des tarifs spécifiques sont utilisés comme daily_rate, weekly_rate, monthly_rate)';
