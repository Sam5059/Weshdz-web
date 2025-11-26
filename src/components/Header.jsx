/**
 * Header - Composant d'en-tête principal de l'application
 *
 * Fonctionnalités :
 * - Logo et navigation principale
 * - Barre de recherche intelligente
 * - Menu utilisateur (connexion, profil, déconnexion)
 * - Sélecteur de langue
 * - Basculeur de thème clair/sombre
 * - Historique de recherche
 * - Compteur de favoris
 * - Menu des catégories
 */

import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import LanguageSelector from './LanguageSelector';
import CategoryMenu from './CategoryMenu';
import SearchBar from './SearchBar';
import styles from './Header.module.css';

export default function Header() {
  const { user, profile, signOut } = useAuth();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // États pour l'affichage des menus déroulants
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Données de l'historique et favoris
  const [searchHistory, setSearchHistory] = useState([]);
  const [favoritesCount, setFavoritesCount] = useState(0);

  // Affichage de la barre de recherche sur mobile
  const [showSearchBar, setShowSearchBar] = useState(false);

  const handleSearch = async (searchFilters) => {
    navigate('/', { state: { searchFilters } });
  };

  const handleCategoryDetected = async (detectedCategory) => {
    navigate('/', { state: { detectedCategory } });
  };

  useEffect(() => {
    if (user) {
      fetchSearchHistory();
      fetchFavoritesCount();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest(`.${styles.iconBtnWrapper}`)) {
        setShowUserMenu(false);
      }
      if (showSearchHistory && !event.target.closest(`.${styles.iconBtnWrapper}`)) {
        setShowSearchHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu, showSearchHistory]);

  const fetchSearchHistory = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('search_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);
    if (data) setSearchHistory(data);
  };

  const fetchFavoritesCount = async () => {
    if (!user) return;
    const { count } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);
    setFavoritesCount(count || 0);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const deleteSearchHistoryItem = async (id) => {
    await supabase.from('search_history').delete().eq('id', id);
    fetchSearchHistory();
  };

  const clearAllSearchHistory = async () => {
    if (!user) return;
    await supabase.from('search_history').delete().eq('user_id', user.id);
    setSearchHistory([]);
    setShowSearchHistory(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <div className={styles.logoWrapper}>
            <span className={styles.logoText}>
              <span className={styles.letterRed}>W</span>
              <span className={styles.letterBlue}>e</span>
              <span className={styles.letterYellow}>s</span>
              <span className={styles.letterGreen}>h</span>
              <span className={styles.dz}>DZ</span>
            </span>
            <span className={styles.logoSubtitle}>Marketplace Algérien</span>
          </div>
        </Link>

        <div className={styles.searchBarWrapper}>
          <SearchBar onSearch={handleSearch} onCategoryDetected={handleCategoryDetected} compact={true} />
        </div>

        <nav className={styles.nav}>
          <Link to="/" className={styles.navIconLink} title={t('header.home')}>
            <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </Link>
          {user && (
            <>
              <Link to="/my-listings" className={styles.navIconLink} title={t('header.myListings')}>
                <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </Link>
              <Link to="/messages" className={styles.navIconLink} title={t('header.messages')}>
                <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                </svg>
              </Link>
            </>
          )}
        </nav>

        <div className={styles.actions}>
          {user && (
            <>
              <div className={styles.iconBtnWrapper}>
                <button
                  className={styles.iconBtn}
                  onClick={() => {
                    setShowSearchHistory(!showSearchHistory);
                    setShowFavorites(false);
                  }}
                  title="Historique de recherche"
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    <path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z" opacity="0.5"/>
                  </svg>
                </button>
                {showSearchHistory && searchHistory.length > 0 && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                      <span>Recherches récentes</span>
                      <button onClick={clearAllSearchHistory} className={styles.clearBtn}>Effacer tout</button>
                    </div>
                    {searchHistory.map(item => (
                      <div key={item.id} className={styles.dropdownItem}>
                        <span>{item.search_term || 'Recherche sans terme'}</span>
                        <button onClick={() => deleteSearchHistoryItem(item.id)} className={styles.deleteBtn}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.iconBtnWrapper}>
                <Link
                  to="/favorites"
                  className={styles.iconBtn}
                  title="Mes favoris"
                  onClick={() => setShowFavorites(false)}
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  {favoritesCount > 0 && <span className={styles.badge}>{favoritesCount}</span>}
                </Link>
              </div>
            </>
          )}

          <button
            className={styles.iconBtn}
            onClick={toggleTheme}
            title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}
          >
            {theme === 'light' ? (
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 2c-1.05 0-2.05.16-3 .46 4.06 1.27 7 5.06 7 9.54 0 4.48-2.94 8.27-7 9.54.95.3 1.95.46 3 .46 5.52 0 10-4.48 10-10S14.52 2 9 2z"/>
              </svg>
            ) : (
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
              </svg>
            )}
          </button>

          <Link to="/?category=materiel-professionnel" className={styles.storesBtn}>
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
            <span className={styles.storesPro}>Store Pro</span>
          </Link>

          {user ? (
            <>
              <Link to="/create-listing" className={styles.postBtn}>
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
                </svg>
                {t('header.publish')}
              </Link>

              <div className={styles.profileGroup}>
                <LanguageSelector />
                <div className={styles.iconBtnWrapper}>
                  <button
                    className={styles.profileBtn}
                    onClick={() => {
                      setShowUserMenu(!showUserMenu);
                      setShowSearchHistory(false);
                      setShowFavorites(false);
                    }}
                    title={t('header.myAccount')}
                  >
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </button>
                  {showUserMenu && (
                    <div className={styles.userDropdown}>
                      <div className={styles.userDropdownHeader}>
                        <div className={styles.userInfo}>
                          <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                          <div>
                            <div className={styles.userName}>{profile?.full_name || 'Utilisateur'}</div>
                            <div className={styles.userEmail}>{user.email}</div>
                          </div>
                        </div>
                      </div>
                      <div className={styles.userDropdownMenu}>
                        <Link to="/profile" className={styles.userMenuItem} onClick={() => setShowUserMenu(false)}>
                          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                          </svg>
                          <span>Mon profil</span>
                        </Link>
                        <Link to="/my-listings" className={styles.userMenuItem} onClick={() => setShowUserMenu(false)}>
                          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                          </svg>
                          <span>Mes annonces</span>
                        </Link>
                        <Link to="/favorites" className={styles.userMenuItem} onClick={() => setShowUserMenu(false)}>
                          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                          <span>Mes favoris</span>
                          {favoritesCount > 0 && <span className={styles.menuBadge}>{favoritesCount}</span>}
                        </Link>
                        <Link to="/messages" className={styles.userMenuItem} onClick={() => setShowUserMenu(false)}>
                          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                          </svg>
                          <span>Messages</span>
                        </Link>
                        <div className={styles.userMenuDivider}></div>
                        <button className={`${styles.userMenuItem} ${styles.logoutItem}`} onClick={() => { handleSignOut(); setShowUserMenu(false); }}>
                          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                          </svg>
                          <span>Se déconnecter</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={styles.profileGroup}>
                <LanguageSelector />
                <Link to="/login" className={styles.loginBtn}>
                  {t('header.login')}
                </Link>
              </div>
              <Link to="/register" className={styles.postBtn}>
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
                </svg>
                {t('header.depositListing')}
              </Link>
            </>
          )}
        </div>
      </div>
      <CategoryMenu />
    </header>
  );
}
