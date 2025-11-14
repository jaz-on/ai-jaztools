# Composants `Tabs` et `Tab`

Composants d'onglets réutilisables, compatibles design system feed-minitools.

## API
```js
import { Tabs, Tab } from './index.js';
const onglet1 = Tab({ label: 'Onglet 1', children: 'Contenu 1' });
const onglet2 = Tab({ label: 'Onglet 2', children: 'Contenu 2' });
const mesTabs = Tabs({ children: [onglet1, onglet2] });
document.body.appendChild(mesTabs);
```

## Props
- `Tabs` : children (tableau de Tab)
- `Tab` : label (texte), children (contenu)
