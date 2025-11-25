# 🔑 Système de Mots-Clés (Keywords Database)

## 🎯 Vue d'Ensemble

Une base de données complète de **593 mots-clés** a été créée pour améliorer la recherche dans l'application. Cette base couvre toutes les catégories, sous-catégories, marques, modèles et métiers.

## 📊 Statistiques

| Type | Nombre | Description |
|------|--------|-------------|
| **Modèles** | 297 | Tous les modèles de véhicules + variantes |
| **Catégories** | 168 | Catégories et sous-catégories avec synonymes |
| **Emplois** | 94 | Titres de métiers et secteurs d'activité |
| **Marques** | 34 | Marques de véhicules + variantes |
| **TOTAL** | **593** | Mots-clés uniques |

## 🗄️ Structure de la Table

```sql
CREATE TABLE keywords (
  id uuid PRIMARY KEY,
  keyword text NOT NULL,              -- Le mot-clé (ex: "f3", "bmw", "developpeur")
  entity_type text NOT NULL,          -- Type: 'category', 'brand', 'model', 'job_title'
  entity_id uuid,                     -- ID de l'entité liée (nullable pour job_title)
  language text NOT NULL DEFAULT 'fr', -- Langue: 'fr', 'ar', 'en'
  weight integer NOT NULL DEFAULT 5,   -- Poids de pertinence (1-10)
  created_at timestamptz DEFAULT now()
);
```

## 📚 Contenu de la Base

### 1. Catégories & Sous-Catégories (168 mots-clés)

#### Véhicules
```
voiture, auto, automobile, vehicule, moto, camion, scooter, quad, 
tracteur, car, vehicle, berline, citadine, suv, 4x4, break, 
cabriolet, coupe, monospace, pieces, pneu, jante, phare, batterie...
```

#### Immobilier
```
immobilier, maison, appartement, villa, terrain, duplex, studio, 
f2, f3, f4, f5, local, commercial, pavillon, residence, propriete, 
lot, parcelle, agricole, constructible, boutique, magasin, bureau, 
entrepot, depot...
```

#### Location Immobilière
```
location, louer, bail, locataire, appartement louer, f2 louer, 
f3 louer, f4 louer, maison louer, villa louer, bureau louer, 
studio louer, t1, coworking...
```

#### Emploi
```
emploi, travail, job, recrutement, cdi, cdd, stage, interim, 
freelance, temps partiel, temps plein, offre emploi, poste, 
embauche, recrute, demande emploi, cherche travail, cv, candidature...
```

#### Électronique
```
electronique, telephone, ordinateur, laptop, tablette, tv, 
television, smartphone, iphone, samsung, pc, mobile, android, 
huawei, macbook, imac, gaming, ecran, hifi, enceinte, 
home cinema, frigo, refrigerateur, lave-linge, four...
```

### 2. Marques de Véhicules (34 mots-clés)

```
audi, bmw, bm, mercedes, merc, benz, volkswagen, vw, renault, reno,
peugeot, citroen, ford, toyota, nissan, hyundai, kia, mazda, 
honda, suzuki, fiat, opel, seat, skoda, volvo, jaguar, 
land rover, porsche, ferrari, lamborghini, bentley, aston martin...
```

### 3. Modèles de Véhicules (297 mots-clés)

#### Renault
```
clio, clio 3, clio 4, clio 5, megane, megane 3, megane 4, 
scenic, kangoo, captur, kadjar, talisman, zoe, twingo...
```

#### Peugeot
```
208, 208 ii, 208 2, 308, 308 ii, 308 2, 2008, 3008, 5008, 
partner, boxer, expert...
```

#### BMW
```
1 series, 2 series, 3 series, serie 3, serie3, 320, 330, 
4 series, 5 series, serie 5, serie5, 520, 530, x1, x3, x5, 
m3, m4, m5, i3, i4, ix, z4...
```

#### Volkswagen
```
golf, golf 5, golf 6, golf 7, golf 8, polo, passat, tiguan, 
touareg, t-roc, arteon, caddy, transporter...
```

### 4. Titres d'Emploi & Métiers (94 mots-clés)

#### Informatique & Tech
```
developpeur, developer, programmeur, ingenieur, engineer, 
informaticien, web developer, data scientist, devops, fullstack, 
frontend, backend, it, systeme, reseau
```

#### Vente & Commerce
```
commercial, vendeur, vendeuse, sales, technico-commercial, 
charge affaires, business developer, account manager
```

#### BTP & Construction
```
maçon, plombier, electricien, menuisier, charpentier, peintre, 
chef chantier, conducteur travaux, btp, batiment
```

#### Santé & Médical
```
medecin, infirmier, infirmiere, docteur, pharmacien, 
kinesitherapeute, dentiste, aide-soignant, sage-femme
```

#### Éducation & Formation
```
enseignant, professeur, formateur, instituteur, prof, educateur
```

#### Administration & Gestion
```
assistant, assistante, secretaire, comptable, gestionnaire, 
rh, responsable, directeur, manager, chef
```

#### Hôtellerie & Restauration
```
serveur, serveuse, cuisinier, chef cuisinier, barista, 
receptionniste, hotellerie, restauration
```

#### Transport & Logistique
```
chauffeur, livreur, conducteur, chauffeur poids lourd, 
logisticien, magasinier, taxi, uber
```

#### Marketing & Communication
```
marketing, communication, community manager, graphiste, 
designer, webmaster, redacteur
```

#### Autres Métiers
```
agent securite, gardien, femme menage, menage, nettoyage, 
mecanicien, technicien, artisan, coiffeur, coiffeuse, 
estheticienne, jardinier, agent nettoyage
```

## 🔍 Utilisation de la Base

### Recherche par Mots-Clés

```sql
-- Chercher toutes les catégories liées à "f3"
SELECT c.name, c.slug, k.keyword, k.weight
FROM keywords k
JOIN categories c ON k.entity_id = c.id
WHERE k.keyword ILIKE '%f3%' AND k.entity_type = 'category';

-- Chercher toutes les marques liées à "bm" ou "bmw"
SELECT vb.name, k.keyword, k.weight
FROM keywords k
JOIN vehicle_brands vb ON k.entity_id = vb.id
WHERE k.keyword IN ('bm', 'bmw') AND k.entity_type = 'brand';

-- Chercher tous les emplois liés à "developpeur"
SELECT k.keyword, k.weight
FROM keywords k
WHERE k.keyword ILIKE '%dev%' AND k.entity_type = 'job_title'
ORDER BY k.weight DESC;
```

### Recherche Full-Text avec Similarité

```sql
-- Recherche avec similarité (pg_trgm)
SELECT keyword, entity_type, similarity(keyword, 'clio') as sim
FROM keywords
WHERE keyword % 'clio'  -- Opérateur de similarité
ORDER BY sim DESC
LIMIT 10;
```

### Jointure avec Listings

```sql
-- Trouver listings par mot-clé de catégorie
SELECT l.title, l.price, c.name as category
FROM listings l
JOIN categories c ON l.category_id = c.id
JOIN keywords k ON k.entity_id = c.id
WHERE k.keyword = 'f3' AND k.entity_type = 'category';

-- Trouver listings par mot-clé de marque
SELECT l.title, l.price, vb.name as brand
FROM listings l
JOIN vehicle_brands vb ON l.brand_id = vb.id
JOIN keywords k ON k.entity_id = vb.id
WHERE k.keyword IN ('bmw', 'bm') AND k.entity_type = 'brand';
```

## 🎯 Cas d'Usage

### 1. Recherche Immobilier
```
Utilisateur cherche: "F3"
→ Trouve keywords: f3, f3 louer, f2 (similaire), f4 (similaire)
→ Retourne: Appartements F3, Appartements à louer F3
```

### 2. Recherche Véhicule
```
Utilisateur cherche: "BM"
→ Trouve keywords: bm, bmw
→ Retourne: Toutes annonces BMW (via brand_id)
```

### 3. Recherche Emploi
```
Utilisateur cherche: "dev"
→ Trouve keywords: developpeur, developer, devops, web developer
→ Retourne: Toutes offres contenant ces mots-clés
```

### 4. Recherche Modèle Spécifique
```
Utilisateur cherche: "golf 7"
→ Trouve keywords: golf 7, golf (parent)
→ Retourne: VW Golf (toutes générations) avec priorité Golf 7
```

## 🔑 Avantages du Système

### 1. Recherche Multi-Langues
- Français: "voiture"
- Anglais: "car"
- Arabe: (peut être ajouté)

### 2. Variantes et Synonymes
- "F3" = "appartement 3 pièces"
- "BMW" = "BM"
- "Golf 7" = "Golf VII"

### 3. Poids de Pertinence
- Weight 10: Exact match (ex: "f3" → F3)
- Weight 9: Variante proche (ex: "f3 louer" → F3)
- Weight 8: Similaire (ex: "f2", "f4" quand on cherche F3)
- Weight 7-: Moins pertinent

### 4. Performance
- Index GIN pour recherche rapide
- Index B-Tree sur entity_type + entity_id
- Extension pg_trgm pour similarité

## 📈 Extensions Possibles

### Ajouter Nouveaux Mots-Clés

```sql
-- Ajouter mot-clé pour une catégorie
INSERT INTO keywords (keyword, entity_type, entity_id, language, weight)
SELECT 'duplex', 'category', id, 'fr', 9
FROM categories
WHERE slug = 'appartements';

-- Ajouter variante pour une marque
INSERT INTO keywords (keyword, entity_type, entity_id, language, weight)
SELECT 'merc', 'brand', id, 'fr', 8
FROM vehicle_brands
WHERE name = 'Mercedes';
```

### Recherche Intelligente

```sql
-- Fonction pour recherche intelligente
CREATE OR REPLACE FUNCTION search_by_keyword(search_term text)
RETURNS TABLE (
  listing_id uuid,
  title text,
  relevance integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id,
    l.title,
    MAX(k.weight) as relevance
  FROM listings l
  LEFT JOIN keywords k ON (
    (k.entity_type = 'category' AND k.entity_id = l.category_id) OR
    (k.entity_type = 'brand' AND k.entity_id = l.brand_id) OR
    (k.entity_type = 'model' AND k.entity_id = l.model_id)
  )
  WHERE 
    k.keyword ILIKE '%' || search_term || '%' OR
    l.title ILIKE '%' || search_term || '%'
  GROUP BY l.id, l.title
  ORDER BY relevance DESC;
END;
$$ LANGUAGE plpgsql;
```

## 🔒 Sécurité (RLS)

```sql
-- Lecture publique (pour recherche)
CREATE POLICY "Public can read keywords"
  ON keywords FOR SELECT TO public USING (true);

-- Écriture réservée aux authenticated users
CREATE POLICY "Authenticated users can manage keywords"
  ON keywords FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

## 📊 Maintenance

### Nettoyer Doublons
```sql
DELETE FROM keywords
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (
      PARTITION BY keyword, entity_type, entity_id 
      ORDER BY created_at
    ) as rnum
    FROM keywords
  ) t
  WHERE t.rnum > 1
);
```

### Statistiques
```sql
-- Nombre de mots-clés par type
SELECT entity_type, COUNT(*) 
FROM keywords 
GROUP BY entity_type;

-- Top 20 mots-clés par poids
SELECT keyword, entity_type, weight 
FROM keywords 
ORDER BY weight DESC, keyword 
LIMIT 20;
```

---

**Date de Création**: 2025-11-22
**Nombre Total de Mots-Clés**: 593
**Status**: 🟢 Opérationnel
**Extension**: pg_trgm activée pour similarité
