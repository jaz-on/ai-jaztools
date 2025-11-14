# Guide de Logging Standardisé

## Vue d'ensemble

Ce guide documente l'utilisation du module de logging standardisé (`shared/utils/logger.js`) pour tous les backends Option B du projet. Ce module fournit un format de logs cohérent, des niveaux configurables et une gestion automatique des environnements de développement et production.

## Installation

Le module est déjà disponible dans `shared/utils/logger.js`. Pour l'utiliser dans un backend, importez-le avec le chemin relatif approprié :

### Depuis `tools/tool-name/`
```javascript
import { info, warn, error, debug } from '../../shared/utils/logger.js';
```

### Depuis `tools/feed-minitools/tool-name/`
```javascript
import { info, warn, error, debug } from '../../../shared/utils/logger.js';
```

## Utilisation de base

### Fonctions disponibles

Le module exporte quatre fonctions de logging :

- **`info(message, data?)`** : Logs d'information générale
- **`warn(message, data?)`** : Avertissements
- **`error(message, data?)`** : Erreurs
- **`debug(message, data?)`** : Détails de débogage

### Exemples d'utilisation

```javascript
import { info, warn, error, debug } from '../../shared/utils/logger.js';

// Log simple
info('Server started');

// Log avec données additionnelles
info('Server started', { port: 3000, host: '0.0.0.0' });

// Avertissement
warn('Rate limit approaching', { remaining: 10, limit: 100 });

// Erreur
error('API request failed', { 
  statusCode: 500, 
  url: '/api/data',
  error: error.message 
});

// Debug (visible uniquement si LOG_LEVEL=debug)
debug('Request received', { 
  method: 'GET', 
  url: '/api/health',
  headers: req.headers 
});
```

## Format des logs

Tous les logs suivent un format standardisé :

```
[TIMESTAMP_ISO8601] [LEVEL] message {data}
```

### Exemples de sortie

```
[2024-01-15T10:30:45.123Z] [INFO] Server started on port 3000
[2024-01-15T10:30:46.456Z] [WARN] Rate limit approaching {"remaining":10,"limit":100}
[2024-01-15T10:30:47.789Z] [ERROR] API request failed {"statusCode":500,"url":"/api/data"}
[2024-01-15T10:30:48.012Z] [DEBUG] Request details {"method":"GET","url":"/api/health"}
```

### Caractéristiques du format

- **Timestamp** : Format ISO 8601 (UTC) avec millisecondes
- **Niveau** : Toujours en majuscules (INFO, WARN, ERROR, DEBUG)
- **Message** : Texte descriptif du log
- **Données** : Objet JSON sérialisé (optionnel)

## Niveaux de log

Le module supporte quatre niveaux de log, ordonnés par priorité :

| Niveau | Valeur | Usage | Exemple |
|--------|--------|-------|---------|
| **DEBUG** | 0 | Détails de débogage (développement uniquement) | Détails de requêtes, états internes |
| **INFO** | 1 | Informations générales | Démarrage serveur, requêtes normales |
| **WARN** | 2 | Avertissements | Rate limiting, dépréciations, requêtes suspectes |
| **ERROR** | 3 | Erreurs critiques | Exceptions, échecs d'API, erreurs système |

### Hiérarchie des niveaux

Quand un niveau est sélectionné, tous les niveaux supérieurs (plus prioritaires) sont également affichés :

- `debug` → Affiche DEBUG, INFO, WARN, ERROR
- `info` → Affiche INFO, WARN, ERROR
- `warn` → Affiche WARN, ERROR
- `error` → Affiche uniquement ERROR

## Configuration

### Variable d'environnement LOG_LEVEL

Le niveau de log est configuré via la variable d'environnement `LOG_LEVEL` :

```bash
# Développement - tous les logs
LOG_LEVEL=debug

# Production - seulement erreurs et avertissements
LOG_LEVEL=warn

# Production - seulement erreurs
LOG_LEVEL=error

# Par défaut (développement)
LOG_LEVEL=info
```

### Comportement par défaut

Le module détermine automatiquement le niveau de log selon l'environnement :

- **Production** (`NODE_ENV=production`) : Niveau `ERROR` par défaut
  - Seules les erreurs sont loggées
  - Sauf si `LOG_LEVEL` est explicitement défini
  
- **Développement** (autre) : Niveau `INFO` par défaut
  - Logs INFO, WARN et ERROR
  - Sauf si `LOG_LEVEL` est explicitement défini

### Configuration dans .env

Ajoutez `LOG_LEVEL` dans votre fichier `.env` :

```bash
# .env
NODE_ENV=development
LOG_LEVEL=info
PORT=3000
```

Pour le développement avec logs détaillés :

```bash
# .env
NODE_ENV=development
LOG_LEVEL=debug
PORT=3000
```

Pour la production (seulement erreurs) :

```bash
# .env
NODE_ENV=production
LOG_LEVEL=error
PORT=3000
```

## Bonnes pratiques

### Quand utiliser chaque niveau

#### DEBUG
- Détails de requêtes HTTP (headers, body)
- États internes de l'application
- Informations de débogage temporaires
- **Ne jamais utiliser en production** (sauf si LOG_LEVEL=debug explicitement)

```javascript
debug('Request received', { 
  method: req.method, 
  url: req.url,
  headers: req.headers 
});
```

#### INFO
- Démarrage/arrêt du serveur
- Requêtes normales traitées avec succès
- Événements importants de l'application
- Métriques générales

```javascript
info('Server started', { port: 3000 });
info('Request processed', { 
  method: 'GET', 
  url: '/api/health',
  statusCode: 200 
});
```

#### WARN
- Rate limiting approchant
- Requêtes suspectes mais non bloquantes
- Dépréciations de fonctionnalités
- Conditions anormales mais récupérables

```javascript
warn('Rate limit approaching', { 
  remaining: 10, 
  limit: 100 
});
warn('Deprecated endpoint used', { 
  endpoint: '/api/v1/data',
  alternative: '/api/v2/data' 
});
```

#### ERROR
- Erreurs d'API externes
- Exceptions non gérées
- Échecs critiques de l'application
- Erreurs de validation bloquantes

```javascript
error('API request failed', { 
  statusCode: 500,
  url: '/api/data',
  error: error.message 
});
error('Database connection failed', { 
  error: error.message,
  retries: 3 
});
```

### Données additionnelles

Toujours inclure des données contextuelles pertinentes :

```javascript
// ✅ Bon
error('API request failed', { 
  statusCode: 500,
  url: '/api/data',
  method: 'POST',
  error: error.message 
});

// ❌ Moins utile
error('API request failed');
```

### Messages descriptifs

Utiliser des messages clairs et actionnables :

```javascript
// ✅ Bon
info('Server started successfully', { port: 3000 });
warn('Rate limit will be reached soon', { remaining: 10 });

// ❌ Moins clair
info('Started');
warn('Limit');
```

## Intégration dans un backend

> **Exemple complet** : Voir `docs/EXAMPLE-SERVER.js` pour un serveur complet avec intégration du logger.

### Exemple de base

```javascript
import http from 'http';
import { info, warn, error, debug } from '../../shared/utils/logger.js';
import { createHealthCheck } from '../../shared/utils/health-check.js';

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const healthCheck = createHealthCheck('mon-service', '1.0.0');

const server = http.createServer((req, res) => {
  debug('Request received', { 
    method: req.method, 
    url: req.url 
  });

  if (req.url === '/api/health' && req.method === 'GET') {
    healthCheck(req, res);
    info('Health check requested');
    return;
  }

  // Autres routes...
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, HOST, () => {
  info('Server started', { 
    port: PORT, 
    host: HOST,
    environment: process.env.NODE_ENV || 'development' 
  });
});

server.on('error', (err) => {
  error('Server error', { 
    error: err.message,
    code: err.code 
  });
});
```

## Migration depuis console.log

### Avant (console.log)

```javascript
console.log('Server started on port', PORT);
console.error('Error:', error);
console.warn('Warning: Rate limit');
```

### Après (logger standardisé)

```javascript
import { info, error, warn } from '../../shared/utils/logger.js';

info('Server started', { port: PORT });
error('Error occurred', { error: error.message });
warn('Rate limit approaching', { remaining: 10 });
```

## Compatibilité

- **Node.js** : 16+ (modules ES6)
- **Environnements** : Développement et production
- **Dépendances** : Aucune (Node.js natif uniquement)
- **Format** : Compatible avec les outils de monitoring (Coolify, logs systèmes)

## Dépannage

### Les logs ne s'affichent pas

1. Vérifiez que `LOG_LEVEL` est correctement configuré
2. Vérifiez que le niveau de log est suffisant (ex: `debug` pour voir les logs DEBUG)
3. En production, seuls les logs ERROR sont affichés par défaut

### Trop de logs en production

1. Assurez-vous que `NODE_ENV=production` est défini
2. Vérifiez que `LOG_LEVEL` n'est pas défini à `debug` ou `info`
3. Le niveau par défaut en production est `ERROR` (seulement les erreurs)

### Format de timestamp incorrect

Le format ISO 8601 est automatique. Si vous voyez un format différent, vérifiez que vous utilisez bien le module `shared/utils/logger.js` et non `console.log` directement.

## Références

- Module : `shared/utils/logger.js`
- Format timestamp : [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)
- Variables d'environnement : Voir `.env.example` de chaque backend

