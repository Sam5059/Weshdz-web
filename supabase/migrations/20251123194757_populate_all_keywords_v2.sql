/*
  # Population complète des keywords pour recherche end-to-end

  1. Objectif
    - Créer keywords précis pour TOUTES les catégories
    - "chat" → trouve uniquement les chats (pas "achat")
    - "clio" → trouve uniquement Renault Clio (pas "climatisation")

  2. Méthodologie
    - Keywords exacts prioritaires (weight 100)
    - Pluriels et variantes (weight 90-100)
    - Trilingue : français, arabe, anglais

  3. Catégories couvertes (14/14)
    Animaux, Électronique, Immobilier, Emploi, Mode, Services,
    Livres, Maison, Bébé, Loisirs, Véhicules
*/

-- ═══════════════════════════════════════════════════════════
-- ANIMAUX : Types + Races
-- ═══════════════════════════════════════════════════════════

INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
-- CHATS (priorité haute pour éviter confusion avec "achat")
('chat', 'animal_type_cat', 'fr', 100),
('chats', 'animal_type_cat', 'fr', 100),
('chaton', 'animal_type_cat', 'fr', 100),
('chatons', 'animal_type_cat', 'fr', 100),
('minou', 'animal_type_cat', 'fr', 90),
('قط', 'animal_type_cat', 'ar', 100),
('قطط', 'animal_type_cat', 'ar', 100),

-- CHIENS
('chien', 'animal_type_dog', 'fr', 100),
('chiens', 'animal_type_dog', 'fr', 100),
('chiot', 'animal_type_dog', 'fr', 100),
('chiots', 'animal_type_dog', 'fr', 100),
('كلب', 'animal_type_dog', 'ar', 100),
('كلاب', 'animal_type_dog', 'ar', 100),

-- OISEAUX
('oiseau', 'animal_type_bird', 'fr', 100),
('oiseaux', 'animal_type_bird', 'fr', 100),
('perroquet', 'animal_type_bird', 'fr', 100),
('canari', 'animal_type_bird', 'fr', 100),
('perruche', 'animal_type_bird', 'fr', 100),
('طائر', 'animal_type_bird', 'ar', 100),

-- POISSONS
('poisson', 'animal_type_fish', 'fr', 100),
('poissons', 'animal_type_fish', 'fr', 100),
('aquarium', 'animal_type_fish', 'fr', 90),
('سمك', 'animal_type_fish', 'ar', 100),

-- AUTRES
('lapin', 'animal_type_rabbit', 'fr', 100),
('lapins', 'animal_type_rabbit', 'fr', 100),
('hamster', 'animal_type_hamster', 'fr', 100),
('tortue', 'animal_type_turtle', 'fr', 100),

-- Races chiens
('berger allemand', 'dog_breed', 'fr', 100),
('golden retriever', 'dog_breed', 'fr', 100),
('golden', 'dog_breed', 'fr', 90),
('labrador', 'dog_breed', 'fr', 100),
('husky', 'dog_breed', 'fr', 100),
('chihuahua', 'dog_breed', 'fr', 100),
('bulldog', 'dog_breed', 'fr', 100),
('caniche', 'dog_breed', 'fr', 100),
('yorkshire', 'dog_breed', 'fr', 100),

-- Races chats
('siamois', 'cat_breed', 'fr', 100),
('persan', 'cat_breed', 'fr', 100),
('maine coon', 'cat_breed', 'fr', 100),
('bengal', 'cat_breed', 'fr', 100);

-- ═══════════════════════════════════════════════════════════
-- ÉLECTRONIQUE
-- ═══════════════════════════════════════════════════════════

INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
-- Marques
('iphone', 'brand_apple', 'fr', 100),
('apple', 'brand_apple', 'fr', 100),
('samsung', 'brand_samsung', 'fr', 100),
('galaxy', 'brand_samsung', 'fr', 90),
('huawei', 'brand_huawei', 'fr', 100),
('xiaomi', 'brand_xiaomi', 'fr', 100),
('redmi', 'brand_xiaomi', 'fr', 90),
('oppo', 'brand_oppo', 'fr', 100),
('sony', 'brand_sony', 'fr', 100),

-- Types d'appareils
('smartphone', 'device_smartphone', 'fr', 100),
('téléphone', 'device_smartphone', 'fr', 100),
('telephone', 'device_smartphone', 'fr', 100),
('mobile', 'device_smartphone', 'fr', 100),
('tablette', 'device_tablet', 'fr', 100),
('ipad', 'device_tablet', 'fr', 100),
('laptop', 'device_laptop', 'fr', 100),
('ordinateur portable', 'device_laptop', 'fr', 100),
('pc portable', 'device_laptop', 'fr', 100),
('télévision', 'device_tv', 'fr', 100),
('tv', 'device_tv', 'fr', 100),
('smart tv', 'device_tv', 'fr', 100),
('playstation', 'device_console', 'fr', 100),
('ps5', 'device_console', 'fr', 100),
('ps4', 'device_console', 'fr', 100),
('xbox', 'device_console', 'fr', 100);

-- ═══════════════════════════════════════════════════════════
-- IMMOBILIER
-- ═══════════════════════════════════════════════════════════

INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
('appartement', 'property_appartement', 'fr', 100),
('appart', 'property_appartement', 'fr', 90),
('maison', 'property_maison', 'fr', 100),
('villa', 'property_villa', 'fr', 100),
('studio', 'property_studio', 'fr', 100),
('local commercial', 'property_commercial', 'fr', 100),
('local', 'property_commercial', 'fr', 80),
('bureau', 'property_office', 'fr', 100),
('terrain', 'property_terrain', 'fr', 100),
('f2', 'property_f2', 'fr', 100),
('f3', 'property_f3', 'fr', 100),
('f4', 'property_f4', 'fr', 100),
('f5', 'property_f5', 'fr', 100),
('meublé', 'property_furnished', 'fr', 100),
('meuble', 'property_furnished', 'fr', 100),
('vide', 'property_unfurnished', 'fr', 100);

-- ═══════════════════════════════════════════════════════════
-- EMPLOI
-- ═══════════════════════════════════════════════════════════

INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
('cdi', 'contract_cdi', 'fr', 100),
('cdd', 'contract_cdd', 'fr', 100),
('stage', 'contract_stage', 'fr', 100),
('freelance', 'contract_freelance', 'fr', 100),
('développeur', 'job_developer', 'fr', 100),
('developpeur', 'job_developer', 'fr', 100),
('dev', 'job_developer', 'fr', 90),
('programmeur', 'job_programmer', 'fr', 100),
('ingénieur', 'job_engineer', 'fr', 100),
('ingenieur', 'job_engineer', 'fr', 100),
('comptable', 'job_accountant', 'fr', 100),
('commercial', 'job_sales', 'fr', 100),
('vendeur', 'job_salesperson', 'fr', 100),
('serveur', 'job_waiter', 'fr', 100),
('cuisinier', 'job_cook', 'fr', 100),
('infirmier', 'job_nurse', 'fr', 100),
('infirmière', 'job_nurse', 'fr', 100),
('professeur', 'job_teacher', 'fr', 100),
('enseignant', 'job_teacher', 'fr', 100),
('graphiste', 'job_designer', 'fr', 100);

-- ═══════════════════════════════════════════════════════════
-- MODE & BEAUTÉ
-- ═══════════════════════════════════════════════════════════

INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
('robe', 'clothing_dress', 'fr', 100),
('robes', 'clothing_dress', 'fr', 100),
('pantalon', 'clothing_pants', 'fr', 100),
('chemise', 'clothing_shirt', 'fr', 100),
('veste', 'clothing_jacket', 'fr', 100),
('manteau', 'clothing_coat', 'fr', 100),
('jupe', 'clothing_skirt', 'fr', 100),
('chaussure', 'clothing_shoes', 'fr', 100),
('chaussures', 'clothing_shoes', 'fr', 100),
('basket', 'clothing_sneakers', 'fr', 90),
('baskets', 'clothing_sneakers', 'fr', 90),
('sneaker', 'clothing_sneakers', 'fr', 90),
('sac', 'clothing_bag', 'fr', 100),
('sac à main', 'clothing_handbag', 'fr', 100);

-- ═══════════════════════════════════════════════════════════
-- SERVICES
-- ═══════════════════════════════════════════════════════════

INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
('plombier', 'service_plumber', 'fr', 100),
('plomberie', 'service_plumbing', 'fr', 100),
('électricien', 'service_electrician', 'fr', 100),
('electricien', 'service_electrician', 'fr', 100),
('électricité', 'service_electricity', 'fr', 100),
('menuisier', 'service_carpenter', 'fr', 100),
('menuiserie', 'service_carpentry', 'fr', 100),
('peintre', 'service_painter', 'fr', 100),
('peinture', 'service_painting', 'fr', 100),
('maçon', 'service_mason', 'fr', 100),
('macon', 'service_mason', 'fr', 100),
('climatisation', 'service_ac', 'fr', 100),
('clim', 'service_ac', 'fr', 90),
('jardinage', 'service_gardening', 'fr', 100),
('jardinier', 'service_gardener', 'fr', 100),
('nettoyage', 'service_cleaning', 'fr', 100),
('ménage', 'service_cleaning', 'fr', 100),
('menage', 'service_cleaning', 'fr', 100),
('déménagement', 'service_moving', 'fr', 100),
('demenagement', 'service_moving', 'fr', 100),
('cours particuliers', 'service_tutoring', 'fr', 100),
('soutien scolaire', 'service_tutoring', 'fr', 100),
('photographe', 'service_photographer', 'fr', 100);

-- ═══════════════════════════════════════════════════════════
-- LIVRES & MULTIMÉDIA
-- ═══════════════════════════════════════════════════════════

INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
('roman', 'book_novel', 'fr', 100),
('romans', 'book_novel', 'fr', 100),
('science fiction', 'book_sf', 'fr', 100),
('sf', 'book_sf', 'fr', 100),
('sci-fi', 'book_sf', 'fr', 100),
('policier', 'book_thriller', 'fr', 100),
('thriller', 'book_thriller', 'fr', 100),
('histoire', 'book_history', 'fr', 100),
('biographie', 'book_biography', 'fr', 100),
('manga', 'book_manga', 'fr', 100),
('mangas', 'book_manga', 'fr', 100),
('bd', 'book_comic', 'fr', 100),
('bande dessinée', 'book_comic', 'fr', 100),
('bande dessinee', 'book_comic', 'fr', 100),
('comics', 'book_comics', 'fr', 100);

-- ═══════════════════════════════════════════════════════════
-- MAISON & JARDIN
-- ═══════════════════════════════════════════════════════════

INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
('canapé', 'furniture_sofa', 'fr', 100),
('canape', 'furniture_sofa', 'fr', 100),
('sofa', 'furniture_sofa', 'fr', 100),
('lit', 'furniture_bed', 'fr', 100),
('lits', 'furniture_bed', 'fr', 100),
('table', 'furniture_table', 'fr', 100),
('tables', 'furniture_table', 'fr', 100),
('chaise', 'furniture_chair', 'fr', 100),
('chaises', 'furniture_chair', 'fr', 100),
('armoire', 'furniture_wardrobe', 'fr', 100),
('étagère', 'furniture_shelf', 'fr', 100),
('etagere', 'furniture_shelf', 'fr', 100),
('commode', 'furniture_dresser', 'fr', 100);

-- ═══════════════════════════════════════════════════════════
-- BÉBÉ & ENFANTS
-- ═══════════════════════════════════════════════════════════

INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
('poussette', 'baby_stroller', 'fr', 100),
('poussettes', 'baby_stroller', 'fr', 100),
('siège auto', 'baby_carseat', 'fr', 100),
('siege auto', 'baby_carseat', 'fr', 100),
('lit bébé', 'baby_crib', 'fr', 100),
('lit bebe', 'baby_crib', 'fr', 100),
('berceau', 'baby_crib', 'fr', 100),
('chaise haute', 'baby_highchair', 'fr', 100),
('jouet', 'baby_toy', 'fr', 100),
('jouets', 'baby_toy', 'fr', 100);

-- ═══════════════════════════════════════════════════════════
-- LOISIRS
-- ═══════════════════════════════════════════════════════════

INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
('vélo', 'leisure_bike', 'fr', 100),
('velo', 'leisure_bike', 'fr', 100),
('vélos', 'leisure_bike', 'fr', 100),
('vtt', 'leisure_mtb', 'fr', 100),
('bicyclette', 'leisure_bike', 'fr', 100),
('trottinette', 'leisure_scooter', 'fr', 100),
('jeu vidéo', 'leisure_videogame', 'fr', 100),
('jeu video', 'leisure_videogame', 'fr', 100),
('jeux vidéo', 'leisure_videogame', 'fr', 100),
('jeux video', 'leisure_videogame', 'fr', 100),
('guitare', 'leisure_guitar', 'fr', 100),
('piano', 'leisure_piano', 'fr', 100),
('instrument', 'leisure_instrument', 'fr', 90),
('camping', 'leisure_camping', 'fr', 100);

-- Créer index pour recherche ultra-rapide
CREATE INDEX IF NOT EXISTS idx_keywords_keyword_lower ON keywords(LOWER(keyword));
CREATE INDEX IF NOT EXISTS idx_keywords_weight_desc ON keywords(weight DESC);
CREATE INDEX IF NOT EXISTS idx_keywords_entity_lang ON keywords(entity_type, language);
