# 🚀 WESH-DZ : GUIDE DE DÉMARRAGE RAPIDE

## 📁 DOCUMENTS DISPONIBLES

Vous avez maintenant **2 documents essentiels** pour démarrer le développement :

### 1️⃣ `STRUCTURE_BDD_COMPLETE_SUPABASE.md`
**Ce qu'il contient :**
- Structure complète de la base de données pour les 14 catégories
- Scripts SQL pour créer toutes les tables
- Relations entre tables
- Index pour performance
- Données de référence (58 wilayas, marques véhicules, etc.)

**Que faire avec :**
1. Ouvrez votre console Supabase
2. Vérifiez les tables existantes
3. Exécutez les scripts SQL des tables manquantes
4. Insérez les données de référence

**⏱️ Temps estimé : 30 minutes - 1 heure**

---

### 2️⃣ `PROMPT_BOLT_NEW_SPRINT_F1_VEHICULES.md`
**Ce qu'il contient :**
- Prompt complet et détaillé pour Bolt.new
- Spécifications du formulaire Véhicules (8 étapes)
- Tous les champs avec validation
- Fonctionnalités (auto-save, prévisualisation, etc.)
- Code d'intégration Supabase

**Que faire avec :**
1. Ouvrez le fichier
2. Copiez le prompt (entre les délimiteurs ```)
3. Collez dans Bolt.new
4. Laissez Bolt générer le code
5. Testez et validez

**⏱️ Temps estimé : 4-5 jours de développement**

---

## 🎯 ORDRE D'EXÉCUTION RECOMMANDÉ

### ✅ ÉTAPE 1 : Préparer la base de données (AUJOURD'HUI)
**Document :** `STRUCTURE_BDD_COMPLETE_SUPABASE.md`

**Actions :**
1. Ouvrez votre projet Supabase
2. Allez dans l'éditeur SQL
3. Vérifiez les tables existantes :
   ```sql
   SELECT table_name
   FROM information_schema.tables
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```
4. Identifiez les tables manquantes
5. Exécutez les scripts SQL pour les créer
6. Insérez les données de référence (catégories, wilayas, marques)

**Validation :**
- ✅ Table `categories` existe avec 14 catégories
- ✅ Table `listings` existe avec tous les champs
- ✅ Table `vehicle_details` existe
- ✅ Table `vehicle_brands` contient les marques
- ✅ Table `vehicle_models` contient les modèles par marque
- ✅ Table `wilayas` contient les 58 wilayas

---

### ✅ ÉTAPE 2 : Développer le formulaire Véhicules (SEMAINE 1)
**Document :** `PROMPT_BOLT_NEW_SPRINT_F1_VEHICULES.md`

**Actions :**
1. Ouvrez Bolt.new
2. Copiez-collez le prompt complet
3. Laissez Bolt générer le code
4. Intégrez le code dans votre projet existant
5. Testez chaque étape du formulaire
6. Validez la publication d'une annonce

**Validation :**
- ✅ Les 8 étapes fonctionnent
- ✅ Dropdown Marque → Modèle dynamique fonctionne
- ✅ Upload de 1-8 photos fonctionne
- ✅ Auto-save brouillon fonctionne
- ✅ Prévisualisation affiche l'annonce
- ✅ Publication insère dans `listings` + `vehicle_details`
- ✅ L'annonce publiée est visible dans l'app

---

### ✅ ÉTAPE 3 : Tester en conditions réelles (FIN SEMAINE 1)
**Actions :**
1. Créez 5-10 annonces de test variées :
   - Différentes marques
   - Différents types (voiture, moto, camion)
   - Différents prix
   - Différentes wilayas
2. Vérifiez que toutes les données sont correctement stockées
3. Testez la modification d'une annonce
4. Testez la suppression d'une annonce

**Validation :**
- ✅ Toutes les annonces de test sont visibles
- ✅ Les filtres fonctionnent (si déjà implémentés)
- ✅ Pas de bugs ou erreurs
- ✅ Performance acceptable (<2 secondes chargement)

---

## 🔄 APRÈS LE SPRINT F1

Une fois le formulaire Véhicules terminé et validé :

### Option A : Continuer avec les formulaires prioritaires
**Sprint F2 : Location Immobilière** (4-5 jours)
- Formulaire similaire adapté à l'immobilier
- Je vous fournirai le prompt adapté

**Sprint F3 : Emploi** (3-4 jours)
- Formulaire offres/demandes d'emploi
- Deux versions selon le type d'annonce

**Sprint F4 : Services** (3-4 jours)
- Formulaire services
- Tarification flexible

### Option B : Développer les filtres sidebar
**Sprint S1 : Sidebar Véhicules** (2 jours)
- Copier les champs du formulaire Véhicules
- Les transformer en filtres

---

## 📊 SUIVI DE PROGRESSION

### Semaine 1 : Fondations + Véhicules
- [ ] Jour 1 : Mise à jour BDD Supabase
- [ ] Jour 2 : Lancement Sprint F1 sur Bolt.new
- [ ] Jour 3-4 : Développement formulaire Véhicules
- [ ] Jour 5 : Tests et validation

### Semaine 2 : Location Immobilière
- [ ] Sprint F2 complet

### Semaine 3 : Emploi
- [ ] Sprint F3 complet

### Semaine 4 : Services
- [ ] Sprint F4 complet

---

## 🆘 AIDE ET SUPPORT

### Si Bolt.new ne fonctionne pas comme prévu :
1. **Problème : Le dropdown Modèle ne se met pas à jour**
   - Demandez à Bolt : "Le dropdown Modèle doit se recharger dynamiquement quand je change de Marque, peux-tu corriger ?"

2. **Problème : L'upload de photos ne fonctionne pas**
   - Vérifiez que le bucket `listings-photos` existe dans Supabase Storage
   - Vérifiez les permissions du bucket (public)

3. **Problème : Les données ne s'insèrent pas correctement**
   - Vérifiez que les UUID des tables de référence sont corrects
   - Vérifiez les logs d'erreur dans la console Supabase

### Si vous êtes bloqué :
- Relisez attentivement le prompt
- Vérifiez que votre BDD Supabase est bien configurée
- Testez d'abord les fonctionnalités une par une
- Ne passez pas à l'étape suivante tant que l'étape actuelle n'est pas validée

---

## 🎯 OBJECTIF FINAL

**MVP Équilibré (8 semaines) :**
- ✅ 4 catégories complètes : Véhicules, Location Immobilière, Emploi, Services
- ✅ Formulaires de publication fonctionnels
- ✅ Sidebar filtres synchronisés
- ✅ Barre de recherche intelligente
- ✅ Application complète et utilisable

**Après ces 8 semaines, vous aurez une marketplace fonctionnelle et crédible prête pour les premiers utilisateurs !**

---

## 📝 CHECKLIST AVANT DE COMMENCER

Avant de démarrer le Sprint F1, vérifiez que vous avez :

- [ ] Un projet Supabase actif et accessible
- [ ] Un accès à l'éditeur SQL de Supabase
- [ ] Un compte Bolt.new actif
- [ ] Votre application React existante (si déjà développée)
- [ ] Les 2 documents ouverts : `STRUCTURE_BDD_COMPLETE_SUPABASE.md` et `PROMPT_BOLT_NEW_SPRINT_F1_VEHICULES.md`
- [ ] 30 minutes à 1 heure devant vous pour configurer la BDD
- [ ] Une semaine pour développer le formulaire Véhicules

---

## 🚀 PRÊT À DÉMARRER ?

**Prochaine action immédiate :**

1. ✅ Ouvrez `STRUCTURE_BDD_COMPLETE_SUPABASE.md`
2. ✅ Mettez à jour votre base de données Supabase
3. ✅ Une fois fait, ouvrez `PROMPT_BOLT_NEW_SPRINT_F1_VEHICULES.md`
4. ✅ Copiez le prompt et lancez-vous dans Bolt.new !

**Bon développement ! 🎉**

---

## 📞 BESOIN D'AIDE ?

Si vous avez des questions ou rencontrez des problèmes, n'hésitez pas à revenir vers moi avec des détails précis sur :
- Le sprint en cours
- Le problème rencontré
- Ce que vous avez déjà essayé

Je suis là pour vous aider ! 💪
