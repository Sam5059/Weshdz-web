
// AUTO-GENERATED FILTER DEFINITIONS

export const filterDefinitions = {
  'location-immobiliere': [
    { type: 'number', name: 'surface', label_fr: 'Surface (m²)' },
    { type: 'number', name: 'rooms', label_fr: 'Pièces' },
    { type: 'number', name: 'bedrooms', label_fr: 'Chambres' },
    { type: 'number', name: 'bathrooms', label_fr: 'Salles de bain' },
    { type: 'range', name: 'price', label_fr: 'Prix' }
  ],

  'location-vacances': [
    { type: 'number', name: 'surface', label_fr: 'Surface (m²)' },
    { type: 'number', name: 'capacity', label_fr: 'Capacité' },
    { type: 'range', name: 'price', label_fr: 'Prix' }
  ],

  'vehicules': [
    { type: 'select', name: 'brand', label_fr: 'Marque' },
    { type: 'select', name: 'model', label_fr: 'Modèle' },
    { type: 'number', name: 'year', label_fr: 'Année' },
    { type: 'range', name: 'price', label_fr: 'Prix' }
  ]
};
