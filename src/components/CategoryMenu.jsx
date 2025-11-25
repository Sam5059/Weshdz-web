import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useCategory } from '../contexts/CategoryContext';
import { getCategoryName } from '../utils/categoryHelpers';
import styles from './CategoryMenu.module.css';

export default function CategoryMenu() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const {
    categories,
    selectedCategory,
    handleCategorySelect
  } = useCategory();

  const shouldHideMenu = () => {
    const hiddenPaths = ['/login', '/register', '/forgot-password'];
    return hiddenPaths.some(path => location.pathname.startsWith(path));
  };

  if (shouldHideMenu()) {
    return null;
  }

  const handleCategoryClick = (category) => {
    // Si la catégorie est déjà sélectionnée, la désélectionner
    if (selectedCategory === category.id) {
      handleCategorySelect(null, null);
    } else {
      handleCategorySelect(category.id, category.slug);
    }
    navigate('/');
  };

  const mainCategories = categories
    .filter(cat => !cat?.parent_id)
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

  return (
    <div className={styles.categoryMenuWrapper}>
      <div className={styles.categoriesWrapper}>
        <nav className={styles.categoryNav}>
          {mainCategories.map(category => (
            <div
              key={category.id}
              className={styles.categoryItem}
            >
              <button
                className={`${styles.categoryLink} ${selectedCategory === category.id ? styles.active : ''}`}
                onClick={() => handleCategoryClick(category)}
              >
                <span className={styles.categoryIcon}>{category.icon}</span>
                <span>{getCategoryName(category, language)}</span>
              </button>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
