import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { wilayas } from '../data/wilayas';
import { uploadImages, compressImage } from '../utils/imageUpload';
import { getCategoryName } from '../utils/categoryHelpers';
import { getCommuneName, fetchCommunesByWilaya, getWilayaCodeFromName } from '../utils/communeHelpers';
import FormSteps from '../components/FormSteps';
import VehicleSelector from '../components/VehicleSelector';
import BackButton from '../components/BackButton';
import styles from './CreateListing.module.css';

export default function CreateListing() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRentalCategory, setIsRentalCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(null);

  const steps = ['Type & Catégorie', 'Informations', 'Détails', 'Photos & Publication'];

  /* ═══════════════════════════════════════════════════════════════
     ÉTAT DU FORMULAIRE
     ─────────────────────────────────────────────────────────────
     Relations BDD: Chaque champ correspond à une colonne dans 'listings'
     Nouveaux champs PROMOTIONS:
     - promotion_active → boolean (checkbox)
     - promotion_discount → numeric (input number 0-100)
     - promotion_end_date → timestamptz (input date)
     ═══════════════════════════════════════════════════════════════ */
  const [formData, setFormData] = useState({
    account_type: 'particulier',
    offer_type: 'offre',
    listing_type: 'vendre',
    category_id: '',
    subcategory_id: '',
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
    vehicle_type: '',
    brand: '',
    model: '',
    year: '',
    mileage: '',
    fuel_type: '',
    transmission: '',
    color: '',
    doors: '',
    engine_capacity: '',
    horsepower: '',
    seats: '',
    features: [],
    contract_type: '',
    experience_level: '',
    pricing_type: '',
    availability: '',
    job_title: '',
    job_sector: '',
    work_schedule: '',
    remote_work: '',
    salary_type: 'fixed',
    salary_max: '',
    education_level: '',
    service_type: '',
    service_availability: '',
    service_location: '',
    pricing_mode: '',
    pricing_negotiable: false,
    free_quote: false,
    book_genre: '',
    book_language: '',
    book_author: '',
    book_publisher: '',
    book_isbn: '',
    book_publication_year: '',
    book_pages: '',
    book_format: '',
    comic_series_title: '',
    comic_issue_number: '',
    comic_language: '',
    comic_publisher: '',
    media_type: '',
    media_audio_languages: [],
    media_subtitles: [],
    media_zone: '',
    music_format: '',
    music_genre: '',
    music_artist: '',
    music_album: '',
    exchange_only: false,
    exchange_for: '',
    promotion_active: false,
    promotion_discount: '',
    promotion_end_date: '',
    property_type: '',
    floor: '',
    property_condition: '',
    rental_type: '',
    furnished: '',
    amenities: [],
    charges_included: false,
    charges_amount: '',
    deposit_required: false,
    deposit_amount: '',
    available_from: '',
    minimum_rental_duration: '',
    visit_hours: '',
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    whatsapp_available: false,
    device_type: '',
    storage: '',
    ram: '',
    battery_condition: '',
    warranty: '',
    accessories_included: [],
    processor: '',
    screen_size: '',
    clothing_type: '',
    size: '',
    material: '',
    gender: '',
    season: '',
    brand_fashion: '',
    furniture_type: '',
    dimensions: '',
    materials: '',
    style: '',
    assembly_required: false,
    leisure_type: '',
    age_recommended: '',
    players_count: '',
    difficulty_level: '',
    animal_type: '',
    breed: '',
    animal_age: '',
    animal_gender: '',
    vaccinated: false,
    pedigree: false,
    neutered: false,
    age_range: '',
    child_gender: '',
    safety_standard: '',
    baby_item_type: '',
    rental_duration: '',
    daily_rate: '',
    weekly_rate: '',
    monthly_rate: '',
    deposit_equipment: '',
    included_km: '',
    equipment_category: '',
    certification: '',
    availability_start: '',
    availability_end: '',
    available_all_year: false,
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [showDraftNotification, setShowDraftNotification] = useState(false);

  const [deliveryOptions, setDeliveryOptions] = useState([
    { delivery_type: 'pickup', zones: [], price: 0, estimated_days: 0 }
  ]);

  const DRAFT_KEY = 'wesh_dz_listing_draft';

  // Charger le brouillon au démarrage
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCategories();
    loadDraft();
  }, [user, navigate]);

  // Sauvegarder automatiquement le formulaire
  useEffect(() => {
    if (user && (formData.title || formData.description || formData.category_id)) {
      saveDraft();
    }
  }, [formData, currentStep, user]);

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

  useEffect(() => {
    if (formData.category_id) {
      const selectedCat = categories.find(c => c.id === formData.category_id);
      setSelectedCategory(selectedCat);
      const catName = getCategoryName(selectedCat, language).toLowerCase();
      const isRental = catName.includes('location') || catName.includes('rent') || catName.includes('تأجير') || catName.includes('vacances') || catName.includes('louer');
      setIsRentalCategory(isRental);

      // Déterminer le listing_type par défaut selon la catégorie
      let defaultListingType = 'vendre';

      if (isRental) {
        defaultListingType = 'louer';
      } else if (catName.includes('emploi') || catName.includes('job') || catName.includes('وظيف')) {
        defaultListingType = formData.offer_type === 'offre' ? 'proposer' : 'rechercher';
      } else if (catName.includes('service') || catName.includes('خدم')) {
        defaultListingType = formData.offer_type === 'offre' ? 'proposer' : 'rechercher';
      }

      // Mettre à jour si le type actuel n'est pas compatible
      const needsUpdate =
        (isRental && formData.listing_type !== 'louer') ||
        (!isRental && formData.listing_type === 'louer') ||
        ((catName.includes('emploi') || catName.includes('service')) &&
         !['proposer', 'rechercher'].includes(formData.listing_type));

      if (needsUpdate) {
        setFormData(prev => ({ ...prev, listing_type: defaultListingType }));
      }

      fetchSubcategories(formData.category_id);
    } else {
      setSubcategories([]);
      setSelectedCategory(null);
      setFormData(prev => ({ ...prev, subcategory_id: '' }));
      setIsRentalCategory(false);
    }
  }, [formData.category_id, categories, language]);

  const loadCommunes = async (wilayaCode) => {
    const communesData = await fetchCommunesByWilaya(wilayaCode);
    setCommunes(communesData);
  };

  const saveDraft = () => {
    try {
      const draft = {
        formData,
        currentStep,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      setHasDraft(true);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du brouillon:', error);
    }
  };

  const loadDraft = () => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        const draftAge = Date.now() - new Date(draft.timestamp).getTime();
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 jours

        if (draftAge < maxAge) {
          setHasDraft(true);
          setShowDraftNotification(true);
        } else {
          clearDraft();
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du brouillon:', error);
    }
  };

  const restoreDraft = () => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        setFormData(draft.formData);
        setCurrentStep(draft.currentStep);
        setShowDraftNotification(false);
        setHasDraft(true);
      }
    } catch (error) {
      console.error('Erreur lors de la restauration du brouillon:', error);
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
    setShowDraftNotification(false);
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('id, name, name_fr, name_ar, name_en, icon, parent_id, display_order')
      .is('parent_id', null)
      .order('display_order', { ascending: true });
    if (data) setCategories(data);
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, name_fr, name_ar, name_en, slug, icon, parent_id, display_order')
        .eq('parent_id', categoryId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setSubcategories(data || []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubcategories([]);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayCheckboxChange = (e, fieldName) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const currentArray = prev[fieldName] || [];
      if (checked) {
        return { ...prev, [fieldName]: [...currentArray, value] };
      } else {
        return { ...prev, [fieldName]: currentArray.filter(item => item !== value) };
      }
    });
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (imageFiles.length + files.length > 6) {
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

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceedFromStep1 = () => {
    return formData.category_id && formData.offer_type && formData.listing_type;
  };

  const canProceedFromStep2 = () => {
    return formData.title && formData.description && formData.wilaya && formData.commune;
  };

  const canProceedFromStep3 = () => {
    if (isVacationRental()) {
      if (!formData.rental_duration) return false;

      if (formData.rental_duration === 'jour' && !formData.daily_rate) return false;
      if (formData.rental_duration === 'semaine' && !formData.weekly_rate) return false;
      if (formData.rental_duration === 'mois' && !formData.monthly_rate) return false;

      return formData.availability_start && formData.availability_end;
    }

    if (getCategoryType() === 'equipment_rental') {
      if (!formData.rental_duration) return false;

      if (formData.rental_duration === 'jour' && !formData.daily_rate) return false;
      if (formData.rental_duration === 'semaine' && !formData.weekly_rate) return false;
      if (formData.rental_duration === 'mois' && !formData.monthly_rate) return false;

      return true;
    }

    return formData.price;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      let uploadedImageUrls = [];
      if (imageFiles.length > 0) {
        uploadedImageUrls = await uploadImages(imageFiles, user.id);
      }

      /* ═══════════════════════════════════════════════════════════════
         PRÉPARATION DONNÉES POUR INSERT
         ─────────────────────────────────────────────────────────────
         Relations BDD: Table 'listings' avec 21 colonnes
         Nouveaux champs: promotion_active, promotion_discount, promotion_end_date
         ═══════════════════════════════════════════════════════════════ */
      let finalPrice = formData.price ? parseFloat(formData.price) : null;

      if (!finalPrice && formData.listing_type === 'louer') {
        if (formData.rental_duration === 'jour' && formData.daily_rate) {
          finalPrice = parseFloat(formData.daily_rate);
        } else if (formData.rental_duration === 'semaine' && formData.weekly_rate) {
          finalPrice = parseFloat(formData.weekly_rate);
        } else if (formData.rental_duration === 'mois' && formData.monthly_rate) {
          finalPrice = parseFloat(formData.monthly_rate);
        } else if (formData.daily_rate) {
          finalPrice = parseFloat(formData.daily_rate);
        } else if (formData.weekly_rate) {
          finalPrice = parseFloat(formData.weekly_rate);
        } else if (formData.monthly_rate) {
          finalPrice = parseFloat(formData.monthly_rate);
        }
      }

      const listingData = {
        user_id: user.id,
        account_type: formData.account_type,
        title: formData.title,
        description: formData.description,
        offer_type: formData.offer_type,
        listing_type: formData.listing_type,
        price: finalPrice,
        negotiable: formData.negotiable,
        category_id: formData.subcategory_id || formData.category_id,
        condition: formData.condition,
        wilaya: formData.wilaya,
        commune: formData.commune,
        delivery_available: formData.delivery_available,
        images: uploadedImageUrls,
        status: 'active',
        promotion_active: formData.promotion_active || false,
        promotion_discount: formData.promotion_discount ? parseFloat(formData.promotion_discount) : null,
        promotion_end_date: formData.promotion_end_date || null,
        property_type: formData.property_type || null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        surface: formData.surface ? parseFloat(formData.surface) : null,
        floor: formData.floor || null,
        property_condition: formData.property_condition || null,
        rental_type: formData.rental_type || null,
        furnished: formData.furnished || null,
        amenities: formData.amenities || [],
        charges_included: formData.charges_included || false,
        charges_amount: formData.charges_amount ? parseFloat(formData.charges_amount) : null,
        deposit_required: formData.deposit_required || false,
        deposit_amount: formData.deposit_amount ? parseFloat(formData.deposit_amount) : null,
        available_from: formData.available_from || null,
        minimum_rental_duration: formData.minimum_rental_duration || null,
        visit_hours: formData.visit_hours || null,
        contact_name: formData.contact_name || null,
        contact_phone: formData.contact_phone || null,
        contact_email: formData.contact_email || null,
        whatsapp_available: formData.whatsapp_available || false,
        vehicle_type: formData.vehicle_type || null,
        brand: formData.brand || null,
        model: formData.model || null,
        year: formData.year ? parseInt(formData.year) : null,
        mileage: formData.mileage ? parseInt(formData.mileage) : null,
        fuel_type: formData.fuel_type || null,
        transmission: formData.transmission || null,
        color: formData.color || null,
        doors: formData.doors ? parseInt(formData.doors) : null,
        engine_capacity: formData.engine_capacity ? parseInt(formData.engine_capacity) : null,
        horsepower: formData.horsepower ? parseInt(formData.horsepower) : null,
        seats: formData.seats ? parseInt(formData.seats) : null,
        features: formData.features || [],
        job_title: formData.job_title || null,
        job_sector: formData.job_sector || null,
        work_schedule: formData.work_schedule || null,
        remote_work: formData.remote_work || null,
        salary_type: formData.salary_type || null,
        salary_max: formData.salary_max ? parseFloat(formData.salary_max) : null,
        education_level: formData.education_level || null,
        service_type: formData.service_type || null,
        service_availability: formData.service_availability || null,
        service_location: formData.service_location || null,
        service_experience_years: formData.service_experience_years || null,
        pricing_mode: formData.pricing_mode || null,
        pricing_negotiable: formData.pricing_negotiable || false,
        free_quote: formData.free_quote || false,
        book_genre: formData.book_genre || null,
        book_language: formData.book_language || null,
        book_author: formData.book_author || null,
        book_publisher: formData.book_publisher || null,
        book_isbn: formData.book_isbn || null,
        book_publication_year: formData.book_publication_year ? parseInt(formData.book_publication_year) : null,
        book_pages: formData.book_pages ? parseInt(formData.book_pages) : null,
        book_format: formData.book_format || null,
        comic_series_title: formData.comic_series_title || null,
        comic_issue_number: formData.comic_issue_number ? parseInt(formData.comic_issue_number) : null,
        comic_language: formData.comic_language || null,
        comic_publisher: formData.comic_publisher || null,
        media_type: formData.media_type || null,
        media_audio_languages: formData.media_audio_languages || [],
        media_subtitles: formData.media_subtitles || [],
        media_zone: formData.media_zone || null,
        music_format: formData.music_format || null,
        music_genre: formData.music_genre || null,
        music_artist: formData.music_artist || null,
        music_album: formData.music_album || null,
        exchange_only: formData.exchange_only || false,
        exchange_for: formData.exchange_for || null,
        device_type: formData.device_type || null,
        storage: formData.storage || null,
        ram: formData.ram || null,
        battery_condition: formData.battery_condition || null,
        warranty: formData.warranty || null,
        accessories_included: formData.accessories_included || [],
        processor: formData.processor || null,
        screen_size: formData.screen_size || null,
        clothing_type: formData.clothing_type || null,
        size: formData.size || null,
        material: formData.material || null,
        gender: formData.gender || null,
        season: formData.season || null,
        brand_fashion: formData.brand_fashion || null,
        furniture_type: formData.furniture_type || null,
        dimensions: formData.dimensions || null,
        materials: formData.materials || null,
        style: formData.style || null,
        assembly_required: formData.assembly_required || false,
        leisure_type: formData.leisure_type || null,
        age_recommended: formData.age_recommended || null,
        players_count: formData.players_count || null,
        difficulty_level: formData.difficulty_level || null,
        animal_type: formData.animal_type || null,
        breed: formData.breed || null,
        animal_age: formData.animal_age || null,
        animal_gender: formData.animal_gender || null,
        vaccinated: formData.vaccinated || false,
        pedigree: formData.pedigree || false,
        neutered: formData.neutered || false,
        age_range: formData.age_range || null,
        child_gender: formData.child_gender || null,
        safety_standard: formData.safety_standard || null,
        baby_item_type: formData.baby_item_type || null,
        rental_duration: formData.rental_duration || null,
        daily_rate: formData.daily_rate ? parseFloat(formData.daily_rate) : null,
        weekly_rate: formData.weekly_rate ? parseFloat(formData.weekly_rate) : null,
        monthly_rate: formData.monthly_rate ? parseFloat(formData.monthly_rate) : null,
        deposit_equipment: formData.deposit_equipment ? parseFloat(formData.deposit_equipment) : null,
        included_km: formData.included_km ? parseInt(formData.included_km) : null,
        equipment_category: formData.equipment_category || null,
        certification: formData.certification || null,
        accommodation_type: formData.accommodation_type || null,
        vacation_destination: formData.vacation_destination || null,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        beds: formData.beds ? parseInt(formData.beds) : null,
        vacation_amenities: formData.vacation_amenities || [],
        distance_to_beach: formData.distance_to_beach || null,
        availability_start: formData.availability_start || null,
        availability_end: formData.availability_end || null,
        available_all_year: formData.available_all_year || false,
      };

      const { data: listing, error: listingError } = await supabase
        .from('listings')
        .insert([listingData])
        .select()
        .single();

      if (listingError) throw listingError;

      if (formData.delivery_available && listing) {
        const deliveryData = deliveryOptions.map(option => ({
          listing_id: listing.id,
          delivery_type: option.delivery_type,
          zones: option.zones,
          price: parseFloat(option.price) || 0,
          estimated_days: parseInt(option.estimated_days) || 0,
        }));

        const { error: deliveryError } = await supabase
          .from('delivery_options')
          .insert(deliveryData);

        if (deliveryError) throw deliveryError;
      }

      clearDraft();
      navigate(`/listing/${listing.id}`);
    } catch (error) {
      console.error('Error creating listing:', error);
      setError('Erreur lors de la création de l\'annonce. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const getMediaSubcategoryType = () => {
    if (!selectedSubcategory) return null;
    const subcat = subcategories.find(s => s.id === selectedSubcategory);
    if (!subcat) return null;
    const subcatName = (subcat.name_fr || subcat.name || '').toLowerCase();
    const subcatSlug = (subcat.slug || '').toLowerCase();

    if (subcatSlug.includes('livre') || subcatName.includes('livre') || subcatName.includes('book')) return 'books';
    if (subcatSlug.includes('bd') || subcatSlug.includes('manga') || subcatName.includes('bd') || subcatName.includes('manga') || subcatName.includes('comic')) return 'comics';
    if (subcatSlug.includes('dvd') || subcatSlug.includes('blu') || subcatName.includes('dvd') || subcatName.includes('blu-ray') || subcatName.includes('film')) return 'dvd';
    if (subcatSlug.includes('cd') || subcatSlug.includes('vinyl') || subcatName.includes('cd') || subcatName.includes('vinyle') || subcatName.includes('musique') || subcatName.includes('music')) return 'music';
    if (subcatSlug.includes('magazine') || subcatName.includes('magazine') || subcatName.includes('revue')) return 'books';
    return null;
  };

  const isVehicleRental = () => {
    if (!selectedCategory) return false;
    const catName = getCategoryName(selectedCategory, language).toLowerCase();
    return catName.includes('location') && catName.includes('véhicule');
  };

  const isVacationRental = () => {
    if (!selectedCategory) return false;
    const catName = getCategoryName(selectedCategory, language).toLowerCase();
    return catName.includes('location') && catName.includes('vacances');
  };

  const getCategoryType = () => {
    if (!selectedCategory) return null;
    const catName = getCategoryName(selectedCategory, language).toLowerCase();

    // IMPORTANT: Vérifier véhicules AVANT immobilier pour éviter confusion avec "Location Véhicules"
    if (catName.includes('véhicule') || catName.includes('vehicle') || catName.includes('voiture') || catName.includes('car') || catName.includes('مركب') || catName.includes('auto') || catName.includes('moto') || catName.includes('camion') || catName.includes('truck')) {
      return 'vehicle';
    }
    // Location véhicules et vacances (AVANT immobilier général)
    if (catName.includes('location') && (catName.includes('véhicule') || catName.includes('vacances') || catName.includes('équipement') || catName.includes('equipment') || catName.includes('materiel'))) {
      return 'equipment_rental';
    }
    // Immobilier: inclut "location immobilier" mais PAS "location véhicule" (déjà traité)
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

  const getTransactionOptions = () => {
    const categoryType = getCategoryType();

    // Emploi: Offre d'emploi ou Recherche d'emploi
    if (categoryType === 'employment') {
      if (formData.offer_type === 'offre') {
        return [{ value: 'proposer', label: '💼 Offre d\'emploi', description: 'Je recrute' }];
      } else {
        return [{ value: 'rechercher', label: '🔍 Recherche d\'emploi', description: 'Je cherche un emploi' }];
      }
    }

    // Services: Proposer service ou Rechercher service
    if (categoryType === 'service') {
      if (formData.offer_type === 'offre') {
        return [{ value: 'proposer', label: '🔧 Proposer service', description: 'Je propose mes services' }];
      } else {
        return [{ value: 'rechercher', label: '🔍 Rechercher service', description: 'Je cherche un prestataire' }];
      }
    }

    // Location immobilière: Uniquement louer
    if (isRentalCategory) {
      return [{ value: 'louer', label: '🏠 Location', description: 'À louer' }];
    }

    // Général: Vente, Don, Échange
    return [
      { value: 'vendre', label: '💰 Vente', description: 'À vendre' },
      { value: 'donner', label: '🎁 Don gratuit', description: 'À donner gratuitement' },
      { value: 'echanger', label: '🔄 Échange', description: 'À échanger contre autre chose' }
    ];
  };

  return (
    <div className={styles.createListing}>
      <div className="container">
        <BackButton fallbackPath="/my-listings" />
        <div className={styles.header}>
          <h1>{t('createListing.title')}</h1>
          {hasDraft && !showDraftNotification && (
            <div className={styles.draftIndicator}>
              <span className={styles.autoSaveIcon}>💾</span>
              <span>Sauvegarde automatique activée</span>
            </div>
          )}
        </div>

        {showDraftNotification && (
          <div className={styles.draftNotification}>
            <div className={styles.draftContent}>
              <div className={styles.draftIcon}>📝</div>
              <div className={styles.draftText}>
                <h3>Brouillon détecté</h3>
                <p>Vous avez un brouillon non terminé. Voulez-vous continuer où vous vous étiez arrêté?</p>
              </div>
              <div className={styles.draftActions}>
                <button
                  type="button"
                  onClick={restoreDraft}
                  className={styles.restoreBtn}
                >
                  ✅ Restaurer le brouillon
                </button>
                <button
                  type="button"
                  onClick={() => {
                    clearDraft();
                    setShowDraftNotification(false);
                  }}
                  className={styles.discardBtn}
                >
                  ❌ Commencer une nouvelle annonce
                </button>
              </div>
            </div>
          </div>
        )}

        <FormSteps currentStep={currentStep} steps={steps} />

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {currentStep === 1 && (
            <div className={styles.stepContent}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('createListing.accountType')}</h2>
                <div className={styles.accountTypeSelector}>
                  <button
                    type="button"
                    className={`${styles.accountTypeBtn} ${formData.account_type === 'particulier' ? styles.active : ''}`}
                    onClick={() => setFormData({...formData, account_type: 'particulier'})}
                  >
                    <span className={styles.accountIcon}>👤</span>
                    <div className={styles.accountText}>
                      <strong>{t('createListing.individual')}</strong>
                      <span>{t('createListing.individualDesc')}</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    className={`${styles.accountTypeBtn} ${formData.account_type === 'professionnel' ? styles.active : ''}`}
                    onClick={() => setFormData({...formData, account_type: 'professionnel'})}
                  >
                    <span className={styles.accountIcon}>💼</span>
                    <div className={styles.accountText}>
                      <strong>{t('createListing.professional')}</strong>
                      <span>{t('createListing.professionalDesc')}</span>
                    </div>
                    <span className={styles.proBadge}>PRO</span>
                  </button>
                </div>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Que voulez-vous faire ? *</h2>
                <p className={styles.helpText}>Choisissez si vous proposez ou recherchez quelque chose</p>
                <div className={styles.offerTypeGrid}>
                  <label className={styles.radioCard}>
                    <input
                      type="radio"
                      name="offer_type"
                      value="offre"
                      checked={formData.offer_type === 'offre'}
                      onChange={handleChange}
                    />
                    <div className={styles.radioCardContent}>
                      <strong>💼 Je propose</strong>
                      <span>Je vends, loue ou donne quelque chose</span>
                    </div>
                  </label>
                  <label className={styles.radioCard}>
                    <input
                      type="radio"
                      name="offer_type"
                      value="demande"
                      checked={formData.offer_type === 'demande'}
                      onChange={handleChange}
                    />
                    <div className={styles.radioCardContent}>
                      <strong>🔍 Je recherche</strong>
                      <span>Je cherche à acheter ou louer</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Dans quelle catégorie ? *</h2>
                <p className={styles.helpText}>Choisissez la catégorie qui correspond le mieux à votre annonce</p>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                  className={styles.select}
                >
                  <option value="">-- Sélectionnez une catégorie --</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {getCategoryName(cat, language)}
                    </option>
                  ))}
                </select>
              </div>

              {subcategories.length > 0 && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Plus précisément ? (optionnel)</h2>
                  <p className={styles.helpText}>Précisez le type pour une meilleure visibilité</p>
                  <select
                    name="subcategory_id"
                    value={formData.subcategory_id}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="">-- Sélectionnez si applicable --</option>
                    {subcategories.map(subcat => (
                      <option key={subcat.id} value={subcat.id}>
                        {subcat.icon} {getCategoryName(subcat, language)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formData.offer_type === 'offre' && formData.category_id && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    {getCategoryType() === 'employment' ? 'Type d\'annonce *' :
                     getCategoryType() === 'service' ? 'Type de service *' :
                     'Comment souhaitez-vous le proposer ? *'}
                  </h2>
                  <p className={styles.helpText}>
                    {getCategoryType() === 'employment' ? 'Vous proposez un poste' :
                     getCategoryType() === 'service' ? 'Vous proposez vos services' :
                     'Choisissez le type de transaction souhaité'}
                  </p>
                  <div className={styles.listingTypeGrid}>
                    {getTransactionOptions().map(option => (
                      <label key={option.value} className={styles.checkboxCard}>
                        <input
                          type="radio"
                          name="listing_type"
                          value={option.value}
                          checked={formData.listing_type === option.value}
                          onChange={handleChange}
                        />
                        <div className={styles.radioCardContent}>
                          <strong>{option.label}</strong>
                          <span>{option.description}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {formData.offer_type === 'demande' && formData.category_id && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    {getCategoryType() === 'employment' ? 'Type de recherche *' :
                     getCategoryType() === 'service' ? 'Type de demande *' :
                     'Que recherchez-vous ? *'}
                  </h2>
                  <p className={styles.helpText}>
                    {getCategoryType() === 'employment' ? 'Vous cherchez un emploi' :
                     getCategoryType() === 'service' ? 'Vous cherchez un prestataire' :
                     'Précisez ce que vous souhaitez trouver'}
                  </p>
                  <div className={styles.listingTypeGrid}>
                    {getTransactionOptions().map(option => (
                      <label key={option.value} className={styles.checkboxCard}>
                        <input
                          type="radio"
                          name="listing_type"
                          value={option.value}
                          checked={formData.listing_type === option.value}
                          onChange={handleChange}
                        />
                        <div className={styles.radioCardContent}>
                          <strong>{option.label}</strong>
                          <span>{option.description}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.stepButtons}>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceedFromStep1()}
                  className={styles.nextBtn}
                >
                  Suivant →
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className={styles.stepContent}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Décrivez votre annonce</h2>
                <div className={styles.formGroup}>
                  <label>Quel est le titre de votre annonce ? *</label>
                  <p className={styles.helpText}>Un titre clair et précis attire plus d'acheteurs</p>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Ex: iPhone 15 Pro Max 256Go Noir Neuf, Appartement F3 Centre Ville..."
                    className={styles.input}
                    maxLength="100"
                  />
                  <small className={styles.charCount}>{formData.title.length}/100 caractères</small>
                </div>

                <div className={styles.formGroup}>
                  <label>Décrivez en détail *</label>
                  <p className={styles.helpText}>Décrivez l'état, les caractéristiques, la raison de la vente...</p>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Smartphone en excellent état, acheté il y a 3 mois, encore sous garantie. Vendu avec tous les accessoires d'origine (chargeur, écouteurs, boîte). Aucune rayure ni défaut..."
                    rows="6"
                    className={styles.textarea}
                    maxLength="2000"
                  />
                  <small className={styles.charCount}>{formData.description.length}/2000 caractères</small>
                </div>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>📍 Où se trouve votre article ?</h2>
                <p className={styles.helpText}>Indiquez la localisation pour que les acheteurs puissent vous trouver facilement</p>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Wilaya (Région) *</label>
                    <select
                      name="wilaya"
                      value={formData.wilaya}
                      onChange={handleChange}
                      required
                      className={styles.select}
                    >
                      <option value="">-- Choisissez votre wilaya --</option>
                      {wilayas.map(w => (
                        <option key={w.code} value={w.name}>
                          {w.code} - {w.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {communes.length > 0 && (
                    <div className={styles.formGroup}>
                      <label>Commune (Ville) *</label>
                      <select
                        name="commune"
                        value={formData.commune}
                        onChange={handleChange}
                        required
                        className={styles.select}
                      >
                        <option value="">-- Choisissez votre commune --</option>
                        {communes.map(commune => (
                          <option key={commune.id} value={commune.id}>
                            {getCommuneName(commune, language)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.stepButtons}>
                <button type="button" onClick={prevStep} className={styles.prevBtn}>
                  ← Précédent
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceedFromStep2()}
                  className={styles.nextBtn}
                >
                  Suivant →
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className={styles.stepContent}>
              <div className={styles.section}>
                {!isVacationRental() && (
                  <>
                    <h2 className={styles.sectionTitle}>
                      {getCategoryType() === 'employment' ? '💼 Salaire proposé' :
                       getCategoryType() === 'service' ? '💰 Tarif du service' :
                       '💰 Quel est le prix ?'}
                    </h2>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>
                          {getCategoryType() === 'employment' ? 'Salaire (en Dinars)' :
                           getCategoryType() === 'service' ? 'Tarif (en Dinars)' :
                           'Prix demandé (en Dinars)'} *
                        </label>
                        <p className={styles.helpText}>
                          {getCategoryType() === 'employment' ? 'Indiquez le salaire mensuel proposé' :
                           getCategoryType() === 'service' ? 'Indiquez votre tarif (horaire, journalier ou forfait)' :
                           'Indiquez un prix réaliste pour attirer les acheteurs'}
                        </p>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          required
                          min="0"
                          placeholder={getCategoryType() === 'employment' ? 'Ex: 40000' :
                                       getCategoryType() === 'service' ? 'Ex: 5000' :
                                       'Ex: 50000'}
                          className={styles.input}
                        />
                        {formData.price && (
                          <small className={styles.pricePreview}>
                            {parseInt(formData.price).toLocaleString('fr-DZ')} DA
                            {getCategoryType() === 'employment' && '/mois'}
                          </small>
                        )}
                      </div>

                      {getCategoryType() !== 'employment' && getCategoryType() !== 'service' && (
                        <div className={styles.formGroup}>
                          <label>Dans quel état est l'article ?</label>
                          <select
                            name="condition"
                            value={formData.condition}
                            onChange={handleChange}
                            className={styles.select}
                          >
                            <option value="new">✨ Neuf (jamais utilisé)</option>
                            <option value="like_new">🌟 Comme neuf (très peu utilisé)</option>
                            <option value="good">✅ Bon état (utilisé, fonctionnel)</option>
                            <option value="fair">🔨 État correct (signes d'usure)</option>
                            <option value="poor">🔧 Usagé (nécessite réparations)</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          name="negotiable"
                          checked={formData.negotiable}
                          onChange={handleChange}
                        />
                        <span>
                          {getCategoryType() === 'employment' ? '💼 Salaire négociable' :
                           getCategoryType() === 'service' ? '🤝 Tarif négociable' :
                           '🤝 Le prix est négociable (recommandé)'}
                        </span>
                      </label>
                    </div>
                  </>
                )}

                {/* ═══════════════════════════════════════════════════════════════
                    🆕 SECTION PROMOTIONS
                    ─────────────────────────────────────────────────────────────
                    Relations BDD: listings.promotion_active, promotion_discount, promotion_end_date
                    Affichage futur: Home.jsx (section promos), ListingCard (badge)
                    ═══════════════════════════════════════════════════════════ */}
                <div className={styles.promotionSection}>
                  <h3>🎁 Ajouter une promotion (optionnel)</h3>
                  <p className={styles.helpText}>Attirez plus d'acheteurs avec une réduction temporaire</p>

                  <div className={styles.formGroup}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="promotion_active"
                        checked={formData.promotion_active}
                        onChange={handleChange}
                      />
                      <span>Activer une promotion sur cette annonce</span>
                    </label>
                  </div>

                  {formData.promotion_active && (
                    <>
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label>Pourcentage de réduction *</label>
                          <input
                            type="number"
                            name="promotion_discount"
                            value={formData.promotion_discount}
                            onChange={handleChange}
                            placeholder="Ex: 15 pour -15%"
                            min="0"
                            max="100"
                            step="0.01"
                            className={styles.input}
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
                            className={styles.input}
                          />
                          <small>Laissez vide pour une promotion permanente</small>
                        </div>
                      </div>

                      {formData.price && formData.promotion_discount && (
                        <div className={styles.pricePreview} style={{marginTop: '16px', padding: '16px', background: 'var(--bg-card)', borderRadius: '8px'}}>
                          <p style={{margin: '0 0 8px 0', color: 'var(--text-secondary)'}}>
                            Prix original: <span style={{textDecoration: 'line-through'}}>{parseFloat(formData.price).toLocaleString()} DA</span>
                          </p>
                          <p style={{margin: 0, color: 'var(--primary)', fontWeight: 'bold', fontSize: '20px'}}>
                            Prix promo: {(parseFloat(formData.price) * (1 - parseFloat(formData.promotion_discount) / 100)).toLocaleString()} DA
                            <span style={{marginLeft: '10px', color: '#28a745', fontSize: '16px'}}>(-{formData.promotion_discount}%)</span>
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {getCategoryType() === 'real_estate' && (
                  <div className={styles.dynamicFields}>
                    <h3>🏠 Caractéristiques du bien immobilier</h3>
                    <p className={styles.helpText}>Renseignez ces informations pour une annonce complète</p>

                    <div className={styles.formGroup}>
                      <label>Type de bien *</label>
                      <select
                        name="property_type"
                        value={formData.property_type || ''}
                        onChange={handleChange}
                        className={styles.select}
                      >
                        <option value="">Sélectionner...</option>
                        <option value="appartement">Appartement</option>
                        <option value="maison">Maison</option>
                        <option value="studio">Studio</option>
                        <option value="villa">Villa</option>
                        <option value="local_commercial">Local commercial</option>
                        <option value="bureau">Bureau</option>
                        <option value="terrain">Terrain</option>
                      </select>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Chambres * (0 pour Studio)</label>
                        <input
                          type="number"
                          name="bedrooms"
                          value={formData.bedrooms}
                          onChange={handleChange}
                          min="0"
                          max="20"
                          placeholder="Ex: 3"
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Salles de bain *</label>
                        <input
                          type="number"
                          name="bathrooms"
                          value={formData.bathrooms}
                          onChange={handleChange}
                          min="1"
                          max="10"
                          placeholder="Ex: 2"
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Surface * (m²)</label>
                        <input
                          type="number"
                          name="surface"
                          value={formData.surface}
                          onChange={handleChange}
                          min="10"
                          max="10000"
                          placeholder="Ex: 120"
                          className={styles.input}
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Étage</label>
                        <select
                          name="floor"
                          value={formData.floor || ''}
                          onChange={handleChange}
                          className={styles.select}
                        >
                          <option value="">Sélectionner...</option>
                          <option value="rdc">Rez-de-chaussée</option>
                          <option value="1er">1er étage</option>
                          <option value="2eme">2ème étage</option>
                          <option value="3eme">3ème étage</option>
                          <option value="4_et_plus">4ème étage et +</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>État du bien *</label>
                        <select
                          name="property_condition"
                          value={formData.property_condition || ''}
                          onChange={handleChange}
                          className={styles.select}
                        >
                          <option value="">Sélectionner...</option>
                          <option value="neuf">Neuf</option>
                          <option value="bon_etat">Bon état</option>
                          <option value="a_renover">À rénover</option>
                        </select>
                      </div>
                    </div>

                    {isRentalCategory && (
                      <>
                        <div className={styles.formGroup}>
                          <label>Type de location *</label>
                          <select
                            name="rental_type"
                            value={formData.rental_type || ''}
                            onChange={handleChange}
                            className={styles.select}
                          >
                            <option value="">Sélectionner...</option>
                            <option value="longue_duree">Longue durée (&gt;6 mois)</option>
                            <option value="courte_duree">Courte durée (&lt;6 mois)</option>
                            <option value="saisonniere">Saisonnière</option>
                          </select>
                        </div>

                        <div className={styles.formGroup}>
                          <label>Meublé *</label>
                          <select
                            name="furnished"
                            value={formData.furnished || ''}
                            onChange={handleChange}
                            className={styles.select}
                          >
                            <option value="">Sélectionner...</option>
                            <option value="meuble">Meublé</option>
                            <option value="semi_meuble">Semi-meublé</option>
                            <option value="non_meuble">Non meublé</option>
                          </select>
                        </div>

                        <div className={styles.formGroup}>
                          <h4 style={{marginBottom: '12px'}}>Équipements</h4>
                          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px'}}>
                            {[
                              {id: 'climatisation', label: '❄️ Climatisation'},
                              {id: 'chauffage_central', label: '🔥 Chauffage central'},
                              {id: 'garage_parking', label: '🚗 Garage / Parking'},
                              {id: 'jardin', label: '🌳 Jardin'},
                              {id: 'ascenseur', label: '🛗 Ascenseur'},
                              {id: 'piscine', label: '🏊 Piscine'},
                              {id: 'balcon', label: '🪴 Balcon'},
                              {id: 'cave', label: '📦 Cave'},
                              {id: 'interphone', label: '📞 Interphone'},
                              {id: 'gardiennage_securite', label: '👮 Gardiennage / Sécurité'},
                              {id: 'cuisine_equipee', label: '🍳 Cuisine équipée'},
                              {id: 'internet_wifi', label: '📶 Internet / WiFi'}
                            ].map(amenity => (
                              <label key={amenity.id} style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', border: '1px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer'}}>
                                <input
                                  type="checkbox"
                                  checked={(formData.amenities || []).includes(amenity.id)}
                                  onChange={(e) => {
                                    const amenities = formData.amenities || [];
                                    setFormData(prev => ({
                                      ...prev,
                                      amenities: e.target.checked
                                        ? [...amenities, amenity.id]
                                        : amenities.filter(a => a !== amenity.id)
                                    }));
                                  }}
                                />
                                <span>{amenity.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className={styles.formGroup}>
                          <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <input
                              type="checkbox"
                              name="charges_included"
                              checked={formData.charges_included || false}
                              onChange={handleChange}
                            />
                            <span>Charges incluses</span>
                          </label>
                        </div>

                        {!formData.charges_included && (
                          <div className={styles.formGroup}>
                            <label>Montant des charges (DA/mois)</label>
                            <input
                              type="number"
                              name="charges_amount"
                              value={formData.charges_amount || ''}
                              onChange={handleChange}
                              min="0"
                              placeholder="Ex: 5000"
                              className={styles.input}
                            />
                          </div>
                        )}

                        <div className={styles.formGroup}>
                          <label>Caution demandée *</label>
                          <div style={{display: 'flex', gap: '16px'}}>
                            <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                              <input
                                type="radio"
                                name="deposit_required"
                                checked={formData.deposit_required === true}
                                onChange={() => setFormData(prev => ({...prev, deposit_required: true}))}
                              />
                              <span>Oui</span>
                            </label>
                            <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                              <input
                                type="radio"
                                name="deposit_required"
                                checked={formData.deposit_required === false}
                                onChange={() => setFormData(prev => ({...prev, deposit_required: false}))}
                              />
                              <span>Non</span>
                            </label>
                          </div>
                        </div>

                        {formData.deposit_required && (
                          <div className={styles.formGroup}>
                            <label>Montant de la caution * (DA)</label>
                            <input
                              type="number"
                              name="deposit_amount"
                              value={formData.deposit_amount || ''}
                              onChange={handleChange}
                              min="0"
                              placeholder="Ex: 50000"
                              className={styles.input}
                            />
                          </div>
                        )}

                        <div className={styles.formGroup}>
                          <label>Date de disponibilité *</label>
                          <input
                            type="date"
                            name="available_from"
                            value={formData.available_from || ''}
                            onChange={handleChange}
                            min={new Date().toISOString().split('T')[0]}
                            className={styles.input}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label>Durée minimum de location</label>
                          <select
                            name="minimum_rental_duration"
                            value={formData.minimum_rental_duration || ''}
                            onChange={handleChange}
                            className={styles.select}
                          >
                            <option value="">Aucune contrainte</option>
                            <option value="1_mois">1 mois</option>
                            <option value="3_mois">3 mois</option>
                            <option value="6_mois">6 mois</option>
                            <option value="1_an">1 an</option>
                            <option value="2_ans">2 ans</option>
                          </select>
                        </div>

                        <div className={styles.formGroup}>
                          <label>Horaires de visite préférés</label>
                          <textarea
                            name="visit_hours"
                            value={formData.visit_hours || ''}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Ex: Disponible du lundi au vendredi de 14h à 18h"
                            className={styles.textarea}
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}

                {getCategoryType() === 'vehicle' && (
                  <div className={styles.dynamicFields}>
                    <h3>🚗 Informations sur le véhicule</h3>
                    <p className={styles.helpText}>Ces détails aident les acheteurs à mieux connaître votre véhicule</p>

                    <div className={styles.formGroup}>
                      <label>Type de véhicule *</label>
                      <select
                        name="vehicle_type"
                        value={formData.vehicle_type || ''}
                        onChange={handleChange}
                        className={styles.select}
                      >
                        <option value="">Sélectionner...</option>
                        <option value="voiture">Voiture</option>
                        <option value="moto">Moto</option>
                        <option value="camion">Camion</option>
                        <option value="bus">Bus</option>
                        <option value="quad">Quad</option>
                        <option value="tracteur">Tracteur</option>
                        <option value="autre">Autre</option>
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
                        <label>Année *</label>
                        <input
                          type="number"
                          name="year"
                          value={formData.year}
                          onChange={handleChange}
                          min="1900"
                          max={new Date().getFullYear() + 1}
                          placeholder="Ex: 2020"
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Kilométrage *</label>
                        <input
                          type="number"
                          name="mileage"
                          value={formData.mileage}
                          onChange={handleChange}
                          min="0"
                          placeholder="Ex: 50000"
                          className={styles.input}
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Type de carburant *</label>
                        <select
                          name="fuel_type"
                          value={formData.fuel_type || ''}
                          onChange={handleChange}
                          className={styles.select}
                        >
                          <option value="">Sélectionner...</option>
                          <option value="essence">Essence</option>
                          <option value="diesel">Diesel</option>
                          <option value="gpl">GPL</option>
                          <option value="electrique">Électrique</option>
                          <option value="hybride">Hybride</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Transmission *</label>
                        <select
                          name="transmission"
                          value={formData.transmission || ''}
                          onChange={handleChange}
                          className={styles.select}
                        >
                          <option value="">Sélectionner...</option>
                          <option value="manuelle">Manuelle</option>
                          <option value="automatique">Automatique</option>
                          <option value="semi_automatique">Semi-automatique</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Couleur</label>
                        <select
                          name="color"
                          value={formData.color || ''}
                          onChange={handleChange}
                          className={styles.select}
                        >
                          <option value="">Sélectionner...</option>
                          <option value="noir">Noir</option>
                          <option value="blanc">Blanc</option>
                          <option value="gris">Gris</option>
                          <option value="argent">Argent</option>
                          <option value="bleu">Bleu</option>
                          <option value="rouge">Rouge</option>
                          <option value="vert">Vert</option>
                          <option value="jaune">Jaune</option>
                          <option value="marron">Marron</option>
                          <option value="orange">Orange</option>
                          <option value="autre">Autre</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Nombre de portes</label>
                        <select
                          name="doors"
                          value={formData.doors || ''}
                          onChange={handleChange}
                          className={styles.select}
                        >
                          <option value="">Sélectionner...</option>
                          <option value="2">2 portes</option>
                          <option value="3">3 portes</option>
                          <option value="4">4 portes</option>
                          <option value="5">5 portes</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Cylindrée (cm³)</label>
                        <input
                          type="number"
                          name="engine_capacity"
                          value={formData.engine_capacity || ''}
                          onChange={handleChange}
                          min="0"
                          placeholder="Ex: 1600"
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Puissance (CV)</label>
                        <input
                          type="number"
                          name="horsepower"
                          value={formData.horsepower || ''}
                          onChange={handleChange}
                          min="0"
                          placeholder="Ex: 120"
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Nombre de places</label>
                        <input
                          type="number"
                          name="seats"
                          value={formData.seats || ''}
                          onChange={handleChange}
                          min="1"
                          max="50"
                          placeholder="Ex: 5"
                          className={styles.input}
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <h4 style={{marginBottom: '12px'}}>Équipements et options</h4>
                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px'}}>
                        {[
                          {id: 'climatisation', label: '❄️ Climatisation'},
                          {id: 'abs', label: '🛡️ ABS'},
                          {id: 'airbags', label: '💨 Airbags'},
                          {id: 'gps', label: '🗺️ GPS / Navigation'},
                          {id: 'camera_recul', label: '📹 Caméra de recul'},
                          {id: 'capteurs_parking', label: '📡 Capteurs de parking'},
                          {id: 'regulateur_vitesse', label: '🎚️ Régulateur de vitesse'},
                          {id: 'siege_chauffant', label: '🔥 Sièges chauffants'},
                          {id: 'toit_ouvrant', label: '☀️ Toit ouvrant'},
                          {id: 'jantes_alu', label: '⭕ Jantes en aluminium'},
                          {id: 'bluetooth', label: '📱 Bluetooth'},
                          {id: 'usb', label: '🔌 Prise USB'}
                        ].map(feature => (
                          <label key={feature.id} style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', border: '1px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer'}}>
                            <input
                              type="checkbox"
                              checked={(formData.features || []).includes(feature.id)}
                              onChange={(e) => {
                                const features = formData.features || [];
                                setFormData(prev => ({
                                  ...prev,
                                  features: e.target.checked
                                    ? [...features, feature.id]
                                    : features.filter(f => f !== feature.id)
                                }));
                              }}
                            />
                            <span>{feature.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {getCategoryType() === 'employment' && (
                  <div className={styles.dynamicFields}>
                    <h3>💼 Détails du poste / profil</h3>
                    <p className={styles.helpText}>Informations complètes sur l'emploi</p>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Secteur d'activité *</label>
                        <select name="job_sector" value={formData.job_sector || ''} onChange={handleChange} className={styles.select}>
                          <option value="">Sélectionner...</option>
                          <option value="informatique">Informatique/Tech</option>
                          <option value="commerce">Commerce/Vente</option>
                          <option value="ingenierie">Ingénierie</option>
                          <option value="sante">Santé</option>
                          <option value="education">Éducation</option>
                          <option value="finance">Finance/Comptabilité</option>
                          <option value="hotellerie">Hôtellerie/Restauration</option>
                          <option value="btp">BTP/Construction</option>
                          <option value="marketing">Marketing/Communication</option>
                          <option value="rh">Ressources Humaines</option>
                          <option value="juridique">Juridique</option>
                          <option value="transport">Transport/Logistique</option>
                          <option value="agriculture">Agriculture</option>
                          <option value="autre">Autre</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Type de contrat *</label>
                        <select name="contract_type" value={formData.contract_type || ''} onChange={handleChange} className={styles.select}>
                          <option value="">Sélectionner...</option>
                          <option value="cdi">CDI</option>
                          <option value="cdd">CDD</option>
                          <option value="freelance">Freelance</option>
                          <option value="stage">Stage</option>
                          <option value="interim">Intérim/Temporaire</option>
                          <option value="saisonnier">Saisonnier</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Niveau d'expérience *</label>
                        <select name="experience_level" value={formData.experience_level || ''} onChange={handleChange} className={styles.select}>
                          <option value="">Sélectionner...</option>
                          <option value="debutant">Débutant (0-2 ans)</option>
                          <option value="intermediaire">Intermédiaire (2-5 ans)</option>
                          <option value="confirme">Confirmé (5-10 ans)</option>
                          <option value="expert">Expert (10+ ans)</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Niveau d'études *</label>
                        <select name="education_level" value={formData.education_level || ''} onChange={handleChange} className={styles.select}>
                          <option value="">Sélectionner...</option>
                          <option value="sans_diplome">Sans diplôme</option>
                          <option value="bac">Bac</option>
                          <option value="bac_2_3">Bac+2/3</option>
                          <option value="bac_4_5">Bac+4/5</option>
                          <option value="doctorat">Doctorat</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Temps de travail *</label>
                        <select name="work_schedule" value={formData.work_schedule || ''} onChange={handleChange} className={styles.select}>
                          <option value="">Sélectionner...</option>
                          <option value="temps_plein">Temps plein</option>
                          <option value="temps_partiel">Temps partiel</option>
                          <option value="flexible">Flexible</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Télétravail *</label>
                        <select name="remote_work" value={formData.remote_work || ''} onChange={handleChange} className={styles.select}>
                          <option value="">Sélectionner...</option>
                          <option value="100_teletravail">100% télétravail</option>
                          <option value="hybride">Hybride (partiel)</option>
                          <option value="sur_site">Sur site uniquement</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Salaire *</label>
                      <div style={{display: 'flex', gap: '16px', marginBottom: '12px'}}>
                        <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                          <input type="radio" name="salary_type" value="fixed" checked={formData.salary_type === 'fixed'} onChange={handleChange} />
                          <span>Montant fixe</span>
                        </label>
                        <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                          <input type="radio" name="salary_type" value="range" checked={formData.salary_type === 'range'} onChange={handleChange} />
                          <span>Fourchette</span>
                        </label>
                        <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                          <input type="radio" name="salary_type" value="negotiable" checked={formData.salary_type === 'negotiable'} onChange={handleChange} />
                          <span>À négocier</span>
                        </label>
                      </div>
                      {formData.salary_type === 'fixed' && (
                        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Ex: 40000 DA/mois" className={styles.input} />
                      )}
                      {formData.salary_type === 'range' && (
                        <div style={{display: 'flex', gap: '12px'}}>
                          <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Min: 35000" className={styles.input} />
                          <input type="number" name="salary_max" value={formData.salary_max || ''} onChange={handleChange} placeholder="Max: 50000" className={styles.input} />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {getCategoryType() === 'service' && (
                  <div className={styles.dynamicFields}>
                    <h3>🔧 Détails du service</h3>
                    <p className={styles.helpText}>Précisez les modalités complètes de votre service</p>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Type de service *</label>
                        <select name="service_type" value={formData.service_type || ''} onChange={handleChange} className={styles.select}>
                          <option value="">Sélectionner...</option>
                          <option value="plomberie">Plomberie</option>
                          <option value="electricite">Électricité</option>
                          <option value="climatisation">Climatisation</option>
                          <option value="menuiserie">Menuiserie</option>
                          <option value="peinture">Peinture</option>
                          <option value="jardinage">Jardinage</option>
                          <option value="nettoyage">Nettoyage</option>
                          <option value="demenagement">Déménagement</option>
                          <option value="reparation_electronique">Réparation électronique</option>
                          <option value="cours_particuliers">Cours particuliers</option>
                          <option value="informatique">Informatique/Développement web</option>
                          <option value="photographie">Photographie/Vidéo</option>
                          <option value="design_graphique">Design graphique</option>
                          <option value="traduction">Traduction</option>
                          <option value="comptabilite">Comptabilité</option>
                          <option value="juridique">Juridique</option>
                          <option value="autre">Autre</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Disponibilité *</label>
                        <select name="service_availability" value={formData.service_availability || ''} onChange={handleChange} className={styles.select}>
                          <option value="">Sélectionner...</option>
                          <option value="immediate">Immédiate</option>
                          <option value="sous_24h">Sous 24h</option>
                          <option value="sous_48h">Sous 48h</option>
                          <option value="a_planifier">À planifier</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Déplacement *</label>
                        <select name="service_location" value={formData.service_location || ''} onChange={handleChange} className={styles.select}>
                          <option value="">Sélectionner...</option>
                          <option value="domicile">À domicile uniquement</option>
                          <option value="local">Dans mon local uniquement</option>
                          <option value="les_deux">Les deux</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Années d'expérience *</label>
                        <select name="service_experience_years" value={formData.service_experience_years || ''} onChange={handleChange} className={styles.select}>
                          <option value="">Sélectionner...</option>
                          <option value="debutant">Débutant (&lt;1 an)</option>
                          <option value="intermediaire">Intermédiaire (1-5 ans)</option>
                          <option value="expert">Expert (5+ ans)</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Mode de tarification *</label>
                      <select name="pricing_mode" value={formData.pricing_mode || ''} onChange={handleChange} className={styles.select}>
                        <option value="">Sélectionner...</option>
                        <option value="heure">À l'heure</option>
                        <option value="journee">À la journée</option>
                        <option value="forfait">Au forfait</option>
                        <option value="devis">Sur devis</option>
                      </select>
                    </div>

                    {formData.pricing_mode && formData.pricing_mode !== 'devis' && (
                      <div className={styles.formGroup}>
                        <label>Tarif indicatif (DA)</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder={
                          formData.pricing_mode === 'heure' ? 'Ex: 2000 DA/heure' :
                          formData.pricing_mode === 'journee' ? 'Ex: 15000 DA/jour' :
                          'Ex: 50000 DA'
                        } className={styles.input} />
                      </div>
                    )}

                    <div className={styles.formRow}>
                      <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <input type="checkbox" name="pricing_negotiable" checked={formData.pricing_negotiable} onChange={handleChange} />
                        <span>Tarif négociable</span>
                      </label>
                      <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <input type="checkbox" name="free_quote" checked={formData.free_quote} onChange={handleChange} />
                        <span>Devis gratuit</span>
                      </label>
                    </div>
                  </div>
                )}

                {getCategoryType() === 'books_media' && (
                  <div className={styles.dynamicFields}>
                    <h3>📚 Détails Livres & Multimédia</h3>
                    <p className={styles.helpText}>Renseignez les informations spécifiques à votre article</p>

                    {getMediaSubcategoryType() === 'books' && (
                      <>
                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label>Genre *</label>
                            <select name="book_genre" value={formData.book_genre || ''} onChange={handleChange} className={styles.select}>
                              <option value="">Sélectionner...</option>
                              <option value="roman">Roman</option>
                              <option value="sf_fantasy">Science-fiction/Fantasy</option>
                              <option value="policier_thriller">Policier/Thriller</option>
                              <option value="romance">Romance</option>
                              <option value="jeunesse">Jeunesse</option>
                              <option value="classique">Littérature classique</option>
                              <option value="biographie">Biographie</option>
                              <option value="histoire">Histoire</option>
                              <option value="sciences">Sciences</option>
                              <option value="religion">Religion/Spiritualité</option>
                              <option value="developpement_personnel">Développement personnel</option>
                              <option value="cuisine">Cuisine</option>
                              <option value="art">Art</option>
                              <option value="scolaire">Scolaire/Universitaire</option>
                              <option value="dictionnaire">Dictionnaire/Encyclopédie</option>
                              <option value="autre">Autre</option>
                            </select>
                          </div>
                          <div className={styles.formGroup}>
                            <label>Langue *</label>
                            <select name="book_language" value={formData.book_language || ''} onChange={handleChange} className={styles.select}>
                              <option value="">Sélectionner...</option>
                              <option value="francais">Français</option>
                              <option value="arabe">Arabe</option>
                              <option value="anglais">Anglais</option>
                              <option value="autre">Autre</option>
                            </select>
                          </div>
                        </div>

                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label>Auteur</label>
                            <input type="text" name="book_author" value={formData.book_author} onChange={handleChange} placeholder="Nom de l'auteur" className={styles.input} />
                          </div>
                          <div className={styles.formGroup}>
                            <label>Éditeur</label>
                            <input type="text" name="book_publisher" value={formData.book_publisher} onChange={handleChange} placeholder="Maison d'édition" className={styles.input} />
                          </div>
                        </div>

                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label>ISBN</label>
                            <input type="text" name="book_isbn" value={formData.book_isbn} onChange={handleChange} placeholder="978-X-XXXX-XXXX-X" className={styles.input} />
                          </div>
                          <div className={styles.formGroup}>
                            <label>Année d'édition</label>
                            <input type="number" name="book_publication_year" value={formData.book_publication_year} onChange={handleChange} min="1900" max={new Date().getFullYear()} placeholder="Ex: 2020" className={styles.input} />
                          </div>
                        </div>

                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label>Nombre de pages</label>
                            <input type="number" name="book_pages" value={formData.book_pages} onChange={handleChange} min="1" placeholder="Ex: 350" className={styles.input} />
                          </div>
                          <div className={styles.formGroup}>
                            <label>Format</label>
                            <select name="book_format" value={formData.book_format || ''} onChange={handleChange} className={styles.select}>
                              <option value="">Sélectionner...</option>
                              <option value="broche_poche">Broché/Poche</option>
                              <option value="relie">Relié/Couverture rigide</option>
                              <option value="grand_format">Grand format</option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}

                    {getMediaSubcategoryType() === 'comics' && (
                      <>
                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label>Titre de la série</label>
                            <input type="text" name="comic_series_title" value={formData.comic_series_title} onChange={handleChange} placeholder="Ex: One Piece" className={styles.input} />
                          </div>
                          <div className={styles.formGroup}>
                            <label>Tome/Numéro</label>
                            <input type="number" name="comic_issue_number" value={formData.comic_issue_number} onChange={handleChange} min="1" placeholder="Ex: 5" className={styles.input} />
                          </div>
                        </div>

                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label>Langue *</label>
                            <select name="comic_language" value={formData.comic_language || ''} onChange={handleChange} className={styles.select}>
                              <option value="">Sélectionner...</option>
                              <option value="francais">Français</option>
                              <option value="arabe">Arabe</option>
                              <option value="anglais">Anglais</option>
                              <option value="japonais">Japonais</option>
                              <option value="autre">Autre</option>
                            </select>
                          </div>
                          <div className={styles.formGroup}>
                            <label>Éditeur</label>
                            <input type="text" name="comic_publisher" value={formData.comic_publisher} onChange={handleChange} placeholder="Ex: Glénat" className={styles.input} />
                          </div>
                        </div>
                      </>
                    )}

                    {getMediaSubcategoryType() === 'dvd' && (
                      <>
                        <div className={styles.formGroup}>
                          <label>Type *</label>
                          <div className={styles.radioGroup}>
                            <label><input type="radio" name="media_type" value="film" checked={formData.media_type === 'film'} onChange={handleChange} /> Film</label>
                            <label><input type="radio" name="media_type" value="serie_tv" checked={formData.media_type === 'serie_tv'} onChange={handleChange} /> Série TV</label>
                            <label><input type="radio" name="media_type" value="documentaire" checked={formData.media_type === 'documentaire'} onChange={handleChange} /> Documentaire</label>
                            <label><input type="radio" name="media_type" value="autre" checked={formData.media_type === 'autre'} onChange={handleChange} /> Autre</label>
                          </div>
                        </div>

                        <div className={styles.formGroup}>
                          <label>Langues audio disponibles</label>
                          <div className={styles.checkboxGroup}>
                            <label><input type="checkbox" value="francais" checked={formData.media_audio_languages.includes('francais')} onChange={(e) => handleArrayCheckboxChange(e, 'media_audio_languages')} /> Français</label>
                            <label><input type="checkbox" value="arabe" checked={formData.media_audio_languages.includes('arabe')} onChange={(e) => handleArrayCheckboxChange(e, 'media_audio_languages')} /> Arabe</label>
                            <label><input type="checkbox" value="anglais" checked={formData.media_audio_languages.includes('anglais')} onChange={(e) => handleArrayCheckboxChange(e, 'media_audio_languages')} /> Anglais</label>
                            <label><input type="checkbox" value="autre" checked={formData.media_audio_languages.includes('autre')} onChange={(e) => handleArrayCheckboxChange(e, 'media_audio_languages')} /> Autre</label>
                          </div>
                        </div>

                        <div className={styles.formGroup}>
                          <label>Sous-titres disponibles</label>
                          <div className={styles.checkboxGroup}>
                            <label><input type="checkbox" value="francais" checked={formData.media_subtitles.includes('francais')} onChange={(e) => handleArrayCheckboxChange(e, 'media_subtitles')} /> Français</label>
                            <label><input type="checkbox" value="arabe" checked={formData.media_subtitles.includes('arabe')} onChange={(e) => handleArrayCheckboxChange(e, 'media_subtitles')} /> Arabe</label>
                            <label><input type="checkbox" value="anglais" checked={formData.media_subtitles.includes('anglais')} onChange={(e) => handleArrayCheckboxChange(e, 'media_subtitles')} /> Anglais</label>
                            <label><input type="checkbox" value="autre" checked={formData.media_subtitles.includes('autre')} onChange={(e) => handleArrayCheckboxChange(e, 'media_subtitles')} /> Autre</label>
                          </div>
                        </div>

                        <div className={styles.formGroup}>
                          <label>Zone DVD/Blu-ray</label>
                          <select name="media_zone" value={formData.media_zone || ''} onChange={handleChange} className={styles.select}>
                            <option value="">Sélectionner...</option>
                            <option value="zone_2">Zone 2 - Europe</option>
                            <option value="multi_zone">Multi-zone</option>
                            <option value="autre">Autre</option>
                          </select>
                        </div>
                      </>
                    )}

                    {getMediaSubcategoryType() === 'music' && (
                      <>
                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label>Type *</label>
                            <div className={styles.radioGroup}>
                              <label><input type="radio" name="music_format" value="cd" checked={formData.music_format === 'cd'} onChange={handleChange} /> CD</label>
                              <label><input type="radio" name="music_format" value="vinyle" checked={formData.music_format === 'vinyle'} onChange={handleChange} /> Vinyle</label>
                              <label><input type="radio" name="music_format" value="cassette" checked={formData.music_format === 'cassette'} onChange={handleChange} /> Cassette</label>
                            </div>
                          </div>
                          <div className={styles.formGroup}>
                            <label>Genre musical</label>
                            <select name="music_genre" value={formData.music_genre || ''} onChange={handleChange} className={styles.select}>
                              <option value="">Sélectionner...</option>
                              <option value="rai">Raï</option>
                              <option value="chaabi">Chaabi</option>
                              <option value="pop">Pop</option>
                              <option value="rock">Rock</option>
                              <option value="rap">Rap</option>
                              <option value="rnb">R&B</option>
                              <option value="classique">Classique</option>
                              <option value="jazz">Jazz</option>
                              <option value="electro">Électro</option>
                              <option value="reggae">Reggae</option>
                              <option value="autre">Autre</option>
                            </select>
                          </div>
                        </div>

                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label>Artiste</label>
                            <input type="text" name="music_artist" value={formData.music_artist} onChange={handleChange} placeholder="Nom de l'artiste" className={styles.input} />
                          </div>
                          <div className={styles.formGroup}>
                            <label>Album</label>
                            <input type="text" name="music_album" value={formData.music_album} onChange={handleChange} placeholder="Titre de l'album" className={styles.input} />
                          </div>
                        </div>
                      </>
                    )}

                    <div className={styles.formGroup} style={{marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px'}}>
                      <label style={{display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold'}}>
                        <input type="checkbox" name="exchange_only" checked={formData.exchange_only} onChange={handleChange} />
                        <span>🔄 Échange uniquement (sans vente)</span>
                      </label>
                      {formData.exchange_only && (
                        <div style={{marginTop: '15px'}}>
                          <label>Contre quoi souhaitez-vous échanger ?</label>
                          <textarea name="exchange_for" value={formData.exchange_for} onChange={handleChange} rows={3} placeholder="Décrivez ce que vous recherchez en échange..." className={styles.textarea} />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {getCategoryType() === 'electronics' && (
                  <div className={styles.dynamicFields}>
                    <h3>📱 Détails Électronique</h3>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Type d'appareil *</label>
                        <select name="device_type" value={formData.device_type || ''} onChange={handleChange} className={styles.select} required>
                          <option value="">Sélectionner...</option>
                          <option value="smartphone">Smartphone</option>
                          <option value="laptop">Ordinateur portable</option>
                          <option value="tablet">Tablette</option>
                          <option value="desktop">Ordinateur fixe</option>
                          <option value="tv">Télévision</option>
                          <option value="camera">Appareil photo</option>
                          <option value="console">Console de jeux</option>
                          <option value="speaker">Enceinte/Audio</option>
                          <option value="accessory">Accessoire</option>
                          <option value="autre">Autre</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Marque *</label>
                        <select name="brand_fashion" value={formData.brand_fashion || ''} onChange={handleChange} className={styles.select} required>
                          <option value="">Sélectionner...</option>
                          <optgroup label="📱 Smartphones">
                            <option value="Apple">Apple</option>
                            <option value="Samsung">Samsung</option>
                            <option value="Huawei">Huawei</option>
                            <option value="Xiaomi">Xiaomi</option>
                            <option value="Oppo">Oppo</option>
                            <option value="Vivo">Vivo</option>
                            <option value="OnePlus">OnePlus</option>
                            <option value="Realme">Realme</option>
                            <option value="Google">Google Pixel</option>
                            <option value="Sony">Sony</option>
                            <option value="Nokia">Nokia</option>
                            <option value="Motorola">Motorola</option>
                            <option value="LG">LG</option>
                            <option value="Tecno">Tecno</option>
                            <option value="Infinix">Infinix</option>
                            <option value="Itel">Itel</option>
                          </optgroup>
                          <optgroup label="💻 Ordinateurs">
                            <option value="HP">HP</option>
                            <option value="Dell">Dell</option>
                            <option value="Lenovo">Lenovo</option>
                            <option value="Asus">Asus</option>
                            <option value="Acer">Acer</option>
                            <option value="Apple">Apple MacBook</option>
                            <option value="MSI">MSI</option>
                            <option value="Toshiba">Toshiba</option>
                            <option value="Microsoft">Microsoft Surface</option>
                          </optgroup>
                          <optgroup label="📺 TV & Audio">
                            <option value="Samsung">Samsung</option>
                            <option value="LG">LG</option>
                            <option value="Sony">Sony</option>
                            <option value="TCL">TCL</option>
                            <option value="Hisense">Hisense</option>
                            <option value="Panasonic">Panasonic</option>
                            <option value="Philips">Philips</option>
                            <option value="Condor">Condor</option>
                            <option value="Iris">Iris</option>
                          </optgroup>
                          <optgroup label="🎮 Consoles">
                            <option value="Sony PlayStation">Sony PlayStation</option>
                            <option value="Microsoft Xbox">Microsoft Xbox</option>
                            <option value="Nintendo">Nintendo</option>
                          </optgroup>
                          <option value="autre">Autre marque</option>
                        </select>
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Modèle</label>
                        <input type="text" name="model" value={formData.model} onChange={handleChange} placeholder="Ex: iPhone 13, Galaxy S23, Redmi Note 12..." className={styles.input} />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Stockage</label>
                        <select name="storage" value={formData.storage || ''} onChange={handleChange} className={styles.select}>
                          <option value="">Sélectionner...</option>
                          <optgroup label="Smartphones/Tablets">
                            <option value="16GB">16 GB</option>
                            <option value="32GB">32 GB</option>
                            <option value="64GB">64 GB</option>
                            <option value="128GB">128 GB</option>
                            <option value="256GB">256 GB</option>
                            <option value="512GB">512 GB</option>
                            <option value="1TB">1 TB</option>
                          </optgroup>
                          <optgroup label="Ordinateurs">
                            <option value="128GB_SSD">128 GB SSD</option>
                            <option value="256GB_SSD">256 GB SSD</option>
                            <option value="512GB_SSD">512 GB SSD</option>
                            <option value="1TB_SSD">1 TB SSD</option>
                            <option value="2TB_SSD">2 TB SSD</option>
                            <option value="500GB_HDD">500 GB HDD</option>
                            <option value="1TB_HDD">1 TB HDD</option>
                            <option value="2TB_HDD">2 TB HDD</option>
                          </optgroup>
                          <option value="autre">Autre</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>RAM</label>
                        <select name="ram" value={formData.ram || ''} onChange={handleChange} className={styles.select}>
                          <option value="">Sélectionner...</option>
                          <option value="2GB">2 GB</option>
                          <option value="3GB">3 GB</option>
                          <option value="4GB">4 GB</option>
                          <option value="6GB">6 GB</option>
                          <option value="8GB">8 GB</option>
                          <option value="12GB">12 GB</option>
                          <option value="16GB">16 GB</option>
                          <option value="32GB">32 GB</option>
                          <option value="64GB">64 GB</option>
                        </select>
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Processeur</label>
                        <input type="text" name="processor" value={formData.processor} onChange={handleChange} placeholder="Ex: Intel i5, Snapdragon 888, A15 Bionic..." className={styles.input} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Taille écran</label>
                        <input type="text" name="screen_size" value={formData.screen_size} onChange={handleChange} placeholder="Ex: 6.1 pouces, 15.6 pouces, 55 pouces..." className={styles.input} />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>État de la batterie</label>
                        <select name="battery_condition" value={formData.battery_condition || ''} onChange={handleChange} className={styles.select}>
                          <option value="">Sélectionner...</option>
                          <option value="excellent">Excellent (95-100%)</option>
                          <option value="bon">Bon (80-94%)</option>
                          <option value="moyen">Moyen (60-79%)</option>
                          <option value="a_remplacer">À remplacer (&lt;60%)</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Garantie</label>
                        <input type="text" name="warranty" value={formData.warranty} onChange={handleChange} placeholder="Ex: 6 mois, 1 an..." className={styles.input} />
                      </div>
                    </div>
                  </div>
                )}

                {getCategoryType() === 'fashion' && (
                  <div className={styles.dynamicFields}>
                    <h3>👔 Détails Mode</h3>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Type d'article *</label>
                        <select name="clothing_type" value={formData.clothing_type || ''} onChange={handleChange} className={styles.select} required>
                          <option value="">Sélectionner...</option>
                          <option value="t-shirt">T-shirt</option>
                          <option value="pantalon">Pantalon</option>
                          <option value="jupe">Jupe</option>
                          <option value="robe">Robe</option>
                          <option value="veste">Veste/Manteau</option>
                          <option value="pull">Pull/Sweat</option>
                          <option value="chaussures">Chaussures</option>
                          <option value="sac">Sac</option>
                          <option value="accessoire">Accessoire</option>
                          <option value="autre">Autre</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Taille *</label>
                        <input type="text" name="size" value={formData.size} onChange={handleChange} placeholder="Ex: M, 38, 42..." className={styles.input} required />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Genre *</label>
                        <select name="gender" value={formData.gender || ''} onChange={handleChange} className={styles.select} required>
                          <option value="">Sélectionner...</option>
                          <option value="homme">Homme</option>
                          <option value="femme">Femme</option>
                          <option value="mixte">Mixte</option>
                          <option value="enfant">Enfant</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Marque</label>
                        <input type="text" name="brand_fashion" value={formData.brand_fashion} onChange={handleChange} placeholder="Ex: Zara, Adidas..." className={styles.input} />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Matière</label>
                        <input type="text" name="material" value={formData.material} onChange={handleChange} placeholder="Ex: Coton, Cuir, Laine..." className={styles.input} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Saison</label>
                        <select name="season" value={formData.season || ''} onChange={handleChange} className={styles.select}>
                          <option value="">Sélectionner...</option>
                          <option value="ete">Été</option>
                          <option value="hiver">Hiver</option>
                          <option value="mi_saison">Mi-saison</option>
                          <option value="toutes_saisons">Toutes saisons</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {getCategoryType() === 'home' && (
                  <div className={styles.dynamicFields}>
                    <h3>🏠 Détails Maison & Jardin</h3>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Type d'article *</label>
                        <select name="furniture_type" value={formData.furniture_type || ''} onChange={handleChange} className={styles.select} required>
                          <option value="">Sélectionner...</option>
                          <option value="canape">Canapé</option>
                          <option value="lit">Lit</option>
                          <option value="table">Table</option>
                          <option value="chaise">Chaise</option>
                          <option value="armoire">Armoire/Placard</option>
                          <option value="etagere">Étagère</option>
                          <option value="bureau">Bureau</option>
                          <option value="decoration">Décoration</option>
                          <option value="jardin">Article jardin</option>
                          <option value="autre">Autre</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Dimensions (L x l x h)</label>
                        <input type="text" name="dimensions" value={formData.dimensions} onChange={handleChange} placeholder="Ex: 200 x 80 x 75 cm" className={styles.input} />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Matériaux</label>
                        <input type="text" name="materials" value={formData.materials} onChange={handleChange} placeholder="Ex: Bois, Métal, Tissu..." className={styles.input} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Style</label>
                        <select name="style" value={formData.style || ''} onChange={handleChange} className={styles.select}>
                          <option value="">Sélectionner...</option>
                          <option value="moderne">Moderne</option>
                          <option value="classique">Classique</option>
                          <option value="scandinave">Scandinave</option>
                          <option value="industriel">Industriel</option>
                          <option value="rustique">Rustique</option>
                          <option value="autre">Autre</option>
                        </select>
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <input type="checkbox" name="assembly_required" checked={formData.assembly_required} onChange={handleChange} />
                        <span>Montage requis</span>
                      </label>
                    </div>
                  </div>
                )}

                {getCategoryType() === 'leisure' && (
                  <div className={styles.dynamicFields}>
                    <h3>🎮 Détails Loisirs</h3>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Type d'article *</label>
                        <select name="leisure_type" value={formData.leisure_type || ''} onChange={handleChange} className={styles.select} required>
                          <option value="">Sélectionner...</option>
                          <option value="sport">Équipement sport</option>
                          <option value="jeu">Jeu de société</option>
                          <option value="instrument">Instrument musique</option>
                          <option value="collection">Collection</option>
                          <option value="camping">Camping/Outdoor</option>
                          <option value="fitness">Fitness</option>
                          <option value="autre">Autre</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Âge recommandé</label>
                        <input type="text" name="age_recommended" value={formData.age_recommended} onChange={handleChange} placeholder="Ex: 3+, 12+, Adulte..." className={styles.input} />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Nombre de joueurs</label>
                        <input type="text" name="players_count" value={formData.players_count} onChange={handleChange} placeholder="Ex: 2-4, 1-8, Solo..." className={styles.input} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Niveau</label>
                        <select name="difficulty_level" value={formData.difficulty_level || ''} onChange={handleChange} className={styles.select}>
                          <option value="">Sélectionner...</option>
                          <option value="debutant">Débutant</option>
                          <option value="intermediaire">Intermédiaire</option>
                          <option value="avance">Avancé</option>
                          <option value="expert">Expert</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {getCategoryType() === 'animals' && (
                  <div className={styles.dynamicFields}>
                    <h3>🐾 Détails Animaux</h3>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Type d'animal *</label>
                        <select name="animal_type" value={formData.animal_type || ''} onChange={handleChange} className={styles.select} required>
                          <option value="">Sélectionner...</option>
                          <option value="chien">Chien</option>
                          <option value="chat">Chat</option>
                          <option value="oiseau">Oiseau</option>
                          <option value="poisson">Poisson</option>
                          <option value="lapin">Lapin</option>
                          <option value="hamster">Hamster/Rongeur</option>
                          <option value="accessoire">Accessoire animal</option>
                          <option value="autre">Autre</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Race</label>
                        <input type="text" name="breed" value={formData.breed} onChange={handleChange} placeholder="Ex: Berger Allemand..." className={styles.input} />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Âge</label>
                        <input type="text" name="animal_age" value={formData.animal_age} onChange={handleChange} placeholder="Ex: 2 mois, 1 an..." className={styles.input} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Sexe</label>
                        <select name="animal_gender" value={formData.animal_gender || ''} onChange={handleChange} className={styles.select}>
                          <option value="">Sélectionner...</option>
                          <option value="male">Mâle</option>
                          <option value="femelle">Femelle</option>
                        </select>
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
                        <label style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                          <input type="checkbox" name="vaccinated" checked={formData.vaccinated} onChange={handleChange} />
                          <span>✅ Vacciné</span>
                        </label>
                        <label style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                          <input type="checkbox" name="pedigree" checked={formData.pedigree} onChange={handleChange} />
                          <span>📜 Pedigree</span>
                        </label>
                        <label style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                          <input type="checkbox" name="neutered" checked={formData.neutered} onChange={handleChange} />
                          <span>🏥 Stérilisé</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {getCategoryType() === 'baby_kids' && (
                  <div className={styles.dynamicFields}>
                    <h3>👶 Détails Bébé & Enfants</h3>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Type d'article *</label>
                        <select name="baby_item_type" value={formData.baby_item_type || ''} onChange={handleChange} className={styles.select} required>
                          <option value="">Sélectionner...</option>
                          <option value="vetement">Vêtement</option>
                          <option value="jouet">Jouet</option>
                          <option value="puericulture">Puériculture</option>
                          <option value="mobilier">Mobilier bébé</option>
                          <option value="accessoire">Accessoire</option>
                          <option value="autre">Autre</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Tranche d'âge *</label>
                        <select name="age_range" value={formData.age_range || ''} onChange={handleChange} className={styles.select} required>
                          <option value="">Sélectionner...</option>
                          <option value="0-6_mois">0-6 mois</option>
                          <option value="6-12_mois">6-12 mois</option>
                          <option value="1-3_ans">1-3 ans</option>
                          <option value="3-6_ans">3-6 ans</option>
                          <option value="6-12_ans">6-12 ans</option>
                          <option value="12+">12 ans et plus</option>
                        </select>
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Genre</label>
                        <select name="child_gender" value={formData.child_gender || ''} onChange={handleChange} className={styles.select}>
                          <option value="">Sélectionner...</option>
                          <option value="garcon">Garçon</option>
                          <option value="fille">Fille</option>
                          <option value="mixte">Mixte</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Norme de sécurité</label>
                        <input type="text" name="safety_standard" value={formData.safety_standard} onChange={handleChange} placeholder="Ex: CE, NF..." className={styles.input} />
                      </div>
                    </div>
                  </div>
                )}

                {getCategoryType() === 'equipment_rental' && (
                  <div className={styles.dynamicFields}>
                    <h3>📦 Détails Location</h3>

                    {isVacationRental() && (
                      <>
                        <h4 style={{marginTop: '20px', marginBottom: '15px', color: '#2563eb'}}>🏖️ Informations Hébergement Vacances</h4>
                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label>Type d'hébergement *</label>
                            <select name="accommodation_type" value={formData.accommodation_type || ''} onChange={handleChange} className={styles.select} required>
                              <option value="">Sélectionner...</option>
                              <option value="appartement">Appartement</option>
                              <option value="villa">Villa</option>
                              <option value="maison">Maison</option>
                              <option value="bungalow">Bungalow</option>
                              <option value="chalet">Chalet</option>
                              <option value="studio">Studio</option>
                              <option value="residence">Résidence de vacances</option>
                              <option value="chambre">Chambre d'hôtes</option>
                              <option value="camping">Camping/Bungalow</option>
                              <option value="autre">Autre</option>
                            </select>
                          </div>
                          <div className={styles.formGroup}>
                            <label>Destination *</label>
                            <select name="vacation_destination" value={formData.vacation_destination || ''} onChange={handleChange} className={styles.select} required>
                              <option value="">Sélectionner...</option>
                              <option value="bord_de_mer">🏖️ Bord de mer</option>
                              <option value="montagne">⛰️ Montagne</option>
                              <option value="sahara_sud">🏜️ Sahara & Sud</option>
                              <option value="villes_patrimoine">🏛️ Villes & Patrimoine</option>
                              <option value="campagne">🌾 Campagne</option>
                            </select>
                          </div>
                        </div>
                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label>Capacité (nombre de personnes) *</label>
                            <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} min="1" max="50" placeholder="Ex: 6 personnes" className={styles.input} required />
                          </div>
                          <div className={styles.formGroup}>
                            <label>Nombre de chambres *</label>
                            <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} min="0" max="20" placeholder="Ex: 3" className={styles.input} required />
                          </div>
                        </div>
                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label>Nombre de lits</label>
                            <input type="number" name="beds" value={formData.beds} onChange={handleChange} min="0" max="50" placeholder="Ex: 4" className={styles.input} />
                          </div>
                          <div className={styles.formGroup}>
                            <label>Salles de bain</label>
                            <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} min="0" max="10" placeholder="Ex: 2" className={styles.input} />
                          </div>
                        </div>
                        <div className={styles.formGroup}>
                          <h4 style={{marginBottom: '12px'}}>🎯 Équipements & Commodités</h4>
                          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px'}}>
                            {[
                              {id: 'wifi', label: '📶 WiFi'},
                              {id: 'climatisation', label: '❄️ Climatisation'},
                              {id: 'chauffage', label: '🔥 Chauffage'},
                              {id: 'parking', label: '🅿️ Parking'},
                              {id: 'piscine', label: '🏊 Piscine'},
                              {id: 'jardin', label: '🌳 Jardin'},
                              {id: 'terrasse', label: '🪴 Terrasse/Balcon'},
                              {id: 'vue_mer', label: '🌊 Vue sur mer'},
                              {id: 'vue_montagne', label: '⛰️ Vue montagne'},
                              {id: 'cuisine_equipee', label: '🍳 Cuisine équipée'},
                              {id: 'machine_laver', label: '🧺 Machine à laver'},
                              {id: 'television', label: '📺 Télévision'},
                              {id: 'barbecue', label: '🔥 Barbecue'},
                              {id: 'plage_privee', label: '🏖️ Accès plage privée'},
                              {id: 'securite', label: '🔒 Sécurité 24h/24'},
                              {id: 'menage', label: '🧹 Ménage inclus'}
                            ].map(amenity => (
                              <label key={amenity.id} style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', border: '1px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer', background: (formData.vacation_amenities || []).includes(amenity.id) ? '#eff6ff' : 'white'}}>
                                <input
                                  type="checkbox"
                                  checked={(formData.vacation_amenities || []).includes(amenity.id)}
                                  onChange={(e) => {
                                    const current = formData.vacation_amenities || [];
                                    const updated = e.target.checked
                                      ? [...current, amenity.id]
                                      : current.filter(a => a !== amenity.id);
                                    setFormData({...formData, vacation_amenities: updated});
                                  }}
                                />
                                <span style={{fontSize: '14px'}}>{amenity.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div className={styles.formGroup}>
                          <label>Distance de la plage / point d'intérêt</label>
                          <input type="text" name="distance_to_beach" value={formData.distance_to_beach} onChange={handleChange} placeholder="Ex: 100m de la plage, 5km du centre-ville..." className={styles.input} />
                        </div>

                        <h4 style={{marginTop: '20px', marginBottom: '15px', color: '#2563eb'}}>💰 Tarifs de location</h4>
                        <div className={styles.formGroup}>
                          <label>Durée minimum de location *</label>
                          <select name="rental_duration" value={formData.rental_duration || ''} onChange={handleChange} className={styles.select} required>
                            <option value="">Sélectionner...</option>
                            <option value="jour">À la journée</option>
                            <option value="semaine">À la semaine</option>
                            <option value="mois">Au mois</option>
                          </select>
                        </div>

                        {formData.rental_duration && (
                          <>
                            <div className={styles.formRow}>
                              {formData.rental_duration === 'jour' && (
                                <div className={styles.formGroup}>
                                  <label>Tarif journalier *</label>
                                  <input type="number" name="daily_rate" value={formData.daily_rate} onChange={handleChange} min="0" placeholder="Prix/jour" className={styles.input} required />
                                </div>
                              )}
                              {formData.rental_duration === 'semaine' && (
                                <div className={styles.formGroup}>
                                  <label>Tarif hebdomadaire *</label>
                                  <input type="number" name="weekly_rate" value={formData.weekly_rate} onChange={handleChange} min="0" placeholder="Prix/semaine" className={styles.input} required />
                                </div>
                              )}
                              {formData.rental_duration === 'mois' && (
                                <div className={styles.formGroup}>
                                  <label>Tarif mensuel *</label>
                                  <input type="number" name="monthly_rate" value={formData.monthly_rate} onChange={handleChange} min="0" placeholder="Prix/mois" className={styles.input} required />
                                </div>
                              )}
                              <div className={styles.formGroup}>
                                <label>Caution demandée</label>
                                <input type="number" name="deposit_equipment" value={formData.deposit_equipment} onChange={handleChange} min="0" placeholder="Montant caution" className={styles.input} />
                              </div>
                            </div>
                          </>
                        )}

                        <h4 style={{marginTop: '20px', marginBottom: '15px', color: '#2563eb'}}>📅 Période de disponibilité</h4>
                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label>Date de début *</label>
                            <input type="date" name="availability_start" value={formData.availability_start} onChange={handleChange} min={new Date().toISOString().split('T')[0]} className={styles.input} required />
                          </div>
                          <div className={styles.formGroup}>
                            <label>Date de fin *</label>
                            <input type="date" name="availability_end" value={formData.availability_end} onChange={handleChange} min={formData.availability_start || new Date().toISOString().split('T')[0]} className={styles.input} required />
                          </div>
                        </div>
                        <div className={styles.formGroup}>
                          <label className={styles.checkboxLabel}>
                            <input
                              type="checkbox"
                              name="available_all_year"
                              checked={formData.available_all_year}
                              onChange={handleChange}
                            />
                            <span>Disponible toute l'année</span>
                          </label>
                        </div>
                      </>
                    )}

                    {isVehicleRental() && (
                      <>
                        <h4 style={{marginTop: '20px', marginBottom: '15px', color: '#2563eb'}}>🚗 Informations Véhicule</h4>
                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label>Type de véhicule *</label>
                            <select name="vehicle_type" value={formData.vehicle_type || ''} onChange={handleChange} className={styles.select} required>
                              <option value="">Sélectionner...</option>
                              <option value="voiture">Voiture</option>
                              <option value="moto">Moto/Scooter</option>
                              <option value="utilitaire">Utilitaire</option>
                              <option value="camion">Camion</option>
                              <option value="bus">Bus/Minibus</option>
                              <option value="autre">Autre</option>
                            </select>
                          </div>
                          <div className={styles.formGroup}>
                            <label>Marque</label>
                            <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="Ex: Toyota, Renault..." className={styles.input} />
                          </div>
                        </div>
                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label>Modèle</label>
                            <input type="text" name="model" value={formData.model} onChange={handleChange} placeholder="Ex: Corolla, Clio..." className={styles.input} />
                          </div>
                          <div className={styles.formGroup}>
                            <label>Année</label>
                            <input type="number" name="year" value={formData.year} onChange={handleChange} min="1970" max={new Date().getFullYear() + 1} placeholder="Ex: 2020" className={styles.input} />
                          </div>
                        </div>
                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label>Carburant</label>
                            <select name="fuel_type" value={formData.fuel_type || ''} onChange={handleChange} className={styles.select}>
                              <option value="">Sélectionner...</option>
                              <option value="essence">Essence</option>
                              <option value="diesel">Diesel</option>
                              <option value="gpl">GPL</option>
                              <option value="electrique">Électrique</option>
                              <option value="hybride">Hybride</option>
                            </select>
                          </div>
                          <div className={styles.formGroup}>
                            <label>Transmission</label>
                            <select name="transmission" value={formData.transmission || ''} onChange={handleChange} className={styles.select}>
                              <option value="">Sélectionner...</option>
                              <option value="manuelle">Manuelle</option>
                              <option value="automatique">Automatique</option>
                            </select>
                          </div>
                        </div>
                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label>Nombre de places</label>
                            <input type="number" name="seats" value={formData.seats} onChange={handleChange} min="1" max="60" placeholder="Ex: 5" className={styles.input} />
                          </div>
                          <div className={styles.formGroup}>
                            <label>Kilométrage inclus par jour</label>
                            <input type="number" name="included_km" value={formData.included_km} onChange={handleChange} min="0" placeholder="Ex: 200 km/jour" className={styles.input} />
                          </div>
                        </div>
                      </>
                    )}

                    {!isVacationRental() && (
                      <>
                        <h4 style={{marginTop: '20px', marginBottom: '15px', color: '#2563eb'}}>💰 Tarifs de location</h4>
                        <div className={styles.formGroup}>
                          <label>Durée minimum de location *</label>
                          <select name="rental_duration" value={formData.rental_duration || ''} onChange={handleChange} className={styles.select} required>
                            <option value="">Sélectionner...</option>
                            <option value="jour">À la journée</option>
                            <option value="semaine">À la semaine</option>
                            <option value="mois">Au mois</option>
                          </select>
                        </div>

                        {formData.rental_duration && (
                          <>
                            <div className={styles.formRow}>
                              {formData.rental_duration === 'jour' && (
                                <div className={styles.formGroup}>
                                  <label>Tarif journalier *</label>
                                  <input type="number" name="daily_rate" value={formData.daily_rate} onChange={handleChange} min="0" placeholder="Prix/jour" className={styles.input} required />
                                </div>
                              )}
                              {formData.rental_duration === 'semaine' && (
                                <div className={styles.formGroup}>
                                  <label>Tarif hebdomadaire *</label>
                                  <input type="number" name="weekly_rate" value={formData.weekly_rate} onChange={handleChange} min="0" placeholder="Prix/semaine" className={styles.input} required />
                                </div>
                              )}
                              {formData.rental_duration === 'mois' && (
                                <div className={styles.formGroup}>
                                  <label>Tarif mensuel *</label>
                                  <input type="number" name="monthly_rate" value={formData.monthly_rate} onChange={handleChange} min="0" placeholder="Prix/mois" className={styles.input} required />
                                </div>
                              )}
                              <div className={styles.formGroup}>
                                <label>Caution demandée</label>
                                <input type="number" name="deposit_equipment" value={formData.deposit_equipment} onChange={handleChange} min="0" placeholder="Montant caution" className={styles.input} />
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                )}

                {getCategoryType() === 'professional' && (
                  <div className={styles.dynamicFields}>
                    <h3>🏭 Détails Matériel Professionnel</h3>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Catégorie *</label>
                        <select name="equipment_category" value={formData.equipment_category || ''} onChange={handleChange} className={styles.select} required>
                          <option value="">Sélectionner...</option>
                          <option value="informatique">Informatique</option>
                          <option value="medical">Médical</option>
                          <option value="btp">BTP/Construction</option>
                          <option value="restauration">Restauration</option>
                          <option value="agricole">Agricole</option>
                          <option value="industriel">Industriel</option>
                          <option value="autre">Autre</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Certification/Normes</label>
                        <input type="text" name="certification" value={formData.certification} onChange={handleChange} placeholder="Ex: CE, ISO..." className={styles.input} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.stepButtons}>
                <button type="button" onClick={prevStep} className={styles.prevBtn}>
                  ← Précédent
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceedFromStep3()}
                  className={styles.nextBtn}
                >
                  Suivant →
                </button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className={styles.stepContent}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>📸 Photos de l'annonce</h2>
                <div className={styles.formGroup}>
                  <div className={styles.uploadZone}>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className={styles.fileInput}
                      id="image-upload"
                      disabled={imageFiles.length >= 6}
                    />
                    <label htmlFor="image-upload" className={styles.uploadLabel}>
                      <div className={styles.uploadIcon}>📷</div>
                      <div className={styles.uploadText}>
                        <span className={styles.uploadTitle}>Ajouter des photos</span>
                        <span className={styles.uploadSubtitle}>
                          {imageFiles.length}/6 - Formats: JPG, PNG (Max 5MB)
                        </span>
                      </div>
                      {imageFiles.length < 6 && (
                        <button type="button" className={styles.browseBtn}>
                          Parcourir
                        </button>
                      )}
                    </label>
                  </div>

                  {uploadingImages && (
                    <div className={styles.uploadProgress}>
                      <div className={styles.spinner}></div>
                      <span>Traitement des images...</span>
                    </div>
                  )}

                  {imageFiles.length > 0 && (
                    <div className={styles.imageGrid}>
                      {imageFiles.map((file, index) => (
                        <div key={index} className={styles.imageCard}>
                          <div className={styles.imageCardHeader}>
                            <span className={styles.imageNumber}>#{index + 1}</span>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className={styles.removeBtn}
                              title="Supprimer"
                            >
                              ✕
                            </button>
                          </div>
                          <div
                            className={styles.imageCardBody}
                            onClick={() => setImageModalOpen(index)}
                          >
                            <img src={URL.createObjectURL(file)} alt={`Photo ${index + 1}`} />
                            <div className={styles.imageOverlay}>
                              <span className={styles.zoomIcon}>🔍</span>
                              <span className={styles.zoomText}>Cliquer pour agrandir</span>
                            </div>
                          </div>
                          {imageModalOpen === index && (
                            <div
                              className={styles.imageModal}
                              style={{ display: 'flex' }}
                              onClick={(e) => {
                                if (e.currentTarget === e.target) {
                                  setImageModalOpen(null);
                                }
                              }}
                            >
                              <span className={styles.modalClose} onClick={() => setImageModalOpen(null)}>&times;</span>
                              <img src={URL.createObjectURL(file)} alt={`Photo ${index + 1}`} className={styles.modalImage} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {imageFiles.length === 0 && !uploadingImages && (
                    <div className={styles.emptyState}>
                      <div className={styles.emptyIcon}>🖼️</div>
                      <p className={styles.emptyText}>Aucune photo ajoutée</p>
                      <p className={styles.emptyHint}>Les annonces avec photos reçoivent 5x plus de réponses</p>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Options de livraison</h2>
                <div className={styles.formGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="delivery_available"
                      checked={formData.delivery_available}
                      onChange={handleChange}
                    />
                    <span>Livraison disponible</span>
                  </label>
                </div>
              </div>

              <div className={styles.stepButtons}>
                <button type="button" onClick={prevStep} className={styles.prevBtn}>
                  ← Précédent
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={styles.submitBtn}
                >
                  {loading ? 'Dépôt en cours...' : 'Déposer l\'annonce'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
