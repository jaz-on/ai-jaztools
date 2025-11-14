# Composant `Loader`

Composant loader réutilisable, compatible design system feed-minitools.

## API
```js
import Loader from './Loader.js';
const monLoader = Loader({ message: 'Chargement en cours...' });
document.body.appendChild(monLoader);
```

## Props
- `message` : message à afficher sous le loader
