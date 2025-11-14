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

### ![Feed Minitools](./tools/feed-minitools/favicon.svg) Feed Minitools
Suite d'outils pour gérer, migrer et organiser vos flux RSS et favoris.
- ![Favorites Migrator](./tools/feed-minitools/favorites-migrator/favicon.svg) **Favorites Migrator** : Migration de favoris entre plateformes RSS
- ![Subscription Organizer](./tools/feed-minitools/subscription-organizer/favicon.svg) **Subscription Organizer** : Organisation et analyse d'abonnements RSS
- ![URLs to OPML](./tools/feed-minitools/urls-to-opml/favicon.svg) **URLs to OPML** : Conversion d'URLs en fichier OPML avec détection automatique des flux

[Accéder à Feed Minitools](./tools/feed-minitools/index.html)

### ![InstaFed](./tools/instafed/favicon.svg) InstaFed
Outil gratuit pour migrer vos photos Instagram vers Pixelfed. Conversion automatique et respect de la vie privée. Traitement 100% côté client pour une confidentialité maximale.

[Accéder à InstaFed](./tools/instafed/index.html)

## Structure du projet

```
ai-jaztools/
├── shared/              # Ressources communes
│   ├── design-system/  # Design system unifié (CSS)
│   ├── components/     # Composants JavaScript réutilisables
│   ├── assets/         # Assets communs (favicons, etc.)
│   └── utils/          # Utilitaires JavaScript partagés
├── tools/               # Tous les outils
│   ├── feed-minitools/  # Suite d'outils RSS
│   │   ├── favorites-migrator/  # Migration de favoris RSS
│   │   ├── subscription-organizer/  # Organisation d'abonnements RSS
│   │   └── urls-to-opml/  # Conversion URLs vers OPML
│   └── instafed/       # Migration Instagram vers Pixelfed
├── landing/             # Landing page principale
├── docs/                # Documentation
└── scripts/             # Scripts utilitaires (génération favicons, etc.)
```

**Structure standardisée des outils** (Option A) :
- `index.html` : Page principale
- `app.js` : Logique JavaScript principale (modules ES6)
- `modules/` : Modules JavaScript séparés (si nécessaire)
- `styles.css` : Styles locaux (optionnel si Design System suffisant)
- `README.md` : Documentation de l'outil

> **Note** : `ai-starter-kit/` est un outil de développement qui fournit des templates et configurations pour les IDEs (Cursor, VS Code, Windsurf). Il n'est pas déployé avec les outils finaux.

## Quick Start

### Développement local

1. Clonez le repository
2. Ouvrez les fichiers HTML directement dans votre navigateur (pas de build nécessaire)
3. Tous les outils sont statiques et fonctionnent sans serveur backend
4. Pour plus de détails sur un outil spécifique, consultez son README dans `tools/[nom-outil]/README.md`

### Déploiement

Voir [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) pour le guide complet de déploiement sur Coolify. Tous les outils sont déployés en tant que services statiques (pas de build, déploiement direct).

## Documentation

### Guides principaux

- [Guide de déploiement](./docs/DEPLOYMENT.md) - Déploiement sur Coolify
- [Design System](./docs/DESIGN-SYSTEM.md) - Documentation du design system
- [Plan d'harmonisation](./docs/PLAN-HARMONISATION.md) - Stack technique et conventions
- [Accessibilité](./docs/ACCESSIBILITY.md) - Guide d'accessibilité
- [Performance](./docs/PERFORMANCE.md) - Optimisations et bonnes pratiques
- [Logging](./docs/LOGGING.md) - Gestion des logs
- [Politique de Licence](./docs/LICENSING.md) - Licence AGPL-3.0 et compatibilité des dépendances

### Templates

- [Template README](./docs/TEMPLATE-README.md) - Template pour la documentation des outils
- [Template variables d'environnement](./docs/TEMPLATE-ENV.md) - Template pour les fichiers .env
- [Template HTML accessible](./docs/TEMPLATE-ACCESSIBLE.html) - Template HTML avec accessibilité

### À venir

- [Architecture](./docs/ARCHITECTURE.md) - Architecture du monorepo (à venir)
- [Contributing](./docs/CONTRIBUTING.md) - Guide de contribution (à venir)

## Design System

Tous les outils utilisent un design system unifié situé dans `shared/design-system/` et des composants JavaScript réutilisables dans `shared/components/`. Voir [docs/DESIGN-SYSTEM.md](./docs/DESIGN-SYSTEM.md) pour la documentation complète.

## Technologies

- **Frontend** : HTML5, CSS3, JavaScript vanilla (ES6+ modules)
- **Stack** : Option A (vanilla JS pur, traitement 100% côté client)
- **Design System** : CSS partagé dans `shared/design-system/`
- **Composants** : Modules JavaScript réutilisables dans `shared/components/`
- **Déploiement** : Coolify sur VPS (déploiement direct, pas de build)
- **Dépendances** : Aucune (ou minimales si nécessaire, tout en local)

## Contribution

Les contributions sont les bienvenues ! Voir [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md) pour les guidelines.

## Licence

**AGPL-3.0** - Voir le fichier [LICENSE](./LICENSE) pour le texte complet de la licence.

Ce projet est distribué sous la licence GNU Affero General Public License version 3. Pour plus d'informations sur la politique de licence et la compatibilité des dépendances, consultez [docs/LICENSING.md](./docs/LICENSING.md).

## Auteur

[Jason Rouet](https://jasonrouet.com/)

---

**Note** : Ces outils sont développés rapidement pour répondre à des besoins ponctuels. Ils peuvent évoluer ou être remplacés selon les besoins.

