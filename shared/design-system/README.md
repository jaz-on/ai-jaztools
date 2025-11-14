# Design System ai-jaztools

Ce design system fournit une base CSS commune, évolutive et maintenable pour tous les outils du monorepo ai-jaztools.

## Principes

- Variables CSS unifiées pour les couleurs, espacements, typographie, etc.
- Classes utilitaires pour la mise en page rapide
- Composants réutilisables (boutons, cartes, badges, listes, etc.)
- Compatibilité responsive et accessibilité

## Structure

Le design system est organisé en plusieurs fichiers :

- `variables.css` : Variables CSS (couleurs, espacements, typographie, breakpoints)
- `base.css` : Reset CSS et styles de base
- `components.css` : Composants réutilisables (buttons, cards, forms, etc.)
- `utilities.css` : Classes utilitaires (spacing, colors, typography, layout)

## Assets communs

Les ressources partagées sont stockées dans `../assets/` :
- `favicon.svg` : Favicon vectoriel
- `favicon.ico` : Favicon compatible navigateurs plus anciens

Pour utiliser les favicons dans une page :
```html
<link rel="icon" type="image/svg+xml" href="/shared/assets/favicon.svg">
<link rel="icon" type="image/x-icon" href="/shared/assets/favicon.ico">
```

## Utilisation

### Import complet

Pour utiliser le design system complet dans vos pages :

```html
<link rel="stylesheet" href="/shared/design-system/variables.css">
<link rel="stylesheet" href="/shared/design-system/base.css">
<link rel="stylesheet" href="/shared/design-system/components.css">
<link rel="stylesheet" href="/shared/design-system/utilities.css">
```

### Variables principales

Les variables sont définies dans `variables.css` :

- **Couleurs** : `--blue`, `--dark`, `--white`, `--gray`, `--success`, `--error`, etc.
- **Espacement** : `--space-xs`, `--space-sm`, `--space`, `--space-md`, `--space-lg`, etc.
- **Rayons** : `--radius`, `--radius-sm`, `--radius-md`, etc.
- **Typographie** : `--font-family`, `--font-size-base`, `--font-weight-semibold`, etc.
- **Breakpoints** : `--breakpoint-sm`, `--breakpoint-md`, `--breakpoint-lg`, etc.

## Classes utilitaires

Définies dans `utilities.css` :

- **Display** : `.hidden`, `.sr-only`, `.block`, `.flex`, `.grid`, etc.
- **Espacement** : `.m-1`, `.p-2`, `.mx-auto`, `.mt-4`, etc.
- **Couleurs** : `.text-blue`, `.bg-light`, `.text-success`, etc.
- **Bordures, arrondis, ombres, transitions**, etc.

## Composants principaux

Définis dans `components.css` :

### Boutons

- `.btn` : bouton de base
- `.btn-primary`, `.btn-secondary`, `.btn-success`, `.btn-error`, `.btn-warning` : variantes
- `.btn-sm`, `.btn-lg` : tailles

**Exemple** :
```html
<button class="btn btn-primary">Valider</button>
```

### Cartes

- `.card`, `.card-header`, `.card-title`, `.card-body`, `.card-footer`

**Exemple** :
```html
<div class="card">
  <div class="card-header"><h2 class="card-title">Titre</h2></div>
  <div class="card-body">Contenu</div>
  <div class="card-footer">Actions</div>
</div>
```

### Grilles

- `.grid`, `.grid-cols-2`, `.grid-cols-3`, etc.

**Exemple** :
```html
<div class="grid grid-cols-3">
  <div>Colonne 1</div>
  <div>Colonne 2</div>
  <div>Colonne 3</div>
</div>
```

### Badges

- `.badge`, `.badge-primary`, `.badge-success`, `.badge-error`, `.badge-warning`, `.badge-gray`

**Exemple** :
```html
<span class="badge badge-success">Succès</span>
```

### Statistiques

- `.stat-card`, `.stat-number`, `.stat-label`, `.stat-description`

**Exemple** :
```html
<div class="stat-card">
  <div class="stat-number">42</div>
  <div class="stat-label">Articles</div>
</div>
```

### Listes

- `.list`, `.list-item`, `.list-title`, `.list-subtitle`
- `.source-list`, `.article-list`, `.source-name`, `.source-count`, `.article-title`, `.article-author`

### Chargement

- `.loading`, `.loading-spinner`

### Messages

- `.message`, `.message.success`, `.message.error`, `.message.warning`, `.message.info`

## Responsive et accessibilité

- Les composants sont adaptatifs (voir media queries dans les fichiers CSS)
- Focus visible, réduction de mouvement
- Support des lecteurs d'écran avec `.sr-only`

## Chemins relatifs

Lors de l'utilisation dans les outils, les chemins doivent être adaptés selon la structure :

- Depuis `tools/[tool-name]/` : `../../shared/design-system/`
- Depuis `landing/` : `../shared/design-system/`

## Contribution

Pour toute contribution ou extension, merci de respecter la structure et la nomenclature existantes. Les modifications doivent être compatibles avec tous les outils du monorepo.

