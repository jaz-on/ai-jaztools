# Composants `ProgressBar` et `ProgressContainer`

Composants de progression réutilisables, compatibles design system feed-minitools.

## API
```js
import { ProgressBar, ProgressContainer } from './index.js';
const bar = ProgressBar({ value: 60, max: 100 });
const container = ProgressContainer({ children: [bar, '60 % terminé'] });
document.body.appendChild(container);
```

## Props
- `ProgressBar` : value (nombre), max (nombre)
- `ProgressContainer` : children (contenu)
