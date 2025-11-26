/**
 * Système de détection automatique de catégories basé sur les mots-clés
 *
 * PRIORITÉ DE DÉTECTION :
 * 1. Mots-clés spécifiques (marques, modèles) : score +10
 * 2. Mots entiers : score +5
 * 3. Mots partiels : score +2
 *
 * EXEMPLES :
 * - "Golf 7" → Véhicules (Golf = marque)
 * - "Appartement F3 Alger" → Location Immobilière + extraction F3 + Alger
 * - "iPhone 13" → Électronique
 * - "diesel" seul → Véhicules (mais faible confiance)
 * - "location" seul → Ambigu, pas d'auto-sélection
 */

// Dictionnaire de mots-clés par catégorie
const categoryKeywords = {
  // Véhicules
  vehicles: {
    keywords: [
      'voiture', 'auto', 'car', 'véhicule', 'moto', 'scooter', 'camion', 'utilitaire',
      'golf', 'polo', 'clio', 'megane', 'peugeot', 'renault', 'toyota', 'hyundai',
      'mercedes', 'bmw', 'audi', 'ford', 'kia', 'nissan', 'mazda', 'honda',
      'diesel', 'essence', 'automatique', 'manuelle', 'boite', 'vitesse',
      'cylindre', 'chevaux', 'km', 'kilométrage', 'immatriculation'
    ],
    slug: 'vehicules'
  },

  // Location Immobilière
  rental_property: {
    keywords: [
      'louer', 'location', 'appartement', 'appart', 'f2', 'f3', 'f4', 'f5',
      'studio', 'maison', 'villa', 'duplex', 'local', 'bureau', 'commerce',
      'meublé', 'vide', 'étage', 'ascenseur', 'balcon', 'terrasse',
      'chambre', 'pièce', 'salle de bain', 'cuisine', 'salon', 'séjour'
    ],
    slug: 'location-immobiliere'
  },

  // Location Véhicules
  vehicle_rental: {
    keywords: [
      'location voiture', 'louer voiture', 'rent car', 'location auto',
      'avec chauffeur', 'sans chauffeur', 'location journée', 'location semaine',
      'location mois', 'location longue durée', 'location courte durée'
    ],
    slug: 'location-vehicules'
  },

  // Location Vacances
  vacation_rental: {
    keywords: [
      'vacances', 'villa vacances', 'appartement vacances', 'location saisonnière',
      'bord de mer', 'plage', 'montagne', 'résidence touristique',
      'maison vacances', 'chalet', 'bungalow', 'vue mer', 'piscine'
    ],
    slug: 'location-vacances'
  },

  // Emploi
  employment: {
    keywords: [
      'emploi', 'travail', 'job', 'recrutement', 'poste', 'cdi', 'cdd',
      'stage', 'freelance', 'contrat', 'salaire', 'embauche',
      'ingénieur', 'développeur', 'comptable', 'commercial', 'vendeur',
      'serveur', 'cuisinier', 'infirmier', 'professeur', 'enseignant',
      'plein temps', 'temps partiel', 'télétravail', 'remote'
    ],
    slug: 'emploi'
  },

  // Services
  services: {
    keywords: [
      'plombier', 'électricien', 'menuisier', 'peintre', 'maçon',
      'climatisation', 'réparation', 'dépannage', 'installation',
      'nettoyage', 'jardinage', 'déménagement', 'transport',
      'cours particuliers', 'soutien scolaire', 'formation',
      'photographe', 'vidéaste', 'graphiste', 'webmaster',
      'service', 'prestation', 'disponible', 'urgent'
    ],
    slug: 'services'
  },

  // Mode & Beauté
  fashion: {
    keywords: [
      'robe', 'pantalon', 'chemise', 'veste', 'manteau', 'jupe',
      'chaussure', 'basket', 'talon', 'sandale', 'botte',
      'sac', 'accessoire', 'bijou', 'montre', 'bracelet',
      'parfum', 'cosmétique', 'maquillage', 'beauté',
      'taille', 'pointure', 'xs', 'xl', 'mode', 'fashion'
    ],
    slug: 'mode-beaute'
  },

  // Immobilier (Vente)
  real_estate: {
    keywords: [
      'vente', 'vendre', 'acheter', 'achat', 'propriété',
      'terrain', 'terrain agricole', 'terrain constructible',
      'immeuble', 'ferme', 'livret foncier', 'acte',
      'm2', 'mètre carré', 'surface habitable'
    ],
    slug: 'immobilier'
  },

  // Électronique
  electronics: {
    keywords: [
      'iphone', 'samsung', 'huawei', 'xiaomi', 'oppo', 'telephone',
      'smartphone', 'mobile', 'tablette', 'ipad',
      'ordinateur', 'laptop', 'pc', 'macbook', 'asus', 'hp', 'dell', 'lenovo',
      'tv', 'télé', 'écran', 'moniteur', 'smart tv',
      'console', 'playstation', 'ps5', 'ps4', 'xbox', 'nintendo',
      'appareil photo', 'camera', 'canon', 'nikon', 'sony',
      'casque', 'écouteur', 'airpods', 'enceinte', 'bluetooth',
      'électroménager', 'frigo', 'machine à laver', 'climatiseur',
      'go', 'gb', 'ram', 'ssd', 'stockage', 'garantie'
    ],
    slug: 'electronique'
  }
};

// Mots ambigus qui ne doivent PAS déclencher d'auto-sélection
const ambiguousKeywords = [
  'location', 'louer', 'vendre', 'vente', 'acheter',
  'urgent', 'bon', 'prix', 'qualité', 'neuf', 'occasion'
];

/**
 * Détecte la catégorie la plus probable basée sur un texte de recherche
 * @param {string} searchText - Texte de recherche
 * @returns {object|null} - { categoryKey, slug, confidence, matchedKeywords, categoryName }
 */
export function detectCategory(searchText) {
  if (!searchText || typeof searchText !== 'string') return null;

  const normalizedText = searchText.toLowerCase().trim();

  // Vérifier si c'est un mot ambigu seul
  const isAmbiguous = ambiguousKeywords.some(word =>
    normalizedText === word || normalizedText === word + 's'
  );

  if (isAmbiguous && normalizedText.split(' ').length === 1) {
    // Mot ambigu seul : pas d'auto-détection
    return null;
  }

  const scores = {};

  // Calcul des scores pour chaque catégorie
  Object.entries(categoryKeywords).forEach(([categoryKey, categoryData]) => {
    const matches = [];
    let score = 0;

    categoryData.keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();

      // Recherche exacte (score plus élevé)
      if (normalizedText === keywordLower) {
        score += 10;
        matches.push(keyword);
      }
      // Mot entier trouvé
      else if (new RegExp(`\\b${keywordLower}\\b`, 'i').test(normalizedText)) {
        score += 5;
        matches.push(keyword);
      }
      // Contient le mot
      else if (normalizedText.includes(keywordLower)) {
        score += 2;
        matches.push(keyword);
      }
    });

    if (score > 0) {
      scores[categoryKey] = {
        score,
        slug: categoryData.slug,
        matchedKeywords: matches
      };
    }
  });

  // Retourner la catégorie avec le meilleur score
  if (Object.keys(scores).length === 0) return null;

  const bestMatch = Object.entries(scores).reduce((best, [key, data]) => {
    return data.score > best.score ? { key, ...data } : best;
  }, { score: 0 });

  if (bestMatch.score === 0) return null;

  // Vérifier si plusieurs catégories ont des scores similaires (ambigu)
  const topScores = Object.values(scores)
    .map(s => s.score)
    .sort((a, b) => b - a);

  if (topScores.length > 1 && topScores[0] - topScores[1] < 3) {
    // Trop ambigu, réduire la confiance
    bestMatch.confidence = Math.min(bestMatch.score / 20, 0.5);
  } else {
    bestMatch.confidence = Math.min(bestMatch.score / 10, 1);
  }

  // Mapping des noms de catégories
  const categoryNames = {
    'vehicles': 'Véhicules',
    'rental_property': 'Location Immobilière',
    'vehicle_rental': 'Location Véhicules',
    'vacation_rental': 'Location Vacances',
    'employment': 'Emploi',
    'services': 'Services',
    'fashion': 'Mode & Beauté',
    'real_estate': 'Immobilier (Vente)',
    'electronics': 'Électronique'
  };

  return {
    categoryKey: bestMatch.key,
    slug: bestMatch.slug,
    confidence: bestMatch.confidence,
    matchedKeywords: bestMatch.matchedKeywords,
    categoryName: categoryNames[bestMatch.key] || bestMatch.slug
  };
}

/**
 * Extrait les filtres potentiels du texte de recherche
 * @param {string} searchText - Texte de recherche
 * @param {string} categorySlug - Slug de la catégorie détectée
 * @returns {object} - Objet contenant les filtres détectés
 */
export function extractFiltersFromSearch(searchText, categorySlug) {
  if (!searchText) return {};

  const normalizedText = searchText.toLowerCase();
  const filters = {};

  // Extraction de la wilaya
  const wilayaMatch = normalizedText.match(/\b(alger|oran|constantine|annaba|blida|tlemcen|béjaïa|sétif|batna|tizi ouzou)\b/i);
  if (wilayaMatch) {
    filters.wilaya = wilayaMatch[0];
  }

  // Extraction du prix
  const priceMatch = normalizedText.match(/(\d+)\s*(da|dinar|dinars|million)/i);
  if (priceMatch) {
    const amount = parseInt(priceMatch[1]);
    if (priceMatch[2].toLowerCase().includes('million')) {
      filters.maxPrice = amount * 1000000;
    } else {
      filters.maxPrice = amount;
    }
  }

  // Filtres spécifiques aux véhicules
  if (categorySlug === 'vehicules' || categorySlug === 'location-vehicules') {
    // Carburant
    if (/\bdiesel\b/i.test(normalizedText)) filters.fuel_type = 'diesel';
    else if (/\bessence\b/i.test(normalizedText)) filters.fuel_type = 'essence';
    else if (/\bélectrique\b/i.test(normalizedText)) filters.fuel_type = 'electric';
    else if (/\bhybride\b/i.test(normalizedText)) filters.fuel_type = 'hybrid';

    // Transmission
    if (/\bautomatique\b/i.test(normalizedText)) filters.transmission = 'automatic';
    else if (/\bmanuelle\b/i.test(normalizedText)) filters.transmission = 'manual';

    // Année
    const yearMatch = normalizedText.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) {
      filters.year = parseInt(yearMatch[0]);
    }
  }

  // Filtres spécifiques à l'immobilier
  if (categorySlug === 'location-immobiliere' || categorySlug === 'immobilier') {
    // Nombre de chambres (F2, F3, etc.)
    const fMatch = normalizedText.match(/\bf([2-5])\b/i);
    if (fMatch) {
      filters.bedrooms = parseInt(fMatch[1]) - 1; // F3 = 2 chambres
    }

    // Meublé
    if (/\bmeublé\b/i.test(normalizedText)) filters.furnished = 'meuble';
    else if (/\bvide\b/i.test(normalizedText)) filters.furnished = 'vide';

    // Surface
    const surfaceMatch = normalizedText.match(/(\d+)\s*m[2²]/i);
    if (surfaceMatch) {
      filters.surface = parseInt(surfaceMatch[1]);
    }
  }

  // Filtres spécifiques à l'emploi
  if (categorySlug === 'emploi') {
    if (/\bcdi\b/i.test(normalizedText)) filters.contract_type = 'cdi';
    else if (/\bcdd\b/i.test(normalizedText)) filters.contract_type = 'cdd';
    else if (/\bstage\b/i.test(normalizedText)) filters.contract_type = 'stage';
    else if (/\bfreelance\b/i.test(normalizedText)) filters.contract_type = 'freelance';

    if (/\btélétravail\b|remote/i.test(normalizedText)) filters.remote = true;
  }

  // Filtres spécifiques à l'électronique
  if (categorySlug === 'electronique') {
    // Stockage
    const storageMatch = normalizedText.match(/(\d+)\s*(go|gb)/i);
    if (storageMatch) {
      filters.storage = parseInt(storageMatch[1]);
    }

    // État
    if (/\bneuf\b/i.test(normalizedText)) filters.condition = 'new';
    else if (/\boccasion\b/i.test(normalizedText)) filters.condition = 'used';
  }

  return filters;
}

/**
 * Retourne les filtres disponibles pour une catégorie donnée
 * @param {string} categorySlug - Slug de la catégorie
 * @returns {array} - Liste des filtres disponibles
 */
export function getFiltersForCategory(categorySlug) {
  const filtersByCategory = {
    'vehicules': [
      { name: 'vehicle_type', label: 'Type de véhicule', type: 'select', options: ['voiture', 'moto', 'camion', 'utilitaire'] },
      { name: 'brand', label: 'Marque', type: 'dynamic' },
      { name: 'model', label: 'Modèle', type: 'dynamic' },
      { name: 'year', label: 'Année', type: 'range' },
      { name: 'mileage', label: 'Kilométrage', type: 'range' },
      { name: 'fuel_type', label: 'Carburant', type: 'select', options: ['essence', 'diesel', 'hybrid', 'electric', 'gpl'] },
      { name: 'transmission', label: 'Boîte de vitesse', type: 'select', options: ['manual', 'automatic'] },
      { name: 'condition', label: 'État', type: 'select', options: ['new', 'good', 'used'] },
      { name: 'color', label: 'Couleur', type: 'text' }
    ],
    'location-immobiliere': [
      { name: 'property_type', label: 'Type de bien', type: 'select', options: ['appartement', 'maison', 'studio', 'villa', 'local', 'bureau', 'terrain'] },
      { name: 'bedrooms', label: 'Chambres', type: 'number' },
      { name: 'bathrooms', label: 'Salles de bain', type: 'number' },
      { name: 'surface', label: 'Surface (m²)', type: 'range' },
      { name: 'furnished', label: 'Meublé', type: 'select', options: ['meuble', 'semi-meuble', 'vide'] },
      { name: 'floor', label: 'Étage', type: 'number' },
      { name: 'has_elevator', label: 'Ascenseur', type: 'checkbox' },
      { name: 'has_parking', label: 'Garage', type: 'checkbox' },
      { name: 'has_garden', label: 'Jardin', type: 'checkbox' }
    ],
    'location-vehicules': [
      { name: 'vehicle_type', label: 'Type de véhicule', type: 'select', options: ['voiture', 'moto', 'utilitaire', 'minibus'] },
      { name: 'with_driver', label: 'Avec chauffeur', type: 'select', options: ['oui', 'non'] },
      { name: 'transmission', label: 'Transmission', type: 'select', options: ['manual', 'automatic'] },
      { name: 'seats', label: 'Nombre de places', type: 'select', options: ['2-4', '5-7', '8+'] },
      { name: 'rental_duration', label: 'Durée de location', type: 'select', options: ['jour', 'semaine', 'mois'] },
      { name: 'has_ac', label: 'Climatisation', type: 'checkbox' }
    ],
    'location-vacances': [
      { name: 'accommodation_type', label: "Type d'hébergement", type: 'select', options: ['appartement', 'maison', 'villa', 'studio', 'bungalow', 'chambre'] },
      { name: 'capacity', label: 'Capacité (personnes)', type: 'range' },
      { name: 'bedrooms', label: 'Chambres', type: 'number' },
      { name: 'bathrooms', label: 'Salles de bain', type: 'number' },
      { name: 'has_pool', label: 'Piscine', type: 'checkbox' },
      { name: 'has_beach_access', label: 'Accès plage', type: 'checkbox' },
      { name: 'has_wifi', label: 'WiFi', type: 'checkbox' },
      { name: 'season', label: 'Saison', type: 'select', options: ['ete', 'hiver', 'toute-annee'] }
    ],
    'emploi': [
      { name: 'sector', label: "Secteur d'activité", type: 'select', options: ['informatique', 'commerce', 'ingenierie', 'sante', 'education', 'finance', 'hotellerie', 'btp'] },
      { name: 'contract_type', label: 'Type de contrat', type: 'select', options: ['cdi', 'cdd', 'freelance', 'stage', 'temporaire'] },
      { name: 'experience_level', label: "Niveau d'expérience", type: 'select', options: ['debutant', 'intermediaire', 'confirme', 'expert'] },
      { name: 'education_level', label: "Niveau d'études", type: 'select', options: ['sans', 'bac', 'bac+2', 'bac+5', 'doctorat'] },
      { name: 'work_time', label: 'Temps de travail', type: 'select', options: ['plein', 'partiel', 'flexible'] },
      { name: 'remote', label: 'Télétravail', type: 'select', options: ['total', 'hybride', 'sur-site'] }
    ],
    'services': [
      { name: 'service_type', label: 'Type de service', type: 'select', options: ['plomberie', 'electricite', 'climatisation', 'menuiserie', 'peinture', 'jardinage', 'nettoyage', 'demenagement', 'reparation', 'cours', 'informatique', 'photo'] },
      { name: 'availability', label: 'Disponibilité', type: 'select', options: ['immediat', '48h', 'planifier'] },
      { name: 'location_type', label: 'Déplacement', type: 'select', options: ['domicile', 'local', 'les-deux'] },
      { name: 'experience', label: 'Expérience', type: 'select', options: ['debutant', 'intermediaire', 'expert'] }
    ],
    'mode-beaute': [
      { name: 'category', label: 'Catégorie', type: 'select', options: ['vetements', 'chaussures', 'sacs', 'bijoux', 'cosmetiques', 'parfums'] },
      { name: 'gender', label: 'Genre', type: 'select', options: ['femme', 'homme', 'enfant', 'unisexe'] },
      { name: 'size', label: 'Taille', type: 'select', options: ['xs', 's', 'm', 'l', 'xl', 'xxl'] },
      { name: 'shoe_size', label: 'Pointure', type: 'range', min: 35, max: 46 },
      { name: 'brand', label: 'Marque', type: 'text' },
      { name: 'condition', label: 'État', type: 'select', options: ['neuf-etiquette', 'neuf', 'comme-neuf', 'tres-bon', 'bon'] },
      { name: 'material', label: 'Matière', type: 'select', options: ['coton', 'cuir', 'soie', 'synthetique', 'laine'] }
    ],
    'immobilier': [
      { name: 'property_type', label: 'Type de bien', type: 'select', options: ['appartement', 'maison', 'villa', 'terrain', 'local', 'bureau', 'ferme', 'immeuble'] },
      { name: 'bedrooms', label: 'Chambres', type: 'number' },
      { name: 'bathrooms', label: 'Salles de bain', type: 'number' },
      { name: 'surface', label: 'Surface (m²)', type: 'range' },
      { name: 'land_surface', label: 'Surface terrain (m²)', type: 'range' },
      { name: 'floor', label: 'Étage', type: 'number' },
      { name: 'has_garage', label: 'Garage', type: 'checkbox' },
      { name: 'has_garden', label: 'Jardin', type: 'checkbox' },
      { name: 'has_pool', label: 'Piscine', type: 'checkbox' },
      { name: 'condition', label: 'État', type: 'select', options: ['neuf', 'bon', 'renover', 'construction'] },
      { name: 'title_type', label: 'Acte', type: 'select', options: ['livret', 'notarie', 'autre'] }
    ],
    'electronique': [
      { name: 'category', label: 'Catégorie', type: 'select', options: ['telephones', 'ordinateurs', 'tv', 'audio', 'consoles', 'photo', 'accessoires', 'electromenager'] },
      { name: 'brand', label: 'Marque', type: 'text' },
      { name: 'model', label: 'Modèle', type: 'text' },
      { name: 'condition', label: 'État', type: 'select', options: ['neuf-emballe', 'neuf-ouvert', 'comme-neuf', 'tres-bon', 'bon', 'pieces'] },
      { name: 'warranty', label: 'Garantie', type: 'select', options: ['sous-garantie', 'hors-garantie'] },
      { name: 'storage', label: 'Stockage', type: 'select', options: ['64', '128', '256', '512', '1024'] },
      { name: 'ram', label: 'RAM', type: 'select', options: ['4', '8', '16', '32'] }
    ]
  };

  return filtersByCategory[categorySlug] || [];
}
