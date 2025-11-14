# Composant `Button`

Composant bouton réutilisable, compatible design system feed-minitools.

## API

```js
import Button from './Button.js';

const btn = Button({
  variant: 'primary', // 'primary', 'secondary', 'success', 'error', 'warning'
  size: 'md',        // 'sm', 'md', 'lg'
  disabled: false,   // true ou false
  onClick: () => alert('Clic !'),
  children: 'Démarrer la migration'
});
document.body.appendChild(btn);
```

## Props
- `variant` : style du bouton (par défaut : 'primary')
- `size` : taille du bouton (par défaut : 'md')
- `disabled` : désactive le bouton
- `onClick` : fonction appelée au clic
- `children` : texte ou nœud DOM à afficher dans le bouton

## Exemple HTML

```html
<!-- Inclure le CSS dans votre page -->
<link rel="stylesheet" href="components/Button/Button.css">
```

## Exemple d'intégration dans un projet vanilla JS

```js
import Button from './components/Button/Button.js';

const monBouton = Button({
  variant: 'success',
  size: 'lg',
  children: 'Valider',
  onClick: () => alert('Validé !')
});
document.getElementById('zone-actions').appendChild(monBouton);
``` 