# Composant `Grid`

Composant grille réutilisable, compatible design system feed-minitools.

## API
```js
import Grid from './Grid.js';
const maGrid = Grid({ columns: 3, children: [elt1, elt2, elt3] });
document.body.appendChild(maGrid);
```

## Props
- `columns` : nombre de colonnes
- `children` : éléments à afficher dans la grille (tableau de nœuds DOM)
