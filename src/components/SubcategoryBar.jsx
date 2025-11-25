import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useCategory } from '../contexts/CategoryContext';
import { getCategoryName } from '../utils/categoryHelpers';
import styles from './SubcategoryBar.module.css';

export default function SubcategoryBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const {
    categories,
    selectedCategory,
    handleCategorySelect,
    setFilters
  } = useCategory();

  // Ne rien afficher si aucune catégorie n'est sélectionnée
  if (!selectedCategory) {
    return null;
  }

  // Récupérer toutes les sous-catégories de la catégorie sélectionnée
  const subcategories = categories.filter(cat => cat?.parent_id === selectedCategory);

  // Ne rien afficher s'il n'y a pas de sous-catégories
  if (subcategories.length === 0) {
    return null;
  }

  const selectedCat = categories.find(c => c.id === selectedCategory);
  const currentSubcategoryId = location.state?.subcategoryId;

  const handleSubcategoryClick = (subcategory) => {
    setFilters({
      category_id: selectedCategory,
      subcategory_id: subcategory.id
    });
    navigate('/', {
      state: {
        subcategoryId: subcategory.id,
        subcategorySlug: subcategory.slug
      }
    });
  };

  const handleAllClick = () => {
    setFilters({ category_id: selectedCategory });
    navigate('/', { state: {} });
  };

  return (
    <div className={styles.subcategoryBarWrapper}>
      <div className={styles.subcategoryBar}>
        <div className={styles.subcategoryContent}>
          <button
            className={`${styles.subcategoryChip} ${!currentSubcategoryId ? styles.active : ''}`}
            onClick={handleAllClick}
          >
            Tout {selectedCat ? getCategoryName(selectedCat, language) : ''}
          </button>

          {subcategories.map(subcat => (
            <button
              key={subcat.id}
              className={`${styles.subcategoryChip} ${currentSubcategoryId === subcat.id ? styles.active : ''}`}
              onClick={() => handleSubcategoryClick(subcat)}
            >
              {getCategoryName(subcat, language)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
