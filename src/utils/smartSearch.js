/**
 * SYSTÈME DE RECHERCHE INTELLIGENTE PAR KEYWORDS
 *
 * PRIORITÉ ABSOLUE : Table keywords en base de données
 *
 * 1. Recherche EXACTE dans keywords (ex: "chat" → animal_type_cat)
 * 2. Si aucun keyword → Recherche dans champs structurés (brand_id, model_id)
 * 3. Si rien → Recherche textuelle dans titre uniquement
 *
 * AVANTAGES :
 * - "chat" trouve UNIQUEMENT les chats (pas "achat")
 * - "clio" trouve UNIQUEMENT Renault Clio (pas "climatisation")
 * - Ultra-rapide (recherche par index)
 * - Extensible (ajout facile de nouveaux keywords)
 */

import { supabase } from '../lib/supabase';

/**
 * Recherche un keyword exact dans la base de données
 * @param {string} searchTerm - Terme de recherche
 * @returns {object|null} - Keyword trouvé ou null
 */
async function findKeyword(searchTerm) {
  const { data } = await supabase
    .from('keywords')
    .select('keyword, entity_type, entity_id, weight')
    .ilike('keyword', searchTerm.trim())
    .order('weight', { ascending: false })
    .limit(1)
    .maybeSingle();

  return data;
}

/**
 * Applique un filtre basé sur un keyword
 * @param {object} query - Query Supabase
 * @param {object} keyword - Keyword trouvé (avec entity_type, entity_id)
 * @param {string} searchTerm - Terme original
 * @returns {object} - Query modifiée
 */
async function applyKeywordFilter(query, keyword, searchTerm) {
  const entityType = keyword.entity_type;
  const entityId = keyword.entity_id;

  // ═══════════════════════════════════════════════════════════
  // VÉHICULES - NOUVEAU SYSTÈME AVEC entity_id
  // ═══════════════════════════════════════════════════════════
  if (entityType === 'vehicle_brand' && entityId) {
    console.log('✅ Filtrage par marque véhicule:', searchTerm, 'ID:', entityId);
    return query.eq('brand_id', entityId);
  }

  if (entityType === 'vehicle_model' && entityId) {
    console.log('✅ Filtrage par modèle véhicule:', searchTerm, 'ID:', entityId);
    return query.eq('model_id', entityId);
  }
  // ═══════════════════════════════════════════════════════════
  // ANIMAUX - FILTRER PAR CATÉGORIE EN PRIORITÉ
  // ═══════════════════════════════════════════════════════════

  // Récupérer l'ID de la catégorie Animaux
  const { data: animalCategory } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'animaux')
    .maybeSingle();

  if (entityType === 'animal_type_cat') {
    // CRITICAL: Filter by category FIRST to exclude non-animal listings
    if (animalCategory) {
      return query.eq('category_id', animalCategory.id).eq('animal_type', 'chat');
    }
    return query.eq('animal_type', 'chat');
  }
  if (entityType === 'animal_type_dog') {
    if (animalCategory) {
      return query.eq('category_id', animalCategory.id).eq('animal_type', 'chien');
    }
    return query.eq('animal_type', 'chien');
  }
  if (entityType === 'animal_type_bird') {
    if (animalCategory) {
      return query.eq('category_id', animalCategory.id).eq('animal_type', 'oiseau');
    }
    return query.eq('animal_type', 'oiseau');
  }
  if (entityType === 'animal_type_fish') {
    if (animalCategory) {
      return query.eq('category_id', animalCategory.id).eq('animal_type', 'poisson');
    }
    return query.eq('animal_type', 'poisson');
  }
  if (entityType === 'animal_type_rabbit') {
    if (animalCategory) {
      return query.eq('category_id', animalCategory.id).eq('animal_type', 'lapin');
    }
    return query.eq('animal_type', 'lapin');
  }
  if (entityType === 'animal_type_hamster') {
    if (animalCategory) {
      return query.eq('category_id', animalCategory.id).eq('animal_type', 'hamster');
    }
    return query.eq('animal_type', 'hamster');
  }
  if (entityType === 'animal_type_turtle') {
    if (animalCategory) {
      return query.eq('category_id', animalCategory.id).eq('animal_type', 'tortue');
    }
    return query.eq('animal_type', 'tortue');
  }
  if (entityType === 'dog_breed' || entityType === 'cat_breed') {
    if (animalCategory) {
      return query.eq('category_id', animalCategory.id).ilike('breed', `%${searchTerm}%`);
    }
    return query.ilike('breed', `%${searchTerm}%`);
  }

  // ═══════════════════════════════════════════════════════════
  // ÉLECTRONIQUE - FILTRER PAR CATÉGORIE ET CHAMPS SPÉCIFIQUES
  // ═══════════════════════════════════════════════════════════

  // Récupérer l'ID de la catégorie Électronique
  const { data: electronicCategory } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'electronique')
    .maybeSingle();

  // Récupérer les sous-catégories d'Électronique (Téléphones, Ordinateurs, etc.)
  let electronicCategoryIds = [];
  if (electronicCategory) {
    const { data: subCategories } = await supabase
      .from('categories')
      .select('id')
      .or(`id.eq.${electronicCategory.id},parent_id.eq.${electronicCategory.id}`);

    if (subCategories) {
      electronicCategoryIds = subCategories.map(c => c.id);
    }
  }

  // Marques électroniques
  if (entityType.startsWith('brand_')) {
    const brandName = entityType.replace('brand_', '');
    const brandMap = {
      'apple': 'Apple',
      'samsung': 'Samsung',
      'huawei': 'Huawei',
      'xiaomi': 'Xiaomi',
      'oppo': 'Oppo',
      'sony': 'Sony',
      'dell': 'Dell',
      'hp': 'HP',
      'lenovo': 'Lenovo',
      'asus': 'Asus',
      'acer': 'Acer'
    };

    if (brandMap[brandName] && electronicCategoryIds.length > 0) {
      // CRITICAL: Filter by electronic categories first, then by brand
      return query
        .in('category_id', electronicCategoryIds)
        .or(`brand.ilike.%${brandMap[brandName]}%,brand_fashion.ilike.%${brandMap[brandName]}%`);
    }
  }

  // Types d'appareils
  if (entityType === 'device_smartphone' && electronicCategoryIds.length > 0) {
    return query.in('category_id', electronicCategoryIds).eq('device_type', 'smartphone');
  }
  if (entityType === 'device_tablet' && electronicCategoryIds.length > 0) {
    return query.in('category_id', electronicCategoryIds).eq('device_type', 'tablet');
  }
  if (entityType === 'device_laptop' && electronicCategoryIds.length > 0) {
    return query.in('category_id', electronicCategoryIds).eq('device_type', 'laptop');
  }
  if (entityType === 'device_tv' && electronicCategoryIds.length > 0) {
    return query.in('category_id', electronicCategoryIds).eq('device_type', 'tv');
  }
  if (entityType === 'device_console' && electronicCategoryIds.length > 0) {
    return query.in('category_id', electronicCategoryIds).eq('device_type', 'console');
  }

  // ═══════════════════════════════════════════════════════════
  // IMMOBILIER
  // ═══════════════════════════════════════════════════════════
  if (entityType === 'property_appartement') {
    return query.eq('property_type', 'appartement');
  }
  if (entityType === 'property_maison') {
    return query.eq('property_type', 'maison');
  }
  if (entityType === 'property_villa') {
    return query.eq('property_type', 'villa');
  }
  if (entityType === 'property_studio') {
    return query.eq('property_type', 'studio');
  }
  if (entityType === 'property_commercial') {
    return query.eq('property_type', 'local_commercial');
  }
  if (entityType === 'property_office') {
    return query.eq('property_type', 'bureau');
  }
  if (entityType === 'property_terrain') {
    return query.eq('property_type', 'terrain');
  }
  if (entityType === 'property_f2') {
    return query.eq('bedrooms', 1);
  }
  if (entityType === 'property_f3') {
    return query.eq('bedrooms', 2);
  }
  if (entityType === 'property_f4') {
    return query.eq('bedrooms', 3);
  }
  if (entityType === 'property_f5') {
    return query.eq('bedrooms', 4);
  }
  if (entityType === 'property_furnished') {
    return query.eq('furnished', 'meuble');
  }
  if (entityType === 'property_unfurnished') {
    return query.eq('furnished', 'vide');
  }

  // ═══════════════════════════════════════════════════════════
  // EMPLOI
  // ═══════════════════════════════════════════════════════════
  if (entityType === 'contract_cdi') {
    return query.eq('contract_type', 'cdi');
  }
  if (entityType === 'contract_cdd') {
    return query.eq('contract_type', 'cdd');
  }
  if (entityType === 'contract_stage') {
    return query.eq('contract_type', 'stage');
  }
  if (entityType === 'contract_freelance') {
    return query.eq('contract_type', 'freelance');
  }
  if (entityType.startsWith('job_')) {
    return query.ilike('job_title', `%${searchTerm}%`);
  }

  // ═══════════════════════════════════════════════════════════
  // MODE & BEAUTÉ
  // ═══════════════════════════════════════════════════════════
  if (entityType === 'clothing_dress') {
    return query.eq('clothing_type', 'robe');
  }
  if (entityType === 'clothing_pants') {
    return query.eq('clothing_type', 'pantalon');
  }
  if (entityType === 'clothing_shirt') {
    return query.eq('clothing_type', 'chemise');
  }
  if (entityType === 'clothing_jacket' || entityType === 'clothing_coat') {
    return query.eq('clothing_type', 'veste');
  }
  if (entityType === 'clothing_skirt') {
    return query.eq('clothing_type', 'jupe');
  }
  if (entityType === 'clothing_shoes' || entityType === 'clothing_sneakers') {
    return query.eq('clothing_type', 'chaussure');
  }
  if (entityType === 'clothing_bag' || entityType === 'clothing_handbag') {
    return query.eq('clothing_type', 'sac');
  }

  // ═══════════════════════════════════════════════════════════
  // SERVICES
  // ═══════════════════════════════════════════════════════════
  if (entityType === 'service_plumber' || entityType === 'service_plumbing') {
    return query.eq('service_type', 'plomberie');
  }
  if (entityType === 'service_electrician' || entityType === 'service_electricity') {
    return query.eq('service_type', 'electricite');
  }
  if (entityType === 'service_carpenter' || entityType === 'service_carpentry') {
    return query.eq('service_type', 'menuiserie');
  }
  if (entityType === 'service_painter' || entityType === 'service_painting') {
    return query.eq('service_type', 'peinture');
  }
  if (entityType === 'service_mason') {
    return query.eq('service_type', 'maconnerie');
  }
  if (entityType === 'service_ac') {
    return query.eq('service_type', 'climatisation');
  }
  if (entityType === 'service_gardening' || entityType === 'service_gardener') {
    return query.eq('service_type', 'jardinage');
  }
  if (entityType === 'service_cleaning') {
    return query.eq('service_type', 'nettoyage');
  }
  if (entityType === 'service_moving') {
    return query.eq('service_type', 'demenagement');
  }
  if (entityType === 'service_tutoring') {
    return query.eq('service_type', 'cours');
  }
  if (entityType === 'service_photographer') {
    return query.eq('service_type', 'photo');
  }

  // ═══════════════════════════════════════════════════════════
  // LIVRES & MULTIMÉDIA
  // ═══════════════════════════════════════════════════════════
  if (entityType === 'book_novel') {
    return query.eq('book_genre', 'roman');
  }
  if (entityType === 'book_sf') {
    return query.eq('book_genre', 'sf_fantasy');
  }
  if (entityType === 'book_thriller') {
    return query.eq('book_genre', 'policier_thriller');
  }
  if (entityType === 'book_history') {
    return query.eq('book_genre', 'histoire');
  }
  if (entityType === 'book_biography') {
    return query.eq('book_genre', 'biographie');
  }
  if (entityType === 'book_manga') {
    return query.eq('book_genre', 'manga');
  }
  if (entityType === 'book_comic' || entityType === 'book_comics') {
    return query.eq('book_genre', 'bd');
  }

  // ═══════════════════════════════════════════════════════════
  // MAISON & JARDIN
  // ═══════════════════════════════════════════════════════════
  if (entityType === 'furniture_sofa') {
    return query.eq('furniture_type', 'canape');
  }
  if (entityType === 'furniture_bed') {
    return query.eq('furniture_type', 'lit');
  }
  if (entityType === 'furniture_table') {
    return query.eq('furniture_type', 'table');
  }
  if (entityType === 'furniture_chair') {
    return query.eq('furniture_type', 'chaise');
  }
  if (entityType === 'furniture_wardrobe') {
    return query.eq('furniture_type', 'armoire');
  }
  if (entityType === 'furniture_shelf') {
    return query.eq('furniture_type', 'etagere');
  }
  if (entityType === 'furniture_dresser') {
    return query.eq('furniture_type', 'commode');
  }

  // ═══════════════════════════════════════════════════════════
  // BÉBÉ & ENFANTS
  // ═══════════════════════════════════════════════════════════
  if (entityType === 'baby_stroller') {
    return query.eq('baby_item_type', 'poussette');
  }
  if (entityType === 'baby_carseat') {
    return query.eq('baby_item_type', 'siege_auto');
  }
  if (entityType === 'baby_crib') {
    return query.eq('baby_item_type', 'lit_bebe');
  }
  if (entityType === 'baby_highchair') {
    return query.eq('baby_item_type', 'chaise_haute');
  }
  if (entityType === 'baby_toy') {
    return query.eq('baby_item_type', 'jouet');
  }

  // ═══════════════════════════════════════════════════════════
  // LOISIRS
  // ═══════════════════════════════════════════════════════════
  if (entityType === 'leisure_bike' || entityType === 'leisure_mtb') {
    return query.eq('leisure_type', 'velo');
  }
  if (entityType === 'leisure_scooter') {
    return query.eq('leisure_type', 'trottinette');
  }
  if (entityType === 'leisure_videogame') {
    return query.eq('leisure_type', 'jeux_video');
  }
  if (entityType === 'leisure_guitar' || entityType === 'leisure_piano' || entityType === 'leisure_instrument') {
    return query.eq('leisure_type', 'instrument_musique');
  }
  if (entityType === 'leisure_camping') {
    return query.eq('leisure_type', 'camping');
  }

  // Si aucun mapping trouvé, retourner query inchangée
  return query;
}

/**
 * Fonction principale de recherche intelligente
 * @param {object} query - Query Supabase de base
 * @param {string} searchTerm - Terme de recherche
 * @param {string} categorySlug - Slug de la catégorie (optionnel)
 * @returns {object} Query modifiée
 */
export async function applySmartSearch(query, searchTerm, categorySlug = null) {
  if (!searchTerm || searchTerm.length < 2) return query;

  const normalizedTerm = searchTerm.trim();

  // ═══════════════════════════════════════════════════════════
  // ÉTAPE 1 : RECHERCHE PAR KEYWORDS (PRIORITÉ ABSOLUE)
  // ═══════════════════════════════════════════════════════════
  const keyword = await findKeyword(normalizedTerm);

  if (keyword) {
    console.log('✅ Keyword trouvé:', keyword);
    return await applyKeywordFilter(query, keyword, normalizedTerm);
  }

  // ═══════════════════════════════════════════════════════════
  // ÉTAPE 2 : VÉHICULES (Marques/Modèles en BDD)
  // ═══════════════════════════════════════════════════════════
  if (!categorySlug || categorySlug === 'vehicules' || categorySlug === 'location-vehicules') {
    // Vérifier marques
    const { data: matchingBrand } = await supabase
      .from('brands')
      .select('id, name')
      .ilike('name', `%${normalizedTerm}%`)
      .limit(1)
      .maybeSingle();

    if (matchingBrand) {
      console.log('✅ Marque véhicule trouvée:', matchingBrand.name);
      return query.eq('brand_id', matchingBrand.id);
    }

    // Vérifier modèles
    const { data: matchingModel } = await supabase
      .from('models')
      .select('id, name, brand_id')
      .ilike('name', `%${normalizedTerm}%`)
      .limit(1)
      .maybeSingle();

    if (matchingModel) {
      console.log('✅ Modèle véhicule trouvé:', matchingModel.name);
      return query.eq('model_id', matchingModel.id);
    }
  }

  // ═══════════════════════════════════════════════════════════
  // ÉTAPE 3 : FALLBACK - Recherche textuelle (titre uniquement)
  // ═══════════════════════════════════════════════════════════
  console.log('⚠️ Fallback recherche textuelle pour:', normalizedTerm);
  return query.or(`title.ilike.%${normalizedTerm}%,title.ilike.${normalizedTerm} %,title.ilike.% ${normalizedTerm}`);
}
