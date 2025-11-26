/*
  # Add Translation Tables and Update Categories
  
  1. New Tables
    - ui_translations: Interface text translations (FR/EN/AR)
    - form_fields_translations: Form field labels (FR/EN/AR)
  
  2. Updates
    - Add EN/AR translations to existing categories
    - Populate UI translations with essential keys (~80 keys)
    - Populate form field translations
  
  3. Security
    - Enable RLS on all tables
    - Public read access for translations
*/

-- =====================================================
-- PART 1: UPDATE CATEGORIES WITH EN/AR TRANSLATIONS
-- =====================================================

-- Categories table already has name_fr, name_en, name_ar from previous migration
-- Just need to populate the English and Arabic translations

UPDATE categories SET name_en = 'Vehicles', name_ar = 'مركبات' WHERE name_fr = 'Véhicules';
UPDATE categories SET name_en = 'Real Estate Rental', name_ar = 'عقارات للإيجار' WHERE name_fr = 'Location Immobilière';
UPDATE categories SET name_en = 'Jobs', name_ar = 'وظائف' WHERE name_fr = 'Emploi';
UPDATE categories SET name_en = 'Services', name_ar = 'خدمات' WHERE name_fr = 'Services';
UPDATE categories SET name_en = 'Electronics', name_ar = 'إلكترونيات' WHERE name_fr = 'Électronique';
UPDATE categories SET name_en = 'Fashion & Beauty', name_ar = 'أزياء وجمال' WHERE name_fr = 'Mode & Beauté';
UPDATE categories SET name_en = 'Home', name_ar = 'منزل' WHERE name_fr = 'Maison';
UPDATE categories SET name_en = 'Leisure', name_ar = 'ترفيه' WHERE name_fr = 'Loisirs';
UPDATE categories SET name_en = 'Equipment Rental', name_ar = 'تأجير معدات' WHERE name_fr = 'Location Équipements';
UPDATE categories SET name_en = 'Home & Garden', name_ar = 'منزل وحديقة' WHERE name_fr = 'Maison & Jardin';
UPDATE categories SET name_en = 'Animals', name_ar = 'حيوانات' WHERE name_fr = 'Animaux';
UPDATE categories SET name_en = 'Baby & Kids', name_ar = 'أطفال ورضع' WHERE name_fr = 'Bébé & Enfants';
UPDATE categories SET name_en = 'Books & Media', name_ar = 'كتب ووسائط' WHERE name_fr = 'Livres & Multimédia';
UPDATE categories SET name_en = 'Real Estate (Sale)', name_ar = 'عقارات للبيع' WHERE name_fr = 'Immobilier';

-- =====================================================
-- PART 2: CREATE UI TRANSLATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS ui_translations (
  key TEXT PRIMARY KEY,
  text_fr TEXT NOT NULL,
  text_en TEXT NOT NULL,
  text_ar TEXT NOT NULL,
  category TEXT, -- navigation, search, filters, actions, messages, etc.
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE ui_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ui translations"
  ON ui_translations FOR SELECT
  TO public
  USING (true);

-- =====================================================
-- PART 3: CREATE FORM FIELDS TRANSLATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS form_fields_translations (
  field_key TEXT PRIMARY KEY,
  label_fr TEXT NOT NULL,
  label_en TEXT NOT NULL,
  label_ar TEXT NOT NULL,
  placeholder_fr TEXT,
  placeholder_en TEXT,
  placeholder_ar TEXT,
  category_slug TEXT, -- vehicle, real-estate, employment, etc.
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE form_fields_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view form fields translations"
  ON form_fields_translations FOR SELECT
  TO public
  USING (true);

-- =====================================================
-- PART 4: POPULATE UI TRANSLATIONS (Essential ~80 keys)
-- =====================================================

INSERT INTO ui_translations (key, text_fr, text_en, text_ar, category) VALUES
-- Navigation (10 keys)
('home', 'Accueil', 'Home', 'الرئيسية', 'navigation'),
('categories', 'Catégories', 'Categories', 'الفئات', 'navigation'),
('all_categories', 'Toutes les catégories', 'All Categories', 'كل الفئات', 'navigation'),
('my_ads', 'Mes annonces', 'My Ads', 'إعلاناتي', 'navigation'),
('favorites', 'Favoris', 'Favorites', 'المفضلة', 'navigation'),
('messages', 'Messages', 'Messages', 'الرسائل', 'navigation'),
('account', 'Mon compte', 'My Account', 'حسابي', 'navigation'),
('logout', 'Déconnexion', 'Logout', 'تسجيل الخروج', 'navigation'),
('login', 'Connexion', 'Login', 'تسجيل الدخول', 'navigation'),
('register', 'Inscription', 'Register', 'التسجيل', 'navigation'),

-- Search & Filters (15 keys)
('search', 'Rechercher', 'Search', 'بحث', 'search'),
('search_placeholder', 'Que recherchez-vous ?', 'What are you looking for?', 'ماذا تبحث؟', 'search'),
('refine_search', 'Affiner ma recherche', 'Refine Search', 'تحسين البحث', 'search'),
('filters', 'Filtres', 'Filters', 'فلاتر', 'filters'),
('filter', 'Filtrer', 'Filter', 'تصفية', 'filters'),
('reset_filters', 'Réinitialiser les filtres', 'Reset Filters', 'إعادة تعيين الفلاتر', 'filters'),
('apply_filters', 'Appliquer les filtres', 'Apply Filters', 'تطبيق الفلاتر', 'filters'),
('active_filters', 'filtres actifs', 'active filters', 'فلاتر نشطة', 'filters'),
('price_range', 'Fourchette de prix', 'Price Range', 'نطاق السعر', 'filters'),
('price_min', 'Prix min', 'Min Price', 'السعر الأدنى', 'filters'),
('price_max', 'Prix max', 'Max Price', 'السعر الأقصى', 'filters'),
('location', 'Localisation', 'Location', 'الموقع', 'filters'),
('all_wilayas', 'Toutes les wilayas', 'All Wilayas', 'جميع الولايات', 'filters'),
('select_wilaya', 'Sélectionner une wilaya', 'Select Wilaya', 'اختر الولاية', 'filters'),
('commune', 'Commune', 'Commune', 'البلدية', 'filters'),

-- Listings (10 keys)
('new_trends', 'Nouvelles Tendances', 'New Trends', 'الاتجاهات الجديدة', 'listings'),
('all_listings', 'Toutes les annonces', 'All Listings', 'جميع الإعلانات', 'listings'),
('recent_ads', 'Annonces récentes', 'Recent Ads', 'إعلانات حديثة', 'listings'),
('results', 'résultats', 'results', 'نتائج', 'listings'),
('no_results', 'Aucune annonce trouvée', 'No listings found', 'لا توجد إعلانات', 'listings'),
('no_results_try', 'Essayez de modifier vos critères', 'Try modifying your filters', 'حاول تعديل المعايير', 'listings'),
('loading', 'Chargement...', 'Loading...', 'جار التحميل...', 'listings'),
('new_badge', 'NOUVEAU', 'NEW', 'جديد', 'listings'),
('featured', 'À la une', 'Featured', 'مميز', 'listings'),
('urgent', 'URGENT', 'URGENT', 'عاجل', 'listings'),

-- Publishing (10 keys)
('publish_ad', 'Publier une annonce', 'Post an Ad', 'نشر إعلان', 'publish'),
('select_category', 'Sélectionner une catégorie', 'Select Category', 'اختر الفئة', 'publish'),
('ad_title', 'Titre de l''annonce', 'Ad Title', 'عنوان الإعلان', 'publish'),
('description', 'Description', 'Description', 'الوصف', 'publish'),
('photos', 'Photos', 'Photos', 'الصور', 'publish'),
('add_photos', 'Ajouter des photos', 'Add Photos', 'إضافة صور', 'publish'),
('contact_info', 'Informations de contact', 'Contact Info', 'معلومات الاتصال', 'publish'),
('preview', 'Prévisualiser', 'Preview', 'معاينة', 'publish'),
('publish', 'Publier', 'Publish', 'نشر', 'publish'),
('required_field', 'Champ obligatoire', 'Required Field', 'حقل مطلوب', 'publish'),

-- Price (9 keys)
('price', 'Prix', 'Price', 'السعر', 'price'),
('price_negotiable', 'Prix négociable', 'Price Negotiable', 'السعر قابل للتفاوض', 'price'),
('free', 'Gratuit', 'Free', 'مجاني', 'price'),
('exchange', 'Échange', 'Exchange', 'تبادل', 'price'),
('to_negotiate', 'À négocier', 'Negotiable', 'للتفاوض', 'price'),
('da', 'DA', 'DA', 'دج', 'price'),
('per_month', '/mois', '/month', '/شهر', 'price'),
('per_day', '/jour', '/day', '/يوم', 'price'),
('per_hour', '/heure', '/hour', '/ساعة', 'price'),

-- Actions (15 keys)
('view_details', 'Voir les détails', 'View Details', 'عرض التفاصيل', 'actions'),
('contact_seller', 'Contacter le vendeur', 'Contact Seller', 'اتصل بالبائع', 'actions'),
('call', 'Appeler', 'Call', 'اتصل', 'actions'),
('send_message', 'Envoyer un message', 'Send Message', 'إرسال رسالة', 'actions'),
('whatsapp', 'WhatsApp', 'WhatsApp', 'واتساب', 'actions'),
('share', 'Partager', 'Share', 'مشاركة', 'actions'),
('save', 'Enregistrer', 'Save', 'حفظ', 'actions'),
('report', 'Signaler', 'Report', 'إبلاغ', 'actions'),
('edit', 'Modifier', 'Edit', 'تعديل', 'actions'),
('delete', 'Supprimer', 'Delete', 'حذف', 'actions'),
('confirm', 'Confirmer', 'Confirm', 'تأكيد', 'actions'),
('cancel', 'Annuler', 'Cancel', 'إلغاء', 'actions'),
('close', 'Fermer', 'Close', 'إغلاق', 'actions'),
('back', 'Retour', 'Back', 'رجوع', 'actions'),
('next', 'Suivant', 'Next', 'التالي', 'actions'),

-- Messages (8 keys)
('success', 'Succès', 'Success', 'نجح', 'messages'),
('error', 'Erreur', 'Error', 'خطأ', 'messages'),
('warning', 'Attention', 'Warning', 'تحذير', 'messages'),
('info', 'Information', 'Info', 'معلومة', 'messages'),
('published_success', 'Annonce publiée avec succès', 'Ad published successfully', 'تم نشر الإعلان بنجاح', 'messages'),
('saved_success', 'Enregistré avec succès', 'Saved successfully', 'تم الحفظ بنجاح', 'messages'),
('error_occurred', 'Une erreur s''est produite', 'An error occurred', 'حدث خطأ', 'messages'),
('please_try_again', 'Veuillez réessayer', 'Please try again', 'يرجى المحاولة مرة أخرى', 'messages')
ON CONFLICT (key) DO UPDATE SET
  text_fr = EXCLUDED.text_fr,
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category;

-- =====================================================
-- PART 5: POPULATE FORM FIELDS TRANSLATIONS (~30 keys)
-- =====================================================

INSERT INTO form_fields_translations (field_key, label_fr, label_en, label_ar, category_slug) VALUES
-- Vehicle fields
('vehicle_type', 'Type de véhicule', 'Vehicle Type', 'نوع المركبة', 'vehicules'),
('brand', 'Marque', 'Brand', 'العلامة التجارية', 'vehicules'),
('model', 'Modèle', 'Model', 'الطراز', 'vehicules'),
('year', 'Année', 'Year', 'السنة', 'vehicules'),
('mileage', 'Kilométrage', 'Mileage', 'الكيلومتر', 'vehicules'),
('fuel_type', 'Carburant', 'Fuel Type', 'نوع الوقود', 'vehicules'),
('transmission', 'Boîte de vitesse', 'Transmission', 'ناقل الحركة', 'vehicules'),
('color', 'Couleur', 'Color', 'اللون', 'vehicules'),
('doors', 'Nombre de portes', 'Number of Doors', 'عدد الأبواب', 'vehicules'),

-- Real Estate fields
('property_type', 'Type de bien', 'Property Type', 'نوع العقار', 'immobilier'),
('bedrooms', 'Chambres', 'Bedrooms', 'غرف النوم', 'immobilier'),
('bathrooms', 'Salles de bain', 'Bathrooms', 'حمامات', 'immobilier'),
('surface_area', 'Surface', 'Surface Area', 'المساحة', 'immobilier'),
('floor', 'Étage', 'Floor', 'الطابق', 'immobilier'),
('furnished', 'Meublé', 'Furnished', 'مفروش', 'immobilier'),
('amenities', 'Équipements', 'Amenities', 'المرافق', 'immobilier'),
('monthly_rent', 'Loyer mensuel', 'Monthly Rent', 'الإيجار الشهري', 'immobilier'),
('deposit', 'Caution', 'Deposit', 'التأمين', 'immobilier'),

-- Employment fields
('job_title', 'Titre du poste', 'Job Title', 'عنوان الوظيفة', 'emploi'),
('contract_type', 'Type de contrat', 'Contract Type', 'نوع العقد', 'emploi'),
('experience_required', 'Expérience requise', 'Experience Required', 'الخبرة المطلوبة', 'emploi'),
('salary', 'Salaire', 'Salary', 'الراتب', 'emploi'),

-- Common fields
('title', 'Titre', 'Title', 'العنوان', 'general'),
('condition', 'État', 'Condition', 'الحالة', 'general'),
('category', 'Catégorie', 'Category', 'الفئة', 'general'),
('subcategory', 'Sous-catégorie', 'Subcategory', 'الفئة الفرعية', 'general'),
('offer_type', 'Type d''offre', 'Offer Type', 'نوع العرض', 'general'),
('wilaya', 'Wilaya', 'Wilaya', 'الولاية', 'general'),
('phone', 'Téléphone', 'Phone', 'الهاتف', 'general'),
('email', 'E-mail', 'Email', 'البريد الإلكتروني', 'general')
ON CONFLICT (field_key) DO UPDATE SET
  label_fr = EXCLUDED.label_fr,
  label_en = EXCLUDED.label_en,
  label_ar = EXCLUDED.label_ar,
  category_slug = EXCLUDED.category_slug;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ui_translations_category ON ui_translations(category);
CREATE INDEX IF NOT EXISTS idx_form_fields_category ON form_fields_translations(category_slug);
