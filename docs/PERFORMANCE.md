# Guide d'Optimisation des Performances

Ce document décrit les optimisations appliquées aux assets du monorepo et fournit des guidelines pour maintenir de bonnes performances.

## Vue d'ensemble

Le monorepo ai-jaztools a été optimisé pour réduire la taille des assets et améliorer les temps de chargement, tout en maintenant la lisibilité du code et sans système de build.

## Métriques de Performance

### État Actuel (après optimisation)

**Total des assets**: ~51.52 KB

- **SVG**: 3.43 KB (6 favicons optimisés)
- **CSS**: 30.88 KB (versions minifiées disponibles: 24.50 KB, 20.7% de réduction)
- **JavaScript**: 14.16 KB (5 modules utils)
- **ICO**: 4.29 KB (1 favicon)

### Réductions Obtenues

#### SVG
- **Avant**: ~850B par fichier (avec commentaires et espaces)
- **Après**: 377B-619B par fichier
- **Réduction moyenne**: ~28-31% par fichier
- **Optimisations appliquées**:
  - Suppression des commentaires XML
  - Suppression des espaces inutiles
  - Optimisation des attributs (rx/ry → rx seul)
  - Compactage du formatage

#### CSS
- **Avant**: 30.88 KB (non minifié)
- **Après**: 24.50 KB (minifié)
- **Réduction**: 20.7%
- **Fichiers minifiés**:
  - `variables.css`: 2.40 KB → 1.60 KB (33.5% réduction)
  - `base.css`: 2.82 KB → 1.99 KB (29.4% réduction)
  - `components.css`: 11.53 KB → 8.64 KB (25.1% réduction)
  - `utilities.css`: 14.13 KB → 12.28 KB (13.1% réduction)

#### JavaScript
- **État**: Déjà optimisé (pas de code mort, imports propres)
- **Taille**: 14.16 KB total (5 fichiers utils)

## Optimisations Appliquées

### 1. Images et Favicons

#### SVG
- ✅ Tous les favicons SVG optimisés (6 fichiers)
- ✅ Suppression des commentaires et espaces inutiles
- ✅ Optimisation des attributs (valeurs numériques, font-family)

#### ICO
- ✅ Vérifié: 4.29 KB (taille raisonnable pour un favicon ICO)
- ℹ️ Note: Pour une optimisation supplémentaire, utiliser un outil externe (ImageOptim, Squoosh)

### 2. CSS Design System

#### Corrections
- ✅ **Directives `@apply` corrigées**: Remplacées par du CSS standard dans `components.css`
  - Les directives `@apply` ne fonctionnent pas sans préprocesseur CSS (Tailwind)
  - La classe `.button` a été convertie en CSS standard complet

#### Minification
- ✅ Versions minifiées créées (`.min.css`)
- ✅ Script de minification automatique: `scripts/minify-css.js`
- ✅ Réduction moyenne de 20.7%

#### Doublons
- ✅ Doublon `.hidden` supprimé de `utilities.css` (déjà défini dans `base.css`)
- ✅ Note: `.grid` existe dans `components.css` (avec gap) et `utilities.css` (utilitaire simple) - intentionnel

### 3. JavaScript Utils

- ✅ Code déjà optimisé (pas de code mort)
- ✅ Imports/exports propres (ES6 modules)
- ✅ Commentaires JSDoc conservés pour la documentation

### 4. Lazy Loading

- ✅ Attribut `loading="lazy"` ajouté aux images dans les pages HTML:
  - `tools/feed-minitools/index.html` (1 image)
  - `tools/feed-minitools/favorites-migrator/index.html` (4 images externes)

## Scripts d'Optimisation

### `scripts/minify-css.js`

Minifie les fichiers CSS du Design System.

**Usage**:
```bash
node scripts/minify-css.js
```

**Fonctionnalités**:
- Supprime les commentaires (sauf licences)
- Supprime les espaces inutiles
- Compacte le code
- Génère des versions `.min.css`
- Affiche un rapport de réduction

### `scripts/optimize-assets.js`

Script principal d'optimisation et de reporting.

**Usage**:
```bash
# Générer un rapport des assets
node scripts/optimize-assets.js --report

# Optimiser tous les SVG
node scripts/optimize-assets.js --optimize-svg
```

**Fonctionnalités**:
- Optimisation automatique des SVG
- Génération de rapports de taille
- Statistiques détaillées par type d'asset

## Guidelines pour les Futurs Assets

### Images

1. **SVG**:
   - Utiliser des SVG optimisés (pas de commentaires, espaces minimaux)
   - Utiliser le script `optimize-assets.js` pour optimiser automatiquement
   - Préférer SVG pour les icônes et logos (meilleure compression)

2. **Images raster** (PNG, JPG):
   - Utiliser WebP si possible (meilleure compression)
   - Optimiser avec ImageOptim, Squoosh, ou similaire
   - Utiliser `loading="lazy"` pour les images non critiques

3. **Favicons**:
   - SVG pour les navigateurs modernes
   - ICO pour la compatibilité (taille raisonnable: <5KB)

### CSS

1. **Minification**:
   - Utiliser les versions `.min.css` en production
   - Conserver les versions non-minifiées pour le développement
   - Exécuter `scripts/minify-css.js` après chaque modification

2. **Organisation**:
   - Éviter les doublons entre fichiers
   - Utiliser les variables CSS du Design System
   - Ne pas utiliser de directives de préprocesseur (`@apply`, etc.) sans build

3. **Sélecteurs**:
   - Préférer les sélecteurs simples
   - Éviter la sur-spécificité
   - Utiliser les classes utilitaires du Design System

### JavaScript

1. **Modules**:
   - Utiliser ES6 modules (`import`/`export`)
   - Éviter le code mort
   - Optimiser les imports (ne pas importer tout un module si une seule fonction est nécessaire)

2. **Lazy Loading**:
   - Charger les modules JavaScript à la demande si possible
   - Utiliser `type="module"` pour les modules ES6

### HTML

1. **Images**:
   - Toujours ajouter `loading="lazy"` aux images non critiques
   - Utiliser `alt` descriptif pour l'accessibilité
   - Préférer les formats modernes (WebP avec fallback)

2. **CSS**:
   - Charger les CSS critiques en premier
   - Utiliser les versions minifiées en production
   - Éviter les `@import` dans les CSS (préférer les `<link>` dans le HTML)

3. **JavaScript**:
   - Utiliser `defer` ou `type="module"` pour les scripts non critiques
   - Éviter les scripts bloquants dans le `<head>`

## Utilisation des Versions Minifiées

### En Production

Pour utiliser les versions minifiées du CSS, remplacer dans vos fichiers HTML:

```html
<!-- Avant -->
<link rel="stylesheet" href="../../shared/design-system/variables.css">
<link rel="stylesheet" href="../../shared/design-system/base.css">
<link rel="stylesheet" href="../../shared/design-system/components.css">
<link rel="stylesheet" href="../../shared/design-system/utilities.css">

<!-- Après (production) -->
<link rel="stylesheet" href="../../shared/design-system/variables.min.css">
<link rel="stylesheet" href="../../shared/design-system/base.min.css">
<link rel="stylesheet" href="../../shared/design-system/components.min.css">
<link rel="stylesheet" href="../../shared/design-system/utilities.min.css">
```

### En Développement

Conserver les versions non-minifiées pour faciliter le débogage et la maintenance.

## Outils Recommandés

### Images
- **ImageOptim** (macOS): Optimisation automatique d'images
- **Squoosh** (web): Compression d'images avec prévisualisation
- **SVGO**: Optimisation SVG en ligne de commande

### CSS
- **CSS Minifier** (en ligne): Pour minification manuelle si nécessaire
- Scripts fournis: `scripts/minify-css.js`

### Performance
- **Lighthouse**: Audit de performance intégré à Chrome DevTools
- **PageSpeed Insights**: Analyse de performance en ligne
- **WebPageTest**: Test de performance détaillé

## Checklist d'Optimisation

Avant de déployer, vérifier:

- [ ] Tous les SVG sont optimisés
- [ ] Les versions minifiées CSS sont à jour
- [ ] Les images ont `loading="lazy"` si approprié
- [ ] Pas de doublons CSS
- [ ] Pas de code mort JavaScript
- [ ] Taille totale des assets < 100KB (objectif)
- [ ] Audit Lighthouse > 90 (Performance)

## Maintenance

### Après chaque modification CSS

1. Exécuter `node scripts/minify-css.js` pour régénérer les `.min.css`
2. Vérifier qu'il n'y a pas de doublons
3. Tester que les styles fonctionnent toujours

### Après ajout d'images

1. Optimiser avec `node scripts/optimize-assets.js --optimize-svg` (pour SVG)
2. Ajouter `loading="lazy"` si l'image n'est pas critique
3. Vérifier la taille (objectif: < 50KB par image)

## Notes Importantes

- ⚠️ **Pas de build**: Toutes les optimisations sont manuelles ou via scripts simples
- ⚠️ **Lisibilité préservée**: Les versions non-minifiées sont maintenues pour le développement
- ⚠️ **Compatibilité**: Les optimisations ne cassent pas la fonctionnalité existante

## Références

- [MDN: Lazy Loading](https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading)
- [Web.dev: Optimize Images](https://web.dev/fast/#optimize-your-images)
- [CSS Minification Best Practices](https://web.dev/unminified-css/)

