import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import styles from './DashboardPage.module.css';

export default function DashboardSavedSearches() {
  const { user } = useAuth();
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSavedSearches();
    }
  }, [user]);

  const fetchSavedSearches = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setSearches(data);
      }
    } catch (error) {
      console.error('Error fetching saved searches:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSearch = async (id) => {
    try {
      await supabase.from('search_history').delete().eq('id', id);
      setSearches(searches.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting search:', error);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Recherches sauvegardées</h1>
        <p className={styles.pageSubtitle}>Retrouvez vos recherches récentes</p>
      </div>

      {searches.length === 0 ? (
        <div className={styles.emptyState}>
          <svg width="64" height="64" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/>
          </svg>
          <h3>Aucune recherche sauvegardée</h3>
          <p>Vos recherches apparaîtront ici</p>
        </div>
      ) : (
        <div className={styles.list}>
          {searches.map((search) => (
            <div key={search.id} className={styles.listItem}>
              <div className={styles.listItemIcon}>
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
              </div>
              <div className={styles.listItemContent}>
                <div className={styles.listItemTitle}>
                  {search.search_term || 'Recherche sans terme'}
                </div>
                <div className={styles.listItemMeta}>
                  {new Date(search.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
              <button
                className={styles.deleteBtn}
                onClick={() => deleteSearch(search.id)}
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
