# Patterns Async/Await Standardisés

Ce document définit les patterns standardisés pour la gestion asynchrone dans tous les fichiers JavaScript du projet.

## Principes Généraux

1. **Toujours utiliser async/await** plutôt que `.then()/.catch()`
2. **Toujours utiliser try/catch** pour les opérations async
3. **Utiliser finally** pour le nettoyage (loading states, etc.)
4. **Utiliser Promise.all** pour les opérations parallèles
5. **Éviter les await dans les boucles** (utiliser Promise.all si possible)

## Patterns Standard

### 1. Fonction Async Basique

```javascript
/**
 * Fonction async avec gestion d'erreur standardisée
 * @param {string} url - URL à récupérer
 * @returns {Promise<Object>} Données récupérées
 */
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    throw error; // Re-throw pour gestion supérieure
  }
}
```

**Points clés :**
- Vérifier `response.ok` avant de parser
- Logger l'erreur avec `console.error`
- Re-throw l'erreur pour permettre la gestion au niveau supérieur

### 2. Handler d'Événement avec Finally

```javascript
/**
 * Handler async avec gestion d'état de chargement
 * @param {Event} event - Événement du formulaire
 */
async function handleSubmit(event) {
  event.preventDefault();
  
  const submitButton = event.target.querySelector('button[type="submit"]');
  const messageContainer = document.getElementById('message-container');
  
  try {
    setLoading(true, submitButton);
    const result = await processData();
    showSuccess('Opération réussie', messageContainer);
  } catch (error) {
    showError(error.message, messageContainer);
  } finally {
    setLoading(false, submitButton);
  }
}
```

**Points clés :**
- Utiliser `finally` pour garantir le nettoyage
- Gérer les états de chargement dans finally
- Afficher les erreurs à l'utilisateur dans le catch

### 3. Opérations Parallèles avec Promise.all

```javascript
/**
 * Récupérer plusieurs ressources en parallèle
 * @param {Array<string>} urls - Liste d'URLs
 * @returns {Promise<Array>} Résultats
 */
async function fetchMultipleData(urls) {
  try {
    const results = await Promise.all(
      urls.map(url => fetchData(url))
    );
    return results;
  } catch (error) {
    console.error('Erreur lors de la récupération parallèle:', error);
    throw error;
  }
}
```

**Points clés :**
- Utiliser `Promise.all` pour les opérations indépendantes
- Utiliser `Promise.allSettled` si certaines peuvent échouer sans bloquer les autres

### 4. Fonction Async dans une Classe

```javascript
class DataService {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  /**
   * Récupérer des données avec authentification
   * @param {string} endpoint - Endpoint API
   * @returns {Promise<Object>} Données
   */
  async fetchAuthenticated(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Non authentifié');
        }
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur API ${endpoint}:`, error);
      throw error;
    }
  }
}
```

### 5. Gestion d'Erreurs avec Types d'Erreur

```javascript
/**
 * Fonction avec gestion d'erreurs typées
 * @param {string} url - URL à récupérer
 * @returns {Promise<Object>} Données
 */
async function fetchDataWithErrorHandling(url) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Ressource non trouvée');
      } else if (response.status === 500) {
        throw new Error('Erreur serveur');
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    }
    
    return await response.json();
  } catch (error) {
    // Gestion spécifique selon le type d'erreur
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.error('Erreur réseau:', error);
      throw new Error('Erreur de connexion réseau');
    }
    
    console.error('Erreur lors de la récupération:', error);
    throw error;
  }
}
```

## Patterns à Éviter

### ❌ Ne PAS utiliser .then()/.catch() directement

```javascript
// ❌ MAUVAIS
fetch(url)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

```javascript
// ✅ BON
try {
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error(error);
}
```

### ❌ Ne PAS utiliser await dans une boucle pour opérations parallèles

```javascript
// ❌ MAUVAIS - Séquentiel
const results = [];
for (const url of urls) {
  const data = await fetchData(url);
  results.push(data);
}
```

```javascript
// ✅ BON - Parallèle
const results = await Promise.all(
  urls.map(url => fetchData(url))
);
```

### ❌ Ne PAS oublier le try/catch

```javascript
// ❌ MAUVAIS
async function fetchData(url) {
  const response = await fetch(url);
  return await response.json();
}
```

```javascript
// ✅ BON
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}
```

### ❌ Ne PAS oublier finally pour le nettoyage

```javascript
// ❌ MAUVAIS
async function handleSubmit(event) {
  event.preventDefault();
  setLoading(true);
  try {
    await processData();
  } catch (error) {
    showError(error.message);
  }
  // Oubli de setLoading(false) si erreur
}
```

```javascript
// ✅ BON
async function handleSubmit(event) {
  event.preventDefault();
  try {
    setLoading(true);
    await processData();
  } catch (error) {
    showError(error.message);
  } finally {
    setLoading(false);
  }
}
```

## Cas Spéciaux

### FileReader avec async/await

```javascript
/**
 * Lire un fichier avec FileReader
 * @param {File} file - Fichier à lire
 * @returns {Promise<ArrayBuffer>} Contenu du fichier
 */
async function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      resolve(e.target.result);
    };
    
    reader.onerror = function() {
      reject(new Error('Erreur lors de la lecture du fichier'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

// Utilisation
try {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  // Traiter le fichier
} catch (error) {
  console.error('Erreur:', error);
}
```

### Conversion de Promise avec .then() vers async/await

```javascript
// ❌ AVANT - Promise avec .then()
function loadData() {
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      processData(data);
      return data;
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
}
```

```javascript
// ✅ APRÈS - async/await
async function loadData() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    processData(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
```

## Checklist de Conformité

Avant de commiter du code avec async/await, vérifier :

- [ ] Toutes les fonctions async ont un try/catch
- [ ] Les handlers d'événements async utilisent finally pour le nettoyage
- [ ] Les opérations parallèles utilisent Promise.all
- [ ] Les erreurs sont loggées avec console.error
- [ ] Les erreurs sont affichées à l'utilisateur quand approprié
- [ ] Aucun .then()/.catch() n'est utilisé directement
- [ ] Les await ne sont pas dans des boucles pour opérations parallèles
- [ ] Les états de chargement sont gérés dans finally

## Exceptions Justifiées

Certaines situations peuvent justifier des exceptions aux patterns :

1. **FileReader callbacks** : Nécessite une Promise wrapper (voir exemple ci-dessus)
2. **Event listeners avec callbacks** : Peuvent nécessiter une conversion manuelle
3. **Bibliothèques tierces** : Si une bibliothèque retourne des Promises, les convertir en async/await dans un wrapper

Ces exceptions doivent être documentées dans le code avec un commentaire expliquant pourquoi.

