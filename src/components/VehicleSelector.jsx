import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import styles from './VehicleSelector.module.css';

export default function VehicleSelector({ selectedBrand, selectedModel, onBrandChange, onModelChange }) {
  const { language } = useLanguage();
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [brandSearch, setBrandSearch] = useState('');
  const [modelSearch, setModelSearch] = useState('');
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      fetchModels(selectedBrand);
    } else {
      setModels([]);
      onModelChange('');
    }
  }, [selectedBrand]);

  const fetchBrands = async () => {
    const { data, error } = await supabase
      .from('brands')
      .select('id, name, name_ar, popular')
      .order('display_order');

    if (data) {
      setBrands(data);
    }
  };

  const fetchModels = async (brandId) => {
    const { data, error } = await supabase
      .from('models')
      .select('id, name, name_ar, popular')
      .eq('brand_id', brandId)
      .order('display_order');

    if (data) {
      setModels(data);
    }
  };

  const getBrandName = (brand) => {
    if (language === 'ar' && brand.name_ar) return brand.name_ar;
    return brand.name;
  };

  const getModelName = (model) => {
    if (language === 'ar' && model.name_ar) return model.name_ar;
    return model.name;
  };

  const filteredBrands = brands.filter(brand =>
    getBrandName(brand).toLowerCase().includes(brandSearch.toLowerCase())
  );

  const filteredModels = models.filter(model =>
    getModelName(model).toLowerCase().includes(modelSearch.toLowerCase())
  );

  const popularBrands = filteredBrands.filter(b => b.popular);
  const otherBrands = filteredBrands.filter(b => !b.popular);

  const popularModels = filteredModels.filter(m => m.popular);
  const otherModels = filteredModels.filter(m => !m.popular);

  const selectedBrandObj = brands.find(b => b.id === selectedBrand);
  const selectedModelObj = models.find(m => m.id === selectedModel);

  return (
    <div className={styles.vehicleSelector}>
      <div className={styles.selectorGroup}>
        <label>Marque du véhicule *</label>
        <div className={styles.customSelect}>
          <input
            type="text"
            placeholder="Rechercher une marque..."
            value={selectedBrandObj ? getBrandName(selectedBrandObj) : brandSearch}
            onChange={(e) => {
              setBrandSearch(e.target.value);
              if (selectedBrand) onBrandChange('');
              setShowBrandDropdown(true);
            }}
            onFocus={() => setShowBrandDropdown(true)}
            className={styles.searchInput}
          />

          {showBrandDropdown && (
            <div className={styles.dropdown}>
              {brandSearch && (
                <div className={styles.searchHeader}>
                  <input
                    type="text"
                    placeholder="🔍 Rechercher..."
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    className={styles.searchBox}
                    autoFocus
                  />
                </div>
              )}

              <div className={styles.dropdownContent}>
                {popularBrands.length > 0 && (
                  <>
                    <div className={styles.sectionLabel}>⭐ Marques populaires</div>
                    {popularBrands.map(brand => (
                      <div
                        key={brand.id}
                        className={`${styles.option} ${selectedBrand === brand.id ? styles.selected : ''}`}
                        onClick={() => {
                          onBrandChange(brand.id);
                          setBrandSearch('');
                          setShowBrandDropdown(false);
                        }}
                      >
                        {getBrandName(brand)}
                      </div>
                    ))}
                  </>
                )}

                {otherBrands.length > 0 && (
                  <>
                    <div className={styles.sectionLabel}>📋 Autres marques</div>
                    {otherBrands.map(brand => (
                      <div
                        key={brand.id}
                        className={`${styles.option} ${selectedBrand === brand.id ? styles.selected : ''}`}
                        onClick={() => {
                          onBrandChange(brand.id);
                          setBrandSearch('');
                          setShowBrandDropdown(false);
                        }}
                      >
                        {getBrandName(brand)}
                      </div>
                    ))}
                  </>
                )}

                {filteredBrands.length === 0 && (
                  <div className={styles.noResults}>Aucune marque trouvée</div>
                )}
              </div>

              <div className={styles.dropdownFooter}>
                <button
                  type="button"
                  onClick={() => {
                    setShowBrandDropdown(false);
                    setBrandSearch('');
                  }}
                  className={styles.closeBtn}
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.selectorGroup}>
        <label>Modèle *</label>
        <div className={styles.customSelect}>
          <input
            type="text"
            placeholder={selectedBrand ? "Rechercher un modèle..." : "Sélectionnez d'abord une marque"}
            value={selectedModelObj ? getModelName(selectedModelObj) : modelSearch}
            onChange={(e) => {
              if (!selectedBrand) return;
              setModelSearch(e.target.value);
              if (selectedModel) onModelChange('');
              setShowModelDropdown(true);
            }}
            onFocus={() => {
              if (selectedBrand) setShowModelDropdown(true);
            }}
            className={styles.searchInput}
            disabled={!selectedBrand}
          />

          {showModelDropdown && selectedBrand && (
            <div className={styles.dropdown}>
              {modelSearch && (
                <div className={styles.searchHeader}>
                  <input
                    type="text"
                    placeholder="🔍 Rechercher..."
                    value={modelSearch}
                    onChange={(e) => setModelSearch(e.target.value)}
                    className={styles.searchBox}
                    autoFocus
                  />
                </div>
              )}

              <div className={styles.dropdownContent}>
                {models.length === 0 ? (
                  <div className={styles.noResults}>
                    <div className={styles.loading}>Chargement des modèles...</div>
                  </div>
                ) : (
                  <>
                    {popularModels.length > 0 && (
                      <>
                        <div className={styles.sectionLabel}>⭐ Modèles populaires</div>
                        {popularModels.map(model => (
                          <div
                            key={model.id}
                            className={`${styles.option} ${selectedModel === model.id ? styles.selected : ''}`}
                            onClick={() => {
                              onModelChange(model.id);
                              setModelSearch('');
                              setShowModelDropdown(false);
                            }}
                          >
                            {getModelName(model)}
                          </div>
                        ))}
                      </>
                    )}

                    {otherModels.length > 0 && (
                      <>
                        <div className={styles.sectionLabel}>📋 Autres modèles</div>
                        {otherModels.map(model => (
                          <div
                            key={model.id}
                            className={`${styles.option} ${selectedModel === model.id ? styles.selected : ''}`}
                            onClick={() => {
                              onModelChange(model.id);
                              setModelSearch('');
                              setShowModelDropdown(false);
                            }}
                          >
                            {getModelName(model)}
                          </div>
                        ))}
                      </>
                    )}

                    {filteredModels.length === 0 && models.length > 0 && (
                      <div className={styles.noResults}>
                        Aucun modèle trouvé pour "{modelSearch}"
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className={styles.dropdownFooter}>
                <button
                  type="button"
                  onClick={() => {
                    setShowModelDropdown(false);
                    setModelSearch('');
                  }}
                  className={styles.closeBtn}
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
