/*
  # Ajout des 11 wilayas manquantes (59-69)
  
  Ajoute les nouvelles wilayas créées récemment en Algérie pour compléter à 69 wilayas.
*/

INSERT INTO wilayas (code, name_fr, name_en, name_ar) VALUES
('59', 'Béchar', 'Bechar', 'بشار'),
('60', 'Béni Abbès', 'Beni Abbes', 'بني عباس'),
('61', 'Timimoun', 'Timimoun', 'تيميمون'),
('62', 'Ouled Djellal', 'Ouled Djellal', 'أولاد جلال'),
('63', 'Bordj Badji Mokhtar', 'Bordj Badji Mokhtar', 'برج باجي مختار'),
('64', 'In Salah', 'In Salah', 'عين صالح'),
('65', 'In Guezzam', 'In Guezzam', 'عين قزام'),
('66', 'Touggourt', 'Touggourt', 'تقرت'),
('67', 'Djanet', 'Djanet', 'جانت'),
('68', 'El M''Ghair', 'El M''Ghair', 'المغير'),
('69', 'El Meniaa', 'El Meniaa', 'المنيعة')
ON CONFLICT (code) DO NOTHING;
