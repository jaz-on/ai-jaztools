# Utilitaires partagés

Ce dossier contient des modules utilitaires réutilisables dans tous les outils.

## Modules disponibles

### `messages.js` - Système de messages standardisé

Module centralisé pour afficher des messages utilisateur cohérents dans tous les outils.

#### Utilisation

```javascript
import { showSuccess, showError, showWarning, showInfo } from '../../../shared/utils/messages.js';

// Message de succès (disparaît après 5 secondes)
const successContainer = document.getElementById('success-message');
showSuccess('Opération réussie !', successContainer);

// Message d'erreur (permanent jusqu'à action utilisateur)
const errorContainer = document.getElementById('error-message');
showError('Une erreur est survenue', errorContainer);

// Message d'avertissement (disparaît après 5 secondes)
showWarning('Attention : cette action est irréversible', errorContainer, 8000);

// Message d'information (disparaît après 5 secondes)
showInfo('Traitement en cours...', errorContainer);
```

#### API

- `showMessage(message, type, container, duration)` - Fonction principale
- `showSuccess(message, container, duration = 5000)` - Message de succès
- `showError(message, container, duration = 0)` - Message d'erreur (permanent par défaut)
- `showWarning(message, container, duration = 5000)` - Message d'avertissement
- `showInfo(message, container, duration = 5000)` - Message d'information

#### Types de messages

```javascript
import { MessageType } from '../../../shared/utils/messages.js';

MessageType.SUCCESS  // 'success'
MessageType.ERROR    // 'error'
MessageType.WARNING  // 'warning'
MessageType.INFO     // 'info'
```

#### Caractéristiques

- ✅ Utilise les classes CSS du Design System (`.message.success`, `.message.error`, etc.)
- ✅ Support de l'accessibilité (`role="alert"`)
- ✅ Auto-dismiss configurable (0 = permanent)
- ✅ Gestion automatique de l'affichage/masquage du container
- ✅ Messages en français

#### Structure HTML requise

```html
<!-- Container pour les messages d'erreur -->
<div id="error-message" class="message error hidden"></div>

<!-- Container pour les messages de succès -->
<div id="success-message" class="message success hidden"></div>
```

#### CSS requis

Le module nécessite l'import du Design System :

```html
<link rel="stylesheet" href="../../../shared/design-system/components.css">
```

Les classes CSS utilisées sont définies dans `shared/design-system/components.css` :
- `.message` - Classe de base
- `.message.success` - Message de succès
- `.message.error` - Message d'erreur
- `.message.warning` - Message d'avertissement
- `.message.info` - Message d'information

### `error-handler.js` - Gestion d'erreurs

Module pour créer et logger des erreurs standardisées (côté serveur et client).

### `logger.js` - Système de logging

Module pour le logging structuré.

### `health-check.js` - Vérification de santé

Module pour les vérifications de santé des services.

### `cors.js` - Gestion CORS

Module pour la gestion des en-têtes CORS.

### `security-headers.js` - Headers de sécurité

Module standardisé pour configurer les headers de sécurité dans les serveurs HTTP natifs Node.js.

#### Utilisation

```javascript
const { setSecurityHeaders } = require('../../shared/utils/security-headers.js');

const server = http.createServer((req, res) => {
  // Configurer les headers de sécurité
  setSecurityHeaders(res);

  // Traiter la requête...
});
```

#### Personnalisation

```javascript
// Personnaliser la CSP pour autoriser des images externes
setSecurityHeaders(res, {
  csp: {
    'img-src': ["'self'", 'data:', 'https://example.com'],
    'connect-src': ["'self'", 'https://api.example.com']
  },
  frameOptions: 'SAMEORIGIN' // Si nécessaire
});
```

#### Headers configurés

- `Content-Security-Policy` : Protection contre XSS
- `X-Frame-Options` : Protection contre clickjacking
- `X-Content-Type-Options` : Empêche le MIME sniffing
- `Referrer-Policy` : Contrôle les informations de referrer
- `Permissions-Policy` : Contrôle les fonctionnalités du navigateur

Voir `docs/SECURITY.md` pour la documentation complète.

