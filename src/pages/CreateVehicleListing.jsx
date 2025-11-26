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

export default function CreateVehicleListing() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const steps = [
    'Type d\'annonce',
    'Informations générales',
    'Détails du véhicule',
    'Caractéristiques',
    'Équipements',
    'Prix et localisation',
    'Photos',
    'Contact'
  ];

  const [formData, setFormData] = useState({
    offer_type: 'offre',
    listing_type: 'vendre',
    title: '',
    description: '',
    vehicle_type: '',
    brand: '',
    model: '',
    year: '',
    mileage: '',
    fuel_type: '',
    transmission: '',
    condition: 'good',
    color: '',
    doors: '',
    engine_capacity: '',
    horsepower: '',
    seats: '',
    features: [],
    price: '',
    negotiable: false,
    wilaya: '',
    commune: '',
    images: [],
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    whatsapp_available: false,
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const DRAFT_KEY = 'wesh_dz_vehicle_listing_draft';
  const DRAFT_SAVE_INTERVAL = 30000; // 30 seconds

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBrands();
    loadDraft();
  }, [user, navigate]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (user && (formData.title || formData.description || formData.vehicle_type)) {
        saveDraft();
      }
    }, DRAFT_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [formData, user]);

  useEffect(() => {
    if (formData.brand) {
      fetchModels(formData.brand);
    } else {
      setModels([]);
    }
  }, [formData.brand]);

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

  const fetchBrands = async () => {
    const { data } = await supabase
      .from('brands')
      .select('id, name')
      .order('name');
    if (data) setBrands(data);
  };

  const fetchModels = async (brandId) => {
    const { data } = await supabase
      .from('models')
      .select('id, name')
      .eq('brand_id', brandId)
      .order('name');
    if (data) setModels(data);
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
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (imageFiles.length + files.length > 8) {
      setError('Maximum 8 images autorisées');
      return;
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
      if (!formData.vehicle_type) errors.vehicle_type = 'Requis';
      if (!formData.brand) errors.brand = 'Requis';
      if (!formData.model) errors.model = 'Requis';
      if (!formData.year) errors.year = 'Requis';
      if (formData.year && (formData.year < 1950 || formData.year > 2026)) {
        errors.year = 'Année invalide (1950-2026)';
      }
      if (!formData.mileage) errors.mileage = 'Requis';
      if (formData.mileage && (formData.mileage < 0 || formData.mileage > 999999)) {
        errors.mileage = 'Kilométrage invalide (max 999,999 km)';
      }
      if (!formData.fuel_type) errors.fuel_type = 'Requis';
      if (!formData.transmission) errors.transmission = 'Requis';
      if (!formData.condition) errors.condition = 'Requis';
    }

    if (step === 6) {
      if (!formData.price) errors.price = 'Requis';
      if (formData.price && formData.price < 50000) {
        errors.price = 'Le prix minimum est 50,000 DA';
      }
      if (!formData.wilaya) errors.wilaya = 'Requis';
    }

    if (step === 7) {
      if (imageFiles.length === 0) {
        errors.images = 'Au moins 1 photo est requise';
      }
    }

    if (step === 8) {
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
          category_id: null, // Will be set based on vehicle category
          offer_type: formData.offer_type,
          listing_type: formData.listing_type,
          title: formData.title,
          description: formData.description,
          vehicle_type: formData.vehicle_type,
          brand_id: formData.brand || null,
          model_id: formData.model || null,
          year: parseInt(formData.year),
          mileage: parseInt(formData.mileage),
          fuel_type: formData.fuel_type,
          transmission: formData.transmission,
          condition: formData.condition,
          color: formData.color || null,
          doors: formData.doors ? parseInt(formData.doors) : null,
          engine_capacity: formData.engine_capacity || null,
          horsepower: formData.horsepower ? parseInt(formData.horsepower) : null,
          seats: formData.seats ? parseInt(formData.seats) : null,
          features: formData.features,
          price: parseFloat(formData.price),
          negotiable: formData.negotiable,
          wilaya: formData.wilaya,
          commune: formData.commune,
          images: imageUrls,
          contact_name: formData.contact_name,
          contact_phone: formData.contact_phone,
          contact_email: formData.contact_email || null,
          whatsapp_available: formData.whatsapp_available,
          status: 'active'
        })
        .select()
        .single();

      if (listingError) throw listingError;

      clearDraft();
      navigate(`/listing/${listing.id}`);
    } catch (error) {
      console.error('Error creating listing:', error);
      setError('Erreur lors de la création de l\'annonce. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const availableFeatures = [
    { id: 'climatisation', label: 'Climatisation', icon: '❄️' },
    { id: 'abs', label: 'ABS', icon: '🛡️' },
    { id: 'airbags', label: 'Airbags', icon: '🎈' },
    { id: 'gps', label: 'GPS / Navigation', icon: '🗺️' },
    { id: 'camera_recul', label: 'Caméra de recul', icon: '📹' },
    { id: 'toit_ouvrant', label: 'Toit ouvrant', icon: '🌅' },
    { id: 'regulateur_vitesse', label: 'Régulateur de vitesse', icon: '⚡' },
    { id: 'jantes_alliage', label: 'Jantes alliage', icon: '⚙️' },
    { id: 'sieges_cuir', label: 'Sièges en cuir', icon: '💺' },
    { id: 'radar_recul', label: 'Radar de recul', icon: '📡' },
  ];

  return (
    <div className={styles.page}>
      <BackButton />

      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Créer une annonce véhicule</h1>
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
                    <span>Offre</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="offer_type"
                      value="demande"
                      checked={formData.offer_type === 'demande'}
                      onChange={handleChange}
                    />
                    <span>Demande</span>
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
                  placeholder="Ex: Volkswagen Golf 7 GTI 2016"
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
                  placeholder="Décrivez votre véhicule en détail..."
                  className={styles.textarea}
                />
                <small className={styles.hint}>Minimum 50 caractères</small>
                {validationErrors.description && (
                  <span className={styles.error}>{validationErrors.description}</span>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Détails du véhicule */}
          {currentStep === 3 && (
            <div className={styles.step}>
              <h2>Détails du véhicule</h2>

              <div className={styles.field}>
                <label className={styles.label}>Type de véhicule *</label>
                <select
                  name="vehicle_type"
                  value={formData.vehicle_type}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="">Sélectionner...</option>
                  <option value="voiture">Voiture</option>
                  <option value="moto">Moto</option>
                  <option value="camion">Camion</option>
                  <option value="utilitaire">Utilitaire</option>
                  <option value="autre">Autre</option>
                </select>
                {validationErrors.vehicle_type && (
                  <span className={styles.error}>{validationErrors.vehicle_type}</span>
                )}
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Marque *</label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="">Sélectionner...</option>
                    {brands.map(brand => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                  {validationErrors.brand && (
                    <span className={styles.error}>{validationErrors.brand}</span>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Modèle *</label>
                  <select
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    disabled={!formData.brand}
                    className={styles.select}
                  >
                    <option value="">Sélectionner...</option>
                    {models.map(model => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                  {validationErrors.model && (
                    <span className={styles.error}>{validationErrors.model}</span>
                  )}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Année *</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    min="1950"
                    max="2026"
                    placeholder="2020"
                    className={styles.input}
                  />
                  {validationErrors.year && (
                    <span className={styles.error}>{validationErrors.year}</span>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Kilométrage * (km)</label>
                  <input
                    type="number"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleChange}
                    min="0"
                    max="999999"
                    placeholder="50000"
                    className={styles.input}
                  />
                  {validationErrors.mileage && (
                    <span className={styles.error}>{validationErrors.mileage}</span>
                  )}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Carburant *</label>
                  <select
                    name="fuel_type"
                    value={formData.fuel_type}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="">Sélectionner...</option>
                    <option value="essence">Essence</option>
                    <option value="diesel">Diesel</option>
                    <option value="hybride">Hybride</option>
                    <option value="electrique">Électrique</option>
                    <option value="gpl">GPL</option>
                  </select>
                  {validationErrors.fuel_type && (
                    <span className={styles.error}>{validationErrors.fuel_type}</span>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Boîte de vitesse *</label>
                  <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="transmission"
                        value="manuelle"
                        checked={formData.transmission === 'manuelle'}
                        onChange={handleChange}
                      />
                      <span>Manuelle</span>
                    </label>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="transmission"
                        value="automatique"
                        checked={formData.transmission === 'automatique'}
                        onChange={handleChange}
                      />
                      <span>Automatique</span>
                    </label>
                  </div>
                  {validationErrors.transmission && (
                    <span className={styles.error}>{validationErrors.transmission}</span>
                  )}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>État *</label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="new">Neuf</option>
                    <option value="good">Occasion (bon état)</option>
                    <option value="fair">À réparer</option>
                  </select>
                  {validationErrors.condition && (
                    <span className={styles.error}>{validationErrors.condition}</span>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Couleur</label>
                  <select
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="">Sélectionner...</option>
                    <option value="blanc">Blanc</option>
                    <option value="noir">Noir</option>
                    <option value="gris">Gris</option>
                    <option value="rouge">Rouge</option>
                    <option value="bleu">Bleu</option>
                    <option value="vert">Vert</option>
                    <option value="jaune">Jaune</option>
                    <option value="orange">Orange</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Caractéristiques additionnelles */}
          {currentStep === 4 && (
            <div className={styles.step}>
              <h2>Caractéristiques additionnelles</h2>
              <p className={styles.stepDescription}>Ces informations sont optionnelles</p>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Nombre de portes</label>
                  <select
                    name="doors"
                    value={formData.doors}
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

                <div className={styles.field}>
                  <label className={styles.label}>Nombre de places</label>
                  <select
                    name="seats"
                    value={formData.seats}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="">Sélectionner...</option>
                    <option value="2">2 places</option>
                    <option value="4">4 places</option>
                    <option value="5">5 places</option>
                    <option value="7">7 places</option>
                    <option value="9">9+ places</option>
                  </select>
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Cylindrée</label>
                  <input
                    type="text"
                    name="engine_capacity"
                    value={formData.engine_capacity}
                    onChange={handleChange}
                    placeholder="Ex: 1600cc"
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Puissance fiscale (CV)</label>
                  <input
                    type="number"
                    name="horsepower"
                    value={formData.horsepower}
                    onChange={handleChange}
                    min="1"
                    max="50"
                    placeholder="Ex: 7"
                    className={styles.input}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Équipements */}
          {currentStep === 5 && (
            <div className={styles.step}>
              <h2>Équipements</h2>
              <p className={styles.stepDescription}>Sélectionnez les équipements disponibles</p>

              <div className={styles.checkboxGrid}>
                {availableFeatures.map(feature => (
                  <label key={feature.id} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature.id)}
                      onChange={() => handleFeatureToggle(feature.id)}
                    />
                    <span>
                      {feature.icon} {feature.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Prix et localisation */}
          {currentStep === 6 && (
            <div className={styles.step}>
              <h2>Prix et localisation</h2>

              <div className={styles.field}>
                <label className={styles.label}>Prix * (DA)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="50000"
                  placeholder="1500000"
                  className={styles.input}
                />
                <small className={styles.hint}>Prix minimum: 50,000 DA</small>
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

          {/* Step 7: Photos */}
          {currentStep === 7 && (
            <div className={styles.step}>
              <h2>Photos</h2>
              <p className={styles.stepDescription}>
                Ajoutez entre 1 et 8 photos de votre véhicule
              </p>

              <div className={styles.imageUpload}>
                <input
                  type="file"
                  id="images"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleImageChange}
                  disabled={uploadingImages || imageFiles.length >= 8}
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

          {/* Step 8: Contact */}
          {currentStep === 8 && (
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
