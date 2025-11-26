/*
  # Populate Comprehensive Keywords for All Categories

  1. Purpose
    - Create complete keyword mappings for ALL product categories
    - Enable precise search across immobilier, électronique, mode, animaux, services, etc.
    - Support multi-language (FR, AR, EN) for major keywords

  2. Coverage
    - Immobilier: types de propriétés, configurations (F2, F3, F4), états
    - Électronique: marques, types d'appareils
    - Mode & Beauté: types de vêtements, marques
    - Animaux: types, races
    - Services: types de services professionnels
    - Livres & Multimédia: genres
    - Maison & Jardin: types de meubles
    - Emploi: types de contrats, métiers
    - Loisirs: équipements sportifs, instruments
    - Bébé & Enfants: équipements

  3. Weight System
    - 95-100: Termes très spécifiques (races, modèles)
    - 85-94: Termes spécifiques (types, marques)
    - 70-84: Termes généraux (catégories)
*/

-- ═══════════════════════════════════════════════════════════
-- IMMOBILIER - Property Types & Configurations
-- ═══════════════════════════════════════════════════════════
INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
  -- Types de propriétés
  ('appartement', 'property_type_apartment', 'fr', 90),
  ('appart', 'property_type_apartment', 'fr', 90),
  ('maison', 'property_type_house', 'fr', 90),
  ('villa', 'property_type_villa', 'fr', 90),
  ('studio', 'property_type_studio', 'fr', 90),
  ('duplex', 'property_type_duplex', 'fr', 90),
  ('local commercial', 'property_type_commercial', 'fr', 85),
  ('commerce', 'property_type_commercial', 'fr', 85),
  ('bureau', 'property_type_office', 'fr', 85),
  ('terrain', 'property_type_land', 'fr', 85),
  ('ferme', 'property_type_farm', 'fr', 85),
  
  -- Configurations (F2, F3, F4, F5)
  ('f2', 'property_bedrooms_1', 'fr', 95),
  ('f3', 'property_bedrooms_2', 'fr', 95),
  ('f4', 'property_bedrooms_3', 'fr', 95),
  ('f5', 'property_bedrooms_4', 'fr', 95),
  ('f6', 'property_bedrooms_5', 'fr', 95),
  
  -- États
  ('meublé', 'property_furnished', 'fr', 85),
  ('meuble', 'property_furnished', 'fr', 85),
  ('vide', 'property_unfurnished', 'fr', 85),
  ('neuf', 'property_new', 'fr', 85),
  ('ancien', 'property_old', 'fr', 85);

-- ═══════════════════════════════════════════════════════════
-- ÉLECTRONIQUE - Brands & Device Types
-- ═══════════════════════════════════════════════════════════
INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
  -- Marques
  ('apple', 'brand_apple', 'fr', 90),
  ('iphone', 'brand_apple', 'fr', 92),
  ('samsung', 'brand_samsung', 'fr', 90),
  ('huawei', 'brand_huawei', 'fr', 90),
  ('xiaomi', 'brand_xiaomi', 'fr', 90),
  ('oppo', 'brand_oppo', 'fr', 90),
  ('oneplus', 'brand_oneplus', 'fr', 90),
  ('sony', 'brand_sony', 'fr', 90),
  ('lg', 'brand_lg', 'fr', 90),
  ('dell', 'brand_dell', 'fr', 90),
  ('hp', 'brand_hp', 'fr', 90),
  ('lenovo', 'brand_lenovo', 'fr', 90),
  ('asus', 'brand_asus', 'fr', 90),
  ('acer', 'brand_acer', 'fr', 90),
  
  -- Types d'appareils
  ('smartphone', 'device_smartphone', 'fr', 88),
  ('téléphone', 'device_smartphone', 'fr', 88),
  ('telephone', 'device_smartphone', 'fr', 88),
  ('portable', 'device_smartphone', 'fr', 85),
  ('tablette', 'device_tablet', 'fr', 88),
  ('tablet', 'device_tablet', 'fr', 88),
  ('ipad', 'device_tablet', 'fr', 90),
  ('ordinateur', 'device_laptop', 'fr', 85),
  ('laptop', 'device_laptop', 'fr', 88),
  ('pc', 'device_laptop', 'fr', 85),
  ('macbook', 'device_laptop', 'fr', 92),
  ('télévision', 'device_tv', 'fr', 88),
  ('television', 'device_tv', 'fr', 88),
  ('tv', 'device_tv', 'fr', 88),
  ('écran', 'device_monitor', 'fr', 85),
  ('moniteur', 'device_monitor', 'fr', 85),
  ('console', 'device_console', 'fr', 88),
  ('playstation', 'device_console', 'fr', 90),
  ('ps4', 'device_console', 'fr', 92),
  ('ps5', 'device_console', 'fr', 92),
  ('xbox', 'device_console', 'fr', 90),
  ('switch', 'device_console', 'fr', 90);

-- ═══════════════════════════════════════════════════════════
-- MODE & BEAUTÉ - Clothing Types & Brands
-- ═══════════════════════════════════════════════════════════
INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
  -- Types de vêtements
  ('robe', 'clothing_dress', 'fr', 88),
  ('pantalon', 'clothing_pants', 'fr', 88),
  ('jeans', 'clothing_jeans', 'fr', 88),
  ('jean', 'clothing_jeans', 'fr', 88),
  ('chemise', 'clothing_shirt', 'fr', 88),
  ('tshirt', 'clothing_tshirt', 'fr', 88),
  ('t-shirt', 'clothing_tshirt', 'fr', 88),
  ('pull', 'clothing_sweater', 'fr', 88),
  ('veste', 'clothing_jacket', 'fr', 88),
  ('manteau', 'clothing_coat', 'fr', 88),
  ('jupe', 'clothing_skirt', 'fr', 88),
  ('chaussure', 'clothing_shoes', 'fr', 88),
  ('basket', 'clothing_sneakers', 'fr', 88),
  ('baskets', 'clothing_sneakers', 'fr', 88),
  ('sneakers', 'clothing_sneakers', 'fr', 88),
  ('sac', 'clothing_bag', 'fr', 88),
  ('sacoche', 'clothing_bag', 'fr', 88),
  
  -- Marques de mode
  ('nike', 'fashion_brand_nike', 'fr', 90),
  ('adidas', 'fashion_brand_adidas', 'fr', 90),
  ('zara', 'fashion_brand_zara', 'fr', 90),
  ('h&m', 'fashion_brand_hm', 'fr', 90),
  ('gucci', 'fashion_brand_gucci', 'fr', 90),
  ('puma', 'fashion_brand_puma', 'fr', 90);

-- ═══════════════════════════════════════════════════════════
-- ANIMAUX - Animal Types & Breeds
-- ═══════════════════════════════════════════════════════════
INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
  -- Types d'animaux
  ('chat', 'animal_type_cat', 'fr', 95),
  ('chaton', 'animal_type_cat', 'fr', 95),
  ('chien', 'animal_type_dog', 'fr', 95),
  ('chiot', 'animal_type_dog', 'fr', 95),
  ('oiseau', 'animal_type_bird', 'fr', 95),
  ('poisson', 'animal_type_fish', 'fr', 95),
  ('lapin', 'animal_type_rabbit', 'fr', 95),
  ('hamster', 'animal_type_hamster', 'fr', 95),
  ('tortue', 'animal_type_turtle', 'fr', 95),
  ('perroquet', 'animal_type_parrot', 'fr', 95),
  
  -- Races de chiens populaires
  ('berger allemand', 'dog_breed_german_shepherd', 'fr', 98),
  ('husky', 'dog_breed_husky', 'fr', 98),
  ('golden', 'dog_breed_golden', 'fr', 98),
  ('labrador', 'dog_breed_labrador', 'fr', 98),
  ('pitbull', 'dog_breed_pitbull', 'fr', 98),
  ('rottweiler', 'dog_breed_rottweiler', 'fr', 98),
  ('bulldog', 'dog_breed_bulldog', 'fr', 98),
  
  -- Races de chats populaires
  ('persan', 'cat_breed_persian', 'fr', 98),
  ('siamois', 'cat_breed_siamese', 'fr', 98),
  ('maine coon', 'cat_breed_maine_coon', 'fr', 98),
  ('bengal', 'cat_breed_bengal', 'fr', 98);

-- ═══════════════════════════════════════════════════════════
-- SERVICES - Service Types
-- ═══════════════════════════════════════════════════════════
INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
  ('plombier', 'service_plumber', 'fr', 90),
  ('plomberie', 'service_plumbing', 'fr', 90),
  ('électricien', 'service_electrician', 'fr', 90),
  ('electricien', 'service_electrician', 'fr', 90),
  ('électricité', 'service_electricity', 'fr', 90),
  ('electricite', 'service_electricity', 'fr', 90),
  ('menuisier', 'service_carpenter', 'fr', 90),
  ('menuiserie', 'service_carpentry', 'fr', 90),
  ('peintre', 'service_painter', 'fr', 90),
  ('peinture', 'service_painting', 'fr', 90),
  ('maçon', 'service_mason', 'fr', 90),
  ('macon', 'service_mason', 'fr', 90),
  ('maçonnerie', 'service_masonry', 'fr', 90),
  ('maconnerie', 'service_masonry', 'fr', 90),
  ('climatisation', 'service_ac', 'fr', 90),
  ('clim', 'service_ac', 'fr', 90),
  ('jardinage', 'service_gardening', 'fr', 90),
  ('jardinier', 'service_gardener', 'fr', 90),
  ('nettoyage', 'service_cleaning', 'fr', 90),
  ('ménage', 'service_cleaning', 'fr', 90),
  ('menage', 'service_cleaning', 'fr', 90),
  ('déménagement', 'service_moving', 'fr', 90),
  ('demenagement', 'service_moving', 'fr', 90),
  ('cours', 'service_tutoring', 'fr', 85),
  ('soutien scolaire', 'service_tutoring', 'fr', 88),
  ('photographe', 'service_photographer', 'fr', 90),
  ('photo', 'service_photographer', 'fr', 85);

-- ═══════════════════════════════════════════════════════════
-- EMPLOI - Contract Types & Job Titles
-- ═══════════════════════════════════════════════════════════
INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
  -- Types de contrats
  ('cdi', 'contract_cdi', 'fr', 92),
  ('cdd', 'contract_cdd', 'fr', 92),
  ('stage', 'contract_stage', 'fr', 92),
  ('freelance', 'contract_freelance', 'fr', 92),
  ('interim', 'contract_temp', 'fr', 92),
  ('intérim', 'contract_temp', 'fr', 92),
  
  -- Métiers courants
  ('développeur', 'job_developer', 'fr', 88),
  ('developpeur', 'job_developer', 'fr', 88),
  ('ingénieur', 'job_engineer', 'fr', 88),
  ('ingenieur', 'job_engineer', 'fr', 88),
  ('comptable', 'job_accountant', 'fr', 88),
  ('secrétaire', 'job_secretary', 'fr', 88),
  ('secretaire', 'job_secretary', 'fr', 88),
  ('commercial', 'job_sales', 'fr', 88),
  ('vendeur', 'job_salesperson', 'fr', 88),
  ('chef de projet', 'job_project_manager', 'fr', 88),
  ('manager', 'job_manager', 'fr', 85);

-- ═══════════════════════════════════════════════════════════
-- LIVRES & MULTIMÉDIA - Genres
-- ═══════════════════════════════════════════════════════════
INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
  ('roman', 'book_novel', 'fr', 85),
  ('sf', 'book_sf', 'fr', 88),
  ('science-fiction', 'book_sf', 'fr', 88),
  ('fantasy', 'book_fantasy', 'fr', 88),
  ('thriller', 'book_thriller', 'fr', 88),
  ('policier', 'book_thriller', 'fr', 88),
  ('histoire', 'book_history', 'fr', 85),
  ('biographie', 'book_biography', 'fr', 85),
  ('manga', 'book_manga', 'fr', 90),
  ('bd', 'book_comic', 'fr', 88),
  ('bande dessinée', 'book_comic', 'fr', 88),
  ('comics', 'book_comics', 'fr', 88);

-- ═══════════════════════════════════════════════════════════
-- MAISON & JARDIN - Furniture Types
-- ═══════════════════════════════════════════════════════════
INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
  ('canapé', 'furniture_sofa', 'fr', 88),
  ('canape', 'furniture_sofa', 'fr', 88),
  ('sofa', 'furniture_sofa', 'fr', 88),
  ('lit', 'furniture_bed', 'fr', 88),
  ('table', 'furniture_table', 'fr', 85),
  ('chaise', 'furniture_chair', 'fr', 85),
  ('armoire', 'furniture_wardrobe', 'fr', 88),
  ('étagère', 'furniture_shelf', 'fr', 88),
  ('etagere', 'furniture_shelf', 'fr', 88),
  ('commode', 'furniture_dresser', 'fr', 88),
  ('bureau', 'furniture_desk', 'fr', 85),
  ('meuble', 'furniture_general', 'fr', 80);

-- ═══════════════════════════════════════════════════════════
-- BÉBÉ & ENFANTS - Baby Items
-- ═══════════════════════════════════════════════════════════
INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
  ('poussette', 'baby_stroller', 'fr', 90),
  ('siège auto', 'baby_carseat', 'fr', 90),
  ('siege auto', 'baby_carseat', 'fr', 90),
  ('lit bébé', 'baby_crib', 'fr', 90),
  ('lit bebe', 'baby_crib', 'fr', 90),
  ('chaise haute', 'baby_highchair', 'fr', 90),
  ('jouet', 'baby_toy', 'fr', 85),
  ('biberon', 'baby_bottle', 'fr', 88);

-- ═══════════════════════════════════════════════════════════
-- LOISIRS - Sports & Music
-- ═══════════════════════════════════════════════════════════
INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
  ('vélo', 'leisure_bike', 'fr', 88),
  ('velo', 'leisure_bike', 'fr', 88),
  ('vtt', 'leisure_mtb', 'fr', 90),
  ('trottinette', 'leisure_scooter', 'fr', 88),
  ('jeux vidéo', 'leisure_videogame', 'fr', 85),
  ('jeux video', 'leisure_videogame', 'fr', 85),
  ('guitare', 'leisure_guitar', 'fr', 88),
  ('piano', 'leisure_piano', 'fr', 88),
  ('instrument', 'leisure_instrument', 'fr', 85),
  ('camping', 'leisure_camping', 'fr', 85),
  ('tente', 'leisure_tent', 'fr', 88);
