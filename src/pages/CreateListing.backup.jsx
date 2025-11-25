import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { wilayas } from '../data/wilayas';
import { uploadImages, compressImage } from '../utils/imageUpload';
import { getCategoryName } from '../utils/categoryHelpers';
import { getCommuneName, fetchCommunesByWilaya, getWilayaCodeFromName } from '../utils/communeHelpers';
import styles from './CreateListing.module.css';

export default function CreateListing() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRentalCategory, setIsRentalCategory] = useState(false);

  const [formData, setFormData] = useState({
    account_type: 'particulier',
    title: '',
    description: '',
    offer_type: 'offre',
    listing_type: 'vendre',
    category_id: '',
    subcategory_id: '',
    wilaya: '',
    commune: '',
    price: '',
    condition: 'good',
    negotiable: false,
    delivery_available: false,
    images: [],
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [deliveryOptions, setDeliveryOptions] = useState([
    { delivery_type: 'pickup', zones: [], price: 0, estimated_days: 0 }
  ]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCategories();
  }, [user, navigate]);

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
      const catName = getCategoryName(selectedCat, language).toLowerCase();
      const isRental = catName.includes('location') || catName.includes('rent') || catName.includes('تأجير') || catName.includes('vacances') || catName.includes('louer');
      setIsRentalCategory(isRental);

      if (isRental && formData.listing_type !== 'louer') {
        setFormData(prev => ({ ...prev, listing_type: 'louer', offer_type: 'offre' }));
      } else if (!isRental && formData.listing_type === 'louer') {
        setFormData(prev => ({ ...prev, listing_type: 'vendre' }));
      }

      fetchSubcategories(formData.category_id);
    } else {
      setSubcategories([]);
      setFormData(prev => ({ ...prev, subcategory_id: '' }));
      setIsRentalCategory(false);
    }
  }, [formData.category_id, categories, language]);

  const loadCommunes = async (wilayaCode) => {
    const communesData = await fetchCommunesByWilaya(wilayaCode);
    setCommunes(communesData);
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
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, name_fr, name_ar, name_en, icon, parent_id, display_order')
        .is('parent_id', null)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    let updates = { [name]: newValue };

    if (name === 'offer_type' && value === 'demande') {
      updates.listing_type = '';
    }

    setFormData({
      ...formData,
      ...updates
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length + imageFiles.length > 8) {
      setError('Vous pouvez ajouter un maximum de 8 photos');
      return;
    }

    setUploadingImages(true);
    try {
      const compressedFiles = await Promise.all(
        files.map(file => compressImage(file))
      );

      const imageUrls = compressedFiles.map(file => URL.createObjectURL(file));
      setImageFiles([...imageFiles, ...compressedFiles]);
      setFormData({ ...formData, images: [...formData.images, ...imageUrls] });
    } catch (err) {
      console.error('Error processing images:', err);
      setError('Erreur lors du traitement des images');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newFiles = imageFiles.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
    setImageFiles(newFiles);
  };

  const addDeliveryOption = () => {
    setDeliveryOptions([
      ...deliveryOptions,
      { delivery_type: 'home', zones: [], price: 0, estimated_days: 0 }
    ]);
  };

  const updateDeliveryOption = (index, field, value) => {
    const newOptions = [...deliveryOptions];
    newOptions[index][field] = value;
    setDeliveryOptions(newOptions);
  };

  const removeDeliveryOption = (index) => {
    setDeliveryOptions(deliveryOptions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let uploadedImageUrls = [];

      if (imageFiles.length > 0) {
        uploadedImageUrls = await uploadImages(imageFiles, user.id);
      }

      const { data: listing, error: listingError } = await supabase
        .from('listings')
        .insert([{
          user_id: user.id,
          account_type: formData.account_type,
          title: formData.title,
          description: formData.description,
          offer_type: formData.offer_type,
          listing_type: formData.listing_type,
          price: parseFloat(formData.price),
          negotiable: formData.negotiable,
          category_id: formData.category_id || null,
          condition: formData.condition,
          wilaya: formData.wilaya,
          commune: formData.commune,
          delivery_available: formData.delivery_available,
          images: uploadedImageUrls,
          status: 'active',
        }])
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

      navigate(`/listing/${listing.id}`);
    } catch (error) {
      console.error('Error creating listing:', error);
      setError('Erreur lors de la création de l\'annonce. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.createListing}>
      <div className="container">
        <div className={styles.header}>
          <h1>{t('createListing.title')}</h1>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
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
            <p className={styles.accountHint}>{t('createListing.proHint')}</p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('createListing.information')}</h2>
            <div className={styles.formGroup}>
              <label>{t('createListing.listingTitle')} *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder={t('createListing.listingTitlePlaceholder')}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('createListing.photos')}</h2>
            <p className={styles.photoCounter}>{imageFiles.length}/8</p>
            <div className={styles.imageUploadArea}>
              {formData.images.length === 0 ? (
                <label htmlFor="images" className={styles.uploadPlaceholder}>
                  <div className={styles.uploadIcon}>📤</div>
                  <p>{t('createListing.noPhotos')}</p>
                  <input
                    type="file"
                    id="images"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    disabled={uploadingImages || imageFiles.length >= 8}
                  />
                </label>
              ) : (
                <div className={styles.imageGrid}>
                  {formData.images.map((img, index) => (
                    <div key={index} className={styles.imagePreviewItem}>
                      <img src={img} alt={`Preview ${index}`} />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className={styles.removeImageBtn}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {imageFiles.length < 8 && (
                    <label htmlFor="images" className={styles.addMoreBtn}>
                      <span>+</span>
                      <input
                        type="file"
                        id="images"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                        disabled={uploadingImages || imageFiles.length >= 8}
                      />
                    </label>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('createListing.description')} *</h2>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder={t('createListing.descriptionPlaceholder')}
              rows="6"
              className={styles.textarea}
            />
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('createListing.adType')} *</h2>
            <div className={styles.offerTypeSelector}>
              <button
                type="button"
                className={`${styles.offerTypeBtn} ${formData.offer_type === 'offre' ? styles.active : ''}`}
                onClick={() => setFormData({...formData, offer_type: 'offre'})}
              >
                <span className={styles.offerIcon}>🏪</span>
                <div>
                  <strong>{t('createListing.offers')}</strong>
                  <p>{t('createListing.offersDesc')}</p>
                </div>
              </button>
              <button
                type="button"
                className={`${styles.offerTypeBtn} ${formData.offer_type === 'demande' ? styles.active : ''}`}
                onClick={() => setFormData({...formData, offer_type: 'demande'})}
              >
                <span className={styles.offerIcon}>🔍</span>
                <div>
                  <strong>{t('createListing.demands')}</strong>
                  <p>{t('createListing.demandsDesc')}</p>
                </div>
              </button>
            </div>
          </div>

          <div className={styles.updateDataBanner}>
            🔄 {t('createListing.updateData')}
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('createListing.category')} *</h2>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="">{t('createListing.categoryPlaceholder')}</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {getCategoryName(cat, language)}
                </option>
              ))}
            </select>
          </div>

          {subcategories.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('searchBar.subcategory')}</h2>
              <select
                name="subcategory_id"
                value={formData.subcategory_id}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">{t('searchBar.allSubcategories')}</option>
                {subcategories.map(subcat => (
                  <option key={subcat.id} value={subcat.id}>
                    {subcat.icon} {getCategoryName(subcat, language)}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('createListing.offerType')} *</h2>
            <div className={styles.listingTypeSelector}>
              {isRentalCategory ? (
                <>
                  <button
                    type="button"
                    className={`${styles.listingTypeBtn} ${formData.listing_type === 'louer' && formData.offer_type === 'offre' ? styles.active : ''}`}
                    onClick={() => setFormData({...formData, listing_type: 'louer', offer_type: 'offre'})}
                  >
                    <span>🏠</span>
                    <span>{t('createListing.toRent')}</span>
                  </button>
                  <button
                    type="button"
                    className={`${styles.listingTypeBtn} ${formData.listing_type === 'louer' && formData.offer_type === 'demande' ? styles.active : ''}`}
                    onClick={() => setFormData({...formData, listing_type: 'louer', offer_type: 'demande'})}
                  >
                    <span>🔍</span>
                    <span>{t('createListing.lookingToRent')}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className={`${styles.listingTypeBtn} ${formData.listing_type === 'vendre' ? styles.active : ''}`}
                    onClick={() => setFormData({...formData, listing_type: 'vendre'})}
                  >
                    <span>💰</span>
                    <span>{t('createListing.forSale')}</span>
                  </button>
                  <button
                    type="button"
                    className={`${styles.listingTypeBtn} ${formData.listing_type === 'donner' ? styles.active : ''}`}
                    onClick={() => setFormData({...formData, listing_type: 'donner'})}
                  >
                    <span>🎁</span>
                    <span>{t('createListing.toGive')}</span>
                  </button>
                  <button
                    type="button"
                    className={`${styles.listingTypeBtn} ${formData.listing_type === 'echanger' ? styles.active : ''}`}
                    onClick={() => setFormData({...formData, listing_type: 'echanger'})}
                  >
                    <span>🔄</span>
                    <span>{t('createListing.toExchange')}</span>
                  </button>
                  <button
                    type="button"
                    className={`${styles.listingTypeBtn} ${formData.listing_type === 'louer' ? styles.active : ''}`}
                    onClick={() => setFormData({...formData, listing_type: 'louer'})}
                  >
                    <span>🏠</span>
                    <span>{t('createListing.toRent')}</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className={styles.section}>
            <h2>Photos</h2>
            <div className={styles.imageUpload}>
              <label htmlFor="images" className={styles.uploadBtn}>
                <span>📷</span>
                <span>{uploadingImages ? 'Traitement...' : 'Ajouter des photos'}</span>
                <input
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  disabled={uploadingImages || imageFiles.length >= 8}
                />
              </label>
              <p className={styles.imageHint}>
                {imageFiles.length}/8 photos • Max 8 photos par annonce
              </p>

              <div className={styles.imagePreview}>
                {formData.images.map((img, index) => (
                  <div key={index} className={styles.imageItem}>
                    <img src={img} alt={`Preview ${index}`} />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className={styles.removeImg}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('createListing.location')}</h2>
            <div className={styles.formGroup}>
              <label>{t('createListing.wilaya')} *</label>
              <select
                name="wilaya"
                value={formData.wilaya}
                onChange={handleChange}
                required
                className={styles.select}
              >
                <option value="">{t('createListing.wilayaPlaceholder')}</option>
                {wilayas.map(wilaya => (
                  <option key={wilaya.code} value={wilaya.name}>
                    {wilaya.code} - {wilaya.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>{t('createListing.commune')} *</label>
              <select
                name="commune"
                value={formData.commune}
                onChange={handleChange}
                required
                className={styles.select}
                disabled={!formData.wilaya || communes.length === 0}
              >
                <option value="">{t('createListing.communePlaceholder')}</option>
                {communes.map(commune => (
                  <option key={commune.id} value={getCommuneName(commune, 'fr')}>
                    {getCommuneName(commune, language)}
                  </option>
                ))}
              </select>
              {formData.wilaya && communes.length === 0 && (
                <p className={styles.hint}>Chargement des communes...</p>
              )}
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={() => navigate(-1)} className={styles.cancelBtn}>
              ✕ {t('createListing.cancel')}
            </button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? `⏳ ${t('createListing.submitting')}` : `✓ ${t('createListing.submit')}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
