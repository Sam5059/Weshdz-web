/**
 * Utilitaires pour internationalisation (i18n)
 */

/**
 * Récupère le nom traduit d'une catégorie/entité depuis les données Supabase
 * @param {Object} item - Objet avec name_fr, name_en, name_ar
 * @param {string} language - Code langue ('fr', 'en', 'ar')
 * @returns {string} - Nom traduit
 */
export function getTranslatedName(item, language = 'fr') {
  if (!item) return '';

  const key = `name_${language}`;
  return item[key] || item.name_fr || item.name || '';
}

/**
 * Récupère le nom traduit depuis un objet avec structure {fr, en, ar}
 * @param {Object} nameObj - Objet {fr: '...', en: '...', ar: '...'}
 * @param {string} language - Code langue
 * @returns {string} - Nom traduit
 */
export function getLocalizedName(nameObj, language = 'fr') {
  if (!nameObj) return '';
  if (typeof nameObj === 'string') return nameObj;

  return nameObj[language] || nameObj.fr || '';
}

/**
 * Formate un prix avec la devise
 * @param {number} price - Prix
 * @param {string} language - Code langue
 * @returns {string} - Prix formaté
 */
export function formatPrice(price, language = 'fr') {
  if (!price) return '';

  const formatted = new Intl.NumberFormat(language === 'ar' ? 'ar-DZ' : 'fr-DZ').format(price);

  return language === 'ar' ? `${formatted} دج` : `${formatted} DA`;
}

/**
 * Formate une date selon la langue
 * @param {Date|string} date - Date à formater
 * @param {string} language - Code langue
 * @returns {string} - Date formatée
 */
export function formatDate(date, language = 'fr') {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const locale = language === 'ar' ? 'ar-DZ' : language === 'en' ? 'en-US' : 'fr-FR';

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj);
}

/**
 * Retourne la direction du texte (ltr/rtl)
 * @param {string} language - Code langue
 * @returns {string} - 'rtl' ou 'ltr'
 */
export function getTextDirection(language) {
  return language === 'ar' ? 'rtl' : 'ltr';
}
