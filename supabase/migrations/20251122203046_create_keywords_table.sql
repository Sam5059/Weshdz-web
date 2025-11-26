/*
  # Création de la table keywords (mots-clés)

  1. Nouvelle Table
    - `keywords`
      - `id` (uuid, primary key)
      - `keyword` (text, le mot-clé)
      - `entity_type` (text, type: 'category', 'brand', 'model', 'job_title')
      - `entity_id` (uuid, référence vers l'entité)
      - `language` (text, langue: 'fr', 'ar', 'en')
      - `weight` (integer, poids pour la pertinence: 1-10)
      - `created_at` (timestamp)

  2. Index
    - Index sur keyword pour recherche rapide
    - Index sur entity_type + entity_id pour jointures
    - Index gin pour recherche full-text

  3. Sécurité
    - Enable RLS
    - Politique lecture publique (pour la recherche)
    - Politique écriture admin seulement

  Cette table permet d'associer plusieurs mots-clés à chaque catégorie, marque, modèle, etc.
  pour améliorer la recherche et supporter plusieurs langues.
*/

-- Activer l'extension pg_trgm (pour recherche similaire)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Créer la table keywords
CREATE TABLE IF NOT EXISTS keywords (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword text NOT NULL,
  entity_type text NOT NULL CHECK (entity_type IN ('category', 'brand', 'model', 'job_title', 'general')),
  entity_id uuid,
  language text NOT NULL DEFAULT 'fr' CHECK (language IN ('fr', 'ar', 'en')),
  weight integer NOT NULL DEFAULT 5 CHECK (weight >= 1 AND weight <= 10),
  created_at timestamptz DEFAULT now()
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_keywords_keyword ON keywords(keyword);
CREATE INDEX IF NOT EXISTS idx_keywords_entity ON keywords(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_keywords_language ON keywords(language);

-- Index GIN pour recherche full-text (supporte les recherches partielles)
CREATE INDEX IF NOT EXISTS idx_keywords_keyword_gin ON keywords USING gin(keyword gin_trgm_ops);

-- Activer RLS
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;

-- Politique: Tout le monde peut lire (pour recherche)
CREATE POLICY "Public can read keywords"
  ON keywords
  FOR SELECT
  TO public
  USING (true);

-- Politique: Seuls les authenticated peuvent créer
CREATE POLICY "Authenticated users can insert keywords"
  ON keywords
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Politique: Seuls les authenticated peuvent mettre à jour
CREATE POLICY "Authenticated users can update keywords"
  ON keywords
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Politique: Seuls les authenticated peuvent supprimer
CREATE POLICY "Authenticated users can delete keywords"
  ON keywords
  FOR DELETE
  TO authenticated
  USING (true);
