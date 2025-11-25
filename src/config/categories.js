/**
 * Configuration centrale des catégories multilingue
 *
 * RÈGLE FONDAMENTALE : Les slugs ne changent JAMAIS
 * Seules les traductions (name_fr, name_en, name_ar) changent
 *
 * Structure d'une catégorie :
 * - id: Identifiant unique de la catégorie
 * - slug: URL slug (ne change jamais, utilisé pour les routes)
 * - name: Objet contenant les traductions (fr, en, ar)
 * - icon: Emoji représentant la catégorie
 * - showInMainMenu: true si la catégorie apparaît dans le menu principal
 * - hasSubcategories: true si la catégorie a des sous-catégories
 * - subcategories: Tableau des sous-catégories (optionnel)
 * - displayOrder: Ordre d'affichage dans le menu
 */

export const CATEGORIES_CONFIG = [
  // ============================================
  // CATÉGORIES DU MENU PRINCIPAL
  // ============================================

  // Catégorie Véhicules avec ses sous-catégories
  {
    id: 'vehicles',
    slug: 'vehicles',
    name: {
      fr: 'Véhicules',
      en: 'Vehicles',
      ar: 'مركبات'
    },
    icon: '🚗',
    iconType: 'emoji',
    showInMainMenu: true,
    hasSubcategories: true,
    subcategories: [
      {
        id: 'vehicles-cars',
        slug: 'vehicles',
        subType: 'voiture',
        name: {
          fr: 'Voitures',
          en: 'Cars',
          ar: 'سيارات'
        }
      },
      {
        id: 'vehicles-motos',
        slug: 'vehicles',
        subType: 'moto',
        name: {
          fr: 'Motos',
          en: 'Motorcycles',
          ar: 'دراجات نارية'
        }
      },
      {
        id: 'vehicles-trucks',
        slug: 'vehicles',
        subType: 'camion',
        name: {
          fr: 'Camions',
          en: 'Trucks',
          ar: 'شاحنات'
        }
      },
      {
        id: 'vehicles-parts',
        slug: 'vehicles',
        subType: 'pieces',
        name: {
          fr: 'Pièces Auto',
          en: 'Auto Parts',
          ar: 'قطع غيار'
        }
      }
    ],
    displayOrder: 1
  },

  // Catégorie Immobilier (vente uniquement)
  {
    id: 'real-estate',
    slug: 'real-estate-sale',
    name: {
      fr: 'Immobilier',
      en: 'Real Estate',
      ar: 'عقارات'
    },
    icon: '🏠',
    iconType: 'emoji',
    showInMainMenu: true,
    hasSubcategories: false,
    displayOrder: 2
  },

  // Catégorie Location Immobilière
  {
    id: 'real-estate-rent',
    slug: 'real-estate-rent',
    name: {
      fr: 'Location Immobilière',
      en: 'Property Rental',
      ar: 'إيجار عقاري'
    },
    icon: '🏘️',
    iconType: 'emoji',
    showInMainMenu: true,
    hasSubcategories: false,
    displayOrder: 3
  },

  // Catégorie Location Vacances
  {
    id: 'vacation-rental',
    slug: 'vacation-rental',
    name: {
      fr: 'Location Vacances',
      en: 'Vacation Rental',
      ar: 'تأجير عطلات'
    },
    icon: '🏖️',
    iconType: 'emoji',
    showInMainMenu: true,
    hasSubcategories: false,
    displayOrder: 4
  },

  // Catégorie Location Véhicules
  {
    id: 'vehicle-rental',
    slug: 'vehicle-rental',
    name: {
      fr: 'Location Véhicules',
      en: 'Vehicle Rental',
      ar: 'تأجير مركبات'
    },
    icon: '🚙',
    iconType: 'emoji',
    showInMainMenu: true,
    hasSubcategories: false,
    displayOrder: 5
  },

  // Catégorie Emploi
  {
    id: 'employment',
    slug: 'employment',
    name: {
      fr: 'Emploi',
      en: 'Jobs',
      ar: 'وظائف'
    },
    icon: '💼',
    iconType: 'emoji',
    showInMainMenu: true,
    hasSubcategories: false,
    displayOrder: 6
  },

  // Catégorie Électronique
  {
    id: 'electronics',
    slug: 'electronics',
    name: {
      fr: 'Électronique',
      en: 'Electronics',
      ar: 'إلكترونيات'
    },
    icon: '📱',
    iconType: 'emoji',
    showInMainMenu: true,
    hasSubcategories: false,
    displayOrder: 7
  },

  // Catégorie Services
  {
    id: 'services',
    slug: 'services',
    name: {
      fr: 'Services',
      en: 'Services',
      ar: 'خدمات'
    },
    icon: '🔧',
    iconType: 'emoji',
    showInMainMenu: true,
    hasSubcategories: false,
    displayOrder: 8
  },

  // Catégorie Mode & Beauté
  {
    id: 'fashion-beauty',
    slug: 'fashion-beauty',
    name: {
      fr: 'Mode & Beauté',
      en: 'Fashion & Beauty',
      ar: 'أزياء وجمال'
    },
    icon: '👗',
    iconType: 'emoji',
    showInMainMenu: true,
    hasSubcategories: false,
    displayOrder: 9
  },

  // Menu "Plus" - affiche les catégories additionnelles
  {
    id: 'more',
    slug: null,
    name: {
      fr: 'Plus',
      en: 'More',
      ar: 'المزيد'
    },
    icon: '➕',
    iconType: 'emoji',
    showInMainMenu: true,
    isDropdownMenu: true,
    displayOrder: 10
  },

  // ============================================
  // CATÉGORIES DANS LE MENU "PLUS"
  // ============================================
  {
    id: 'home-garden',
    slug: 'home-garden',
    name: {
      fr: 'Maison & Jardin',
      en: 'Home & Garden',
      ar: 'منزل وحديقة'
    },
    icon: '🏡',
    iconType: 'emoji',
    showInMainMenu: false,
    displayOrder: 11
  },
  {
    id: 'leisure',
    slug: 'leisure',
    name: {
      fr: 'Loisirs',
      en: 'Leisure',
      ar: 'ترفيه'
    },
    icon: '🎾',
    iconType: 'emoji',
    showInMainMenu: false,
    displayOrder: 12
  },
  {
    id: 'animals',
    slug: 'animals',
    name: {
      fr: 'Animaux',
      en: 'Animals',
      ar: 'حيوانات'
    },
    icon: '🐕',
    iconType: 'emoji',
    showInMainMenu: false,
    displayOrder: 13
  },
  {
    id: 'baby-kids',
    slug: 'baby-kids',
    name: {
      fr: 'Bébé & Enfants',
      en: 'Baby & Kids',
      ar: 'أطفال ورضع'
    },
    icon: '👶',
    iconType: 'emoji',
    showInMainMenu: false,
    displayOrder: 14
  },
  {
    id: 'professional-equipment',
    slug: 'professional-equipment',
    name: {
      fr: 'Store Pro',
      en: 'Pro Store',
      ar: 'متجر محترف'
    },
    icon: '💼',
    iconType: 'emoji',
    showInMainMenu: false,
    displayOrder: 15
  },
  {
    id: 'books-media',
    slug: 'books-media',
    name: {
      fr: 'Livres & Multimédia',
      en: 'Books & Media',
      ar: 'كتب ووسائط'
    },
    icon: '📚',
    iconType: 'emoji',
    showInMainMenu: false,
    displayOrder: 16
  },
  {
    id: 'equipment-rental',
    slug: 'equipment-rental',
    name: {
      fr: 'Location Équipements',
      en: 'Equipment Rental',
      ar: 'تأجير معدات'
    },
    icon: '🔨',
    iconType: 'emoji',
    showInMainMenu: false,
    displayOrder: 17
  },
  {
    id: 'home',
    slug: 'home',
    name: {
      fr: 'Maison',
      en: 'Home',
      ar: 'منزل'
    },
    icon: '🛋️',
    iconType: 'emoji',
    showInMainMenu: false,
    displayOrder: 18
  }
];

// ============================================
// FONCTIONS HELPER POUR MANIPULER LES CATÉGORIES
// ============================================

/**
 * Récupère toutes les catégories qui doivent apparaître dans le menu principal
 * @returns {Array} Tableau des catégories avec showInMainMenu: true
 */
export const getMainMenuCategories = () =>
  CATEGORIES_CONFIG.filter(cat => cat.showInMainMenu);

/**
 * Récupère toutes les catégories qui doivent apparaître dans le menu "Plus"
 * @returns {Array} Tableau des catégories cachées du menu principal
 */
export const getMoreCategories = () =>
  CATEGORIES_CONFIG.filter(cat => !cat.showInMainMenu && !cat.isDropdownMenu);

/**
 * Trouve une catégorie par son slug
 * @param {string} slug - Le slug de la catégorie à trouver
 * @returns {Object|undefined} La catégorie trouvée ou undefined
 */
export const findCategoryBySlug = (slug) =>
  CATEGORIES_CONFIG.find(cat => cat.slug === slug);

/**
 * Trouve une catégorie par son ID
 * @param {string} id - L'ID de la catégorie à trouver
 * @returns {Object|undefined} La catégorie trouvée ou undefined
 */
export const findCategoryById = (id) =>
  CATEGORIES_CONFIG.find(cat => cat.id === id);
