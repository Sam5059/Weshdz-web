import { supabase } from '../lib/supabase';

export const getCommuneName = (commune, language) => {
  if (!commune) return '';

  switch (language) {
    case 'ar':
      return commune.name_ar || commune.name_fr;
    case 'en':
      return commune.name_en || commune.name_fr;
    case 'fr':
    default:
      return commune.name_fr;
  }
};

export const fetchCommunesByWilaya = async (wilayaCode) => {
  if (!wilayaCode) return [];

  const { data, error } = await supabase
    .from('communes')
    .select('id, wilaya_code, name_fr, name_ar, name_en, post_code')
    .eq('wilaya_code', wilayaCode)
    .order('name_fr');

  if (error) {
    console.error('Error fetching communes:', error);
    return [];
  }

  return data || [];
};

export const getWilayaCodeFromName = (wilayaName, wilayas) => {
  if (!wilayaName) return null;

  // Handle both formats: "Alger" and "16 - Alger"
  let searchName = wilayaName;
  if (wilayaName.includes(' - ')) {
    searchName = wilayaName.split(' - ')[1];
  }

  const wilaya = wilayas.find(w => w.name === searchName);
  return wilaya ? wilaya.code : null;
};
