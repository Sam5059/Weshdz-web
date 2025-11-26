import { useState, useRef, useEffect } from 'react';
import { useLanguage, SUPPORTED_LANGUAGES } from '../contexts/LanguageContext';
import styles from './LanguageSelector.module.css';

const LANGUAGE_FLAGS = {
  [SUPPORTED_LANGUAGES.FR]: { flag: '🇫🇷', label: 'FR' },
  [SUPPORTED_LANGUAGES.EN]: { flag: '🇬🇧', label: 'EN' },
  [SUPPORTED_LANGUAGES.AR]: { flag: '🇸🇦', label: 'AR' }
};

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = LANGUAGE_FLAGS[language];

  const handleSelect = (langCode) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className={styles.languageSelector} ref={dropdownRef}>
      <button
        className={styles.dropdownButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
      >
        <span className={styles.currentLang}>{currentLang.label}</span>
        <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24" className={styles.arrow}>
          <path d="M7 10l5 5 5-5z"/>
        </svg>
      </button>
      {isOpen && (
        <div className={styles.dropdownMenu}>
          {Object.entries(LANGUAGE_FLAGS).map(([langCode, { flag, label }]) => (
            <button
              key={langCode}
              className={`${styles.dropdownItem} ${language === langCode ? styles.active : ''}`}
              onClick={() => handleSelect(langCode)}
            >
              <span className={styles.flag}>{flag}</span>
              <span className={styles.label}>{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
