/**
 * ThemeContext - Gestion du thème clair/sombre de l'application
 *
 * Ce contexte gère:
 * - Le thème actuel (light ou dark)
 * - La persistance du choix dans localStorage
 * - L'application des classes CSS appropriées
 * - La fonction toggleTheme() pour basculer entre les thèmes
 */

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

/**
 * Provider pour le contexte de thème
 * Initialise le thème depuis localStorage ou utilise 'light' par défaut
 */
export function ThemeProvider({ children }) {
  // Récupère le thème sauvegardé ou utilise 'light' par défaut
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Effet qui se déclenche à chaque changement de thème
  useEffect(() => {
    // Sauvegarde le thème dans localStorage
    localStorage.setItem('theme', theme);

    // Ajoute l'attribut data-theme pour les variables CSS
    document.documentElement.setAttribute('data-theme', theme);

    // Ajoute/retire la classe 'dark' pour les styles conditionnels
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Fonction pour basculer entre les thèmes clair et sombre
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook personnalisé pour accéder au contexte de thème
 * @throws {Error} Si utilisé en dehors du ThemeProvider
 * @returns {Object} Contexte contenant theme et toggleTheme
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
