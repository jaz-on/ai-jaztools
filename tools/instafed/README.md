<div align="center">

# InstaFed

![Favicon](./favicon.svg)

[![Client-Side](https://img.shields.io/badge/Client--Side-100%25-blue)]() [![Privacy-First](https://img.shields.io/badge/Privacy--First-✓-green)]() [![No Backend](https://img.shields.io/badge/No%20Backend-✓-success)]() [![AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](../../LICENSE)

Outil gratuit et sécurisé pour migrer vos photos Instagram vers Pixelfed. Conversion automatique et respect de la vie privée.

</div>

## Vue d'ensemble

InstaFed est un outil web qui facilite la migration de votre archive Instagram vers Pixelfed. Tous les traitements se font localement dans votre navigateur, garantissant une confidentialité totale. L'outil gère automatiquement les corrections nécessaires (captions vides, optimisation de la structure, nettoyage des métadonnées) pour une migration fluide.

**Public cible** : Utilisateurs souhaitant migrer leur contenu Instagram vers le Fediverse (Pixelfed) tout en conservant leur vie privée.

## Fonctionnalités

- **Confidentialité totale** : Traitement local uniquement, aucune donnée ne quitte votre appareil
- **Corrections automatiques** : Gestion des captions vides, optimisation de la structure, nettoyage des métadonnées
- **Interface intuitive** : Processus étape par étape avec retour en temps réel
- **Universalité** : Fonctionne sur tous les navigateurs modernes, aucune installation requise
- **Accessibilité** : Navigation complète au clavier, support des lecteurs d'écran, indicateurs visuels

## Utilisation

### Prérequis

- Navigateur moderne (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- Archive Instagram au format JSON (téléchargeable depuis les paramètres Instagram)

### Démarrage rapide

1. **Obtenir l'archive Instagram** : Paramètres → Confidentialité et sécurité → Télécharger vos informations (format JSON)
2. **Convertir** : Ouvrez `index.html`, déposez votre archive, suivez les étapes
3. **Importer** : Téléversez l'archive convertie sur votre serveur Pixelfed choisi

### Guide d'utilisation

1. Téléchargez votre archive Instagram depuis les paramètres de votre compte
2. Ouvrez l'application InstaFed dans votre navigateur
3. Déposez le fichier ZIP de votre archive Instagram
4. L'outil analyse et convertit automatiquement les données
5. Téléchargez l'archive convertie
6. Importez-la dans votre instance Pixelfed

## Architecture

### Stack technique

- **Frontend** : HTML5, CSS3, JavaScript vanilla (ES6+)
- **Design System** : `../../shared/design-system/`
- **Composants** : `../../shared/components/` (si utilisés)
- **Backend** : Aucun
- **Dépendances** : JSZip (bibliothèque cliente pour la manipulation d'archives ZIP)
- **Build** : Aucun

### Structure des fichiers

```
instafed/
├── index.html          # Page principale
├── app.js              # Logique principale (modules ES6)
├── styles.css          # Point d'entrée CSS
├── styles/             # Modules CSS modulaires
│   ├── base.css       # Styles globaux, typographie
│   ├── layout.css     # Structure, système de grille
│   ├── components.css # Composants UI
│   └── icons.css      # Système d'icônes
├── libs/               # Bibliothèques externes
│   └── jszip.min.js   # Manipulation d'archives ZIP
└── README.md           # Ce fichier
```

## Déploiement

Voir [docs/DEPLOYMENT.md](../../docs/DEPLOYMENT.md) pour le guide complet.

## Confidentialité

InstaFed garantit une confidentialité totale :

- **Traitement côté client** : Toutes les opérations se déroulent dans votre navigateur
- **Aucune requête externe** : Aucune donnée n'est envoyée à des serveurs externes
- **Nettoyage automatique** : Les données sont automatiquement supprimées après traitement
- **Code open source** : Le code est auditable et vérifiable

## Contribution

Les contributions sont les bienvenues ! Voir [docs/CONTRIBUTING.md](../../docs/CONTRIBUTING.md).

## Licence

AGPL-3.0 - Voir [LICENSE](../../LICENSE)

## Auteur

[Jason Rouet](https://jasonrouet.com/)
