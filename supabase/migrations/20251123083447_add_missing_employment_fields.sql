/*
  # Add Missing Employment Fields

  1. Missing Columns
    - `contract_type` (text) - Type de contrat (CDI, CDD, Freelance, Stage, Intérim, Saisonnier)
    - `experience_level` (text) - Niveau d'expérience requis (Débutant, Intermédiaire, Confirmé, Expert)

  2. Notes
    - Ces colonnes étaient documentées mais pas créées dans la migration précédente
    - Nécessaires pour les filtres Emploi (Type de contrat, Niveau d'expérience)
*/

-- Add missing employment columns
ALTER TABLE listings ADD COLUMN IF NOT EXISTS contract_type text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS experience_level text;
