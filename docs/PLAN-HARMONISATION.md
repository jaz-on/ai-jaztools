# Plan d'Harmonisation - Monorepo ai-jaztools

## Objectifs Clés

Stack technique cible selon ces principes stricts :

- ✅ **Vanilla pur** (ou librairie très simple/maintenable)
- ✅ **Modules ES modernes** (import/export)
- ✅ **Pas de build** (déploiement direct)
- ✅ **Traitement côté client** = aucune données personnelles interceptables (= zéro auth)
- ✅ **Monoservice** (un seul service par outil)
- ✅ **Pas de dépendances** (ou minimales si vraiment nécessaire)
- ✅ **Architecture aussi simple que possible**
- ✅ **Pas de tests** (simplicité maximale)
- ✅ **Pas de CDN** (tout en local)

## Stack Cible

### Option A : HTML/CSS/JS Vanilla (RECOMMANDÉE PAR DÉFAUT)

- **Frontend** : HTML5, CSS3, JavaScript vanilla (ES6+ modules)
- **CSS** : Design System partagé (`shared/design-system/`)
- **Composants** : Composants JavaScript partagés (`shared/components/`) si nécessaire
- **Backend** : Aucun (traitement 100% côté client)
- **Build** : Aucun
- **Dépendances** : Aucune
- **CDN** : Aucun (tout en local)
- **Tests** : Aucun

**Principe** : Option A par défaut pour tous les outils.

### Option B : Stack Hybride Minimale (SEULEMENT SI NÉCESSAIRE)

- **Frontend** : HTML/CSS/JS vanilla + Design System partagé (modules ES6)
- **Backend** : Node.js simple (http natif) - UNIQUEMENT si traitement serveur absolument requis
- **API** : REST minimal (http natif Node.js)
- **Build** : Aucun
- **Dépendances** : Aucune (http natif Node.js)
- **CDN** : Aucun
- **Tests** : Aucun

**Principe** : Option B uniquement si backend absolument nécessaire (ex: proxy API externe, traitement serveur requis). Sinon, Option A par défaut.

---

## État Actuel des Outils

### 1. InstaFed

**Chemin** : `tools/instafed/`

**État actuel** :
- ✅ Vanilla JS (`script.js`)
- ✅ Design System partagé (`../../shared/design-system/`)
- ✅ Styles locaux (`styles.css` + `styles/`)
- ⚠️ JSZip via CDN (à remplacer par local)

**Fichiers** :
- `index.html`
- `script.js` (logique principale)
- `styles.css` + `styles/` (base, components, icons, layout)

**Action** : Option A - Remplacer JSZip CDN par version locale

**Effort** : Faible (1 jour)

---

### 2. Subscription Organizer

**Chemin** : `tools/feed-minitools/subscription-organizer/`

**État actuel** :
- ✅ Vanilla JS (`analytics.js` - modules ES6)
- ✅ Design System partagé (`../../../shared/design-system/`)
- ✅ Composants partagés (`../../../shared/components/`)
- ✅ Aucune dépendance
- ✅ Aucun backend

**Fichiers** :
- `index.html`
- `analytics.js` (logique principale, modules ES6)
- `styles.css` + `styles-unified.css`

**Action** : Option A - Aucun changement nécessaire

**Effort** : Aucun

---

### 3. URLs to OPML

**Chemin** : `tools/feed-minitools/urls-to-opml/`

**État actuel** :
- ❌ Frontend : Next.js 14 + React + TypeScript (`frontend/`)
- ❌ Tailwind CSS (npm)
- ⚠️ Backend : FastAPI Python (`backend/main.py` - 145 lignes)

**Structure actuelle** :
- `frontend/app/page.tsx` (composant principal)
- `frontend/components/RSSFeedFinder.tsx`
- `backend/main.py` (FastAPI)

**Question clé** : Le parsing RSS/Atom peut-il être fait côté client ?

**Si parsing côté client possible** :
- ✅ **Option A pure** : Frontend vanilla JS, aucun backend
- ✅ Pas de dépendances
- ✅ Traitement 100% côté client (confidentialité)
- ✅ Structure cible : `tools/feed-minitools/urls-to-opml/index.html` + `app.js`

**Si parsing serveur absolument nécessaire** :
- ⚠️ **Option B** : Frontend vanilla + Backend Node.js minimal (http natif)
- ⚠️ Structure cible : `tools/feed-minitools/urls-to-opml/index.html` + `app.js` + `server.js`

**Action** : Option A par défaut - Évaluer parsing côté client. Option B seulement si parsing serveur absolument nécessaire.

**Effort** : Moyen (3-5 jours)

---

### 4. Favorites Migrator

**Chemin** : `tools/feed-minitools/favorites-migrator/`

**État actuel** :
- ✅ Frontend vanilla JS (`public/index.html` + `public/js/`)
- ✅ Design System partagé (`../../../shared/design-system/`)
- ✅ Composants partagés (`../../../shared/components/`)
- ❌ Backend Express avec nombreuses dépendances (7 npm prod + 13 npm dev)
- ⚠️ Architecture complexe (services, middleware, controllers)

**Structure actuelle** :
- `public/index.html` (frontend)
- `public/js/` (api.js, auth.js, migration.js, ui.js, validation.js)
- `server.js` (backend Express)
- `services/`, `middleware/`, `controllers/` (architecture complexe)

**Question clé** : L'API Feedbin peut-elle être appelée directement depuis le client ?

**Si API Feedbin accessible depuis client** :
- ✅ **Option A pure** : Frontend vanilla JS, aucun backend
- ✅ Structure cible : `tools/feed-minitools/favorites-migrator/index.html` + `app.js`
- ✅ Pas de dépendances
- ✅ Traitement 100% côté client (confidentialité)
- ✅ Zéro auth (pas de backend = pas d'interception)

**Si API Feedbin nécessite proxy serveur (CORS, clés API)** :
- ⚠️ **Option B** : Frontend vanilla + Backend Node.js minimal (http natif)
- ⚠️ Structure cible : `tools/feed-minitools/favorites-migrator/index.html` + `app.js` + `server.js`
- ⚠️ Backend minimal pour proxy API uniquement
- ⚠️ Pas d'auth (proxy simple)

**Action** : Option A par défaut - Évaluer accès direct API Feedbin. Option B seulement si proxy absolument nécessaire.

**Effort** :
- Option A : Faible (1 jour) - Supprimer backend, adapter appels API, restructurer fichiers
- Option B : Moyen (2-3 jours) - Simplifier backend (http natif), restructurer fichiers

---

## Plan d'Action

### Phase 1 : Outils déjà optimaux + Harmonisation nomenclature (1-2 jours)

- ✅ **instafed** :
  - Remplacer JSZip CDN → local
  - ❌ `script.js` → ✅ `app.js`
  - ⚠️ `styles/` → ✅ `styles.css` (unifier si possible)
- ✅ **subscription-organizer** :
  - Aucun changement technique
  - ❌ `styles-unified.css` → ✅ `styles.css`
  - ⚠️ `analytics.js` → ✅ `app.js` (ou garder si logique métier spécifique)

**Total Phase 1** : 1-2 jours

---

### Phase 2 : Évaluation backend nécessaire (1 jour)

- ⚠️ **urls-to-opml** : Évaluer faisabilité parsing RSS/Atom côté client (JavaScript)
- ⚠️ **favorites-migrator** : Évaluer accès direct API Feedbin (CORS, clés API)

**Total Phase 2** : 1 jour

---

### Phase 3 : Migration + Harmonisation nomenclature (3-6 jours)

- ⚠️ **urls-to-opml** :
  - Migration Next.js → vanilla (Option A ou B selon évaluation)
  - ❌ `frontend/app/page.tsx` → ✅ `index.html`
  - ❌ `frontend/components/` → ✅ `modules/` (si nécessaire)
  - ❌ `backend/main.py` → ✅ `server.js` (si Option B) ou supprimer (si Option A)
  - Supprimer `frontend/` et `backend/` (unifier à la racine)
- ⚠️ **favorites-migrator** :
  - Supprimer backend (Option A) ou simplifier (Option B)
  - ❌ `public/index.html` → ✅ `index.html` (déplacer à la racine)
  - ❌ `public/js/` → ✅ `modules/`
  - ❌ `public/style-unified.css` → ✅ `styles.css` (supprimer si Design System suffisant)
  - ❌ `data-sources/` → ✅ `data/` (si nécessaire)
  - Supprimer `public/` (déplacer contenu à la racine)

**Total Phase 3** : 3-6 jours

---

### Phase 4 : Nettoyage final (0.5 jour)

- Supprimer fichiers de configuration obsolètes (Option A) :
  - `package.json`, `package-lock.json`
  - `requirements.txt`
  - `tsconfig.json`
  - `next.config.js`
  - `jest.config.js`
  - `jsdoc.json`
- Supprimer dossiers obsolètes :
  - `node_modules/` (Option A)
  - `tests/` (pas de tests)
  - `temp-refactoring/` (fichiers temporaires)

**Total Phase 4** : 0.5 jour

---

## Timeline Globale

- **Phase 1** : 1-2 jours (optimisation + harmonisation nomenclature)
- **Phase 2** : 1 jour (évaluation)
- **Phase 3** : 3-6 jours (migration + harmonisation nomenclature)
- **Phase 4** : 0.5 jour (nettoyage)
- **Total** : **5.5-9.5 jours** de développement

---

## Standards à Établir

### Structure de fichiers

**Option A (statique, recommandée)** :
```
tool-name/
  ├── index.html
  ├── app.js (modules ES6)
  ├── modules/ (si nécessaire)
  │   ├── module1.js
  │   └── module2.js
  ├── styles.css (optionnel si Design System suffisant)
  └── README.md
```

**Option B (avec backend minimal)** :
```
tool-name/
  ├── index.html
  ├── app.js (modules ES6)
  ├── server.js (http natif Node.js, 0 dépendances)
  ├── modules/ (si nécessaire)
  └── README.md
```

### Chemins des ressources partagées

- **Design System CSS** : `../../shared/design-system/` (depuis `tools/tool-name/`)
  - `variables.css`
  - `base.css`
  - `components.css`
  - `utilities.css`
- **Composants JavaScript** : `../../shared/components/` (depuis `tools/tool-name/`)
  - Badge, Button, Card, Footer, Form, Grid, Header, List, Loader, Message, Modal, Progress, Tabs
- **Assets** : `../../shared/assets/` (depuis `tools/tool-name/`)
  - `favicon.ico`, `favicon.svg`

**Note** : Pour les outils dans `tools/feed-minitools/`, utiliser `../../../shared/` au lieu de `../../shared/`

### Conventions de code

- JavaScript ES6+ (modules import/export)
- Design System partagé pour UI (`shared/design-system/`)
- Composants JavaScript partagés (`shared/components/`) si nécessaire
- Pas de framework (vanilla pur)
- Pas de CDN (tout en local)
- Pas de dépendances npm/pip
- Pas de build
- Pas de tests
- Commentaires JSDoc pour documentation

### Chemins relatifs depuis `tools/tool-name/`

- Design System : `../../shared/design-system/`
- Composants : `../../shared/components/`
- Assets : `../../shared/assets/`

**Note** : Pour `tools/feed-minitools/tool-name/`, utiliser `../../../shared/` au lieu de `../../shared/`

### Backend (Option B - seulement si nécessaire)

- Node.js (http natif) - 0 dépendances
- Uniquement pour proxy API si absolument requis
- Pas d'auth, pas de sessions (proxy simple)

---

## Harmonisation de la Nomenclature

### Principes généraux

- **Cohérence** : Tous les outils suivent les mêmes conventions
- **Simplicité** : Noms clairs et descriptifs
- **Standardisation** : Respect des conventions web courantes

### Noms de dossiers d'outils

**Convention** : `kebab-case` (minuscules avec tirets)

**Exemples** :
- ✅ `instafed` → `instafed` (déjà conforme)
- ✅ `favorites-migrator` (déjà conforme)
- ✅ `subscription-organizer` (déjà conforme)
- ✅ `urls-to-opml` (déjà conforme)

**Règle** : Un seul mot en minuscules, ou plusieurs mots séparés par des tirets.

### Noms de fichiers

#### Fichiers principaux

**Convention** :
- `index.html` : Page principale (toujours à la racine de l'outil)
- `app.js` : Logique JavaScript principale (modules ES6)
- `server.js` : Backend Node.js (Option B uniquement)
- `styles.css` : Styles locaux (si nécessaire, optionnel si Design System suffisant)
- `README.md` : Documentation de l'outil

**Exemples de corrections nécessaires** :
- ❌ `script.js` (instafed) → ✅ `app.js`
- ❌ `style.css` → ✅ `styles.css`
- ❌ `style-unified.css` → ✅ `styles.css` (unifier)
- ❌ `styles-unified.css` → ✅ `styles.css` (unifier)

#### Fichiers de modules JavaScript

**Convention** : `camelCase.js` pour les modules

**Structure** :
```
tool-name/
  ├── app.js (point d'entrée)
  ├── modules/
  │   ├── api.js
  │   ├── migration.js
  │   ├── validation.js
  │   └── ui.js
```

**Exemples de corrections nécessaires** :
- ✅ `public/js/api.js` → ✅ `modules/api.js`
- ✅ `public/js/auth.js` → ✅ `modules/auth.js` (si nécessaire)
- ✅ `analytics.js` (subscription-organizer) → ✅ `app.js` ou `modules/analytics.js`

#### Fichiers CSS

**Convention** : `kebab-case.css`

**Structure** :
- `styles.css` : Fichier unique (recommandé)
- OU `styles/` : Dossier avec fichiers séparés (si vraiment nécessaire)
  - `styles/base.css`
  - `styles/components.css`
  - `styles/layout.css`

**Exemples de corrections nécessaires** :
- ❌ `style.css` → ✅ `styles.css`
- ❌ `style-unified.css` → ✅ `styles.css` (unifier)
- ❌ `styles-unified.css` → ✅ `styles.css` (unifier)
- ✅ `styles/` (instafed) : OK si vraiment nécessaire, sinon unifier en `styles.css`

### Structure de dossiers standardisée

#### Option A (statique, recommandée)

**Structure cible** :
```
tool-name/
  ├── index.html
  ├── app.js
  ├── modules/ (optionnel, seulement si nécessaire)
  │   ├── module1.js
  │   └── module2.js
  ├── data/ (optionnel, seulement si données statiques nécessaires)
  │   └── data.json
  ├── styles.css (optionnel, seulement si Design System insuffisant)
  └── README.md
```

**Corrections nécessaires** :
- ❌ `public/` → ✅ Supprimer, fichiers à la racine
- ❌ `public/js/` → ✅ `modules/`
- ❌ `data-sources/` → ✅ `data/`
- ❌ `styles/` (si un seul fichier suffit) → ✅ `styles.css`

#### Option B (avec backend minimal)

**Structure cible** :
```
tool-name/
  ├── index.html
  ├── app.js
  ├── server.js
  ├── modules/ (optionnel)
  │   └── module1.js
  ├── data/ (optionnel)
  │   └── data.json
  └── README.md
```

**Corrections nécessaires** :
- ❌ `backend/` + `frontend/` → ✅ Structure unifiée à la racine
- ❌ `server.mjs` → ✅ `server.js`

### Dossiers spéciaux

#### `modules/` (optionnel)

**Usage** : Modules JavaScript ES6 séparés

**Convention** : Un fichier par module logique
- `api.js` : Appels API
- `migration.js` : Logique de migration
- `validation.js` : Validation des données
- `ui.js` : Gestion de l'interface utilisateur

#### `data/` (optionnel)

**Usage** : Données statiques (JSON, XML, etc.)

**Convention** : `kebab-case` pour les noms de fichiers
- `data/migration-history.json`
- `data/subscriptions.xml`
- `data/starred.json`

**Corrections nécessaires** :
- ❌ `data-sources/` → ✅ `data/`

### Fichiers de configuration

**Convention** : `kebab-case.yml` ou `kebab-case.json`

**Fichiers standardisés** :
- `coolify.yml` : Configuration de déploiement (déjà conforme)
- `config.json` : Configuration de l'outil (si nécessaire)
- `config.example.json` : Exemple de configuration (si nécessaire)

**Fichiers à supprimer** (Option A) :
- ❌ `package.json` (Option A - pas de dépendances)
- ❌ `package-lock.json` (Option A)
- ❌ `requirements.txt` (Option A)
- ❌ `tsconfig.json` (Option A - pas de TypeScript)
- ❌ `next.config.js` (Option A - pas de Next.js)

### Noms de variables et fonctions (JavaScript)

**Convention** : `camelCase`

**Exemples** :
- ✅ `const userEmail = 'user@example.com';`
- ✅ `function migrateFavorites(data) { ... }`
- ✅ `class FeedbinService { ... }`

**Constantes** : `UPPER_SNAKE_CASE`
- ✅ `const MAX_RETRY_ATTEMPTS = 3;`
- ✅ `const API_BASE_URL = 'https://api.example.com';`

### Plan d'harmonisation de la nomenclature

#### Phase 1 : Renommage des fichiers principaux

1. **instafed** :
   - ❌ `script.js` → ✅ `app.js`
   - ⚠️ `styles/` → ✅ `styles.css` (unifier si possible)

2. **subscription-organizer** :
   - ⚠️ `analytics.js` → ✅ `app.js` (ou garder si logique métier spécifique)
   - ❌ `styles-unified.css` → ✅ `styles.css`

3. **favorites-migrator** :
   - ❌ `public/index.html` → ✅ `index.html` (déplacer à la racine)
   - ❌ `public/js/` → ✅ `modules/`
   - ❌ `public/style-unified.css` → ✅ `styles.css` (supprimer si Design System suffisant)

4. **urls-to-opml** :
   - ❌ `frontend/app/page.tsx` → ✅ `index.html`
   - ❌ `frontend/components/` → ✅ `modules/` (si nécessaire)
   - ❌ `backend/main.py` → ✅ `server.js` (si Option B) ou supprimer (si Option A)

#### Phase 2 : Restructuration des dossiers

1. **favorites-migrator** :
   - Supprimer `public/` (déplacer contenu à la racine)
   - Créer `modules/` (déplacer `public/js/*.js`)
   - Supprimer `data-sources/` → `data/` (si nécessaire)

2. **urls-to-opml** :
   - Supprimer `frontend/` et `backend/` (unifier à la racine)
   - Créer structure Option A ou B selon évaluation

#### Phase 3 : Nettoyage des fichiers obsolètes

1. Supprimer tous les fichiers de configuration inutiles (Option A) :
   - `package.json`, `package-lock.json`
   - `requirements.txt`
   - `tsconfig.json`
   - `next.config.js`
   - `jest.config.js`
   - `jsdoc.json`

2. Supprimer les dossiers obsolètes :
   - `node_modules/` (Option A)
   - `tests/` (pas de tests)
   - `temp-refactoring/` (fichiers temporaires)

### Résumé des conventions

| Élément | Convention | Exemple |
|---------|-----------|---------|
| Dossier outil | `kebab-case` | `favorites-migrator` |
| Fichier HTML | `kebab-case.html` | `index.html` |
| Fichier JS principal | `app.js` | `app.js` |
| Fichier JS module | `camelCase.js` | `api.js`, `migration.js` |
| Fichier CSS | `kebab-case.css` | `styles.css` |
| Fichier JSON | `kebab-case.json` | `config.json` |
| Dossier modules | `modules/` | `modules/api.js` |
| Dossier données | `data/` | `data/subscriptions.json` |
| Variable JS | `camelCase` | `userEmail` |
| Constante JS | `UPPER_SNAKE_CASE` | `MAX_RETRY_ATTEMPTS` |
| Classe JS | `PascalCase` | `FeedbinService` |

---

## Résultats Attendus

Après harmonisation :

- ✅ **4 outils** en vanilla JS pur
- ✅ **0 dépendances** npm/pip (ou minimales si Option B)
- ✅ **0 CDN** (tout en local)
- ✅ **0 build** (déploiement direct)
- ✅ **0 tests** (simplicité maximale)
- ✅ **Traitement 100% client** (confidentialité maximale, zéro auth)
- ✅ **Monoservice** (statique si possible, backend minimal si nécessaire)
- ✅ **Architecture simple** (modules ES6, vanilla pur)
- ✅ **Nomenclature harmonisée** :
  - Tous les fichiers principaux : `index.html`, `app.js`, `styles.css`
  - Structure de dossiers cohérente : `modules/`, `data/` (si nécessaire)
  - Conventions de nommage uniformes (kebab-case pour fichiers/dossiers, camelCase pour JS)
  - Suppression des dossiers obsolètes (`public/`, `frontend/`, `backend/`, `tests/`, etc.)

---

## Risques et Points d'Attention

- ⚠️ **Parsing RSS/Atom côté client** : Évaluer faisabilité JavaScript
- ⚠️ **API Feedbin accès direct** : Évaluer CORS/clés API
- ✅ **Performance** : Améliorée (pas de runtime framework)
- ✅ **Maintenance** : Améliorée (code plus simple)
- ✅ **Confidentialité** : Maximale (traitement client)
- ✅ **Simplicité** : Maximale (pas de dépendances, pas de build)

---

## Conclusion

L'harmonisation vers **Option A (HTML/CSS/JS Vanilla)** permet d'atteindre tous les objectifs clés :

- Stack ultra-simple et maintenable
- Pas de dépendances externes
- Traitement 100% côté client (confidentialité)
- Zéro auth (pas de backend = pas d'interception)
- Monoservice (statique si possible)

L'effort de migration est modéré (5-7 jours) pour un bénéfice à long terme important.

