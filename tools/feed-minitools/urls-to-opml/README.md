<div align="center">

# URLs to OPML

![Favicon](./favicon.svg)

[![Client-Side](https://img.shields.io/badge/Client--Side-100%25-blue)]() [![Privacy-First](https://img.shields.io/badge/Privacy--First-✓-green)]() [![RSS](https://img.shields.io/badge/RSS-OPML-orange)]() [![AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](../../../../LICENSE)

Convertit une liste d'URLs de sites web en format OPML en détectant automatiquement leurs flux RSS/Atom.

</div>

## Vue d'ensemble

URLs to OPML est un outil web client-side qui convertit une liste d'URLs de sites web en fichier OPML en détectant automatiquement leurs flux RSS/Atom. L'outil traite les URLs en lot, valide les flux en temps réel et génère un fichier OPML prêt à être importé dans votre lecteur RSS. Tous les traitements se déroulent dans votre navigateur, garantissant une confidentialité totale.

**Public cible** : Utilisateurs souhaitant créer rapidement un fichier OPML à partir d'une liste d'URLs de sites web pour importer dans leur lecteur RSS.

## Fonctionnalités

- **Traitement en lot** : Traitement de plusieurs URLs simultanément
- **Détection automatique** : Détection automatique des flux RSS/Atom pour chaque site
- **Validation en temps réel** : Validation des flux détectés avant génération
- **Génération OPML** : Génération de fichiers OPML standards
- **Confidentialité totale** : Traitement côté client uniquement, aucune donnée envoyée
- **Interface moderne** : Interface responsive et accessible
- **Fonctionne hors ligne** : Fonctionne après le chargement initial

## Utilisation

### Prérequis

- Navigateur moderne avec support JavaScript ES6+
- Connexion internet (pour la détection des flux)

### Démarrage rapide

1. Ouvrez `index.html` dans votre navigateur ou servez-le depuis un serveur web
2. Entrez vos URLs (une par ligne)
3. Cliquez sur "Find Feeds" pour détecter les flux
4. Téléchargez le fichier OPML généré
5. Importez-le dans votre lecteur RSS

### Guide d'utilisation

1. **Préparation** : Rassemblez les URLs des sites web dont vous souhaitez suivre les flux
2. **Saisie** : Entrez les URLs dans le champ texte (une par ligne)
3. **Détection** : Cliquez sur "Find Feeds" - l'outil va :
   - Récupérer chaque site web
   - Parser le HTML pour trouver les liens de flux
   - Vérifier les chemins communs (`/feed`, `/rss`, etc.)
   - Valider les formats de flux (RSS/Atom)
4. **Téléchargement** : Téléchargez le fichier OPML généré
5. **Import** : Importez le fichier OPML dans votre lecteur RSS préféré

## Architecture

### Stack technique

- **Frontend** : HTML5, CSS3, JavaScript vanilla (ES6+ modules)
- **Design System** : `../../../shared/design-system/`
- **Composants** : `../../../shared/components/` (si utilisés)
- **Backend** : Aucun
- **Dépendances** : Aucune
- **Build** : Aucun

### Structure des fichiers

```
urls-to-opml/
├── index.html          # Page principale
├── app.js              # Logique principale (modules ES6)
├── modules/            # Modules ES6
│   ├── feedParser.js  # Parser pour détecter les flux RSS/Atom
│   └── opmlGenerator.js # Générateur de fichiers OPML
├── docs/               # Documentation supplémentaire
│   ├── USER_GUIDE.md  # Guide d'utilisation détaillé
│   ├── SETUP.md       # Guide de configuration
│   ├── DEPLOYMENT.md  # Guide de déploiement
│   ├── SECURITY.md    # Informations de sécurité
│   └── MONITORING.md  # Guide de monitoring
├── coolify.yml        # Configuration de déploiement
└── README.md           # Ce fichier
```

## Déploiement

Voir [docs/DEPLOYMENT.md](../../../../docs/DEPLOYMENT.md) pour le guide complet.

### Variables d'environnement

> **Note** : Cet outil fonctionne actuellement en mode client-side (Option A) et ne nécessite pas de variables d'environnement. Un fichier `.env.example` est disponible pour une éventuelle migration vers Option B (avec backend).

Si un backend est ajouté à l'avenir, consultez `.env.example` pour la configuration des variables d'environnement.

### Configuration CORS (Option B - Futur)

Si un backend Option B (http natif Node.js) est ajouté à l'avenir, utilisez le module CORS standardisé :

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

URLs to OPML garantit une confidentialité totale :

- **100% côté client** : Tous les traitements se déroulent dans votre navigateur
- **Aucune collecte de données** : Aucune donnée n'est envoyée à des serveurs
- **Aucun tracking** : Aucun script d'analyse ou de suivi
- **Gestion CORS** : Utilise le CORS du navigateur pour la détection de flux
- **Code open source** : Le code est auditable et vérifiable

## Contribution

Les contributions sont les bienvenues ! Voir [docs/CONTRIBUTING.md](../../../../docs/CONTRIBUTING.md).

## Licence

AGPL-3.0 - Voir [LICENSE](../../../../LICENSE)

## Auteur

[Jason Rouet](https://jasonrouet.com/)
