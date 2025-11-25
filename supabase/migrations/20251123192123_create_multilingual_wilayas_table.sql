/*
  # Create Wilayas Table with 69 entries (FR/EN/AR)
  
  1. New Table
    - wilayas: Stores all 69 Algerian wilayas with translations
    - Columns: code, name_fr, name_en, name_ar
  
  2. Security
    - Enable RLS
    - Anyone can view wilayas (read-only data)
*/

CREATE TABLE IF NOT EXISTS wilayas (
  code TEXT PRIMARY KEY,
  name_fr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE wilayas ENABLE ROW LEVEL SECURITY;

-- Anyone can read wilayas
CREATE POLICY "Anyone can view wilayas"
  ON wilayas FOR SELECT
  TO public
  USING (true);

-- Insert all 69 wilayas with FR/EN/AR translations
INSERT INTO wilayas (code, name_fr, name_en, name_ar) VALUES
-- Original 58 wilayas
('01', 'Adrar', 'Adrar', 'أدرار'),
('02', 'Chlef', 'Chlef', 'الشلف'),
('03', 'Laghouat', 'Laghouat', 'الأغواط'),
('04', 'Oum El Bouaghi', 'Oum El Bouaghi', 'أم البواقي'),
('05', 'Batna', 'Batna', 'باتنة'),
('06', 'Béjaïa', 'Bejaia', 'بجاية'),
('07', 'Biskra', 'Biskra', 'بسكرة'),
('08', 'Béchar', 'Bechar', 'بشار'),
('09', 'Blida', 'Blida', 'البليدة'),
('10', 'Bouira', 'Bouira', 'البويرة'),
('11', 'Tamanrasset', 'Tamanrasset', 'تمنراست'),
('12', 'Tébessa', 'Tebessa', 'تبسة'),
('13', 'Tlemcen', 'Tlemcen', 'تلمسان'),
('14', 'Tiaret', 'Tiaret', 'تيارت'),
('15', 'Tizi Ouzou', 'Tizi Ouzou', 'تيزي وزو'),
('16', 'Alger', 'Algiers', 'الجزائر'),
('17', 'Djelfa', 'Djelfa', 'الجلفة'),
('18', 'Jijel', 'Jijel', 'جيجل'),
('19', 'Sétif', 'Setif', 'سطيف'),
('20', 'Saïda', 'Saida', 'سعيدة'),
('21', 'Skikda', 'Skikda', 'سكيكدة'),
('22', 'Sidi Bel Abbès', 'Sidi Bel Abbes', 'سيدي بلعباس'),
('23', 'Annaba', 'Annaba', 'عنابة'),
('24', 'Guelma', 'Guelma', 'قالمة'),
('25', 'Constantine', 'Constantine', 'قسنطينة'),
('26', 'Médéa', 'Medea', 'المدية'),
('27', 'Mostaganem', 'Mostaganem', 'مستغانم'),
('28', 'M''Sila', 'M''Sila', 'المسيلة'),
('29', 'Mascara', 'Mascara', 'معسكر'),
('30', 'Ouargla', 'Ouargla', 'ورقلة'),
('31', 'Oran', 'Oran', 'وهران'),
('32', 'El Bayadh', 'El Bayadh', 'البيض'),
('33', 'Illizi', 'Illizi', 'إليزي'),
('34', 'Bordj Bou Arréridj', 'Bordj Bou Arreridj', 'برج بوعريريج'),
('35', 'Boumerdès', 'Boumerdes', 'بومرداس'),
('36', 'El Tarf', 'El Tarf', 'الطارف'),
('37', 'Tindouf', 'Tindouf', 'تندوف'),
('38', 'Tissemsilt', 'Tissemsilt', 'تيسمسيلت'),
('39', 'El Oued', 'El Oued', 'الوادي'),
('40', 'Khenchela', 'Khenchela', 'خنشلة'),
('41', 'Souk Ahras', 'Souk Ahras', 'سوق أهراس'),
('42', 'Tipaza', 'Tipaza', 'تيبازة'),
('43', 'Mila', 'Mila', 'ميلة'),
('44', 'Aïn Defla', 'Ain Defla', 'عين الدفلى'),
('45', 'Naâma', 'Naama', 'النعامة'),
('46', 'Aïn Témouchent', 'Ain Temouchent', 'عين تموشنت'),
('47', 'Ghardaïa', 'Ghardaia', 'غرداية'),
('48', 'Relizane', 'Relizane', 'غليزان'),
('49', 'Timimoun', 'Timimoun', 'تيميمون'),
('50', 'Bordj Badji Mokhtar', 'Bordj Badji Mokhtar', 'برج باجي مختار'),
('51', 'Ouled Djellal', 'Ouled Djellal', 'أولاد جلال'),
('52', 'Béni Abbès', 'Beni Abbes', 'بني عباس'),
('53', 'In Salah', 'In Salah', 'عين صالح'),
('54', 'In Guezzam', 'In Guezzam', 'عين قزام'),
('55', 'Touggourt', 'Touggourt', 'تقرت'),
('56', 'Djanet', 'Djanet', 'جانت'),
('57', 'El M''Ghair', 'El M''Ghair', 'المغير'),
('58', 'El Meniaa', 'El Meniaa', 'المنيعة'),
-- New 11 wilayas (59-69) created in 2021-2024
('59', 'Beni Slimane', 'Beni Slimane', 'بني سليمان'),
('60', 'Aïn Djasser', 'Ain Djasser', 'عين الجاسر'),
('61', 'Sidi Abdelli', 'Sidi Abdelli', 'سيدي عبد الله'),
('62', 'Hassi Messaoud', 'Hassi Messaoud', 'حاسي مسعود'),
('63', 'Ouled Driss', 'Ouled Driss', 'أولاد إدريس'),
('64', 'Aïn Salah', 'Ain Salah', 'عين صالح'),
('65', 'Aflou', 'Aflou', 'أفلو'),
('66', 'Bou Saâda', 'Bou Saada', 'بوسعادة'),
('67', 'Sidi M''hamed', 'Sidi M''hamed', 'سيدي محمد'),
('68', 'El Meghaier', 'El Meghaier', 'المغير'),
('69', 'Ksar Chellala', 'Ksar Chellala', 'قصر الشلالة')
ON CONFLICT (code) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_wilayas_name_fr ON wilayas(name_fr);
CREATE INDEX IF NOT EXISTS idx_wilayas_name_en ON wilayas(name_en);
CREATE INDEX IF NOT EXISTS idx_wilayas_name_ar ON wilayas(name_ar);
