import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { wilayas } from '../data/wilayas';
import { detectCategory, extractFiltersFromSearch } from '../utils/categoryDetection';
import styles from './SearchBar.module.css';

export default function SearchBar({ onSearch, onCategoryDetected, compact = false }) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [category, setCategory] = useState('');
  const [offerType, setOfferType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [detectedCategory, setDetectedCategory] = useState(null);
  const [showCategorySuggestion, setShowCategorySuggestion] = useState(false);
  const debounceTimer = useRef(null);

  // Détection automatique de catégorie avec debounce (500ms)
  useEffect(() => {
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Si le terme est trop court, réinitialiser
    if (searchTerm.length < 3) {
      setDetectedCategory(null);
      setShowCategorySuggestion(false);
      return;
    }

    // Débuter le nouveau timer
    debounceTimer.current = setTimeout(() => {
      const detected = detectCategory(searchTerm);
      if (detected && detected.confidence > 0.3) {
        setDetectedCategory(detected);
        setShowCategorySuggestion(true);
      } else {
        setDetectedCategory(null);
        setShowCategorySuggestion(false);
      }
    }, 500); // 500ms debounce

    // Cleanup
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Extraction des filtres du texte de recherche
    const extractedFilters = detectedCategory
      ? extractFiltersFromSearch(searchTerm, detectedCategory.slug)
      : {};

    const searchFilters = {
      searchTerm,
      wilaya: wilaya || extractedFilters.wilaya,
      category,
      offer_type: offerType,
      minPrice: minPrice || extractedFilters.minPrice,
      maxPrice: maxPrice || extractedFilters.maxPrice,
      ...extractedFilters
    };

    // Si une catégorie a été détectée, notifier le parent
    if (detectedCategory && onCategoryDetected) {
      onCategoryDetected(detectedCategory);
    }

    onSearch(searchFilters);
    setShowCategorySuggestion(false);
  };

  const acceptCategorySuggestion = () => {
    if (detectedCategory && onCategoryDetected) {
      onCategoryDetected(detectedCategory);
    }
    setShowCategorySuggestion(false);
  };

  const dismissCategorySuggestion = () => {
    setShowCategorySuggestion(false);
  };

  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
    setDetectedCategory(null);
    setShowCategorySuggestion(false);
  }, []);

  const handleReset = () => {
    setSearchTerm('');
    setWilaya('');
    setCategory('');
    setOfferType('');
    setMinPrice('');
    setMaxPrice('');
    setDetectedCategory(null);
    setShowCategorySuggestion(false);
    onSearch({});
  };

  return (
    <div className={`${styles.searchBar} ${compact ? styles.compact : ''}`}>
      {/* Suggestion de catégorie détectée */}
      {showCategorySuggestion && detectedCategory && (
        <div className={styles.categorySuggestion}>
          <span className={styles.suggestionText}>
            💡 Recherche dans <strong>{detectedCategory.categoryName || detectedCategory.slug}</strong> ?
            {detectedCategory.matchedKeywords && detectedCategory.matchedKeywords.length > 0 && (
              <span className={styles.matchInfo}>
                ({detectedCategory.matchedKeywords.slice(0, 2).join(', ')})
              </span>
            )}
          </span>
          <div className={styles.suggestionActions}>
            <button
              type="button"
              onClick={acceptCategorySuggestion}
              className={styles.acceptBtn}
              title="Oui, filtrer par cette catégorie"
            >
              ✓ Oui
            </button>
            <button
              type="button"
              onClick={dismissCategorySuggestion}
              className={styles.dismissBtn}
              title="Non, ignorer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <div className={styles.searchRow}>
          <div className={styles.searchInputWrapper}>
            <input
              type="text"
              placeholder={t('searchBar.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className={styles.clearInputBtn}
                title="Effacer la recherche"
                aria-label="Effacer"
              >
                ✕
              </button>
            )}
          </div>

          <select
            value={offerType}
            onChange={(e) => setOfferType(e.target.value)}
            className={styles.searchSelect}
          >
            <option value="">{t('searchBar.all') || 'Tout'}</option>
            <option value="offre">{t('home.offers')}</option>
            <option value="demande">{t('home.demands')}</option>
          </select>

          <select
            value={wilaya}
            onChange={(e) => setWilaya(e.target.value)}
            className={styles.searchSelect}
          >
            <option value="">{t('searchBar.allWilayas')}</option>
            {wilayas.map(w => (
              <option key={w.code} value={w.name}>
                {w.code} - {w.name}
              </option>
            ))}
          </select>

          <div className={styles.priceRange}>
            <input
              type="number"
              placeholder={t('searchBar.minPrice')}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className={styles.priceInput}
            />
            <span className={styles.priceSeparator}>-</span>
            <input
              type="number"
              placeholder={t('searchBar.maxPrice')}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className={styles.priceInput}
            />
          </div>

          <div className={styles.actionButtons}>
            <button type="submit" className={styles.searchBtn} title={t('searchBar.search')}>
              🔍
            </button>
            <button type="button" onClick={handleReset} className={styles.resetBtn} title="Réinitialiser">
              ↺
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
