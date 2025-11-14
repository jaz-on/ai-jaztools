<div align="center">

# Feed Subscription Organizer

![Favicon](./favicon.svg)

[![Client-Side](https://img.shields.io/badge/Client--Side-100%25-blue)]() [![Privacy-First](https://img.shields.io/badge/Privacy--First-✓-green)]() [![RSS](https://img.shields.io/badge/RSS-Tools-orange)]() [![AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](../../../../LICENSE)

Découvrez vos patterns de lecture et optimisez votre organisation RSS avec cet outil d'analyse intelligent.

</div>

## Vue d'ensemble

Feed Subscription Organizer analyse votre export Feedbin pour vous proposer une organisation optimale de vos flux RSS basée sur vos habitudes de lecture réelles. L'outil détecte automatiquement vos domaines d'expertise, analyse vos articles étoilés et génère des recommandations personnalisées d'organisation avec dossiers thématiques et système de tags.

**Public cible** : Utilisateurs de lecteurs RSS souhaitant optimiser leur organisation d'abonnements basée sur leurs habitudes de lecture réelles.

## Fonctionnalités

- **Analyse intelligente** : Analyse de vos articles étoilés pour identifier vos domaines d'intérêt
- **Détection automatique** : Identification automatique des domaines d'expertise
- **Recommandations personnalisées** : Suggestions d'organisation basées sur vos habitudes réelles
- **Analyse bilingue** : Support français/anglais pour l'analyse de contenu
- **Confidentialité totale** : Analyse locale dans votre navigateur, aucune donnée envoyée

## Utilisation

### Prérequis

- Navigateur moderne avec support JavaScript ES6+
- Export Feedbin au format JSON (fichier `starred.json`)
- Export OPML optionnel (fichier `subscriptions.xml`)

### Démarrage rapide

1. Exportez vos données depuis Feedbin (format JSON)
2. Ouvrez `index.html` dans votre navigateur
3. Déposez le fichier `starred.json` (et optionnellement `subscriptions.xml`)
4. Consultez vos recommandations d'organisation personnalisées

### Guide d'utilisation

1. **Export depuis Feedbin** :
   - Connectez-vous à votre compte Feedbin
   - Exportez vos articles étoilés au format JSON
   - Optionnellement, exportez vos abonnements au format OPML

2. **Analyse** :
   - Ouvrez l'application dans votre navigateur
   - Déposez vos fichiers dans la zone de dépôt
   - L'outil analyse automatiquement vos patterns de lecture

3. **Recommandations** :
   - Consultez les dossiers thématiques proposés
   - Examinez les tags suggérés
   - Adaptez l'organisation selon vos préférences

## Architecture

### Stack technique

- **Frontend** : HTML5, CSS3, JavaScript vanilla (ES6+)
- **Design System** : `../../../shared/design-system/`
- **Composants** : `../../../shared/components/` (si utilisés)
- **Backend** : Aucun
- **Dépendances** : Aucune
- **Build** : Aucun

### Structure des fichiers

```
subscription-organizer/
├── index.html          # Page principale
├── analytics.js        # Logique d'analyse des données
├── styles.css          # Styles spécifiques
├── data-sources/       # Exemples de données
│   ├── starred.json    # Exemple d'articles étoilés
│   └── subscriptions.xml # Exemple d'abonnements OPML
├── favicon.svg         # Icône de l'application
└── README.md           # Ce fichier
```

## Déploiement

Voir [docs/DEPLOYMENT.md](../../../../docs/DEPLOYMENT.md) pour le guide complet.

## Confidentialité

Feed Subscription Organizer garantit une confidentialité totale :

- **Traitement côté client** : Toutes les analyses se déroulent dans votre navigateur
- **Aucune requête externe** : Aucune donnée n'est envoyée à des serveurs
- **Pas de stockage** : Les données ne sont pas stockées, uniquement analysées en mémoire
- **Code open source** : Le code est auditable et vérifiable

## Contribution

Les contributions sont les bienvenues ! Voir [docs/CONTRIBUTING.md](../../../../docs/CONTRIBUTING.md).

## Licence

AGPL-3.0 - Voir [LICENSE](../../../../LICENSE)

## Auteur

[Jason Rouet](https://jasonrouet.com/)
