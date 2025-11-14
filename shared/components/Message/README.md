# Composant `Message`

Composant message réutilisable, compatible design system feed-minitools.

## API
```js
import Message from './Message.js';
const monMessage = Message({ type: 'success', children: 'Opération réussie !' });
document.body.appendChild(monMessage);
```

## Props
- `type` : type du message (success, error, warning, info)
- `children` : contenu du message
