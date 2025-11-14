# Guide de déploiement Coolify

Ce guide explique comment déployer les outils du monorepo ai-jaztools sur votre VPS via Coolify.

## Prérequis

- VPS avec Coolify installé et configuré
- Accès SSH au serveur
- Variables d'environnement configurées (si nécessaire)

## Structure des outils

Le monorepo contient plusieurs types d'outils :

1. **Outils statiques** (HTML/CSS/JS) : `subscription-organizer`, `instafed`, `urls-to-opml`, `landing`
2. **Outils Node.js** : `favorites-migrator`

## Déploiement des outils statiques

### Subscription Organizer

1. Dans Coolify, créez un nouveau service statique
2. Configurez le chemin : `tools/feed-minitools/subscription-organizer/`
3. Le fichier `coolify.yml` est déjà configuré
4. Déployez

### URLs to OPML

1. Créez un service statique
2. Configurez le chemin : `tools/feed-minitools/urls-to-opml/`
3. Le fichier `coolify.yml` est déjà configuré (application client-side)
4. Déployez

### InstaFed

1. Créez un service statique
2. Configurez le chemin : `tools/instafed/`
3. Déployez

### Landing Page

1. Créez un service statique
2. Configurez le chemin : `landing/`
3. Déployez

## Déploiement des outils Node.js

### Favorites Migrator

1. Créez un service Node.js dans Coolify
2. Configurez le chemin : `tools/feed-minitools/favorites-migrator/`
3. Variables d'environnement à configurer :
   - `NODE_ENV=production`
   - `PORT=3000` (ou le port configuré dans Coolify)
   - Variables spécifiques à l'application (voir README de l'outil)
4. Déployez

## Configuration des domaines

Dans Coolify, configurez les domaines pour chaque service :

- Landing : `tools.votredomaine.com` (ou racine)
- Feed Minitools : `feed-minitools.votredomaine.com` (inclut favorites-migrator, subscription-organizer, urls-to-opml)
- InstaFed : `instafed.votredomaine.com`

## Variables d'environnement communes

Tous les services Node.js partagent :

- `NODE_ENV=production`
- `PORT` : défini automatiquement par Coolify

## Troubleshooting

### Erreur de chemin

Vérifiez que les chemins relatifs dans les fichiers HTML pointent correctement vers `../../shared/design-system/`

### Variables d'environnement manquantes

Vérifiez dans l'interface Coolify que toutes les variables requises sont configurées

### Problèmes de CORS

Pour les outils avec backend, configurez les en-têtes CORS si nécessaire

### Problèmes de build

- Vérifiez les logs de build dans Coolify
- Assurez-vous que toutes les dépendances sont dans `package.json`
- Pour Python, vérifiez `requirements.txt`

## Maintenance

- Les mises à jour se font via Git push
- Coolify redéploie automatiquement si configuré
- Surveillez les logs dans l'interface Coolify

