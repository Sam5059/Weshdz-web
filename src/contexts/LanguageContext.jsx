/**
 * LanguageContext - Gestion multilingue de l'application
 *
 * Ce contexte gère:
 * - La langue actuelle de l'interface (fr, en, ar)
 * - La persistance du choix de langue dans localStorage
 * - La direction du texte (LTR ou RTL pour l'arabe)
 * - La fonction de traduction t()
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { translations, t as translateKey } from '../i18n/translations';

const LanguageContext = createContext();

// Langues supportées par l'application
export const SUPPORTED_LANGUAGES = {
  FR: 'fr',  // Français
  EN: 'en',  // Anglais
  AR: 'ar'   // Arabe
};

/**
 * Provider pour le contexte de langue
 * Initialise la langue depuis localStorage ou utilise FR par défaut
 */
export function LanguageProvider({ children }) {
  // Récupère la langue sauvegardée ou utilise français par défaut
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || SUPPORTED_LANGUAGES.FR;
  });

  // Effet qui se déclenche à chaque changement de langue
  useEffect(() => {
    // Sauvegarde la langue dans localStorage
    localStorage.setItem('language', language);

    // Met à jour l'attribut lang du HTML pour l'accessibilité
    document.documentElement.lang = language;

    // Change la direction du texte (RTL pour l'arabe, LTR pour les autres)
    document.documentElement.dir = language === SUPPORTED_LANGUAGES.AR ? 'rtl' : 'ltr';
  }, [language]);

  // Fonction de traduction qui utilise la langue courante
  const t = (key) => translateKey(key, language);

  // Indicateur si la langue actuelle est en mode RTL (Right-To-Left)
  const isRTL = language === SUPPORTED_LANGUAGES.AR;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL, translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook personnalisé pour accéder au contexte de langue
 * @throws {Error} Si utilisé en dehors du LanguageProvider
 * @returns {Object} Contexte contenant language, setLanguage, t, isRTL, translations
 */
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
