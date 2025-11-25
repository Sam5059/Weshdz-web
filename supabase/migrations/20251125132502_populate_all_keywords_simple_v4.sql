/*
  # Population complète de tous les keywords
  
  Ajoute tous les mots-clés essentiels pour la recherche
*/

-- Nettoyer d'abord
TRUNCATE keywords;

-- Keywords VÉHICULES généraux
INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
('voiture', 'general', 'fr', 10),
('auto', 'general', 'fr', 10),
('automobile', 'general', 'fr', 10),
('véhicule', 'general', 'fr', 10),
('car', 'general', 'en', 10),
('سيارة', 'general', 'ar', 10),
('مركبة', 'general', 'ar', 10),
('occasion', 'general', 'fr', 8),
('neuf', 'general', 'fr', 8),
('diesel', 'general', 'fr', 7),
('essence', 'general', 'fr', 7),
('automatique', 'general', 'fr', 7),
('manuelle', 'general', 'fr', 7),
('4x4', 'general', 'fr', 8),
('suv', 'general', 'fr', 8),
('berline', 'general', 'fr', 7),
('citadine', 'general', 'fr', 7),
('utilitaire', 'general', 'fr', 7)
ON CONFLICT DO NOTHING;

-- Keywords MOTOS
INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
('moto', 'general', 'fr', 10),
('scooter', 'general', 'fr', 10),
('quad', 'general', 'fr', 10),
('دراجة', 'general', 'ar', 10),
('دراجة نارية', 'general', 'ar', 10),
('سكوتر', 'general', 'ar', 10)
ON CONFLICT DO NOTHING;

-- Keywords IMMOBILIER
INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
('appartement', 'general', 'fr', 10),
('maison', 'general', 'fr', 10),
('villa', 'general', 'fr', 10),
('terrain', 'general', 'fr', 10),
('local', 'general', 'fr', 10),
('location', 'general', 'fr', 10),
('vente', 'general', 'fr', 10),
('louer', 'general', 'fr', 9),
('acheter', 'general', 'fr', 9),
('شقة', 'general', 'ar', 10),
('منزل', 'general', 'ar', 10),
('فيلا', 'general', 'ar', 10),
('أرض', 'general', 'ar', 10),
('كراء', 'general', 'ar', 10),
('بيع', 'general', 'ar', 10),
('f2', 'general', 'fr', 9),
('f3', 'general', 'fr', 9),
('f4', 'general', 'fr', 9),
('f5', 'general', 'fr', 9),
('duplex', 'general', 'fr', 8),
('studio', 'general', 'fr', 8),
('bureau', 'general', 'fr', 8),
('boutique', 'general', 'fr', 8),
('entrepôt', 'general', 'fr', 8)
ON CONFLICT DO NOTHING;

-- Keywords TÉLÉPHONES
INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
('téléphone', 'general', 'fr', 10),
('smartphone', 'general', 'fr', 10),
('mobile', 'general', 'fr', 10),
('portable', 'general', 'fr', 10),
('iphone', 'general', 'fr', 10),
('samsung', 'general', 'fr', 10),
('huawei', 'general', 'fr', 10),
('xiaomi', 'general', 'fr', 10),
('oppo', 'general', 'fr', 9),
('vivo', 'general', 'fr', 9),
('هاتف', 'general', 'ar', 10),
('جوال', 'general', 'ar', 10),
('موبايل', 'general', 'ar', 10),
('ذكي', 'general', 'ar', 9)
ON CONFLICT DO NOTHING;

-- Keywords ORDINATEURS
INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
('ordinateur', 'general', 'fr', 10),
('pc', 'general', 'fr', 10),
('laptop', 'general', 'fr', 10),
('portable', 'general', 'fr', 10),
('bureau', 'general', 'fr', 10),
('tablette', 'general', 'fr', 10),
('ipad', 'general', 'fr', 10),
('macbook', 'general', 'fr', 10),
('dell', 'general', 'fr', 9),
('hp', 'general', 'fr', 9),
('lenovo', 'general', 'fr', 9),
('asus', 'general', 'fr', 9),
('حاسوب', 'general', 'ar', 10),
('كمبيوتر', 'general', 'ar', 10),
('لابتوب', 'general', 'ar', 10)
ON CONFLICT DO NOTHING;

-- Keywords TV & AUDIO
INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
('tv', 'general', 'fr', 10),
('télévision', 'general', 'fr', 10),
('téléviseur', 'general', 'fr', 10),
('écran', 'general', 'fr', 10),
('smart tv', 'general', 'fr', 10),
('led', 'general', 'fr', 9),
('lcd', 'general', 'fr', 9),
('4k', 'general', 'fr', 9),
('تلفزيون', 'general', 'ar', 10),
('شاشة', 'general', 'ar', 10),
('casque', 'general', 'fr', 9),
('enceinte', 'general', 'fr', 9),
('home cinéma', 'general', 'fr', 9)
ON CONFLICT DO NOTHING;

-- Keywords ÉLECTROMÉNAGER
INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
('frigo', 'general', 'fr', 10),
('réfrigérateur', 'general', 'fr', 10),
('ثلاجة', 'general', 'ar', 10),
('machine à laver', 'general', 'fr', 10),
('lave-linge', 'general', 'fr', 10),
('غسالة', 'general', 'ar', 10),
('cuisinière', 'general', 'fr', 10),
('four', 'general', 'fr', 10),
('موقد', 'general', 'ar', 10),
('فرن', 'general', 'ar', 10),
('climatiseur', 'general', 'fr', 10),
('clim', 'general', 'fr', 10),
('مكيف', 'general', 'ar', 10),
('micro-ondes', 'general', 'fr', 9),
('ميكروويف', 'general', 'ar', 9),
('lave-vaisselle', 'general', 'fr', 9),
('aspirateur', 'general', 'fr', 9)
ON CONFLICT DO NOTHING;

-- Keywords MODE & BEAUTÉ
INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
('vêtement', 'general', 'fr', 10),
('habit', 'general', 'fr', 10),
('chaussure', 'general', 'fr', 10),
('sac', 'general', 'fr', 10),
('montre', 'general', 'fr', 10),
('bijou', 'general', 'fr', 10),
('parfum', 'general', 'fr', 10),
('ملابس', 'general', 'ar', 10),
('أحذية', 'general', 'ar', 10),
('حقيبة', 'general', 'ar', 10),
('ساعة', 'general', 'ar', 10),
('عطر', 'general', 'ar', 10)
ON CONFLICT DO NOTHING;

-- Keywords EMPLOI
INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
('emploi', 'general', 'fr', 10),
('travail', 'general', 'fr', 10),
('job', 'general', 'fr', 10),
('recrutement', 'general', 'fr', 10),
('stage', 'general', 'fr', 10),
('cdi', 'general', 'fr', 10),
('cdd', 'general', 'fr', 10),
('عمل', 'general', 'ar', 10),
('وظيفة', 'general', 'ar', 10),
('توظيف', 'general', 'ar', 10),
('تدريب', 'general', 'ar', 10)
ON CONFLICT DO NOTHING;

-- Keywords SERVICES
INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
('service', 'general', 'fr', 10),
('réparation', 'general', 'fr', 10),
('dépannage', 'general', 'fr', 10),
('cours', 'general', 'fr', 10),
('formation', 'general', 'fr', 10),
('خدمة', 'general', 'ar', 10),
('إصلاح', 'general', 'ar', 10),
('دروس', 'general', 'ar', 10),
('تكوين', 'general', 'ar', 10),
('déménagement', 'general', 'fr', 9),
('transport', 'general', 'fr', 9),
('نقل', 'general', 'ar', 9)
ON CONFLICT DO NOTHING;

-- Keywords LOISIRS
INSERT INTO keywords (keyword, entity_type, language, weight) VALUES
('sport', 'general', 'fr', 10),
('jeu', 'general', 'fr', 10),
('console', 'general', 'fr', 10),
('playstation', 'general', 'fr', 10),
('xbox', 'general', 'fr', 10),
('vélo', 'general', 'fr', 10),
('رياضة', 'general', 'ar', 10),
('لعبة', 'general', 'ar', 10),
('دراجة', 'general', 'ar', 10)
ON CONFLICT DO NOTHING;

SELECT 'Keywords ajoutés avec succès - Total: ' || COUNT(*)::text FROM keywords;
