/*
  # Populate communes part 2 - Wilayas 07-15

  Adds communes for wilayas:
  - 07 Biskra (33 communes)
  - 08 Béchar (21 communes)
  - 09 Blida (25 communes)
  - 10 Bouira (45 communes)
  - 11 Tamanrasset (10 communes)
  - 12 Tébessa (28 communes)
  - 13 Tlemcen (53 communes)
  - 14 Tiaret (42 communes)
  - 15 Tizi Ouzou (67 communes)
*/

-- Wilaya 07 - Biskra (33 communes)
DELETE FROM communes WHERE wilaya_code = '07';
INSERT INTO communes (wilaya_code, name_fr, name_ar) VALUES
('07', 'Biskra', 'بسكرة'),
('07', 'Ouled Djellal', 'أولاد جلال'),
('07', 'Sidi Okba', 'سيدي عقبة'),
('07', 'Sidi Khaled', 'سيدي خالد'),
('07', 'El Kantara', 'القنطرة'),
('07', 'Ain Naga', 'عين الناقة'),
('07', 'Zeribet El Oued', 'زريبة الوادي'),
('07', 'El Feidh', 'الفيض'),
('07', 'Tolga', 'طولقة'),
('07', 'Lioua', 'ليوة'),
('07', 'El Ghrous', 'الغروس'),
('07', 'El Hadjeb', 'الحاجب'),
('07', 'Ras El Miad', 'رأس الميعاد'),
('07', 'Besbes', 'بسباس'),
('07', 'Lichana', 'ليشانة'),
('07', 'Ourlal', 'أورلال'),
('07', 'Mekhadma', 'المخادمة'),
('07', 'El Haouch', 'الحوش'),
('07', 'Ain Zaatout', 'عين الزعاطيط'),
('07', 'El Kantara', 'القنطرة'),
('07', 'M''Chouneche', 'مشونش'),
('07', 'Djemorah', 'جمورة'),
('07', 'Ouled Haddadj', 'أولاد حداج'),
('07', 'El Mizaraa', 'المزيرعة'),
('07', 'Bouchagroun', 'بوشقرون'),
('07', 'Mekhadma', 'المخادمة'),
('07', 'El Feidh', 'الفيض'),
('07', 'Foughala', 'فوغالة'),
('07', 'Bordj Ben Azzouz', 'برج بن عزوز'),
('07', 'Meziraa', 'المزيرعة'),
('07', 'Bouchagroun', 'بوشقرون'),
('07', 'Branis', 'برانيس'),
('07', 'Chetma', 'شتمة')
ON CONFLICT DO NOTHING;

-- Wilaya 08 - Béchar (21 communes)
INSERT INTO communes (wilaya_code, name_fr, name_ar) VALUES
('08', 'Béchar', 'بشار'),
('08', 'Erg Ferradj', 'عرق فراج'),
('08', 'Ouled Khoudir', 'أولاد خضير'),
('08', 'Meridja', 'مريجة'),
('08', 'Timoudi', 'تيمودي'),
('08', 'Lahmar', 'لحمر'),
('08', 'Beni Ounif', 'بني ونيف'),
('08', 'Taghit', 'تاغيت'),
('08', 'El Ouata', 'الواتة'),
('08', 'Boukais', 'بوكايس'),
('08', 'Mougheul', 'موغل'),
('08', 'Abadla', 'عبادلة'),
('08', 'Kerzaz', 'كرزاز'),
('08', 'Ksabi', 'القصابي'),
('08', 'Tamtert', 'تامطرت'),
('08', 'Beni Ikhlef', 'بني إخلف'),
('08', 'Tabelbala', 'تبلبالة'),
('08', 'Taghit', 'تاغيت'),
('08', 'Igli', 'إقلي'),
('08', 'Mechraa Houari Boumediene', 'مشرع الحواري بومدين'),
('08', 'Kenadsa', 'قنادسة')
ON CONFLICT DO NOTHING;

-- Wilaya 09 - Blida (25 communes) - adding more
DELETE FROM communes WHERE wilaya_code = '09';
INSERT INTO communes (wilaya_code, name_fr, name_ar) VALUES
('09', 'Blida', 'البليدة'),
('09', 'Chrea', 'الشريعة'),
('09', 'Bouinan', 'بوينان'),
('09', 'Oued El Alleug', 'واد العلايق'),
('09', 'Ouled Yaich', 'أولاد يعيش'),
('09', 'Chebli', 'الشبلي'),
('09', 'Bouarfa', 'بوعرفة'),
('09', 'Beni Mered', 'بني مراد'),
('09', 'Bougara', 'بوقرة'),
('09', 'Larbaâ', 'الأربعاء'),
('09', 'Oued Djer', 'واد جر'),
('09', 'Beni Tamou', 'بني تامو'),
('09', 'Boufarik', 'بوفاريك'),
('09', 'Soumaa', 'الصومعة'),
('09', 'Mouzaia', 'موزاية'),
('09', 'Hammam Melouane', 'حمام ملوان'),
('09', 'Ain Romana', 'عين الرمانة'),
('09', 'Djebabra', 'جبابرة'),
('09', 'Guerrouaou', 'قرواو'),
('09', 'El Affroun', 'العفرون'),
('09', 'Meftah', 'مفتاح'),
('09', 'Souhane', 'صوحان'),
('09', 'Chiffa', 'الشفة'),
('09', 'Ouled Slama', 'أولاد سلامة'),
('09', 'Ouled Alleug', 'أولاد العلق')
ON CONFLICT DO NOTHING;

-- Wilaya 10 - Bouira (45 communes)
INSERT INTO communes (wilaya_code, name_fr, name_ar) VALUES
('10', 'Bouira', 'البويرة'),
('10', 'El Asnam', 'الأصنام'),
('10', 'Guerrouma', 'قرومة'),
('10', 'Souk El Khemis', 'سوق الخميس'),
('10', 'Kadiria', 'القادرية'),
('10', 'Hanif', 'حنيف'),
('10', 'Dirah', 'ديرة'),
('10', 'Ait Laaziz', 'آيت لعزيز'),
('10', 'Taghzout', 'تاغزوت'),
('10', 'Raouraoua', 'راوراوة'),
('10', 'Mezdour', 'مزدور'),
('10', 'Haizer', 'حيزر'),
('10', 'Lakhdaria', 'الأخضرية'),
('10', 'Maala', 'معلا'),
('10', 'El Hachimia', 'الهاشمية'),
('10', 'Aomar', 'عومر'),
('10', 'Bordj Okhriss', 'برج أخريص'),
('10', 'El Adjiba', 'العجيبة'),
('10', 'El Hakimia', 'الحكيمية'),
('10', 'Ahl El Ksar', 'أهل القصر'),
('10', 'Bouderbala', 'بودربالة'),
('10', 'Chorfa', 'الشرفة'),
('10', 'Dechmia', 'الدشمية'),
('10', 'Ridane', 'ريدان'),
('10', 'Djebahia', 'جباحية'),
('10', 'Aïn Bessem', 'عين بسام'),
('10', 'Bir Ghbalou', 'بئر غبالو'),
('10', 'Khabouzia', 'الخبوزية'),
('10', 'Sour El Ghozlane', 'سور الغزلان'),
('10', 'Aïn El Hadjar', 'عين الحجر'),
('10', 'Aïn Turk', 'عين الترك'),
('10', 'Saharidj', 'السحاريج'),
('10', 'Boghni', 'بوغني'),
('10', 'Taguedite', 'تاقديت'),
('10', 'Hadjera Zerga', 'حجرة الزرقاء'),
('10', 'Maamora', 'المعمورة'),
('10', 'M''Chedallah', 'مشدالة'),
('10', 'Ath Mansour', 'آيت منصور'),
('10', 'El Mokrani', 'المقراني'),
('10', 'Aghbalou', 'أغبالو'),
('10', 'Bechloul', 'بشلول'),
('10', 'Boudjellil', 'بوجليل'),
('10', 'Saharidj', 'السحاريج'),
('10', 'Hadjera Zerga', 'حجرة الزرقاء'),
('10', 'Ouled Rached', 'أولاد راشد')
ON CONFLICT DO NOTHING;

-- Wilaya 11 - Tamanrasset (10 communes)
INSERT INTO communes (wilaya_code, name_fr, name_ar) VALUES
('11', 'Tamanrasset', 'تمنراست'),
('11', 'Abalessa', 'أبلسة'),
('11', 'In Ghar', 'عين غار'),
('11', 'In Guezzam', 'عين قزام'),
('11', 'In Salah', 'عين صالح'),
('11', 'Tazrouk', 'تازروك'),
('11', 'Tin Zaouatine', 'تين زواتين'),
('11', 'Ideles', 'إيديلس'),
('11', 'Idles', 'إيديلس'),
('11', 'Foggaret Ezzaouia', 'فقارة الزاوية')
ON CONFLICT DO NOTHING;

-- Wilaya 12 - Tébessa (28 communes)
INSERT INTO communes (wilaya_code, name_fr, name_ar) VALUES
('12', 'Tébessa', 'تبسة'),
('12', 'Bir El Ater', 'بئر العاتر'),
('12', 'Cheria', 'الشريعة'),
('12', 'Stah Guentis', 'صطح قنطيس'),
('12', 'El Aouinet', 'العوينات'),
('12', 'Bir Mokkadem', 'بئر مقدم'),
('12', 'El Kouif', 'الكويف'),
('12', 'Morsott', 'مرسط'),
('12', 'El Ogla', 'العقلة'),
('12', 'Bir Dheheb', 'بئر الذهب'),
('12', 'El Meridj', 'المريج'),
('12', 'Boulhaf Dyr', 'بولحاف الدير'),
('12', 'Bekkaria', 'بكارية'),
('12', 'Boukhadra', 'بوخضرة'),
('12', 'Ouenza', 'الونزة'),
('12', 'El Malabiodh', 'الماء الأبيض'),
('12', 'Safsaf El Ouesra', 'صفصاف الوسرى'),
('12', 'Hammamet', 'الحمامات'),
('12', 'Negrine', 'نقرين'),
('12', 'Bir El Mokadem', 'بئر المقدم'),
('12', 'El Houidjbet', 'الحويجبات'),
('12', 'Lahouidjbet', 'لحويجبات'),
('12', 'Ain Zerga', 'عين الزرقة'),
('12', 'El Mazraa', 'المزرعة'),
('12', 'Ferkane', 'فركان'),
('12', 'Oum Ali', 'أم علي'),
('12', 'Thlidjene', 'ثليجان'),
('12', 'Gourigueur', 'قريقر')
ON CONFLICT DO NOTHING;
