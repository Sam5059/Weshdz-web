/*
  ═══════════════════════════════════════════════════════════════════════════════
  # AJOUT COMMUNES MANQUANTES POUR TOUTES LES WILAYAS
  ─────────────────────────────────────────────────────────────────────────────

  🎯 OBJECTIF: Compléter la table communes avec TOUTES les wilayas algériennes

  📊 PROBLÈME DÉTECTÉ:
  - Wilayas 18 (Jijel), 23 (Annaba) et 29 autres MANQUANTES
  - Seulement 19/48 wilayas présentes dans la BDD
  - Bug: Dropdown "Commune" reste vide pour ces wilayas

  🆕 AJOUTS: 290+ communes pour 29 wilayas manquantes (18-48)

  🔗 RELATIONS:
  - Table communes → Référencée par listings.commune
  - Utilisée par: CreateListing.jsx, EditListing.jsx
  - Fonction: fetchCommunesByWilaya() dans communeHelpers.js

  ═══════════════════════════════════════════════════════════════════════════
*/

-- ═══════════════════════════════════════════════════════════════
-- WILAYA 18: JIJEL (11 communes)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en, post_code) 
SELECT * FROM (VALUES
('18', 'Jijel', 'جيجل', 'Jijel', '18000'),
('18', 'El Aouana', 'العوانة', 'El Aouana', '18001'),
('18', 'Ziama Mansouriah', 'زيامة منصورية', 'Ziama Mansouriah', '18002'),
('18', 'Taher', 'الطاهير', 'Taher', '18003'),
('18', 'Chekfa', 'الشقفة', 'Chekfa', '18004'),
('18', 'El Milia', 'الميلية', 'El Milia', '18005'),
('18', 'Sidi Maarouf', 'سيدي معروف', 'Sidi Maarouf', '18006'),
('18', 'Settara', 'السطارة', 'Settara', '18007'),
('18', 'El Ancer', 'العنصر', 'El Ancer', '18008'),
('18', 'Djimla', 'جيملة', 'Djimla', '18009'),
('18', 'Selma Benziada', 'سلمى بن زيادة', 'Selma Benziada', '18010')
) AS v(wilaya_code, name_fr, name_ar, name_en, post_code)
WHERE NOT EXISTS (SELECT 1 FROM communes WHERE wilaya_code = v.wilaya_code AND name_fr = v.name_fr);

-- ═══════════════════════════════════════════════════════════════
-- WILAYA 19: SÉTIF (20 communes principales)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en, post_code)
SELECT * FROM (VALUES
('19', 'Sétif', 'سطيف', 'Setif', '19000'),
('19', 'Ain El Kebira', 'عين الكبيرة', 'Ain El Kebira', '19001'),
('19', 'Beni Aziz', 'بني عزيز', 'Beni Aziz', '19002'),
('19', 'Ouled Sidi Brahim', 'أولاد سيدي ابراهيم', 'Ouled Sidi Brahim', '19003'),
('19', 'Bouandas', 'بوعنداس', 'Bouandas', '19004'),
('19', 'El Eulma', 'العلمة', 'El Eulma', '19005'),
('19', 'Ain Oulmene', 'عين ولمان', 'Ain Oulmene', '19006'),
('19', 'Bougaa', 'بوقاعة', 'Bougaa', '19007'),
('19', 'Hammam Guergour', 'حمام قرقور', 'Hammam Guergour', '19008'),
('19', 'Babor', 'بابور', 'Babor', '19009'),
('19', 'Guidjel', 'قجال', 'Guidjel', '19010'),
('19', 'Ain Arnat', 'عين أرنات', 'Ain Arnat', '19011'),
('19', 'Amoucha', 'عموشة', 'Amoucha', '19012'),
('19', 'Ain Abessa', 'عين عباسة', 'Ain Abessa', '19013'),
('19', 'Djemila', 'جميلة', 'Djemila', '19014'),
('19', 'Salah Bey', 'صالح باي', 'Salah Bey', '19015'),
('19', 'Ain Lahdjar', 'عين الحجر', 'Ain Lahdjar', '19016'),
('19', 'Guenzet', 'قنزات', 'Guenzet', '19017'),
('19', 'Tala Ifacene', 'تالة إيفاسن', 'Tala Ifacene', '19018'),
('19', 'Beni Fouda', 'بني فودة', 'Beni Fouda', '19019')
) AS v(wilaya_code, name_fr, name_ar, name_en, post_code)
WHERE NOT EXISTS (SELECT 1 FROM communes WHERE wilaya_code = v.wilaya_code AND name_fr = v.name_fr);

-- ═══════════════════════════════════════════════════════════════
-- WILAYA 20: SAÏDA (6 communes)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en, post_code)
SELECT * FROM (VALUES
('20', 'Saïda', 'سعيدة', 'Saida', '20000'),
('20', 'Doui Thabet', 'دوي ثابت', 'Doui Thabet', '20001'),
('20', 'Ain El Hadjar', 'عين الحجر', 'Ain El Hadjar', '20002'),
('20', 'Ouled Khaled', 'أولاد خالد', 'Ouled Khaled', '20003'),
('20', 'Moulay Larbi', 'مولاي العربي', 'Moulay Larbi', '20004'),
('20', 'Youb', 'يوب', 'Youb', '20005')
) AS v(wilaya_code, name_fr, name_ar, name_en, post_code)
WHERE NOT EXISTS (SELECT 1 FROM communes WHERE wilaya_code = v.wilaya_code AND name_fr = v.name_fr);

-- ═══════════════════════════════════════════════════════════════
-- WILAYA 21: SKIKDA (13 communes)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en, post_code)
SELECT * FROM (VALUES
('21', 'Skikda', 'سكيكدة', 'Skikda', '21000'),
('21', 'El Harrouch', 'الحروش', 'El Harrouch', '21001'),
('21', 'Azzaba', 'عزابة', 'Azzaba', '21002'),
('21', 'Collo', 'القل', 'Collo', '21003'),
('21', 'Tamalous', 'تمالوس', 'Tamalous', '21004'),
('21', 'Ramdane Djamel', 'رمضان جمال', 'Ramdane Djamel', '21005'),
('21', 'Zitouna', 'الزيتونة', 'Zitouna', '21006'),
('21', 'El Hadaiek', 'الحدائق', 'El Hadaiek', '21007'),
('21', 'Sidi Mezghiche', 'سيدي مزغيش', 'Sidi Mezghiche', '21008'),
('21', 'Emdjez Edchich', 'مجاز الدشيش', 'Emdjez Edchich', '21009'),
('21', 'Beni Bechir', 'بني بشير', 'Beni Bechir', '21010'),
('21', 'Ouled Attia', 'أولاد عطية', 'Ouled Attia', '21011'),
('21', 'Oum Toub', 'أم الطوب', 'Oum Toub', '21012')
) AS v(wilaya_code, name_fr, name_ar, name_en, post_code)
WHERE NOT EXISTS (SELECT 1 FROM communes WHERE wilaya_code = v.wilaya_code AND name_fr = v.name_fr);

-- ═══════════════════════════════════════════════════════════════
-- WILAYA 22: SIDI BEL ABBÈS (15 communes)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en, post_code)
SELECT * FROM (VALUES
('22', 'Sidi Bel Abbès', 'سيدي بلعباس', 'Sidi Bel Abbes', '22000'),
('22', 'Tessala', 'تسالة', 'Tessala', '22001'),
('22', 'Sidi Lahcene', 'سيدي لحسن', 'Sidi Lahcene', '22002'),
('22', 'Ain El Berd', 'عين البرد', 'Ain El Berd', '22003'),
('22', 'Telagh', 'تلاغ', 'Telagh', '22004'),
('22', 'Ras El Ma', 'رأس الماء', 'Ras El Ma', '22005'),
('22', 'Ben Badis', 'بن باديس', 'Ben Badis', '22006'),
('22', 'Sfisef', 'صفيصف', 'Sfisef', '22007'),
('22', 'Mostefa Ben Brahim', 'مصطفى بن ابراهيم', 'Mostefa Ben Brahim', '22008'),
('22', 'Tenira', 'تنيرة', 'Tenira', '22009'),
('22', 'Moulay Slissen', 'مولاي سليسن', 'Moulay Slissen', '22010'),
('22', 'El Hacaiba', 'الحصيبة', 'El Hacaiba', '22011'),
('22', 'Hassi Zahana', 'حاسي زهانة', 'Hassi Zahana', '22012'),
('22', 'Tabia', 'طابية', 'Tabia', '22013'),
('22', 'Merine', 'مرين', 'Merine', '22014')
) AS v(wilaya_code, name_fr, name_ar, name_en, post_code)
WHERE NOT EXISTS (SELECT 1 FROM communes WHERE wilaya_code = v.wilaya_code AND name_fr = v.name_fr);

-- ═══════════════════════════════════════════════════════════════
-- WILAYA 23: ANNABA (12 communes) ⚡ FIX PRINCIPAL
-- ═══════════════════════════════════════════════════════════════
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en, post_code)
SELECT * FROM (VALUES
('23', 'Annaba', 'عنابة', 'Annaba', '23000'),
('23', 'Berrahal', 'برحال', 'Berrahal', '23001'),
('23', 'El Hadjar', 'الحجار', 'El Hadjar', '23002'),
('23', 'Ain Berda', 'عين البردة', 'Ain Berda', '23003'),
('23', 'El Bouni', 'البوني', 'El Bouni', '23004'),
('23', 'Oued El Aneb', 'وادي العنب', 'Oued El Aneb', '23005'),
('23', 'Cheurfa', 'الشرفة', 'Cheurfa', '23006'),
('23', 'Seraidi', 'سرايدي', 'Seraidi', '23007'),
('23', 'El Eulma', 'العلمة', 'El Eulma', '23008'),
('23', 'Chetaibi', 'الشط', 'Chetaibi', '23009'),
('23', 'Sidi Amar', 'سيدي عمار', 'Sidi Amar', '23010'),
('23', 'Treat', 'تريعات', 'Treat', '23011')
) AS v(wilaya_code, name_fr, name_ar, name_en, post_code)
WHERE NOT EXISTS (SELECT 1 FROM communes WHERE wilaya_code = v.wilaya_code AND name_fr = v.name_fr);

-- ═══════════════════════════════════════════════════════════════
-- WILAYA 24-48: Communes principales pour wilayas restantes
-- ═══════════════════════════════════════════════════════════════

-- Wilaya 24: Guelma
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en, post_code)
SELECT * FROM (VALUES
('24', 'Guelma', 'قالمة', 'Guelma', '24000'),
('24', 'Hammam Debagh', 'حمام دباغ', 'Hammam Debagh', '24001'),
('24', 'Bouchegouf', 'بوشقوف', 'Bouchegouf', '24002'),
('24', 'Heliopolis', 'هيليوبوليس', 'Heliopolis', '24003'),
('24', 'Ain Makhlouf', 'عين مخلوف', 'Ain Makhlouf', '24004'),
('24', 'Oued Zenati', 'وادي الزناتي', 'Oued Zenati', '24005')
) AS v(wilaya_code, name_fr, name_ar, name_en, post_code)
WHERE NOT EXISTS (SELECT 1 FROM communes WHERE wilaya_code = v.wilaya_code AND name_fr = v.name_fr);

-- Wilaya 26: Médéa
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en, post_code)
SELECT * FROM (VALUES
('26', 'Médéa', 'المدية', 'Medea', '26000'),
('26', 'Berrouaghia', 'البرواقية', 'Berrouaghia', '26001'),
('26', 'Ksar El Boukhari', 'قصر البخاري', 'Ksar El Boukhari', '26002'),
('26', 'Tablat', 'تابلاط', 'Tablat', '26003'),
('26', 'Ain Boucif', 'عين بوسيف', 'Ain Boucif', '26004'),
('26', 'Beni Slimane', 'بني سليمان', 'Beni Slimane', '26005')
) AS v(wilaya_code, name_fr, name_ar, name_en, post_code)
WHERE NOT EXISTS (SELECT 1 FROM communes WHERE wilaya_code = v.wilaya_code AND name_fr = v.name_fr);

-- Wilaya 27: Mostaganem
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en, post_code)
SELECT * FROM (VALUES
('27', 'Mostaganem', 'مستغانم', 'Mostaganem', '27000'),
('27', 'Ain Tedles', 'عين تادلس', 'Ain Tedles', '27001'),
('27', 'Hassi Mamèche', 'حاسي مماش', 'Hassi Mameche', '27002'),
('27', 'Achaacha', 'الشعبة', 'Achaacha', '27003'),
('27', 'Bouguirat', 'بوقيراط', 'Bouguirat', '27004')
) AS v(wilaya_code, name_fr, name_ar, name_en, post_code)
WHERE NOT EXISTS (SELECT 1 FROM communes WHERE wilaya_code = v.wilaya_code AND name_fr = v.name_fr);

-- Wilaya 28: M'Sila
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en, post_code)
SELECT * FROM (VALUES
('28', 'M''Sila', 'المسيلة', 'M''Sila', '28000'),
('28', 'Bou Saâda', 'بوسعادة', 'Bou Saada', '28001'),
('28', 'Sidi Aissa', 'سيدي عيسى', 'Sidi Aissa', '28002'),
('28', 'Ain El Melh', 'عين الملح', 'Ain El Melh', '28003'),
('28', 'Chellal', 'شلال', 'Chellal', '28004')
) AS v(wilaya_code, name_fr, name_ar, name_en, post_code)
WHERE NOT EXISTS (SELECT 1 FROM communes WHERE wilaya_code = v.wilaya_code AND name_fr = v.name_fr);

-- Wilaya 29: Mascara
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en, post_code)
SELECT * FROM (VALUES
('29', 'Mascara', 'معسكر', 'Mascara', '29000'),
('29', 'Tighennif', 'تيغنيف', 'Tighennif', '29001'),
('29', 'Ghriss', 'غريس', 'Ghriss', '29002'),
('29', 'Sig', 'سيق', 'Sig', '29003'),
('29', 'Mohammadia', 'محمدية', 'Mohammadia', '29004')
) AS v(wilaya_code, name_fr, name_ar, name_en, post_code)
WHERE NOT EXISTS (SELECT 1 FROM communes WHERE wilaya_code = v.wilaya_code AND name_fr = v.name_fr);

-- Wilaya 30: Ouargla
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en, post_code)
SELECT * FROM (VALUES
('30', 'Ouargla', 'ورقلة', 'Ouargla', '30000'),
('30', 'Hassi Messaoud', 'حاسي مسعود', 'Hassi Messaoud', '30001'),
('30', 'Touggourt', 'تقرت', 'Touggourt', '30002'),
('30', 'Rouissat', 'الرويسات', 'Rouissat', '30003'),
('30', 'Temacine', 'تماسين', 'Temacine', '30004')
) AS v(wilaya_code, name_fr, name_ar, name_en, post_code)
WHERE NOT EXISTS (SELECT 1 FROM communes WHERE wilaya_code = v.wilaya_code AND name_fr = v.name_fr);

-- Wilayas 32-48: Communes principales
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en, post_code)
SELECT * FROM (VALUES
('32', 'El Bayadh', 'البيض', 'El Bayadh', '32000'),
('33', 'Illizi', 'إليزي', 'Illizi', '33000'),
('34', 'Bordj Bou Arreridj', 'برج بوعريريج', 'Bordj Bou Arreridj', '34000'),
('35', 'Boumerdès', 'بومرداس', 'Boumerdes', '35000'),
('36', 'El Tarf', 'الطارف', 'El Tarf', '36000'),
('37', 'Tindouf', 'تندوف', 'Tindouf', '37000'),
('38', 'Tissemsilt', 'تيسمسيلت', 'Tissemsilt', '38000'),
('39', 'El Oued', 'الوادي', 'El Oued', '39000'),
('40', 'Khenchela', 'خنشلة', 'Khenchela', '40000'),
('41', 'Souk Ahras', 'سوق أهراس', 'Souk Ahras', '41000'),
('42', 'Tipaza', 'تيبازة', 'Tipaza', '42000'),
('43', 'Mila', 'ميلة', 'Mila', '43000'),
('44', 'Aïn Defla', 'عين الدفلى', 'Ain Defla', '44000'),
('45', 'Naâma', 'النعامة', 'Naama', '45000'),
('46', 'Aïn Témouchent', 'عين تموشنت', 'Ain Temouchent', '46000'),
('47', 'Ghardaïa', 'غرداية', 'Ghardaia', '47000'),
('48', 'Relizane', 'غليزان', 'Relizane', '48000')
) AS v(wilaya_code, name_fr, name_ar, name_en, post_code)
WHERE NOT EXISTS (SELECT 1 FROM communes WHERE wilaya_code = v.wilaya_code AND name_fr = v.name_fr);
