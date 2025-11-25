import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { wilayas } from '../data/wilayas';
import { getCategoryName } from '../utils/categoryHelpers';
import { fetchCommunesByWilaya, getWilayaCodeFromName, getCommuneName } from '../utils/communeHelpers';
import { getFilterConfig } from '../config/filterConfigs';
import DynamicFilter from './DynamicFilter';
import VehicleSelector from './VehicleSelector';
import styles from './FilterSidebar.module.css';

export default function FilterSidebar({ onFilterChange, selectedCategory, onContentChange }) {
  const { t, language } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [openAccordions, setOpenAccordions] = useState({
    category: true,
    price: false,
    location: false,
    type: false,
    offerType: false,
    condition: false,
    dateFilter: false,
    dynamicFields: false
  });

  const [filters, setFilters] = useState({
    category_id: null,
    subcategory_id: null,
    wilaya: '',
    commune: '',
    minPrice: '',
    maxPrice: '',
    listing_type: '',
    offer_type: '',
    condition: '',
    date_filter: '',
    negotiable: null,
    delivery_available: null,
    bedrooms: '',
    bathrooms: '',
    surface: '',
    brand: '',
    model: '',
    year: '',
    mileage: '',
    dynamicFilters: {}
  });

  const [categoryConfig, setCategoryConfig] = useState(null);
  const [categorySlug, setCategorySlug] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchAllSubcategories();
  }, []);

  useEffect(() => {
    const loadCategoryConfig = async () => {
      // Utiliser subcategory_id si disponible, sinon selectedCategory ou category_id
      const categoryId = filters.subcategory_id || selectedCategory || filters.category_id;

      if (categoryId) {
        const { data: catData } = await supabase
          .from('categories')
          .select('slug, parent_id')
          .eq('id', categoryId)
          .maybeSingle();

        if (catData && catData.slug) {
          setCategorySlug(catData.slug);
          let config = getFilterConfig(catData.slug);

          // Si pas de config pour cette sous-catégorie, chercher le config du parent
          if (!config && catData.parent_id) {
            const { data: parentData } = await supabase
              .from('categories')
              .select('slug')
              .eq('id', catData.parent_id)
              .maybeSingle();

            if (parentData && parentData.slug) {
              config = getFilterConfig(parentData.slug);
            }
          }

          setCategoryConfig(config);
        } else {
          setCategorySlug(null);
          setCategoryConfig(null);
        }
      } else {
        setCategorySlug(null);
        setCategoryConfig(null);
      }
    };

    loadCategoryConfig();
  }, [selectedCategory, filters.subcategory_id, filters.category_id]);

  useEffect(() => {
    if (selectedCategory) {
      const resetFilters = {
        category_id: selectedCategory,
        subcategory_id: null,
        wilaya: '',
        commune: '',
        minPrice: '',
        maxPrice: '',
        listing_type: '',
        offer_type: '',
        condition: '',
        date_filter: '',
        negotiable: null,
        delivery_available: null,
        bedrooms: '',
        bathrooms: '',
        surface: '',
        brand: '',
        model: '',
        year: '',
        mileage: '',
        dynamicFilters: {}
      };
      setFilters(resetFilters);
      setCommunes([]);
      // Expand la catégorie sélectionnée dans le sidebar
      setExpandedCategories({ [selectedCategory]: true });
      // Ouvrir automatiquement les accordéons de filtres pertinents
      setOpenAccordions(prev => ({
        ...prev,
        category: false, // Fermer l'accordéon catégorie
        price: true,
        location: true,
        type: true,
        offerType: true,
        dynamicFields: true
      }));
      fetchSubcategories(selectedCategory);
      onFilterChange(resetFilters);
    } else if (selectedCategory === null) {
      // Réinitialiser complètement quand aucune catégorie n'est sélectionnée
      setExpandedCategories({});
      setOpenAccordions(prev => ({
        ...prev,
        category: true,
        price: false,
        location: false,
        type: false,
        offerType: false,
        dynamicFields: false
      }));
      handleReset();
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (filters.subcategory_id || filters.category_id) {
      const selectedCat = categories.find(c => c.id === (filters.subcategory_id || filters.category_id));
      const categoryType = getCategoryType(selectedCat);

      setOpenAccordions(prev => {
        const newState = {
          category: false,
          price: false,
          location: false,
          type: false,
          offerType: false,
          condition: false,
          dateFilter: false,
          dynamicFields: categoryConfig && categoryConfig.filters && categoryConfig.filters.length > 0
        };

        if (onContentChange) {
          setTimeout(() => {
            const openCount = Object.values(newState).filter(Boolean).length;
            const hasExpandedCategory = Object.values(expandedCategories).some(Boolean);
            const baseWidth = 280;
            const extraWidthPerAccordion = 0;
            const categoryExpansionWidth = hasExpandedCategory ? 20 : 0;
            const dynamicFieldsWidth = newState.dynamicFields ? 40 : 0;

            const newWidth = baseWidth + (openCount * extraWidthPerAccordion) + categoryExpansionWidth + dynamicFieldsWidth;
            onContentChange(Math.min(Math.max(newWidth, 280), 420));
          }, 100);
        }

        return newState;
      });
    } else {
      setOpenAccordions(prev => {
        const newState = {
          category: true,
          price: false,
          location: false,
          type: false,
          offerType: false,
          condition: false,
          dateFilter: false,
          dynamicFields: false
        };

        if (onContentChange) {
          setTimeout(() => {
            onContentChange(280);
          }, 100);
        }

        return newState;
      });
    }
  }, [filters.subcategory_id, filters.category_id, categories, categoryConfig]);

  const loadCommunes = async (wilayaCode) => {
    const communesData = await fetchCommunesByWilaya(wilayaCode);
    setCommunes(communesData);
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('id, name, name_fr, name_ar, name_en, icon, parent_id, display_order')
      .is('parent_id', null)
      .order('display_order', { ascending: true });
    if (data) setCategories(data);
  };

  const fetchAllSubcategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('id, name, name_fr, name_ar, name_en, icon, parent_id')
      .not('parent_id', 'is', null)
      .order('display_order', { ascending: true });
    if (data) {
      setSubcategories(data);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    if (!categoryId) {
      setFilters(prev => ({ ...prev, subcategory_id: null }));
      return;
    }
    const { data } = await supabase
      .from('categories')
      .select('id, name, name_fr, name_ar, name_en, icon, parent_id')
      .eq('parent_id', categoryId)
      .order('display_order', { ascending: true });
    if (data && data.length > 0) {
      setExpandedCategories(prev => ({ ...prev, [categoryId]: true }));
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };

    if (key === 'category_id') {
      newFilters.subcategory_id = null;
      newFilters.brand = '';
      newFilters.model = '';
      newFilters.year = '';
      newFilters.mileage = '';
      newFilters.bedrooms = '';
      newFilters.bathrooms = '';
      newFilters.surface = '';
      newFilters.dynamicFilters = {}; // Reset dynamic filters

      fetchSubcategories(value);

      const selectedCat = categories.find(c => c.id === value);
      if (selectedCat) {
        const catName = getCategoryName(selectedCat, language).toLowerCase();
        const isRental = catName.includes('location') || catName.includes('rent') || catName.includes('تأجير') || catName.includes('vacances');

        if (isRental) {
          newFilters.listing_type = 'louer';
        } else if (newFilters.listing_type === 'louer') {
          newFilters.listing_type = '';
        }
      }
    }

    // Reset dynamic filters when changing subcategory
    if (key === 'subcategory_id') {
      newFilters.dynamicFilters = {};
    }

    if (key === 'wilaya') {
      newFilters.commune = '';
      if (value) {
        const wilayaCode = getWilayaCodeFromName(value, wilayas);
        if (wilayaCode) {
          loadCommunes(wilayaCode);
        }
      } else {
        setCommunes([]);
      }
    }

    if (key === 'offer_type' && value === 'offre') {
      const selectedCat = categories.find(c => c.id === filters.category_id);
      if (selectedCat) {
        const catName = getCategoryName(selectedCat, language).toLowerCase();
        const isRental = catName.includes('location') || catName.includes('rent') || catName.includes('تأجير');
        if (!isRental && newFilters.listing_type === 'louer') {
          newFilters.listing_type = '';
        }
      }
    }

    if (key === 'offer_type' && value === 'demande') {
      newFilters.listing_type = '';
    }

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      category_id: null,
      subcategory_id: null,
      wilaya: '',
      commune: '',
      minPrice: '',
      maxPrice: '',
      listing_type: '',
      offer_type: '',
      condition: '',
      date_filter: '',
      negotiable: null,
      delivery_available: null,
      bedrooms: '',
      bathrooms: '',
      surface: '',
      brand: '',
      model: '',
      year: '',
      mileage: '',
      dynamicFilters: {}
    };
    setFilters(resetFilters);
    setSubcategories([]);
    setCommunes([]);
    setCategoryConfig(null);
    setCategorySlug(null);
    onFilterChange(resetFilters);
  };

  const toggleAccordion = (key) => {
    setOpenAccordions(prev => {
      const newState = {
        ...prev,
        [key]: !prev[key]
      };

      if (onContentChange) {
        setTimeout(() => {
          const openCount = Object.values(newState).filter(Boolean).length;
          const hasExpandedCategory = Object.values(expandedCategories).some(Boolean);
          const baseWidth = 280;
          const extraWidthPerAccordion = 0;
          const categoryExpansionWidth = hasExpandedCategory ? 20 : 0;

          const newWidth = baseWidth + (openCount * extraWidthPerAccordion) + categoryExpansionWidth;
          onContentChange(Math.min(Math.max(newWidth, 280), 380));
        }, 0);
      }

      return newState;
    });
  };

  const toggleCategoryExpand = (categoryId) => {
    setExpandedCategories(prev => {
      const isCurrentlyExpanded = prev[categoryId];
      let newState;

      if (isCurrentlyExpanded) {
        // Si on ferme, réafficher toutes les catégories
        newState = {
          ...prev,
          [categoryId]: false
        };
      } else {
        // Si on ouvre, masquer toutes les autres catégories
        newState = {
          [categoryId]: true
        };
      }

      if (onContentChange) {
        setTimeout(() => {
          const hasExpandedCategory = Object.values(newState).some(Boolean);
          const baseWidth = 280;
          const expansionWidth = hasExpandedCategory ? 30 : 0;

          const newWidth = baseWidth + expansionWidth;
          onContentChange(Math.min(Math.max(newWidth, 280), 380));
        }, 0);
      }

      return newState;
    });
  };

  const getCategoryType = (category) => {
    if (!category) return null;
    const catName = getCategoryName(category, language).toLowerCase();

    if (catName.includes('véhicule') || catName.includes('voiture') || catName.includes('moto') || catName.includes('vehicle') || catName.includes('car')) {
      return 'vehicle';
    }
    if (catName.includes('immobilier') || catName.includes('location') || catName.includes('real estate') || catName.includes('rent') || catName.includes('عقار')) {
      return 'realestate';
    }
    if (catName.includes('électronique') || catName.includes('electronic') || catName.includes('إلكترونيات')) {
      return 'electronics';
    }
    if (catName.includes('mode') || catName.includes('vêtement') || catName.includes('fashion') || catName.includes('clothing')) {
      return 'fashion';
    }
    if (catName.includes('emploi') || catName.includes('job') || catName.includes('وظائف')) {
      return 'job';
    }
    if (catName.includes('service') || catName.includes('خدمات')) {
      return 'service';
    }
    return 'general';
  };

  const selectedCat = categories.find(c => c.id === filters.category_id);
  const categoryType = getCategoryType(selectedCat);
  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'category_id' || key === 'subcategory_id') return false;
    return value !== '' && value !== null;
  });

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h3>🔍 {t('searchBar.filters') || 'Affiner ma recherche'}</h3>
        {hasActiveFilters && (
          <button onClick={handleReset} className={styles.resetBtn}>
            ✕ {t('searchBar.reset')}
          </button>
        )}
      </div>

      <div className={styles.accordionItem}>
        <button
          className={styles.accordionHeader}
          onClick={() => toggleAccordion('category')}
        >
          <span>📂 {t('createListing.category')}</span>
          <span className={`${styles.accordionIcon} ${openAccordions.category ? styles.open : ''}`}>
            ▼
          </span>
        </button>
        {openAccordions.category && (
          <div className={styles.accordionContent}>
            <div className={styles.categoryList}>
              {Object.values(expandedCategories).some(Boolean) && (
                <button
                  className={styles.categoryItem}
                  onClick={() => {
                    setExpandedCategories({});
                    setOpenAccordions(prev => ({ ...prev, category: true }));
                  }}
                  style={{ backgroundColor: '#f0f0f0', marginBottom: '8px' }}
                >
                  <span>← {t('home.allCategories')}</span>
                </button>
              )}

              <button
                className={`${styles.categoryItem} ${!filters.category_id && !filters.subcategory_id ? styles.active : ''}`}
                onClick={() => {
                  handleFilterChange('category_id', null);
                  setExpandedCategories({});
                  setOpenAccordions(prev => ({ ...prev, category: true }));
                }}
              >
                <span>🔍 {t('home.allCategories')}</span>
              </button>

              {categories.map(cat => {
                const subs = subcategories.filter(s => s.parent_id === cat.id);
                const isExpanded = expandedCategories[cat.id];
                const isSelected = filters.category_id === cat.id;
                const hasExpandedCategory = Object.values(expandedCategories).some(Boolean);
                const shouldShow = !hasExpandedCategory || isExpanded || isSelected;

                // Masquer la catégorie si une autre est étendue
                if (!shouldShow) return null;

                return (
                  <div key={cat.id} className={styles.categoryGroup}>
                    <div className={styles.categoryItemWrapper}>
                      <button
                        className={`${styles.categoryItem} ${isSelected && !filters.subcategory_id ? styles.active : ''}`}
                        onClick={() => {
                          // Masquer toutes les autres catégories et n'afficher que celle-ci
                          setExpandedCategories({ [cat.id]: true });
                          handleFilterChange('category_id', cat.id);
                          if (subs.length === 0) {
                            handleFilterChange('subcategory_id', null);
                          }
                          // Fermer l'accordéon catégorie et ouvrir les filtres
                          setOpenAccordions(prev => ({
                            ...prev,
                            category: false,
                            price: true,
                            location: true,
                            type: true,
                            offerType: true
                          }));
                        }}
                      >
                        <span>{cat.icon} {getCategoryName(cat, language)}</span>
                      </button>
                      {subs.length > 0 && (
                        <button
                          className={styles.expandBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCategoryExpand(cat.id);
                            if (!isExpanded && !isSelected) {
                              handleFilterChange('category_id', cat.id);
                            }
                          }}
                        >
                          {isExpanded ? '▼' : '▶'}
                        </button>
                      )}
                    </div>

                    {isExpanded && subs.length > 0 && (
                      <div className={styles.subcategoryList}>
                        {subs.map(sub => (
                          <button
                            key={sub.id}
                            className={`${styles.subcategoryItem} ${filters.subcategory_id === sub.id ? styles.active : ''}`}
                            onClick={() => {
                              // Reset les filtres dynamiques et véhicule/immobilier quand on change de sous-catégorie
                              const newFilters = {
                                ...filters,
                                category_id: cat.id,
                                subcategory_id: sub.id,
                                dynamicFilters: {}, // Reset filtres dynamiques
                                brand: '',
                                model: '',
                                year: '',
                                mileage: '',
                                bedrooms: '',
                                bathrooms: '',
                                surface: ''
                              };
                              setFilters(newFilters);
                              onFilterChange(newFilters);
                            }}
                          >
                            <span>{sub.icon} {getCategoryName(sub, language)}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {categoryConfig && categoryConfig.filters && categoryConfig.filters.length > 0 && (
        <div className={styles.accordionItem}>
          <button
            className={styles.accordionHeader}
            onClick={() => toggleAccordion('dynamicFields')}
          >
            <span>{categoryConfig.icon} Filtres {categoryConfig.slug.replace(/-/g, ' ')}</span>
            <span className={`${styles.accordionIcon} ${openAccordions.dynamicFields ? styles.open : ''}`}>
              ▼
            </span>
          </button>
          {openAccordions.dynamicFields && (
            <div className={styles.accordionContent}>
              {categoryConfig.filters.map(filter => (
                <DynamicFilter
                  key={filter.id}
                  filter={filter}
                  value={(() => {
                    // Mapping pour les filtres synchronisés
                    const syncMapping = {
                      'subcategory_id': filters.subcategory_id,
                      'brand_id': filters.brand,
                      'brand': filters.brand,
                      'model_id': filters.model
                    };
                    return syncMapping[filter.id] || filters.dynamicFilters[filter.id];
                  })()}
                  onChange={(filterId, value) => {
                    // Filtres qui doivent être synchronisés avec filters (top-level)
                    // Ces filtres sont utilisés directement dans Home.jsx
                    const syncFilters = {
                      'subcategory_id': 'subcategory_id',
                      'brand_id': 'brand',
                      'brand': 'brand',
                      'model_id': 'model'
                    };

                    if (syncFilters[filterId]) {
                      // Synchroniser avec filters (top-level)
                      const topLevelKey = syncFilters[filterId];
                      const newFilters = {
                        ...filters,
                        [topLevelKey]: value || null,
                        dynamicFilters: {
                          ...filters.dynamicFilters,
                          [filterId]: value
                        }
                      };
                      setFilters(newFilters);
                      onFilterChange(newFilters);
                    } else {
                      // Filtres normaux : seulement dans dynamicFilters
                      const newDynamicFilters = {
                        ...filters.dynamicFilters,
                        [filterId]: value
                      };
                      const newFilters = {
                        ...filters,
                        dynamicFilters: newDynamicFilters
                      };
                      setFilters(newFilters);
                      onFilterChange(newFilters);
                    }
                  }}
                  parentValue={filter.dependsOn ? filters.dynamicFilters[filter.dependsOn] : null}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {(categoryType === 'vehicle' || categorySlug === 'vehicules' || categorySlug === 'voitures' || categorySlug === 'motos' || categorySlug === 'camions') && (
        <VehicleSelector
          brand={filters.brand}
          model={filters.model}
          year={filters.year}
          mileage={filters.mileage}
          onBrandChange={(value) => handleFilterChange('brand', value)}
          onModelChange={(value) => handleFilterChange('model', value)}
          onYearChange={(value) => handleFilterChange('year', value)}
          onMileageChange={(value) => handleFilterChange('mileage', value)}
        />
      )}

      <div className={styles.accordionItem}>
        <button
          className={styles.accordionHeader}
          onClick={() => toggleAccordion('price')}
        >
          <span>💰 {t('searchBar.priceRange') || 'Fourchette de prix'}</span>
          <span className={`${styles.accordionIcon} ${openAccordions.price ? styles.open : ''}`}>
            ▼
          </span>
        </button>
        {openAccordions.price && (
          <div className={styles.accordionContent}>
            <div className={styles.priceInputs}>
              <input
                type="number"
                placeholder={t('searchBar.minPrice')}
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className={styles.input}
              />
              <span>-</span>
              <input
                type="number"
                placeholder={t('searchBar.maxPrice')}
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.checkboxGroup} style={{ marginTop: '12px' }}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={filters.negotiable === true}
                  onChange={(e) => handleFilterChange('negotiable', e.target.checked ? true : null)}
                />
                <span>💬 {t('filters.negotiableOnly')}</span>
              </label>
            </div>
          </div>
        )}
      </div>

      <div className={styles.accordionItem}>
        <button
          className={styles.accordionHeader}
          onClick={() => toggleAccordion('location')}
        >
          <span>📍 {t('createListing.location')}</span>
          <span className={`${styles.accordionIcon} ${openAccordions.location ? styles.open : ''}`}>
            ▼
          </span>
        </button>
        {openAccordions.location && (
          <div className={styles.accordionContent}>
            <div style={{ marginBottom: '12px' }}>
              <label className={styles.fieldLabel}>
                {t('createListing.wilaya')}
              </label>
              <select
                value={filters.wilaya}
                onChange={(e) => handleFilterChange('wilaya', e.target.value)}
                className={styles.select}
              >
                <option value="">{t('searchBar.allWilayas')}</option>
                {wilayas.map(w => (
                  <option key={w.code} value={w.name}>
                    {w.code} - {w.name}
                  </option>
                ))}
              </select>
            </div>

            {filters.wilaya && (
              <div>
                <label className={styles.fieldLabel}>
                  {t('createListing.commune')} {communes.length > 0 && <span className={styles.infoText}>({communes.length})</span>}
                </label>
                {communes.length > 0 ? (
                  <select
                    value={filters.commune}
                    onChange={(e) => handleFilterChange('commune', e.target.value)}
                    className={styles.select}
                  >
                    <option value="">{t('createListing.communePlaceholder') || 'Toutes les communes'}</option>
                    {communes.map(commune => (
                      <option key={commune.id} value={commune.id}>
                        {getCommuneName(commune, language)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className={styles.infoBox}>
                    ⏳ Chargement...
                  </div>
                )}
              </div>
            )}

            <div className={styles.checkboxGroup} style={{ marginTop: '12px' }}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={filters.delivery_available === true}
                  onChange={(e) => handleFilterChange('delivery_available', e.target.checked ? true : null)}
                />
                <span>🚚 {t('filters.deliveryAvailable')}</span>
              </label>
            </div>
          </div>
        )}
      </div>

      <div className={styles.accordionItem}>
        <button
          className={styles.accordionHeader}
          onClick={() => toggleAccordion('type')}
        >
          <span>📢 {t('createListing.adType')}</span>
          <span className={`${styles.accordionIcon} ${openAccordions.type ? styles.open : ''}`}>
            ▼
          </span>
        </button>
        {openAccordions.type && (
          <div className={styles.accordionContent}>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="offer_type"
                  value=""
                  checked={filters.offer_type === ''}
                  onChange={(e) => handleFilterChange('offer_type', e.target.value)}
                />
                <span>🔍 {t('searchBar.all') || 'Tous'}</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="offer_type"
                  value="offre"
                  checked={filters.offer_type === 'offre'}
                  onChange={(e) => handleFilterChange('offer_type', e.target.value)}
                />
                <span>📦 {t('createListing.offers')}</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="offer_type"
                  value="demande"
                  checked={filters.offer_type === 'demande'}
                  onChange={(e) => handleFilterChange('offer_type', e.target.value)}
                />
                <span>🔔 {t('createListing.demands')}</span>
              </label>
            </div>
          </div>
        )}
      </div>

      <div className={styles.accordionItem}>
        <button
          className={styles.accordionHeader}
          onClick={() => toggleAccordion('offerType')}
        >
          <span>🏷️ {t('createListing.offerType')}</span>
          <span className={`${styles.accordionIcon} ${openAccordions.offerType ? styles.open : ''}`}>
            ▼
          </span>
        </button>
        {openAccordions.offerType && (
          <div className={styles.accordionContent}>
            <div className={styles.radioGroup}>
              {categoryType === 'realestate' || selectedCat?.name_fr?.toLowerCase().includes('location') ? (
                <>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="listing_type"
                      value=""
                      checked={filters.listing_type === ''}
                      onChange={(e) => handleFilterChange('listing_type', e.target.value)}
                    />
                    <span>🔍 {t('searchBar.all')}</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="listing_type"
                      value="louer"
                      checked={filters.listing_type === 'louer'}
                      onChange={(e) => handleFilterChange('listing_type', e.target.value)}
                    />
                    <span>🏘️ {t('createListing.toRent')}</span>
                  </label>
                </>
              ) : filters.offer_type !== 'demande' ? (
                <>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="listing_type"
                      value=""
                      checked={filters.listing_type === ''}
                      onChange={(e) => handleFilterChange('listing_type', e.target.value)}
                    />
                    <span>🔍 {t('searchBar.all')}</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="listing_type"
                      value="vendre"
                      checked={filters.listing_type === 'vendre'}
                      onChange={(e) => handleFilterChange('listing_type', e.target.value)}
                    />
                    <span>💵 {t('createListing.forSale')}</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="listing_type"
                      value="louer"
                      checked={filters.listing_type === 'louer'}
                      onChange={(e) => handleFilterChange('listing_type', e.target.value)}
                    />
                    <span>🔄 {t('filters.forRent')}</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="listing_type"
                      value="donner"
                      checked={filters.listing_type === 'donner'}
                      onChange={(e) => handleFilterChange('listing_type', e.target.value)}
                    />
                    <span>🎁 {t('createListing.toGive')}</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="listing_type"
                      value="echanger"
                      checked={filters.listing_type === 'echanger'}
                      onChange={(e) => handleFilterChange('listing_type', e.target.value)}
                    />
                    <span>🔁 {t('createListing.toExchange')}</span>
                  </label>
                </>
              ) : (
                <div className={styles.infoBox}>
                  ℹ️ {t('filters.offerTypeNotApplicable')}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className={styles.accordionItem}>
        <button
          className={styles.accordionHeader}
          onClick={() => toggleAccordion('condition')}
        >
          <span>⭐ {t('filters.condition')}</span>
          <span className={`${styles.accordionIcon} ${openAccordions.condition ? styles.open : ''}`}>
            ▼
          </span>
        </button>
        {openAccordions.condition && (
          <div className={styles.accordionContent}>
            <select
              value={filters.condition}
              onChange={(e) => handleFilterChange('condition', e.target.value)}
              className={styles.select}
            >
              <option value="">{t('filters.allConditions')}</option>
              <option value="new">✨ {t('filters.conditionNew')}</option>
              <option value="like_new">🌟 {t('filters.conditionLikeNew')}</option>
              <option value="good">👍 {t('filters.conditionGood')}</option>
              <option value="fair">👌 {t('filters.conditionFair')}</option>
              <option value="poor">🔧 {t('filters.conditionPoor')}</option>
            </select>
          </div>
        )}
      </div>

      <div className={styles.accordionItem}>
        <button
          className={styles.accordionHeader}
          onClick={() => toggleAccordion('dateFilter')}
        >
          <span>📅 {t('filters.publicationDate')}</span>
          <span className={`${styles.accordionIcon} ${openAccordions.dateFilter ? styles.open : ''}`}>
            ▼
          </span>
        </button>
        {openAccordions.dateFilter && (
          <div className={styles.accordionContent}>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="date_filter"
                  value=""
                  checked={filters.date_filter === '' || !filters.date_filter}
                  onChange={(e) => handleFilterChange('date_filter', e.target.value)}
                />
                <span>🔍 {t('filters.allDates')}</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="date_filter"
                  value="today"
                  checked={filters.date_filter === 'today'}
                  onChange={(e) => handleFilterChange('date_filter', e.target.value)}
                />
                <span>📆 {t('filters.today')}</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="date_filter"
                  value="week"
                  checked={filters.date_filter === 'week'}
                  onChange={(e) => handleFilterChange('date_filter', e.target.value)}
                />
                <span>📅 {t('filters.thisWeek')}</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="date_filter"
                  value="month"
                  checked={filters.date_filter === 'month'}
                  onChange={(e) => handleFilterChange('date_filter', e.target.value)}
                />
                <span>🗓️ {t('filters.thisMonth')}</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
