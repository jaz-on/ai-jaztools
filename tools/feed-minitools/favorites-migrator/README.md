# Feed Minitools - Favorites Migrator

![Favicon](./favicon.svg)

Interface web moderne et sécurisée pour migrer vos favoris FreshRSS vers Feedbin.

## 🚀 Démarrage rapide

```bash
# Installation
npm install

# Lancement de l'interface web
npm start
```

Puis ouvrez votre navigateur sur `http://localhost:3000`

> **Note :** Si le port 3000 est déjà utilisé, l'application tentera automatiquement les ports suivants ou vous pouvez définir la variable d'environnement `PORT`.

## ✨ Fonctionnalités

### 🔐 Sécurité renforcée
- **Aucun stockage persistant** des mots de passe
- **Authentification en mémoire** uniquement
- **Proxy sécurisé** vers l'API Feedbin
- **Code open source** auditable
- **Rate limiting** pour protéger contre les abus

### 🎯 Interface unifiée moderne
- **Interface à onglets** : Migration, statistiques, historique, préférences
- **Navigation intuitive** : Un seul point d'entrée pour toutes les fonctionnalités
- **Statistiques personnelles** : Suivi de vos migrations et métriques
- **Configuration avancée** : Préférences personnalisables
- **Fonctionnalités admin** : Gestion globale (si autorisé)

### 🔄 Processus de migration guidé
1. **Connexion** : Saisissez vos identifiants Feedbin
2. **Analyse** : L'interface analyse vos abonnements existants
3. **Import** : Chargez votre fichier FreshRSS (`starred_entries.json`)
4. **Migration** : Lancez la migration avec suivi en temps réel
5. **Vérification** : Consultez les résultats détaillés
6. **Export** : Exportez les favoris non migrés si nécessaire

### 🆕 Nouvelles fonctionnalités (v2.1.0)

#### 🎨 Interface unifiée
- **Navigation par onglets** : Migration, statistiques, historique, préférences, administration
- **Statistiques personnelles** : Métriques de vos migrations
- **Historique détaillé** : Suivi chronologique de vos migrations
- **Préférences utilisateur** : Configuration personnalisable
- **Fonctionnalités admin** : Gestion globale (si autorisé)

#### 📊 Tableau de bord personnel
- **Mes statistiques** : Nombre de migrations, favoris traités, taux de réussite
- **Mon historique** : Liste chronologique avec filtrage par période
- **Mes préférences** : Configuration migration et notifications
- **Export personnel** : Téléchargement de vos données

#### ⚙️ Configuration avancée
- **Paramètres migration** : Tentatives max, taille des lots, seuil de correspondance
- **Notifications** : Email, navigateur, rapports détaillés
- **Préférences d'interface** : Thème, accessibilité
- **Sauvegarde automatique** des préférences

#### 📄 Export des favoris non migrés
- **Génération automatique d'OPML** pour les feeds manquants
- **Export CSV détaillé** de tous les favoris non migrés
- **Analyse des échecs** par source avec statistiques
- **Instructions guidées** pour améliorer le taux de réussite

#### 🎯 Algorithme de correspondance amélioré
- **5 niveaux de correspondance** : URL exacte, domaine+chemin, titre exact, titre flou, date+domaine
- **Correspondance floue** par similarité de titre (algorithme Levenshtein)
- **Correspondance par date** dans une fenêtre de ±3 jours
- **Indicateurs de méthode** pour chaque correspondance trouvée

#### 🛡️ Robustesse améliorée
- **Système de retry** avec backoff exponentiel
- **Gestion intelligente du rate limiting** de l'API Feedbin
- **Gestion d'erreurs catégorisée** avec messages clairs
- **Timeouts configurables** pour les requêtes API

## 📁 Structure du projet

```
feed-minitools-favorites-migrator/
├── server.js              # Serveur Express principal
├── public/                # Interface web unifiée
│   ├── index.html         # Interface à onglets
│   ├── style.css          # Styles complets (interface + admin)
│   └── app.js            # Logique complète (migration + admin)
├── utils/                 # Utilitaires
│   ├── history.js        # Gestion de l'historique
│   └── logger.js         # Système de logging
├── config/               # Configuration
│   └── default.json      # Paramètres par défaut
├── data/                 # Données persistantes
├── legacy/               # Anciens scripts (obsolètes)
│   ├── README.md         # Documentation legacy
│   └── *.js             # Scripts remplacés
├── package.json          # Dépendances Node.js
├── README.md            # Ce fichier
├── AUDIT-SUMMARY.md     # Résumé d'audit
├── CODING-STANDARDS.md  # Standards de code
├── TASK-TRACKER.md      # Suivi des tâches
├── REFACTORING-PLAN.md  # Plan de refactoring
└── debug-migration.js   # Script de débogage
```

## 🎯 Interface unifiée

### Onglets disponibles

#### 🚀 **Migration**
- Processus guidé en 4 étapes
- Upload et analyse des fichiers FreshRSS
- Migration en temps réel avec barre de progression
- Gestion des échecs et rapports détaillés

#### 📊 **Mon activité**
- **Vue d'ensemble** : Statistiques consolidées (migrations, favoris, taux de réussite)
- **Historique détaillé** : Liste chronologique avec filtrage par période
- **Export unifié** : Données complètes en un seul fichier
- **Interface optimisée** : Navigation simplifiée et intuitive

#### ⚙️ **Mes préférences**
- Configuration migration (tentatives, lots, correspondance)
- Notifications (email, navigateur, rapports)
- Sauvegarde automatique des préférences

#### 🔧 **Administration** (admin uniquement)
- Statistiques globales
- Gestion des logs
- Export des données
- Configuration système

## 🔧 Configuration

### Prérequis
- Node.js 16+ 
- Compte Feedbin actif
- Fichier `starred_entries.json` exporté depuis FreshRSS

### Variables d'environnement (optionnel)
```bash
# Port du serveur (défaut: 3000)
PORT=3000

# Mode développement
NODE_ENV=development
```

### Scripts disponibles
```bash
# Démarrage en production
npm start

# Démarrage en développement (avec rechargement automatique)
npm run dev

# Tests
npm test

# Tests en mode watch
npm run test:watch

# Linting
npm run lint

# Nettoyage des données
npm run cleanup
```

## 📊 Fonctionnalités avancées

### Analyse intelligente
- **Détection automatique** des feeds manquants
- **Statistiques détaillées** par source
- **Recommandations** d'import prioritaires
- **Export OPML** pour les feeds non trouvés

### Migration optimisée
- **Traitement par lots** pour éviter les limitations API
- **Gestion des erreurs** robuste avec retry automatique
- **Reprise automatique** en cas d'interruption
- **Correspondance améliorée** avec 5 méthodes différentes

### Rapports complets
- **Taux de réussite** global et par source
- **Liste des échecs** avec analyse détaillée
- **Recommandations** d'amélioration
- **Export CSV** des favoris non migrés

## 🛡️ Sécurité

### Garanties
- ✅ **Aucun stockage** des mots de passe
- ✅ **Communication directe** avec Feedbin
- ✅ **Session temporaire** uniquement
- ✅ **Code auditable** et open source
- ✅ **Rate limiting** côté serveur

### Bonnes pratiques
- 🔒 Utilisez des identifiants temporaires si possible
- 🔒 Changez votre mot de passe après migration
- 🔒 Vérifiez les logs de connexion Feedbin
- 🔒 Utilisez un réseau sécurisé

## 🚨 Dépannage

### Problèmes courants

**Erreur de connexion Feedbin**
```bash
# Vérifiez vos identifiants
# Assurez-vous que votre compte est actif
# Vérifiez votre connexion internet
```

**Port déjà utilisé**
```bash
# L'application tentera automatiquement les ports suivants
# Ou définissez manuellement : PORT=3001 npm start
```

**Migration partielle**
```bash
# Utilisez le bouton "Exporter les favoris non migrés"
# Importez le fichier OPML généré dans Feedbin
# Attendez 30-60 minutes que Feedbin synchronise
# Relancez la migration
```

**Performance lente**
```bash
# Le système de retry automatique gère les ralentissements
# Vérifiez votre connexion internet
# Les pauses automatiques évitent le rate limiting
```

## 📈 Statistiques et suivi

L'interface fournit des statistiques détaillées :
- **Taux de réussite** global et personnel
- **Analyse par source** de contenu
- **Feeds manquants** avec priorités
- **Recommandations** d'amélioration
- **Export des favoris non migrés**
- **Historique complet** des migrations

## 🔄 Migration depuis les anciens scripts

Si vous utilisiez les scripts legacy :

1. **Sauvegardez** vos données existantes
2. **Lancez** l'interface web : `npm start`
3. **Connectez-vous** avec vos identifiants
4. **Suivez** le processus guidé
5. **Exportez** les favoris non migrés si nécessaire

## 🆕 Guide d'utilisation de l'interface unifiée

### Première utilisation

1. **Lancez l'application** : `npm start`
2. **Ouvrez votre navigateur** sur `http://localhost:3000`
3. **Connectez-vous** avec vos identifiants Feedbin
4. **Naviguez par onglets** pour accéder aux différentes fonctionnalités

### Configuration des préférences

1. **Onglet "Mes préférences"**
2. **Configuration migration** :
   - Tentatives maximum (1-10)
   - Taille des lots (1-50)
   - Seuil de correspondance floue (0.5-1.0)
3. **Notifications** :
   - Email (optionnel)
   - Navigateur (recommandé)
   - Rapports détaillés (recommandé)
4. **Sauvegardez** vos préférences

### Suivi de vos migrations

1. **Onglet "Mes statistiques"** : Vue d'ensemble
2. **Onglet "Mon historique"** : Détails chronologiques
3. **Filtrage** : Par période (7, 30, 90 jours, tout)
4. **Export** : Téléchargement de vos données

### Export des favoris non migrés

Après une migration, si certains favoris n'ont pas été migrés :

1. **Cliquez sur "Exporter les favoris non migrés"**
2. **Téléchargez le fichier OPML** généré
3. **Importez l'OPML dans Feedbin** (Settings > Import/Export)
4. **Attendez 30-60 minutes** que Feedbin synchronise
5. **Relancez la migration** pour récupérer les favoris manquants

### Amélioration du taux de réussite

Le nouvel algorithme utilise 5 méthodes de correspondance :
1. **URL exacte** : Correspondance parfaite des URLs
2. **Domaine + chemin** : Même domaine et chemin d'URL
3. **Titre exact** : Titres identiques (insensible à la casse)
4. **Titre flou** : Titres similaires (80% de similarité minimum)
5. **Date + domaine** : Articles du même domaine dans une fenêtre de ±3 jours

## 🏗️ Architecture technique

### Frontend unifié
- **Interface à onglets** : Navigation intuitive
- **Code consolidé** : Un seul fichier JavaScript (`app.js`)
- **Styles unifiés** : Un seul fichier CSS (`style.css`)
- **Performance optimisée** : Moins de requêtes HTTP

### Backend robuste
- **API organisée** : Routes séparées par fonctionnalité
- **Gestion d'erreurs** : Catégorisation et retry automatique
- **Rate limiting** : Protection contre les abus
- **Logs détaillés** : Suivi des opérations

### Sécurité renforcée
- **Authentification** : Vérification des identifiants Feedbin
- **Rôles** : Détection automatique du statut admin
- **Validation** : Vérification des données côté serveur
- **Session** : Stockage temporaire uniquement

## 📝 Licence

Ce projet est open source sous licence **AGPL-3.0**. Voir le fichier [LICENSE](../../../LICENSE) pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! Voir [CODING-STANDARDS.md](CODING-STANDARDS.md) pour les standards de code et [SECURITY.md](SECURITY.md) pour les détails de sécurité. 