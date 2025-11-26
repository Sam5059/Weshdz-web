import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h3>Wesh-DZ</h3>
            <p>La marketplace algérienne de confiance</p>
          </div>
          <div className={styles.section}>
            <h4>À propos</h4>
            <ul>
              <li><a href="#">Qui sommes-nous</a></li>
              <li><a href="#">Comment ça marche</a></li>
              <li><a href="#">Conditions d'utilisation</a></li>
            </ul>
          </div>
          <div className={styles.section}>
            <h4>Support</h4>
            <ul>
              <li><a href="#">Centre d'aide</a></li>
              <li><a href="#">Nous contacter</a></li>
              <li><a href="#">Sécurité</a></li>
            </ul>
          </div>
        </div>
        <div className={styles.bottom}>
          <p>&copy; 2024 Wesh-DZ. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
