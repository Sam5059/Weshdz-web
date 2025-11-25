import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { enrichListingsWithVehicleData } from '../utils/listingHelpers';
import BackButton from '../components/BackButton';
import AdBanner from '../components/AdBanner';
import styles from './MyListings.module.css';

export default function MyListings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchListings();
  }, [user, navigate]);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const enrichedListings = await enrichListingsWithVehicleData(data || []);
      setListings(enrichedListings);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteListing = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) return;

    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchListings();
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      fetchListings();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const statusLabels = {
    draft: 'Brouillon',
    active: 'Active',
    sold: 'Vendue',
    archived: 'Archivée',
  };

  const statusColors = {
    draft: '#6c757d',
    active: '#28a745',
    sold: '#007bff',
    archived: '#dc3545',
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className={styles.myListings}>
      <AdBanner />
      <div className="container" style={{ paddingTop: '220px' }}>
        <BackButton />
        <div className={styles.header}>
          <h1>Mes annonces</h1>
          <Link to="/create-listing" className="btn btn-primary">
            + Nouvelle annonce
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className={styles.empty}>
            <p>Vous n'avez pas encore d'annonces</p>
            <Link to="/create-listing" className="btn btn-primary">
              Créer une annonce
            </Link>
          </div>
        ) : (
          <div className={styles.listingsGrid}>
            {listings.map(listing => (
              <div key={listing.id} className={styles.listingCard}>
                <Link to={`/listing/${listing.id}`} className={styles.listingImage}>
                  {listing.images && listing.images.length > 0 ? (
                    <img src={listing.images[0]} alt={listing.title} />
                  ) : (
                    <div className={styles.noImage}>📷</div>
                  )}
                </Link>

                <div className={styles.listingContent}>
                  <Link to={`/listing/${listing.id}`} className={styles.listingTitle}>
                    {listing.title}
                  </Link>

                  <div className={styles.listingPrice}>
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
                  </div>

                  <div className={styles.listingMeta}>
                    <span>📍 {listing.wilaya}</span>
                    <span style={{ color: statusColors[listing.status] }}>
                      {statusLabels[listing.status]}
                    </span>
                  </div>

                  {/* ═══════════════════════════════════════════════════
                      SECTION: Actions sur l'annonce
                      ─────────────────────────────────────────────────
                      Relations:
                      - updateStatus() → Appel BDD listings.update()
                      - deleteListing() → Appel BDD listings.delete()
                      - navigate() → Redirection vers /edit-listing/:id
                      ═══════════════════════════════════════════════ */}
                  <div className={styles.listingActions}>
                    {/* Dropdown: Changer statut annonce (draft/active/sold/archived) */}
                    <select
                      value={listing.status}
                      onChange={(e) => updateStatus(listing.id, e.target.value)}
                      className={styles.statusSelect}
                    >
                      <option value="draft">Brouillon</option>
                      <option value="active">Active</option>
                      <option value="sold">Vendue</option>
                      <option value="archived">Archivée</option>
                    </select>

                    {/* Bouton MODIFIER: Redirige vers EditListing.jsx
                        - Passe l'ID via URL params (/edit-listing/123)
                        - EditListing récupère les données via supabase.from('listings').select()
                    */}
                    <button
                      onClick={() => navigate(`/edit-listing/${listing.id}`)}
                      className={styles.editBtn}
                      title="Modifier l'annonce"
                    >
                      ✏️
                    </button>

                    {/* Bouton SUPPRIMER: Supprime définitivement l'annonce
                        - Confirmation obligatoire (alert natif)
                        - Supprime aussi les images du storage Supabase
                        - Rafraîchit la liste via fetchListings()
                    */}
                    <button
                      onClick={() => deleteListing(listing.id)}
                      className={styles.deleteBtn}
                      title="Supprimer l'annonce"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
