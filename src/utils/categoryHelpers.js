export const getCategoryName = (category, language) => {
  if (!category) return '';

  switch (language) {
    case 'ar':
      return category.name_ar || category.name;
    case 'en':
      return category.name_en || category.name;
    case 'fr':
    default:
      return category.name_fr || category.name;
  }
};
