import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { wilayas } from '../data/wilayas';
import { uploadImages, compressImage } from '../utils/imageUpload';
import { fetchCommunesByWilaya, getWilayaCodeFromName, getCommuneName } from '../utils/communeHelpers';
import FormSteps from '../components/FormSteps';
import BackButton from '../components/BackButton';
import styles from './CreateListing.module.css';

export default function CreateRentalListing() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [communes, setCommunes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const steps = [
    'Type d\'annonce',
    'Informations générales',
    'Détails du bien',
    'Aménagement',
    'Équipements',
    'Prix et conditions',
    'Disponibilité',
    'Photos',
    'Localisation',
    'Contact'
  ];

  const [formData, setFormData] = useState({
    offer_type: 'offre',
    listing_type: 'louer',
    title: '',
    description: '',
    property_type: '',
    bedrooms: '',
    bathrooms: '',
    surface: '',
    floor: '',
    property_condition: '',
    rental_type: '',
    furnished: '',
    amenities: [],
    price: '',
    negotiable: false,
    charges_included: false,
    charges_amount: '',
    deposit_required: false,
    deposit_amount: '',
    available_from: '',
    minimum_rental_duration: '',
    wilaya: '',
    commune: '',
    images: [],
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    visit_hours: '',
    whatsapp_available: false,
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const DRAFT_KEY = 'wesh_dz_rental_listing_draft';
  const DRAFT_SAVE_INTERVAL = 30000;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadDraft();
  }, [user, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (user && (formData.title || formData.description || formData.property_type)) {
        saveDraft();
      }
    }, DRAFT_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [formData, user]);

  useEffect(() => {
    if (formData.wilaya) {
      loadCommunes(formData.wilaya);
    } else {
      setCommunes([]);
    }
  }, [formData.wilaya]);

  const saveDraft = () => {
    try {
      const draft = {
        formData,
        imageFiles: imageFiles.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        })),
        currentStep,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const loadDraft = () => {
    try {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed.formData) {
          setFormData(parsed.formData);
          setCurrentStep(parsed.currentStep || 1);
        }
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
  };

  const loadCommunes = async (wilayaName) => {
    const wilayaCode = getWilayaCodeFromName(wilayaName);
    if (wilayaCode) {
      const communesData = await fetchCommunesByWilaya(wilayaCode);
      setCommunes(communesData);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (imageFiles.length + files.length > 12) {
      setError('Maximum 12 images autorisées');
      return;
    }
    if (imageFiles.length + files.length < 3) {
      setError('Minimum 3 images requises');
    }

    setUploadingImages(true);
    try {
      const compressedFiles = await Promise.all(
        files.map(file => compressImage(file))
      );
      setImageFiles(prev => [...prev, ...compressedFiles]);
      setError('');
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

  const validateStep = (step) => {
    const errors = {};

    if (step === 1) {
      if (!formData.offer_type) errors.offer_type = 'Requis';
    }

    if (step === 2) {
      if (!formData.title || formData.title.length < 10) {
        errors.title = 'Le titre doit contenir au moins 10 caractères';
      }
      if (formData.title && formData.title.length > 80) {
        errors.title = 'Le titre ne peut pas dépasser 80 caractères';
      }
      if (!formData.description || formData.description.length < 50) {
        errors.description = 'La description doit contenir au moins 50 caractères';
      }
      if (formData.description && formData.description.length > 1000) {
        errors.description = 'La description ne peut pas dépasser 1000 caractères';
      }
    }

    if (step === 3) {
      if (!formData.property_type) errors.property_type = 'Requis';
      if (!formData.bedrooms && formData.bedrooms !== 0) errors.bedrooms = 'Requis';
      if (formData.bedrooms < 0 || formData.bedrooms > 20) {
        errors.bedrooms = 'Entre 0 et 20 chambres';
      }
      if (!formData.bathrooms) errors.bathrooms = 'Requis';
      if (formData.bathrooms < 1 || formData.bathrooms > 10) {
        errors.bathrooms = 'Entre 1 et 10 salles de bain';
      }
      if (!formData.surface) errors.surface = 'Requis';
      if (formData.surface < 10 || formData.surface > 10000) {
        errors.surface = 'Entre 10 et 10,000 m²';
      }
      if (!formData.property_condition) errors.property_condition = 'Requis';
      if (!formData.rental_type) errors.rental_type = 'Requis';
    }

    if (step === 4) {
      if (!formData.furnished) errors.furnished = 'Requis';
    }

    if (step === 6) {
      if (!formData.price) errors.price = 'Requis';
      if (formData.price && formData.price < 5000) {
        errors.price = 'Le prix minimum est 5,000 DA';
      }
      if (!formData.charges_included && formData.charges_amount && formData.charges_amount < 0) {
        errors.charges_amount = 'Montant invalide';
      }
      if (formData.deposit_required && !formData.deposit_amount) {
        errors.deposit_amount = 'Montant de caution requis';
      }
      if (formData.deposit_amount && formData.deposit_amount < 0) {
        errors.deposit_amount = 'Montant invalide';
      }
    }

    if (step === 7) {
      if (!formData.available_from) errors.available_from = 'Requis';
      const selectedDate = new Date(formData.available_from);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        errors.available_from = 'La date doit être aujourd\'hui ou dans le futur';
      }
    }

    if (step === 8) {
      if (imageFiles.length < 3) {
        errors.images = 'Au moins 3 photos sont requises';
      }
    }

    if (step === 9) {
      if (!formData.wilaya) errors.wilaya = 'Requis';
    }

    if (step === 10) {
      if (!formData.contact_name) errors.contact_name = 'Requis';
      if (!formData.contact_phone) errors.contact_phone = 'Requis';
      if (formData.contact_phone && !/^(05|06|07)\d{8}$/.test(formData.contact_phone.replace(/\s/g, ''))) {
        errors.contact_phone = 'Format invalide (05XX XX XX XX, 06XX XX XX XX, ou 07XX XX XX XX)';
      }
      if (formData.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
        errors.contact_email = 'Email invalide';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (!validateStep(currentStep)) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      let imageUrls = [];
      if (imageFiles.length > 0) {
        imageUrls = await uploadImages(imageFiles, user.id);
      }

      const { data: listing, error: listingError } = await supabase
        .from('listings')
        .insert({
          user_id: user.id,
          category_id: null,
          offer_type: formData.offer_type,
          listing_type: formData.listing_type,
          title: formData.title,
          description: formData.description,
          property_type: formData.property_type,
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseInt(formData.bathrooms),
          surface: parseFloat(formData.surface),
          floor: formData.floor || null,
          property_condition: formData.property_condition,
          rental_type: formData.rental_type,
          furnished: formData.furnished,
          amenities: formData.amenities,
          price: parseFloat(formData.price),
          negotiable: formData.negotiable,
          charges_included: formData.charges_included,
          charges_amount: formData.charges_amount ? parseFloat(formData.charges_amount) : null,
          deposit_required: formData.deposit_required,
          deposit_amount: formData.deposit_amount ? parseFloat(formData.deposit_amount) : null,
          available_from: formData.available_from,
          minimum_rental_duration: formData.minimum_rental_duration || null,
          wilaya: formData.wilaya,
          commune: formData.commune,
          images: imageUrls,
          contact_name: formData.contact_name,
          contact_phone: formData.contact_phone,
          contact_email: formData.contact_email || null,
          visit_hours: formData.visit_hours || null,
          whatsapp_available: formData.whatsapp_available,
          status: 'active'
        })
        .select()
        .single();

      if (listingError) throw listingError;

      clearDraft();
      navigate('/my-listings');
    } catch (error) {
      console.error('Error creating listing:', error);
      setError('Erreur lors de la création de l\'annonce. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const availableAmenities = [
    { id: 'climatisation', label: 'Climatisation', icon: '❄️' },
    { id: 'chauffage_central', label: 'Chauffage central', icon: '🔥' },
    { id: 'garage_parking', label: 'Garage / Parking', icon: '🚗' },
    { id: 'jardin', label: 'Jardin', icon: '🌳' },
    { id: 'ascenseur', label: 'Ascenseur', icon: '🛗' },
    { id: 'piscine', label: 'Piscine', icon: '🏊' },
    { id: 'balcon', label: 'Balcon', icon: '🪴' },
    { id: 'cave', label: 'Cave', icon: '📦' },
    { id: 'interphone', label: 'Interphone', icon: '📞' },
    { id: 'gardiennage_securite', label: 'Gardiennage / Sécurité', icon: '👮' },
    { id: 'cuisine_equipee', label: 'Cuisine équipée', icon: '🍳' },
    { id: 'internet_wifi', label: 'Internet / WiFi', icon: '📶' },
  ];

  return (
    <div className={styles.page}>
      <BackButton />

      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Créer une annonce de location</h1>
          <FormSteps steps={steps} currentStep={currentStep} />
        </div>

        {error && (
          <div className={styles.errorBanner}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Step 1: Type d'annonce */}
          {currentStep === 1 && (
            <div className={styles.step}>
              <h2>Type d'annonce</h2>

              <div className={styles.field}>
                <label className={styles.label}>Type d'offre *</label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="offer_type"
                      value="offre"
                      checked={formData.offer_type === 'offre'}
                      onChange={handleChange}
                    />
                    <span>Offre (Je loue mon bien)</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="offer_type"
                      value="demande"
                      checked={formData.offer_type === 'demande'}
                      onChange={handleChange}
                    />
                    <span>Demande (Je cherche à louer)</span>
                  </label>
                </div>
                {validationErrors.offer_type && (
                  <span className={styles.error}>{validationErrors.offer_type}</span>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Informations générales */}
          {currentStep === 2 && (
            <div className={styles.step}>
              <h2>Informations générales</h2>

              <div className={styles.field}>
                <label className={styles.label}>
                  Titre de l'annonce *
                  <span className={styles.charCount}>
                    {formData.title.length}/80
                  </span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  maxLength={80}
                  placeholder="Ex: Appartement F3 meublé centre-ville Alger"
                  className={styles.input}
                />
                {validationErrors.title && (
                  <span className={styles.error}>{validationErrors.title}</span>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Description *
                  <span className={styles.charCount}>
                    {formData.description.length}/1000
                  </span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={1000}
                  rows={6}
                  placeholder="Décrivez votre bien en détail..."
                  className={styles.textarea}
                />
                <small className={styles.hint}>Minimum 50 caractères</small>
                {validationErrors.description && (
                  <span className={styles.error}>{validationErrors.description}</span>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Détails du bien */}
          {currentStep === 3 && (
            <div className={styles.step}>
              <h2>Détails du bien</h2>

              <div className={styles.field}>
                <label className={styles.label}>Type de bien *</label>
                <select
                  name="property_type"
                  value={formData.property_type}
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
                {validationErrors.property_type && (
                  <span className={styles.error}>{validationErrors.property_type}</span>
                )}
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Chambres *</label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    min="0"
                    max="20"
                    placeholder="0 pour Studio"
                    className={styles.input}
                  />
                  <small className={styles.hint}>0 pour Studio</small>
                  {validationErrors.bedrooms && (
                    <span className={styles.error}>{validationErrors.bedrooms}</span>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Salles de bain *</label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    placeholder="1"
                    className={styles.input}
                  />
                  {validationErrors.bathrooms && (
                    <span className={styles.error}>{validationErrors.bathrooms}</span>
                  )}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Surface * (m²)</label>
                  <input
                    type="number"
                    name="surface"
                    value={formData.surface}
                    onChange={handleChange}
                    min="10"
                    max="10000"
                    placeholder="80"
                    className={styles.input}
                  />
                  <small className={styles.hint}>Min 10 m², Max 10,000 m²</small>
                  {validationErrors.surface && (
                    <span className={styles.error}>{validationErrors.surface}</span>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Étage</label>
                  <select
                    name="floor"
                    value={formData.floor}
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
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>État du bien *</label>
                  <select
                    name="property_condition"
                    value={formData.property_condition}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="">Sélectionner...</option>
                    <option value="neuf">Neuf</option>
                    <option value="bon_etat">Bon état</option>
                    <option value="a_renover">À rénover</option>
                  </select>
                  {validationErrors.property_condition && (
                    <span className={styles.error}>{validationErrors.property_condition}</span>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Type de location *</label>
                  <select
                    name="rental_type"
                    value={formData.rental_type}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="">Sélectionner...</option>
                    <option value="longue_duree">Longue durée (&gt;6 mois)</option>
                    <option value="courte_duree">Courte durée (&lt;6 mois)</option>
                    <option value="saisonniere">Saisonnière</option>
                  </select>
                  {validationErrors.rental_type && (
                    <span className={styles.error}>{validationErrors.rental_type}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Aménagement */}
          {currentStep === 4 && (
            <div className={styles.step}>
              <h2>Aménagement</h2>

              <div className={styles.field}>
                <label className={styles.label}>Meublé *</label>
                <select
                  name="furnished"
                  value={formData.furnished}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="">Sélectionner...</option>
                  <option value="meuble">Meublé</option>
                  <option value="semi_meuble">Semi-meublé</option>
                  <option value="non_meuble">Non meublé</option>
                </select>
                {validationErrors.furnished && (
                  <span className={styles.error}>{validationErrors.furnished}</span>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Équipements */}
          {currentStep === 5 && (
            <div className={styles.step}>
              <h2>Équipements</h2>
              <p className={styles.stepDescription}>Sélectionnez les équipements disponibles</p>

              <div className={styles.checkboxGrid}>
                {availableAmenities.map(amenity => (
                  <label key={amenity.id} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity.id)}
                      onChange={() => handleAmenityToggle(amenity.id)}
                    />
                    <span>
                      {amenity.icon} {amenity.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Prix et conditions */}
          {currentStep === 6 && (
            <div className={styles.step}>
              <h2>Prix et conditions</h2>

              <div className={styles.field}>
                <label className={styles.label}>Loyer mensuel * (DA)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="5000"
                  placeholder="50000"
                  className={styles.input}
                />
                <small className={styles.hint}>Prix minimum: 5,000 DA</small>
                {validationErrors.price && (
                  <span className={styles.error}>{validationErrors.price}</span>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="negotiable"
                    checked={formData.negotiable}
                    onChange={handleChange}
                  />
                  <span>Prix négociable</span>
                </label>
              </div>

              <div className={styles.field}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="charges_included"
                    checked={formData.charges_included}
                    onChange={handleChange}
                  />
                  <span>Charges incluses</span>
                </label>
              </div>

              {!formData.charges_included && (
                <div className={styles.field}>
                  <label className={styles.label}>Montant des charges (DA)</label>
                  <input
                    type="number"
                    name="charges_amount"
                    value={formData.charges_amount}
                    onChange={handleChange}
                    min="0"
                    placeholder="5000"
                    className={styles.input}
                  />
                  {validationErrors.charges_amount && (
                    <span className={styles.error}>{validationErrors.charges_amount}</span>
                  )}
                </div>
              )}

              <div className={styles.field}>
                <label className={styles.label}>Caution demandée *</label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="deposit_required"
                      value="true"
                      checked={formData.deposit_required === true}
                      onChange={(e) => setFormData(prev => ({ ...prev, deposit_required: true }))}
                    />
                    <span>Oui</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="deposit_required"
                      value="false"
                      checked={formData.deposit_required === false}
                      onChange={(e) => setFormData(prev => ({ ...prev, deposit_required: false }))}
                    />
                    <span>Non</span>
                  </label>
                </div>
              </div>

              {formData.deposit_required && (
                <div className={styles.field}>
                  <label className={styles.label}>Montant de la caution * (DA)</label>
                  <input
                    type="number"
                    name="deposit_amount"
                    value={formData.deposit_amount}
                    onChange={handleChange}
                    min="0"
                    placeholder="50000"
                    className={styles.input}
                  />
                  {validationErrors.deposit_amount && (
                    <span className={styles.error}>{validationErrors.deposit_amount}</span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 7: Disponibilité */}
          {currentStep === 7 && (
            <div className={styles.step}>
              <h2>Disponibilité</h2>

              <div className={styles.field}>
                <label className={styles.label}>Date de disponibilité *</label>
                <input
                  type="date"
                  name="available_from"
                  value={formData.available_from}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={styles.input}
                />
                {validationErrors.available_from && (
                  <span className={styles.error}>{validationErrors.available_from}</span>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Durée minimum de location</label>
                <select
                  name="minimum_rental_duration"
                  value={formData.minimum_rental_duration}
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
            </div>
          )}

          {/* Step 8: Photos */}
          {currentStep === 8 && (
            <div className={styles.step}>
              <h2>Photos</h2>
              <p className={styles.stepDescription}>
                Ajoutez entre 3 et 12 photos de votre bien
              </p>

              <div className={styles.imageUpload}>
                <input
                  type="file"
                  id="images"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleImageChange}
                  disabled={uploadingImages || imageFiles.length >= 12}
                  className={styles.fileInput}
                />
                <label htmlFor="images" className={styles.uploadButton}>
                  {uploadingImages ? 'Traitement...' : '📸 Ajouter des photos'}
                </label>
                <small className={styles.hint}>
                  Formats acceptés: JPG, PNG, WEBP (max 5 MB par photo)
                </small>
              </div>

              {imageFiles.length > 0 && (
                <div className={styles.imageGrid}>
                  {imageFiles.map((file, index) => (
                    <div key={index} className={styles.imagePreview}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className={styles.removeImage}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {validationErrors.images && (
                <span className={styles.error}>{validationErrors.images}</span>
              )}
            </div>
          )}

          {/* Step 9: Localisation */}
          {currentStep === 9 && (
            <div className={styles.step}>
              <h2>Localisation</h2>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Wilaya *</label>
                  <select
                    name="wilaya"
                    value={formData.wilaya}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="">Sélectionner...</option>
                    {wilayas.map(w => (
                      <option key={w.code} value={w.name}>
                        {w.code} - {w.name}
                      </option>
                    ))}
                  </select>
                  {validationErrors.wilaya && (
                    <span className={styles.error}>{validationErrors.wilaya}</span>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Commune</label>
                  <select
                    name="commune"
                    value={formData.commune}
                    onChange={handleChange}
                    disabled={!formData.wilaya}
                    className={styles.select}
                  >
                    <option value="">Sélectionner...</option>
                    {communes.map(commune => (
                      <option key={commune.id} value={commune.id}>
                        {getCommuneName(commune, language)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 10: Contact */}
          {currentStep === 10 && (
            <div className={styles.step}>
              <h2>Informations de contact</h2>

              <div className={styles.field}>
                <label className={styles.label}>Nom *</label>
                <input
                  type="text"
                  name="contact_name"
                  value={formData.contact_name}
                  onChange={handleChange}
                  placeholder="Votre nom"
                  className={styles.input}
                />
                {validationErrors.contact_name && (
                  <span className={styles.error}>{validationErrors.contact_name}</span>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Téléphone *</label>
                <input
                  type="tel"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleChange}
                  placeholder="05XX XX XX XX"
                  className={styles.input}
                />
                <small className={styles.hint}>
                  Format: 05XX XX XX XX, 06XX XX XX XX, ou 07XX XX XX XX
                </small>
                {validationErrors.contact_phone && (
                  <span className={styles.error}>{validationErrors.contact_phone}</span>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Email (optionnel)</label>
                <input
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  className={styles.input}
                />
                {validationErrors.contact_email && (
                  <span className={styles.error}>{validationErrors.contact_email}</span>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Horaires de visite préférés (optionnel)</label>
                <textarea
                  name="visit_hours"
                  value={formData.visit_hours}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Ex: Disponible du lundi au vendredi de 14h à 18h"
                  className={styles.textarea}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="whatsapp_available"
                    checked={formData.whatsapp_available}
                    onChange={handleChange}
                  />
                  <span>WhatsApp disponible sur ce numéro</span>
                </label>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className={styles.formActions}>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className={styles.btnSecondary}
                disabled={loading}
              >
                ← Précédent
              </button>
            )}

            <button
              type="button"
              onClick={saveDraft}
              className={styles.btnOutline}
              disabled={loading}
            >
              💾 Sauvegarder brouillon
            </button>

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className={styles.btnPrimary}
                disabled={loading}
              >
                Suivant →
              </button>
            ) : (
              <button
                type="submit"
                className={styles.btnPrimary}
                disabled={loading}
              >
                {loading ? 'Publication...' : '✓ Publier l\'annonce'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
