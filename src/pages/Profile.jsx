import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { wilayas } from '../data/wilayas';
import BackButton from '../components/BackButton';
import AdBanner from '../components/AdBanner';
import styles from './Profile.module.css';

export default function Profile() {
  const { user, profile, updateProfile, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    wilaya: '',
    commune: '',
    is_professional: false,
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        wilaya: profile.wilaya || '',
        commune: profile.commune || '',
        is_professional: profile.is_professional || false,
      });
    }
  }, [user, profile, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await updateProfile(formData);
      setSuccess(t('auth.profileUpdated'));
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(t('auth.errorGeneral'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      setError(t('auth.errorGeneral'));
    }
  };

  if (!profile) {
    return (
      <div className={styles.loading}>
        <p>{t('auth.loading')}</p>
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      <AdBanner />
      <div className="container" style={{ paddingTop: '220px' }}>
        <BackButton />
        <div className={styles.profileCard}>
          <div className={styles.header}>
            <h1>{t('auth.profileTitle')}</h1>
            {!editing && (
              <button onClick={() => setEditing(true)} className="btn btn-outline">
                {t('auth.editProfile')}
              </button>
            )}
          </div>

          {success && <div className={styles.success}>{success}</div>}
          {error && <div className={styles.error}>{error}</div>}

          {editing ? (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={`input-group ${styles.formGroup}`}>
                <label htmlFor="full_name">{t('auth.fullName')}</label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={`input-group ${styles.formGroup}`}>
                <label htmlFor="email">{t('auth.email')}</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  style={{ background: '#f0f0f0', cursor: 'not-allowed' }}
                />
              </div>

              <div className={`input-group ${styles.formGroup}`}>
                <label htmlFor="phone">{t('auth.phone')}</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className={`input-group ${styles.formGroup}`}>
                <label htmlFor="wilaya">{t('auth.wilaya')}</label>
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

              <div className={`input-group ${styles.formGroup}`}>
                <label htmlFor="commune">{t('auth.commune')}</label>
                <input
                  type="text"
                  id="commune"
                  name="commune"
                  value={formData.commune}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={`${styles.checkbox} ${styles.formGroup} ${styles.fullWidth}`}>
                <input
                  type="checkbox"
                  id="is_professional"
                  name="is_professional"
                  checked={formData.is_professional}
                  onChange={handleChange}
                />
                <label htmlFor="is_professional">{t('auth.accountType')}</label>
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setError('');
                    setSuccess('');
                  }}
                  className="btn btn-outline"
                >
                  {t('auth.cancel')}
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? t('auth.saving') : t('auth.saveChanges')}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className={styles.info}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>{t('auth.fullName')}</span>
                  <span className={styles.value}>{profile.full_name}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>{t('auth.email')}</span>
                  <span className={styles.value}>{profile.email}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>{t('auth.phone')}</span>
                  <span className={styles.value}>{profile.phone || t('auth.notProvided')}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>{t('auth.location')}</span>
                  <span className={styles.value}>
                    {profile.wilaya && profile.commune
                      ? `${profile.wilaya}, ${profile.commune}`
                      : t('auth.notProvided')}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>{t('auth.accountType')}</span>
                  <span className={styles.value}>
                    {profile.is_professional ? (
                      <span className={styles.proBadge}>{t('auth.professional')}</span>
                    ) : (
                      t('auth.individual')
                    )}
                  </span>
                </div>
              </div>

              <div className={styles.logoutSection}>
                {!showLogoutConfirm ? (
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className={styles.logoutBtn}
                  >
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                    </svg>
                    {t('header.logout')}
                  </button>
                ) : (
                  <div className={styles.logoutConfirm}>
                    <p>{t('auth.logoutConfirm')}</p>
                    <div className={styles.logoutActions}>
                      <button
                        onClick={() => setShowLogoutConfirm(false)}
                        className={styles.cancelLogoutBtn}
                      >
                        {t('auth.no')}
                      </button>
                      <button
                        onClick={handleLogout}
                        className={styles.confirmLogoutBtn}
                      >
                        {t('auth.yes')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
