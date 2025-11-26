/*
  # Mots-clés pour titres d'emploi et métiers

  1. Mots-clés généraux par secteur
    - Informatique & Tech
    - Vente & Commerce
    - BTP & Construction
    - Santé & Médical
    - Éducation & Formation
    - Administration & Gestion
    - Hôtellerie & Restauration
    - Transport & Logistique
    - Et autres secteurs...

  2. Titres d'emploi courants
    - Développeur, Ingénieur, Commercial, etc.

  Cette migration améliore la recherche d'offres/demandes d'emploi
  en ajoutant des mots-clés pertinents pour chaque secteur.
*/

-- Mots-clés généraux pour l'emploi
INSERT INTO keywords (keyword, entity_type, entity_id, language, weight) VALUES
  -- Informatique & Tech
  ('developpeur', 'job_title', NULL, 'fr', 10),
  ('developer', 'job_title', NULL, 'en', 9),
  ('programmeur', 'job_title', NULL, 'fr', 9),
  ('ingenieur', 'job_title', NULL, 'fr', 10),
  ('engineer', 'job_title', NULL, 'en', 9),
  ('informaticien', 'job_title', NULL, 'fr', 9),
  ('web developer', 'job_title', NULL, 'en', 9),
  ('data scientist', 'job_title', NULL, 'en', 8),
  ('devops', 'job_title', NULL, 'fr', 8),
  ('fullstack', 'job_title', NULL, 'fr', 8),
  ('frontend', 'job_title', NULL, 'fr', 8),
  ('backend', 'job_title', NULL, 'fr', 8),
  ('it', 'job_title', NULL, 'en', 8),
  ('systeme', 'job_title', NULL, 'fr', 7),
  ('reseau', 'job_title', NULL, 'fr', 7),
  
  -- Vente & Commerce
  ('commercial', 'job_title', NULL, 'fr', 10),
  ('vendeur', 'job_title', NULL, 'fr', 10),
  ('vendeuse', 'job_title', NULL, 'fr', 10),
  ('sales', 'job_title', NULL, 'en', 9),
  ('technico-commercial', 'job_title', NULL, 'fr', 9),
  ('charge affaires', 'job_title', NULL, 'fr', 9),
  ('business developer', 'job_title', NULL, 'en', 8),
  ('account manager', 'job_title', NULL, 'en', 8),
  
  -- BTP & Construction
  ('maçon', 'job_title', NULL, 'fr', 10),
  ('plombier', 'job_title', NULL, 'fr', 10),
  ('electricien', 'job_title', NULL, 'fr', 10),
  ('menuisier', 'job_title', NULL, 'fr', 9),
  ('charpentier', 'job_title', NULL, 'fr', 9),
  ('peintre', 'job_title', NULL, 'fr', 9),
  ('chef chantier', 'job_title', NULL, 'fr', 9),
  ('conducteur travaux', 'job_title', NULL, 'fr', 9),
  ('btp', 'job_title', NULL, 'fr', 10),
  ('batiment', 'job_title', NULL, 'fr', 9),
  
  -- Santé & Médical
  ('medecin', 'job_title', NULL, 'fr', 10),
  ('infirmier', 'job_title', NULL, 'fr', 10),
  ('infirmiere', 'job_title', NULL, 'fr', 10),
  ('docteur', 'job_title', NULL, 'fr', 10),
  ('pharmacien', 'job_title', NULL, 'fr', 9),
  ('kinesitherapeute', 'job_title', NULL, 'fr', 9),
  ('dentiste', 'job_title', NULL, 'fr', 9),
  ('aide-soignant', 'job_title', NULL, 'fr', 9),
  ('sage-femme', 'job_title', NULL, 'fr', 8),
  
  -- Éducation & Formation
  ('enseignant', 'job_title', NULL, 'fr', 10),
  ('professeur', 'job_title', NULL, 'fr', 10),
  ('formateur', 'job_title', NULL, 'fr', 9),
  ('instituteur', 'job_title', NULL, 'fr', 9),
  ('prof', 'job_title', NULL, 'fr', 9),
  ('educateur', 'job_title', NULL, 'fr', 8),
  
  -- Administration & Gestion
  ('assistant', 'job_title', NULL, 'fr', 10),
  ('assistante', 'job_title', NULL, 'fr', 10),
  ('secretaire', 'job_title', NULL, 'fr', 10),
  ('comptable', 'job_title', NULL, 'fr', 10),
  ('gestionnaire', 'job_title', NULL, 'fr', 9),
  ('rh', 'job_title', NULL, 'fr', 9),
  ('responsable', 'job_title', NULL, 'fr', 9),
  ('directeur', 'job_title', NULL, 'fr', 9),
  ('manager', 'job_title', NULL, 'fr', 9),
  ('chef', 'job_title', NULL, 'fr', 8),
  
  -- Hôtellerie & Restauration
  ('serveur', 'job_title', NULL, 'fr', 10),
  ('serveuse', 'job_title', NULL, 'fr', 10),
  ('cuisinier', 'job_title', NULL, 'fr', 10),
  ('chef cuisinier', 'job_title', NULL, 'fr', 9),
  ('barista', 'job_title', NULL, 'fr', 8),
  ('receptionniste', 'job_title', NULL, 'fr', 9),
  ('hotellerie', 'job_title', NULL, 'fr', 9),
  ('restauration', 'job_title', NULL, 'fr', 9),
  
  -- Transport & Logistique
  ('chauffeur', 'job_title', NULL, 'fr', 10),
  ('livreur', 'job_title', NULL, 'fr', 10),
  ('conducteur', 'job_title', NULL, 'fr', 10),
  ('chauffeur poids lourd', 'job_title', NULL, 'fr', 9),
  ('logisticien', 'job_title', NULL, 'fr', 9),
  ('magasinier', 'job_title', NULL, 'fr', 9),
  ('taxi', 'job_title', NULL, 'fr', 8),
  ('uber', 'job_title', NULL, 'fr', 7),
  
  -- Marketing & Communication
  ('marketing', 'job_title', NULL, 'fr', 10),
  ('communication', 'job_title', NULL, 'fr', 10),
  ('community manager', 'job_title', NULL, 'fr', 9),
  ('graphiste', 'job_title', NULL, 'fr', 9),
  ('designer', 'job_title', NULL, 'fr', 9),
  ('webmaster', 'job_title', NULL, 'fr', 8),
  ('redacteur', 'job_title', NULL, 'fr', 8),
  
  -- Autres métiers courants
  ('agent securite', 'job_title', NULL, 'fr', 9),
  ('gardien', 'job_title', NULL, 'fr', 8),
  ('femme menage', 'job_title', NULL, 'fr', 9),
  ('menage', 'job_title', NULL, 'fr', 9),
  ('nettoyage', 'job_title', NULL, 'fr', 8),
  ('mecanicien', 'job_title', NULL, 'fr', 10),
  ('technicien', 'job_title', NULL, 'fr', 9),
  ('artisan', 'job_title', NULL, 'fr', 9),
  ('coiffeur', 'job_title', NULL, 'fr', 9),
  ('coiffeuse', 'job_title', NULL, 'fr', 9),
  ('estheticienne', 'job_title', NULL, 'fr', 9),
  ('jardinier', 'job_title', NULL, 'fr', 8),
  ('agent nettoyage', 'job_title', NULL, 'fr', 8)
ON CONFLICT DO NOTHING;
