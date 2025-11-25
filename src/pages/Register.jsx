import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { wilayas } from '../data/wilayas';
import styles from './Auth.module.css';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
    wilaya: '',
    commune: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.errorPasswordMismatch'));
      return;
    }

    if (formData.password.length < 6) {
      setError(t('auth.errorPasswordLength'));
      return;
    }

    setLoading(true);

    try {
      await signUp(formData.email, formData.password, {
        full_name: formData.full_name,
        phone: formData.phone,
        wilaya: formData.wilaya,
        commune: formData.commune,
      });
      navigate('/');
    } catch (error) {
      if (error.message?.includes('already')) {
        setError(t('auth.errorEmailExists'));
      } else {
        setError(t('auth.errorGeneral'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <h1>{t('auth.registerTitle')}</h1>
        <p className={styles.subtitle}>{t('auth.registerSubtitle')}</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="full_name">{t('auth.fullName')}</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>👤</span>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Ahmed Benali"
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">{t('auth.email')}</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>📧</span>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="nom@exemple.com"
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="phone">{t('auth.phone')}</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>📱</span>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0555 123 456"
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="wilaya">{t('auth.wilaya')}</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>📍</span>
              <select
                id="wilaya"
                name="wilaya"
                value={formData.wilaya}
                onChange={handleChange}
                required
              >
                <option value="">{t('auth.selectWilaya')}</option>
                {wilayas.map(wilaya => (
                  <option key={wilaya.code} value={wilaya.name}>
                    {wilaya.code} - {wilaya.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="commune">{t('auth.commune')}</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>🏘️</span>
              <input
                type="text"
                id="commune"
                name="commune"
                value={formData.commune}
                onChange={handleChange}
                placeholder="Ex: Bab Ezzouar"
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">{t('auth.password')}</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>🔒</span>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength="6"
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">{t('auth.confirmPassword')}</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>🔒</span>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength="6"
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
                {t('auth.registering')}
              </>
            ) : (
              t('auth.registerButton')
            )}
          </button>
        </form>

        <p className={styles.switchAuth}>
          {t('auth.alreadyHaveAccount')}
          <Link to="/login">{t('auth.loginButton')}</Link>
        </p>
      </div>
    </div>
  );
}
