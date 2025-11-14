# Guide de documentation JSDoc

Ce guide définit les standards de documentation JSDoc pour le projet AI JazTools. Tous les fichiers JavaScript doivent suivre ces conventions pour assurer une cohérence dans la documentation.

## Table des matières

1. [Structure de base](#structure-de-base)
2. [Documentation des fonctions](#documentation-des-fonctions)
3. [Documentation des classes](#documentation-des-classes)
4. [Documentation des modules](#documentation-des-modules)
5. [Types complexes](#types-complexes)
6. [Exemples](#exemples)
7. [Bonnes pratiques](#bonnes-pratiques)

## Structure de base

### Format général

```javascript
/**
 * Description courte de la fonction/classe/module
 * 
 * Description détaillée si nécessaire (plusieurs lignes).
 * 
 * @param {Type} paramName - Description du paramètre
 * @param {Type} [optionalParam] - Paramètre optionnel
 * @returns {ReturnType} Description de la valeur retournée
 * @throws {ErrorType} Quand cette erreur est levée
 * @example
 * // Exemple d'utilisation
 * const result = myFunction('param', { prop1: 'value' });
 */
```

### Règles de base

- **Langue** : Toute la documentation doit être en français pour la cohérence du projet
- **Description courte** : Première ligne, phrase complète, pas de point final
- **Description détaillée** : Lignes suivantes, explications complémentaires si nécessaire
- **Tags** : Utiliser les tags JSDoc standard (@param, @returns, @throws, etc.)

## Documentation des fonctions

### Fonction simple

```javascript
/**
 * Calcule la somme de deux nombres
 * 
 * @param {number} a - Premier nombre
 * @param {number} b - Deuxième nombre
 * @returns {number} La somme de a et b
 */
function add(a, b) {
  return a + b;
}
```

### Fonction avec paramètres optionnels

```javascript
/**
 * Crée un élément HTML avec des options de configuration
 * 
 * @param {string} tagName - Nom de la balise HTML
 * @param {Object} [options] - Options de configuration
 * @param {string} [options.className] - Classe CSS à ajouter
 * @param {string} [options.id] - Identifiant de l'élément
 * @param {Object} [options.attributes] - Attributs HTML supplémentaires
 * @returns {HTMLElement} L'élément HTML créé
 */
function createElement(tagName, options = {}) {
  const element = document.createElement(tagName);
  if (options.className) {
    element.className = options.className;
  }
  return element;
}
```

### Fonction avec callback

```javascript
/**
 * Exécute une fonction après un délai
 * 
 * @param {Function} callback - Fonction à exécuter
 * @param {number} delay - Délai en millisecondes
 * @param {...*} args - Arguments à passer à la fonction callback
 * @returns {number} ID du timer pour annulation possible
 */
function delayedCall(callback, delay, ...args) {
  return setTimeout(() => callback(...args), delay);
}
```

### Fonction asynchrone

```javascript
/**
 * Récupère des données depuis une API
 * 
 * @param {string} url - URL de l'endpoint API
 * @param {Object} [options] - Options de la requête
 * @param {string} [options.method='GET'] - Méthode HTTP
 * @param {Object} [options.headers] - En-têtes HTTP
 * @returns {Promise<Response>} Promesse résolue avec la réponse
 * @throws {Error} Si la requête échoue
 * @example
 * const data = await fetchData('/api/users', { method: 'POST' });
 */
async function fetchData(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response;
}
```

## Documentation des classes

### Classe simple

```javascript
/**
 * Gère l'authentification utilisateur
 * 
 * @class
 */
class AuthManager {
  /**
   * Crée une instance de AuthManager
   * 
   * @constructor
   * @param {string} apiUrl - URL de l'API d'authentification
   * @param {Object} [config] - Configuration optionnelle
   * @param {number} [config.timeout=5000] - Timeout en millisecondes
   */
  constructor(apiUrl, config = {}) {
    this.apiUrl = apiUrl;
    this.timeout = config.timeout || 5000;
  }

  /**
   * Authentifie un utilisateur
   * 
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe
   * @returns {Promise<Object>} Promesse résolue avec les données utilisateur
   * @throws {Error} Si l'authentification échoue
   */
  async login(email, password) {
    // Implémentation
  }
}
```

### Classe avec méthodes statiques

```javascript
/**
 * Utilitaires pour la manipulation de chaînes
 * 
 * @class
 */
class StringUtils {
  /**
   * Vérifie si une chaîne est vide
   * 
   * @static
   * @param {string} str - Chaîne à vérifier
   * @returns {boolean} True si la chaîne est vide ou null
   */
  static isEmpty(str) {
    return !str || str.trim().length === 0;
  }
}
```

## Documentation des modules

### Module ES6 avec exports nommés

```javascript
/**
 * @module utils/validation
 * 
 * Module de validation de données
 * 
 * Fournit des fonctions utilitaires pour valider différents types de données,
 * formats et structures.
 * 
 * @example
 * ```javascript
 * import { isValidEmail, isValidUrl } from './utils/validation.js';
 * 
 * if (isValidEmail(userEmail)) {
 *   // Traitement
 * }
 * ```
 */

/**
 * Vérifie si une adresse email est valide
 * 
 * @param {string} email - Adresse email à valider
 * @returns {boolean} True si l'email est valide
 */
export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Vérifie si une URL est valide
 * 
 * @param {string} url - URL à valider
 * @returns {boolean} True si l'URL est valide
 */
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
```

### Module avec export par défaut

```javascript
/**
 * @module components/Button
 * 
 * Composant bouton réutilisable
 * 
 * Crée des boutons HTML accessibles avec support d'ARIA et de styles personnalisables.
 */

/**
 * Crée un bouton réutilisable avec support d'accessibilité complet
 * 
 * @param {Object} options - Options de configuration
 * @param {string} [options.variant='primary'] - Variante de style
 * @param {string} [options.size='md'] - Taille du bouton
 * @param {boolean} [options.disabled=false] - Désactive le bouton
 * @param {Function} [options.onClick] - Callback au clic
 * @param {string|Node|Array} [options.children] - Contenu du bouton
 * @returns {HTMLButtonElement} Élément bouton créé
 * @example
 * const btn = Button({
 *   variant: 'primary',
 *   children: 'Cliquez-moi',
 *   onClick: () => console.log('Clic!')
 * });
 */
export default function Button(options = {}) {
  // Implémentation
}
```

## Types complexes

### Utilisation de @typedef

```javascript
/**
 * Options de configuration pour un composant
 * 
 * @typedef {Object} ComponentOptions
 * @property {string} [variant='default'] - Variante de style
 * @property {number} [width] - Largeur en pixels
 * @property {number} [height] - Hauteur en pixels
 * @property {Function} [onClick] - Callback au clic
 * @property {boolean} [disabled=false] - État désactivé
 */

/**
 * Crée un composant avec les options spécifiées
 * 
 * @param {ComponentOptions} options - Options de configuration
 * @returns {HTMLElement} Le composant créé
 */
function createComponent(options) {
  // Utilise options.variant, options.width, etc.
}
```

### Types union

```javascript
/**
 * Affiche un message à l'utilisateur
 * 
 * @param {string} message - Message à afficher
 * @param {'success'|'error'|'warning'|'info'} type - Type de message
 * @param {number} [duration=3000] - Durée d'affichage en ms
 * @returns {void}
 */
function showMessage(message, type, duration = 3000) {
  // Implémentation
}
```

### Types génériques

```javascript
/**
 * Récupère une valeur depuis le cache ou l'initialise
 * 
 * @template T
 * @param {string} key - Clé du cache
 * @param {() => T} initializer - Fonction d'initialisation
 * @returns {T} Valeur depuis le cache ou initialisée
 */
function getOrInit(key, initializer) {
  if (!cache.has(key)) {
    cache.set(key, initializer());
  }
  return cache.get(key);
}
```

## Exemples

### Exemple simple

```javascript
/**
 * Formate une date au format français
 * 
 * @param {Date} date - Date à formater
 * @returns {string} Date formatée (ex: "15 janvier 2024")
 * @example
 * const formatted = formatDate(new Date());
 * console.log(formatted); // "15 janvier 2024"
 */
function formatDate(date) {
  // Implémentation
}
```

### Exemple complexe avec plusieurs cas

```javascript
/**
 * Parse un fichier JSON avec gestion d'erreurs
 * 
 * @param {string} jsonString - Chaîne JSON à parser
 * @param {Object} [options] - Options de parsing
 * @param {*} [options.defaultValue=null] - Valeur par défaut en cas d'erreur
 * @param {boolean} [options.strict=true] - Mode strict (lève une erreur si invalide)
 * @returns {*} Objet parsé ou valeur par défaut
 * @throws {SyntaxError} Si le JSON est invalide et strict=true
 * @example
 * // Cas normal
 * const data = parseJSON('{"name": "John"}');
 * 
 * @example
 * // Avec valeur par défaut
 * const data = parseJSON('invalid', { defaultValue: {} });
 * 
 * @example
 * // Mode strict
 * try {
 *   const data = parseJSON('invalid', { strict: true });
 * } catch (error) {
 *   console.error('JSON invalide');
 * }
 */
function parseJSON(jsonString, options = {}) {
  // Implémentation
}
```

## Bonnes pratiques

### 1. Toujours documenter les fonctions exportées

Toutes les fonctions, classes et constantes exportées doivent avoir une documentation JSDoc complète.

### 2. Documenter les paramètres complexes

Utiliser `@typedef` pour les objets de configuration complexes ou réutilisés.

### 3. Inclure des exemples pour les fonctions complexes

Les fonctions avec plusieurs paramètres ou comportements complexes doivent inclure `@example`.

### 4. Documenter les erreurs possibles

Utiliser `@throws` pour indiquer quelles erreurs peuvent être levées et dans quelles conditions.

### 5. Types précis

- Utiliser des types spécifiques plutôt que `Object` ou `*` quand c'est possible
- Utiliser des types union (`'a'|'b'`) pour les valeurs énumérées
- Utiliser `@template` pour les fonctions génériques

### 6. Cohérence du style

- Toujours commencer la description par une majuscule
- Ne pas mettre de point final dans la description courte
- Utiliser des phrases complètes dans les descriptions détaillées
- Utiliser le même vocabulaire dans tout le projet

### 7. Documentation des callbacks

```javascript
/**
 * Traite un tableau d'éléments avec une fonction de transformation
 * 
 * @param {Array} items - Tableau d'éléments à traiter
 * @param {Function} transform - Fonction de transformation
 * @param {*} transform.item - Élément courant
 * @param {number} transform.index - Index de l'élément
 * @param {Array} transform.array - Tableau complet
 * @returns {Array} Tableau transformé
 */
function mapItems(items, transform) {
  return items.map(transform);
}
```

### 8. Documentation des événements

```javascript
/**
 * Gère les événements de l'application
 * 
 * @class
 */
class EventManager {
  /**
   * Écoute un événement
   * 
   * @param {string} eventName - Nom de l'événement
   * @param {Function} handler - Gestionnaire d'événement
   * @param {Object} handler.data - Données de l'événement
   * @returns {void}
   */
  on(eventName, handler) {
    // Implémentation
  }
}
```

## Checklist de documentation

Avant de considérer qu'un fichier est complètement documenté, vérifier :

- [ ] Toutes les fonctions exportées ont une documentation JSDoc
- [ ] Tous les paramètres sont documentés avec `@param`
- [ ] Le type de retour est documenté avec `@returns`
- [ ] Les erreurs possibles sont documentées avec `@throws`
- [ ] Les fonctions complexes ont des exemples avec `@example`
- [ ] Les classes ont `@class` et `@constructor`
- [ ] Les modules ont `@module` en haut du fichier
- [ ] Les types complexes utilisent `@typedef`
- [ ] La documentation est en français
- [ ] Le style est cohérent avec le reste du projet

## Références

- [Documentation officielle JSDoc](https://jsdoc.app/)
- [Tags JSDoc disponibles](https://jsdoc.app/index.html#block-tags)
- [Types JSDoc](https://jsdoc.app/tags-type.html)

