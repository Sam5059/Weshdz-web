/**
 * CategoryContext - Gestion des catégories et filtres de l'application
 *
 * Ce contexte gère:
 * - La sélection de catégories et sous-catégories
 * - Les filtres actifs sur les listings
 * - La navigation entre les catégories
 * - Le chargement des catégories depuis Supabase
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const CategoryContext = createContext();

/**
 * Provider pour le contexte de catégorie
 * Gère l'état global des catégories et filtres
 */
export function CategoryProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Catégorie actuellement sélectionnée
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Sous-catégorie actuellement sélectionnée
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  // Filtres actifs pour la recherche de listings
  const [filters, setFilters] = useState({});

  // Liste de toutes les catégories principales
  const [categories, setCategories] = useState([]);

  // Liste des sous-catégories de la catégorie sélectionnée
  const [subcategories, setSubcategories] = useState([]);

  // Charge les catégories au montage du composant
  useEffect(() => {
    fetchCategories();
  }, []);

  // Charge les sous-catégories quand une catégorie est sélectionnée
  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories(selectedCategory);
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory]);

  /**
   * Récupère toutes les catégories principales depuis Supabase
   * Triées par display_order
   */
  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (data) {
      setCategories(data);
    }
  };

  /**
   * Récupère les sous-catégories d'une catégorie spécifique
   * @param {string} categoryId - ID de la catégorie parente
   */
  const fetchSubcategories = async (categoryId) => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('parent_id', categoryId)
      .order('display_order', { ascending: true });

    if (data) {
      setSubcategories(data);
    }
  };

  /**
   * Gère la sélection d'une catégorie
   * Sélectionne la catégorie et navigue vers sa page
   * Si null, désélectionne la catégorie
   * @param {string|null} categoryId - ID de la catégorie ou null pour désélectionner
   * @param {string|null} categorySlug - Slug pour l'URL ou null
   */
  const handleCategorySelect = (categoryId, categorySlug) => {
    // Sélectionne ou désélectionne la catégorie
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);

    // Si categoryId est null, réinitialise les filtres
    if (categoryId === null) {
      setFilters({});
    } else {
      setFilters({ category_id: categoryId });
    }

    if (categorySlug) {
      navigate(`/category/${categorySlug}`);
    }
  };

  /**
   * Gère la sélection d'une sous-catégorie
   * @param {string} subcategoryId - ID de la sous-catégorie
   * @param {string} subcategorySlug - Slug pour l'URL
   */
  const handleSubcategorySelect = (subcategoryId, subcategorySlug) => {
    setSelectedSubcategory(subcategoryId);
    setFilters(prev => ({
      ...prev,
      subcategory_id: subcategoryId
    }));

    if (subcategorySlug) {
      navigate(`/category/${subcategorySlug}`);
    }
  };

  /**
   * Met à jour les filtres en fusionnant avec les existants
   * @param {Object} newFilters - Nouveaux filtres à ajouter
   */
  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  /**
   * Réinitialise tous les filtres
   * Conserve uniquement le filtre de catégorie si une catégorie est sélectionnée
   */
  const resetFilters = () => {
    setFilters(selectedCategory ? { category_id: selectedCategory } : {});
    setSelectedSubcategory(null);
  };

  const value = {
    selectedCategory,
    selectedSubcategory,
    filters,
    categories,
    subcategories,
    handleCategorySelect,
    handleSubcategorySelect,
    updateFilters,
    resetFilters,
    setFilters
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
}

/**
 * Hook personnalisé pour accéder au contexte de catégorie
 * @throws {Error} Si utilisé en dehors du CategoryProvider
 * @returns {Object} Contexte contenant toutes les fonctions et états de catégorie
 */
export function useCategory() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategory must be used within CategoryProvider');
  }
  return context;
}
