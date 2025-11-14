<div align="center">

# Favorites Migrator

![Favicon](./favicon.svg)

[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green)]() [![Backend](https://img.shields.io/badge/Backend-Express-blue)]() [![RSS](https://img.shields.io/badge/RSS-Migration-orange)]() [![AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](../../../../LICENSE)

Interface web moderne et sécurisée pour migrer vos favoris FreshRSS vers Feedbin.

</div>

## Vue d'ensemble

Favorites Migrator est un outil web qui facilite la migration de vos articles favoris depuis FreshRSS vers Feedbin. L'outil utilise l'API Feedbin pour transférer vos favoris de manière sécurisée, avec un algorithme de correspondance intelligent qui identifie automatiquement les articles correspondants. Toutes les opérations sont tracées et vous pouvez suivre l'historique de vos migrations.

**Public cible** : Utilisateurs souhaitant migrer leurs favoris d'un lecteur RSS (FreshRSS) vers un autre (Feedbin) tout en conservant leurs données.

## Fonctionnalités

- **Migration guidée** : Processus étape par étape avec suivi en temps réel
- **Algorithme de correspondance intelligent** : 5 niveaux de correspondance (URL exacte, domaine+chemin, titre exact, titre flou, date+domaine)
- **Interface unifiée** : Navigation par onglets (Migration, Statistiques, Historique, Préférences)
- **Statistiques personnelles** : Suivi de vos migrations et métriques détaillées
- **Export des favoris non migrés** : Génération automatique d'OPML et CSV
- **Sécurité renforcée** : Aucun stockage persistant des mots de passe, authentification en mémoire uniquement
- **Gestion robuste** : Système de retry avec backoff exponentiel, gestion intelligente du rate limiting

## Utilisation

### Prérequis

- Node.js 16+ (pour le serveur)
- Compte Feedbin actif
- Fichier `starred_entries.json` exporté depuis FreshRSS
- Navigateur moderne

### Démarrage rapide

```bash
# Installation des dépendances
npm install

# Configuration des variables d'environnement (optionnel)
cp .env.example .env
# Éditez .env si vous souhaitez modifier les valeurs par défaut

# Lancement de l'interface web
npm start
```

Puis ouvrez votre navigateur sur `http://localhost:3000`

> **Note** : Si le port 3000 est déjà utilisé, l'application tentera automatiquement les ports suivants ou vous pouvez définir la variable d'environnement `PORT`. Consultez le fichier `.env.example` pour la liste complète des variables d'environnement disponibles.

### Guide d'utilisation

1. **Connexion** : Saisissez vos identifiants Feedbin dans l'interface
2. **Analyse** : L'interface analyse automatiquement vos abonnements existants
3. **Import** : Chargez votre fichier FreshRSS (`starred_entries.json`)
4. **Migration** : Lancez la migration avec suivi en temps réel
5. **Vérification** : Consultez les résultats détaillés et les statistiques
6. **Export** : Exportez les favoris non migrés si nécessaire (format OPML ou CSV)

## Architecture

### Stack technique

- **Frontend** : HTML5, CSS3, JavaScript vanilla (ES6+ modules)
- **Design System** : `../../../shared/design-system/`
- **Composants** : `../../../shared/components/` (si utilisés)
- **Backend** : Node.js avec Express
- **Dépendances** : Express, modules Node.js natifs
- **Build** : Aucun

### Structure des fichiers

```
favorites-migrator/
├── index.html          # Page principale (interface à onglets)
├── app.js              # Logique principale côté client
├── modules/            # Modules ES6
│   ├── api.js         # Communication avec l'API Feedbin
│   ├── auth.js        # Gestion de l'authentification
│   ├── migration.js   # Logique de migration
│   ├── ui.js          # Gestion de l'interface utilisateur
│   └── validation.js  # Validation des données
├── data/               # Données persistantes
│   └── migration-history.json # Historique des migrations
├── coolify.yml        # Configuration de déploiement
└── README.md           # Ce fichier
```

## Déploiement

Voir [docs/DEPLOYMENT.md](../../../../docs/DEPLOYMENT.md) pour le guide complet.

### Variables d'environnement

Copiez le fichier `.env.example` en `.env` et configurez les variables suivantes (toutes optionnelles) :

- `PORT` : Port du serveur (défaut: 3000)
- `NODE_ENV` : Environnement d'exécution (`development` ou `production`)

Voir `.env.example` pour plus de détails sur chaque variable.

### Configuration CORS

Si le backend est migré vers Option B (http natif Node.js), utilisez le module CORS standardisé :

```javascript
const { setCorsHeaders, handlePreflight } = require('../../../shared/utils/cors');
const http = require('http');

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  headers: ['Content-Type']
};

const server = http.createServer((req, res) => {
  // Gérer les requêtes preflight (OPTIONS)
  if (handlePreflight(req, res, corsOptions)) {
    return;
  }

  // Configurer les headers CORS pour toutes les réponses
  setCorsHeaders(res, corsOptions);

  // Traiter les autres requêtes...
});
```

Le module CORS standardisé gère automatiquement :
- Les requêtes preflight (OPTIONS)
- Les headers CORS standardisés
- La configuration flexible des origines, méthodes et headers autorisés

Voir `shared/utils/cors.js` pour plus de détails.

## Confidentialité

Favorites Migrator garantit une sécurité et confidentialité maximales :

- **Aucun stockage persistant** : Les mots de passe ne sont jamais stockés
- **Authentification en mémoire** : Les identifiants sont uniquement conservés en mémoire pendant la session
- **Proxy sécurisé** : Communication sécurisée vers l'API Feedbin
- **Code open source** : Le code est auditable et vérifiable
- **Rate limiting** : Protection contre les abus côté serveur
- **Session temporaire** : Les données de session sont automatiquement nettoyées

## Contribution

Les contributions sont les bienvenues ! Voir [docs/CONTRIBUTING.md](../../../../docs/CONTRIBUTING.md).

## Licence

AGPL-3.0 - Voir [LICENSE](../../../../LICENSE)

## Auteur

[Jason Rouet](https://jasonrouet.com/)
