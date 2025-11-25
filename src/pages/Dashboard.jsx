import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    activeListings: 0,
    favorites: 0,
    unreadMessages: 0,
    totalViews: 0
  });
  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [listingsRes, favoritesRes, messagesRes, recentListingsRes] = await Promise.all([
        supabase
          .from('listings')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'active'),
        supabase
          .from('favorites')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),
        supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('receiver_id', user.id)
          .eq('is_read', false),
        supabase
          .from('listings')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3)
      ]);

      setStats({
        activeListings: listingsRes.count || 0,
        favorites: favoritesRes.count || 0,
        unreadMessages: messagesRes.count || 0,
        totalViews: 0
      });

      setRecentListings(recentListingsRes.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFirstName = () => {
    if (!profile?.full_name) return 'Utilisateur';
    return profile.full_name.split(' ')[0];
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Chargement de votre tableau de bord...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Bonjour {getFirstName()} 👋
          </h1>
          <p className={styles.subtitle}>Voici un résumé de votre activité</p>
        </div>
        <Link to="/create-listing" className={styles.createBtn}>
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Nouvelle annonce
        </Link>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6'}}>
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.activeListings}</div>
            <div className={styles.statLabel}>Annonces actives</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444'}}>
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.favorites}</div>
            <div className={styles.statLabel}>Favoris</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e'}}>
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.unreadMessages}</div>
            <div className={styles.statLabel}>Messages non lus</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{background: 'rgba(234, 179, 8, 0.1)', color: '#eab308'}}>
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.totalViews}</div>
            <div className={styles.statLabel}>Vues totales</div>
          </div>
        </div>
      </div>

      {recentListings.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Dernières annonces publiées</h2>
            <Link to="/dashboard/listings" className={styles.seeAllLink}>
              Voir tout
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
              </svg>
            </Link>
          </div>

          <div className={styles.listingsGrid}>
            {recentListings.map((listing) => (
              <div key={listing.id} className={styles.listingCard}>
                <div className={styles.listingImage}>
                  {listing.images && listing.images.length > 0 ? (
                    <img src={listing.images[0]} alt={listing.title} />
                  ) : (
                    <div className={styles.noImage}>
                      <svg width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                      </svg>
                    </div>
                  )}
                  <div className={styles.listingStatus}>
                    <span className={styles.statusBadge}>Actif</span>
                  </div>
                </div>
                <div className={styles.listingContent}>
                  <h3 className={styles.listingTitle}>{listing.title}</h3>
                  <div className={styles.listingPrice}>
                    {listing.price ? `${listing.price.toLocaleString()} DA` : 'Prix non spécifié'}
                  </div>
                  <div className={styles.listingMeta}>
                    <span>{new Date(listing.created_at).toLocaleDateString('fr-FR')}</span>
                    <span>•</span>
                    <span>0 vues</span>
                  </div>
                  <div className={styles.listingActions}>
                    <Link to={`/listing/${listing.id}`} className={styles.actionBtn}>
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
                      Voir
                    </Link>
                    <Link to={`/edit-listing/${listing.id}`} className={styles.actionBtn}>
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                      </svg>
                      Modifier
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>Actions rapides</h2>
        <div className={styles.actionsGrid}>
          <Link to="/create-listing" className={styles.actionCard}>
            <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            <span>Publier une annonce</span>
          </Link>
          <Link to="/dashboard/favorites" className={styles.actionCard}>
            <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span>Mes favoris</span>
          </Link>
          <Link to="/dashboard/messages" className={styles.actionCard}>
            <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            </svg>
            <span>Messages</span>
          </Link>
          <Link to="/dashboard/settings" className={styles.actionCard}>
            <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
            </svg>
            <span>Paramètres</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
