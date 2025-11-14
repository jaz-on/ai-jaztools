/**
 * @module utils/cors
 * 
 * CORS Utility - Standardisé pour tous les backends Option B
 * 
 * Fournit des fonctions réutilisables pour configurer les headers CORS
 * et gérer les requêtes preflight (OPTIONS) dans les serveurs HTTP natifs Node.js.
 * 
 * @example
 * ```javascript
 * const { setCorsHeaders, handlePreflight } = require('../../shared/utils/cors');
 * const http = require('http');
 * 
 * const corsOptions = {
 *   origin: '*',
 *   methods: ['GET', 'POST', 'OPTIONS'],
 *   headers: ['Content-Type']
 * };
 * 
 * const server = http.createServer((req, res) => {
 *   // Gérer les requêtes preflight
 *   if (handlePreflight(req, res, corsOptions)) {
 *     return; // La requête OPTIONS a été gérée
 *   }
 * 
 *   // Configurer les headers CORS pour toutes les réponses
 *   setCorsHeaders(res, corsOptions);
 * 
 *   // Traiter les autres requêtes...
 * });
 * ```
 */

/**
 * Configure les headers CORS pour une réponse
 * 
 * @param {http.ServerResponse} res - Response object
 * @param {Object} options - Options CORS
 * @param {string|string[]} [options.origin] - Origines autorisées (défaut: '*')
 * @param {string[]} [options.methods] - Méthodes autorisées (défaut: ['GET', 'POST', 'OPTIONS'])
 * @param {string[]} [options.headers] - Headers autorisés (défaut: ['Content-Type'])
 * @param {boolean} [options.credentials] - Autoriser les credentials (défaut: false)
 * 
 * @example
 * // Configuration par défaut (toutes origines)
 * setCorsHeaders(res);
 * 
 * // Configuration personnalisée
 * setCorsHeaders(res, {
 *   origin: 'https://example.com',
 *   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
 *   headers: ['Content-Type', 'Authorization'],
 *   credentials: true
 * });
 */
function setCorsHeaders(res, options = {}) {
  const {
    origin = '*',
    methods = ['GET', 'POST', 'OPTIONS'],
    headers = ['Content-Type']
  } = options;

  const originHeader = Array.isArray(origin) ? origin.join(', ') : origin;

  res.setHeader('Access-Control-Allow-Origin', originHeader);
  res.setHeader('Access-Control-Allow-Methods', methods.join(', '));
  res.setHeader('Access-Control-Allow-Headers', headers.join(', '));

  if (options.credentials) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
}

/**
 * Gère une requête OPTIONS (preflight)
 * 
 * @param {http.IncomingMessage} req - Request object
 * @param {http.ServerResponse} res - Response object
 * @param {Object} options - Options CORS (mêmes options que setCorsHeaders)
 * @returns {boolean} true si la requête a été gérée (OPTIONS), false sinon
 * 
 * @example
 * const server = http.createServer((req, res) => {
 *   // Gérer les requêtes preflight en premier
 *   if (handlePreflight(req, res, corsOptions)) {
 *     return; // La requête a été traitée
 *   }
 * 
 *   // Continuer avec les autres requêtes...
 * });
 */
function handlePreflight(req, res, options = {}) {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res, options);
    res.writeHead(204);
    res.end();
    return true;
  }
  return false;
}

module.exports = { setCorsHeaders, handlePreflight };

