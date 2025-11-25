import { useNavigate, useLocation } from 'react-router-dom';
import styles from './BackButton.module.css';

export default function BackButton({ fallbackPath = '/' }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      // Fallback to home or specified path
      navigate(fallbackPath);
    }
  };

  // Contextual back label based on current path
  const getBackLabel = () => {
    const path = location.pathname;

    if (path.includes('/listing/')) return 'Retour aux annonces';
    if (path === '/create-listing') return 'Annuler';
    if (path.includes('/edit-listing/')) return 'Annuler';
    if (path === '/my-listings') return 'Retour à l\'accueil';
    if (path === '/favorites') return 'Retour à l\'accueil';
    if (path === '/messages') return 'Retour à l\'accueil';
    if (path === '/profile') return 'Retour à l\'accueil';

    return 'Retour';
  };

  return (
    <button
      onClick={handleBack}
      className={styles.backButton}
      aria-label={getBackLabel()}
    >
      <span className={styles.backIcon}>←</span>
      <span className={styles.backText}>{getBackLabel()}</span>
    </button>
  );
}
