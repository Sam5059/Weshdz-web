import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import styles from './Auth.module.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      setSuccess(true);
      setEmail('');
    } catch (error) {
      setError(t('auth.errorGeneral'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <h1>{t('auth.forgotPasswordTitle')}</h1>
        <p className={styles.subtitle}>{t('auth.forgotPasswordSubtitle')}</p>

        {error && <div className={styles.error}>{error}</div>}
        {success && (
          <div className={styles.success}>{t('auth.resetLinkSent')}</div>
        )}

        {!success ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">{t('auth.email')}</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>📧</span>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className={`${styles.btn} ${styles.btnPrimary}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.spinner}></span>
                  {t('auth.loading')}
                </>
              ) : (
                t('auth.sendResetLink')
              )}
            </button>
          </form>
        ) : null}

        <p className={styles.switchAuth}>
          <Link to="/login" className={styles.backLink}>
            ← {t('auth.backToLogin')}
          </Link>
        </p>
      </div>
    </div>
  );
}
