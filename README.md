# AI JazTools

![Favicon](./shared/assets/favicon.svg)

Collection de mini outils développés rapidement pour répondre à des besoins temporaires et ponctuels. Ces outils partagent une nomenclature commune, une cohérence de code/stack, CSS et nommage pour être maintenus en commun.

## Vue d'ensemble

Ce monorepo regroupe plusieurs mini outils qui sont soit :
- Des méthodes d'utilisation d'IA pour des mini projets
- Des mini projets générés via IA

Tous les outils partagent :
- Un design system unifié
- Une nomenclature cohérente
- Une stack technique standardisée
- Un déploiement via Coolify sur VPS

## Outils disponibles

### Feed Minitools
Suite d'outils pour gérer, migrer et organiser vos flux RSS et favoris.
- **Favorites Migrator** : Migration de favoris entre plateformes RSS
- **Subscription Organizer** : Organisation et analyse d'abonnements RSS
- **URLs to OPML** : Conversion d'URLs en fichier OPML avec détection automatique des flux

[Accéder à Feed Minitools](./tools/feed-minitools/index.html)

### InstaFed
Outil gratuit pour migrer vos photos Instagram vers Pixelfed. Conversion automatique et respect de la vie privée.

[Accéder à InstaFed](./tools/instafed/index.html)

### Podcast Analyzer
Analyse automatique de podcasts WordPress avec IA. Extraction de points clés, citations et ressources.

[Accéder à Podcast Analyzer](./tools/podcast-analyzer/index.html)

### URLs to OPML
Convertit une liste d'URLs de sites web en format OPML en détectant automatiquement leurs flux RSS/Atom.

**Note** : Cet outil fait partie de la suite Feed Minitools.

[Accéder à URLs to OPML](./tools/feed-minitools/urls-to-opml/index.html)

## Structure du projet

```
ai-jaztools/
├── shared/              # Ressources communes
│   ├── design-system/  # Design system unifié (CSS)
│   ├── components/     # Composants JavaScript réutilisables
│   └── assets/          # Assets communs (favicons, etc.)
├── tools/               # Tous les outils
│   ├── feed-minitools/  # Suite d'outils RSS (favorites-migrator, subscription-organizer, urls-to-opml)
│   ├── instafed/
│   └── podcast-analyzer/
├── landing/             # Landing page principale
├── docs/                # Documentation
└── ai-starter-kit/      # Outil de développement (templates et configs pour IDEs)
```

> **Note** : `ai-starter-kit/` est un outil de développement qui fournit des templates et configurations pour les IDEs (Cursor, VS Code, Windsurf). Il n'est pas déployé avec les outils finaux.

## Quick Start

### Développement local

1. Clonez le repository
2. Ouvrez les fichiers HTML directement dans votre navigateur
3. Pour les outils avec backend, consultez leur README spécifique

### Déploiement

Voir [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) pour le guide complet de déploiement sur Coolify.

## Documentation

- [Guide de déploiement](./docs/DEPLOYMENT.md) - Déploiement sur Coolify
- [Design System](./docs/DESIGN-SYSTEM.md) - Documentation du design system
- [Politique de Licence](./docs/LICENSING.md) - Licence AGPL-3.0 et compatibilité des dépendances
- [Architecture](./docs/ARCHITECTURE.md) - Architecture du monorepo (à venir)
- [Contributing](./docs/CONTRIBUTING.md) - Guide de contribution (à venir)

## Design System

Tous les outils utilisent un design system unifié situé dans `shared/design-system/` et des composants JavaScript réutilisables dans `shared/components/`. Voir [docs/DESIGN-SYSTEM.md](./docs/DESIGN-SYSTEM.md) pour la documentation complète.

## Technologies

- **Frontend** : HTML, CSS, JavaScript vanilla
- **Backend** : Node.js (Express), Python
- **Frameworks** : React (podcast-analyzer via CDN)
- **Déploiement** : Coolify sur VPS

## Contribution

Les contributions sont les bienvenues ! Voir [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md) pour les guidelines.

## Licence

**AGPL-3.0** - Voir le fichier [LICENSE](./LICENSE) pour le texte complet de la licence.

Ce projet est distribué sous la licence GNU Affero General Public License version 3. Pour plus d'informations sur la politique de licence et la compatibilité des dépendances, consultez [docs/LICENSING.md](./docs/LICENSING.md).

## Auteur

[Jason Rouet](https://jasonrouet.com/)

---

**Note** : Ces outils sont développés rapidement pour répondre à des besoins ponctuels. Ils peuvent évoluer ou être remplacés selon les besoins.

