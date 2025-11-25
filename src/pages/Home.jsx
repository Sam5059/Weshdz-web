import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useCategory } from '../contexts/CategoryContext';
import FilterSidebar from '../components/FilterSidebar';
import AdBanner from '../components/AdBanner';
import { getCategoryName } from '../utils/categoryHelpers';
import { getCommuneName } from '../utils/communeHelpers';
import { enrichListingsWithVehicleData } from '../utils/listingHelpers';
import { getDbColumnName, shouldApplyFilter } from '../utils/filterMapping';
import { applySmartSearch } from '../utils/smartSearch';
import { wilayas } from '../data/wilayas';
import styles from './Home.module.css';

export default function Home() {
  const { slug } = useParams();
  const location = useLocation();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const {
    categories,
    subcategories,
    selectedCategory,
    selectedSubcategory,
    filters,
    handleCategorySelect,
    updateFilters,
    setFilters
  } = useCategory();

  const [listings, setListings] = useState([]);
  const [trendingListings, setTrendingListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [favorites, setFavorites] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [contentPaddingTop, setContentPaddingTop] = useState(220);
  const [showCategoryMismatchPopup, setShowCategoryMismatchPopup] = useState(false);
  const [pendingSearchFilters, setPendingSearchFilters] = useState(null);
  const [detectedKeywordCategory, setDetectedKeywordCategory] = useState(null);
  const listingsGridRef = useRef(null);

  useEffect(() => {
    const updateContentPosition = () => {
      const categoryMenu = document.querySelector('[class*="categoryMenu"]');
      const subcategoryBar = document.querySelector('[class*="subcategoryBar"]');

      if (categoryMenu) {
        const menuHeight = categoryMenu.offsetHeight;
        const subcategoryHeight = subcategoryBar ? subcategoryBar.offsetHeight : 0;
        const headerHeight = 72;
        const totalTopOffset = headerHeight + menuHeight + subcategoryHeight;
        setContentPaddingTop(totalTopOffset);
      }
    };

    setTimeout(updateContentPosition, 100);

    const observer = new MutationObserver(updateContentPosition);
    const categoryMenu = document.querySelector('[class*="categoryMenu"]');
    const subcategoryBar = document.querySelector('[class*="subcategoryBar"]');

    if (categoryMenu) {
      observer.observe(categoryMenu, {
        attributes: true,
        childList: true,
        subtree: true
      });
    }

    if (subcategoryBar) {
      observer.observe(subcategoryBar, {
        attributes: true,
        childList: true,
        subtree: true
      });
    }

    window.addEventListener('resize', updateContentPosition);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateContentPosition);
    };
  }, [selectedCategory, selectedSubcategory]);

  useEffect(() => {
    fetchData();
    // Scroll en haut quand les filtres changent
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters, language]);

  useEffect(() => {
    if (location.state?.searchFilters) {
      handleSearch(location.state.searchFilters);
      window.history.replaceState({}, document.title);
    }
    if (location.state?.detectedCategory) {
      handleCategoryDetected(location.state.detectedCategory);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  // Scroll en haut quand on change de catégorie
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedCategory, selectedSubcategory]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= 500) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleResizeStart = () => {
    setIsResizing(true);
  };

  const handleSidebarContentChange = (newWidth) => {
    if (sidebarOpen) {
      setSidebarWidth(newWidth);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {

      let query = supabase
        .from('listings')
        .select(`
          *,
          profiles(full_name),
          categories!listings_category_id_fkey(name, name_fr),
          communes!listings_commune_fkey(name_fr, name_ar, name_en, wilaya_code),
          brands(name),
          models(name)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      // CRITICAL: Apply category filters FIRST, before search
      // This ensures subcategory filtering works even with search terms
      if (filters.subcategory_id) {
        // Filtrer uniquement par la sous-catégorie sélectionnée
        query = query.eq('category_id', filters.subcategory_id);
      } else if (filters.category_id) {
        const { data: childCategories } = await supabase
          .from('categories')
          .select('id')
          .eq('parent_id', filters.category_id);

        const categoryIds = [filters.category_id];
        if (childCategories && childCategories.length > 0) {
          categoryIds.push(...childCategories.map(c => c.id));
        }

        query = query.in('category_id', categoryIds);
      } else if (selectedCategory) {
        const { data: childCategories } = await supabase
          .from('categories')
          .select('id')
          .eq('parent_id', selectedCategory);

        const categoryIds = [selectedCategory];
        if (childCategories && childCategories.length > 0) {
          categoryIds.push(...childCategories.map(c => c.id));
        }

        query = query.in('category_id', categoryIds);
      }

      // THEN apply smart search on the already filtered results
      if (filters.searchTerm) {
        // Recherche intelligente multi-catégories
        // Détermine automatiquement le type de recherche selon le contexte
        let categorySlug = null;

        // Si une catégorie est sélectionnée, on l'utilise pour optimiser la recherche
        if (filters.category_id || selectedCategory) {
          const categoryId = filters.category_id || selectedCategory;
          const { data: categoryData } = await supabase
            .from('categories')
            .select('slug')
            .eq('id', categoryId)
            .maybeSingle();

          if (categoryData) {
            categorySlug = categoryData.slug;
          }
        }

        // Appliquer la recherche intelligente par keywords
        query = await applySmartSearch(query, filters.searchTerm, categorySlug);
      }

      if (filters.wilaya) {
        query = query.eq('wilaya', filters.wilaya);
      }

      if (filters.offer_type) {
        query = query.eq('offer_type', filters.offer_type);
      }

      // Filtres véhicules
      if (filters.brand) {
        query = query.eq('brand_id', filters.brand);
      }

      if (filters.model) {
        query = query.eq('model_id', filters.model);
      }

      if (filters.year) {
        query = query.eq('year', parseInt(filters.year));
      }

      if (filters.mileage) {
        query = query.lte('mileage', parseInt(filters.mileage));
      }

      if (filters.minPrice) {
        query = query.gte('price', parseFloat(filters.minPrice));
      }

      if (filters.maxPrice) {
        query = query.lte('price', parseFloat(filters.maxPrice));
      }

      // Filtre par date de publication
      if (filters.date_filter) {
        const now = new Date();
        let dateThreshold;

        switch (filters.date_filter) {
          case 'today':
            dateThreshold = new Date(now.setHours(0, 0, 0, 0));
            break;
          case 'week':
            dateThreshold = new Date(now.setDate(now.getDate() - 7));
            break;
          case 'month':
            dateThreshold = new Date(now.setMonth(now.getMonth() - 1));
            break;
          default:
            dateThreshold = null;
        }

        if (dateThreshold) {
          query = query.gte('created_at', dateThreshold.toISOString());
        }
      }

      // Filtres dynamiques par catégorie
      if (filters.dynamicFilters && Object.keys(filters.dynamicFilters).length > 0) {
        Object.entries(filters.dynamicFilters).forEach(([key, value]) => {
          if (value !== null && value !== '' && value !== undefined) {
            // Vérifier si ce filtre doit être appliqué à la BDD
            if (!shouldApplyFilter(key)) {
              return; // Ignorer les filtres UI uniquement
            }

            // Obtenir le nom de colonne BDD correspondant
            const dbColumn = getDbColumnName(key);
            if (!dbColumn) {
              return; // Ignorer si pas de mapping
            }

            // Gérer les filtres de type range
            if (typeof value === 'object' && !Array.isArray(value)) {
              Object.entries(value).forEach(([rangeKey, rangeValue]) => {
                if (rangeValue !== '' && rangeValue !== null && rangeValue !== undefined) {
                  // Pour les champs year_min/year_max, mileage_min/mileage_max etc.
                  if (rangeKey.includes('_min')) {
                    const fieldName = rangeKey.replace('_min', '');
                    query = query.gte(fieldName, parseFloat(rangeValue));
                  } else if (rangeKey.includes('_max')) {
                    const fieldName = rangeKey.replace('_max', '');
                    query = query.lte(fieldName, parseFloat(rangeValue));
                  }
                }
              });
            }
            // Gérer les arrays (checkboxes multiples)
            else if (Array.isArray(value)) {
              // Pour les amenities/features, filter par checkboxes true
              value.forEach(amenityKey => {
                if (amenityKey) {
                  query = query.eq(amenityKey, true);
                }
              });
            }
            // Gérer les valeurs simples (select, number, text)
            else {
              // Gérer les cas spéciaux des ranges
              if (key === 'mileage_range') {
                const ranges = {
                  '0-50000': [0, 50000],
                  '50000-100000': [50000, 100000],
                  '100000-150000': [100000, 150000],
                  '150000+': [150000, 999999999]
                };
                const range = ranges[value];
                if (range) {
                  query = query.gte('mileage', range[0]).lte('mileage', range[1]);
                }
              } else if (key === 'capacity') {
                // Gérer capacity range pour Location Vacances
                const capacityRanges = {
                  '1-2': [1, 2],
                  '3-4': [3, 4],
                  '5-6': [5, 6],
                  '7+': [7, 999]
                };
                const range = capacityRanges[value];
                if (range) {
                  query = query.gte('guest_capacity', range[0]).lte('guest_capacity', range[1]);
                }
              } else {
                // Pour tous les autres champs, appliquer avec le nom de colonne BDD
                query = query.eq(dbColumn, value);
              }
            }
          }
        });
      }

      const { data: listingsData } = await query.limit(50);
      if (listingsData) {
        const enrichedListings = await enrichListingsWithVehicleData(listingsData);
        setListings(enrichedListings);
      }

      const { data: trendingData } = await supabase
        .from('listings')
        .select(`
          *,
          profiles(full_name),
          categories!listings_category_id_fkey(name, name_fr),
          communes!listings_commune_fkey(name_fr, name_ar, name_en, wilaya_code)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(8);

      if (trendingData) {
        const enrichedTrending = await enrichListingsWithVehicleData(trendingData);
        setTrendingListings(enrichedTrending);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryDetected = async (detectedCategory) => {
    const { data: categoryData } = await supabase
      .from('categories')
      .select('id, slug')
      .eq('slug', detectedCategory.slug)
      .maybeSingle();

    if (categoryData) {
      handleCategorySelect(categoryData.id, categoryData.slug);

      if (!sidebarOpen) {
        setSidebarOpen(true);
      }
    }
  };

  const handleSearch = async (searchFilters) => {
    // Si une catégorie est déjà sélectionnée et qu'un terme de recherche est fourni
    if (selectedCategory && searchFilters.searchTerm) {
      // Vérifier si le keyword appartient à une catégorie différente
      const { data: keywordData } = await supabase
        .from('keywords')
        .select('keyword, entity_type, entity_id')
        .ilike('keyword', searchFilters.searchTerm.trim())
        .order('weight', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (keywordData) {
        // Si c'est un keyword de véhicule (brand ou model)
        if (keywordData.entity_type === 'vehicle_brand' || keywordData.entity_type === 'vehicle_model') {
          // Récupérer les catégories véhicules
          const { data: vehicleCategories } = await supabase
            .from('categories')
            .select('id, name_fr, slug')
            .or('slug.eq.vehicules,slug.eq.voitures,slug.eq.motos,slug.eq.camions');

          if (vehicleCategories && vehicleCategories.length > 0) {
            const vehicleCategoryIds = vehicleCategories.map(c => c.id);

            // Si la catégorie sélectionnée n'est pas une catégorie véhicule
            if (!vehicleCategoryIds.includes(selectedCategory)) {
              // Afficher le popup
              setDetectedKeywordCategory({
                name: 'Véhicules',
                categoryId: vehicleCategories[0].id,
                slug: vehicleCategories[0].slug,
                keyword: keywordData.keyword
              });
              setPendingSearchFilters(searchFilters);
              setShowCategoryMismatchPopup(true);
              return; // Ne pas continuer la recherche
            }
          }
        }
      }
    }

    // Continuer normalement si pas de conflit
    setFilters(searchFilters);

    if (user && searchFilters.searchTerm) {
      await supabase.from('search_history').insert({
        user_id: user.id,
        search_term: searchFilters.searchTerm,
        filters: searchFilters
      });
    }
  };

  const confirmCategoryChange = () => {
    if (detectedKeywordCategory && pendingSearchFilters) {
      // Changer de catégorie
      handleCategorySelect(detectedKeywordCategory.categoryId, detectedKeywordCategory.slug);
      // Appliquer la recherche
      setFilters(pendingSearchFilters);
    }
    setShowCategoryMismatchPopup(false);
    setPendingSearchFilters(null);
    setDetectedKeywordCategory(null);
  };

  const cancelCategoryChange = () => {
    // Appliquer la recherche dans la catégorie actuelle
    if (pendingSearchFilters) {
      setFilters(pendingSearchFilters);
    }
    setShowCategoryMismatchPopup(false);
    setPendingSearchFilters(null);
    setDetectedKeywordCategory(null);
  };

  const handleCategoryClick = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      handleCategorySelect(category.id, category.slug);

      if (!sidebarOpen) {
        setSidebarOpen(true);
      }

    }
  };

  const getCategoryBadge = (category) => {
    if (!category) return 'Offre';

    const categoryName = (category.name_fr || category.name || '').toLowerCase();

    if (categoryName.includes('immobilier') || categoryName.includes('location') || categoryName.includes('louer')) {
      return 'Location';
    } else if (categoryName.includes('emploi') || categoryName.includes('job') || categoryName.includes('travail')) {
      return 'Emploi';
    } else if (categoryName.includes('service')) {
      return 'Service';
    } else if (categoryName.includes('véhicule') || categoryName.includes('voiture') || categoryName.includes('moto')) {
      return 'Véhicule';
    }

    return 'Offre';
  };

  const getWilayaCode = (wilayaName) => {
    const wilaya = wilayas.find(w => w.name === wilayaName);
    return wilaya ? wilaya.code : '';
  };

  const fetchFavorites = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('favorites')
      .select('listing_id')
      .eq('user_id', user.id);

    if (data) {
      setFavorites(data.map(f => f.listing_id));
    }
  };

  const toggleFavorite = async (listingId) => {
    if (!user) {
      alert('Vous devez être connecté pour ajouter aux favoris');
      return;
    }

    const isFavorite = favorites.includes(listingId);

    if (isFavorite) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('listing_id', listingId);

      if (!error) {
        setFavorites(favorites.filter(id => id !== listingId));
      }
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          listing_id: listingId
        });

      if (!error) {
        setFavorites([...favorites, listingId]);
      }
    }
  };

  const getSortedListings = () => {
    let sorted = [...listings];

    switch (sortBy) {
      case 'price_asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'recent':
        return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      default:
        return sorted;
    }
  };

  return (
    <div className={styles.home}>
      {/* Popup de confirmation de changement de catégorie */}
      {showCategoryMismatchPopup && detectedKeywordCategory && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <h3>🔍 Recherche détectée dans une autre catégorie</h3>
            <p>
              Le mot-clé <strong>"{detectedKeywordCategory.keyword}"</strong> appartient à la catégorie <strong>{detectedKeywordCategory.name}</strong>.
            </p>
            <p>Voulez-vous rechercher dans la catégorie <strong>{detectedKeywordCategory.name}</strong> ?</p>
            <div className={styles.popupActions}>
              <button
                onClick={confirmCategoryChange}
                className={styles.confirmBtn}
              >
                ✓ Oui, changer de catégorie
              </button>
              <button
                onClick={cancelCategoryChange}
                className={styles.cancelBtn}
              >
                ✕ Non, rester dans la catégorie actuelle
              </button>
            </div>
          </div>
        </div>
      )}

      <section className={styles.mainContent}>
        <div className={styles.container}>
          <AdBanner />

          <div className={styles.contentGrid}>
            {/* Left Ad Space */}
            <aside className={styles.leftAdSpace}>
              <div className={styles.stickyAd}>
                <span className={styles.adLabel}>Publicité</span>
                <div className={styles.verticalAdPlaceholder}>
                  <p>160x600</p>
                </div>
              </div>
            </aside>

            <aside
              className={`${styles.sidebarWrapper} ${!sidebarOpen ? styles.sidebarClosed : ''} ${isResizing ? styles.resizing : ''}`}
              style={{ width: sidebarOpen ? `${sidebarWidth}px` : '50px' }}
            >
              {sidebarOpen && (
                <>
                  <FilterSidebar
                    onFilterChange={handleSearch}
                    selectedCategory={selectedCategory}
                    onContentChange={handleSidebarContentChange}
                  />
                  <div
                    className={styles.resizeHandle}
                    onMouseDown={handleResizeStart}
                    title="Glisser pour redimensionner"
                  >
                    <div className={styles.resizeHandleBar}></div>
                  </div>
                </>
              )}
              <button
                className={styles.sidebarToggle}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                title={sidebarOpen ? 'Masquer les filtres' : 'Afficher les filtres'}
              >
                {sidebarOpen ? '◀' : '▶'}
              </button>
            </aside>

            <main className={`${styles.listingsWrapper} ${!sidebarOpen ? styles.listingsExpanded : ''}`}>

              {/* Trending Section - Show when no category selected */}
              {trendingListings.length > 0 && !selectedCategory && (
                <div className={styles.trendingSection}>
                  <div className={styles.trendingHeader}>
                    <h2>🔥 {t('home.newTrends')}</h2>
                    <p>{t('home.recentAds')}</p>
                  </div>
                  <div className={styles.trendingScroll}>
                    {trendingListings.map(listing => (
                      <Link
                        key={listing.id}
                        to={`/listing/${listing.id}`}
                        className={styles.trendingCard}
                      >
                        <div className={styles.trendingImageWrapper}>
                          {listing.images && listing.images.length > 0 ? (
                            <img src={listing.images[0]} alt={listing.title} />
                          ) : (
                            <div className={styles.trendingNoImage}>📷</div>
                          )}
                          <span className={styles.trendingBadge}>{t('home.newBadge')}</span>
                        </div>
                        <div className={styles.trendingContent}>
                          <h3>{listing.title}</h3>
                          <div className={styles.trendingPrice}>
                            {listing.price ? (
                              <>
                                {listing.price.toLocaleString()} DA
                                {listing.listing_type === 'louer' && listing.rental_duration && (
                                  <span style={{ fontSize: '0.85em', opacity: 0.8 }}>
                                    /{listing.rental_duration === 'jour' ? 'jour' : listing.rental_duration === 'semaine' ? 'semaine' : 'mois'}
                                  </span>
                                )}
                              </>
                            ) : 'Prix sur demande'}
                          </div>
                          {listing.communes && (
                            <div className={styles.trendingLocation}>
                              📍 {listing.communes.name_fr}, {listing.communes.wilaya_code}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.listingsHeader}>
                <div className={styles.headerLeft}>
                  <h2>{selectedCategory ? getCategoryName(categories.find(c => c.id === selectedCategory), language) : t('home.allListings')}</h2>
                  <span className={styles.resultCount}>{listings.length} {t('home.results')}</span>
                </div>
                <select
                  className={styles.sortSelect}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recent">{t('home.sortRecent')}</option>
                  <option value="oldest">{t('home.sortOldest')}</option>
                  <option value="price_asc">{t('home.sortPriceAsc')}</option>
                  <option value="price_desc">{t('home.sortPriceDesc')}</option>
                </select>
              </div>
              {loading ? (
                <div className={styles.loading}>
                  <div className={styles.spinner}></div>
                  <p>{t('home.loading')}</p>
                </div>
          ) : listings.length === 0 ? (
                <div className={styles.noResults}>
                  <div className={styles.noResultsIcon}>🔍</div>
                  <p>{t('home.noResults')}</p>
                  <span>{t('home.noResultsDesc')}</span>
                </div>
          ) : (
                <div ref={listingsGridRef} className={styles.listingGrid}>
                  {getSortedListings().map((listing, index) => (
                    <>
                      {index > 0 && index % 5 === 0 && (
                        <div key={`ad-${index}`} className={styles.adCard}>
                          <span className={styles.adLabel}>Publicité</span>
                          <div className={styles.inlineAdPlaceholder}>
                            <p>300x250</p>
                          </div>
                        </div>
                      )}
                    <div key={listing.id} className={styles.listingCard}>
                      <div className={styles.listingImageWrapper}>
                        <button
                          className={styles.favoriteBtn}
                          onClick={(e) => {
                            e.preventDefault();
                            toggleFavorite(listing.id);
                          }}
                          style={{
                            color: favorites.includes(listing.id) ? '#ff4757' : '#ddd',
                            filter: favorites.includes(listing.id) ? 'none' : 'grayscale(100%)'
                          }}
                        >
                          ❤️
                        </button>
                        <Link to={`/listing/${listing.id}`} className={styles.listingImage}>
                          {listing.images && listing.images.length > 0 ? (
                            <img src={listing.images[0]} alt={listing.title} />
                          ) : (
                            <div className={styles.noImage}>📷</div>
                          )}
                        </Link>
                        <span className={styles.categoryBadge}>
                          {getCategoryBadge(listing.categories)}
                        </span>
                        {listing.communes && (
                          <span className={styles.locationBadge}>
                            {listing.communes.name_fr}, {listing.communes.wilaya_code}
                          </span>
                        )}
                      </div>

                      <div className={styles.listingContent}>
                        <Link to={`/listing/${listing.id}`} className={styles.listingLink}>
                          <h3 className={styles.listingTitle}>{listing.title}</h3>

                          <div className={styles.listingDetails}>
                            {/* Marque et modèle de véhicule */}
                            {listing.brands?.name && (
                              <span className={styles.detailItem}>
                                <span className={styles.detailIcon}>🏷️</span>
                                {listing.brands.name}
                              </span>
                            )}
                            {listing.models?.name && (
                              <span className={styles.detailItem}>
                                <span className={styles.detailIcon}>📋</span>
                                {listing.models.name}
                              </span>
                            )}
                            {listing.year && (
                              <span className={styles.detailItem}>
                                <span className={styles.detailIcon}>📅</span>
                                {listing.year}
                              </span>
                            )}
                            {listing.mileage && (
                              <span className={styles.detailItem}>
                                <span className={styles.detailIcon}>⚡</span>
                                {listing.mileage.toLocaleString()} km
                              </span>
                            )}
                            {listing.transmission && (
                              <span className={styles.detailItem}>
                                <span className={styles.detailIcon}>⚙️</span>
                                {listing.transmission === 'automatic' ? 'Automatique' : listing.transmission === 'manual' ? 'Manuelle' : listing.transmission}
                              </span>
                            )}
                            {listing.fuel_type && (
                              <span className={styles.detailItem}>
                                <span className={styles.detailIcon}>⛽</span>
                                {listing.fuel_type === 'essence' ? 'Essence' : listing.fuel_type === 'diesel' ? 'Diesel' : listing.fuel_type === 'electric' ? 'Électrique' : listing.fuel_type === 'hybrid' ? 'Hybride' : listing.fuel_type}
                              </span>
                            )}

                            {/* Informations immobilier */}
                            {listing.bedrooms && (
                              <span className={styles.detailItem}>
                                <span className={styles.detailIcon}>🛏️</span>
                                {listing.bedrooms} {listing.bedrooms > 1 ? 'chambres' : 'chambre'}
                              </span>
                            )}
                            {listing.bathrooms && (
                              <span className={styles.detailItem}>
                                <span className={styles.detailIcon}>🚿</span>
                                {listing.bathrooms} {listing.bathrooms > 1 ? 'salles de bain' : 'salle de bain'}
                              </span>
                            )}
                            {listing.surface && (
                              <span className={styles.detailItem}>
                                <span className={styles.detailIcon}>📐</span>
                                {listing.surface} m²
                              </span>
                            )}

                            {/* Informations emploi */}
                            {listing.contract_type && (
                              <span className={styles.detailItem}>
                                <span className={styles.detailIcon}>💼</span>
                                {listing.contract_type.toUpperCase()}
                              </span>
                            )}
                            {listing.experience_level && (
                              <span className={styles.detailItem}>
                                <span className={styles.detailIcon}>📊</span>
                                {listing.experience_level}
                              </span>
                            )}

                            {/* Informations services */}
                            {listing.pricing_type && (
                              <span className={styles.detailItem}>
                                <span className={styles.detailIcon}>💰</span>
                                {listing.pricing_type}
                              </span>
                            )}
                            {listing.availability && (
                              <span className={styles.detailItem}>
                                <span className={styles.detailIcon}>📅</span>
                                {listing.availability}
                              </span>
                            )}

                            {/* Informations location vacances */}
                            {listing.accommodation_type && (
                              <span className={styles.detailItem}>
                                <span className={styles.detailIcon}>🏠</span>
                                {listing.accommodation_type}
                              </span>
                            )}
                            {listing.capacity && (
                              <span className={styles.detailItem}>
                                <span className={styles.detailIcon}>👥</span>
                                {listing.capacity} {listing.capacity > 1 ? 'personnes' : 'personne'}
                              </span>
                            )}
                          </div>

                          {listing.description && (
                            <p className={styles.listingDescription}>{listing.description}</p>
                          )}

                          <div className={styles.listingFooter}>
                            <div className={styles.listingPrice}>
                              {listing.price ? (
                                <>
                                  {listing.price.toLocaleString()} DA
                                  {listing.listing_type === 'louer' && listing.rental_duration && (
                                    <span style={{ fontSize: '0.85em', opacity: 0.8 }}>
                                      /{listing.rental_duration === 'jour' ? 'jour' : listing.rental_duration === 'semaine' ? 'semaine' : 'mois'}
                                    </span>
                                  )}
                                  {listing.negotiable && (
                                    <span className={styles.negotiableBadge}>Négociable</span>
                                  )}
                                </>
                              ) : 'Prix sur demande'}
                            </div>
                            <div className={styles.listingDate}>
                              🕐 {new Date(listing.created_at).toLocaleDateString('fr-DZ', { day: 'numeric', month: 'short' })}
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    </>
                  ))}
                </div>
              )}
            </main>

            {/* Right Ad Space */}
            <aside className={styles.rightAdSpace}>
              {/* Scrollable Trending Section - Show when category is selected */}
              {trendingListings.length > 0 && selectedCategory && (
                <div className={styles.sidebarTrendingSection}>
                  <h3 className={styles.sidebarTrendingTitle}>🔥 Nouveautés</h3>
                  <div className={styles.sidebarTrendingScroll}>
                    {trendingListings.slice(0, 8).map(listing => (
                      <Link
                        key={listing.id}
                        to={`/listing/${listing.id}`}
                        className={styles.sidebarTrendingCard}
                      >
                        <div className={styles.sidebarTrendingImage}>
                          {listing.images && listing.images.length > 0 ? (
                            <img src={listing.images[0]} alt={listing.title} />
                          ) : (
                            <div className={styles.sidebarTrendingNoImage}>📷</div>
                          )}
                        </div>
                        <div className={styles.sidebarTrendingContent}>
                          <h4>{listing.title}</h4>
                          <div className={styles.sidebarTrendingPrice}>
                            {listing.price ? `${listing.price.toLocaleString()} DA` : 'Prix sur demande'}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Sticky Ad */}
              <div className={styles.stickyAd} style={{ top: `${contentPaddingTop}px` }}>
                <span className={styles.adLabel}>Publicité</span>
                <div className={styles.verticalAdPlaceholder}>
                  <p>160x600</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
