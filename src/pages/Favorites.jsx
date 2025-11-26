import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { enrichListingsWithVehicleData } from '../utils/listingHelpers';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import BackButton from '../components/BackButton';
import AdBanner from '../components/AdBanner';
import styles from './Favorites.module.css';

export default function Favorites() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('favorites')
      .select(`
        id,
        listing_id,
        created_at,
        listings (
          id,
          title,
          price,
          images,
          wilaya,
          created_at,
          status,
          communes!listings_commune_fkey(
            name_fr,
            name_ar,
            name_en,
            wilaya_code
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      const filtered = data.filter(f => f.listings);
      const listingsToEnrich = filtered.map(f => f.listings);
      const enrichedListings = await enrichListingsWithVehicleData(listingsToEnrich);
      const enrichedFavorites = filtered.map((fav, idx) => ({
        ...fav,
        listings: enrichedListings[idx]
      }));
      setFavorites(enrichedFavorites);
    }
    setLoading(false);
  };

  const removeFavorite = async (favoriteId) => {
    await supabase.from('favorites').delete().eq('id', favoriteId);
    fetchFavorites();
  };

  return (
    <div className={styles.page}>
      <AdBanner />
      <div className={styles.container} style={{ paddingTop: '220px' }}>
        <BackButton />
        <div className={styles.header}>
          <h1>❤️ {t('header.favorites') || 'Mes Favoris'}</h1>
          <p className={styles.subtitle}>
            {favorites.length} {favorites.length > 1 ? 'annonces sauvegardées' : 'annonce sauvegardée'}
          </p>
        </div>

        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Chargement...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className={styles.empty}>
            <svg width="64" height="64" fill="currentColor" viewBox="0 0 24 24" opacity="0.3">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <p>Aucun favori pour le moment</p>
            <Link to="/" className={styles.emptyBtn}>
              Parcourir les annonces
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {favorites.map((favorite) => {
              const listing = favorite.listings;
              return (
                <div key={favorite.id} className={styles.card}>
                  <Link to={`/listing/${listing.id}`} className={styles.cardImage}>
                    {listing.images && listing.images.length > 0 ? (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                      />
                    ) : (
                      <div className={styles.noImage}>📷</div>
                    )}
                  </Link>
                  <button
                    onClick={() => removeFavorite(favorite.id)}
                    className={styles.removeBtn}
                    title="Retirer des favoris"
                  >
                    ❤️
                  </button>
                  <div className={styles.cardContent}>
                    <Link to={`/listing/${listing.id}`}>
                      <h3 className={styles.cardTitle}>{listing.title}</h3>
                    </Link>
                    <p className={styles.cardPrice}>
                      {listing.price ? (
                        <>
                          {listing.price.toLocaleString()} DA
                          {listing.listing_type === 'louer' && listing.rental_duration && (
                            <span style={{ fontSize: '0.85em', opacity: 0.8 }}>
                              /{listing.rental_duration === 'jour' ? 'jour' : listing.rental_duration === 'semaine' ? 'semaine' : 'mois'}
                            </span>
                          )}
                        </>
                      ) : 'Prix sur demande'}
                    </p>
                    {listing.communes && (
                      <p className={styles.cardLocation}>
                        📍 {listing.communes.name_fr}, {listing.communes.wilaya_code}
                      </p>
                    )}

                    {/* Informations additionnelles selon le type d'annonce */}
                    <div style={{fontSize: '13px', color: '#666', marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                      {listing.brands?.name && (
                        <span>🏷️ {listing.brands.name}</span>
                      )}
                      {listing.models?.name && (
                        <span>📋 {listing.models.name}</span>
                      )}
                      {listing.year && (
                        <span>📅 {listing.year}</span>
                      )}
                      {listing.bedrooms && (
                        <span>🛏️ {listing.bedrooms} ch.</span>
                      )}
                      {listing.surface && (
                        <span>📐 {listing.surface} m²</span>
                      )}
                      {listing.capacity && (
                        <span>👥 {listing.capacity} pers.</span>
                      )}
                    </div>

                    <div className={styles.cardMeta}>
                      <span>
                        {new Date(listing.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </span>
                      <span className={`${styles.statusBadge} ${styles[listing.status]}`}>
                        {listing.status === 'active' ? 'Actif' : listing.status === 'sold' ? 'Vendu' : listing.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
