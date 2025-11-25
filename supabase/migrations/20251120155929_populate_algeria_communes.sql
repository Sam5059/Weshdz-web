/*
  # Populate Algeria Communes with Correct Wilaya Codes

  1. Purpose
    - Add real Algerian communes for major wilayas
    - Fix incorrect wilaya_code mapping
    - Each commune linked to correct wilaya

  2. Coverage
    - Top 10 most populated wilayas
    - 5-15 main communes per wilaya
    - Bilingual names (French + Arabic)

  3. Wilayas Included
    - 01 Adrar
    - 02 Chlef  
    - 03 Laghouat
    - 09 Blida
    - 16 Alger (Capital)
    - 25 Constantine
    - 31 Oran
    - 34 Bordj Bou Arreridj
    - 35 Boumerdes
    - 36 El Tarf
*/

-- 01 - Adrar
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('01', 'Adrar', 'أدرار', 'Adrar'),
('01', 'Timimoun', 'تيميمون', 'Timimoun'),
('01', 'Reggane', 'رقان', 'Reggane'),
('01', 'Aoulef', 'أولف', 'Aoulef'),
('01', 'Zaouiet Kounta', 'زاوية كنتة', 'Zaouiet Kounta');

-- 02 - Chlef
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('02', 'Chlef', 'الشلف', 'Chlef'),
('02', 'Ténès', 'تنس', 'Tenes'),
('02', 'Oued Fodda', 'وادي الفضة', 'Oued Fodda'),
('02', 'El Karimia', 'الكريمية', 'El Karimia'),
('02', 'Boukadir', 'بوقادير', 'Boukadir');

-- 03 - Laghouat
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('03', 'Laghouat', 'الأغواط', 'Laghouat'),
('03', 'Aflou', 'أفلو', 'Aflou'),
('03', 'Brida', 'بريدة', 'Brida'),
('03', 'Hassi R''Mel', 'حاسي الرمل', 'Hassi R''Mel');

-- 09 - Blida
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('09', 'Blida', 'البليدة', 'Blida'),
('09', 'Boufarik', 'بوفاريك', 'Boufarik'),
('09', 'Bougara', 'بوقرة', 'Bougara'),
('09', 'Beni Mered', 'بني مراد', 'Beni Mered'),
('09', 'Bouinan', 'بوينان', 'Bouinan'),
('09', 'Souma', 'الصومعة', 'Souma'),
('09', 'Meftah', 'مفتاح', 'Meftah');

-- 16 - Alger (Capital - Most Important!)
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('16', 'Alger Centre', 'الجزائر الوسطى', 'Algiers Center'),
('16', 'Bab El Oued', 'باب الواد', 'Bab El Oued'),
('16', 'Hydra', 'حيدرة', 'Hydra'),
('16', 'Kouba', 'القبة', 'Kouba'),
('16', 'El Biar', 'الأبيار', 'El Biar'),
('16', 'Bir Mourad Rais', 'بئر مراد رايس', 'Bir Mourad Rais'),
('16', 'Bouzareah', 'بوزريعة', 'Bouzareah'),
('16', 'El Mouradia', 'المرادية', 'El Mouradia'),
('16', 'Hussein Dey', 'حسين داي', 'Hussein Dey'),
('16', 'Sidi M''Hamed', 'سيدي امحمد', 'Sidi M''Hamed'),
('16', 'Bir Touta', 'بئر التوتة', 'Bir Touta'),
('16', 'Cheraga', 'الشراقة', 'Cheraga'),
('16', 'Draria', 'درارية', 'Draria'),
('16', 'Baraki', 'براقي', 'Baraki'),
('16', 'Birtouta', 'بئر توتة', 'Birtouta'),
('16', 'El Harrach', 'الحراش', 'El Harrach'),
('16', 'Rouiba', 'الرويبة', 'Rouiba'),
('16', 'Reghaia', 'رغاية', 'Reghaia'),
('16', 'Dar El Beida', 'دار البيضاء', 'Dar El Beida'),
('16', 'Bab Ezzouar', 'باب الزوار', 'Bab Ezzouar');

-- 25 - Constantine
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('25', 'Constantine', 'قسنطينة', 'Constantine'),
('25', 'El Khroub', 'الخروب', 'El Khroub'),
('25', 'Ain Smara', 'عين السمارة', 'Ain Smara'),
('25', 'Hamma Bouziane', 'حامة بوزيان', 'Hamma Bouziane'),
('25', 'Zighoud Youcef', 'زيغود يوسف', 'Zighoud Youcef'),
('25', 'Didouche Mourad', 'ديدوش مراد', 'Didouche Mourad'),
('25', 'Ibn Ziad', 'ابن زياد', 'Ibn Ziad');

-- 31 - Oran
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('31', 'Oran', 'وهران', 'Oran'),
('31', 'Bir El Djir', 'بئر الجير', 'Bir El Djir'),
('31', 'Es Senia', 'السانية', 'Es Senia'),
('31', 'Arzew', 'أرزيو', 'Arzew'),
('31', 'Bethioua', 'بطيوة', 'Bethioua'),
('31', 'Ain El Turck', 'عين الترك', 'Ain El Turck'),
('31', 'Mers El Kebir', 'المرسى الكبير', 'Mers El Kebir'),
('31', 'Gdyel', 'قديل', 'Gdyel'),
('31', 'Hassi Bounif', 'حاسي بونيف', 'Hassi Bounif');

-- 34 - Bordj Bou Arreridj
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('34', 'Bordj Bou Arreridj', 'برج بوعريريج', 'Bordj Bou Arreridj'),
('34', 'Ras El Oued', 'رأس الوادي', 'Ras El Oued'),
('34', 'El Achir', 'العشير', 'El Achir'),
('34', 'Mansourah', 'المنصورة', 'Mansourah'),
('34', 'Medjana', 'مجانة', 'Medjana');

-- 35 - Boumerdes
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('35', 'Boumerdes', 'بومرداس', 'Boumerdes'),
('35', 'Dellys', 'دلس', 'Dellys'),
('35', 'Thenia', 'الثنية', 'Thenia'),
('35', 'Bordj Menaiel', 'برج منايل', 'Bordj Menaiel'),
('35', 'Naciria', 'الناصرية', 'Naciria'),
('35', 'Boudouaou', 'بودواو', 'Boudouaou');

-- 36 - El Tarf
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('36', 'El Tarf', 'الطارف', 'El Tarf'),
('36', 'Ben M''Hidi', 'بن مهيدي', 'Ben M''Hidi'),
('36', 'Besbes', 'بسباس', 'Besbes'),
('36', 'Bouteldja', 'بوثلجة', 'Bouteldja'),
('36', 'Drean', 'الذرعان', 'Drean');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_communes_wilaya_code ON communes(wilaya_code);
CREATE INDEX IF NOT EXISTS idx_communes_name_fr ON communes(name_fr);
