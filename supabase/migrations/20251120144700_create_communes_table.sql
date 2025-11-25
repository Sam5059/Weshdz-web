/*
  # Créer la table des communes avec traductions

  1. Nouvelle Table
    - `communes`
      - `id` (uuid, primary key)
      - `wilaya_code` (text, code de la wilaya 01-58)
      - `name_fr` (text, nom en français)
      - `name_ar` (text, nom en arabe)
      - `name_en` (text, nom en anglais)
      - `post_code` (text, code postal optionnel)
      - `created_at` (timestamptz)

  2. Sécurité
    - Enable RLS sur la table `communes`
    - Ajouter une politique SELECT publique (lecture seule pour tous)

  3. Indexation
    - Index sur wilaya_code pour recherche rapide
*/

-- Créer la table communes
CREATE TABLE IF NOT EXISTS communes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wilaya_code text NOT NULL,
  name_fr text NOT NULL,
  name_ar text,
  name_en text,
  post_code text,
  created_at timestamptz DEFAULT now()
);

-- Activer RLS
ALTER TABLE communes ENABLE ROW LEVEL SECURITY;

-- Politique de lecture publique
CREATE POLICY "Anyone can read communes"
  ON communes
  FOR SELECT
  TO public
  USING (true);

-- Index pour recherche rapide par wilaya
CREATE INDEX IF NOT EXISTS idx_communes_wilaya_code ON communes(wilaya_code);

-- Insérer quelques communes pour Alger (01) comme exemple
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('01', 'Alger Centre', 'الجزائر الوسطى', 'Algiers Center'),
('01', 'Bab El Oued', 'باب الوادي', 'Bab El Oued'),
('01', 'Hydra', 'حيدرة', 'Hydra'),
('01', 'Kouba', 'القبة', 'Kouba'),
('01', 'El Biar', 'الأبيار', 'El Biar'),
('01', 'Bir Mourad Raïs', 'بئر مراد رايس', 'Bir Mourad Rais'),
('01', 'El Mouradia', 'المرادية', 'El Mouradia'),
('01', 'Sidi M''Hamed', 'سيدي امحمد', 'Sidi M''Hamed'),
('01', 'Bouzareah', 'بوزريعة', 'Bouzareah'),
('01', 'Hussein Dey', 'حسين داي', 'Hussein Dey')
ON CONFLICT DO NOTHING;

-- Insérer quelques communes pour Oran (31)
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('31', 'Oran', 'وهران', 'Oran'),
('31', 'Es Sénia', 'السانية', 'Es Senia'),
('31', 'Bir El Djir', 'بئر الجير', 'Bir El Djir'),
('31', 'Arzew', 'أرزيو', 'Arzew'),
('31', 'Aïn El Turck', 'عين الترك', 'Ain El Turck')
ON CONFLICT DO NOTHING;

-- Insérer quelques communes pour Constantine (25)
INSERT INTO communes (wilaya_code, name_fr, name_ar, name_en) VALUES
('25', 'Constantine', 'قسنطينة', 'Constantine'),
('25', 'El Khroub', 'الخروب', 'El Khroub'),
('25', 'Hamma Bouziane', 'حامة بوزيان', 'Hamma Bouziane'),
('25', 'Didouche Mourad', 'ديدوش مراد', 'Didouche Mourad'),
('25', 'Zighoud Youcef', 'زيغود يوسف', 'Zighoud Youcef')
ON CONFLICT DO NOTHING;
