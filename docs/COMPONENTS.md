# Documentation des composants partagés

Ce document décrit tous les composants réutilisables disponibles dans `shared/components/` et leur utilisation.

## Vue d'ensemble

Les composants partagés sont des modules JavaScript vanilla (ES modules) qui créent des éléments DOM avec support d'accessibilité complet (ARIA). Ils sont conçus pour être utilisés dans tous les outils du projet pour assurer la cohérence visuelle et fonctionnelle.

## Installation et import

Tous les composants sont importés depuis `shared/components/` :

```javascript
import Button from '../../shared/components/Button/Button.js';
import Card from '../../shared/components/Card/Card.js';
// etc.
```

Les CSS sont automatiquement chargés via les imports des fichiers `index.js` des composants.

## Composants disponibles

### Badge

Badge de statut avec différentes variantes.

**Import :**
```javascript
import Badge from '../../shared/components/Badge/Badge.js';
```

**API :**
```javascript
Badge({
  variant: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'gray',
  children: string | Node | Array
})
```

**Exemple :**
```javascript
const badge = Badge({ 
  variant: 'success', 
  children: 'Actif' 
});
```

**Migration depuis HTML :**
```html
<!-- Avant -->
<span class="badge badge-primary">Actif</span>

<!-- Après (via composant) -->
const badge = Badge({ variant: 'primary', children: 'Actif' });
```

---

### Button

Bouton réutilisable avec support d'accessibilité complet.

**Import :**
```javascript
import Button from '../../shared/components/Button/Button.js';
```

**API :**
```javascript
Button({
  variant: 'primary' | 'secondary' | 'success' | 'error' | 'warning',
  size: 'sm' | 'md' | 'lg',
  disabled: boolean,
  onClick: function,
  children: string | Node | Array,
  ariaLabel: string,
  ariaDescribedBy: string,
  ariaBusy: boolean,
  type: 'button' | 'submit' | 'reset'
})
```

**Exemple :**
```javascript
const btn = Button({
  variant: 'primary',
  children: 'Cliquer ici',
  onClick: () => console.log('Clicked!'),
  ariaLabel: 'Bouton d\'action principal'
});
```

**Migration depuis HTML :**
```html
<!-- Avant -->
<button class="btn-base btn-primary" onclick="handleClick()">Cliquer</button>

<!-- Après (via composant) -->
const btn = Button({ 
  variant: 'primary', 
  children: 'Cliquer',
  onClick: handleClick
});
```

---

### Card

Conteneur de contenu avec style de carte.

**Import :**
```javascript
import Card from '../../shared/components/Card/Card.js';
```

**API :**
```javascript
Card({
  children: string | Node | Array
})
```

**Exemple :**
```javascript
const card = Card({
  children: [
    document.createElement('h3').textContent = 'Titre',
    document.createElement('p').textContent = 'Contenu'
  ]
});
```

**Migration depuis HTML :**
```html
<!-- Avant -->
<div class="card-base">
  <h3>Titre</h3>
  <p>Contenu</p>
</div>

<!-- Après (via composant) -->
const card = Card({
  children: [
    createElement('h3', 'Titre'),
    createElement('p', 'Contenu')
  ]
});
```

---

### Footer

Pied de page réutilisable.

**Import :**
```javascript
import Footer from '../../shared/components/Footer/Footer.js';
```

**API :**
```javascript
Footer({
  children: string | Node | Array
})
```

**Exemple :**
```javascript
const footer = Footer({
  children: '© 2024 Mon projet'
});
```

---

### Form Components

Composants de formulaire avec support d'accessibilité complet.

**Import :**
```javascript
import { FormGroup, FormInput, FormLabel, FormError } from '../../shared/components/Form/index.js';
```

#### FormGroup

Groupe de champs de formulaire.

**API :**
```javascript
FormGroup({
  children: string | Node | Array
})
```

#### FormInput

Champ de saisie avec validation et accessibilité.

**API :**
```javascript
FormInput({
  id: string, // Requis pour l'association avec le label
  type: 'text' | 'email' | 'password' | 'number' | 'range' | etc.,
  value: string,
  onChange: function,
  placeholder: string,
  required: boolean,
  disabled: boolean,
  invalid: boolean,
  ariaDescribedBy: string,
  ariaErrorMessage: string,
  autocomplete: string
})
```

#### FormLabel

Label de formulaire avec association automatique.

**API :**
```javascript
FormLabel({
  htmlFor: string, // ID de l'input associé (requis)
  children: string | Node | Array,
  required: boolean // Affiche l'indication de champ obligatoire
})
```

#### FormError

Message d'erreur de formulaire.

**API :**
```javascript
FormError({
  children: string | Node | Array
})
```

**Exemple complet :**
```javascript
const formGroup = FormGroup({
  children: [
    FormLabel({ 
      htmlFor: 'email', 
      children: 'Email',
      required: true 
    }),
    FormInput({
      id: 'email',
      type: 'email',
      required: true,
      onChange: (e) => console.log(e.target.value),
      ariaErrorMessage: 'email-error'
    }),
    FormError({ 
      id: 'email-error',
      children: 'Email invalide' 
    })
  ]
});
```

**Migration depuis HTML :**
```html
<!-- Avant -->
<div class="input-group">
  <label for="email">Email <span class="required">*</span></label>
  <input type="email" id="email" required>
  <span class="error-message">Email invalide</span>
</div>

<!-- Après (via composants) -->
const form = FormGroup({
  children: [
    FormLabel({ htmlFor: 'email', children: 'Email', required: true }),
    FormInput({ id: 'email', type: 'email', required: true }),
    FormError({ children: 'Email invalide' })
  ]
});
```

---

### Grid

Grille de mise en page responsive.

**Import :**
```javascript
import Grid from '../../shared/components/Grid/Grid.js';
```

**API :**
```javascript
Grid({
  columns: number, // 1-12
  children: Array<Node>
})
```

**Exemple :**
```javascript
const grid = Grid({
  columns: 3,
  children: [card1, card2, card3]
});
```

**Migration depuis HTML :**
```html
<!-- Avant -->
<div class="grid grid-cols-3">
  <div class="card">...</div>
  <div class="card">...</div>
  <div class="card">...</div>
</div>

<!-- Après (via composant) -->
const grid = Grid({
  columns: 3,
  children: [card1, card2, card3]
});
```

---

### Header

En-tête de page réutilisable.

**Import :**
```javascript
import Header from '../../shared/components/Header/Header.js';
```

**API :**
```javascript
Header({
  title: string,
  subtitle: string
})
```

**Exemple :**
```javascript
const header = Header({
  title: 'Mon Application',
  subtitle: 'Description de l\'application'
});
```

---

### List

Liste avec items.

**Import :**
```javascript
import { List, ListItem } from '../../shared/components/List/index.js';
```

**API :**
```javascript
List({
  children: Array<ListItem>
})

ListItem({
  children: string | Node | Array
})
```

**Exemple :**
```javascript
const list = List({
  children: [
    ListItem({ children: 'Premier item' }),
    ListItem({ children: 'Deuxième item' }),
    ListItem({ children: 'Troisième item' })
  ]
});
```

---

### Loader

Indicateur de chargement.

**Import :**
```javascript
import Loader from '../../shared/components/Loader/Loader.js';
```

**API :**
```javascript
Loader({
  message: string
})
```

**Exemple :**
```javascript
const loader = Loader({ 
  message: 'Chargement en cours...' 
});
```

**Migration depuis HTML :**
```html
<!-- Avant -->
<div class="loading">
  <div class="loading-spinner"></div>
  <p>Chargement...</p>
</div>

<!-- Après (via composant) -->
const loader = Loader({ message: 'Chargement...' });
```

---

### Message

Messages d'information, succès, erreur ou avertissement.

**Import :**
```javascript
import Message from '../../shared/components/Message/Message.js';
```

**API :**
```javascript
Message({
  type: 'info' | 'success' | 'error' | 'warning',
  children: string | Node | Array
})
```

**Exemple :**
```javascript
const errorMsg = Message({
  type: 'error',
  children: 'Une erreur est survenue'
});

const successMsg = Message({
  type: 'success',
  children: 'Opération réussie'
});
```

**Migration depuis HTML :**
```html
<!-- Avant -->
<div class="message error">Erreur survenue</div>
<div class="message success">Succès</div>

<!-- Après (via composant) -->
const errorMsg = Message({ type: 'error', children: 'Erreur survenue' });
const successMsg = Message({ type: 'success', children: 'Succès' });
```

---

### Modal

Modale avec support d'accessibilité complet (focus trap, navigation clavier, ARIA).

**Import :**
```javascript
import Modal from '../../shared/components/Modal/Modal.js';
```

**API :**
```javascript
Modal({
  open: boolean,
  onClose: function,
  title: string,
  children: string | Node | Array,
  ariaLabel: string // Alternative si pas de titre
})
```

**Exemple :**
```javascript
const modal = Modal({
  open: true,
  title: 'Confirmation',
  children: 'Êtes-vous sûr de vouloir continuer ?',
  onClose: () => {
    modal.style.display = 'none';
  }
});

document.body.appendChild(modal);
```

**Migration depuis HTML :**
```html
<!-- Avant -->
<div class="modal-overlay">
  <div class="modal-dialog">
    <h3 class="modal-title">Titre</h3>
    <p>Contenu</p>
    <button class="modal-close">×</button>
  </div>
</div>

<!-- Après (via composant) -->
const modal = Modal({
  open: true,
  title: 'Titre',
  children: 'Contenu',
  onClose: () => modal.remove()
});
```

---

### Progress

Barre de progression.

**Import :**
```javascript
import { ProgressBar, ProgressContainer } from '../../shared/components/Progress/index.js';
```

**API :**
```javascript
ProgressBar({
  value: number, // 0-max
  max: number // Par défaut 100
})

ProgressContainer({
  children: string | Node | Array
})
```

**Exemple :**
```javascript
const progress = ProgressContainer({
  children: [
    ProgressBar({ value: 50, max: 100 }),
    document.createTextNode('50%')
  ]
});
```

**Migration depuis HTML :**
```html
<!-- Avant -->
<div class="progress" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
  <div class="progress-bar" style="width: 50%"></div>
</div>

<!-- Après (via composant) -->
const progress = ProgressContainer({
  children: [
    ProgressBar({ value: 50, max: 100 })
  ]
});
```

---

### Tabs

Onglets avec navigation clavier complète.

**Import :**
```javascript
import { Tabs, Tab } from '../../shared/components/Tabs/index.js';
```

**API :**
```javascript
Tabs({
  children: Array<Tab>,
  ariaLabel: string
})

Tab({
  label: string,
  children: string | Node | Array
})
```

**Exemple :**
```javascript
const tabs = Tabs({
  ariaLabel: 'Navigation principale',
  children: [
    Tab({ 
      label: 'Onglet 1', 
      children: 'Contenu de l\'onglet 1' 
    }),
    Tab({ 
      label: 'Onglet 2', 
      children: 'Contenu de l\'onglet 2' 
    })
  ]
});
```

**Migration depuis HTML :**
```html
<!-- Avant -->
<div class="tabs">
  <div class="tab-navigation" role="tablist">
    <button class="tab-btn active" role="tab">Onglet 1</button>
    <button class="tab-btn" role="tab">Onglet 2</button>
  </div>
  <div class="tab-content active" role="tabpanel">Contenu 1</div>
  <div class="tab-content" role="tabpanel">Contenu 2</div>
</div>

<!-- Après (via composant) -->
const tabs = Tabs({
  children: [
    Tab({ label: 'Onglet 1', children: 'Contenu 1' }),
    Tab({ label: 'Onglet 2', children: 'Contenu 2' })
  ]
});
```

---

## Guide de migration

### Étapes générales

1. **Identifier les éléments HTML à remplacer**
   - Chercher les classes CSS correspondant aux composants (ex: `btn-base`, `card-base`, `message`)
   - Identifier les structures HTML complexes (modales, onglets, formulaires)

2. **Importer les composants nécessaires**
   ```javascript
   import Button from '../../shared/components/Button/Button.js';
   import Card from '../../shared/components/Card/Card.js';
   // etc.
   ```

3. **Créer les composants en JavaScript**
   ```javascript
   const btn = Button({ variant: 'primary', children: 'Cliquer' });
   ```

4. **Remplacer le HTML statique**
   - Supprimer le HTML statique
   - Ajouter les composants créés dynamiquement dans le DOM

5. **Adapter les event listeners**
   - Les composants acceptent des callbacks (ex: `onClick` pour Button)
   - Adapter le code existant pour utiliser ces callbacks

6. **Tester l'accessibilité**
   - Les composants ont déjà le support ARIA intégré
   - Vérifier que la navigation clavier fonctionne
   - Tester avec un lecteur d'écran si possible

### Cas particuliers

#### Extension de styles

Si vous devez ajouter des classes CSS personnalisées :

```javascript
const card = Card({ children: 'Contenu' });
card.classList.add('ma-classe-personnalisee');
```

#### Composants imbriqués

Les composants acceptent des Nodes comme enfants :

```javascript
const card = Card({
  children: [
    Header({ title: 'Titre', subtitle: 'Sous-titre' }),
    Button({ variant: 'primary', children: 'Action' })
  ]
});
```

#### Gestion d'état dynamique

Pour mettre à jour un composant dynamiquement :

```javascript
const progressBar = ProgressBar({ value: 0, max: 100 });
// Mise à jour
progressBar.querySelector('.progress-fill').style.width = '75%';
```

## Bonnes pratiques

1. **Toujours utiliser les composants partagés** pour les éléments UI communs
2. **Ne pas dupliquer le code** - si un composant existe, l'utiliser
3. **Respecter l'API** - utiliser les paramètres documentés
4. **Maintenir l'accessibilité** - les composants ont déjà le support ARIA, ne pas le casser
5. **Tester après migration** - vérifier que tout fonctionne comme avant

## Support

Pour toute question ou problème avec les composants, consulter :
- Les fichiers source dans `shared/components/`
- Les exemples d'utilisation dans les outils existants
- Ce document de référence

