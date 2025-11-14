/**
 * @module utils/health-check
 * 
 * Health Check Utility - Standardisé pour tous les backends Option B
 * 
 * Fournit une fonction réutilisable pour créer des endpoints /api/health
 * avec un format de réponse standardisé utilisé par Coolify pour les health checks.
 * 
 * @example
 * ```javascript
 * const { createHealthCheck } = require('../../shared/utils/health-check');
 * const http = require('http');
 * 
 * const healthCheck = createHealthCheck('mon-service', '1.0.0');
 * 
 * const server = http.createServer((req, res) => {
 *   if (req.url === '/api/health' && req.method === 'GET') {
 *     healthCheck(req, res);
 *   } else {
 *     // autres routes...
 *   }
 * });
 * ```
 */

/**
 * Crée un handler de health check standardisé
 * 
 * @param {string} serviceName - Nom du service (ex: 'favorites-migrator')
 * @param {string} [version='1.0.0'] - Version du service
 * @returns {Function} Handler de requête HTTP pour /api/health
 * @example
 * const healthCheck = createHealthCheck('mon-service', '1.0.0');
 * // Utiliser dans votre serveur HTTP natif Node.js
 */
function createHealthCheck(serviceName, version = '1.0.0') {
  const startTime = Date.now();
  
  return (req, res) => {
    // Vérifier que c'est bien une requête GET
    if (req.method !== 'GET') {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        ok: false, 
        error: 'Method not allowed' 
      }));
      return;
    }
    
    // Calculer l'uptime en secondes
    const uptime = Math.floor((Date.now() - startTime) / 1000);
    
    // Préparer la réponse standardisée
    const response = {
      ok: true,
      service: serviceName,
      version: version,
      timestamp: new Date().toISOString(),
      uptime: uptime,
      environment: process.env.NODE_ENV || 'production'
    };
    
    // Envoyer la réponse
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response));
  };
}

module.exports = { createHealthCheck };

