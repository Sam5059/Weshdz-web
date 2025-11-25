import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import styles from './DashboardPage.module.css';

export default function DashboardSettings() {
  const { language, changeLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [message, setMessage] = useState('');

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ar', name: 'العربية', flag: '🇩🇿' }
  ];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Paramètres</h1>
        <p className={styles.pageSubtitle}>Gérez vos préférences</p>
      </div>

      <div className={styles.settingsGrid}>
        <div className={styles.settingCard}>
          <div className={styles.settingHeader}>
            <div className={styles.settingIcon}>
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
              </svg>
            </div>
            <div>
              <h3 className={styles.settingTitle}>Langue</h3>
              <p className={styles.settingDescription}>Choisissez votre langue préférée</p>
            </div>
          </div>
          <div className={styles.settingContent}>
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`${styles.settingOption} ${language === lang.code ? styles.settingOptionActive : ''}`}
                onClick={() => changeLanguage(lang.code)}
              >
                <span className={styles.langFlag}>{lang.flag}</span>
                <span>{lang.name}</span>
                {language === lang.code && (
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style={{marginLeft: 'auto'}}>
                    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.settingCard}>
          <div className={styles.settingHeader}>
            <div className={styles.settingIcon}>
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                {theme === 'light' ? (
                  <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
                ) : (
                  <path d="M9 2c-1.05 0-2.05.16-3 .46 4.06 1.27 7 5.06 7 9.54 0 4.48-2.94 8.27-7 9.54.95.3 1.95.46 3 .46 5.52 0 10-4.48 10-10S14.52 2 9 2z"/>
                )}
              </svg>
            </div>
            <div>
              <h3 className={styles.settingTitle}>Thème</h3>
              <p className={styles.settingDescription}>Basculer entre le mode clair et sombre</p>
            </div>
          </div>
          <div className={styles.settingContent}>
            <button
              className={`${styles.settingOption} ${theme === 'light' ? styles.settingOptionActive : ''}`}
              onClick={() => theme !== 'light' && toggleTheme()}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/>
              </svg>
              <span>Clair</span>
              {theme === 'light' && (
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style={{marginLeft: 'auto'}}>
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                </svg>
              )}
            </button>
            <button
              className={`${styles.settingOption} ${theme === 'dark' ? styles.settingOptionActive : ''}`}
              onClick={() => theme !== 'dark' && toggleTheme()}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 2c-1.05 0-2.05.16-3 .46 4.06 1.27 7 5.06 7 9.54 0 4.48-2.94 8.27-7 9.54.95.3 1.95.46 3 .46 5.52 0 10-4.48 10-10S14.52 2 9 2z"/>
              </svg>
              <span>Sombre</span>
              {theme === 'dark' && (
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style={{marginLeft: 'auto'}}>
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className={styles.settingCard}>
          <div className={styles.settingHeader}>
            <div className={styles.settingIcon}>
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
              </svg>
            </div>
            <div>
              <h3 className={styles.settingTitle}>Sécurité</h3>
              <p className={styles.settingDescription}>Gérez votre mot de passe</p>
            </div>
          </div>
          <div className={styles.settingContent}>
            <button
              className={styles.settingOption}
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
              <span>Changer le mot de passe</span>
            </button>
          </div>
        </div>

        <div className={styles.settingCard}>
          <div className={styles.settingHeader}>
            <div className={styles.settingIcon}>
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
            </div>
            <div>
              <h3 className={styles.settingTitle}>Informations du compte</h3>
              <p className={styles.settingDescription}>Détails de votre compte</p>
            </div>
          </div>
          <div className={styles.settingContent}>
            <div className={styles.accountInfo}>
              <span className={styles.infoLabel}>Email :</span>
              <span className={styles.infoValue}>{user?.email}</span>
            </div>
            <div className={styles.accountInfo}>
              <span className={styles.infoLabel}>ID :</span>
              <span className={styles.infoValue}>{user?.id?.substring(0, 8)}...</span>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className={styles.message}>
          {message}
        </div>
      )}
    </div>
  );
}
