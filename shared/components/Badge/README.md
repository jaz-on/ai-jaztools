# Composant `Badge`

Composant badge réutilisable, compatible design system feed-minitools.

## API
```js
import Badge from './Badge.js';
const monBadge = Badge({ variant: 'success', children: 'Nouveau' });
document.body.appendChild(monBadge);
```

## Props
- `variant` : style du badge (primary, success, error, warning, gray)
- `children` : contenu du badge
