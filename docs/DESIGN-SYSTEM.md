# Design System ai-jaztools

Documentation complète du design system unifié utilisé par tous les outils du monorepo.

## Vue d'ensemble

Le design system fournit une base CSS commune, évolutive et maintenable pour tous les outils. Il est organisé en plusieurs fichiers modulaires dans `shared/design-system/`.

## Structure

```
shared/design-system/
├── variables.css    # Variables CSS (couleurs, espacements, typographie)
├── base.css         # Reset CSS et styles de base
├── components.css   # Composants réutilisables
└── utilities.css    # Classes utilitaires
```

## Utilisation

### Import dans vos pages

```html
<link rel="stylesheet" href="../../shared/design-system/variables.css">
<link rel="stylesheet" href="../../shared/design-system/base.css">
<link rel="stylesheet" href="../../shared/design-system/components.css">
<link rel="stylesheet" href="../../shared/design-system/utilities.css">
```

**Note** : Adaptez les chemins relatifs selon la structure de votre outil.

## Variables CSS

### Couleurs principales

- `--blue` : #2c5aa0
- `--blue-dark` : #1e3f6b
- `--blue-light` : #4a7bc8
- `--dark` : #000
- `--white` : #fff
- `--gray` : #6b7280
- `--gray-light` : #9ca3af
- `--gray-dark` : #374151
- `--light` : #f3f4f6
- `--light-dark` : #e5e7eb

### Couleurs sémantiques

- `--success` : #4caf50
- `--error` : #f44336
- `--warning` : #ff9800
- `--info` : #2196f3

### Espacement

- `--space-xs` : 0.25rem
- `--space-sm` : 0.5rem
- `--space` : 1rem
- `--space-md` : 1.5rem
- `--space-lg` : 2rem
- `--space-xl` : 3rem
- `--space-2xl` : 4rem

### Typographie

- `--font-family` : -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- `--font-size-xs` à `--font-size-4xl` : tailles de police
- `--font-weight-normal` à `--font-weight-bold` : poids de police
- `--line-height-tight`, `--line-height-normal`, `--line-height-relaxed` : hauteurs de ligne

### Breakpoints

- `--breakpoint-sm` : 640px
- `--breakpoint-md` : 768px
- `--breakpoint-lg` : 1024px
- `--breakpoint-xl` : 1280px
- `--breakpoint-2xl` : 1536px

## Composants

### Boutons

```html
<button class="btn btn-primary">Bouton principal</button>
<button class="btn btn-secondary">Bouton secondaire</button>
<button class="btn btn-success">Succès</button>
<button class="btn btn-error">Erreur</button>
<button class="btn btn-warning">Avertissement</button>

<!-- Tailles -->
<button class="btn btn-primary btn-sm">Petit</button>
<button class="btn btn-primary btn-lg">Grand</button>
```

### Cartes

```html
<div class="card">
  <div class="card-header">
    <h2 class="card-title">Titre</h2>
  </div>
  <div class="card-body">
    Contenu de la carte
  </div>
  <div class="card-footer">
    Actions
  </div>
</div>
```

### Grilles

```html
<div class="grid grid-cols-2">
  <div>Colonne 1</div>
  <div>Colonne 2</div>
</div>

<div class="grid grid-cols-3">
  <div>Colonne 1</div>
  <div>Colonne 2</div>
  <div>Colonne 3</div>
</div>
```

### Badges

```html
<span class="badge badge-primary">Primaire</span>
<span class="badge badge-success">Succès</span>
<span class="badge badge-error">Erreur</span>
<span class="badge badge-warning">Avertissement</span>
<span class="badge badge-gray">Gris</span>
```

### Messages

```html
<div class="message success">Message de succès</div>
<div class="message error">Message d'erreur</div>
<div class="message warning">Message d'avertissement</div>
<div class="message info">Message d'information</div>
```

### Statistiques

```html
<div class="stat-card">
  <div class="stat-number">42</div>
  <div class="stat-label">Articles</div>
  <div class="stat-description">Description optionnelle</div>
</div>
```

### Chargement

```html
<div class="loading show">
  <div class="loading-spinner"></div>
  <p>Chargement en cours...</p>
</div>
```

## Classes utilitaires

### Display

- `.block`, `.inline-block`, `.inline`, `.flex`, `.grid`, `.hidden`

### Flexbox

- `.flex-row`, `.flex-col`, `.items-center`, `.justify-between`, etc.

### Espacement

- `.m-1` à `.m-6` : marges
- `.p-1` à `.p-6` : paddings
- `.mt-*`, `.mb-*`, `.ml-*`, `.mr-*` : marges directionnelles
- `.mx-auto` : centrage horizontal

### Typographie

- `.text-left`, `.text-center`, `.text-right`
- `.text-xs` à `.text-4xl` : tailles de texte
- `.font-normal`, `.font-medium`, `.font-semibold`, `.font-bold`
- `.text-blue`, `.text-success`, `.text-error`, etc.

### Arrière-plans

- `.bg-blue`, `.bg-white`, `.bg-light`, `.bg-success`, etc.

### Bordures

- `.border`, `.border-0`, `.border-t`, `.border-b`, etc.
- `.rounded`, `.rounded-sm`, `.rounded-lg`, `.rounded-full`

### Ombres

- `.shadow-none`, `.shadow-sm`, `.shadow`, `.shadow-md`, `.shadow-lg`, `.shadow-xl`

## Responsive

Les composants sont adaptatifs par défaut. Utilisez les media queries CSS standard :

```css
@media (max-width: 768px) {
  /* Styles mobiles */
}
```

## Accessibilité

Le design system inclut :

- Focus visible pour la navigation au clavier
- Support des lecteurs d'écran avec `.sr-only`
- Réduction de mouvement pour `prefers-reduced-motion`
- Contraste de couleurs conforme WCAG

## Contribution

Pour étendre le design system :

1. Ajoutez les nouvelles variables dans `variables.css`
2. Créez les composants dans `components.css`
3. Ajoutez les utilitaires dans `utilities.css`
4. Documentez les changements dans ce fichier
5. Testez la compatibilité avec tous les outils

## Exemples complets

Voir les fichiers HTML des outils pour des exemples d'utilisation complète :
- `tools/feed-minitools/index.html`
- `tools/instafed/index.html`
- `landing/index.html`

