import { useState, useEffect } from 'react';
import styles from './AdBanner.module.css';

export default function AdBanner() {
  const [topPosition, setTopPosition] = useState(170);

  useEffect(() => {
    const updatePosition = () => {
      const categoryMenu = document.querySelector('[class*="categoryMenu"]');
      const subcategoryBar = document.querySelector('[class*="subcategoryBar"]');

      if (categoryMenu) {
        const menuHeight = categoryMenu.offsetHeight;
        const subcategoryHeight = subcategoryBar ? subcategoryBar.offsetHeight : 0;
        const headerHeight = 90;
        setTopPosition(headerHeight + menuHeight + subcategoryHeight);
      }
    };

    updatePosition();

    const observer = new MutationObserver(updatePosition);
    const categoryMenu = document.querySelector('[class*="categoryMenu"]');
    const subcategoryBar = document.querySelector('[class*="subcategoryBar"]');

    if (categoryMenu) {
      observer.observe(categoryMenu, {
        attributes: true,
        childList: true,
        subtree: true
      });
    }

    if (subcategoryBar) {
      observer.observe(subcategoryBar, {
        attributes: true,
        childList: true,
        subtree: true
      });
    }

    window.addEventListener('resize', updatePosition);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updatePosition);
    };
  }, []);

  return (
    <div className={styles.adBanner} style={{ top: `${topPosition}px` }}>
      <div className={styles.adContent}>
        <span className={styles.adLabel}>Publicité</span>
        <div className={styles.adPlaceholder}>
          <p>Espace publicitaire 1200x130</p>
        </div>
      </div>
    </div>
  );
}
