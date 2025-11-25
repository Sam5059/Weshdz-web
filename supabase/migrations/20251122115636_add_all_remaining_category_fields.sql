/*
  # Add Fields for All Remaining Categories

  ## Purpose
  Add specialized fields for all categories that don't have detail fields yet:
  - Électronique (Electronics)
  - Mode (Fashion)
  - Maison (Home/Furniture)
  - Loisirs (Leisure)
  - Animaux (Animals/Pets)
  - Bébé & Enfants (Baby & Kids)
  - Location Équipements & Vacances (Equipment & Vacation Rentals)
  - Matériel Professionnel (Professional Equipment)

  ## New Fields (32 fields total)

  ### Électronique (8 fields)
  - device_type: Type d'appareil (smartphone, laptop, tablet, TV, etc.)
  - storage: Capacité de stockage (32GB, 256GB, 1TB, etc.)
  - ram: Mémoire RAM (4GB, 8GB, 16GB, etc.)
  - battery_condition: État de la batterie (excellent, bon, moyen, à remplacer)
  - warranty: Garantie restante (text)
  - accessories_included: Accessoires inclus (array)
  - processor: Processeur (text)
  - screen_size: Taille écran (text)

  ### Mode (6 fields)
  - clothing_type: Type vêtement/article (t-shirt, pantalon, robe, etc.)
  - size: Taille (XS, S, M, L, XL, 38, 40, etc.)
  - material: Matière (coton, laine, cuir, polyester, etc.)
  - gender: Genre (homme, femme, mixte, enfant)
  - season: Saison (été, hiver, mi-saison, toutes saisons)
  - brand_fashion: Marque (text) - separate from vehicle brand

  ### Maison (5 fields)
  - furniture_type: Type de meuble/article (canapé, lit, table, chaise, etc.)
  - dimensions: Dimensions L x l x h (text)
  - materials: Matériaux (bois, métal, tissu, verre, etc.)
  - style: Style (moderne, classique, scandinave, industriel, etc.)
  - assembly_required: Montage requis (boolean)

  ### Loisirs (4 fields)
  - leisure_type: Type d'article (sport, jeu, instrument, collection)
  - age_recommended: Âge recommandé (text)
  - players_count: Nombre de joueurs (text)
  - difficulty_level: Niveau difficulté (débutant, intermédiaire, avancé)

  ### Animaux (7 fields)
  - animal_type: Type d'animal (chien, chat, oiseau, poisson, etc.)
  - breed: Race (text)
  - animal_age: Âge de l'animal (text)
  - animal_gender: Sexe (mâle, femelle)
  - vaccinated: Vacciné (boolean)
  - pedigree: Pedigree (boolean)
  - neutered: Stérilisé (boolean)

  ### Bébé & Enfants (4 fields)
  - age_range: Tranche d'âge (0-6 mois, 6-12 mois, 1-3 ans, etc.)
  - child_gender: Genre enfant (garçon, fille, mixte)
  - safety_standard: Norme de sécurité (text)
  - baby_item_type: Type article (vêtement, jouet, puériculture, mobilier)

  ### Location & Équipements (6 fields)
  - rental_duration: Durée de location (heure, jour, semaine, mois)
  - daily_rate: Tarif journalier (numeric)
  - weekly_rate: Tarif hebdomadaire (numeric)
  - monthly_rate: Tarif mensuel (numeric)
  - deposit_equipment: Caution équipement (numeric)
  - included_km: Kilométrage inclus pour véhicules (integer)

  ### Matériel Professionnel (2 fields)
  - equipment_category: Catégorie équipement (informatique, médical, BTP, etc.)
  - certification: Certification/Normes (text)
*/

-- Électronique
ALTER TABLE listings ADD COLUMN IF NOT EXISTS device_type text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS storage text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS ram text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS battery_condition text 
  CHECK (battery_condition IS NULL OR battery_condition IN ('excellent', 'bon', 'moyen', 'a_remplacer'));
ALTER TABLE listings ADD COLUMN IF NOT EXISTS warranty text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS accessories_included text[] DEFAULT '{}';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS processor text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS screen_size text;

COMMENT ON COLUMN listings.device_type IS 'Type appareil électronique: smartphone, laptop, tablet, TV, etc.';
COMMENT ON COLUMN listings.storage IS 'Capacité stockage: 32GB, 256GB, 1TB, etc.';
COMMENT ON COLUMN listings.ram IS 'Mémoire RAM: 4GB, 8GB, 16GB, etc.';
COMMENT ON COLUMN listings.battery_condition IS 'État batterie: excellent, bon, moyen, a_remplacer';
COMMENT ON COLUMN listings.warranty IS 'Garantie restante (durée)';
COMMENT ON COLUMN listings.accessories_included IS 'Accessoires inclus (chargeur, étui, écouteurs, etc.)';
COMMENT ON COLUMN listings.processor IS 'Processeur (Intel i5, Snapdragon 888, etc.)';
COMMENT ON COLUMN listings.screen_size IS 'Taille écran (6.1", 15.6", 55", etc.)';

-- Mode
ALTER TABLE listings ADD COLUMN IF NOT EXISTS clothing_type text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS size text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS material text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS gender text
  CHECK (gender IS NULL OR gender IN ('homme', 'femme', 'mixte', 'enfant'));
ALTER TABLE listings ADD COLUMN IF NOT EXISTS season text
  CHECK (season IS NULL OR season IN ('ete', 'hiver', 'mi_saison', 'toutes_saisons'));
ALTER TABLE listings ADD COLUMN IF NOT EXISTS brand_fashion text;

COMMENT ON COLUMN listings.clothing_type IS 'Type vêtement: t-shirt, pantalon, robe, veste, etc.';
COMMENT ON COLUMN listings.size IS 'Taille: XS, S, M, L, XL, 36, 38, 40, 42, etc.';
COMMENT ON COLUMN listings.material IS 'Matière: coton, laine, cuir, polyester, soie, etc.';
COMMENT ON COLUMN listings.gender IS 'Genre: homme, femme, mixte, enfant';
COMMENT ON COLUMN listings.season IS 'Saison: ete, hiver, mi_saison, toutes_saisons';
COMMENT ON COLUMN listings.brand_fashion IS 'Marque de mode/vêtement';

-- Maison
ALTER TABLE listings ADD COLUMN IF NOT EXISTS furniture_type text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS dimensions text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS materials text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS style text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS assembly_required boolean DEFAULT false;

COMMENT ON COLUMN listings.furniture_type IS 'Type meuble: canapé, lit, table, chaise, armoire, etc.';
COMMENT ON COLUMN listings.dimensions IS 'Dimensions L x l x h (ex: 200 x 80 x 75 cm)';
COMMENT ON COLUMN listings.materials IS 'Matériaux: bois, métal, tissu, verre, plastique, etc.';
COMMENT ON COLUMN listings.style IS 'Style: moderne, classique, scandinave, industriel, rustique, etc.';
COMMENT ON COLUMN listings.assembly_required IS 'Montage requis';

-- Loisirs
ALTER TABLE listings ADD COLUMN IF NOT EXISTS leisure_type text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS age_recommended text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS players_count text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS difficulty_level text
  CHECK (difficulty_level IS NULL OR difficulty_level IN ('debutant', 'intermediaire', 'avance', 'expert'));

COMMENT ON COLUMN listings.leisure_type IS 'Type article loisirs: sport, jeu, instrument, collection, etc.';
COMMENT ON COLUMN listings.age_recommended IS 'Âge recommandé (ex: 3+, 12+, Adulte)';
COMMENT ON COLUMN listings.players_count IS 'Nombre de joueurs (ex: 2-4, 1-8, Solo)';
COMMENT ON COLUMN listings.difficulty_level IS 'Niveau: debutant, intermediaire, avance, expert';

-- Animaux
ALTER TABLE listings ADD COLUMN IF NOT EXISTS animal_type text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS breed text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS animal_age text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS animal_gender text
  CHECK (animal_gender IS NULL OR animal_gender IN ('male', 'femelle'));
ALTER TABLE listings ADD COLUMN IF NOT EXISTS vaccinated boolean DEFAULT false;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS pedigree boolean DEFAULT false;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS neutered boolean DEFAULT false;

COMMENT ON COLUMN listings.animal_type IS 'Type animal: chien, chat, oiseau, poisson, lapin, etc.';
COMMENT ON COLUMN listings.breed IS 'Race de l''animal';
COMMENT ON COLUMN listings.animal_age IS 'Âge (ex: 2 mois, 1 an, 5 ans)';
COMMENT ON COLUMN listings.animal_gender IS 'Sexe: male, femelle';
COMMENT ON COLUMN listings.vaccinated IS 'Animal vacciné';
COMMENT ON COLUMN listings.pedigree IS 'Possède un pedigree';
COMMENT ON COLUMN listings.neutered IS 'Animal stérilisé/castré';

-- Bébé & Enfants
ALTER TABLE listings ADD COLUMN IF NOT EXISTS age_range text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS child_gender text
  CHECK (child_gender IS NULL OR child_gender IN ('garcon', 'fille', 'mixte'));
ALTER TABLE listings ADD COLUMN IF NOT EXISTS safety_standard text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS baby_item_type text;

COMMENT ON COLUMN listings.age_range IS 'Tranche âge: 0-6 mois, 6-12 mois, 1-3 ans, 3-6 ans, etc.';
COMMENT ON COLUMN listings.child_gender IS 'Genre: garcon, fille, mixte';
COMMENT ON COLUMN listings.safety_standard IS 'Norme sécurité (CE, NF, etc.)';
COMMENT ON COLUMN listings.baby_item_type IS 'Type: vetement, jouet, puericulture, mobilier';

-- Location & Équipements
ALTER TABLE listings ADD COLUMN IF NOT EXISTS rental_duration text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS daily_rate numeric CHECK (daily_rate IS NULL OR daily_rate >= 0);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS weekly_rate numeric CHECK (weekly_rate IS NULL OR weekly_rate >= 0);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS monthly_rate numeric CHECK (monthly_rate IS NULL OR monthly_rate >= 0);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS deposit_equipment numeric CHECK (deposit_equipment IS NULL OR deposit_equipment >= 0);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS included_km integer CHECK (included_km IS NULL OR included_km >= 0);

COMMENT ON COLUMN listings.rental_duration IS 'Durée min location: heure, jour, semaine, mois';
COMMENT ON COLUMN listings.daily_rate IS 'Tarif à la journée';
COMMENT ON COLUMN listings.weekly_rate IS 'Tarif à la semaine';
COMMENT ON COLUMN listings.monthly_rate IS 'Tarif au mois';
COMMENT ON COLUMN listings.deposit_equipment IS 'Caution pour équipement/location';
COMMENT ON COLUMN listings.included_km IS 'Kilométrage inclus (pour location véhicules)';

-- Matériel Professionnel
ALTER TABLE listings ADD COLUMN IF NOT EXISTS equipment_category text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS certification text;

COMMENT ON COLUMN listings.equipment_category IS 'Catégorie: informatique, médical, BTP, restauration, etc.';
COMMENT ON COLUMN listings.certification IS 'Certifications/Normes professionnelles';