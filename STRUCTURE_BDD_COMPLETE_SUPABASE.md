# 🗄️ STRUCTURE BASE DE DONNÉES COMPLÈTE - WESH-DZ
## ARCHITECTURE SUPABASE POUR 14 CATÉGORIES

---

## 📋 VUE D'ENSEMBLE : ARCHITECTURE GLOBALE

```
┌─────────────────────────────────────────────────┐
│           TABLES CENTRALES (CORE)               │
│  • categories                                   │
│  • listings (annonces)                          │
│  • users (Supabase Auth)                        │
│  • wilayas                                      │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│      TABLES SPÉCIFIQUES PAR CATÉGORIE           │
│  • vehicle_details                              │
│  • real_estate_rental_details                   │
│  • employment_details                           │
│  • service_details                              │
│  • electronics_details                          │
│  • fashion_details                              │
│  • home_details                                 │
│  • leisure_details                              │
│  • equipment_rental_details                     │
│  • animal_details                               │
│  • baby_details                                 │
│  • books_media_details                          │
│  • real_estate_sale_details                     │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│         TABLES DE RÉFÉRENCE (LOOKUP)            │
│  • vehicle_brands                               │
│  • vehicle_models                               │
│  • communes                                     │
│  • skills                                       │
└─────────────────────────────────────────────────┘
```

---

## 🎯 PARTIE 1 : TABLES CENTRALES

### 1. TABLE : `categories`
**Rôle :** Stocker les 14 catégories principales

**Structure SQL :**
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_fr TEXT NOT NULL,
  name_ar TEXT,
  name_en TEXT,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Données initiales
INSERT INTO categories (name, name_fr, slug, icon, display_order) VALUES
('Véhicules', 'Véhicules', 'vehicles', '🚗', 1),
('Location Immobilière', 'Location Immobilière', 'real-estate-rent', '🏠', 2),
('Emploi', 'Emploi', 'employment', '💼', 3),
('Services', 'Services', 'services', '🔧', 4),
('Électronique', 'Électronique', 'electronics', '📱', 5),
('Mode & Beauté', 'Mode & Beauté', 'fashion-beauty', '👗', 6),
('Maison', 'Maison', 'home', '🛋️', 7),
('Loisirs', 'Loisirs', 'leisure', '🎾', 8),
('Location Équipements', 'Location Équipements', 'equipment-rental', '🔨', 9),
('Maison & Jardin', 'Maison & Jardin', 'home-garden', '🌱', 10),
('Animaux', 'Animaux', 'animals', '🐾', 11),
('Bébé & Enfants', 'Bébé & Enfants', 'baby-kids', '👶', 12),
('Livres & Multimédia', 'Livres & Multimédia', 'books-media', '📚', 13),
('Immobilier Vente', 'Immobilier Vente', 'real-estate-sale', '🏘️', 14);
```

---

### 2. TABLE : `listings` (PRINCIPALE)
**Rôle :** Table générique pour TOUTES les annonces

**Structure SQL :**
```sql
CREATE TABLE listings (
  -- Identifiants
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Informations générales
  offer_type TEXT NOT NULL CHECK (offer_type IN ('offer', 'demand', 'rent_out', 'rent_in', 'adoption', 'breeding')),
  title TEXT NOT NULL CHECK (length(title) >= 10 AND length(title) <= 100),
  description TEXT NOT NULL CHECK (length(description) >= 50),

  -- Prix et négociation
  price DECIMAL(12,2) CHECK (price >= 0),
  price_negotiable BOOLEAN DEFAULT false,

  -- Localisation
  wilaya TEXT NOT NULL,
  commune TEXT,

  -- Médias
  images TEXT[] DEFAULT '{}',

  -- État et gestion
  condition TEXT CHECK (condition IN ('new', 'like_new', 'very_good', 'good', 'fair', 'for_parts')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'sold', 'archived', 'expired')),

  -- Statistiques
  views_count INTEGER DEFAULT 0,
  favorites_count INTEGER DEFAULT 0,

  -- Options
  featured BOOLEAN DEFAULT false,
  delivery_available BOOLEAN DEFAULT false,

  -- Horodatage
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,

  -- Contact
  contact_name TEXT,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  whatsapp_available BOOLEAN DEFAULT false
);

-- Index pour performance
CREATE INDEX idx_listings_category ON listings(category_id);
CREATE INDEX idx_listings_user ON listings(user_id);
CREATE INDEX idx_listings_wilaya ON listings(wilaya);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_created ON listings(created_at DESC);
CREATE INDEX idx_listings_price ON listings(price);
```

---

### 3. TABLE : `wilayas`
**Rôle :** Stocker les 58 wilayas algériennes

**Structure SQL :**
```sql
CREATE TABLE wilayas (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name_fr TEXT NOT NULL,
  name_ar TEXT
);

-- Données (exemple - liste complète à insérer)
INSERT INTO wilayas (code, name_fr, name_ar) VALUES
('01', 'Adrar', 'أدرار'),
('02', 'Chlef', 'الشلف'),
('03', 'Laghouat', 'الأغواط'),
('04', 'Oum El Bouaghi', 'أم البواقي'),
('05', 'Batna', 'باتنة'),
('06', 'Béjaïa', 'بجاية'),
('07', 'Biskra', 'بسكرة'),
('08', 'Béchar', 'بشار'),
('09', 'Blida', 'البليدة'),
('10', 'Bouira', 'البويرة'),
('11', 'Tamanrasset', 'تمنراست'),
('12', 'Tébessa', 'تبسة'),
('13', 'Tlemcen', 'تلمسان'),
('14', 'Tiaret', 'تيارت'),
('15', 'Tizi Ouzou', 'تيزي وزو'),
('16', 'Alger', 'الجزائر'),
-- ... (continuer jusqu'à 58)
('58', 'El M\'Ghair', 'المغير');
```

---

### 4. TABLE : `communes`
**Rôle :** Stocker toutes les communes par wilaya

**Structure SQL :**
```sql
CREATE TABLE communes (
  id SERIAL PRIMARY KEY,
  wilaya_code TEXT NOT NULL REFERENCES wilayas(code),
  name TEXT NOT NULL,
  name_ar TEXT
);

CREATE INDEX idx_communes_wilaya ON communes(wilaya_code);
```

---

## 🎯 PARTIE 2 : TABLES SPÉCIFIQUES PAR CATÉGORIE

### 1. TABLE : `vehicle_details`
**Lien avec :** `listings` (catégorie Véhicules)

**Structure SQL :**
```sql
CREATE TABLE vehicle_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID UNIQUE NOT NULL REFERENCES listings(id) ON DELETE CASCADE,

  -- Informations principales
  vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('car', 'motorcycle', 'truck', 'van', 'other')),
  brand_id UUID REFERENCES vehicle_brands(id),
  model_id UUID REFERENCES vehicle_models(id),

  -- Caractéristiques techniques
  year INTEGER CHECK (year >= 1950 AND year <= EXTRACT(YEAR FROM NOW()) + 1),
  mileage INTEGER CHECK (mileage >= 0 AND mileage <= 999999),
  fuel_type TEXT CHECK (fuel_type IN ('gasoline', 'diesel', 'hybrid', 'electric', 'gpl')),
  transmission TEXT CHECK (transmission IN ('manual', 'automatic')),

  -- Détails additionnels
  color TEXT,
  doors INTEGER CHECK (doors IN (2, 3, 4, 5)),
  engine_capacity TEXT,
  horsepower INTEGER,
  seats INTEGER,

  -- Équipements (array)
  features TEXT[] DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vehicle_details_listing ON vehicle_details(listing_id);
CREATE INDEX idx_vehicle_details_brand ON vehicle_details(brand_id);
CREATE INDEX idx_vehicle_details_year ON vehicle_details(year);
```

---

### 2. TABLE : `real_estate_rental_details`
**Lien avec :** `listings` (catégorie Location Immobilière)

**Structure SQL :**
```sql
CREATE TABLE real_estate_rental_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID UNIQUE NOT NULL REFERENCES listings(id) ON DELETE CASCADE,

  -- Type de bien
  property_type TEXT NOT NULL CHECK (property_type IN ('apartment', 'house', 'studio', 'villa', 'commercial', 'office', 'land')),

  -- Caractéristiques
  bedrooms INTEGER CHECK (bedrooms >= 0 AND bedrooms <= 20),
  bathrooms INTEGER CHECK (bathrooms >= 1 AND bathrooms <= 10),
  surface DECIMAL(10,2) CHECK (surface >= 10 AND surface <= 10000),
  floor TEXT,
  property_condition TEXT CHECK (property_condition IN ('new', 'good', 'to_renovate')),

  -- Type de location
  rental_type TEXT CHECK (rental_type IN ('long_term', 'short_term', 'seasonal')),
  furnished TEXT CHECK (furnished IN ('furnished', 'semi_furnished', 'unfurnished')),

  -- Équipements
  amenities TEXT[] DEFAULT '{}',

  -- Loyer et charges
  monthly_rent DECIMAL(12,2),
  charges_included BOOLEAN DEFAULT false,
  charges_amount DECIMAL(10,2),
  deposit_required BOOLEAN DEFAULT false,
  deposit_amount DECIMAL(12,2),

  -- Disponibilité
  available_from DATE,
  minimum_duration_months INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_real_estate_rental_listing ON real_estate_rental_details(listing_id);
CREATE INDEX idx_real_estate_rental_bedrooms ON real_estate_rental_details(bedrooms);
CREATE INDEX idx_real_estate_rental_surface ON real_estate_rental_details(surface);
```

---

### 3. TABLE : `employment_details`
**Lien avec :** `listings` (catégorie Emploi)

**Structure SQL :**
```sql
CREATE TABLE employment_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID UNIQUE NOT NULL REFERENCES listings(id) ON DELETE CASCADE,

  -- Type d'annonce
  employment_type TEXT NOT NULL CHECK (employment_type IN ('job_offer', 'job_seeking')),

  -- Détails du poste
  job_title TEXT NOT NULL,
  sector TEXT NOT NULL,
  contract_type TEXT CHECK (contract_type IN ('cdi', 'cdd', 'freelance', 'internship', 'temporary', 'seasonal')),

  -- Expérience et études
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'confirmed', 'expert')),
  education_level TEXT CHECK (education_level IN ('none', 'bac', 'bac_2_3', 'bac_4_5', 'doctorate')),

  -- Conditions de travail
  work_schedule TEXT CHECK (work_schedule IN ('full_time', 'part_time', 'flexible')),
  remote_work TEXT CHECK (remote_work IN ('full_remote', 'hybrid', 'on_site')),

  -- Compétences et langues
  skills TEXT[] DEFAULT '{}',
  languages JSONB,

  -- Rémunération
  salary_type TEXT CHECK (salary_type IN ('fixed', 'range', 'negotiable')),
  salary_min DECIMAL(12,2),
  salary_max DECIMAL(12,2),
  benefits TEXT[] DEFAULT '{}',

  -- Entreprise (pour offres)
  company_name TEXT,
  company_sector TEXT,
  company_size TEXT,

  -- Candidature
  application_deadline DATE,
  application_methods TEXT[] DEFAULT '{}',

  -- CV (pour demandes)
  cv_url TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_employment_listing ON employment_details(listing_id);
CREATE INDEX idx_employment_sector ON employment_details(sector);
CREATE INDEX idx_employment_contract ON employment_details(contract_type);
```

---

### 4. TABLE : `service_details`
**Lien avec :** `listings` (catégorie Services)

**Structure SQL :**
```sql
CREATE TABLE service_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID UNIQUE NOT NULL REFERENCES listings(id) ON DELETE CASCADE,

  -- Type de service
  service_type TEXT NOT NULL,

  -- Disponibilité et conditions
  availability TEXT CHECK (availability IN ('immediate', 'within_24h', 'within_48h', 'to_plan')),
  travel TEXT CHECK (travel IN ('home_service', 'in_shop', 'both')),
  travel_zone TEXT,

  -- Expérience
  years_experience TEXT CHECK (years_experience IN ('beginner', 'intermediate', 'expert')),
  qualifications TEXT,
  professional_insurance BOOLEAN DEFAULT false,

  -- Tarification
  pricing_mode TEXT CHECK (pricing_mode IN ('hourly', 'daily', 'fixed', 'quote')),
  rate DECIMAL(10,2),
  rate_negotiable BOOLEAN DEFAULT false,
  free_quote BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_service_listing ON service_details(listing_id);
CREATE INDEX idx_service_type ON service_details(service_type);
```

---

### 5. TABLE : `electronics_details`
**Lien avec :** `listings` (catégorie Électronique)

**Structure SQL :**
```sql
CREATE TABLE electronics_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID UNIQUE NOT NULL REFERENCES listings(id) ON DELETE CASCADE,

  -- Catégorie principale
  category TEXT NOT NULL CHECK (category IN ('phones_tablets', 'computers', 'tv_screens', 'audio', 'gaming', 'cameras', 'accessories', 'appliances')),

  -- Détails téléphones/tablettes
  device_type TEXT,
  storage TEXT,
  ram TEXT,
  battery_condition TEXT,
  dual_sim BOOLEAN,

  -- Détails ordinateurs
  processor TEXT,
  graphics_card TEXT,
  screen_size TEXT,
  operating_system TEXT,

  -- Détails TV/Écrans
  screen_resolution TEXT,
  smart_tv BOOLEAN,
  tv_system TEXT,

  -- Détails Audio
  connectivity TEXT[] DEFAULT '{}',
  noise_cancelling BOOLEAN,

  -- Détails Gaming
  platform TEXT,
  storage_capacity TEXT,
  included_games TEXT,

  -- Détails Caméras
  megapixels INTEGER,
  lens_included BOOLEAN,
  lens_details TEXT,

  -- Commun à tous
  brand TEXT,
  model TEXT,
  color TEXT,
  warranty_status TEXT CHECK (warranty_status IN ('under_warranty', 'out_of_warranty')),
  warranty_duration TEXT,
  invoice_available BOOLEAN DEFAULT false,
  accessories_included TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_electronics_listing ON electronics_details(listing_id);
CREATE INDEX idx_electronics_category ON electronics_details(category);
```

---

### 6. TABLE : `fashion_details`
**Lien avec :** `listings` (catégorie Mode & Beauté)

**Structure SQL :**
```sql
CREATE TABLE fashion_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID UNIQUE NOT NULL REFERENCES listings(id) ON DELETE CASCADE,

  -- Catégorie
  category TEXT NOT NULL CHECK (category IN ('clothing', 'shoes', 'bags_accessories', 'jewelry_watches', 'cosmetics', 'wellness')),

  -- Vêtements
  clothing_type TEXT,
  gender TEXT CHECK (gender IN ('woman', 'man', 'girl', 'boy', 'unisex', 'baby')),
  size TEXT,
  color TEXT,
  material TEXT,

  -- Chaussures
  shoe_type TEXT,
  shoe_size TEXT,

  -- Sacs & Accessoires
  accessory_type TEXT,
  bag_material TEXT,

  -- Bijoux & Montres
  jewelry_type TEXT,
  jewelry_material TEXT,
  weight TEXT,

  -- Cosmétiques
  cosmetic_type TEXT,
  volume TEXT,

  -- Marque et état
  brand TEXT,
  item_condition TEXT CHECK (item_condition IN ('new_with_tag', 'new_no_tag', 'never_worn', 'worn_once', 'excellent', 'very_good', 'good')),
  defects TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_fashion_listing ON fashion_details(listing_id);
CREATE INDEX idx_fashion_category ON fashion_details(category);
```

---

### 7. TABLE : `home_details`
**Lien avec :** `listings` (catégorie Maison)

**Structure SQL :**
```sql
CREATE TABLE home_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID UNIQUE NOT NULL REFERENCES listings(id) ON DELETE CASCADE,

  -- Catégorie
  category TEXT NOT NULL CHECK (category IN ('furniture', 'decoration', 'appliances', 'garden', 'diy_tools', 'bedding', 'kitchen')),

  -- Meubles
  furniture_type TEXT,
  material TEXT,
  style TEXT,
  dimensions TEXT,
  color TEXT,

  -- Décoration
  decoration_type TEXT,

  -- Jardin
  garden_type TEXT,

  -- Bricolage
  tool_type TEXT,

  -- État
  item_condition TEXT CHECK (item_condition IN ('new_boxed', 'new_unboxed', 'like_new', 'excellent', 'good', 'to_restore')),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_home_listing ON home_details(listing_id);
CREATE INDEX idx_home_category ON home_details(category);
```

---

### 8. TABLE : `leisure_details`
**Lien avec :** `listings` (catégorie Loisirs)

**Structure SQL :**
```sql
CREATE TABLE leisure_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID UNIQUE NOT NULL REFERENCES listings(id) ON DELETE CASCADE,

  -- Catégorie
  category TEXT NOT NULL CHECK (category IN ('sport_fitness', 'bikes', 'camping', 'water_sports', 'music_instruments', 'collectibles', 'toys_games', 'tickets')),

  -- Sport & Fitness
  sport_type TEXT,

  -- Vélos
  bike_type TEXT,
  frame_size TEXT,
  gears INTEGER,

  -- Instruments musique
  instrument_type TEXT,

  -- Jouets
  toy_type TEXT,
  age_recommended TEXT,

  -- Commun
  brand TEXT,
  item_condition TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leisure_listing ON leisure_details(listing_id);
CREATE INDEX idx_leisure_category ON leisure_details(category);
```

---

### 9. TABLE : `equipment_rental_details`
**Lien avec :** `listings` (catégorie Location Équipements)

**Structure SQL :**
```sql
CREATE TABLE equipment_rental_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID UNIQUE NOT NULL REFERENCES listings(id) ON DELETE CASCADE,

  -- Type d'équipement
  equipment_category TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  purchase_year INTEGER,

  -- Tarification location
  hourly_rate DECIMAL(10,2),
  daily_rate DECIMAL(10,2),
  weekly_rate DECIMAL(10,2),
  monthly_rate DECIMAL(10,2),

  -- Conditions
  deposit_required BOOLEAN DEFAULT false,
  deposit_amount DECIMAL(10,2),
  delivery_available BOOLEAN DEFAULT false,
  delivery_fee TEXT,
  training_included BOOLEAN DEFAULT false,

  -- État et maintenance
  equipment_condition TEXT,
  last_maintenance DATE,

  -- Disponibilité
  availability TEXT CHECK (availability IN ('immediate', 'from_date')),
  available_from DATE,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_equipment_rental_listing ON equipment_rental_details(listing_id);
```

---

### 10. TABLE : `animal_details`
**Lien avec :** `listings` (catégorie Animaux)

**Structure SQL :**
```sql
CREATE TABLE animal_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID UNIQUE NOT NULL REFERENCES listings(id) ON DELETE CASCADE,

  -- Type d'animal
  animal_type TEXT NOT NULL CHECK (animal_type IN ('dog', 'cat', 'bird', 'fish', 'rodent', 'horse', 'livestock', 'other')),

  -- Pour chiens et chats
  breed TEXT,
  age_value INTEGER,
  age_unit TEXT CHECK (age_unit IN ('weeks', 'months', 'years')),
  gender TEXT CHECK (gender IN ('male', 'female')),
  color TEXT,

  -- Santé et documents
  pedigree BOOLEAN DEFAULT false,
  pedigree_number TEXT,
  vaccinated BOOLEAN DEFAULT false,
  vaccination_details TEXT,
  sterilized BOOLEAN DEFAULT false,
  chipped_tattooed BOOLEAN DEFAULT false,
  health_book_available BOOLEAN DEFAULT false,

  -- Caractère (pour chiens/chats)
  temperament TEXT[] DEFAULT '{}',

  -- Pour oiseaux
  species TEXT,
  sings BOOLEAN,

  -- Pour bétail
  weight_kg DECIMAL(10,2),
  usage TEXT,

  -- Documents fournis
  documents_provided TEXT[] DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_animal_listing ON animal_details(listing_id);
CREATE INDEX idx_animal_type ON animal_details(animal_type);
```

---

### 11. TABLE : `baby_details`
**Lien avec :** `listings` (catégorie Bébé & Enfants)

**Structure SQL :**
```sql
CREATE TABLE baby_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID UNIQUE NOT NULL REFERENCES listings(id) ON DELETE CASCADE,

  -- Catégorie
  category TEXT NOT NULL CHECK (category IN ('baby_clothing', 'kids_clothing', 'shoes', 'childcare', 'toys', 'feeding', 'books', 'other')),

  -- Vêtements
  clothing_type TEXT,
  gender TEXT CHECK (gender IN ('girl', 'boy', 'unisex')),
  age_size TEXT,
  brand TEXT,
  color TEXT,
  season TEXT,

  -- Puériculture
  childcare_type TEXT,
  ce_compliant BOOLEAN,

  -- Jouets
  toy_type TEXT,
  age_recommended TEXT,
  ce_standard BOOLEAN,

  -- État
  item_condition TEXT,
  washed_cleaned BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_baby_listing ON baby_details(listing_id);
CREATE INDEX idx_baby_category ON baby_details(category);
```

---

### 12. TABLE : `books_media_details`
**Lien avec :** `listings` (catégorie Livres & Multimédia)

**Structure SQL :**
```sql
CREATE TABLE books_media_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID UNIQUE NOT NULL REFERENCES listings(id) ON DELETE CASCADE,

  -- Catégorie
  category TEXT NOT NULL CHECK (category IN ('books', 'magazines', 'comics_manga', 'dvd_bluray', 'cd_vinyl', 'video_games')),

  -- Livres
  book_genre TEXT,
  language TEXT,
  author TEXT,
  publisher TEXT,
  isbn TEXT,
  publication_year INTEGER,
  pages INTEGER,
  format TEXT,

  -- BD & Mangas
  series_title TEXT,
  volume_number INTEGER,

  -- DVD & Blu-ray
  media_type TEXT CHECK (media_type IN ('movie', 'tv_series', 'documentary', 'other')),
  audio_languages TEXT[] DEFAULT '{}',
  subtitles TEXT[] DEFAULT '{}',
  zone TEXT,

  -- CD & Vinyles
  music_format TEXT CHECK (music_format IN ('cd', 'vinyl', 'cassette')),
  music_genre TEXT,
  artist TEXT,
  album TEXT,

  -- État
  item_condition TEXT,
  condition_notes TEXT,

  -- Échange
  exchange_only BOOLEAN DEFAULT false,
  exchange_for TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_books_media_listing ON books_media_details(listing_id);
CREATE INDEX idx_books_media_category ON books_media_details(category);
```

---

### 13. TABLE : `real_estate_sale_details`
**Lien avec :** `listings` (catégorie Immobilier Vente)

**Structure SQL :**
```sql
CREATE TABLE real_estate_sale_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID UNIQUE NOT NULL REFERENCES listings(id) ON DELETE CASCADE,

  -- Type de bien
  property_type TEXT NOT NULL CHECK (property_type IN ('apartment', 'house', 'villa', 'land', 'commercial', 'office', 'building')),

  -- Caractéristiques
  bedrooms INTEGER CHECK (bedrooms >= 0 AND bedrooms <= 20),
  bathrooms INTEGER CHECK (bathrooms >= 0 AND bathrooms <= 10),
  surface DECIMAL(10,2) CHECK (surface >= 10),
  land_surface DECIMAL(10,2),
  floor TEXT,
  total_floors INTEGER,

  -- État et construction
  property_condition TEXT CHECK (property_condition IN ('new', 'excellent', 'good', 'to_renovate')),
  construction_year INTEGER,

  -- Type de propriété
  title_type TEXT CHECK (title_type IN ('land_title', 'notarized_deed', 'private_agreement', 'regularization_pending')),

  -- Équipements
  amenities TEXT[] DEFAULT '{}',

  -- Charges
  condo_fees DECIMAL(10,2),
  property_tax DECIMAL(10,2),

  -- Financement
  bank_loan_possible BOOLEAN DEFAULT false,

  -- Frais d'agence
  agency_fees TEXT CHECK (agency_fees IN ('included', 'buyer_pays', 'no_fees')),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_real_estate_sale_listing ON real_estate_sale_details(listing_id);
CREATE INDEX idx_real_estate_sale_bedrooms ON real_estate_sale_details(bedrooms);
CREATE INDEX idx_real_estate_sale_surface ON real_estate_sale_details(surface);
```

---

## 🎯 PARTIE 3 : TABLES DE RÉFÉRENCE (LOOKUP)

### 1. TABLE : `vehicle_brands`
**Rôle :** Liste des marques de véhicules

**Structure SQL :**
```sql
CREATE TABLE vehicle_brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Données initiales (exemple)
INSERT INTO vehicle_brands (name) VALUES
('Audi'), ('BMW'), ('Chevrolet'), ('Citroën'), ('Dacia'), ('Fiat'), ('Ford'),
('Honda'), ('Hyundai'), ('Kia'), ('Mazda'), ('Mercedes-Benz'), ('Nissan'),
('Peugeot'), ('Renault'), ('Seat'), ('Skoda'), ('Toyota'), ('Volkswagen'),
('Volvo'), ('Autre');
```

---

### 2. TABLE : `vehicle_models`
**Rôle :** Modèles de véhicules par marque

**Structure SQL :**
```sql
CREATE TABLE vehicle_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES vehicle_brands(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(brand_id, name)
);

CREATE INDEX idx_vehicle_models_brand ON vehicle_models(brand_id);

-- Exemple de données
-- Renault
INSERT INTO vehicle_models (brand_id, name)
SELECT id, unnest(ARRAY['Clio', 'Mégane', 'Captur', 'Kadjar', 'Talisman', 'Twingo', 'Scenic', 'Espace', 'Koleos'])
FROM vehicle_brands WHERE name = 'Renault';

-- Volkswagen
INSERT INTO vehicle_models (brand_id, name)
SELECT id, unnest(ARRAY['Golf', 'Polo', 'Passat', 'Tiguan', 'Touareg', 'T-Roc', 'Arteon'])
FROM vehicle_brands WHERE name = 'Volkswagen';

-- Continuer pour toutes les marques...
```

---

### 3. TABLE : `skills`
**Rôle :** Compétences professionnelles (pour Emploi)

**Structure SQL :**
```sql
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exemples
INSERT INTO skills (name, category) VALUES
('JavaScript', 'tech'),
('React', 'tech'),
('Node.js', 'tech'),
('Python', 'tech'),
('Communication', 'soft'),
('Gestion de projet', 'soft'),
('Leadership', 'soft'),
('Comptabilité', 'finance'),
('Excel', 'office');
```

---

## 🎯 PARTIE 4 : TABLES ADDITIONNELLES

### 1. TABLE : `favorites`
**Rôle :** Gestion des annonces favorites par utilisateur

**Structure SQL :**
```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_listing ON favorites(listing_id);
```

---

### 2. TABLE : `messages`
**Rôle :** Messagerie entre utilisateurs

**Structure SQL :**
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_listing ON messages(listing_id);
```

---

### 3. TABLE : `search_history`
**Rôle :** Historique des recherches utilisateur

**Structure SQL :**
```sql
CREATE TABLE search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  filters JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_search_history_user ON search_history(user_id);
```

---

## 📋 RÉCAPITULATIF

### ✅ Tables Centrales (4)
1. ✅ `categories` - 14 catégories
2. ✅ `listings` - Annonces principales
3. ✅ `wilayas` - 58 wilayas
4. ✅ `communes` - Communes par wilaya

### ✅ Tables Spécifiques (13)
1. ✅ `vehicle_details`
2. ✅ `real_estate_rental_details`
3. ✅ `employment_details`
4. ✅ `service_details`
5. ✅ `electronics_details`
6. ✅ `fashion_details`
7. ✅ `home_details`
8. ✅ `leisure_details`
9. ✅ `equipment_rental_details`
10. ✅ `animal_details`
11. ✅ `baby_details`
12. ✅ `books_media_details`
13. ✅ `real_estate_sale_details`

### ✅ Tables de Référence (3)
1. ✅ `vehicle_brands`
2. ✅ `vehicle_models`
3. ✅ `skills`

### ✅ Tables Additionnelles (3)
1. ✅ `favorites`
2. ✅ `messages`
3. ✅ `search_history`

---

## 🚀 INSTRUCTIONS D'UTILISATION

### 1. Vérification de votre BDD actuelle
```sql
-- Vérifier les tables existantes
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

### 2. Ajout des tables manquantes
- Exécutez les scripts SQL des tables qui n'existent pas encore
- Respectez l'ordre : Tables centrales → Tables spécifiques → Tables de référence

### 3. Mise à jour des tables existantes
- Si une table existe déjà, utilisez `ALTER TABLE` pour ajouter les colonnes manquantes
- Ne supprimez JAMAIS de données existantes

### 4. Population des données de référence
- Insérez les 14 catégories
- Insérez les 58 wilayas
- Insérez les marques et modèles de véhicules
- Insérez les compétences professionnelles

---

## ⚠️ NOTES IMPORTANTES

1. **Relations CASCADE** : Les tables de détails sont supprimées automatiquement si l'annonce principale est supprimée
2. **Index** : Tous les index sont créés pour optimiser les performances des recherches
3. **Contraintes CHECK** : Assurent la validité des données à l'insertion
4. **Types JSONB** : Utilisés pour les données complexes (langues, filtres de recherche)
5. **Arrays** : Utilisés pour les listes (équipements, compétences, images)

---

## 🎯 PROCHAINE ÉTAPE

Une fois votre BDD mise à jour avec cette structure, vous pouvez passer au **SPRINT F1 : Formulaire Véhicules** !

Le prompt Bolt.new sera préparé dans le prochain document.
