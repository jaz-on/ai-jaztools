# Composant `Footer`

Composant footer réutilisable, compatible design system feed-minitools.

## API
```js
import Footer from './Footer.js';
const monFooter = Footer({ children: 'Un mini-projet de Jason Rouet' });
document.body.appendChild(monFooter);
```

## Props
- `children` : contenu du footer (texte, nœud DOM ou tableau)
