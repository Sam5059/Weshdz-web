/*
  # Grant Access to User tprbucjdmhddsku

  1. Permissions accordées
    - SELECT: Lecture sur toutes les tables
    - INSERT: Création de nouvelles données
    - UPDATE: Modification des données existantes
    - DELETE: Suppression de données
    - USAGE: Utilisation des schémas

  2. Tables concernées
    - listings (annonces)
    - profiles (profils utilisateurs)
    - categories (catégories)
    - communes (communes algériennes)
    - vehicle_brands (marques véhicules)
    - vehicle_models (modèles véhicules)
    - keywords (mots-clés pour recherche)
    - favorites (favoris)
    - search_history (historique recherche)

  3. Accès Storage
    - bucket 'listings' pour upload d'images

  4. Notes importantes
    - Accès complet en lecture/écriture
    - Permissions sur le schéma public et storage
*/

-- =====================================================
-- CRÉER LE RÔLE SI N'EXISTE PAS
-- =====================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'tprbucjdmhddsku') THEN
    CREATE ROLE tprbucjdmhddsku WITH LOGIN PASSWORD 'votre_mot_de_passe_securise';
  END IF;
END $$;

-- =====================================================
-- ACCORDER PERMISSIONS SUR LE SCHÉMA PUBLIC
-- =====================================================
GRANT USAGE ON SCHEMA public TO tprbucjdmhddsku;
GRANT ALL PRIVILEGES ON SCHEMA public TO tprbucjdmhddsku;

-- =====================================================
-- ACCORDER PERMISSIONS SUR TOUTES LES TABLES
-- =====================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO tprbucjdmhddsku;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO tprbucjdmhddsku;

-- =====================================================
-- PERMISSIONS PAR DÉFAUT POUR LES FUTURES TABLES
-- =====================================================
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO tprbucjdmhddsku;

ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT USAGE, SELECT ON SEQUENCES TO tprbucjdmhddsku;

-- =====================================================
-- ACCÈS STORAGE (bucket listings)
-- =====================================================
GRANT ALL ON storage.buckets TO tprbucjdmhddsku;
GRANT ALL ON storage.objects TO tprbucjdmhddsku;

-- =====================================================
-- PERMISSIONS SPÉCIFIQUES PAR TABLE (explicites)
-- =====================================================

-- Listings
GRANT ALL PRIVILEGES ON listings TO tprbucjdmhddsku;

-- Profiles
GRANT ALL PRIVILEGES ON profiles TO tprbucjdmhddsku;

-- Categories
GRANT ALL PRIVILEGES ON categories TO tprbucjdmhddsku;

-- Communes
GRANT ALL PRIVILEGES ON communes TO tprbucjdmhddsku;

-- Vehicle brands & models
GRANT ALL PRIVILEGES ON vehicle_brands TO tprbucjdmhddsku;
GRANT ALL PRIVILEGES ON vehicle_models TO tprbucjdmhddsku;

-- Keywords
GRANT ALL PRIVILEGES ON keywords TO tprbucjdmhddsku;

-- Favorites
GRANT ALL PRIVILEGES ON favorites TO tprbucjdmhddsku;

-- Search history
GRANT ALL PRIVILEGES ON search_history TO tprbucjdmhddsku;

-- =====================================================
-- VÉRIFICATION DES PERMISSIONS
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE 'Permissions accordées avec succès à tprbucjdmhddsku';
  RAISE NOTICE 'Schémas accessibles: public, storage';
  RAISE NOTICE 'Permissions: SELECT, INSERT, UPDATE, DELETE';
END $$;
