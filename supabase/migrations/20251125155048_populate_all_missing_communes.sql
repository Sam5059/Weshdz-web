/*
  # Populate communes for all wilayas

  1. Add communes for all 58 wilayas
    - Each wilaya gets its chef-lieu (main commune)
    - Major cities get additional communes
  
  2. Notes
    - This ensures all wilayas have at least one selectable commune
    - Users can now create listings in any wilaya
*/

-- Wilaya 02 - Chlef
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('02', 'Chlef', 'الشلف', 'Chlef'),
('02', 'Oued Fodda', 'وادي الفضة', 'Oued Fodda'),
('02', 'Ténès', 'تنس', 'Tenes')
ON CONFLICT DO NOTHING;

-- Wilaya 03 - Laghouat
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('03', 'Laghouat', 'الأغواط', 'Laghouat'),
('03', 'Aflou', 'أفلو', 'Aflou')
ON CONFLICT DO NOTHING;

-- Wilaya 04 - Oum El Bouaghi
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('04', 'Oum El Bouaghi', 'أم البواقي', 'Oum El Bouaghi'),
('04', 'Aïn Beïda', 'عين البيضاء', 'Ain Beida')
ON CONFLICT DO NOTHING;

-- Wilaya 06 - Béjaïa
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('06', 'Béjaïa', 'بجاية', 'Bejaia'),
('06', 'Akbou', 'أقبو', 'Akbou'),
('06', 'El Kseur', 'القصر', 'El Kseur')
ON CONFLICT DO NOTHING;

-- Wilaya 07 - Biskra
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('07', 'Biskra', 'بسكرة', 'Biskra'),
('07', 'Tolga', 'طولقة', 'Tolga'),
('07', 'Ouled Djellal', 'أولاد جلال', 'Ouled Djellal'),
('07', 'Sidi Okba', 'سيدي عقبة', 'Sidi Okba')
ON CONFLICT DO NOTHING;

-- Wilaya 08 - Béchar
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('08', 'Béchar', 'بشار', 'Bechar'),
('08', 'Abadla', 'عبادلة', 'Abadla')
ON CONFLICT DO NOTHING;

-- Wilaya 10 - Bouira
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('10', 'Bouira', 'البويرة', 'Bouira'),
('10', 'Lakhdaria', 'الأخضرية', 'Lakhdaria')
ON CONFLICT DO NOTHING;

-- Wilaya 11 - Tamanrasset
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('11', 'Tamanrasset', 'تمنراست', 'Tamanrasset'),
('11', 'In Guezzam', 'عين قزام', 'In Guezzam')
ON CONFLICT DO NOTHING;

-- Wilaya 12 - Tébessa
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('12', 'Tébessa', 'تبسة', 'Tebessa'),
('12', 'Cheria', 'الشريعة', 'Cheria')
ON CONFLICT DO NOTHING;

-- Wilaya 13 - Tlemcen
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('13', 'Tlemcen', 'تلمسان', 'Tlemcen'),
('13', 'Maghnia', 'مغنية', 'Maghnia'),
('13', 'Ghazaouet', 'الغزوات', 'Ghazaouet')
ON CONFLICT DO NOTHING;

-- Wilaya 14 - Tiaret
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('14', 'Tiaret', 'تيارت', 'Tiaret'),
('14', 'Sougueur', 'سوقر', 'Sougueur')
ON CONFLICT DO NOTHING;

-- Wilaya 17 - Djelfa
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('17', 'Djelfa', 'الجلفة', 'Djelfa'),
('17', 'Aïn Oussera', 'عين وسارة', 'Ain Oussera')
ON CONFLICT DO NOTHING;

-- Wilaya 18 - Jijel
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('18', 'Jijel', 'جيجل', 'Jijel'),
('18', 'Taher', 'الطاهير', 'Taher'),
('18', 'El Milia', 'الميلية', 'El Milia')
ON CONFLICT DO NOTHING;

-- Wilaya 20 - Saïda
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('20', 'Saïda', 'سعيدة', 'Saida'),
('20', 'Aïn El Hadjar', 'عين الحجر', 'Ain El Hadjar')
ON CONFLICT DO NOTHING;

-- Wilaya 21 - Skikda
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('21', 'Skikda', 'سكيكدة', 'Skikda'),
('21', 'Collo', 'القل', 'Collo'),
('21', 'Azzaba', 'عزابة', 'Azzaba')
ON CONFLICT DO NOTHING;

-- Wilaya 22 - Sidi Bel Abbès
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('22', 'Sidi Bel Abbès', 'سيدي بلعباس', 'Sidi Bel Abbes'),
('22', 'Telagh', 'تلاغ', 'Telagh')
ON CONFLICT DO NOTHING;

-- Wilaya 24 - Guelma
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('24', 'Guelma', 'قالمة', 'Guelma'),
('24', 'Héliopolis', 'هيليوبوليس', 'Heliopolis')
ON CONFLICT DO NOTHING;

-- Wilaya 26 - Médéa
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('26', 'Médéa', 'المدية', 'Medea'),
('26', 'Berrouaghia', 'البرواقية', 'Berrouaghia'),
('26', 'Ksar El Boukhari', 'قصر البخاري', 'Ksar El Boukhari')
ON CONFLICT DO NOTHING;

-- Wilaya 27 - Mostaganem
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('27', 'Mostaganem', 'مستغانم', 'Mostaganem'),
('27', 'Aïn Tedeles', 'عين تادلس', 'Ain Tedeles')
ON CONFLICT DO NOTHING;

-- Wilaya 28 - M'Sila
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('28', 'M''Sila', 'المسيلة', 'Msila'),
('28', 'Bou Saâda', 'بوسعادة', 'Bou Saada')
ON CONFLICT DO NOTHING;

-- Wilaya 29 - Mascara
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('29', 'Mascara', 'معسكر', 'Mascara'),
('29', 'Sig', 'سيق', 'Sig')
ON CONFLICT DO NOTHING;

-- Wilaya 30 - Ouargla
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('30', 'Ouargla', 'ورقلة', 'Ouargla'),
('30', 'Touggourt', 'تقرت', 'Touggourt'),
('30', 'Hassi Messaoud', 'حاسي مسعود', 'Hassi Messaoud')
ON CONFLICT DO NOTHING;

-- Wilaya 32 - El Bayadh
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('32', 'El Bayadh', 'البيض', 'El Bayadh')
ON CONFLICT DO NOTHING;

-- Wilaya 33 - Illizi
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('33', 'Illizi', 'إليزي', 'Illizi'),
('33', 'Djanet', 'جانت', 'Djanet')
ON CONFLICT DO NOTHING;

-- Wilaya 34 - Bordj Bou Arréridj
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('34', 'Bordj Bou Arréridj', 'برج بوعريريج', 'Bordj Bou Arreridj'),
('34', 'Ras El Oued', 'رأس الوادي', 'Ras El Oued')
ON CONFLICT DO NOTHING;

-- Wilaya 35 - Boumerdès
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('35', 'Boumerdès', 'بومرداس', 'Boumerdes'),
('35', 'Dellys', 'دلس', 'Dellys'),
('35', 'Khemis El Khechna', 'خميس الخشنة', 'Khemis El Khechna')
ON CONFLICT DO NOTHING;

-- Wilaya 36 - El Tarf
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('36', 'El Tarf', 'الطارف', 'El Tarf'),
('36', 'Ben M''Hidi', 'بن مهيدي', 'Ben Mhidi')
ON CONFLICT DO NOTHING;

-- Wilaya 37 - Tindouf
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('37', 'Tindouf', 'تندوف', 'Tindouf')
ON CONFLICT DO NOTHING;

-- Wilaya 38 - Tissemsilt
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('38', 'Tissemsilt', 'تيسمسيلت', 'Tissemsilt')
ON CONFLICT DO NOTHING;

-- Wilaya 39 - El Oued
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('39', 'El Oued', 'الوادي', 'El Oued'),
('39', 'Robbah', 'الرباح', 'Robbah')
ON CONFLICT DO NOTHING;

-- Wilaya 40 - Khenchela
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('40', 'Khenchela', 'خنشلة', 'Khenchela'),
('40', 'Aïn Touila', 'عين الطويلة', 'Ain Touila')
ON CONFLICT DO NOTHING;

-- Wilaya 41 - Souk Ahras
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('41', 'Souk Ahras', 'سوق أهراس', 'Souk Ahras'),
('41', 'Sedrata', 'سدراتة', 'Sedrata')
ON CONFLICT DO NOTHING;

-- Wilaya 42 - Tipaza
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('42', 'Tipaza', 'تيبازة', 'Tipaza'),
('42', 'Cherchell', 'شرشال', 'Cherchell'),
('42', 'Koléa', 'القليعة', 'Kolea')
ON CONFLICT DO NOTHING;

-- Wilaya 43 - Mila
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('43', 'Mila', 'ميلة', 'Mila'),
('43', 'Chelghoum Laïd', 'شلغوم العيد', 'Chelghoum Laid')
ON CONFLICT DO NOTHING;

-- Wilaya 44 - Aïn Defla
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('44', 'Aïn Defla', 'عين الدفلى', 'Ain Defla'),
('44', 'Khemis Miliana', 'خميس مليانة', 'Khemis Miliana')
ON CONFLICT DO NOTHING;

-- Wilaya 45 - Naâma
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('45', 'Naâma', 'النعامة', 'Naama'),
('45', 'Mécheria', 'المشرية', 'Mecheria')
ON CONFLICT DO NOTHING;

-- Wilaya 46 - Aïn Témouchent
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('46', 'Aïn Témouchent', 'عين تموشنت', 'Ain Temouchent'),
('46', 'Hammam Bou Hadjar', 'حمام بوحجر', 'Hammam Bou Hadjar')
ON CONFLICT DO NOTHING;

-- Wilaya 47 - Ghardaïa
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('47', 'Ghardaïa', 'غرداية', 'Ghardaia'),
('47', 'Berriane', 'بريان', 'Berriane'),
('47', 'El Meniaa', 'المنيعة', 'El Meniaa')
ON CONFLICT DO NOTHING;

-- Wilaya 48 - Relizane
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('48', 'Relizane', 'غليزان', 'Relizane'),
('48', 'Oued Rhiou', 'وادي رهيو', 'Oued Rhiou')
ON CONFLICT DO NOTHING;

-- Wilaya 49 - Timimoun
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('49', 'Timimoun', 'تيميمون', 'Timimoun')
ON CONFLICT DO NOTHING;

-- Wilaya 50 - Bordj Badji Mokhtar
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('50', 'Bordj Badji Mokhtar', 'برج باجي مختار', 'Bordj Badji Mokhtar')
ON CONFLICT DO NOTHING;

-- Wilaya 51 - Ouled Djellal
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('51', 'Ouled Djellal', 'أولاد جلال', 'Ouled Djellal')
ON CONFLICT DO NOTHING;

-- Wilaya 52 - Béni Abbès
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('52', 'Béni Abbès', 'بني عباس', 'Beni Abbes')
ON CONFLICT DO NOTHING;

-- Wilaya 53 - In Salah
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('53', 'In Salah', 'عين صالح', 'In Salah')
ON CONFLICT DO NOTHING;

-- Wilaya 54 - In Guezzam
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('54', 'In Guezzam', 'عين قزام', 'In Guezzam')
ON CONFLICT DO NOTHING;

-- Wilaya 55 - Touggourt
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('55', 'Touggourt', 'تقرت', 'Touggourt')
ON CONFLICT DO NOTHING;

-- Wilaya 56 - Djanet
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('56', 'Djanet', 'جانت', 'Djanet')
ON CONFLICT DO NOTHING;

-- Wilaya 57 - El M'Ghair
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('57', 'El M''Ghair', 'المغير', 'El Mghair')
ON CONFLICT DO NOTHING;

-- Wilaya 58 - El Meniaa
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('58', 'El Meniaa', 'المنيعة', 'El Meniaa')
ON CONFLICT DO NOTHING;
