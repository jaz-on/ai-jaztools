# Composants `List` et `ListItem`

Composants de liste réutilisables, compatibles design system feed-minitools.

## API
```js
import { List, ListItem } from './index.js';
const item1 = ListItem({ children: 'Élément 1' });
const item2 = ListItem({ children: 'Élément 2' });
const maListe = List({ children: [item1, item2] });
document.body.appendChild(maListe);
```

## Props
- `List` : children (tableau de ListItem)
- `ListItem` : children (contenu)
