/**
 * Mapping des IDs de filtres vers les colonnes de la BDD
 * Utilisé pour savoir quels filtres doivent être ignorés ou transformés
 */

// Filtres qui ne correspondent PAS à des colonnes BDD directes
// Ces filtres sont soit des catégories UI, soit nécessitent une transformation
export const NON_DB_FILTERS = new Set([
  // Filtres de catégorisation (gérés manuellement dans Home.jsx)
  'category_id',
  'subcategory_id',

  // Filtres de recherche et UI (gérés manuellement)
  'searchTerm',
  'minPrice',
  'maxPrice',
  'date_filter',

  // Filtres UI uniquement (pas de colonne BDD)
  'home_category',
  'electronics_category',
  'fashion_category',
  'leisure_category',
  'equipment_category',
  'garden_category',
  'baby_category',
  'books_category',
  'sport_type',
  'bike_type',
  'instrument_type',
  'toy_age',
  'plant_type',
  'outdoor_furniture',
  'book_genre',
  'music_genre',
  'property_amenities',
  'real_estate_amenities',
  'vacation_amenities',
  'amenities', // Géré séparément comme array
  'title_type' // Colonne n'existe pas encore
]);

// Mapping des IDs de filtres vers les noms de colonnes BDD
// Format: { filterId: 'db_column_name' }
export const FILTER_TO_COLUMN_MAP = {
  // Conditions (différents noms selon catégorie)
  'vehicle_condition': 'condition',
  'property_condition': 'condition',
  'equipment_condition': 'condition',
  'real_estate_condition': 'condition',
  'electronics_condition': 'condition',
  'fashion_condition': 'condition',
  'home_condition': 'condition',
  'leisure_condition': 'condition',
  'garden_condition': 'condition',
  'baby_condition': 'condition',
  'books_condition': 'condition',

  // Animaux
  'age_range': 'animal_age',
  'sterilized': 'neutered',

  // Bébé & Enfants
  'baby_gender': 'child_gender',
  'age_size': 'age_range',
  'ce_compliant': 'safety_standard',

  // Services
  'service_type': 'service_type',
  'availability': 'service_availability',
  'location_type': 'service_location',
  'service_experience': 'service_experience_years',

  // Livres & Média
  'language': 'book_language',

  // Mode
  'shoe_size': 'size', // Range sera géré séparément

  // Véhicules
  'mileage_range': 'mileage', // Géré comme range spécial

  // Location Vacances
  'accommodation_type': 'accommodation_type',
  'capacity': 'guest_capacity', // Range géré spécialement
  'bedrooms': 'bedrooms',
  'bathrooms': 'bathrooms',
  'proximity': 'proximity',
  'season': 'available_season',

  // Emploi
  'sector': 'job_sector',
  'contract_type': 'contract_type',
  'experience_level': 'experience_level',
  'education_level': 'education_level',
  'work_time': 'work_schedule',
  'remote': 'remote_work',

  // Mode & Accessoires
  'gender': 'gender',
  'size': 'size',
  'material': 'material',
  'color': 'color',

  // Immobilier & Location Immobilière
  'surface': 'surface',
  'land_surface': 'land_area',
  'floor': 'floor',
  'furnished': 'furnished',

  // Électronique
  'model': 'model_name',
  'warranty': 'has_warranty',
  'storage': 'storage_capacity',
  'ram': 'ram_size',

  // Maison & Jardin
  'furniture_type': 'furniture_type',
  'style': 'design_style',

  // Loisirs
  'delivery': 'delivery_available',
  'training': 'training_included',

  // Animaux
  'animal_type': 'species',
  'breed': 'breed',
  'vaccinated': 'is_vaccinated',
  'pedigree': 'has_pedigree',

  // Véhicules & Location Véhicules
  'vehicle_type': 'vehicle_type',
  'fuel_type': 'fuel_type',
  'transmission': 'transmission',
  'seats': 'seat_count',
  'with_driver': 'driver_included',
  'rental_duration': 'rental_period',
  'has_ac': 'has_air_conditioning'
};

/**
 * Retourne le nom de colonne BDD pour un filtre donné
 * @param {string} filterId - ID du filtre
 * @returns {string|null} - Nom de la colonne ou null si le filtre ne correspond pas à une colonne
 */
export function getDbColumnName(filterId) {
  // Si le filtre est dans la map, retourner la colonne mappée
  if (FILTER_TO_COLUMN_MAP[filterId]) {
    return FILTER_TO_COLUMN_MAP[filterId];
  }

  // Si le filtre est dans les non-DB, retourner null
  if (NON_DB_FILTERS.has(filterId)) {
    return null;
  }

  // Sinon, le filterId est le nom de la colonne
  return filterId;
}

/**
 * Vérifie si un filtre doit être appliqué à la BDD
 * @param {string} filterId - ID du filtre
 * @returns {boolean}
 */
export function shouldApplyFilter(filterId) {
  return !NON_DB_FILTERS.has(filterId);
}
