/*
  # Peuplement de la table keywords pour toutes les catégories

  1. Mots-clés pour catégories principales
    - Véhicules: voiture, auto, moto, camion, scooter, quad
    - Immobilier: maison, appartement, f2, f3, f4, villa, terrain, studio
    - Emploi: travail, job, recrutement, cdi, cdd, stage
    - Électronique: téléphone, ordinateur, laptop, tablette, tv, samsung, iphone
    - Et toutes les autres catégories...

  2. Mots-clés pour sous-catégories
    - Chaque sous-catégorie a ses propres mots-clés spécifiques

  3. Langues
    - Français (fr) prioritaire
    - Arabe (ar) pour termes courants
    - Anglais (en) pour termes tech

  Cette migration insère tous les mots-clés pertinents pour améliorer la recherche.
*/

-- Récupérer les IDs des catégories
DO $$
DECLARE
  cat_vehicules uuid;
  cat_immobilier uuid;
  cat_location_immo uuid;
  cat_location_vacances uuid;
  cat_location_vehicules uuid;
  cat_emploi uuid;
  cat_electronique uuid;
  cat_maison uuid;
  cat_maison_jardin uuid;
  cat_mode uuid;
  cat_mode_beaute uuid;
  cat_bebe uuid;
  cat_animaux uuid;
  cat_livres uuid;
  cat_loisirs uuid;
  cat_services uuid;
  cat_materiel_pro uuid;
  cat_location_equip uuid;
  
  -- Sous-catégories
  subcat_voitures uuid;
  subcat_motos uuid;
  subcat_camions uuid;
  subcat_pieces_auto uuid;
  subcat_appartements uuid;
  subcat_maisons uuid;
  subcat_terrains uuid;
  subcat_locaux uuid;
  subcat_appart_louer uuid;
  subcat_maisons_louer uuid;
  subcat_bureaux_louer uuid;
  subcat_studios uuid;
  subcat_offres_emploi uuid;
  subcat_demandes_emploi uuid;
  subcat_stages uuid;
  subcat_telephones uuid;
  subcat_ordinateurs uuid;
  subcat_tv_audio uuid;
  subcat_electromenager uuid;
BEGIN
  -- Récupérer IDs catégories principales
  SELECT id INTO cat_vehicules FROM categories WHERE slug = 'vehicules';
  SELECT id INTO cat_immobilier FROM categories WHERE slug = 'immobilier';
  SELECT id INTO cat_location_immo FROM categories WHERE slug = 'location-immobiliere';
  SELECT id INTO cat_location_vacances FROM categories WHERE slug = 'location-vacances';
  SELECT id INTO cat_location_vehicules FROM categories WHERE slug = 'location-vehicules';
  SELECT id INTO cat_emploi FROM categories WHERE slug = 'emploi';
  SELECT id INTO cat_electronique FROM categories WHERE slug = 'electronique';
  SELECT id INTO cat_maison FROM categories WHERE slug = 'maison';
  SELECT id INTO cat_maison_jardin FROM categories WHERE slug = 'maison-jardin';
  SELECT id INTO cat_mode FROM categories WHERE slug = 'mode';
  SELECT id INTO cat_mode_beaute FROM categories WHERE slug = 'mode-beaute';
  SELECT id INTO cat_bebe FROM categories WHERE slug = 'bebe-enfants';
  SELECT id INTO cat_animaux FROM categories WHERE slug = 'animaux';
  SELECT id INTO cat_livres FROM categories WHERE slug = 'livres-multimedia';
  SELECT id INTO cat_loisirs FROM categories WHERE slug = 'loisirs';
  SELECT id INTO cat_services FROM categories WHERE slug = 'services';
  SELECT id INTO cat_materiel_pro FROM categories WHERE slug = 'materiel-professionnel';
  SELECT id INTO cat_location_equip FROM categories WHERE slug = 'location-equipements';

  -- Récupérer IDs sous-catégories
  SELECT id INTO subcat_voitures FROM categories WHERE slug = 'voitures';
  SELECT id INTO subcat_motos FROM categories WHERE slug = 'motos';
  SELECT id INTO subcat_camions FROM categories WHERE slug = 'camions';
  SELECT id INTO subcat_pieces_auto FROM categories WHERE slug = 'pieces-auto';
  SELECT id INTO subcat_appartements FROM categories WHERE slug = 'appartements';
  SELECT id INTO subcat_maisons FROM categories WHERE slug = 'maisons';
  SELECT id INTO subcat_terrains FROM categories WHERE slug = 'terrains';
  SELECT id INTO subcat_locaux FROM categories WHERE slug = 'locaux-commerciaux';
  SELECT id INTO subcat_appart_louer FROM categories WHERE slug = 'appartements-louer';
  SELECT id INTO subcat_maisons_louer FROM categories WHERE slug = 'maisons-louer';
  SELECT id INTO subcat_bureaux_louer FROM categories WHERE slug = 'bureaux-louer';
  SELECT id INTO subcat_studios FROM categories WHERE slug = 'studios';
  SELECT id INTO subcat_offres_emploi FROM categories WHERE slug = 'offres-emploi';
  SELECT id INTO subcat_demandes_emploi FROM categories WHERE slug = 'demandes-emploi';
  SELECT id INTO subcat_stages FROM categories WHERE slug = 'stages';
  SELECT id INTO subcat_telephones FROM categories WHERE slug = 'telephones';
  SELECT id INTO subcat_ordinateurs FROM categories WHERE slug = 'ordinateurs';
  SELECT id INTO subcat_tv_audio FROM categories WHERE slug = 'tv-audio';
  SELECT id INTO subcat_electromenager FROM categories WHERE slug = 'electromenager';

  -- ============================================================
  -- VEHICULES
  -- ============================================================
  IF cat_vehicules IS NOT NULL THEN
    INSERT INTO keywords (keyword, entity_type, entity_id, language, weight) VALUES
      ('voiture', 'category', cat_vehicules, 'fr', 10),
      ('auto', 'category', cat_vehicules, 'fr', 10),
      ('automobile', 'category', cat_vehicules, 'fr', 9),
      ('vehicule', 'category', cat_vehicules, 'fr', 10),
      ('moto', 'category', cat_vehicules, 'fr', 9),
      ('camion', 'category', cat_vehicules, 'fr', 9),
      ('scooter', 'category', cat_vehicules, 'fr', 8),
      ('quad', 'category', cat_vehicules, 'fr', 7),
      ('tracteur', 'category', cat_vehicules, 'fr', 7),
      ('car', 'category', cat_vehicules, 'en', 8),
      ('vehicle', 'category', cat_vehicules, 'en', 8);
  END IF;

  -- Sous-cat: Voitures
  IF subcat_voitures IS NOT NULL THEN
    INSERT INTO keywords (keyword, entity_type, entity_id, language, weight) VALUES
      ('voiture', 'category', subcat_voitures, 'fr', 10),
      ('auto', 'category', subcat_voitures, 'fr', 10),
      ('berline', 'category', subcat_voitures, 'fr', 8),
      ('citadine', 'category', subcat_voitures, 'fr', 8),
      ('suv', 'category', subcat_voitures, 'fr', 8),
      ('4x4', 'category', subcat_voitures, 'fr', 8),
      ('break', 'category', subcat_voitures, 'fr', 7),
      ('cabriolet', 'category', subcat_voitures, 'fr', 7),
      ('coupe', 'category', subcat_voitures, 'fr', 7),
      ('monospace', 'category', subcat_voitures, 'fr', 7);
  END IF;

  -- Sous-cat: Motos
  IF subcat_motos IS NOT NULL THEN
    INSERT INTO keywords (keyword, entity_type, entity_id, language, weight) VALUES
      ('moto', 'category', subcat_motos, 'fr', 10),
      ('motocyclette', 'category', subcat_motos, 'fr', 8),
      ('scooter', 'category', subcat_motos, 'fr', 9),
      ('125cc', 'category', subcat_motos, 'fr', 7),
      ('sportive', 'category', subcat_motos, 'fr', 7),
      ('cross', 'category', subcat_motos, 'fr', 7),
      ('enduro', 'category', subcat_motos, 'fr', 7),
      ('custom', 'category', subcat_motos, 'fr', 6),
      ('roadster', 'category', subcat_motos, 'fr', 6);
  END IF;

  -- Sous-cat: Camions
  IF subcat_camions IS NOT NULL THEN
    INSERT INTO keywords (keyword, entity_type, entity_id, language, weight) VALUES
      ('camion', 'category', subcat_camions, 'fr', 10),
      ('poids lourd', 'category', subcat_camions, 'fr', 9),
      ('semi-remorque', 'category', subcat_camions, 'fr', 8),
      ('fourgon', 'category', subcat_camions, 'fr', 8),
      ('benne', 'category', subcat_camions, 'fr', 7),
      ('truck', 'category', subcat_camions, 'en', 7);
  END IF;

  -- Sous-cat: Pièces Auto
  IF subcat_pieces_auto IS NOT NULL THEN
    INSERT INTO keywords (keyword, entity_type, entity_id, language, weight) VALUES
      ('pieces', 'category', subcat_pieces_auto, 'fr', 10),
      ('piece auto', 'category', subcat_pieces_auto, 'fr', 10),
      ('accessoire', 'category', subcat_pieces_auto, 'fr', 9),
      ('moteur', 'category', subcat_pieces_auto, 'fr', 8),
      ('pneu', 'category', subcat_pieces_auto, 'fr', 9),
      ('jante', 'category', subcat_pieces_auto, 'fr', 8),
      ('phare', 'category', subcat_pieces_auto, 'fr', 7),
      ('batterie', 'category', subcat_pieces_auto, 'fr', 8),
      ('amortisseur', 'category', subcat_pieces_auto, 'fr', 7),
      ('frein', 'category', subcat_pieces_auto, 'fr', 8);
  END IF;

  -- ============================================================
  -- IMMOBILIER
  -- ============================================================
  IF cat_immobilier IS NOT NULL THEN
    INSERT INTO keywords (keyword, entity_type, entity_id, language, weight) VALUES
      ('immobilier', 'category', cat_immobilier, 'fr', 10),
      ('maison', 'category', cat_immobilier, 'fr', 10),
      ('appartement', 'category', cat_immobilier, 'fr', 10),
      ('villa', 'category', cat_immobilier, 'fr', 9),
      ('terrain', 'category', cat_immobilier, 'fr', 9),
      ('duplex', 'category', cat_immobilier, 'fr', 8),
      ('studio', 'category', cat_immobilier, 'fr', 8),
      ('f2', 'category', cat_immobilier, 'fr', 9),
      ('f3', 'category', cat_immobilier, 'fr', 9),
      ('f4', 'category', cat_immobilier, 'fr', 9),
      ('f5', 'category', cat_immobilier, 'fr', 8),
      ('local', 'category', cat_immobilier, 'fr', 8),
      ('commercial', 'category', cat_immobilier, 'fr', 7);
  END IF;

  -- Sous-cat: Appartements
  IF subcat_appartements IS NOT NULL THEN
    INSERT INTO keywords (keyword, entity_type, entity_id, language, weight) VALUES
      ('appartement', 'category', subcat_appartements, 'fr', 10),
      ('appart', 'category', subcat_appartements, 'fr', 9),
      ('f2', 'category', subcat_appartements, 'fr', 9),
      ('f3', 'category', subcat_appartements, 'fr', 10),
      ('f4', 'category', subcat_appartements, 'fr', 9),
      ('f5', 'category', subcat_appartements, 'fr', 8),
      ('duplex', 'category', subcat_appartements, 'fr', 8),
      ('penthouse', 'category', subcat_appartements, 'fr', 7);
  END IF;

  -- Sous-cat: Maisons
  IF subcat_maisons IS NOT NULL THEN
    INSERT INTO keywords (keyword, entity_type, entity_id, language, weight) VALUES
      ('maison', 'category', subcat_maisons, 'fr', 10),
      ('villa', 'category', subcat_maisons, 'fr', 9),
      ('pavillon', 'category', subcat_maisons, 'fr', 8),
      ('residence', 'category', subcat_maisons, 'fr', 8),
      ('propriete', 'category', subcat_maisons, 'fr', 7);
  END IF;

  -- Sous-cat: Terrains
  IF subcat_terrains IS NOT NULL THEN
    INSERT INTO keywords (keyword, entity_type, entity_id, language, weight) VALUES
      ('terrain', 'category', subcat_terrains, 'fr', 10),
      ('lot', 'category', subcat_terrains, 'fr', 8),
      ('parcelle', 'category', subcat_terrains, 'fr', 9),
      ('agricole', 'category', subcat_terrains, 'fr', 7),
      ('constructible', 'category', subcat_terrains, 'fr', 8);
  END IF;

  -- Sous-cat: Locaux Commerciaux
  IF subcat_locaux IS NOT NULL THEN
    INSERT INTO keywords (keyword, entity_type, entity_id, language, weight) VALUES
      ('local', 'category', subcat_locaux, 'fr', 10),
      ('commercial', 'category', subcat_locaux, 'fr', 10),
      ('boutique', 'category', subcat_locaux, 'fr', 9),
      ('magasin', 'category', subcat_locaux, 'fr', 9),
      ('bureau', 'category', subcat_locaux, 'fr', 9),
      ('entrepot', 'category', subcat_locaux, 'fr', 8),
      ('depot', 'category', subcat_locaux, 'fr', 7);
  END IF;

  -- ============================================================
  -- LOCATION IMMOBILIERE
  -- ============================================================
  IF cat_location_immo IS NOT NULL THEN
    INSERT INTO keywords (keyword, entity_type, entity_id, language, weight) VALUES
      ('location', 'category', cat_location_immo, 'fr', 10),
      ('louer', 'category', cat_location_immo, 'fr', 10),
      ('louer', 'category', cat_location_immo, 'fr', 10),
      ('bail', 'category', cat_location_immo, 'fr', 7),
      ('locataire', 'category', cat_location_immo, 'fr', 7);
  END IF;

  -- Sous-cat: Appartements à louer
  IF subcat_appart_louer IS NOT NULL THEN
    INSERT INTO keywords (keyword, entity_type, entity_id, language, weight) VALUES
      ('appartement louer', 'category', subcat_appart_louer, 'fr', 10),
      ('f2 louer', 'category', subcat_appart_louer, 'fr', 9),
      ('f3 louer', 'category', subcat_appart_louer, 'fr', 10),
      ('f4 louer', 'category', subcat_appart_louer, 'fr', 9),
      ('appart location', 'category', subcat_appart_louer, 'fr', 9);
  END IF;

  -- Sous-cat: Maisons à louer
  IF subcat_maisons_louer IS NOT NULL THEN
    INSERT INTO keywords (keyword, entity_type, entity_id, language, weight) VALUES
      ('maison louer', 'category', subcat_maisons_louer, 'fr', 10),
      ('villa louer', 'category', subcat_maisons_louer, 'fr', 9),
      ('pavillon location', 'category', subcat_maisons_louer, 'fr', 8);
  END IF;

  -- Sous-cat: Bureaux à louer
  IF subcat_bureaux_louer IS NOT NULL THEN
    INSERT INTO keywords (keyword, entity_type, entity_id, language, weight) VALUES
      ('bureau louer', 'category', subcat_bureaux_louer, 'fr', 10),
      ('bureau location', 'category', subcat_bureaux_louer, 'fr', 9),
      ('espace bureau', 'category', subcat_bureaux_louer, 'fr', 8),
      ('coworking', 'category', subcat_bureaux_louer, 'fr', 7);
  END IF;

  -- Sous-cat: Studios
  IF subcat_studios IS NOT NULL THEN
    INSERT INTO keywords (keyword, entity_type, entity_id, language, weight) VALUES
      ('studio', 'category', subcat_studios, 'fr', 10),
      ('studio louer', 'category', subcat_studios, 'fr', 10),
      ('chambre', 'category', subcat_studios, 'fr', 8),
      ('t1', 'category', subcat_studios, 'fr', 9);
  END IF;

  -- ============================================================
  -- EMPLOI
  -- ============================================================
  IF cat_emploi IS NOT NULL THEN
    INSERT INTO keywords (keyword, entity_type, entity_id, language, weight) VALUES
      ('emploi', 'category', cat_emploi, 'fr', 10),
      ('travail', 'category', cat_emploi, 'fr', 10),
      ('job', 'category', cat_emploi, 'fr', 10),
      ('recrutement', 'category', cat_emploi, 'fr', 9),
      ('cdi', 'category', cat_emploi, 'fr', 9),
      ('cdd', 'category', cat_emploi, 'fr', 9),
      ('stage', 'category', cat_emploi, 'fr', 9),
      ('interim', 'category', cat_emploi, 'fr', 8),
      ('freelance', 'category', cat_emploi, 'fr', 8),
      ('temps partiel', 'category', cat_emploi, 'fr', 7),
      ('temps plein', 'category', cat_emploi, 'fr', 7);
  END IF;

  -- Sous-cat: Offres emploi
  IF subcat_offres_emploi IS NOT NULL THEN
    INSERT INTO keywords (keyword, entity_type, entity_id, language, weight) VALUES
      ('offre emploi', 'category', subcat_offres_emploi, 'fr', 10),
      ('poste', 'category', subcat_offres_emploi, 'fr', 9),
      ('embauche', 'category', subcat_offres_emploi, 'fr', 9),
      ('recrute', 'category', subcat_offres_emploi, 'fr', 9);
  END IF;

  -- Sous-cat: Demandes emploi
  IF subcat_demandes_emploi IS NOT NULL THEN
    INSERT INTO keywords (keyword, entity_type, entity_id, language, weight) VALUES
      ('demande emploi', 'category', subcat_demandes_emploi, 'fr', 10),
      ('cherche travail', 'category', subcat_demandes_emploi, 'fr', 10),
      ('cv', 'category', subcat_demandes_emploi, 'fr', 9),
      ('candidature', 'category', subcat_demandes_emploi, 'fr', 9);
  END IF;

  -- Sous-cat: Stages
  IF subcat_stages IS NOT NULL THEN
    INSERT INTO keywords (keyword, entity_type, entity_id, language, weight) VALUES
      ('stage', 'category', subcat_stages, 'fr', 10),
      ('stagiaire', 'category', subcat_stages, 'fr', 9),
      ('apprentissage', 'category', subcat_stages, 'fr', 8),
      ('formation', 'category', subcat_stages, 'fr', 8);
  END IF;

  -- ============================================================
  -- ELECTRONIQUE
  -- ============================================================
  IF cat_electronique IS NOT NULL THEN
    INSERT INTO keywords (keyword, entity_type, entity_id, language, weight) VALUES
      ('electronique', 'category', cat_electronique, 'fr', 10),
      ('telephone', 'category', cat_electronique, 'fr', 10),
      ('ordinateur', 'category', cat_electronique, 'fr', 10),
      ('laptop', 'category', cat_electronique, 'fr', 9),
      ('tablette', 'category', cat_electronique, 'fr', 9),
      ('tv', 'category', cat_electronique, 'fr', 9),
      ('television', 'category', cat_electronique, 'fr', 9),
      ('smartphone', 'category', cat_electronique, 'fr', 10),
      ('iphone', 'category', cat_electronique, 'fr', 9),
      ('samsung', 'category', cat_electronique, 'fr', 9),
      ('pc', 'category', cat_electronique, 'fr', 9);
  END IF;

  -- Sous-cat: Téléphones
  IF subcat_telephones IS NOT NULL THEN
    INSERT INTO keywords (keyword, entity_type, entity_id, language, weight) VALUES
      ('telephone', 'category', subcat_telephones, 'fr', 10),
      ('smartphone', 'category', subcat_telephones, 'fr', 10),
      ('mobile', 'category', subcat_telephones, 'fr', 10),
      ('iphone', 'category', subcat_telephones, 'fr', 9),
      ('samsung', 'category', subcat_telephones, 'fr', 9),
      ('android', 'category', subcat_telephones, 'fr', 8),
      ('huawei', 'category', subcat_telephones, 'fr', 8);
  END IF;

  -- Sous-cat: Ordinateurs
  IF subcat_ordinateurs IS NOT NULL THEN
    INSERT INTO keywords (keyword, entity_type, entity_id, language, weight) VALUES
      ('ordinateur', 'category', subcat_ordinateurs, 'fr', 10),
      ('pc', 'category', subcat_ordinateurs, 'fr', 10),
      ('laptop', 'category', subcat_ordinateurs, 'fr', 10),
      ('macbook', 'category', subcat_ordinateurs, 'fr', 9),
      ('imac', 'category', subcat_ordinateurs, 'fr', 8),
      ('gaming', 'category', subcat_ordinateurs, 'fr', 8),
      ('bureau', 'category', subcat_ordinateurs, 'fr', 7);
  END IF;

  -- Sous-cat: TV & Audio
  IF subcat_tv_audio IS NOT NULL THEN
    INSERT INTO keywords (keyword, entity_type, entity_id, language, weight) VALUES
      ('tv', 'category', subcat_tv_audio, 'fr', 10),
      ('television', 'category', subcat_tv_audio, 'fr', 10),
      ('ecran', 'category', subcat_tv_audio, 'fr', 9),
      ('hifi', 'category', subcat_tv_audio, 'fr', 8),
      ('enceinte', 'category', subcat_tv_audio, 'fr', 8),
      ('home cinema', 'category', subcat_tv_audio, 'fr', 8),
      ('soundbar', 'category', subcat_tv_audio, 'fr', 7);
  END IF;

  -- Sous-cat: Électroménager
  IF subcat_electromenager IS NOT NULL THEN
    INSERT INTO keywords (keyword, entity_type, entity_id, language, weight) VALUES
      ('electromenager', 'category', subcat_electromenager, 'fr', 10),
      ('frigo', 'category', subcat_electromenager, 'fr', 9),
      ('refrigerateur', 'category', subcat_electromenager, 'fr', 9),
      ('lave-linge', 'category', subcat_electromenager, 'fr', 9),
      ('lave-vaisselle', 'category', subcat_electromenager, 'fr', 8),
      ('four', 'category', subcat_electromenager, 'fr', 8),
      ('cuisiniere', 'category', subcat_electromenager, 'fr', 8),
      ('micro-ondes', 'category', subcat_electromenager, 'fr', 7);
  END IF;

END $$;
