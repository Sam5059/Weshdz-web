import { supabase } from '../lib/supabase';

/**
 * Enrichit les listings avec les noms de marques et modèles de véhicules
 * @param {Array} listings - Array de listings
 * @returns {Promise<Array>} - Listings enrichis
 */
export async function enrichListingsWithVehicleData(listings) {
  if (!listings || listings.length === 0) return listings;

  // Si les données sont déjà présentes (via jointure SQL), pas besoin de les recharger
  const firstListing = listings[0];
  const alreadyEnriched = firstListing.brands !== undefined && firstListing.models !== undefined;

  if (alreadyEnriched) {
    return listings;
  }

  // Extraire tous les IDs de marques et modèles uniques (utiliser brand_id et model_id)
  const brandIds = [...new Set(listings.filter(l => l.brand_id).map(l => l.brand_id))];
  const modelIds = [...new Set(listings.filter(l => l.model_id).map(l => l.model_id))];

  // Récupérer les noms en batch
  const brandsMap = {};
  const modelsMap = {};

  if (brandIds.length > 0) {
    const { data: brandsData } = await supabase
      .from('brands')
      .select('id, name')
      .in('id', brandIds);

    if (brandsData) {
      brandsData.forEach(brand => {
        brandsMap[brand.id] = brand;
      });
    }
  }

  if (modelIds.length > 0) {
    const { data: modelsData } = await supabase
      .from('models')
      .select('id, name')
      .in('id', modelIds);

    if (modelsData) {
      modelsData.forEach(model => {
        modelsMap[model.id] = model;
      });
    }
  }

  // Enrichir les listings (utiliser brand_id et model_id)
  return listings.map(listing => ({
    ...listing,
    brands: listing.brand_id ? brandsMap[listing.brand_id] : null,
    models: listing.model_id ? modelsMap[listing.model_id] : null
  }));
}

/**
 * Enrichit un seul listing avec les données de véhicule
 * @param {Object} listing - Un listing
 * @returns {Promise<Object>} - Listing enrichi
 */
export async function enrichSingleListingWithVehicleData(listing) {
  if (!listing) return listing;

  const enriched = { ...listing };

  if (listing.brand_id) {
    const { data: brandData } = await supabase
      .from('brands')
      .select('name')
      .eq('id', listing.brand_id)
      .maybeSingle();
    if (brandData) {
      enriched.brands = brandData;
    }
  }

  if (listing.model_id) {
    const { data: modelData } = await supabase
      .from('models')
      .select('name')
      .eq('id', listing.model_id)
      .maybeSingle();
    if (modelData) {
      enriched.models = modelData;
    }
  }

  return enriched;
}
