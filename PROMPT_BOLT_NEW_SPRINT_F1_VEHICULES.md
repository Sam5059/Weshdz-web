# 🚀 PROMPT BOLT.NEW - SPRINT F1 : FORMULAIRE VÉHICULES

---

## 📋 INSTRUCTIONS POUR BOLT.NEW

**Copiez-collez ce prompt dans Bolt.new pour améliorer/créer le formulaire Véhicules**

---

# PROMPT À COPIER-COLLER

```
Je veux améliorer le formulaire de publication d'annonces pour la catégorie VÉHICULES dans mon application Wesh-DZ (marketplace algérienne en React + Supabase).

## CONTEXTE
- Application existante : React + Supabase
- Base de données déjà configurée avec tables : listings, vehicle_details, vehicle_brands, vehicle_models
- Formulaire à améliorer ou créer si inexistant

## STRUCTURE DU FORMULAIRE (8 ÉTAPES)

### ÉTAPE 1 : Type d'annonce
- Label : "Type d'annonce *"
- Type : Radio buttons
- Options :
  • "Offre" (Je vends un véhicule)
  • "Demande" (Je recherche un véhicule)
- Valeur par défaut : "Offre"
- Champ BDD : `listings.offer_type` ('offer' ou 'demand')

---

### ÉTAPE 2 : Informations générales

**2.1 - Titre de l'annonce**
- Label : "Titre de l'annonce *"
- Type : Input text
- Placeholder : "Ex: Golf 7 TDI 2018 - Excellent état"
- Validation : Min 10 caractères, Max 100 caractères
- Compteur de caractères affiché : "45/100"
- Champ BDD : `listings.title`

**2.2 - Description**
- Label : "Description *"
- Type : Textarea (multi-lignes)
- Placeholder : "Décrivez votre véhicule en détail : état général, historique, options, raison de la vente..."
- Validation : Min 50 caractères, Max 1000 caractères
- Compteur de caractères affiché : "150/1000"
- Champ BDD : `listings.description`

---

### ÉTAPE 3 : Détails du véhicule

**3.1 - Type de véhicule**
- Label : "Type de véhicule *"
- Type : Dropdown (Select)
- Options :
  • Voiture
  • Moto
  • Camion
  • Utilitaire
  • Autre
- Champ BDD : `vehicle_details.vehicle_type` ('car', 'motorcycle', 'truck', 'van', 'other')

**3.2 - Marque**
- Label : "Marque *"
- Type : Dropdown (Select) alphabétique
- Options : Chargées depuis table `vehicle_brands`
  Exemples : Audi, BMW, Chevrolet, Citroën, Dacia, Fiat, Ford, Honda, Hyundai, Kia, Mazda, Mercedes-Benz, Nissan, Peugeot, Renault, Seat, Skoda, Toyota, Volkswagen, Volvo, Autre
- Champ BDD : `vehicle_details.brand_id` (UUID)

**3.3 - Modèle**
- Label : "Modèle *"
- Type : Dropdown (Select) DYNAMIQUE
- Comportement :
  • Désactivé tant qu'aucune marque n'est sélectionnée
  • Une fois marque sélectionnée → Charge les modèles depuis table `vehicle_models` WHERE brand_id = {marque_sélectionnée}
  • Exemple : Si "Renault" → Afficher Clio, Mégane, Captur, Kadjar, etc.
  • Si "Volkswagen" → Afficher Golf, Polo, Passat, Tiguan, etc.
- Champ BDD : `vehicle_details.model_id` (UUID)
- Note : Si marque change → Reset la valeur du modèle

**3.4 - Année**
- Label : "Année *"
- Type : Dropdown (Select) ou Input number
- Options : De 1950 à (année actuelle + 1)
- Validation : Année >= 1950 ET Année <= 2026
- Champ BDD : `vehicle_details.year`

**3.5 - Kilométrage**
- Label : "Kilométrage *"
- Type : Input number
- Placeholder : "Ex: 85000"
- Suffixe affiché : "km"
- Validation :
  • >= 0
  • <= 999999
- Format : Séparateur de milliers (85 000 km)
- Champ BDD : `vehicle_details.mileage`

**3.6 - Carburant**
- Label : "Carburant *"
- Type : Dropdown (Select)
- Options :
  • Essence
  • Diesel
  • Hybride
  • Électrique
  • GPL
- Champ BDD : `vehicle_details.fuel_type` ('gasoline', 'diesel', 'hybrid', 'electric', 'gpl')

**3.7 - Boîte de vitesse**
- Label : "Boîte de vitesse *"
- Type : Radio buttons (horizontal)
- Options :
  • Manuelle
  • Automatique
- Champ BDD : `vehicle_details.transmission` ('manual', 'automatic')

**3.8 - État**
- Label : "État du véhicule *"
- Type : Dropdown (Select)
- Options :
  • Neuf (jamais roulé)
  • Occasion - Excellent état
  • Occasion - Bon état
  • À réparer
- Champ BDD : `listings.condition` ('new', 'like_new', 'good', 'for_parts')

**3.9 - Couleur**
- Label : "Couleur"
- Type : Dropdown (Select)
- Options :
  • Blanc
  • Noir
  • Gris
  • Bleu
  • Rouge
  • Vert
  • Jaune
  • Orange
  • Argent
  • Autre
- Optionnel
- Champ BDD : `vehicle_details.color`

---

### ÉTAPE 4 : Caractéristiques additionnelles (Optionnelles)

**4.1 - Nombre de portes**
- Label : "Nombre de portes"
- Type : Dropdown (Select)
- Options : 2, 3, 4, 5
- Optionnel
- Champ BDD : `vehicle_details.doors`

**4.2 - Cylindrée**
- Label : "Cylindrée"
- Type : Input text
- Placeholder : "Ex: 1600cc"
- Optionnel
- Champ BDD : `vehicle_details.engine_capacity`

**4.3 - Puissance fiscale**
- Label : "Puissance fiscale"
- Type : Input number
- Placeholder : "Ex: 7"
- Suffixe : "CV"
- Optionnel
- Champ BDD : `vehicle_details.horsepower`

**4.4 - Nombre de places**
- Label : "Nombre de places"
- Type : Dropdown (Select)
- Options : 2, 4, 5, 7, 9+
- Optionnel
- Champ BDD : `vehicle_details.seats`

---

### ÉTAPE 5 : Équipements (Optionnels)

- Label : "Équipements et options"
- Type : Checkboxes (multi-sélection)
- Options :
  ☐ Climatisation
  ☐ ABS
  ☐ Airbags
  ☐ GPS / Navigation
  ☐ Caméra de recul
  ☐ Toit ouvrant
  ☐ Régulateur de vitesse
  ☐ Jantes alliage
  ☐ Sièges en cuir
  ☐ Radar de recul
  ☐ Système audio premium
  ☐ Phares LED
- Affichage : Grille 2 colonnes sur desktop, 1 colonne sur mobile
- Champ BDD : `vehicle_details.features` (array de strings)

---

### ÉTAPE 6 : Prix et localisation

**6.1 - Prix**
- Label : "Prix *"
- Type : Input number
- Placeholder : "Ex: 1200000"
- Validation : >= 50000 DA
- Format : Séparateur de milliers (1 200 000 DA)
- Suffixe affiché : "DA"
- Champ BDD : `listings.price`

**6.2 - Prix négociable**
- Label : "Prix négociable"
- Type : Checkbox
- Texte : "Le prix est négociable"
- Valeur par défaut : false
- Champ BDD : `listings.price_negotiable`

**6.3 - Wilaya**
- Label : "Wilaya *"
- Type : Dropdown (Select) avec recherche
- Options : Charger les 58 wilayas depuis table `wilayas`
  Exemples :
  • 01 - Adrar
  • 02 - Chlef
  • ...
  • 16 - Alger
  • ...
  • 58 - El M'Ghair
- Champ BDD : `listings.wilaya`

**6.4 - Commune**
- Label : "Commune"
- Type : Input text
- Placeholder : "Ex: Hydra, Kouba, Bab Ezzouar..."
- Optionnel
- Champ BDD : `listings.commune`

---

### ÉTAPE 7 : Photos

**7.1 - Upload photos**
- Label : "Photos du véhicule *"
- Type : Upload multiple (drag & drop)
- Validation :
  • Minimum : 1 photo
  • Maximum : 8 photos
  • Formats acceptés : JPG, PNG, WEBP
  • Taille max par photo : 5 MB
  • Résolution min : 800x600px
- Interface :
  • Zone de drag & drop centrale
  • Bouton "Parcourir" alternatif
  • Miniatures des photos uploadées (150x150px)
  • Possibilité de réorganiser les photos (drag & drop)
  • Bouton "X" sur chaque miniature pour supprimer
  • Indicateur : "3/8 photos"
- Message d'aide : "La première photo sera la photo principale de l'annonce"
- Champ BDD : `listings.images` (array de URLs Supabase Storage)

---

### ÉTAPE 8 : Contact

**8.1 - Nom**
- Label : "Nom *"
- Type : Input text
- Placeholder : "Votre nom ou nom de l'entreprise"
- Champ BDD : `listings.contact_name`

**8.2 - Téléphone**
- Label : "Téléphone *"
- Type : Input tel
- Placeholder : "Ex: 0555123456"
- Validation : Format algérien (05XX XX XX XX ou 06XX XX XX XX ou 07XX XX XX XX)
- Message d'aide : "Votre numéro sera affiché publiquement"
- Champ BDD : `listings.contact_phone`

**8.3 - Email**
- Label : "Email"
- Type : Input email
- Placeholder : "votre.email@exemple.com"
- Optionnel
- Validation : Format email valide si renseigné
- Champ BDD : `listings.contact_email`

**8.4 - WhatsApp disponible**
- Label : "WhatsApp"
- Type : Checkbox
- Texte : "Je suis joignable sur WhatsApp"
- Valeur par défaut : false
- Champ BDD : `listings.whatsapp_available`

---

## FONCTIONNALITÉS REQUISES

### 1. Sauvegarde automatique (Brouillon)
- Auto-save toutes les 30 secondes
- Stocker dans localStorage : `wesh_dz_vehicle_draft`
- Structure JSON :
  ```json
  {
    "step": 3,
    "data": {
      "offer_type": "offer",
      "title": "...",
      "description": "...",
      ...
    },
    "timestamp": "2025-01-15T10:30:00Z"
  }
  ```
- Message toast : "✅ Brouillon enregistré automatiquement"
- Au chargement du formulaire : Détecter brouillon et proposer "Reprendre votre annonce ?"

### 2. Indicateur de progression
- Affichage en haut du formulaire : "Étape 3/8"
- Barre de progression visuelle : ████████░░░░░░░░ 50%

### 3. Navigation
- Boutons en bas de chaque étape :
  • "← Précédent" (sauf étape 1)
  • "Suivant →" (étapes 1-7)
  • "Sauvegarder le brouillon" (toutes étapes)
  • "Prévisualiser" (étape 8)
  • "Publier l'annonce" (étape 8)
- Navigation entre étapes avec transitions fluides (300ms)

### 4. Validation en temps réel
- Afficher les erreurs sous les champs APRÈS que l'utilisateur ait interagi
- Messages d'erreur clairs :
  • "Le titre doit contenir au moins 10 caractères"
  • "La description doit contenir au moins 50 caractères"
  • "Veuillez sélectionner une marque"
  • "L'année doit être comprise entre 1950 et 2026"
  • "Le kilométrage ne peut pas dépasser 999 999 km"
  • "Le prix minimum est de 50 000 DA"
  • "Veuillez ajouter au moins 1 photo"
  • "Le numéro de téléphone est invalide"
- Icônes : ✅ (valide) / ⚠️ (invalide)
- Désactiver le bouton "Suivant" si étape invalide

### 5. Prévisualisation
- Fenêtre modale ou page séparée
- Afficher l'annonce EXACTEMENT comme elle apparaîtra aux utilisateurs :
  • Titre en gros
  • Prix en évidence
  • Photos en carousel
  • Description
  • Tous les détails (Marque, Modèle, Année, Kilométrage, etc.)
  • Localisation
  • Contact
- Boutons : "← Modifier" / "Publier l'annonce"

### 6. Confirmation de publication
- Dialogue de confirmation :
  "Êtes-vous sûr de vouloir publier cette annonce ?
  Votre annonce sera visible publiquement dans quelques instants."
  [Annuler] [Confirmer et publier]
- Après publication :
  • Redirection vers page "Mes annonces"
  • Message toast : "🎉 Votre annonce a été publiée avec succès !"
  • Suppression du brouillon localStorage

### 7. Gestion des erreurs
- Si erreur serveur lors de la publication :
  • Message toast : "❌ Erreur lors de la publication. Veuillez réessayer."
  • Garder les données du formulaire
  • Proposer de sauvegarder en brouillon
- Si upload photo échoue :
  • Message sous la photo : "❌ Erreur d'upload. Taille trop importante ou format non supporté."
  • Permettre de réessayer

---

## STYLE ET UX

### Design
- Style moderne, épuré, professionnel
- Couleurs : Palette cohérente avec l'application (bleu/vert pour primaire, rouge pour erreurs, vert pour succès)
- Espacement : Aéré, lisible
- Mobile-first : Responsive sur tous écrans

### Transitions
- Changement d'étape : Slide horizontal (300ms)
- Validation : Fade in des messages d'erreur (200ms)
- Upload photos : Apparition progressive des miniatures

### Feedback visuel
- Loading states : Spinners lors des chargements (marques/modèles, upload photos, publication)
- Skeleton loaders si nécessaire
- Animations subtiles (pas d'excès)

---

## INTÉGRATION SUPABASE

### Upload des photos
```javascript
// Exemple de code
const uploadPhotos = async (files) => {
  const urls = [];
  for (const file of files) {
    const fileName = `${userId}/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('listings-photos')
      .upload(fileName, file);

    if (data) {
      const { publicURL } = supabase.storage
        .from('listings-photos')
        .getPublicUrl(fileName);
      urls.push(publicURL);
    }
  }
  return urls;
};
```

### Insertion dans la BDD
```javascript
// 1. Insérer dans table listings
const { data: listing, error: listingError } = await supabase
  .from('listings')
  .insert({
    category_id: 'UUID_CATEGORIE_VEHICULES',
    user_id: user.id,
    offer_type: formData.offer_type,
    title: formData.title,
    description: formData.description,
    price: formData.price,
    price_negotiable: formData.price_negotiable,
    wilaya: formData.wilaya,
    commune: formData.commune,
    condition: formData.condition,
    images: photoUrls,
    contact_name: formData.contact_name,
    contact_phone: formData.contact_phone,
    contact_email: formData.contact_email,
    whatsapp_available: formData.whatsapp_available,
    status: 'published',
    published_at: new Date().toISOString()
  })
  .select()
  .single();

// 2. Insérer dans table vehicle_details
const { error: detailsError } = await supabase
  .from('vehicle_details')
  .insert({
    listing_id: listing.id,
    vehicle_type: formData.vehicle_type,
    brand_id: formData.brand_id,
    model_id: formData.model_id,
    year: formData.year,
    mileage: formData.mileage,
    fuel_type: formData.fuel_type,
    transmission: formData.transmission,
    color: formData.color,
    doors: formData.doors,
    engine_capacity: formData.engine_capacity,
    horsepower: formData.horsepower,
    seats: formData.seats,
    features: formData.features
  });
```

---

## CRITÈRES DE VALIDATION

✅ Le formulaire doit être complété en 8 étapes claires
✅ Tous les champs obligatoires (*) doivent être validés
✅ Le dropdown Marque/Modèle doit être dynamique et fonctionnel
✅ L'upload de 1 à 8 photos doit fonctionner
✅ Le brouillon auto-save doit fonctionner (toutes les 30 secondes)
✅ La prévisualisation doit afficher l'annonce fidèlement
✅ La publication doit insérer dans `listings` ET `vehicle_details`
✅ Les transitions doivent être fluides
✅ Le design doit être responsive (mobile + desktop)
✅ Les messages d'erreur doivent être clairs

---

## IMPORTANT

- NE PAS oublier l'auto-save du brouillon
- NE PAS oublier la validation en temps réel
- S'assurer que le dropdown Modèle se met à jour quand on change la Marque
- Tester l'upload de plusieurs photos
- Vérifier que les données sont bien insérées dans les 2 tables (listings + vehicle_details)

---

FIN DU PROMPT
```

---

## 📋 INSTRUCTIONS D'UTILISATION

### Étape 1 : Copier le prompt
- Copiez tout le texte entre les délimiteurs ``` ci-dessus
- Assurez-vous de copier depuis "Je veux améliorer..." jusqu'à "FIN DU PROMPT"

### Étape 2 : Ouvrir Bolt.new
- Allez sur https://bolt.new
- Connectez-vous si nécessaire

### Étape 3 : Coller le prompt
- Collez le prompt complet dans la zone de chat
- Appuyez sur Entrée

### Étape 4 : Suivre les instructions de Bolt
- Bolt va générer le code du formulaire
- Il va créer les composants nécessaires
- Il va intégrer avec Supabase

### Étape 5 : Tester
- Une fois le code généré, testez le formulaire complet
- Vérifiez chaque étape
- Testez le dropdown Marque → Modèle
- Testez l'upload de photos
- Testez la publication

### Étape 6 : Validation
Vérifiez que :
- ✅ Les 8 étapes fonctionnent
- ✅ La validation fonctionne
- ✅ L'auto-save fonctionne
- ✅ Les photos s'uploadent
- ✅ Les données s'insèrent correctement dans Supabase
- ✅ Le design est responsive

---

## 🎯 APRÈS LE SPRINT F1

Une fois le formulaire Véhicules terminé et validé, vous pourrez passer au **SPRINT F2 : Formulaire Location Immobilière** avec un prompt similaire adapté à cette catégorie.

Le formulaire Véhicules servira de **template de référence** pour les autres formulaires !

---

## ❓ QUESTIONS FRÉQUENTES

**Q : Et si Bolt.new ne génère pas tout correctement ?**
R : Vous pouvez lui demander des corrections spécifiques. Exemple : "Le dropdown Modèle ne se met pas à jour quand je change de Marque, peux-tu corriger ?"

**Q : Comment tester sans publier réellement ?**
R : Ajoutez une option "Mode test" dans le formulaire qui insère avec `status: 'draft'` au lieu de `status: 'published'`

**Q : Peut-on ajouter d'autres champs ?**
R : Oui ! Ajoutez-les dans le prompt en respectant la même structure.

---

Bon développement ! 🚀
