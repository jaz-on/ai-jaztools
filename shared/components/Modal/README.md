# Composant `Modal`

Composant modale réutilisable, compatible design system feed-minitools.

## API
```js
import Modal from './Modal.js';
const maModal = Modal({ open: true, title: 'Titre', children: 'Contenu', onClose: () => alert('fermé') });
document.body.appendChild(maModal);
```

## Props
- `open` : booléen (affiche ou non la modale)
- `onClose` : fonction appelée à la fermeture
- `title` : titre de la modale
- `children` : contenu de la modale
