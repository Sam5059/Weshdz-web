/*
  # Ajouter les sous-catégories manquantes
  
  1. Sous-catégories ajoutées
    - Location Véhicules : Voitures, Motos, Camions, Utilitaires
    - Location Vacances : Appartements, Villas, Chalets, Riads
    - Emploi : Offres emploi, Demandes emploi, Stages
    - Maison : Meubles, Décoration, Électroménager
    - Loisirs : Sport, Jeux vidéo, Instruments musique, Collection
    - Location Équipements : Matériel BTP, Matériel événementiel, Matériel jardinage
    - Maison & Jardin : Meubles jardin, Plantes, Outils jardinage, Piscines
    - Animaux : Chiens, Chats, Oiseaux, Accessoires animaux
    - Bébé & Enfants : Vêtements enfants, Jouets, Puériculture, Livres enfants
    - Livres & Multimédia : Livres, CD/DVD, Jeux de société, Vinyles
*/

-- Location Véhicules
INSERT INTO categories (name, slug, name_ar, name_en, parent_id, display_order) VALUES
('Voitures location', 'voitures-location', 'تأجير سيارات', 'Car Rental', (SELECT id FROM categories WHERE name = 'Location Véhicules'), 1),
('Motos location', 'motos-location', 'تأجير دراجات نارية', 'Motorcycle Rental', (SELECT id FROM categories WHERE name = 'Location Véhicules'), 2),
('Camions location', 'camions-location', 'تأجير شاحنات', 'Truck Rental', (SELECT id FROM categories WHERE name = 'Location Véhicules'), 3),
('Utilitaires', 'utilitaires', 'مركبات نفعية', 'Utility Vehicles', (SELECT id FROM categories WHERE name = 'Location Véhicules'), 4);

-- Location Vacances
INSERT INTO categories (name, slug, name_ar, name_en, parent_id, display_order) VALUES
('Appartements vacances', 'appartements-vacances', 'شقق للعطل', 'Vacation Apartments', (SELECT id FROM categories WHERE name = 'Location Vacances'), 1),
('Villas vacances', 'villas-vacances', 'فيلات للعطل', 'Vacation Villas', (SELECT id FROM categories WHERE name = 'Location Vacances'), 2),
('Chalets', 'chalets', 'شاليهات', 'Chalets', (SELECT id FROM categories WHERE name = 'Location Vacances'), 3),
('Riads', 'riads', 'رياضات', 'Riads', (SELECT id FROM categories WHERE name = 'Location Vacances'), 4);

-- Emploi
INSERT INTO categories (name, slug, name_ar, name_en, parent_id, display_order) VALUES
('Offres emploi', 'offres-emploi', 'عروض عمل', 'Job Offers', (SELECT id FROM categories WHERE name = 'Emploi'), 1),
('Demandes emploi', 'demandes-emploi', 'طلبات عمل', 'Job Seekers', (SELECT id FROM categories WHERE name = 'Emploi'), 2),
('Stages', 'stages', 'تدريب', 'Internships', (SELECT id FROM categories WHERE name = 'Emploi'), 3);

-- Maison
INSERT INTO categories (name, slug, name_ar, name_en, parent_id, display_order) VALUES
('Meubles', 'meubles', 'أثاث', 'Furniture', (SELECT id FROM categories WHERE name = 'Maison'), 1),
('Décoration', 'decoration', 'ديكور', 'Decoration', (SELECT id FROM categories WHERE name = 'Maison'), 2),
('Électroménager maison', 'electromenager-maison', 'أجهزة منزلية', 'Home Appliances', (SELECT id FROM categories WHERE name = 'Maison'), 3);

-- Loisirs
INSERT INTO categories (name, slug, name_ar, name_en, parent_id, display_order) VALUES
('Sport', 'sport', 'رياضة', 'Sports', (SELECT id FROM categories WHERE name = 'Loisirs'), 1),
('Jeux vidéo', 'jeux-video', 'ألعاب فيديو', 'Video Games', (SELECT id FROM categories WHERE name = 'Loisirs'), 2),
('Instruments musique', 'instruments-musique', 'آلات موسيقية', 'Musical Instruments', (SELECT id FROM categories WHERE name = 'Loisirs'), 3),
('Collection', 'collection', 'مقتنيات', 'Collectibles', (SELECT id FROM categories WHERE name = 'Loisirs'), 4);

-- Location Équipements
INSERT INTO categories (name, slug, name_ar, name_en, parent_id, display_order) VALUES
('Matériel BTP', 'materiel-btp', 'معدات البناء', 'Construction Equipment', (SELECT id FROM categories WHERE name = 'Location Équipements'), 1),
('Matériel événementiel', 'materiel-evenementiel', 'معدات الحفلات', 'Event Equipment', (SELECT id FROM categories WHERE name = 'Location Équipements'), 2),
('Matériel jardinage', 'materiel-jardinage', 'معدات البستنة', 'Gardening Equipment', (SELECT id FROM categories WHERE name = 'Location Équipements'), 3);

-- Maison & Jardin
INSERT INTO categories (name, slug, name_ar, name_en, parent_id, display_order) VALUES
('Meubles jardin', 'meubles-jardin', 'أثاث حديقة', 'Garden Furniture', (SELECT id FROM categories WHERE name = 'Maison & Jardin'), 1),
('Plantes', 'plantes', 'نباتات', 'Plants', (SELECT id FROM categories WHERE name = 'Maison & Jardin'), 2),
('Outils jardinage', 'outils-jardinage', 'أدوات البستنة', 'Gardening Tools', (SELECT id FROM categories WHERE name = 'Maison & Jardin'), 3),
('Piscines', 'piscines', 'مسابح', 'Pools', (SELECT id FROM categories WHERE name = 'Maison & Jardin'), 4);

-- Animaux
INSERT INTO categories (name, slug, name_ar, name_en, parent_id, display_order) VALUES
('Chiens', 'chiens', 'كلاب', 'Dogs', (SELECT id FROM categories WHERE name = 'Animaux'), 1),
('Chats', 'chats', 'قطط', 'Cats', (SELECT id FROM categories WHERE name = 'Animaux'), 2),
('Oiseaux', 'oiseaux', 'طيور', 'Birds', (SELECT id FROM categories WHERE name = 'Animaux'), 3),
('Accessoires animaux', 'accessoires-animaux', 'إكسسوارات حيوانات', 'Pet Accessories', (SELECT id FROM categories WHERE name = 'Animaux'), 4);

-- Bébé & Enfants
INSERT INTO categories (name, slug, name_ar, name_en, parent_id, display_order) VALUES
('Vêtements enfants', 'vetements-enfants', 'ملابس أطفال', 'Children Clothing', (SELECT id FROM categories WHERE name = 'Bébé & Enfants'), 1),
('Jouets', 'jouets', 'ألعاب', 'Toys', (SELECT id FROM categories WHERE name = 'Bébé & Enfants'), 2),
('Puériculture', 'puericulture', 'مستلزمات الطفل', 'Childcare', (SELECT id FROM categories WHERE name = 'Bébé & Enfants'), 3),
('Livres enfants', 'livres-enfants', 'كتب أطفال', 'Children Books', (SELECT id FROM categories WHERE name = 'Bébé & Enfants'), 4);

-- Livres & Multimédia
INSERT INTO categories (name, slug, name_ar, name_en, parent_id, display_order) VALUES
('Livres', 'livres', 'كتب', 'Books', (SELECT id FROM categories WHERE name = 'Livres & Multimédia'), 1),
('CD/DVD', 'cd-dvd', 'أقراص مدمجة', 'CD/DVD', (SELECT id FROM categories WHERE name = 'Livres & Multimédia'), 2),
('Jeux de société', 'jeux-societe', 'ألعاب اللوح', 'Board Games', (SELECT id FROM categories WHERE name = 'Livres & Multimédia'), 3),
('Vinyles', 'vinyles', 'أسطوانات فينيل', 'Vinyl Records', (SELECT id FROM categories WHERE name = 'Livres & Multimédia'), 4);
