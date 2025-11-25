# 🔧 Correction: Filtres Dynamiques Non Affichés

## 🎯 Problème
Les filtres Marque et Modèle affichaient uniquement "Tous" au lieu des vraies options (Audi, BMW, etc.).

## 🔍 Cause
Les sous-catégories ("voitures", "motos") n'avaient pas de config dans `filterConfigs.js`, qui ne contenait que la config de la catégorie parente ("vehicules").

## ✅ Solution
Modification de `FilterSidebar.jsx` pour hériter automatiquement du config de la catégorie parente quand la sous-catégorie n'a pas de config propre.

### Code Ajouté
```javascript
// Si pas de config pour cette sous-catégorie, chercher le config du parent
if (!config && catData.parent_id) {
  const { data: parentData } = await supabase
    .from('categories')
    .select('slug')
    .eq('id', catData.parent_id)
    .maybeSingle();

  if (parentData && parentData.slug) {
    config = getFilterConfig(parentData.slug);
  }
}
```

## 📊 Résultat
- ✅ Marques chargées depuis vehicle_brands (30 marques)
- ✅ Modèles chargés dynamiquement selon la marque sélectionnée
- ✅ Héritage de config fonctionne pour toutes les sous-catégories
- ✅ Build réussi (715.83 KB)

**Date**: 2025-11-22
