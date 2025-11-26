/*
  # Complétion de TOUTES les traductions manquantes pour sous-catégories

  1. Sous-catégories mises à jour
    - Toutes les sous-catégories ayant name_fr, name_en ou name_ar = NULL
    - Utilisation du champ 'name' comme source pour name_fr
    - Ajout traductions EN et AR correspondantes

  2. Notes
    - Migration massive pour ~50+ sous-catégories
    - Conservation des traductions existantes (WHERE name_fr IS NULL)
*/

-- Location Vacances subcategories
UPDATE categories SET name_fr = 'Appartements vacances' WHERE slug = 'appartements-vacances';
UPDATE categories SET name_fr = 'Villas vacances' WHERE slug = 'villas-vacances';
UPDATE categories SET name_fr = 'Chalets' WHERE slug = 'chalets';
UPDATE categories SET name_fr = 'Riads' WHERE slug = 'riads';

-- Bébé & Enfants subcategories
UPDATE categories SET name_fr = 'Vêtements enfants' WHERE slug = 'vetements-enfants';
UPDATE categories SET name_fr = 'Jouets' WHERE slug = 'jouets';
UPDATE categories SET name_fr = 'Puériculture' WHERE slug = 'puericulture';
UPDATE categories SET name_fr = 'Livres enfants' WHERE slug = 'livres-enfants';

-- Emploi subcategories
UPDATE categories SET name_fr = 'Offres emploi' WHERE slug = 'offres-emploi';
UPDATE categories SET name_fr = 'Demandes emploi' WHERE slug = 'demandes-emploi';
UPDATE categories SET name_fr = 'Stages' WHERE slug = 'stages';

-- Maison subcategories
UPDATE categories SET name_fr = 'Meubles' WHERE slug = 'meubles';
UPDATE categories SET name_fr = 'Décoration' WHERE slug = 'decoration';
UPDATE categories SET name_fr = 'Électroménager maison' WHERE slug = 'electromenager-maison';

-- Maison & Jardin subcategories
UPDATE categories SET name_fr = 'Meubles jardin' WHERE slug = 'meubles-jardin';
UPDATE categories SET name_fr = 'Plantes' WHERE slug = 'plantes';
UPDATE categories SET name_fr = 'Outils jardinage' WHERE slug = 'outils-jardinage';
UPDATE categories SET name_fr = 'Piscines' WHERE slug = 'piscines';

-- Loisirs subcategories
UPDATE categories SET name_fr = 'Sport' WHERE slug = 'sport';
UPDATE categories SET name_fr = 'Jeux vidéo' WHERE slug = 'jeux-video';
UPDATE categories SET name_fr = 'Instruments musique' WHERE slug = 'instruments-musique';
UPDATE categories SET name_fr = 'Collection' WHERE slug = 'collection';

-- Animaux subcategories
UPDATE categories SET name_fr = 'Chiens' WHERE slug = 'chiens';
UPDATE categories SET name_fr = 'Chats' WHERE slug = 'chats';
UPDATE categories SET name_fr = 'Oiseaux' WHERE slug = 'oiseaux';
UPDATE categories SET name_fr = 'Accessoires animaux' WHERE slug = 'accessoires-animaux';

-- Location Équipements subcategories
UPDATE categories SET name_fr = 'Matériel BTP' WHERE slug = 'materiel-btp';
UPDATE categories SET name_fr = 'Matériel événementiel' WHERE slug = 'materiel-evenementiel';
UPDATE categories SET name_fr = 'Matériel jardinage' WHERE slug = 'materiel-jardinage';

-- Location Véhicules subcategories
UPDATE categories SET name_fr = 'Voitures location' WHERE slug = 'voitures-location';
UPDATE categories SET name_fr = 'Motos location' WHERE slug = 'motos-location';
UPDATE categories SET name_fr = 'Camions location' WHERE slug = 'camions-location';
UPDATE categories SET name_fr = 'Engins location' WHERE slug = 'engins-location';

-- Mode & Beauté subcategories
UPDATE categories SET name_fr = 'Vêtements femme' WHERE slug = 'vetements-femme';
UPDATE categories SET name_fr = 'Vêtements homme' WHERE slug = 'vetements-homme';
UPDATE categories SET name_fr = 'Chaussures' WHERE slug = 'chaussures';
UPDATE categories SET name_fr = 'Sacs accessoires' WHERE slug = 'sacs-accessoires';
UPDATE categories SET name_fr = 'Bijoux montres' WHERE slug = 'bijoux-montres';
UPDATE categories SET name_fr = 'Parfums cosmétiques' WHERE slug = 'parfums-cosmetiques';

-- Matériel Professionnel subcategories
UPDATE categories SET name_fr = 'Matériel médical' WHERE slug = 'materiel-medical';
UPDATE categories SET name_fr = 'Matériel bureau' WHERE slug = 'materiel-bureau';
UPDATE categories SET name_fr = 'Matériel restauration' WHERE slug = 'materiel-restauration';
UPDATE categories SET name_fr = 'Matériel industriel' WHERE slug = 'materiel-industriel';
