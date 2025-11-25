/**
 * Configuration complète des filtres dynamiques par catégorie
 * Chaque catégorie a ses propres filtres spécifiques
 */

export const filterConfigs = {
  // VÉHICULES
  vehicules: {
    slug: 'vehicules',
    icon: '🚗',
    filters: [
      {
        id: 'vehicle_type',
        label: 'Type de véhicule',
        icon: '🚙',
        type: 'select',
        options: [
          { value: 'voiture', label: 'Voiture' },
          { value: 'moto', label: 'Moto' },
          { value: 'camion', label: 'Camion' },
          { value: 'utilitaire', label: 'Utilitaire' },
          { value: 'autre', label: 'Autre' }
        ]
      },
      {
        id: 'brand_id',
        label: 'Marque',
        icon: '🏷️',
        type: 'dynamic-brands',
        dbField: 'brand_id'
      },
      {
        id: 'model_id',
        label: 'Modèle',
        icon: '📋',
        type: 'dynamic-models',
        dbField: 'model_id',
        dependsOn: 'brand_id'
      },
      {
        id: 'year_range',
        label: 'Année',
        icon: '📅',
        type: 'range',
        fields: {
          min: 'year_min',
          max: 'year_max'
        },
        placeholder: {
          min: 'De',
          max: 'À'
        },
        min: 1950,
        max: new Date().getFullYear() + 1
      },
      {
        id: 'mileage_range',
        label: 'Kilométrage',
        icon: '⚡',
        type: 'select',
        dbField: 'mileage',
        options: [
          { value: '0-50000', label: 'Moins de 50 000 km' },
          { value: '50000-100000', label: '50 000 - 100 000 km' },
          { value: '100000-150000', label: '100 000 - 150 000 km' },
          { value: '150000+', label: 'Plus de 150 000 km' }
        ]
      },
      {
        id: 'fuel_type',
        label: 'Carburant',
        icon: '⛽',
        type: 'select',
        options: [
          { value: 'essence', label: 'Essence' },
          { value: 'diesel', label: 'Diesel' },
          { value: 'hybrid', label: 'Hybride' },
          { value: 'electric', label: 'Électrique' },
          { value: 'gpl', label: 'GPL' }
        ]
      },
      {
        id: 'transmission',
        label: 'Boîte de vitesse',
        icon: '⚙️',
        type: 'select',
        options: [
          { value: 'manual', label: 'Manuelle' },
          { value: 'automatic', label: 'Automatique' }
        ]
      },
      {
        id: 'vehicle_condition',
        label: 'État',
        icon: '⭐',
        type: 'select',
        dbField: 'condition',
        options: [
          { value: 'new', label: 'Neuf' },
          { value: 'good', label: 'Occasion (bon état)' },
          { value: 'repair', label: 'À réparer' }
        ]
      },
      {
        id: 'color',
        label: 'Couleur',
        icon: '🎨',
        type: 'text',
        placeholder: 'Ex: Blanc, Noir, Rouge...'
      }
    ]
  },

  // LOCATION IMMOBILIÈRE
  'location-immobiliere': {
    slug: 'location-immobiliere',
    icon: '🏠',
    filters: [
      {
        id: 'subcategory_id',
        label: 'Type de bien',
        icon: '🏘️',
        type: 'dynamic-subcategories',
        parentCategorySlug: 'location-immobiliere'
      },
      {
        id: 'bedrooms',
        label: 'Chambres',
        icon: '🛏️',
        type: 'number',
        min: 0,
        max: 10,
        placeholder: 'Nombre'
      },
      {
        id: 'bathrooms',
        label: 'Salles de bain',
        icon: '🚿',
        type: 'number',
        min: 0,
        max: 5,
        placeholder: 'Nombre'
      },
      {
        id: 'surface',
        label: 'Surface (m²)',
        icon: '📐',
        type: 'range',
        fields: {
          min: 'surface_min',
          max: 'surface_max'
        },
        placeholder: {
          min: 'Min',
          max: 'Max'
        }
      },
      {
        id: 'furnished',
        label: 'Meublé',
        icon: '🛋️',
        type: 'select',
        options: [
          { value: 'meuble', label: 'Meublé' },
          { value: 'semi-meuble', label: 'Semi-meublé' },
          { value: 'vide', label: 'Non meublé' }
        ]
      },
      {
        id: 'amenities',
        label: 'Équipements',
        icon: '✨',
        type: 'checkboxes',
        options: [
          { value: 'has_ac', label: 'Climatisation', icon: '❄️' },
          { value: 'has_heating', label: 'Chauffage', icon: '🔥' },
          { value: 'has_garage', label: 'Garage', icon: '🚗' },
          { value: 'has_garden', label: 'Jardin', icon: '🌳' },
          { value: 'has_elevator', label: 'Ascenseur', icon: '🛗' },
          { value: 'has_pool', label: 'Piscine', icon: '🏊' }
        ]
      },
      {
        id: 'floor',
        label: 'Étage',
        icon: '🏢',
        type: 'select',
        options: [
          { value: '0', label: 'Rez-de-chaussée' },
          { value: '1', label: '1er étage' },
          { value: '2', label: '2ème étage' },
          { value: '3+', label: '3ème étage ou plus' }
        ]
      },
      {
        id: 'property_condition',
        label: 'État du bien',
        icon: '⭐',
        type: 'select',
        dbField: 'condition',
        options: [
          { value: 'new', label: 'Neuf' },
          { value: 'good', label: 'Bon état' },
          { value: 'renovate', label: 'À rénover' }
        ]
      }
    ]
  },

  // LOCATION VÉHICULES
  'location-vehicules': {
    slug: 'location-vehicules',
    icon: '🚙',
    filters: [
      {
        id: 'vehicle_type',
        label: 'Type de véhicule',
        icon: '🚗',
        type: 'select',
        options: [
          { value: 'voiture', label: 'Voiture' },
          { value: 'moto', label: 'Moto' },
          { value: 'utilitaire', label: 'Utilitaire' },
          { value: 'minibus', label: 'Minibus' }
        ]
      },
      {
        id: 'brand',
        label: 'Marque',
        icon: '🏷️',
        type: 'dynamic-brands',
        dbField: 'brand'
      },
      {
        id: 'with_driver',
        label: 'Avec/Sans chauffeur',
        icon: '👨‍✈️',
        type: 'select',
        options: [
          { value: 'with', label: 'Avec chauffeur' },
          { value: 'without', label: 'Sans chauffeur' }
        ]
      },
      {
        id: 'transmission',
        label: 'Transmission',
        icon: '⚙️',
        type: 'select',
        options: [
          { value: 'manual', label: 'Manuelle' },
          { value: 'automatic', label: 'Automatique' }
        ]
      },
      {
        id: 'seats',
        label: 'Nombre de places',
        icon: '💺',
        type: 'select',
        options: [
          { value: '2-4', label: '2-4 places' },
          { value: '5-7', label: '5-7 places' },
          { value: '8+', label: '8+ places' }
        ]
      },
      {
        id: 'rental_duration',
        label: 'Durée de location',
        icon: '📅',
        type: 'select',
        options: [
          { value: 'jour', label: 'À la journée' },
          { value: 'semaine', label: 'À la semaine' },
          { value: 'mois', label: 'Au mois' },
          { value: 'longue', label: 'Longue durée' }
        ]
      },
      {
        id: 'has_ac',
        label: 'Climatisation',
        icon: '❄️',
        type: 'checkbox'
      }
    ]
  },

  // LOCATION VACANCES
  'location-vacances': {
    slug: 'location-vacances',
    icon: '🏖️',
    filters: [
      {
        id: 'accommodation_type',
        label: "Type d'hébergement",
        icon: '🏠',
        type: 'select',
        options: [
          { value: 'appartement', label: 'Appartement' },
          { value: 'maison', label: 'Maison' },
          { value: 'villa', label: 'Villa' },
          { value: 'studio', label: 'Studio' },
          { value: 'bungalow', label: 'Bungalow' },
          { value: 'chambre', label: "Chambre d'hôte" }
        ]
      },
      {
        id: 'capacity',
        label: 'Capacité (personnes)',
        icon: '👥',
        type: 'select',
        options: [
          { value: '1-2', label: '1-2 personnes' },
          { value: '3-4', label: '3-4 personnes' },
          { value: '5-6', label: '5-6 personnes' },
          { value: '7+', label: '7+ personnes' }
        ]
      },
      {
        id: 'bedrooms',
        label: 'Chambres',
        icon: '🛏️',
        type: 'number',
        min: 0,
        max: 10,
        placeholder: 'Nombre'
      },
      {
        id: 'bathrooms',
        label: 'Salles de bain',
        icon: '🚿',
        type: 'number',
        min: 0,
        max: 5,
        placeholder: 'Nombre'
      },
      {
        id: 'vacation_amenities',
        label: 'Équipements',
        icon: '✨',
        type: 'checkboxes',
        options: [
          { value: 'has_pool', label: 'Piscine', icon: '🏊' },
          { value: 'has_garden', label: 'Jardin', icon: '🌳' },
          { value: 'has_beach_access', label: 'Vue mer', icon: '🌊' },
          { value: 'has_ac', label: 'Climatisation', icon: '❄️' },
          { value: 'has_wifi', label: 'WiFi', icon: '📶' },
          { value: 'has_parking', label: 'Parking', icon: '🅿️' },
          { value: 'has_bbq', label: 'BBQ', icon: '🍖' }
        ]
      },
      {
        id: 'proximity',
        label: 'Proximité',
        icon: '📍',
        type: 'select',
        options: [
          { value: 'beach', label: 'Plage' },
          { value: 'mountain', label: 'Montagne' },
          { value: 'city', label: 'Centre-ville' },
          { value: 'countryside', label: 'Campagne' }
        ]
      },
      {
        id: 'season',
        label: 'Période disponible',
        icon: '📅',
        type: 'select',
        options: [
          { value: 'summer', label: 'Été' },
          { value: 'winter', label: 'Hiver' },
          { value: 'all-year', label: 'Toute l\'année' }
        ]
      }
    ]
  },

  // EMPLOI
  emploi: {
    slug: 'emploi',
    icon: '💼',
    filters: [
      {
        id: 'sector',
        label: "Secteur d'activité",
        icon: '🏢',
        type: 'select',
        options: [
          { value: 'informatique', label: 'Informatique/Tech' },
          { value: 'commerce', label: 'Commerce/Vente' },
          { value: 'ingenierie', label: 'Ingénierie' },
          { value: 'sante', label: 'Santé' },
          { value: 'education', label: 'Éducation' },
          { value: 'finance', label: 'Finance/Comptabilité' },
          { value: 'hotellerie', label: 'Hôtellerie/Restauration' },
          { value: 'btp', label: 'BTP/Construction' },
          { value: 'autre', label: 'Autres' }
        ]
      },
      {
        id: 'contract_type',
        label: 'Type de contrat',
        icon: '📝',
        type: 'select',
        options: [
          { value: 'cdi', label: 'CDI' },
          { value: 'cdd', label: 'CDD' },
          { value: 'freelance', label: 'Freelance' },
          { value: 'stage', label: 'Stage' },
          { value: 'temporaire', label: 'Temporaire' },
          { value: 'saisonnier', label: 'Saisonnier' }
        ]
      },
      {
        id: 'experience_level',
        label: "Niveau d'expérience",
        icon: '📊',
        type: 'select',
        options: [
          { value: 'debutant', label: 'Débutant (0-2 ans)' },
          { value: 'intermediaire', label: 'Intermédiaire (2-5 ans)' },
          { value: 'confirme', label: 'Confirmé (5-10 ans)' },
          { value: 'expert', label: 'Expert (10+ ans)' }
        ]
      },
      {
        id: 'education_level',
        label: "Niveau d'études",
        icon: '🎓',
        type: 'select',
        options: [
          { value: 'sans', label: 'Sans diplôme' },
          { value: 'bac', label: 'Bac' },
          { value: 'bac+2', label: 'Bac+2/3' },
          { value: 'bac+5', label: 'Bac+4/5' },
          { value: 'doctorat', label: 'Doctorat' }
        ]
      },
      {
        id: 'work_time',
        label: 'Temps de travail',
        icon: '⏰',
        type: 'select',
        options: [
          { value: 'plein', label: 'Temps plein' },
          { value: 'partiel', label: 'Temps partiel' },
          { value: 'flexible', label: 'Flexible' }
        ]
      },
      {
        id: 'remote',
        label: 'Télétravail',
        icon: '💻',
        type: 'select',
        options: [
          { value: 'total', label: '100% télétravail' },
          { value: 'hybride', label: 'Hybride' },
          { value: 'sur-site', label: 'Sur site' }
        ]
      }
    ]
  },

  // SERVICES
  services: {
    slug: 'services',
    icon: '🔧',
    filters: [
      {
        id: 'service_type',
        label: 'Type de service',
        icon: '⚙️',
        type: 'select',
        options: [
          { value: 'plomberie', label: 'Plomberie' },
          { value: 'electricite', label: 'Électricité' },
          { value: 'climatisation', label: 'Climatisation' },
          { value: 'menuiserie', label: 'Menuiserie' },
          { value: 'peinture', label: 'Peinture' },
          { value: 'jardinage', label: 'Jardinage' },
          { value: 'nettoyage', label: 'Nettoyage' },
          { value: 'demenagement', label: 'Déménagement' },
          { value: 'reparation', label: 'Réparation électronique' },
          { value: 'cours', label: 'Cours particuliers' },
          { value: 'informatique', label: 'Informatique/Web' },
          { value: 'photo', label: 'Photographie/Vidéo' },
          { value: 'autre', label: 'Autres' }
        ]
      },
      {
        id: 'availability',
        label: 'Disponibilité',
        icon: '📅',
        type: 'select',
        options: [
          { value: 'immediat', label: 'Immédiate' },
          { value: '48h', label: 'Sous 48h' },
          { value: 'planifier', label: 'À planifier' }
        ]
      },
      {
        id: 'location_type',
        label: 'Déplacement',
        icon: '📍',
        type: 'select',
        options: [
          { value: 'domicile', label: 'À domicile' },
          { value: 'local', label: 'Dans mon local' },
          { value: 'les-deux', label: 'Les deux' }
        ]
      },
      {
        id: 'service_experience',
        label: 'Expérience',
        icon: '⭐',
        type: 'select',
        options: [
          { value: 'debutant', label: 'Débutant' },
          { value: 'intermediaire', label: 'Intermédiaire' },
          { value: 'expert', label: 'Expert' }
        ]
      }
    ]
  },

  // MODE & BEAUTÉ
  mode: {
    slug: 'mode',
    icon: '👗',
    filters: [
      {
        id: 'fashion_category',
        label: 'Catégorie',
        icon: '👔',
        type: 'select',
        options: [
          { value: 'vetements', label: 'Vêtements' },
          { value: 'chaussures', label: 'Chaussures' },
          { value: 'sacs', label: 'Sacs & Accessoires' },
          { value: 'bijoux', label: 'Bijoux & Montres' },
          { value: 'cosmetiques', label: 'Cosmétiques' },
          { value: 'parfums', label: 'Parfums' },
          { value: 'soins', label: 'Soins & Bien-être' }
        ]
      },
      {
        id: 'gender',
        label: 'Genre',
        icon: '👤',
        type: 'select',
        options: [
          { value: 'femme', label: 'Femme' },
          { value: 'homme', label: 'Homme' },
          { value: 'enfant', label: 'Enfant' },
          { value: 'unisexe', label: 'Unisexe' }
        ]
      },
      {
        id: 'size',
        label: 'Taille vêtements',
        icon: '📏',
        type: 'select',
        options: [
          { value: 'xs', label: 'XS' },
          { value: 's', label: 'S' },
          { value: 'm', label: 'M' },
          { value: 'l', label: 'L' },
          { value: 'xl', label: 'XL' },
          { value: 'xxl', label: 'XXL+' }
        ]
      },
      {
        id: 'shoe_size',
        label: 'Pointure',
        icon: '👟',
        type: 'range',
        fields: {
          min: 'shoe_size_min',
          max: 'shoe_size_max'
        },
        min: 35,
        max: 46,
        placeholder: {
          min: '35',
          max: '46'
        }
      },
      {
        id: 'brand',
        label: 'Marque',
        icon: '🏷️',
        type: 'text',
        placeholder: 'Ex: Nike, Zara, H&M...'
      },
      {
        id: 'fashion_condition',
        label: 'État',
        icon: '⭐',
        type: 'select',
        dbField: 'condition',
        options: [
          { value: 'neuf-etiquette', label: 'Neuf avec étiquette' },
          { value: 'neuf', label: 'Neuf sans étiquette' },
          { value: 'comme-neuf', label: 'Comme neuf' },
          { value: 'tres-bon', label: 'Très bon état' },
          { value: 'bon', label: 'Bon état' }
        ]
      },
      {
        id: 'material',
        label: 'Matière',
        icon: '🧵',
        type: 'select',
        options: [
          { value: 'coton', label: 'Coton' },
          { value: 'cuir', label: 'Cuir' },
          { value: 'soie', label: 'Soie' },
          { value: 'synthetique', label: 'Synthétique' },
          { value: 'laine', label: 'Laine' }
        ]
      }
    ]
  },

  'mode-beaute': {
    slug: 'mode-beaute',
    icon: '👗',
    filters: [
      {
        id: 'fashion_category',
        label: 'Catégorie',
        icon: '👔',
        type: 'select',
        options: [
          { value: 'vetements', label: 'Vêtements' },
          { value: 'chaussures', label: 'Chaussures' },
          { value: 'sacs', label: 'Sacs & Accessoires' },
          { value: 'bijoux', label: 'Bijoux & Montres' },
          { value: 'cosmetiques', label: 'Cosmétiques' },
          { value: 'parfums', label: 'Parfums' },
          { value: 'soins', label: 'Soins & Bien-être' }
        ]
      },
      {
        id: 'gender',
        label: 'Genre',
        icon: '👤',
        type: 'select',
        options: [
          { value: 'femme', label: 'Femme' },
          { value: 'homme', label: 'Homme' },
          { value: 'enfant', label: 'Enfant' },
          { value: 'unisexe', label: 'Unisexe' }
        ]
      },
      {
        id: 'size',
        label: 'Taille vêtements',
        icon: '📏',
        type: 'select',
        options: [
          { value: 'xs', label: 'XS' },
          { value: 's', label: 'S' },
          { value: 'm', label: 'M' },
          { value: 'l', label: 'L' },
          { value: 'xl', label: 'XL' },
          { value: 'xxl', label: 'XXL+' }
        ]
      },
      {
        id: 'shoe_size',
        label: 'Pointure',
        icon: '👟',
        type: 'range',
        fields: {
          min: 'shoe_size_min',
          max: 'shoe_size_max'
        },
        min: 35,
        max: 46,
        placeholder: {
          min: '35',
          max: '46'
        }
      },
      {
        id: 'brand',
        label: 'Marque',
        icon: '🏷️',
        type: 'text',
        placeholder: 'Ex: Nike, Zara, H&M...'
      },
      {
        id: 'fashion_condition',
        label: 'État',
        icon: '⭐',
        type: 'select',
        dbField: 'condition',
        options: [
          { value: 'neuf-etiquette', label: 'Neuf avec étiquette' },
          { value: 'neuf', label: 'Neuf sans étiquette' },
          { value: 'comme-neuf', label: 'Comme neuf' },
          { value: 'tres-bon', label: 'Très bon état' },
          { value: 'bon', label: 'Bon état' }
        ]
      },
      {
        id: 'material',
        label: 'Matière',
        icon: '🧵',
        type: 'select',
        options: [
          { value: 'coton', label: 'Coton' },
          { value: 'cuir', label: 'Cuir' },
          { value: 'soie', label: 'Soie' },
          { value: 'synthetique', label: 'Synthétique' },
          { value: 'laine', label: 'Laine' }
        ]
      }
    ]
  },

  // IMMOBILIER (Vente)
  immobilier: {
    slug: 'immobilier',
    icon: '🏘️',
    filters: [
      {
        id: 'subcategory_id',
        label: 'Type de bien',
        icon: '🏠',
        type: 'dynamic-subcategories',
        parentCategorySlug: 'immobilier'
      },
      {
        id: 'bedrooms',
        label: 'Chambres',
        icon: '🛏️',
        type: 'number',
        min: 0,
        max: 10,
        placeholder: 'Nombre'
      },
      {
        id: 'bathrooms',
        label: 'Salles de bain',
        icon: '🚿',
        type: 'number',
        min: 0,
        max: 5,
        placeholder: 'Nombre'
      },
      {
        id: 'surface',
        label: 'Surface (m²)',
        icon: '📐',
        type: 'range',
        fields: {
          min: 'surface_min',
          max: 'surface_max'
        },
        placeholder: {
          min: 'Min',
          max: 'Max'
        }
      },
      {
        id: 'land_surface',
        label: 'Surface terrain (m²)',
        icon: '🌍',
        type: 'range',
        fields: {
          min: 'land_surface_min',
          max: 'land_surface_max'
        },
        placeholder: {
          min: 'Min',
          max: 'Max'
        }
      },
      {
        id: 'floor',
        label: 'Étage',
        icon: '🏢',
        type: 'select',
        options: [
          { value: '0', label: 'Rez-de-chaussée' },
          { value: '1', label: '1er étage' },
          { value: '2', label: '2ème étage' },
          { value: '3+', label: '3ème étage ou plus' }
        ]
      },
      {
        id: 'real_estate_amenities',
        label: 'Équipements',
        icon: '✨',
        type: 'checkboxes',
        options: [
          { value: 'has_garage', label: 'Garage', icon: '🚗' },
          { value: 'has_garden', label: 'Jardin', icon: '🌳' },
          { value: 'has_pool', label: 'Piscine', icon: '🏊' },
          { value: 'has_elevator', label: 'Ascenseur', icon: '🛗' },
          { value: 'has_basement', label: 'Cave', icon: '🏚️' },
          { value: 'has_balcony', label: 'Balcon', icon: '🪴' }
        ]
      },
      {
        id: 'real_estate_condition',
        label: 'État du bien',
        icon: '⭐',
        type: 'select',
        dbField: 'condition',
        options: [
          { value: 'new', label: 'Neuf' },
          { value: 'good', label: 'Bon état' },
          { value: 'renovate', label: 'À rénover' },
          { value: 'construction', label: 'En construction' }
        ]
      },
      {
        id: 'title_type',
        label: 'Acte',
        icon: '📜',
        type: 'select',
        options: [
          { value: 'livret', label: 'Livret foncier' },
          { value: 'notarie', label: 'Acte notarié' },
          { value: 'autre', label: 'Autre' }
        ]
      }
    ]
  },

  // ÉLECTRONIQUE
  electronique: {
    slug: 'electronique',
    icon: '📱',
    filters: [
      {
        id: 'electronics_category',
        label: 'Catégorie',
        icon: '📦',
        type: 'select',
        options: [
          { value: 'telephones', label: 'Téléphones & Tablettes' },
          { value: 'ordinateurs', label: 'Ordinateurs & Laptops' },
          { value: 'tv', label: 'TV & Écrans' },
          { value: 'audio', label: 'Audio & Son' },
          { value: 'consoles', label: 'Consoles & Jeux vidéo' },
          { value: 'photo', label: 'Appareils photo & Caméras' },
          { value: 'accessoires', label: 'Accessoires & Pièces' },
          { value: 'electromenager', label: 'Électroménager' }
        ]
      },
      {
        id: 'brand',
        label: 'Marque',
        icon: '🏷️',
        type: 'text',
        placeholder: 'Ex: Apple, Samsung, HP...'
      },
      {
        id: 'model',
        label: 'Modèle',
        icon: '📋',
        type: 'text',
        placeholder: 'Ex: iPhone 15, Galaxy S24...'
      },
      {
        id: 'electronics_condition',
        label: 'État',
        icon: '⭐',
        type: 'select',
        dbField: 'condition',
        options: [
          { value: 'neuf-emballe', label: 'Neuf (sous emballage)' },
          { value: 'neuf-ouvert', label: 'Neuf (ouvert)' },
          { value: 'comme-neuf', label: 'Comme neuf' },
          { value: 'tres-bon', label: 'Très bon état' },
          { value: 'bon', label: 'Bon état' },
          { value: 'pieces', label: 'Pour pièces' }
        ]
      },
      {
        id: 'warranty',
        label: 'Garantie',
        icon: '🛡️',
        type: 'select',
        options: [
          { value: 'sous-garantie', label: 'Sous garantie' },
          { value: 'hors-garantie', label: 'Hors garantie' }
        ]
      },
      {
        id: 'storage',
        label: 'Stockage',
        icon: '💾',
        type: 'select',
        options: [
          { value: '64', label: '64 GB' },
          { value: '128', label: '128 GB' },
          { value: '256', label: '256 GB' },
          { value: '512', label: '512 GB' },
          { value: '1024', label: '1 TB+' }
        ]
      },
      {
        id: 'ram',
        label: 'RAM',
        icon: '🧠',
        type: 'select',
        options: [
          { value: '4', label: '4 GB' },
          { value: '8', label: '8 GB' },
          { value: '16', label: '16 GB' },
          { value: '32', label: '32 GB+' }
        ]
      }
    ]
  },

  // MAISON
  maison: {
    slug: 'maison',
    icon: '🛋️',
    filters: [
      {
        id: 'home_category',
        label: 'Catégorie',
        icon: '🏠',
        type: 'select',
        options: [
          { value: 'meubles', label: 'Meubles' },
          { value: 'decoration', label: 'Décoration' },
          { value: 'electromenager', label: 'Électroménager' },
          { value: 'bricolage', label: 'Bricolage & Outils' },
          { value: 'literie', label: 'Literie' },
          { value: 'cuisine', label: 'Cuisine & Vaisselle' }
        ]
      },
      {
        id: 'furniture_type',
        label: 'Type de meuble',
        icon: '🪑',
        type: 'select',
        options: [
          { value: 'salon', label: 'Salon (Canapé, Table basse)' },
          { value: 'chambre', label: 'Chambre (Lit, Armoire)' },
          { value: 'salle-manger', label: 'Salle à manger (Table, Chaises)' },
          { value: 'bureau', label: 'Bureau' },
          { value: 'rangement', label: 'Rangement (Étagère, Bibliothèque)' }
        ]
      },
      {
        id: 'material',
        label: 'Matériau',
        icon: '🪵',
        type: 'select',
        options: [
          { value: 'bois', label: 'Bois massif' },
          { value: 'mdf', label: 'MDF/Aggloméré' },
          { value: 'metal', label: 'Métal' },
          { value: 'verre', label: 'Verre' },
          { value: 'plastique', label: 'Plastique' },
          { value: 'rotin', label: 'Rotin' }
        ]
      },
      {
        id: 'style',
        label: 'Style',
        icon: '🎨',
        type: 'select',
        options: [
          { value: 'moderne', label: 'Moderne' },
          { value: 'classique', label: 'Classique' },
          { value: 'industriel', label: 'Industriel' },
          { value: 'scandinave', label: 'Scandinave' },
          { value: 'oriental', label: 'Oriental' },
          { value: 'rustique', label: 'Rustique' }
        ]
      },
      {
        id: 'home_condition',
        label: 'État',
        icon: '⭐',
        type: 'select',
        dbField: 'condition',
        options: [
          { value: 'neuf-emballe', label: 'Neuf (emballage)' },
          { value: 'neuf', label: 'Neuf (déballé)' },
          { value: 'comme-neuf', label: 'Comme neuf' },
          { value: 'excellent', label: 'Excellent état' },
          { value: 'bon', label: 'Bon état' },
          { value: 'restaurer', label: 'À restaurer' }
        ]
      }
    ]
  },

  // LOISIRS
  loisirs: {
    slug: 'loisirs',
    icon: '🎾',
    filters: [
      {
        id: 'leisure_category',
        label: 'Catégorie',
        icon: '🎮',
        type: 'select',
        options: [
          { value: 'sport', label: 'Sport & Fitness' },
          { value: 'velos', label: 'Vélos' },
          { value: 'camping', label: 'Camping & Randonnée' },
          { value: 'nautique', label: 'Sports nautiques' },
          { value: 'musique', label: 'Instruments de musique' },
          { value: 'collection', label: 'Collection & Antiquités' },
          { value: 'jouets', label: 'Jouets & Jeux' },
          { value: 'billetterie', label: 'Billetterie & Événements' }
        ]
      },
      {
        id: 'sport_type',
        label: 'Type de sport',
        icon: '⚽',
        type: 'select',
        options: [
          { value: 'fitness', label: 'Fitness (Tapis, Vélo d\'appartement)' },
          { value: 'football', label: 'Football' },
          { value: 'basketball', label: 'Basketball' },
          { value: 'tennis', label: 'Tennis' },
          { value: 'arts-martiaux', label: 'Arts martiaux' },
          { value: 'autre', label: 'Autre' }
        ]
      },
      {
        id: 'bike_type',
        label: 'Type de vélo',
        icon: '🚴',
        type: 'select',
        options: [
          { value: 'route', label: 'Vélo route' },
          { value: 'vtt', label: 'VTT' },
          { value: 'ville', label: 'Vélo ville' },
          { value: 'electrique', label: 'Vélo électrique' },
          { value: 'enfant', label: 'Vélo enfant' },
          { value: 'bmx', label: 'BMX' }
        ]
      },
      {
        id: 'instrument_type',
        label: 'Type d\'instrument',
        icon: '🎸',
        type: 'select',
        options: [
          { value: 'guitare', label: 'Guitare' },
          { value: 'piano', label: 'Piano/Clavier' },
          { value: 'batterie', label: 'Batterie' },
          { value: 'violon', label: 'Violon' },
          { value: 'oud', label: 'Oud' },
          { value: 'autre', label: 'Autre' }
        ]
      },
      {
        id: 'toy_age',
        label: 'Âge recommandé',
        icon: '👶',
        type: 'select',
        options: [
          { value: '0-2', label: '0-2 ans' },
          { value: '3-5', label: '3-5 ans' },
          { value: '6-8', label: '6-8 ans' },
          { value: '9-12', label: '9-12 ans' },
          { value: '13+', label: '13+ ans' },
          { value: 'adulte', label: 'Adulte' }
        ]
      },
      {
        id: 'leisure_condition',
        label: 'État',
        icon: '⭐',
        type: 'select',
        dbField: 'condition',
        options: [
          { value: 'neuf', label: 'Neuf' },
          { value: 'comme-neuf', label: 'Comme neuf' },
          { value: 'excellent', label: 'Excellent' },
          { value: 'bon', label: 'Bon' }
        ]
      }
    ]
  },

  // LOCATION ÉQUIPEMENTS
  'location-equipements': {
    slug: 'location-equipements',
    icon: '🔨',
    filters: [
      {
        id: 'equipment_category',
        label: 'Catégorie',
        icon: '⚙️',
        type: 'select',
        options: [
          { value: 'bricolage', label: 'Outils de bricolage' },
          { value: 'jardinage', label: 'Matériel de jardinage' },
          { value: 'construction', label: 'Équipement de construction' },
          { value: 'evenementiel', label: 'Matériel événementiel' },
          { value: 'sportif', label: 'Équipement sportif' },
          { value: 'photo', label: 'Matériel photo/vidéo' },
          { value: 'sono', label: 'Équipement son & lumière' }
        ]
      },
      {
        id: 'rental_duration',
        label: 'Durée de location',
        icon: '📅',
        type: 'checkboxes',
        options: [
          { value: 'hourly', label: 'À l\'heure' },
          { value: 'daily', label: 'À la journée' },
          { value: 'weekly', label: 'À la semaine' },
          { value: 'monthly', label: 'Au mois' }
        ]
      },
      {
        id: 'equipment_condition',
        label: 'État',
        icon: '⭐',
        type: 'select',
        dbField: 'condition',
        options: [
          { value: 'neuf', label: 'Neuf' },
          { value: 'tres-bon', label: 'Très bon état' },
          { value: 'bon', label: 'Bon état' },
          { value: 'fonctionnel', label: 'Fonctionnel' }
        ]
      },
      {
        id: 'delivery',
        label: 'Livraison',
        icon: '🚚',
        type: 'checkbox'
      },
      {
        id: 'training',
        label: 'Formation incluse',
        icon: '👨‍🏫',
        type: 'checkbox'
      }
    ]
  },

  // MAISON & JARDIN
  'maison-jardin': {
    slug: 'maison-jardin',
    icon: '🌱',
    filters: [
      {
        id: 'garden_category',
        label: 'Catégorie',
        icon: '🪴',
        type: 'select',
        options: [
          { value: 'plantes', label: 'Plantes & Graines' },
          { value: 'mobilier', label: 'Mobilier de jardin' },
          { value: 'outils', label: 'Outils de jardinage' },
          { value: 'bbq', label: 'Barbecue & Plancha' },
          { value: 'piscine', label: 'Piscine & Spa' },
          { value: 'decoration', label: 'Décoration extérieure' },
          { value: 'arrosage', label: 'Arrosage & Irrigation' },
          { value: 'abri', label: 'Abri de jardin' }
        ]
      },
      {
        id: 'plant_type',
        label: 'Type de plante',
        icon: '🌿',
        type: 'select',
        options: [
          { value: 'interieur', label: 'Plantes d\'intérieur' },
          { value: 'exterieur', label: 'Plantes d\'extérieur' },
          { value: 'arbres', label: 'Arbres & Arbustes' },
          { value: 'graines', label: 'Graines & Semences' },
          { value: 'fleurs', label: 'Fleurs' }
        ]
      },
      {
        id: 'outdoor_furniture',
        label: 'Mobilier',
        icon: '🪑',
        type: 'select',
        options: [
          { value: 'salon', label: 'Salon de jardin' },
          { value: 'parasol', label: 'Parasol & Tonnelle' },
          { value: 'transat', label: 'Transat & Bain de soleil' },
          { value: 'balancelle', label: 'Balancelle' }
        ]
      },
      {
        id: 'garden_condition',
        label: 'État',
        icon: '⭐',
        type: 'select',
        dbField: 'condition',
        options: [
          { value: 'neuf', label: 'Neuf' },
          { value: 'excellent', label: 'Excellent' },
          { value: 'bon', label: 'Bon' }
        ]
      }
    ]
  },

  // ANIMAUX
  animaux: {
    slug: 'animaux',
    icon: '🐾',
    filters: [
      {
        id: 'animal_type',
        label: 'Type d\'animal',
        icon: '🐕',
        type: 'select',
        options: [
          { value: 'chien', label: 'Chien' },
          { value: 'chat', label: 'Chat' },
          { value: 'oiseau', label: 'Oiseau' },
          { value: 'poisson', label: 'Poisson' },
          { value: 'rongeur', label: 'Rongeur (Lapin, Hamster...)' },
          { value: 'cheval', label: 'Cheval' },
          { value: 'betail', label: 'Bétail (Mouton, Vache...)' },
          { value: 'autre', label: 'Autre' }
        ]
      },
      {
        id: 'breed',
        label: 'Race',
        icon: '🏷️',
        type: 'text',
        placeholder: 'Ex: Berger Allemand, Persan...'
      },
      {
        id: 'age_range',
        label: 'Âge',
        icon: '📅',
        type: 'select',
        options: [
          { value: '0-6months', label: 'Moins de 6 mois' },
          { value: '6-12months', label: '6-12 mois' },
          { value: '1-2years', label: '1-2 ans' },
          { value: '2-5years', label: '2-5 ans' },
          { value: '5+years', label: '5+ ans' }
        ]
      },
      {
        id: 'gender',
        label: 'Sexe',
        icon: '⚧️',
        type: 'select',
        options: [
          { value: 'male', label: 'Mâle' },
          { value: 'femelle', label: 'Femelle' }
        ]
      },
      {
        id: 'vaccinated',
        label: 'Vacciné',
        icon: '💉',
        type: 'checkbox'
      },
      {
        id: 'pedigree',
        label: 'Pedigree',
        icon: '📜',
        type: 'checkbox'
      },
      {
        id: 'sterilized',
        label: 'Stérilisé',
        icon: '✂️',
        type: 'checkbox'
      }
    ]
  },

  // BÉBÉ & ENFANTS
  'bebe-enfants': {
    slug: 'bebe-enfants',
    icon: '👶',
    filters: [
      {
        id: 'baby_category',
        label: 'Catégorie',
        icon: '🍼',
        type: 'select',
        options: [
          { value: 'vetements-bebe', label: 'Vêtements bébé (0-2 ans)' },
          { value: 'vetements-enfant', label: 'Vêtements enfant (3-14 ans)' },
          { value: 'chaussures', label: 'Chaussures' },
          { value: 'puericulture', label: 'Puériculture (Poussette, Siège...)' },
          { value: 'jouets', label: 'Jouets & Jeux' },
          { value: 'alimentation', label: 'Alimentation (Biberon...)' },
          { value: 'livres', label: 'Livres & Éducation' }
        ]
      },
      {
        id: 'baby_gender',
        label: 'Genre',
        icon: '👶',
        type: 'select',
        options: [
          { value: 'fille', label: 'Fille' },
          { value: 'garcon', label: 'Garçon' },
          { value: 'mixte', label: 'Mixte' }
        ]
      },
      {
        id: 'age_size',
        label: 'Âge/Taille',
        icon: '📏',
        type: 'select',
        options: [
          { value: 'naissance', label: 'Naissance' },
          { value: '1m', label: '1 mois' },
          { value: '3m', label: '3 mois' },
          { value: '6m', label: '6 mois' },
          { value: '12m', label: '12 mois' },
          { value: '18m', label: '18 mois' },
          { value: '2ans', label: '2 ans' },
          { value: '3ans', label: '3 ans' },
          { value: '4ans', label: '4 ans' },
          { value: '5ans', label: '5 ans' },
          { value: '6ans', label: '6 ans' },
          { value: '8ans', label: '8 ans' },
          { value: '10ans', label: '10 ans' },
          { value: '12ans', label: '12 ans' },
          { value: '14ans', label: '14 ans' }
        ]
      },
      {
        id: 'brand',
        label: 'Marque',
        icon: '🏷️',
        type: 'text',
        placeholder: 'Ex: Chicco, Babymoov...'
      },
      {
        id: 'baby_condition',
        label: 'État',
        icon: '⭐',
        type: 'select',
        dbField: 'condition',
        options: [
          { value: 'neuf-etiquette', label: 'Neuf avec étiquette' },
          { value: 'neuf', label: 'Neuf sans étiquette' },
          { value: 'excellent', label: 'Excellent état' },
          { value: 'tres-bon', label: 'Très bon état' },
          { value: 'bon', label: 'Bon état' }
        ]
      },
      {
        id: 'ce_compliant',
        label: 'Normes CE',
        icon: '✅',
        type: 'checkbox'
      }
    ]
  },

  // LIVRES & MULTIMÉDIA
  livres: {
    slug: 'livres',
    icon: '📚',
    filters: [
      {
        id: 'books_category',
        label: 'Catégorie',
        icon: '📖',
        type: 'select',
        options: [
          { value: 'livres', label: 'Livres' },
          { value: 'magazines', label: 'Magazines & Revues' },
          { value: 'bd', label: 'BD & Mangas' },
          { value: 'dvd', label: 'DVD & Blu-ray' },
          { value: 'cd', label: 'CD & Vinyles' },
          { value: 'jeux', label: 'Jeux vidéo (cartouches)' }
        ]
      },
      {
        id: 'book_genre',
        label: 'Genre de livre',
        icon: '📕',
        type: 'select',
        options: [
          { value: 'roman', label: 'Roman' },
          { value: 'sf', label: 'Science-fiction/Fantasy' },
          { value: 'policier', label: 'Policier/Thriller' },
          { value: 'romance', label: 'Romance' },
          { value: 'jeunesse', label: 'Jeunesse' },
          { value: 'classique', label: 'Littérature classique' },
          { value: 'bio', label: 'Biographie' },
          { value: 'histoire', label: 'Histoire' },
          { value: 'sciences', label: 'Sciences' },
          { value: 'religion', label: 'Religion/Spiritualité' },
          { value: 'dev-perso', label: 'Développement personnel' },
          { value: 'cuisine', label: 'Cuisine' },
          { value: 'art', label: 'Art' },
          { value: 'scolaire', label: 'Scolaire/Universitaire' }
        ]
      },
      {
        id: 'language',
        label: 'Langue',
        icon: '🌍',
        type: 'select',
        options: [
          { value: 'francais', label: 'Français' },
          { value: 'arabe', label: 'Arabe' },
          { value: 'anglais', label: 'Anglais' },
          { value: 'autre', label: 'Autre' }
        ]
      },
      {
        id: 'music_genre',
        label: 'Genre musical',
        icon: '🎵',
        type: 'select',
        options: [
          { value: 'rai', label: 'Raï' },
          { value: 'chaabi', label: 'Chaabi' },
          { value: 'pop', label: 'Pop' },
          { value: 'rock', label: 'Rock' },
          { value: 'rap', label: 'Rap' },
          { value: 'rnb', label: 'R&B' },
          { value: 'classique', label: 'Classique' },
          { value: 'jazz', label: 'Jazz' }
        ]
      },
      {
        id: 'books_condition',
        label: 'État',
        icon: '⭐',
        type: 'select',
        dbField: 'condition',
        options: [
          { value: 'neuf', label: 'Neuf (sous emballage)' },
          { value: 'neuf-deballe', label: 'Neuf (déballé)' },
          { value: 'comme-neuf', label: 'Comme neuf' },
          { value: 'tres-bon', label: 'Très bon état' },
          { value: 'bon', label: 'Bon état (traces légères)' },
          { value: 'moyen', label: 'État moyen (annotations)' }
        ]
      }
    ]
  }
};

/**
 * Retourne la configuration des filtres pour une catégorie donnée
 * @param {string} categorySlug - Slug de la catégorie
 * @returns {object|null} - Configuration des filtres ou null
 */
export function getFilterConfig(categorySlug) {
  return filterConfigs[categorySlug] || null;
}

/**
 * Retourne tous les slugs de catégories disponibles
 * @returns {array} - Liste des slugs
 */
export function getAllCategorySlugs() {
  return Object.keys(filterConfigs);
}
