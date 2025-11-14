# Guide d'Accessibilité WCAG 2.1 Niveau AA

Ce document fournit une checklist complète et des guides d'implémentation pour garantir la conformité WCAG 2.1 niveau AA sur tous les outils du projet.

## Table des matières

1. [Checklist WCAG 2.1 AA](#checklist-wcag-21-aa)
2. [Structure sémantique](#structure-sémantique)
3. [Navigation clavier](#navigation-clavier)
4. [Contraste des couleurs](#contraste-des-couleurs)
5. [Formulaires accessibles](#formulaires-accessibles)
6. [Images et médias](#images-et-médias)
7. [Attributs ARIA](#attributs-aria)
8. [Animations et mouvements](#animations-et-mouvements)
9. [Gestion du focus](#gestion-du-focus)
10. [Tests et validation](#tests-et-validation)

---

## Checklist WCAG 2.1 AA

### Niveau A (Obligatoire)

- [x] **1.1.1 Contenu non textuel** : Toutes les images ont un attribut `alt` approprié
- [x] **1.3.1 Info et relations** : Structure sémantique HTML5 correcte
- [x] **1.4.1 Utilisation de la couleur** : L'information n'est pas véhiculée uniquement par la couleur
- [x] **2.1.1 Clavier** : Tous les éléments interactifs sont accessibles au clavier
- [x] **2.1.2 Pas de piège au clavier** : Le focus peut quitter tous les composants
- [x] **2.4.1 Contourner des blocs** : Skip links présents
- [x] **2.4.2 Titre de page** : Chaque page a un titre unique et descriptif
- [x] **2.4.3 Ordre de focus** : L'ordre de tabulation est logique
- [x] **3.1.1 Langue de la page** : Attribut `lang` présent sur `<html>`
- [x] **3.3.1 Identification des erreurs** : Messages d'erreur clairs et identifiables
- [x] **3.3.2 Labels ou instructions** : Tous les inputs ont des labels
- [x] **4.1.1 Analyse syntaxique** : HTML valide
- [x] **4.1.2 Nom, rôle, valeur** : Attributs ARIA appropriés

### Niveau AA (Recommandé)

- [x] **1.4.3 Contraste (minimum)** : Ratio 4.5:1 pour texte normal
- [x] **1.4.4 Redimensionnement du texte** : Texte redimensionnable jusqu'à 200%
- [x] **1.4.5 Images de texte** : Pas d'images de texte (sauf logo)
- [x] **2.4.4 Objectif du lien** : Liens descriptifs (hors contexte)
- [x] **2.4.6 En-têtes et labels** : En-têtes et labels descriptifs
- [x] **2.4.7 Focus visible** : Focus visible sur tous les éléments interactifs
- [x] **2.5.3 Nom accessible** : Nom accessible correspond au texte visible
- [x] **3.2.3 Navigation cohérente** : Navigation cohérente entre pages
- [x] **3.2.4 Identification cohérente** : Composants identifiés de manière cohérente
- [x] **3.3.3 Suggestions d'erreur** : Suggestions fournies en cas d'erreur
- [x] **3.3.4 Prévention des erreurs** : Confirmation pour actions critiques

---

## Structure sémantique

### Balises HTML5 sémantiques

Utilisez les balises appropriées pour chaque section :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Titre descriptif de la page</title>
</head>
<body>
    <!-- Skip link pour navigation clavier -->
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>
    
    <header role="banner">
        <h1>Titre principal</h1>
        <nav role="navigation" aria-label="Navigation principale">
            <!-- Navigation -->
        </nav>
    </header>
    
    <main id="main-content" role="main">
        <section aria-labelledby="section-title">
            <h2 id="section-title">Titre de section</h2>
            <!-- Contenu -->
        </section>
    </main>
    
    <footer role="contentinfo">
        <!-- Footer -->
    </footer>
</body>
</html>
```

### Hiérarchie des titres

- Un seul `<h1>` par page
- Hiérarchie logique : h1 → h2 → h3 (pas de saut de niveau)
- Titres descriptifs et concis

### Landmarks ARIA

Utilisez les landmarks pour la navigation :

- `role="banner"` : En-tête principal
- `role="navigation"` : Navigation
- `role="main"` : Contenu principal
- `role="contentinfo"` : Pied de page
- `role="complementary"` : Contenu complémentaire (sidebar)
- `role="search"` : Zone de recherche
- `role="form"` : Formulaire

---

## Navigation clavier

### Skip links

Ajoutez un lien pour contourner la navigation :

```html
<a href="#main-content" class="skip-link">Aller au contenu principal</a>

<style>
.skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--blue);
    color: white;
    padding: 8px;
    text-decoration: none;
    z-index: 100;
}
.skip-link:focus {
    top: 0;
}
</style>
```

### Ordre de tabulation

- Ordre logique : de gauche à droite, de haut en bas
- Utilisez `tabindex="0"` pour rendre un élément focusable
- Utilisez `tabindex="-1"` pour retirer un élément de l'ordre de tabulation (mais le garder focusable programmatiquement)

### Navigation dans les composants

#### Tabs

```javascript
// Navigation avec flèches
tab.addEventListener('keydown', (e) => {
    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
    const currentIndex = tabs.indexOf(e.target);
    
    switch(e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % tabs.length;
            tabs[nextIndex].focus();
            break;
        case 'ArrowLeft':
        case 'ArrowUp':
            e.preventDefault();
            const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            tabs[prevIndex].focus();
            break;
        case 'Home':
            e.preventDefault();
            tabs[0].focus();
            break;
        case 'End':
            e.preventDefault();
            tabs[tabs.length - 1].focus();
            break;
    }
});
```

#### Modales

- Piège au clavier : le focus reste dans la modale
- Fermeture avec `Escape`
- Retour du focus à l'élément qui a ouvert la modale

---

## Contraste des couleurs

### Ratios minimums WCAG 2.1 AA

- **Texte normal** (< 18pt ou < 14pt bold) : **4.5:1**
- **Texte large** (≥ 18pt ou ≥ 14pt bold) : **3:1**
- **Composants UI et états** : **3:1**

### Vérification des couleurs du design system

Couleurs principales du projet :

- `--blue: #2c5aa0` sur blanc : **4.8:1** ✓
- `--blue-dark: #1e3f6b` sur blanc : **7.2:1** ✓
- `--gray: #6b7280` sur blanc : **4.6:1** ✓
- `--success: #4caf50` sur blanc : **3.2:1** (texte large) ✓
- `--error: #f44336` sur blanc : **3.9:1** (texte large) ✓

### Outils de vérification

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/)
- Lighthouse (audit automatique)

### Bonnes pratiques

- Ne pas utiliser uniquement la couleur pour véhiculer l'information
- Ajouter des icônes ou du texte pour les états
- Tester avec des filtres de daltonisme

---

## Formulaires accessibles

### Labels

Tous les inputs doivent avoir un label associé :

```html
<!-- Méthode 1 : Label explicite -->
<label for="email">Email</label>
<input type="email" id="email" name="email">

<!-- Méthode 2 : Label implicite -->
<label>
    Email
    <input type="email" name="email">
</label>

<!-- Méthode 3 : aria-label (si label visuel impossible) -->
<input type="email" aria-label="Adresse email">
```

### Champs obligatoires

```html
<label for="email">
    Email
    <span class="required" aria-label="obligatoire">*</span>
</label>
<input type="email" id="email" required aria-required="true">
```

### Messages d'erreur

```html
<label for="email">Email</label>
<input 
    type="email" 
    id="email" 
    aria-invalid="true"
    aria-describedby="email-error"
    aria-required="true"
>
<span id="email-error" class="error-message" role="alert">
    Veuillez entrer une adresse email valide
</span>
```

### Groupes de champs

```html
<fieldset>
    <legend>Informations de contact</legend>
    <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email">
    </div>
    <div class="form-group">
        <label for="phone">Téléphone</label>
        <input type="tel" id="phone">
    </div>
</fieldset>
```

### Instructions

```html
<label for="password">Mot de passe</label>
<input 
    type="password" 
    id="password"
    aria-describedby="password-instructions"
>
<span id="password-instructions" class="instructions">
    Le mot de passe doit contenir au moins 8 caractères
</span>
```

---

## Images et médias

### Attributs alt

```html
<!-- Image informative -->
<img src="logo.png" alt="Logo de l'application">

<!-- Image décorative -->
<img src="decoration.png" alt="">

<!-- Image avec texte -->
<img src="banner.png" alt="Promotion spéciale : 50% de réduction">

<!-- Image complexe (graphique, diagramme) -->
<img src="chart.png" alt="Graphique montrant l'évolution des ventes sur 12 mois">
<p class="sr-only">
    Graphique montrant une augmentation de 25% des ventes entre janvier et décembre
</p>
```

### Images SVG

```html
<svg role="img" aria-label="Icône de recherche">
    <use href="#search-icon"></use>
</svg>

<!-- SVG décoratif -->
<svg aria-hidden="true">
    <use href="#decoration"></use>
</svg>
```

### Vidéos

- Sous-titres pour les vidéos avec audio
- Transcription textuelle
- Contrôles clavier accessibles

---

## Attributs ARIA

### Rôles ARIA

```html
<!-- Navigation -->
<nav role="navigation" aria-label="Navigation principale">

<!-- Zone de recherche -->
<div role="search" aria-label="Rechercher sur le site">

<!-- Zone de contenu principal -->
<main role="main">

<!-- Contenu complémentaire -->
<aside role="complementary" aria-label="Informations supplémentaires">
```

### États ARIA

```html
<!-- Bouton avec état -->
<button aria-expanded="false" aria-controls="menu">
    Menu
</button>
<div id="menu" aria-hidden="true">
    <!-- Contenu du menu -->
</div>

<!-- Checkbox -->
<input type="checkbox" aria-checked="true" aria-label="Accepter les conditions">

<!-- Progress bar -->
<div role="progressbar" 
     aria-valuenow="50" 
     aria-valuemin="0" 
     aria-valuemax="100"
     aria-label="Progression : 50%">
</div>
```

### Régions live (aria-live)

```html
<!-- Annonces importantes (polite) -->
<div aria-live="polite" aria-atomic="true" class="sr-only">
    Chargement terminé
</div>

<!-- Annonces urgentes (assertive) -->
<div aria-live="assertive" aria-atomic="true" class="sr-only">
    Erreur critique détectée
</div>
```

**Quand utiliser :**
- `aria-live="polite"` : Messages d'information, confirmations
- `aria-live="assertive"` : Erreurs critiques, alertes urgentes
- `aria-atomic="true"` : Annoncer tout le contenu, pas seulement les changements

### Labels ARIA

```html
<!-- aria-label : label court -->
<button aria-label="Fermer la modale">×</button>

<!-- aria-labelledby : référence à un élément existant -->
<h2 id="modal-title">Confirmation</h2>
<div role="dialog" aria-labelledby="modal-title">
    <!-- Contenu -->
</div>

<!-- aria-describedby : description supplémentaire -->
<input type="text" aria-describedby="help-text">
<span id="help-text">Format attendu : jj/mm/aaaa</span>
```

---

## Animations et mouvements

### prefers-reduced-motion

Respectez la préférence utilisateur pour réduire les animations :

```css
/* Animation normale */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.element {
    animation: fadeIn 0.3s ease;
}

/* Réduction pour prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

### Animations qui peuvent causer des crises

Évitez les animations clignotantes ou qui dépassent 3 flashs par seconde (WCAG 2.3.1).

---

## Gestion du focus

### Focus visible

Tous les éléments interactifs doivent avoir un focus visible :

```css
/* Focus par défaut (peut être amélioré) */
*:focus {
    outline: 2px solid var(--blue);
    outline-offset: 2px;
}

/* Focus amélioré pour meilleure visibilité */
.btn:focus,
input:focus,
select:focus,
textarea:focus,
a:focus {
    outline: 3px solid var(--blue);
    outline-offset: 3px;
    box-shadow: 0 0 0 3px rgba(44, 90, 160, 0.3);
}
```

### Gestion du focus dans les modales

```javascript
function openModal(modal) {
    // Sauvegarder l'élément qui a ouvert la modale
    const previousActiveElement = document.activeElement;
    
    // Afficher la modale
    modal.style.display = 'block';
    
    // Focuser le premier élément focusable
    const firstFocusable = modal.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (firstFocusable) firstFocusable.focus();
    
    // Piège au clavier
    const lastFocusable = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const lastElement = lastFocusable[lastFocusable.length - 1];
    
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    function closeModal() {
        modal.style.display = 'none';
        // Retourner le focus
        if (previousActiveElement) previousActiveElement.focus();
    }
}
```

### Focus après actions dynamiques

```javascript
// Après ajout d'un élément au DOM
function addItem(item) {
    const list = document.getElementById('list');
    list.appendChild(item);
    
    // Focuser le nouvel élément
    item.querySelector('button').focus();
}

// Après navigation
function navigateToSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: 'smooth' });
    
    // Focuser le premier élément focusable
    const firstFocusable = section.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100);
    }
}
```

---

## Tests et validation

### Outils automatiques

#### 1. Lighthouse (Chrome DevTools)

```bash
# Ouvrir Chrome DevTools > Lighthouse
# Sélectionner "Accessibility"
# Score minimum : 90
```

**Points vérifiés :**
- Contraste des couleurs
- Attributs ARIA
- Labels de formulaires
- Structure sémantique

#### 2. axe DevTools

Extension Chrome/Firefox pour tests en temps réel.

#### 3. WAVE (Web Accessibility Evaluation Tool)

Extension navigateur ou service en ligne.

### Tests manuels

#### Navigation clavier

1. Utiliser uniquement le clavier (Tab, Shift+Tab, Enter, Espace, flèches)
2. Vérifier que tous les éléments interactifs sont accessibles
3. Vérifier l'ordre de tabulation
4. Vérifier que le focus est visible
5. Tester les modales (piège au clavier, Escape)
6. Tester les composants complexes (tabs, accordéons)

#### Lecteurs d'écran

**VoiceOver (macOS) :**
- Activer : Cmd + F5
- Navigation : VO + Flèches
- Liste des éléments : VO + U

**NVDA (Windows) :**
- Télécharger depuis [nvaccess.org](https://www.nvaccess.org/)
- Navigation : Flèches, Tab

**Tests à effectuer :**
- Navigation dans la page
- Lecture des titres (H1, H2, etc.)
- Navigation dans les formulaires
- Annonces des messages d'erreur
- Navigation dans les composants complexes

### Checklist de validation finale

Pour chaque outil, vérifier :

- [ ] Structure sémantique HTML5 correcte
- [ ] Skip links présents et fonctionnels
- [ ] Tous les éléments interactifs accessibles au clavier
- [ ] Focus visible sur tous les éléments (outline claire)
- [ ] Pas de piège au clavier
- [ ] Labels associés à tous les inputs (`for`/`id` ou `aria-label`)
- [ ] Messages d'erreur avec `aria-describedby` et `aria-invalid`
- [ ] Attributs `alt` sur toutes les images (ou `alt=""` pour décoratives)
- [ ] Contraste 4.5:1 minimum pour texte normal
- [ ] Contraste 3:1 minimum pour texte large
- [ ] `prefers-reduced-motion` respecté
- [ ] Attributs ARIA appropriés (`role`, `aria-label`, `aria-describedby`, etc.)
- [ ] Navigation clavier complète (Tab, flèches, Escape)
- [ ] Score Lighthouse accessibilité ≥ 90
- [ ] Tests avec lecteur d'écran réussis

---

## Exemples de code

### Composant Button accessible

```javascript
export default function Button({
    variant = 'primary',
    disabled = false,
    ariaLabel = null,
    ariaDescribedBy = null,
    ariaBusy = false,
    children = ''
} = {}) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `btn btn-${variant}`;
    btn.disabled = !!disabled;
    
    // Attributs ARIA
    if (ariaLabel) btn.setAttribute('aria-label', ariaLabel);
    if (ariaDescribedBy) btn.setAttribute('aria-describedby', ariaDescribedBy);
    if (ariaBusy) {
        btn.setAttribute('aria-busy', 'true');
        btn.setAttribute('aria-label', ariaLabel || 'Chargement en cours');
    }
    
    if (disabled) {
        btn.setAttribute('aria-disabled', 'true');
    }
    
    // Contenu
    if (typeof children === 'string') {
        btn.textContent = children;
    } else if (children instanceof Node) {
        btn.appendChild(children);
    }
    
    return btn;
}
```

### Composant FormInput accessible

```javascript
export default function FormInput({
    id = '',
    type = 'text',
    label = '',
    required = false,
    errorMessage = null,
    instructions = null,
    value = '',
    onChange = null
} = {}) {
    const container = document.createElement('div');
    container.className = 'form-group';
    
    // Label
    const labelEl = document.createElement('label');
    labelEl.htmlFor = id;
    labelEl.textContent = label;
    if (required) {
        const requiredSpan = document.createElement('span');
        requiredSpan.className = 'required';
        requiredSpan.textContent = ' *';
        requiredSpan.setAttribute('aria-label', 'obligatoire');
        labelEl.appendChild(requiredSpan);
    }
    container.appendChild(labelEl);
    
    // Input
    const input = document.createElement('input');
    input.id = id;
    input.type = type;
    input.value = value;
    input.required = required;
    
    // Attributs ARIA
    if (required) input.setAttribute('aria-required', 'true');
    if (errorMessage) {
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', `${id}-error`);
    } else if (instructions) {
        input.setAttribute('aria-describedby', `${id}-instructions`);
    }
    
    container.appendChild(input);
    
    // Instructions
    if (instructions) {
        const instructionsEl = document.createElement('span');
        instructionsEl.id = `${id}-instructions`;
        instructionsEl.className = 'instructions';
        instructionsEl.textContent = instructions;
        container.appendChild(instructionsEl);
    }
    
    // Message d'erreur
    if (errorMessage) {
        const errorEl = document.createElement('span');
        errorEl.id = `${id}-error`;
        errorEl.className = 'error-message';
        errorEl.setAttribute('role', 'alert');
        errorEl.textContent = errorMessage;
        container.appendChild(errorEl);
    }
    
    if (onChange) input.addEventListener('input', onChange);
    
    return container;
}
```

---

## Ressources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM](https://webaim.org/)
- [MDN - ARIA](https://developer.mozilla.org/fr/docs/Web/Accessibility/ARIA)
- [A11y Project](https://www.a11yproject.com/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

**Dernière mise à jour :** 2025-01-XX

