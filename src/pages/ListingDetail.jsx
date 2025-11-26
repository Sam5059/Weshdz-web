import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { wilayas } from '../data/wilayas';
import { enrichListingsWithVehicleData } from '../utils/listingHelpers';
import { getCommuneName } from '../utils/communeHelpers';
import BackButton from '../components/BackButton';
import AdBanner from '../components/AdBanner';
import styles from './ListingDetail.module.css';

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [similarListings, setSimilarListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const { data: listingData, error: listingError } = await supabase
        .from('listings')
        .select(`
          *,
          profiles(full_name, phone, wilaya, is_professional),
          communes!listings_commune_fkey(name_fr, name_ar, name_en, wilaya_code)
        `)
        .eq('id', id)
        .single();

      if (listingError) throw listingError;

      // Fetch brand and model names if IDs exist
      if (listingData.brand_id) {
        const { data: brandData } = await supabase
          .from('brands')
          .select('name')
          .eq('id', listingData.brand_id)
          .maybeSingle();
        if (brandData) {
          listingData.brands = brandData;
        }
      }

      if (listingData.model_id) {
        const { data: modelData } = await supabase
          .from('models')
          .select('name')
          .eq('id', listingData.model_id)
          .maybeSingle();
        if (modelData) {
          listingData.models = modelData;
        }
      }

      setListing(listingData);

      if (listingData.delivery_available) {
        const { data: deliveryData } = await supabase
          .from('delivery_options')
          .select('*')
          .eq('listing_id', id);

        setDeliveryOptions(deliveryData || []);
      }

      // Fetch similar listings
      fetchSimilarListings(listingData);
    } catch (error) {
      console.error('Error fetching listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarListings = async (currentListing) => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          categories!listings_category_id_fkey(name, name_fr),
          communes!listings_commune_fkey(name_fr, name_ar, name_en, wilaya_code)
        `)
        .eq('status', 'active')
        .neq('id', currentListing.id)
        .or(`category_id.eq.${currentListing.category_id},wilaya.eq.${currentListing.wilaya}`)
        .limit(6);

      if (!error && data) {
        const enrichedSimilar = await enrichListingsWithVehicleData(data);
        setSimilarListings(enrichedSimilar);
      }
    } catch (error) {
      console.error('Error fetching similar listings:', error);
    }
  };

  const getWilayaName = (wilayaCode) => {
    const wilaya = wilayas.find(w => w.code === wilayaCode);
    return wilaya ? wilaya.name : wilayaCode;
  };

  const getWilayaCode = (wilayaName) => {
    const wilaya = wilayas.find(w => w.name === wilayaName);
    return wilaya ? wilaya.code : '';
  };

  const getCategoryBadge = (category) => {
    if (!category) return 'Offre';

    const categoryName = (category.name_fr || category.name || '').toLowerCase();

    if (categoryName.includes('immobilier') || categoryName.includes('location') || categoryName.includes('louer')) {
      return 'Location';
    } else if (categoryName.includes('emploi') || categoryName.includes('job') || categoryName.includes('travail')) {
      return 'Emploi';
    } else if (categoryName.includes('service')) {
      return 'Service';
    } else if (categoryName.includes('véhicule') || categoryName.includes('voiture') || categoryName.includes('moto')) {
      return 'Véhicule';
    }

    return 'Offre';
  };

  const handleContact = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/messages?listing=${id}`);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Chargement...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className={styles.notFound}>
        <h2>Annonce introuvable</h2>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Retour à l'accueil
        </button>
      </div>
    );
  }

  const conditionLabels = {
    new: 'Neuf',
    like_new: 'Comme neuf',
    good: 'Bon état',
    fair: 'État correct',
    service: 'Service',
  };

  const deliveryTypeLabels = {
    pickup: 'Retrait sur place',
    home: 'Livraison à domicile',
    yalidine: 'Yalidine',
    maystro: 'Maystro',
  };

  return (
    <div className={styles.listingDetail}>
      <AdBanner />
      <div className="container" style={{ paddingTop: '220px' }}>
        <BackButton />
        <div className={styles.content}>
          <div className={styles.gallery}>
            {listing.images && listing.images.length > 0 ? (
              <>
                <div className={styles.mainImage} onClick={() => setShowImageModal(true)}>
                  <img src={listing.images[currentImageIndex]} alt={listing.title} />
                  <div className={styles.zoomIcon}>🔍 Cliquez pour agrandir</div>
                </div>
                {listing.images.length > 1 && (
                  <div className={styles.thumbnails}>
                    {listing.images.map((img, index) => (
                      <div
                        key={index}
                        className={`${styles.thumbnail} ${index === currentImageIndex ? styles.active : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img src={img} alt={`${listing.title} ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                )}

                {showImageModal && (
                  <div className={styles.imageModalOverlay} onClick={() => setShowImageModal(false)}>
                    <span className={styles.modalClose}>&times;</span>
                    <img
                      src={listing.images[currentImageIndex]}
                      alt={listing.title}
                      className={styles.modalImageFull}
                      onClick={(e) => e.stopPropagation()}
                    />
                    {listing.images.length > 1 && (
                      <>
                        <button
                          className={styles.modalPrev}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex(prev => prev === 0 ? listing.images.length - 1 : prev - 1);
                          }}
                        >
                          ←
                        </button>
                        <button
                          className={styles.modalNext}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex(prev => prev === listing.images.length - 1 ? 0 : prev + 1);
                          }}
                        >
                          →
                        </button>
                        <div className={styles.modalCounter}>
                          {currentImageIndex + 1} / {listing.images.length}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className={styles.noImage}>
                <span>📷</span>
                <p>Aucune image disponible</p>
              </div>
            )}
          </div>

          <div className={styles.details}>
            <div className={styles.header}>
              <h1>{listing.title}</h1>
              <div className={styles.price}>
                {listing.price ? (
                  <>
                    {listing.price.toLocaleString()} DA
                    {listing.listing_type === 'louer' && listing.rental_duration && (
                      <span style={{ fontSize: '0.85em', opacity: 0.8, marginLeft: '8px' }}>
                        /{listing.rental_duration === 'jour' ? 'jour' : listing.rental_duration === 'semaine' ? 'semaine' : 'mois'}
                      </span>
                    )}
                    {listing.negotiable && <span className={styles.negotiable}>Négociable</span>}
                  </>
                ) : 'Prix sur demande'}
              </div>
            </div>

            <div className={styles.info}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>État</span>
                <span className={styles.infoValue}>{conditionLabels[listing.condition]}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Localisation</span>
                <span className={styles.infoValue}>📍 {listing.communes ? `${listing.communes.name_fr}, ${listing.communes.wilaya_code}` : listing.wilaya}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Publié le</span>
                <span className={styles.infoValue}>
                  {new Date(listing.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>ID annonce</span>
                <span className={styles.infoValue}>{listing.id}</span>
              </div>
            </div>

            {/* Vehicle Details */}
            {(listing.brand || listing.vehicle_type || listing.year) && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>🚗 Caractéristiques du véhicule</h3>
                <div className={styles.detailsGrid}>
                  {listing.vehicle_type && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Type de véhicule</span>
                      <span className={styles.detailValue}>{
                        listing.vehicle_type === 'voiture' ? 'Voiture' :
                        listing.vehicle_type === 'moto' ? 'Moto' :
                        listing.vehicle_type === 'camion' ? 'Camion' :
                        listing.vehicle_type === 'bus' ? 'Bus' :
                        listing.vehicle_type
                      }</span>
                    </div>
                  )}
                  {listing.brands && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Marque</span>
                      <span className={styles.detailValue}>{listing.brands.name}</span>
                    </div>
                  )}
                  {listing.models && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Modèle</span>
                      <span className={styles.detailValue}>{listing.models.name}</span>
                    </div>
                  )}
                  {listing.year && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Année</span>
                      <span className={styles.detailValue}>{listing.year}</span>
                    </div>
                  )}
                  {listing.mileage && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Kilométrage</span>
                      <span className={styles.detailValue}>{listing.mileage.toLocaleString()} km</span>
                    </div>
                  )}
                  {listing.fuel_type && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Carburant</span>
                      <span className={styles.detailValue}>{
                        listing.fuel_type === 'essence' ? 'Essence' :
                        listing.fuel_type === 'diesel' ? 'Diesel' :
                        listing.fuel_type === 'gpl' ? 'GPL' :
                        listing.fuel_type === 'electrique' ? 'Électrique' :
                        listing.fuel_type === 'hybride' ? 'Hybride' :
                        listing.fuel_type
                      }</span>
                    </div>
                  )}
                  {listing.transmission && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Transmission</span>
                      <span className={styles.detailValue}>{
                        listing.transmission === 'manuelle' ? 'Manuelle' :
                        listing.transmission === 'automatique' ? 'Automatique' :
                        listing.transmission === 'semi_automatique' ? 'Semi-automatique' :
                        listing.transmission
                      }</span>
                    </div>
                  )}
                  {listing.color && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Couleur</span>
                      <span className={styles.detailValue}>{
                        listing.color === 'noir' ? 'Noir' :
                        listing.color === 'blanc' ? 'Blanc' :
                        listing.color === 'gris' ? 'Gris' :
                        listing.color === 'argent' ? 'Argent' :
                        listing.color === 'bleu' ? 'Bleu' :
                        listing.color === 'rouge' ? 'Rouge' :
                        listing.color
                      }</span>
                    </div>
                  )}
                  {listing.doors && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Portes</span>
                      <span className={styles.detailValue}>{listing.doors} portes</span>
                    </div>
                  )}
                  {listing.engine_capacity && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Cylindrée</span>
                      <span className={styles.detailValue}>{listing.engine_capacity} cm³</span>
                    </div>
                  )}
                  {listing.horsepower && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Puissance</span>
                      <span className={styles.detailValue}>{listing.horsepower} CV</span>
                    </div>
                  )}
                  {listing.seats && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Places</span>
                      <span className={styles.detailValue}>{listing.seats} places</span>
                    </div>
                  )}
                </div>

                {listing.features && listing.features.length > 0 && (
                  <div className={styles.amenitiesSection}>
                    <h4 className={styles.subsectionTitle}>Équipements et options</h4>
                    <div className={styles.amenitiesList}>
                      {listing.features.map(feature => (
                        <div key={feature} className={styles.amenityBadge}>
                          {feature === 'climatisation' ? '❄️ Climatisation' :
                           feature === 'abs' ? '🛡️ ABS' :
                           feature === 'airbags' ? '💨 Airbags' :
                           feature === 'gps' ? '🗺️ GPS' :
                           feature === 'camera_recul' ? '📹 Caméra de recul' :
                           feature === 'capteurs_parking' ? '📡 Capteurs parking' :
                           feature === 'regulateur_vitesse' ? '🎚️ Régulateur' :
                           feature === 'siege_chauffant' ? '🔥 Sièges chauffants' :
                           feature === 'toit_ouvrant' ? '☀️ Toit ouvrant' :
                           feature === 'jantes_alu' ? '⭕ Jantes alu' :
                           feature === 'bluetooth' ? '📱 Bluetooth' :
                           feature === 'usb' ? '🔌 USB' :
                           feature}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Real Estate Details */}
            {(listing.property_type || listing.bedrooms || listing.surface) && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>🏠 Caractéristiques du bien</h3>
                <div className={styles.detailsGrid}>
                  {listing.accommodation_type && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Type d'hébergement</span>
                      <span className={styles.detailValue}>{
                        listing.accommodation_type === 'appartement' ? 'Appartement' :
                        listing.accommodation_type === 'villa' ? 'Villa' :
                        listing.accommodation_type === 'maison' ? 'Maison' :
                        listing.accommodation_type === 'bungalow' ? 'Bungalow' :
                        listing.accommodation_type === 'chalet' ? 'Chalet' :
                        listing.accommodation_type === 'studio' ? 'Studio' :
                        listing.accommodation_type === 'residence' ? 'Résidence de vacances' :
                        listing.accommodation_type === 'chambre' ? 'Chambre d\'hôtes' :
                        listing.accommodation_type === 'camping' ? 'Camping/Bungalow' :
                        listing.accommodation_type
                      }</span>
                    </div>
                  )}
                  {listing.property_type && !listing.accommodation_type && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Type de bien</span>
                      <span className={styles.detailValue}>{
                        listing.property_type === 'appartement' ? 'Appartement' :
                        listing.property_type === 'maison' ? 'Maison' :
                        listing.property_type === 'studio' ? 'Studio' :
                        listing.property_type === 'villa' ? 'Villa' :
                        listing.property_type === 'local_commercial' ? 'Local commercial' :
                        listing.property_type === 'bureau' ? 'Bureau' :
                        listing.property_type === 'terrain' ? 'Terrain' :
                        listing.property_type
                      }</span>
                    </div>
                  )}
                  {listing.vacation_destination && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Destination</span>
                      <span className={styles.detailValue}>{
                        listing.vacation_destination === 'bord_de_mer' ? '🏖️ Bord de mer' :
                        listing.vacation_destination === 'montagne' ? '⛰️ Montagne' :
                        listing.vacation_destination === 'sahara_sud' ? '🏜️ Sahara & Sud' :
                        listing.vacation_destination === 'villes_patrimoine' ? '🏛️ Villes & Patrimoine' :
                        listing.vacation_destination === 'campagne' ? '🌾 Campagne' :
                        listing.vacation_destination
                      }</span>
                    </div>
                  )}
                  {listing.capacity && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Capacité</span>
                      <span className={styles.detailValue}>{listing.capacity} personne{listing.capacity > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {listing.bedrooms !== null && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Chambres</span>
                      <span className={styles.detailValue}>{listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} chambre${listing.bedrooms > 1 ? 's' : ''}`}</span>
                    </div>
                  )}
                  {listing.beds && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Nombre de lits</span>
                      <span className={styles.detailValue}>{listing.beds} lit{listing.beds > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {listing.bathrooms && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Salles de bain</span>
                      <span className={styles.detailValue}>{listing.bathrooms}</span>
                    </div>
                  )}
                  {listing.surface && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Surface</span>
                      <span className={styles.detailValue}>{listing.surface} m²</span>
                    </div>
                  )}
                  {listing.floor && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Étage</span>
                      <span className={styles.detailValue}>{
                        listing.floor === 'rdc' ? 'Rez-de-chaussée' :
                        listing.floor === '1er' ? '1er étage' :
                        listing.floor === '2eme' ? '2ème étage' :
                        listing.floor === '3eme' ? '3ème étage' :
                        listing.floor === '4_et_plus' ? '4ème étage et +' :
                        listing.floor
                      }</span>
                    </div>
                  )}
                  {listing.property_condition && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>État du bien</span>
                      <span className={styles.detailValue}>{
                        listing.property_condition === 'neuf' ? 'Neuf' :
                        listing.property_condition === 'bon_etat' ? 'Bon état' :
                        listing.property_condition === 'a_renover' ? 'À rénover' :
                        listing.property_condition
                      }</span>
                    </div>
                  )}
                  {listing.rental_type && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Type de location</span>
                      <span className={styles.detailValue}>{
                        listing.rental_type === 'longue_duree' ? 'Longue durée' :
                        listing.rental_type === 'courte_duree' ? 'Courte durée' :
                        listing.rental_type === 'saisonniere' ? 'Saisonnière' :
                        listing.rental_type
                      }</span>
                    </div>
                  )}
                  {listing.furnished && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Ameublement</span>
                      <span className={styles.detailValue}>{
                        listing.furnished === 'meuble' ? 'Meublé' :
                        listing.furnished === 'semi_meuble' ? 'Semi-meublé' :
                        listing.furnished === 'non_meuble' ? 'Non meublé' :
                        listing.furnished
                      }</span>
                    </div>
                  )}
                  {listing.charges_included !== null && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Charges</span>
                      <span className={styles.detailValue}>
                        {listing.charges_included ? 'Incluses' :
                         listing.charges_amount ? `${listing.charges_amount} DA/mois` : 'Non incluses'}
                      </span>
                    </div>
                  )}
                  {listing.deposit_required !== null && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Caution</span>
                      <span className={styles.detailValue}>
                        {listing.deposit_required ?
                         (listing.deposit_amount ? `${listing.deposit_amount.toLocaleString()} DA` : 'Requise') :
                         'Non requise'}
                      </span>
                    </div>
                  )}
                  {listing.available_from && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Disponible à partir du</span>
                      <span className={styles.detailValue}>
                        {new Date(listing.available_from).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  )}
                  {listing.minimum_rental_duration && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Durée minimum</span>
                      <span className={styles.detailValue}>{
                        listing.minimum_rental_duration === '1_mois' ? '1 mois' :
                        listing.minimum_rental_duration === '3_mois' ? '3 mois' :
                        listing.minimum_rental_duration === '6_mois' ? '6 mois' :
                        listing.minimum_rental_duration === '1_an' ? '1 an' :
                        listing.minimum_rental_duration === '2_ans' ? '2 ans' :
                        listing.minimum_rental_duration
                      }</span>
                    </div>
                  )}
                </div>

                {listing.amenities && listing.amenities.length > 0 && (
                  <div className={styles.amenitiesSection}>
                    <h4 className={styles.subsectionTitle}>Équipements</h4>
                    <div className={styles.amenitiesList}>
                      {listing.amenities.map(amenity => (
                        <div key={amenity} className={styles.amenityBadge}>
                          {amenity === 'climatisation' ? '❄️ Climatisation' :
                           amenity === 'chauffage_central' ? '🔥 Chauffage central' :
                           amenity === 'garage_parking' ? '🚗 Garage/Parking' :
                           amenity === 'jardin' ? '🌳 Jardin' :
                           amenity === 'ascenseur' ? '🛗 Ascenseur' :
                           amenity === 'piscine' ? '🏊 Piscine' :
                           amenity === 'balcon' ? '🪴 Balcon' :
                           amenity === 'cave' ? '📦 Cave' :
                           amenity === 'interphone' ? '📞 Interphone' :
                           amenity === 'gardiennage_securite' ? '👮 Sécurité' :
                           amenity === 'cuisine_equipee' ? '🍳 Cuisine équipée' :
                           amenity === 'internet_wifi' ? '📶 WiFi' :
                           amenity}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {listing.vacation_amenities && listing.vacation_amenities.length > 0 && (
                  <div className={styles.amenitiesSection}>
                    <h4 className={styles.subsectionTitle}>Équipements & Commodités</h4>
                    <div className={styles.amenitiesList}>
                      {listing.vacation_amenities.map(amenity => (
                        <div key={amenity} className={styles.amenityBadge}>
                          {amenity === 'wifi' ? '📶 WiFi' :
                           amenity === 'climatisation' ? '❄️ Climatisation' :
                           amenity === 'chauffage' ? '🔥 Chauffage' :
                           amenity === 'parking' ? '🅿️ Parking' :
                           amenity === 'piscine' ? '🏊 Piscine' :
                           amenity === 'jardin' ? '🌳 Jardin' :
                           amenity === 'terrasse' ? '🪴 Terrasse/Balcon' :
                           amenity === 'vue_mer' ? '🌊 Vue sur mer' :
                           amenity === 'vue_montagne' ? '⛰️ Vue montagne' :
                           amenity === 'cuisine_equipee' ? '🍳 Cuisine équipée' :
                           amenity === 'machine_laver' ? '🧺 Machine à laver' :
                           amenity === 'television' ? '📺 Télévision' :
                           amenity === 'barbecue' ? '🔥 Barbecue' :
                           amenity === 'plage_privee' ? '🏖️ Accès plage privée' :
                           amenity === 'securite' ? '🔒 Sécurité 24h/24' :
                           amenity === 'menage' ? '🧹 Ménage inclus' :
                           amenity}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(listing.daily_rate || listing.weekly_rate || listing.monthly_rate) && (
                  <div className={styles.rentalRatesSection}>
                    <h4 className={styles.subsectionTitle}>💰 Tarifs de location</h4>
                    <div className={styles.detailsGrid}>
                      {listing.daily_rate && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Tarif journalier</span>
                          <span className={styles.detailValue}>{listing.daily_rate.toLocaleString()} DA/jour</span>
                        </div>
                      )}
                      {listing.weekly_rate && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Tarif hebdomadaire</span>
                          <span className={styles.detailValue}>{listing.weekly_rate.toLocaleString()} DA/semaine</span>
                        </div>
                      )}
                      {listing.monthly_rate && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Tarif mensuel</span>
                          <span className={styles.detailValue}>{listing.monthly_rate.toLocaleString()} DA/mois</span>
                        </div>
                      )}
                      {listing.deposit_equipment && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Caution</span>
                          <span className={styles.detailValue}>{listing.deposit_equipment.toLocaleString()} DA</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {(listing.availability_start || listing.availability_end) && (
                  <div className={styles.availabilitySection}>
                    <h4 className={styles.subsectionTitle}>📅 Période de disponibilité</h4>
                    <div className={styles.detailsGrid}>
                      {listing.availability_start && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Début</span>
                          <span className={styles.detailValue}>
                            {new Date(listing.availability_start).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      )}
                      {listing.availability_end && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Fin</span>
                          <span className={styles.detailValue}>
                            {new Date(listing.availability_end).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      )}
                      {listing.available_all_year && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailValue}>✅ Disponible toute l'année</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {listing.distance_to_beach && (
                  <div className={styles.distanceInfo}>
                    <h4 className={styles.subsectionTitle}>📍 Distance</h4>
                    <p>{listing.distance_to_beach}</p>
                  </div>
                )}

                {listing.visit_hours && (
                  <div className={styles.visitHours}>
                    <h4 className={styles.subsectionTitle}>Horaires de visite</h4>
                    <p>{listing.visit_hours}</p>
                  </div>
                )}
              </div>
            )}

            {/* Employment Details */}
            {(listing.job_sector || listing.contract_type || listing.experience_level) && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>💼 Détails de l'emploi</h3>
                <div className={styles.detailsGrid}>
                  {listing.job_sector && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Secteur d'activité</span>
                      <span className={styles.detailValue}>{
                        listing.job_sector === 'informatique' ? 'Informatique/Tech' :
                        listing.job_sector === 'commerce' ? 'Commerce/Vente' :
                        listing.job_sector === 'ingenierie' ? 'Ingénierie' :
                        listing.job_sector === 'sante' ? 'Santé' :
                        listing.job_sector === 'education' ? 'Éducation' :
                        listing.job_sector === 'finance' ? 'Finance/Comptabilité' :
                        listing.job_sector === 'hotellerie' ? 'Hôtellerie/Restauration' :
                        listing.job_sector === 'btp' ? 'BTP/Construction' :
                        listing.job_sector === 'marketing' ? 'Marketing/Communication' :
                        listing.job_sector === 'rh' ? 'Ressources Humaines' :
                        listing.job_sector === 'juridique' ? 'Juridique' :
                        listing.job_sector === 'transport' ? 'Transport/Logistique' :
                        listing.job_sector === 'agriculture' ? 'Agriculture' :
                        listing.job_sector
                      }</span>
                    </div>
                  )}
                  {listing.contract_type && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Type de contrat</span>
                      <span className={styles.detailValue}>{
                        listing.contract_type === 'cdi' ? 'CDI' :
                        listing.contract_type === 'cdd' ? 'CDD' :
                        listing.contract_type === 'freelance' ? 'Freelance' :
                        listing.contract_type === 'stage' ? 'Stage' :
                        listing.contract_type === 'interim' ? 'Intérim/Temporaire' :
                        listing.contract_type === 'saisonnier' ? 'Saisonnier' :
                        listing.contract_type
                      }</span>
                    </div>
                  )}
                  {listing.experience_level && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Niveau d'expérience</span>
                      <span className={styles.detailValue}>{
                        listing.experience_level === 'debutant' ? 'Débutant (0-2 ans)' :
                        listing.experience_level === 'intermediaire' ? 'Intermédiaire (2-5 ans)' :
                        listing.experience_level === 'confirme' ? 'Confirmé (5-10 ans)' :
                        listing.experience_level === 'expert' ? 'Expert (10+ ans)' :
                        listing.experience_level
                      }</span>
                    </div>
                  )}
                  {listing.education_level && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Niveau d'études</span>
                      <span className={styles.detailValue}>{
                        listing.education_level === 'sans_diplome' ? 'Sans diplôme' :
                        listing.education_level === 'bac' ? 'Bac' :
                        listing.education_level === 'bac_2_3' ? 'Bac+2/3' :
                        listing.education_level === 'bac_4_5' ? 'Bac+4/5' :
                        listing.education_level === 'doctorat' ? 'Doctorat' :
                        listing.education_level
                      }</span>
                    </div>
                  )}
                  {listing.work_schedule && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Temps de travail</span>
                      <span className={styles.detailValue}>{
                        listing.work_schedule === 'temps_plein' ? 'Temps plein' :
                        listing.work_schedule === 'temps_partiel' ? 'Temps partiel' :
                        listing.work_schedule === 'flexible' ? 'Flexible' :
                        listing.work_schedule
                      }</span>
                    </div>
                  )}
                  {listing.remote_work && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Télétravail</span>
                      <span className={styles.detailValue}>{
                        listing.remote_work === '100_teletravail' ? '100% télétravail' :
                        listing.remote_work === 'hybride' ? 'Hybride (partiel)' :
                        listing.remote_work === 'sur_site' ? 'Sur site uniquement' :
                        listing.remote_work
                      }</span>
                    </div>
                  )}
                  {listing.salary_type && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Salaire</span>
                      <span className={styles.detailValue}>
                        {listing.salary_type === 'fixed' && listing.price ? `${parseFloat(listing.price).toLocaleString()} DA/mois` :
                         listing.salary_type === 'range' && listing.price && listing.salary_max ?
                           `${parseFloat(listing.price).toLocaleString()} - ${parseFloat(listing.salary_max).toLocaleString()} DA/mois` :
                         listing.salary_type === 'negotiable' ? 'À négocier' :
                         'Non spécifié'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Services Details */}
            {(listing.service_type || listing.service_availability || listing.pricing_mode) && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>🔧 Détails du service</h3>
                <div className={styles.detailsGrid}>
                  {listing.service_type && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Type de service</span>
                      <span className={styles.detailValue}>{
                        listing.service_type === 'plomberie' ? 'Plomberie' :
                        listing.service_type === 'electricite' ? 'Électricité' :
                        listing.service_type === 'climatisation' ? 'Climatisation' :
                        listing.service_type === 'menuiserie' ? 'Menuiserie' :
                        listing.service_type === 'peinture' ? 'Peinture' :
                        listing.service_type === 'jardinage' ? 'Jardinage' :
                        listing.service_type === 'nettoyage' ? 'Nettoyage' :
                        listing.service_type === 'demenagement' ? 'Déménagement' :
                        listing.service_type === 'reparation_electronique' ? 'Réparation électronique' :
                        listing.service_type === 'cours_particuliers' ? 'Cours particuliers' :
                        listing.service_type === 'informatique' ? 'Informatique/Développement web' :
                        listing.service_type === 'photographie' ? 'Photographie/Vidéo' :
                        listing.service_type === 'design_graphique' ? 'Design graphique' :
                        listing.service_type === 'traduction' ? 'Traduction' :
                        listing.service_type === 'comptabilite' ? 'Comptabilité' :
                        listing.service_type === 'juridique' ? 'Juridique' :
                        listing.service_type
                      }</span>
                    </div>
                  )}
                  {listing.service_availability && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Disponibilité</span>
                      <span className={styles.detailValue}>{
                        listing.service_availability === 'immediate' ? 'Immédiate' :
                        listing.service_availability === 'sous_24h' ? 'Sous 24h' :
                        listing.service_availability === 'sous_48h' ? 'Sous 48h' :
                        listing.service_availability === 'a_planifier' ? 'À planifier' :
                        listing.service_availability
                      }</span>
                    </div>
                  )}
                  {listing.service_location && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Déplacement</span>
                      <span className={styles.detailValue}>{
                        listing.service_location === 'domicile' ? 'À domicile uniquement' :
                        listing.service_location === 'local' ? 'Dans mon local uniquement' :
                        listing.service_location === 'les_deux' ? 'Les deux' :
                        listing.service_location
                      }</span>
                    </div>
                  )}
                  {listing.service_experience_years && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Expérience</span>
                      <span className={styles.detailValue}>{
                        listing.service_experience_years === 'debutant' ? 'Débutant (<1 an)' :
                        listing.service_experience_years === 'intermediaire' ? 'Intermédiaire (1-5 ans)' :
                        listing.service_experience_years === 'expert' ? 'Expert (5+ ans)' :
                        listing.service_experience_years
                      }</span>
                    </div>
                  )}
                  {listing.pricing_mode && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Tarification</span>
                      <span className={styles.detailValue}>
                        {listing.pricing_mode === 'heure' ? `${listing.price ? parseFloat(listing.price).toLocaleString() + ' DA' : ''} / Heure` :
                         listing.pricing_mode === 'journee' ? `${listing.price ? parseFloat(listing.price).toLocaleString() + ' DA' : ''} / Journée` :
                         listing.pricing_mode === 'forfait' ? `${listing.price ? parseFloat(listing.price).toLocaleString() + ' DA' : ''} (Forfait)` :
                         listing.pricing_mode === 'devis' ? 'Sur devis' :
                         listing.pricing_mode}
                      </span>
                    </div>
                  )}
                  {listing.pricing_negotiable !== null && listing.pricing_negotiable && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Négociable</span>
                      <span className={styles.detailValue}>✅ Tarif négociable</span>
                    </div>
                  )}
                  {listing.free_quote !== null && listing.free_quote && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Devis</span>
                      <span className={styles.detailValue}>✅ Devis gratuit</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Books & Media Details */}
            {(listing.book_genre || listing.comic_series_title || listing.media_type || listing.music_format) && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>📚 Détails Livres & Multimédia</h3>
                <div className={styles.detailsGrid}>
                  {listing.book_genre && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Genre</span>
                      <span className={styles.detailValue}>{
                        listing.book_genre === 'roman' ? 'Roman' :
                        listing.book_genre === 'sf_fantasy' ? 'Science-fiction/Fantasy' :
                        listing.book_genre === 'policier_thriller' ? 'Policier/Thriller' :
                        listing.book_genre === 'romance' ? 'Romance' :
                        listing.book_genre === 'jeunesse' ? 'Jeunesse' :
                        listing.book_genre === 'classique' ? 'Littérature classique' :
                        listing.book_genre === 'biographie' ? 'Biographie' :
                        listing.book_genre === 'histoire' ? 'Histoire' :
                        listing.book_genre === 'sciences' ? 'Sciences' :
                        listing.book_genre === 'religion' ? 'Religion/Spiritualité' :
                        listing.book_genre === 'developpement_personnel' ? 'Développement personnel' :
                        listing.book_genre === 'cuisine' ? 'Cuisine' :
                        listing.book_genre === 'art' ? 'Art' :
                        listing.book_genre === 'scolaire' ? 'Scolaire/Universitaire' :
                        listing.book_genre === 'dictionnaire' ? 'Dictionnaire/Encyclopédie' :
                        listing.book_genre
                      }</span>
                    </div>
                  )}
                  {(listing.book_language || listing.comic_language) && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Langue</span>
                      <span className={styles.detailValue}>{
                        (listing.book_language === 'francais' || listing.comic_language === 'francais') ? 'Français' :
                        (listing.book_language === 'arabe' || listing.comic_language === 'arabe') ? 'Arabe' :
                        (listing.book_language === 'anglais' || listing.comic_language === 'anglais') ? 'Anglais' :
                        listing.comic_language === 'japonais' ? 'Japonais' :
                        listing.book_language || listing.comic_language
                      }</span>
                    </div>
                  )}
                  {listing.book_author && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Auteur</span>
                      <span className={styles.detailValue}>{listing.book_author}</span>
                    </div>
                  )}
                  {(listing.book_publisher || listing.comic_publisher) && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Éditeur</span>
                      <span className={styles.detailValue}>{listing.book_publisher || listing.comic_publisher}</span>
                    </div>
                  )}
                  {listing.book_isbn && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>ISBN</span>
                      <span className={styles.detailValue}>{listing.book_isbn}</span>
                    </div>
                  )}
                  {listing.book_publication_year && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Année d'édition</span>
                      <span className={styles.detailValue}>{listing.book_publication_year}</span>
                    </div>
                  )}
                  {listing.book_pages && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Nombre de pages</span>
                      <span className={styles.detailValue}>{listing.book_pages} pages</span>
                    </div>
                  )}
                  {listing.book_format && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Format</span>
                      <span className={styles.detailValue}>{
                        listing.book_format === 'broche_poche' ? 'Broché/Poche' :
                        listing.book_format === 'relie' ? 'Relié/Couverture rigide' :
                        listing.book_format === 'grand_format' ? 'Grand format' :
                        listing.book_format
                      }</span>
                    </div>
                  )}
                  {listing.comic_series_title && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Série</span>
                      <span className={styles.detailValue}>{listing.comic_series_title}</span>
                    </div>
                  )}
                  {listing.comic_issue_number && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Tome</span>
                      <span className={styles.detailValue}>Tome {listing.comic_issue_number}</span>
                    </div>
                  )}
                  {listing.media_type && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Type</span>
                      <span className={styles.detailValue}>{
                        listing.media_type === 'film' ? 'Film' :
                        listing.media_type === 'serie_tv' ? 'Série TV' :
                        listing.media_type === 'documentaire' ? 'Documentaire' :
                        listing.media_type
                      }</span>
                    </div>
                  )}
                  {listing.media_audio_languages && listing.media_audio_languages.length > 0 && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Langues audio</span>
                      <span className={styles.detailValue}>
                        {listing.media_audio_languages.map(lang =>
                          lang === 'francais' ? 'Français' :
                          lang === 'arabe' ? 'Arabe' :
                          lang === 'anglais' ? 'Anglais' : lang
                        ).join(', ')}
                      </span>
                    </div>
                  )}
                  {listing.media_subtitles && listing.media_subtitles.length > 0 && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Sous-titres</span>
                      <span className={styles.detailValue}>
                        {listing.media_subtitles.map(lang =>
                          lang === 'francais' ? 'Français' :
                          lang === 'arabe' ? 'Arabe' :
                          lang === 'anglais' ? 'Anglais' : lang
                        ).join(', ')}
                      </span>
                    </div>
                  )}
                  {listing.media_zone && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Zone DVD/Blu-ray</span>
                      <span className={styles.detailValue}>{
                        listing.media_zone === 'zone_2' ? 'Zone 2 - Europe' :
                        listing.media_zone === 'multi_zone' ? 'Multi-zone' :
                        listing.media_zone
                      }</span>
                    </div>
                  )}
                  {listing.music_format && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Format</span>
                      <span className={styles.detailValue}>{
                        listing.music_format === 'cd' ? 'CD' :
                        listing.music_format === 'vinyle' ? 'Vinyle' :
                        listing.music_format === 'cassette' ? 'Cassette' :
                        listing.music_format
                      }</span>
                    </div>
                  )}
                  {listing.music_genre && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Genre musical</span>
                      <span className={styles.detailValue}>{
                        listing.music_genre === 'rai' ? 'Raï' :
                        listing.music_genre === 'chaabi' ? 'Chaabi' :
                        listing.music_genre === 'pop' ? 'Pop' :
                        listing.music_genre === 'rock' ? 'Rock' :
                        listing.music_genre === 'rap' ? 'Rap' :
                        listing.music_genre === 'rnb' ? 'R&B' :
                        listing.music_genre === 'classique' ? 'Classique' :
                        listing.music_genre === 'jazz' ? 'Jazz' :
                        listing.music_genre === 'electro' ? 'Électro' :
                        listing.music_genre === 'reggae' ? 'Reggae' :
                        listing.music_genre
                      }</span>
                    </div>
                  )}
                  {listing.music_artist && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Artiste</span>
                      <span className={styles.detailValue}>{listing.music_artist}</span>
                    </div>
                  )}
                  {listing.music_album && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Album</span>
                      <span className={styles.detailValue}>{listing.music_album}</span>
                    </div>
                  )}
                  {listing.exchange_only && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Mode d'échange</span>
                      <span className={styles.detailValue}>🔄 Échange uniquement</span>
                    </div>
                  )}
                  {listing.exchange_for && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Recherche en échange</span>
                      <span className={styles.detailValue}>{listing.exchange_for}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className={styles.description}>
              <h3>Description</h3>
              <p>{listing.description}</p>
            </div>

            {listing.delivery_available && deliveryOptions.length > 0 && (
              <div className={styles.delivery}>
                <h3>Options de livraison</h3>
                {deliveryOptions.map((option, index) => (
                  <div key={index} className={styles.deliveryOption}>
                    <div className={styles.deliveryType}>
                      🚚 {deliveryTypeLabels[option.delivery_type]}
                    </div>
                    <div className={styles.deliveryDetails}>
                      <span>{option.price > 0 ? `${option.price} DA` : 'Gratuit'}</span>
                      {option.estimated_days > 0 && (
                        <span> • {option.estimated_days} jour{option.estimated_days > 1 ? 's' : ''}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.seller}>
              <h3>Vendeur</h3>
              <div className={styles.sellerInfo}>
                <div className={styles.sellerName}>
                  {listing.profiles.full_name}
                  {listing.profiles.is_professional && (
                    <span className={styles.proBadge}>PRO</span>
                  )}
                </div>
                <div className={styles.sellerLocation}>
                  📍 {listing.profiles.wilaya}
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              {user?.id !== listing.user_id && (
                <button onClick={handleContact} className="btn btn-primary" style={{ width: '100%' }}>
                  Contacter le vendeur
                </button>
              )}
            </div>

            {/* Floating action button for owner */}
            {user?.id === listing.user_id && (
              <button onClick={() => navigate('/my-listings')} className={styles.floatingActionButton}>
                <span className={styles.floatingIcon}>⚙️</span>
                <span className={styles.floatingText}>Gérer mes annonces</span>
              </button>
            )}
          </div>
        </div>

        {/* Similar Listings Section */}
        {similarListings.length > 0 && (
          <div className={styles.similarSection}>
            <h2 className={styles.similarTitle}>Annonces similaires</h2>
            <div className={styles.similarGrid}>
              {similarListings.map((item) => (
                <Link
                  key={item.id}
                  to={`/listing/${item.id}`}
                  className={styles.similarCard}
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <div className={styles.similarImage}>
                    {item.images && item.images.length > 0 ? (
                      <img src={item.images[0]} alt={item.title} />
                    ) : (
                      <div className={styles.similarNoImage}>
                        <span>📷</span>
                      </div>
                    )}

                    {/* Badge catégorie (top-left) */}
                    <span className={styles.categoryBadge}>
                      {getCategoryBadge(item.categories)}
                    </span>

                    {/* Badge localisation (bottom-left) */}
                    {item.communes && (
                      <span className={styles.locationBadge}>
                        {item.communes.name_fr}, {item.communes.wilaya_code}
                      </span>
                    )}
                  </div>
                  <div className={styles.similarContent}>
                    <h3 className={styles.similarCardTitle}>{item.title}</h3>
                    <div className={styles.similarPrice}>
                      {item.price?.toLocaleString('fr-DZ')} DA
                      {item.negotiable && (
                        <span className={styles.negotiableBadge}>Négociable</span>
                      )}
                    </div>
                    {item.communes && (
                      <div className={styles.similarLocation}>
                        📍 {item.communes.name_fr}, {item.communes.wilaya_code}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
