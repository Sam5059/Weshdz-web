/*
  # Add Employment and Services Fields to Listings Table

  1. Employment Fields
    **Job Posting Fields:**
    - `job_title` (text) - Titre du poste
    - `job_sector` (text) - Secteur d'activité (Informatique/Tech, Commerce, etc.)
    - `job_description` (text) - Description détaillée du poste
    - `contract_type` (text) - Type de contrat (CDI, CDD, Freelance, Stage, Intérim, Saisonnier)
    - `experience_level` (text) - Niveau d'expérience (Débutant, Intermédiaire, Confirmé, Expert)
    - `education_level` (text) - Niveau d'études (Sans diplôme, Bac, Bac+2/3, Bac+4/5, Doctorat)
    - `work_schedule` (text) - Temps de travail (Temps plein, Temps partiel, Flexible)
    - `remote_work` (text) - Télétravail (100% télétravail, Hybride, Sur site uniquement)
    - `skills` (text[]) - Compétences clés
    - `languages` (jsonb) - Langues requises [{lang: 'Français', level: 'Avancé'}]
    - `salary_type` (text) - Type de salaire (Montant fixe, Fourchette, À négocier)
    - `salary_amount` (numeric) - Montant fixe ou minimum
    - `salary_max` (numeric) - Maximum pour fourchette
    - `benefits` (text[]) - Avantages
    - `application_deadline` (date) - Date limite de candidature
    - `application_methods` (jsonb) - Mode de candidature [{type: 'email', value: '...'}]
    - `company_name` (text) - Nom de l'entreprise
    - `company_sector` (text) - Secteur d'activité entreprise
    - `company_size` (text) - Taille de l'entreprise (1-10, 11-50, 51-200, 200+)
    
    **Job Seeker Fields:**
    - `professional_title` (text) - Titre professionnel
    - `years_experience` (integer) - Années d'expérience
    - `availability` (text) - Disponibilité (Immédiate, Préavis 1 mois, etc.)
    - `current_wilaya` (text) - Wilaya actuelle
    - `willing_to_relocate` (boolean) - Prêt à déménager
    - `mobility_wilayas` (text[]) - Wilayas acceptées
    - `cv_url` (text) - URL du CV uploadé

  2. Services Fields
    - `service_type` (text) - Type de service (Plomberie, Électricité, etc.)
    - `service_availability` (text) - Disponibilité (Immédiate, Sous 24h, etc.)
    - `service_location` (text) - Lieu du service (À domicile, Dans mon local, Les deux)
    - `service_zone` (text) - Zone de déplacement
    - `service_radius_km` (integer) - Rayon personnalisé en km
    - `service_experience_years` (text) - Années d'expérience
    - `service_qualifications` (text) - Qualifications/Certifications
    - `service_insurance` (boolean) - Assurance professionnelle
    - `pricing_mode` (text) - Mode de tarification (À l'heure, À la journée, Au forfait, Sur devis)
    - `pricing_amount` (numeric) - Tarif indicatif
    - `pricing_negotiable` (boolean) - Tarif négociable
    - `free_quote` (boolean) - Devis gratuit
    - `service_areas` (text) - Zones couvertes
    - `portfolio_urls` (text[]) - URLs des photos de réalisations
    - `website_url` (text) - Site web/Portfolio

  3. Security
    - All fields nullable for compatibility with other categories
    - RLS policies inherited from listings table
*/

-- Employment Fields
ALTER TABLE listings ADD COLUMN IF NOT EXISTS job_title text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS job_sector text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS job_description text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS work_schedule text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS remote_work text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS skills text[];
ALTER TABLE listings ADD COLUMN IF NOT EXISTS languages jsonb;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS salary_type text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS salary_amount numeric;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS salary_max numeric;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS benefits text[];
ALTER TABLE listings ADD COLUMN IF NOT EXISTS application_deadline date;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS application_methods jsonb;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS company_name text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS company_sector text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS company_size text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS professional_title text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS years_experience integer;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS availability text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS current_wilaya text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS willing_to_relocate boolean DEFAULT false;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mobility_wilayas text[];
ALTER TABLE listings ADD COLUMN IF NOT EXISTS cv_url text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS education_level text;

-- Services Fields
ALTER TABLE listings ADD COLUMN IF NOT EXISTS service_type text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS service_availability text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS service_location text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS service_zone text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS service_radius_km integer;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS service_experience_years text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS service_qualifications text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS service_insurance boolean DEFAULT false;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS pricing_mode text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS pricing_amount numeric;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS pricing_negotiable boolean DEFAULT false;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS free_quote boolean DEFAULT false;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS service_areas text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS portfolio_urls text[];
ALTER TABLE listings ADD COLUMN IF NOT EXISTS website_url text;