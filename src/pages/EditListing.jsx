/* ═══════════════════════════════════════════════════════════════════════════════
   EDIT LISTING - PAGE D'ÉDITION D'ANNONCE
   ─────────────────────────────────────────────────────────────────────────────

   🎯 OBJECTIF: Permettre la modification d'une annonce existante

   🔗 RELATIONS:
   - MyListings.jsx → Bouton "Modifier" redirige ici avec ID
   - supabase.listings → Lecture/Écriture des données
   - CreateListing.jsx → Même formulaire, en mode édition

   📊 FLUX:
   1. Récupération ID depuis URL params (/edit-listing/123)
   2. Chargement données annonce depuis supabase.from('listings').select()
   3. Pré-remplissage formulaire avec données existantes
   4. Modification par l'utilisateur
   5. Sauvegarde via supabase.update()

   🆕 NOUVEAUTÉS (vs CreateListing):
   - Ajout champs PROMOTIONS (promotion_active, promotion_discount, promotion_end_date)
   - Gestion upload nouvelles images VS images existantes
   - Suppression sélective des images

   ═══════════════════════════════════════════════════════════════════════════ */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { enrichSingleListingWithVehicleData } from '../utils/listingHelpers';
import { wilayas } from '../data/wilayas';
import { uploadImages, compressImage } from '../utils/imageUpload';
import { getCategoryName } from '../utils/categoryHelpers';
import { getCommuneName, fetchCommunesByWilaya, getWilayaCodeFromName } from '../utils/communeHelpers';
import FormSteps from '../components/FormSteps';
import VehicleSelector from '../components/VehicleSelector';
import BackButton from '../components/BackButton';
import styles from './CreateListing.module.css';

export default function EditListing() {
  /* ═══════════════════════════════════════════════════════════════
     HOOKS & CONTEXTS
     ─────────────────────────────────────────────────────────────
     - useParams() → Récupère l'ID de l'annonce depuis l'URL
     - useAuth() → Vérifie que l'utilisateur est propriétaire
     - useLanguage() → Traductions multilingues
     ═══════════════════════════════════════════════════════════════ */
  const { id } = useParams();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  /* ═══════════════════════════════════════════════════════════════
     ÉTATS DU FORMULAIRE
     ─────────────────────────────────────────────────────────────
     Relations:
     - formData → Synchronisé avec table 'listings'
     - existingImages → Images déjà uploadées (URLs Supabase Storage)
     - imageFiles → Nouvelles images à uploader
     ═══════════════════════════════════════════════════════════════ */
  const [currentStep, setCurrentStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRentalCategory, setIsRentalCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const steps = ['Type & Catégorie', 'Informations', 'Détails', 'Photos & Publication'];

  const [formData, setFormData] = useState({
    account_type: 'particulier',
    offer_type: 'offre',
    listing_type: 'vendre',
    category_id: '',
    title: '',
    description: '',
    price: '',
    negotiable: false,
    wilaya: '',
    commune: '',
    condition: 'good',
    delivery_available: false,
    images: [],
    bedrooms: '',
    bathrooms: '',
    surface: '',
    brand: '',
    model: '',
    year: '',
    mileage: '',
    contract_type: '',
    experience_level: '',
    pricing_type: '',
    availability: '',
    promotion_active: false,
    promotion_discount: '',
    promotion_end_date: '',
    vehicle_type: '',
    fuel_type: '',
    transmission: '',
    property_type: '',
    accommodation_type: '',
    vacation_destination: '',
    capacity: '',
    beds: '',
    vacation_amenities: [],
    distance_to_beach: '',
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  /* ═══════════════════════════════════════════════════════════════
     CHARGEMENT INITIAL DE L'ANNONCE
     ─────────────────────────────────────────────────────────────
     Relations BDD:
     1. supabase.from('listings').select('*').eq('id', id)
     2. Vérification user_id === user.id (sécurité)
     3. Pré-remplissage de tous les champs du formulaire
     ═══════════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Charger d'abord les catégories, puis l'annonce
    const loadData = async () => {
      const cats = await fetchCategories();
      await fetchListing(cats);
    };
    loadData();
  }, [user, navigate, id]);

  const fetchListing = async (cats = []) => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Enrichir avec les données de véhicule
      const enrichedData = await enrichSingleListingWithVehicleData(data);

      // Vérification: Seul le propriétaire peut modifier
      if (enrichedData.user_id !== user.id) {
        alert('Vous n\'êtes pas autorisé à modifier cette annonce');
        navigate('/my-listings');
        return;
      }

      // Utiliser les catégories passées en paramètre ou celles du state
      const categoriesToUse = cats.length > 0 ? cats : categories;

      // Pré-remplissage du formulaire
      setFormData({
        account_type: enrichedData.account_type || 'particulier',
        offer_type: enrichedData.offer_type || 'offre',
        listing_type: enrichedData.listing_type || 'vendre',
        category_id: enrichedData.category_id || '',
        title: enrichedData.title || '',
        description: enrichedData.description || '',
        price: enrichedData.price || '',
        negotiable: enrichedData.negotiable || false,
        wilaya: enrichedData.wilaya || '',
        commune: enrichedData.commune || '',
        condition: enrichedData.condition || 'good',
        delivery_available: enrichedData.delivery_available || false,
        images: enrichedData.images || [],
        bedrooms: enrichedData.bedrooms || '',
        bathrooms: enrichedData.bathrooms || '',
        surface: enrichedData.surface || '',
        brand: enrichedData.brand_id || '',
        model: enrichedData.model_id || '',
        year: enrichedData.year || '',
        mileage: enrichedData.mileage || '',
        contract_type: enrichedData.contract_type || '',
        experience_level: enrichedData.experience_level || '',
        pricing_type: enrichedData.pricing_type || '',
        availability: enrichedData.availability || '',
        promotion_active: enrichedData.promotion_active || false,
        promotion_discount: enrichedData.promotion_discount || '',
        promotion_end_date: enrichedData.promotion_end_date ? enrichedData.promotion_end_date.split('T')[0] : '',
        accommodation_type: enrichedData.accommodation_type || '',
        vacation_destination: enrichedData.vacation_destination || '',
        capacity: enrichedData.capacity || '',
        beds: enrichedData.beds || '',
        vacation_amenities: enrichedData.vacation_amenities || [],
        distance_to_beach: enrichedData.distance_to_beach || '',
        vehicle_type: enrichedData.vehicle_type || '',
        fuel_type: enrichedData.fuel_type || '',
        transmission: enrichedData.transmission || '',
        property_type: enrichedData.property_type || '',
      });

      setExistingImages(enrichedData.images || []);

      // Charger sous-catégories et définir selectedCategory
      if (enrichedData.category_id) {
        await fetchSubcategories(enrichedData.category_id);

        // Définir selectedCategory (utiliser categoriesToUse)
        const cat = categoriesToUse.find(c => c.id === enrichedData.category_id);
        console.log('🔍 EditListing - Category found:', cat ? cat.name_fr : 'NOT FOUND', 'from', categoriesToUse.length, 'categories');
        if (cat) {
          setSelectedCategory(cat);

          // Déterminer si c'est une catégorie de location
          const catName = getCategoryName(cat, language).toLowerCase();
          const isRental = catName.includes('location') || catName.includes('rent') || catName.includes('تأجير');
          setIsRentalCategory(isRental);
          console.log('✅ EditListing - selectedCategory set:', cat.name_fr, 'isRental:', isRental);
        }
      }

      // Charger les communes si wilaya est définie
      if (enrichedData.wilaya) {
        const wilayaCode = getWilayaCodeFromName(enrichedData.wilaya, wilayas);
        if (wilayaCode) {
          await loadCommunes(wilayaCode);
        }
      }
    } catch (error) {
      console.error('Error fetching listing:', error);
      setError('Erreur lors du chargement de l\'annonce');
    } finally {
      setLoading(false);
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     GESTION DES COMMUNES (Basé sur Wilaya)
     ─────────────────────────────────────────────────────────────
     Relations:
     - wilayas.js → Liste des wilayas algériennes
     - communes table → Table Supabase avec toutes les communes
     - fetchCommunesByWilaya() → Utilitaire communeHelpers.js
     ═══════════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (formData.wilaya) {
      const wilayaCode = getWilayaCodeFromName(formData.wilaya, wilayas);
      if (wilayaCode) {
        loadCommunes(wilayaCode);
      }
    } else {
      setCommunes([]);
      setFormData(prev => ({ ...prev, commune: '' }));
    }
  }, [formData.wilaya]);

  /* ═══════════════════════════════════════════════════════════════
     HELPER FUNCTIONS POUR DÉTECTION TYPE
     ═══════════════════════════════════════════════════════════════ */
  const isVehicleRental = () => {
    if (!selectedCategory) return false;
    const catName = getCategoryName(selectedCategory, language).toLowerCase();
    return catName.includes('location') && catName.includes('véhicule');
  };

  const isVacationRental = () => {
    if (!selectedCategory) return false;
    const catName = (getCategoryName(selectedCategory, language) || selectedCategory.slug || '').toLowerCase();
    return catName.includes('vacation') || catName.includes('vacances') || selectedCategory.slug === 'location-vacances';
  };

  const getCategoryType = () => {
    if (!selectedCategory) {
      console.log('⚠️ getCategoryType - selectedCategory is NULL');
      return null;
    }
    const catName = (getCategoryName(selectedCategory, language) || selectedCategory.slug || '').toLowerCase();
    console.log('🔍 getCategoryType - catName:', catName);

    if (catName.includes('véhicule') || catName.includes('vehicle') || catName.includes('voiture') || catName.includes('car') || catName.includes('مركب') || catName.includes('auto') || catName.includes('moto') || catName.includes('camion') || catName.includes('truck')) {
      console.log('✅ getCategoryType - returning: vehicle');
      return 'vehicle';
    }
    if (catName.includes('location') && (catName.includes('véhicule') || catName.includes('vacances') || catName.includes('équipement') || catName.includes('equipment') || catName.includes('materiel'))) {
      return 'equipment_rental';
    }
    if (catName.includes('immobilier') || (catName.includes('location') && !catName.includes('véhicule') && !catName.includes('équipement')) || catName.includes('real estate') || catName.includes('rent') || catName.includes('عقار') || catName.includes('appartement')) {
      return 'real_estate';
    }
    if (catName.includes('emploi') || catName.includes('job') || catName.includes('وظيف') || catName.includes('travail') || catName.includes('career')) {
      return 'employment';
    }
    if (catName.includes('service') || catName.includes('خدم') || catName.includes('prestation')) {
      return 'service';
    }
    if (catName.includes('livre') || catName.includes('book') || catName.includes('multimédia') || catName.includes('multimedia') || catName.includes('media') || catName.includes('dvd') || catName.includes('cd') || catName.includes('vinyle') || catName.includes('manga') || catName.includes('كتاب')) {
      return 'books_media';
    }
    if (catName.includes('électronique') || catName.includes('electronique') || catName.includes('electronic') || catName.includes('téléphone') || catName.includes('telephone') || catName.includes('ordinateur') || catName.includes('computer') || catName.includes('إلكترونيات')) {
      return 'electronics';
    }
    if (catName.includes('mode') || catName.includes('fashion') || catName.includes('vêtement') || catName.includes('vetement') || catName.includes('clothing') || catName.includes('chaussure') || catName.includes('shoe') || catName.includes('موضة')) {
      return 'fashion';
    }
    if (catName.includes('maison') && !catName.includes('jardin') || catName.includes('meuble') || catName.includes('furniture') || catName.includes('décoration') || catName.includes('decoration') || catName.includes('أثاث')) {
      return 'home';
    }
    if (catName.includes('jardin') || catName.includes('garden') || catName.includes('plante') || catName.includes('plant')) {
      return 'home';
    }
    if (catName.includes('loisir') || catName.includes('leisure') || catName.includes('sport') || catName.includes('jeu') || catName.includes('game') || catName.includes('instrument') || catName.includes('ترفيه')) {
      return 'leisure';
    }
    if (catName.includes('animaux') || catName.includes('animal') || catName.includes('pet') || catName.includes('chien') || catName.includes('dog') || catName.includes('chat') || catName.includes('cat') || catName.includes('حيوان')) {
      return 'animals';
    }
    if (catName.includes('bébé') || catName.includes('bebe') || catName.includes('baby') || catName.includes('enfant') || catName.includes('child') || catName.includes('kid') || catName.includes('طفل')) {
      return 'baby_kids';
    }
    if (catName.includes('professionnel') || catName.includes('professional') || catName.includes('materiel')) {
      return 'professional';
    }
    return 'general';
  };

  /* ═══════════════════════════════════════════════════════════════
     AUTO-DÉTECTION TYPE ANNONCE (Location/Emploi/Service)
     ─────────────────────────────────────────────────────────────
     Relations:
     - categories table → Détecte si catégorie = location/emploi
     - Ajuste automatiquement listing_type
     ═══════════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (formData.category_id) {
      const selectedCat = categories.find(c => c.id === formData.category_id);
      setSelectedCategory(selectedCat);
      const catName = getCategoryName(selectedCat, language).toLowerCase();
      const isRental = catName.includes('location') || catName.includes('rent') || catName.includes('تأجير');
      setIsRentalCategory(isRental);

      fetchSubcategories(formData.category_id);
    } else {
      setSubcategories([]);
      setSelectedCategory(null);
      setIsRentalCategory(false);
    }
  }, [formData.category_id, categories, language]);

  const loadCommunes = async (wilayaCode) => {
    const communesData = await fetchCommunesByWilaya(wilayaCode);
    setCommunes(communesData);
  };

  /* ═══════════════════════════════════════════════════════════════
     RÉCUPÉRATION CATÉGORIES & SOUS-CATÉGORIES
     ─────────────────────────────────────────────────────────────
     Relations BDD:
     - categories table → parent_id IS NULL = catégories principales
     - categories table → parent_id = X = sous-catégories de X
     ═══════════════════════════════════════════════════════════════ */
  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('id, name, name_fr, name_ar, name_en, icon, parent_id, display_order')
      .is('parent_id', null)
      .order('display_order', { ascending: true });
    if (data) {
      setCategories(data);
      return data;
    }
    return [];
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, name_fr, name_ar, name_en, icon, parent_id')
        .eq('parent_id', categoryId)
        .order('name');

      if (error) throw error;
      setSubcategories(data || []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubcategories([]);
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     GESTION DU FORMULAIRE
     ─────────────────────────────────────────────────────────────
     handleChange() → MAJ state formData
     handleImageChange() → Upload nouvelles images
     removeExistingImage() → Marque image pour suppression
     ═══════════════════════════════════════════════════════════════ */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length - imagesToDelete.length + files.length;

    if (totalImages > 6) {
      setError('Maximum 6 images autorisées');
      return;
    }

    setUploadingImages(true);
    try {
      const compressedFiles = await Promise.all(
        files.map(file => compressImage(file))
      );
      setImageFiles(prev => [...prev, ...compressedFiles]);
    } catch (error) {
      console.error('Error processing images:', error);
      setError('Erreur lors du traitement des images');
    } finally {
      setUploadingImages(false);
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     SUPPRESSION IMAGE EXISTANTE
     ─────────────────────────────────────────────────────────────
     - Marque l'URL pour suppression (imagesToDelete)
     - Suppression effective lors du submit
     ═══════════════════════════════════════════════════════════════ */
  const removeExistingImage = (imageUrl) => {
    setImagesToDelete(prev => [...prev, imageUrl]);
    setExistingImages(prev => prev.filter(url => url !== imageUrl));
  };

  const removeNewImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  /* ═══════════════════════════════════════════════════════════════
     NAVIGATION ENTRE ÉTAPES
     ═══════════════════════════════════════════════════════════════ */
  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     VALIDATION FORMULAIRE
     ─────────────────────────────────────────────────────────────
     Vérifie champs obligatoires selon l'étape
     ═══════════════════════════════════════════════════════════════ */
  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return formData.category_id && formData.listing_type;
      case 2:
        return formData.title && formData.description && formData.price;
      case 3:
        return formData.wilaya && formData.commune;
      case 4:
        return true;
      default:
        return false;
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     SOUMISSION FORMULAIRE - MISE À JOUR ANNONCE
     ─────────────────────────────────────────────────────────────

     FLUX:
     1. Upload nouvelles images → Supabase Storage
     2. Suppression anciennes images marquées
     3. Fusion images existantes + nouvelles
     4. Update listing dans table 'listings'
     5. Redirection vers MyListings

     Relations BDD:
     - supabase.storage.from('listings') → Upload images
     - supabase.from('listings').update() → MAJ annonce
     ═══════════════════════════════════════════════════════════════ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let allImages = [...existingImages];

      // Upload nouvelles images
      if (imageFiles.length > 0) {
        const newImageUrls = await uploadImages(imageFiles, user.id);
        allImages = [...allImages, ...newImageUrls];
      }

      // Suppression images marquées (TODO: implémenter suppression storage)
      allImages = allImages.filter(url => !imagesToDelete.includes(url));

      // Préparation données pour update
      const updateData = {
        account_type: formData.account_type,
        offer_type: formData.offer_type,
        listing_type: formData.listing_type,
        category_id: formData.category_id,
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        negotiable: formData.negotiable,
        wilaya: formData.wilaya,
        commune: formData.commune,
        condition: formData.condition,
        delivery_available: formData.delivery_available,
        images: allImages,
        updated_at: new Date().toISOString(),

        // ═══════════════════════════════════════════════════════════
        // 🆕 CHAMPS PROMOTIONS
        // ───────────────────────────────────────────────────────────
        // Relations:
        // - promotion_active → Affichage badge promo dans ListingCard
        // - promotion_discount → Calcul prix réduit
        // - promotion_end_date → Désactivation auto (future feature)
        // ═══════════════════════════════════════════════════════════
        promotion_active: formData.promotion_active,
        promotion_discount: formData.promotion_discount ? parseFloat(formData.promotion_discount) : null,
        promotion_end_date: formData.promotion_end_date || null,
      };

      // Champs optionnels selon catégorie
      if (formData.bedrooms) updateData.bedrooms = parseInt(formData.bedrooms);
      if (formData.bathrooms) updateData.bathrooms = parseInt(formData.bathrooms);
      if (formData.surface) updateData.surface = parseFloat(formData.surface);
      if (formData.brand) updateData.brand = formData.brand;
      if (formData.model) updateData.model = formData.model;
      if (formData.year) updateData.year = parseInt(formData.year);
      if (formData.mileage) updateData.mileage = parseInt(formData.mileage);
      if (formData.contract_type) updateData.contract_type = formData.contract_type;
      if (formData.experience_level) updateData.experience_level = formData.experience_level;
      if (formData.pricing_type) updateData.pricing_type = formData.pricing_type;
      if (formData.availability) updateData.availability = formData.availability;

      // Champs locations vacances
      if (formData.accommodation_type) updateData.accommodation_type = formData.accommodation_type;
      if (formData.vacation_destination) updateData.vacation_destination = formData.vacation_destination;
      if (formData.capacity) updateData.capacity = parseInt(formData.capacity);
      if (formData.beds) updateData.beds = parseInt(formData.beds);
      if (formData.vacation_amenities) updateData.vacation_amenities = formData.vacation_amenities;
      if (formData.distance_to_beach) updateData.distance_to_beach = formData.distance_to_beach;

      // Champs véhicules
      if (formData.vehicle_type) updateData.vehicle_type = formData.vehicle_type;
      if (formData.brand) updateData.brand_id = formData.brand;
      if (formData.model) updateData.model_id = formData.model;
      if (formData.fuel_type) updateData.fuel_type = formData.fuel_type;
      if (formData.transmission) updateData.transmission = formData.transmission;

      // Champs immobilier
      if (formData.property_type) updateData.property_type = formData.property_type;

      // Appel BDD: Update listing
      const { error } = await supabase
        .from('listings')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      alert('Annonce mise à jour avec succès!');
      navigate('/my-listings');
    } catch (error) {
      console.error('Error updating listing:', error);
      setError('Erreur lors de la mise à jour: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     AFFICHAGE CHARGEMENT
     ═══════════════════════════════════════════════════════════════ */
  if (loading && !formData.title) {
    return (
      <div className={styles.loading}>
        <p>Chargement de l'annonce...</p>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════════
     RENDU FORMULAIRE
     ═══════════════════════════════════════════════════════════════ */
  return (
    <div className={styles.createListing}>
      <div className="container">
        <BackButton fallbackPath="/my-listings" />
        <div className={styles.header}>
          <h1>✏️ Modifier l'annonce</h1>
        </div>

        <FormSteps steps={steps} currentStep={currentStep} />

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>

          {/* ═══════════════════════════════════════════════════════════
              ÉTAPE 1: TYPE & CATÉGORIE
              ─────────────────────────────────────────────────────────
              Relations BDD: categories table
              ═══════════════════════════════════════════════════════ */}
          {currentStep === 1 && (
            <div className={styles.step}>
              <h2>Type & Catégorie</h2>
              <p style={{color: '#666', fontSize: '14px', marginBottom: '20px'}}>
                ⚠️ Les champs grisés ne peuvent pas être modifiés après la création
              </p>

              <div className={styles.formGroup}>
                <label>Type de compte</label>
                <select name="account_type" value={formData.account_type} onChange={handleChange} disabled style={{backgroundColor: '#f5f5f5', cursor: 'not-allowed'}}>
                  <option value="particulier">Particulier</option>
                  <option value="professionnel">Professionnel</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Type d'offre</label>
                <select name="offer_type" value={formData.offer_type} onChange={handleChange} disabled style={{backgroundColor: '#f5f5f5', cursor: 'not-allowed'}}>
                  <option value="offre">Offre</option>
                  <option value="demande">Demande</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Catégorie *</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                  disabled
                  style={{backgroundColor: '#f5f5f5', cursor: 'not-allowed'}}
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {getCategoryName(cat, language)}
                    </option>
                  ))}
                </select>
              </div>


              <div className={styles.formGroup}>
                <label>Action *</label>
                <select name="listing_type" value={formData.listing_type} onChange={handleChange} required disabled style={{backgroundColor: '#f5f5f5', cursor: 'not-allowed'}}>
                  {isRentalCategory ? (
                    <option value="louer">Louer</option>
                  ) : (
                    <>
                      <option value="vendre">Vendre</option>
                      <option value="acheter">Acheter</option>
                      <option value="proposer">Proposer</option>
                      <option value="rechercher">Rechercher</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              ÉTAPE 2: INFORMATIONS GÉNÉRALES
              ═══════════════════════════════════════════════════════ */}
          {currentStep === 2 && (
            <div className={styles.step}>
              <h2>Informations</h2>

              <div className={styles.formGroup}>
                <label>Titre *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: Appartement F3 à louer"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Décrivez votre annonce en détail..."
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Prix (DA) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Ex: 5000000"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>
                  <input
                    type="checkbox"
                    name="negotiable"
                    checked={formData.negotiable}
                    onChange={handleChange}
                  />
                  Prix négociable
                </label>
              </div>

              {/* ═══════════════════════════════════════════════════════════
                  🆕 SECTION PROMOTIONS
                  ─────────────────────────────────────────────────────────
                  Relations BDD:
                  - listings.promotion_active → boolean
                  - listings.promotion_discount → numeric(5,2)
                  - listings.promotion_end_date → timestamptz

                  Affichage:
                  - ListingCard.jsx → Badge "-20%"
                  - ListingDetail.jsx → Prix barré + prix promo
                  ═══════════════════════════════════════════════════════ */}
              <div className={styles.promotionSection}>
                <h3>🎁 Promotion (Optionnel)</h3>

                <div className={styles.formGroup}>
                  <label>
                    <input
                      type="checkbox"
                      name="promotion_active"
                      checked={formData.promotion_active}
                      onChange={handleChange}
                    />
                    Activer une promotion
                  </label>
                </div>

                {formData.promotion_active && (
                  <>
                    <div className={styles.formGroup}>
                      <label>Réduction (%)</label>
                      <input
                        type="number"
                        name="promotion_discount"
                        value={formData.promotion_discount}
                        onChange={handleChange}
                        placeholder="Ex: 15 pour -15%"
                        min="0"
                        max="100"
                        step="0.01"
                      />
                      <small>Entre 0 et 100%</small>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Date de fin (optionnel)</label>
                      <input
                        type="date"
                        name="promotion_end_date"
                        value={formData.promotion_end_date}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      <small>Laissez vide pour une promo permanente</small>
                    </div>

                    {formData.price && formData.promotion_discount && (
                      <div className={styles.pricePreview}>
                        <p>
                          Prix original: <span style={{textDecoration: 'line-through'}}>{parseFloat(formData.price).toLocaleString()} DA</span>
                        </p>
                        <p style={{color: 'var(--primary)', fontWeight: 'bold', fontSize: '20px'}}>
                          Prix promo: {(parseFloat(formData.price) * (1 - parseFloat(formData.promotion_discount) / 100)).toLocaleString()} DA
                          <span style={{marginLeft: '10px', color: '#28a745'}}>(-{formData.promotion_discount}%)</span>
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              ÉTAPE 3: DÉTAILS SPÉCIFIQUES
              ─────────────────────────────────────────────────────────
              Champs conditionnels selon catégorie
              ═══════════════════════════════════════════════════════ */}
          {/* ÉTAPE 3: DÉTAILS SPÉCIFIQUES */}
          {currentStep === 3 && (
            <div className={styles.step}>
              <h2>Détails de l'annonce</h2>

              <div className={styles.sectionCard}>
                <h3 style={{marginBottom: '16px', color: '#2c3e50'}}>📍 Localisation</h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Wilaya *</label>
                    <select name="wilaya" value={formData.wilaya} onChange={handleChange} required className={styles.select}>
                      <option value="">Sélectionnez une wilaya</option>
                      {wilayas.map(w => (
                        <option key={w.code} value={w.name}>{w.code} - {w.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Commune *</label>
                    <select name="commune" value={formData.commune} onChange={handleChange} required disabled={!formData.wilaya} className={styles.select}>
                      <option value="">Sélectionnez une commune</option>
                      {communes.map(c => (
                        <option key={c.id} value={c.name_fr}>{c.name_fr}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>État *</label>
                  <select name="condition" value={formData.condition} onChange={handleChange} className={styles.select}>
                    <option value="new">Neuf</option>
                    <option value="good">Bon état</option>
                    <option value="used">Usagé</option>
                  </select>
                </div>
              </div>

              {/* VÉHICULES */}
              {getCategoryType() === 'vehicle' && (
                <div className={styles.sectionCard}>
                  <h3 style={{marginBottom: '16px', color: '#2c3e50'}}>🚗 Informations véhicule</h3>
                  <div className={styles.formGroup}>
                    <label>Type de véhicule *</label>
                    <select name="vehicle_type" value={formData.vehicle_type || ''} onChange={handleChange}>
                      <option value="">Sélectionner...</option>
                      <option value="voiture">Voiture</option>
                      <option value="moto">Moto</option>
                      <option value="camion">Camion</option>
                    </select>
                  </div>
                  <VehicleSelector
                    selectedBrand={formData.brand}
                    selectedModel={formData.model}
                    onBrandChange={(brandId) => setFormData(prev => ({ ...prev, brand: brandId, model: '' }))}
                    onModelChange={(modelId) => setFormData(prev => ({ ...prev, model: modelId }))}
                  />
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Année</label>
                      <input type="number" name="year" value={formData.year || ''} onChange={handleChange} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Kilométrage</label>
                      <input type="number" name="mileage" value={formData.mileage || ''} onChange={handleChange} />
                    </div>
                  </div>
                </div>
              )}

              {/* IMMOBILIER */}
              {getCategoryType() === 'real_estate' && (
                <div className={styles.sectionCard}>
                  <h3 style={{marginBottom: '16px', color: '#2c3e50'}}>🏠 Caractéristiques immobilier</h3>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Chambres</label>
                      <input type="number" name="bedrooms" value={formData.bedrooms || ''} onChange={handleChange} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Salles de bain</label>
                      <input type="number" name="bathrooms" value={formData.bathrooms || ''} onChange={handleChange} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Surface (m²)</label>
                      <input type="number" name="surface" value={formData.surface || ''} onChange={handleChange} />
                    </div>
                  </div>
                </div>
              )}

              {/* EMPLOI */}
              {getCategoryType() === 'employment' && (
                <div className={styles.sectionCard}>
                  <h3 style={{marginBottom: '16px', color: '#2c3e50'}}>💼 Informations emploi</h3>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Type de contrat</label>
                      <select name="contract_type" value={formData.contract_type || ''} onChange={handleChange}>
                        <option value="">Sélectionner...</option>
                        <option value="cdi">CDI</option>
                        <option value="cdd">CDD</option>
                        <option value="freelance">Freelance</option>
                        <option value="stage">Stage</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Niveau d'expérience</label>
                      <select name="experience_level" value={formData.experience_level || ''} onChange={handleChange}>
                        <option value="">Sélectionner...</option>
                        <option value="debutant">Débutant</option>
                        <option value="intermediaire">Intermédiaire</option>
                        <option value="confirme">Confirmé</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* SERVICES */}
              {getCategoryType() === 'service' && (
                <div className={styles.sectionCard}>
                  <h3 style={{marginBottom: '16px', color: '#2c3e50'}}>🛠️ Informations service</h3>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Type de tarification</label>
                      <select name="pricing_type" value={formData.pricing_type || ''} onChange={handleChange}>
                        <option value="">Sélectionner...</option>
                        <option value="horaire">Horaire</option>
                        <option value="journalier">Journalier</option>
                        <option value="forfait">Forfait</option>
                        <option value="sur_devis">Sur devis</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Disponibilité</label>
                      <select name="availability" value={formData.availability || ''} onChange={handleChange}>
                        <option value="">Sélectionner...</option>
                        <option value="immediat">Immédiat</option>
                        <option value="1_semaine">Dans 1 semaine</option>
                        <option value="1_mois">Dans 1 mois</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* LOCATION VACANCES */}
              {isVacationRental() && (
                <div className={styles.sectionCard}>
                  <h3 style={{marginBottom: '16px', color: '#2c3e50'}}>🏖️ Informations Hébergement Vacances</h3>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Type d'hébergement *</label>
                      <select name="accommodation_type" value={formData.accommodation_type || ''} onChange={handleChange}>
                        <option value="">Sélectionner...</option>
                        <option value="appartement">Appartement</option>
                        <option value="villa">Villa</option>
                        <option value="maison">Maison</option>
                        <option value="chalet">Chalet</option>
                        <option value="studio">Studio</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Capacité (personnes) *</label>
                      <input type="number" name="capacity" value={formData.capacity || ''} onChange={handleChange} min="1" max="50" />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Nombre de chambres</label>
                      <input type="number" name="bedrooms" value={formData.bedrooms || ''} onChange={handleChange} min="0" max="20" />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Nombre de lits</label>
                      <input type="number" name="beds" value={formData.beds || ''} onChange={handleChange} min="0" max="50" />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Salles de bain</label>
                      <input type="number" name="bathrooms" value={formData.bathrooms || ''} onChange={handleChange} min="0" max="10" />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Distance de la plage / point d'intérêt</label>
                    <input type="text" name="distance_to_beach" value={formData.distance_to_beach || ''} onChange={handleChange} placeholder="Ex: 100m de la plage" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              ÉTAPE 4: PHOTOS
              ─────────────────────────────────────────────────────────
              Relations:
              - Supabase Storage bucket 'listings'
              - imageUpload.js → Compression + Upload
              ═══════════════════════════════════════════════════════ */}
          {currentStep === 4 && (
            <div className={styles.step}>
              <h2>Photos & Publication</h2>
              <p style={{color: '#666', marginBottom: '24px'}}>Gérez les photos de votre annonce (maximum 6 images)</p>

              {existingImages.length > 0 && (
                <div className={styles.sectionCard}>
                  <h3 style={{marginBottom: '16px', color: '#2c3e50'}}>📸 Images actuelles ({existingImages.length - imagesToDelete.length}/{6})</h3>
                  <div className={styles.imagePreview}>
                    {existingImages.map((url, index) => (
                      <div key={index} className={styles.imageItem} style={{opacity: imagesToDelete.includes(url) ? 0.3 : 1}}>
                        <img src={url} alt={`Image ${index + 1}`} />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(url)}
                          className={styles.removeImageBtn}
                          title="Supprimer cette image"
                        >
                          ✕
                        </button>
                        {imagesToDelete.includes(url) && (
                          <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#f44336', color: 'white', padding: '4px 12px', borderRadius: '4px', fontSize: '12px'}}>
                            À supprimer
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(existingImages.length - imagesToDelete.length + imageFiles.length) < 6 && (
                <div className={styles.sectionCard}>
                  <h3 style={{marginBottom: '16px', color: '#2c3e50'}}>➕ Ajouter des photos</h3>
                  <div className={styles.formGroup}>
                    <label style={{display: 'block', marginBottom: '12px'}}>
                      Sélectionnez jusqu'à {6 - (existingImages.length - imagesToDelete.length + imageFiles.length)} image(s) supplémentaire(s)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      disabled={uploadingImages}
                      style={{width: '100%', padding: '12px', border: '2px dashed #ddd', borderRadius: '8px', cursor: 'pointer'}}
                    />
                    <small style={{display: 'block', marginTop: '8px', color: '#666'}}>
                      Formats acceptés: JPG, PNG, WEBP • Taille max par image: 5 MB
                    </small>
                  </div>

                  {imageFiles.length > 0 && (
                    <>
                      <h4 style={{marginTop: '24px', marginBottom: '12px', color: '#2c3e50'}}>Nouvelles images à ajouter:</h4>
                      <div className={styles.imagePreview}>
                        {imageFiles.map((file, index) => (
                          <div key={index} className={styles.imageItem}>
                            <img src={URL.createObjectURL(file)} alt={`Nouvelle ${index + 1}`} />
                            <button
                              type="button"
                              onClick={() => removeNewImage(index)}
                              className={styles.removeImageBtn}
                              title="Retirer cette image"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {(existingImages.length - imagesToDelete.length + imageFiles.length) === 0 && (
                <div style={{textAlign: 'center', padding: '40px', background: '#f9f9f9', borderRadius: '12px', border: '2px dashed #ddd'}}>
                  <div style={{fontSize: '48px', marginBottom: '16px'}}>📷</div>
                  <p style={{color: '#666', marginBottom: '16px'}}>Aucune image pour cette annonce</p>
                  <p style={{color: '#999', fontSize: '14px'}}>Ajoutez au moins une photo pour rendre votre annonce plus attractive!</p>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              NAVIGATION ENTRE ÉTAPES
              ═══════════════════════════════════════════════════════ */}
          <div className={styles.navigation}>
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className={styles.btnSecondary}>
                ← Précédent
              </button>
            )}

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!canProceedToNextStep()}
                className={styles.btnPrimary}
              >
                Suivant →
              </button>
            ) : (
              <button type="submit" disabled={loading} className={styles.btnPrimary}>
                {loading ? 'Mise à jour...' : '✓ Mettre à jour'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
