/*
  ═══════════════════════════════════════════════════════════════
  # AJOUT SYSTÈME PROMOTIONS AUX ANNONCES
  ═══════════════════════════════════════════════════════════════

  ## 🎯 OBJECTIF
  Ajouter la possibilité de mettre des promotions temporaires sur les annonces
  avec pourcentage de réduction et date de fin.

  ## 📊 TABLES MODIFIÉES
  - `listings` → Ajout de 3 colonnes pour gérer les promotions

  ## 🆕 NOUVEAUX CHAMPS
  
  ### 1. promotion_active (boolean)
  - Indique si une promotion est actuellement active
  - Valeur par défaut: false
  - Permet d'activer/désactiver une promo sans perdre les données
  
  ### 2. promotion_discount (numeric 5,2)
  - Pourcentage de réduction (0.00 à 100.00)
  - Exemples: 15.00 = 15% de réduction, 20.50 = 20.5% de réduction
  - Contrainte: Doit être entre 0 et 100
  - NULL = Pas de promotion configurée
  
  ### 3. promotion_end_date (timestamptz)
  - Date et heure de fin de la promotion
  - Format timezone aware pour gérer les fuseaux horaires
  - NULL = Pas de date limite (promotion permanente si active)
  
  ## 🔗 RELATIONS AVEC AUTRES TABLES
  - Table `listings` (existante)
    ↳ Pas de nouvelle foreign key
    ↳ Utilise les permissions RLS existantes
  
  ## 🎨 UTILISATION DANS L'APPLICATION
  
  ### Frontend (React):
  - CreateListing.jsx → Formulaire pour définir la promo
  - EditListing.jsx → Modification de la promo existante
  - ListingCard → Affichage badge "PROMO -X%"
  - ListingDetail.jsx → Prix barré + nouveau prix
  
  ### Calcul du prix promo:
  prix_final = prix * (1 - promotion_discount / 100)
  Exemple: 50000 DA - 20% = 40000 DA
  
  ## 🔒 SÉCURITÉ
  - RLS: Hérite des politiques existantes de la table listings
    ↳ Seul le propriétaire peut modifier sa promotion
    ↳ Tout le monde peut voir les promotions actives
  
  ## 📅 GESTION AUTOMATIQUE
  - TODO Future: Fonction PostgreSQL pour désactiver automatiquement
    les promotions expirées (vérification quotidienne via cron)
  
  ═══════════════════════════════════════════════════════════════
*/

-- ═══════════════════════════════════════════════════════════════
-- AJOUT DES COLONNES PROMOTIONS
-- ═══════════════════════════════════════════════════════════════

-- 1️⃣ Colonne: promotion_active
-- Indique si la promotion est actuellement appliquée
-- Par défaut FALSE (pas de promo au départ)
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS promotion_active boolean DEFAULT false;

-- 2️⃣ Colonne: promotion_discount
-- Stocke le pourcentage de réduction
-- CHECK: Force la valeur entre 0 et 100
-- Permet 2 décimales pour des promos précises (ex: 15.50%)
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS promotion_discount numeric(5,2) 
CHECK (promotion_discount >= 0 AND promotion_discount <= 100);

-- 3️⃣ Colonne: promotion_end_date
-- Date de fin de la promotion
-- timestamptz = gère automatiquement les fuseaux horaires
-- NULL = pas de limite de temps
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS promotion_end_date timestamptz;

-- ═══════════════════════════════════════════════════════════════
-- COMMENTAIRES POUR LA DOCUMENTATION
-- ═══════════════════════════════════════════════════════════════

COMMENT ON COLUMN listings.promotion_active IS 
'Active/désactive la promotion. TRUE = promo affichée, FALSE = prix normal';

COMMENT ON COLUMN listings.promotion_discount IS 
'Pourcentage de réduction (0-100). Exemple: 15.00 = 15% de réduction. NULL = pas de promo';

COMMENT ON COLUMN listings.promotion_end_date IS 
'Date de fin de la promotion. NULL = pas de limite. Format: 2025-12-31 23:59:59+00';

-- ═══════════════════════════════════════════════════════════════
-- INDEX POUR OPTIMISER LES REQUÊTES
-- ═══════════════════════════════════════════════════════════════

-- Index pour trouver rapidement toutes les annonces en promo
-- Utilisé par: Page d'accueil pour section "Promotions"
CREATE INDEX IF NOT EXISTS idx_listings_promotion_active 
ON listings(promotion_active) 
WHERE promotion_active = true;

-- Index composé pour filtrer par promo + date
-- Utilisé par: Fonction de nettoyage automatique des promos expirées
CREATE INDEX IF NOT EXISTS idx_listings_promo_end_date 
ON listings(promotion_active, promotion_end_date) 
WHERE promotion_active = true;