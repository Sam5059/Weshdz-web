# 🔧 Correction: Filtrage Sous-catégories (Topbar vs Sidebar)

## 🎯 Problème Rapporté

**Le topbar filtre correctement les sous-catégories, mais pas la sidebar.**

### Symptômes
```
Scénario:
1. Cliquer sur "Véhicules" dans le topbar
2. Cliquer sur "Voitures" (sous-catégorie) dans le topbar
   → ✅ Affiche uniquement les voitures

3. Ouvrir la sidebar
4. Cliquer sur "Véhicules" > "Voitures" dans la sidebar
   → ❌ Affiche TOUTES les annonces véhicules (voitures + motos + camions)
```

---

## 🔍 Diagnostic

### Problème #1: Logique OR Incorrecte (Home.jsx)

```javascript
// ❌ AVANT
if (filters.subcategory_id) {
  const { data: subCatData } = await supabase
    .from('categories')
    .select('id, parent_id')
    .eq('id', filters.subcategory_id)
    .maybeSingle();

  if (subCatData && subCatData.parent_id) {
    query = query.or(`category_id.eq.${filters.subcategory_id},category_id.eq.${subCatData.parent_id}`);
  }
}

// Résultat: WHERE (category_id = voitures OR category_id = vehicules)
// → Affiche TOUT
```

### Problème #2: CategoryConfig Non Chargé (FilterSidebar.jsx)

```javascript
// ❌ AVANT
useEffect(() => {
  if (selectedCategory) {  // ❌ Ignore filters.subcategory_id
    loadCategoryConfig(selectedCategory);
  }
}, [selectedCategory]);  // ❌ Ne dépend pas de filters.subcategory_id
```

---

## ✅ Solutions

### 1. Simplifier Logique de Filtrage

```javascript
// ✅ APRÈS
if (filters.subcategory_id) {
  // Filtrer UNIQUEMENT par la sous-catégorie
  query = query.eq('category_id', filters.subcategory_id);
}
```

### 2. Charger Config pour Sous-catégories

```javascript
// ✅ APRÈS
useEffect(() => {
  const categoryId = filters.subcategory_id || selectedCategory || filters.category_id;
  if (categoryId) {
    loadCategoryConfig(categoryId);
  }
}, [selectedCategory, filters.subcategory_id, filters.category_id]);
```

---

## 📦 Résultat

- ✅ Topbar et sidebar filtrent maintenant de manière identique
- ✅ Sous-catégories affichent UNIQUEMENT leurs annonces
- ✅ Filtres dynamiques chargés correctement pour sous-catégories
- ✅ Build réussi (715.68 KB)

---

**Date**: 2025-11-22
**Status**: 🟢 Filtrage sous-catégories cohérent
