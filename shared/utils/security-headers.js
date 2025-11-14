/**
 * Security Headers Utility - Standardisé pour tous les backends Option B
 * 
 * Fournit des fonctions réutilisables pour configurer les headers de sécurité
 * dans les serveurs HTTP natifs Node.js.
 * 
 * @example
 * ```javascript
 * const { setSecurityHeaders } = require('../../shared/utils/security-headers');
 * const http = require('http');
 * 
 * const server = http.createServer((req, res) => {
 *   // Configurer les headers de sécurité
 *   setSecurityHeaders(res);
 * 
 *   // Traiter les requêtes...
 * });
 * ```
 * 
 * @example
 * ```javascript
 * // Avec personnalisation CSP
 * setSecurityHeaders(res, {
 *   csp: {
 *     'img-src': ["'self'", 'https://example.com', 'data:'],
 *     'connect-src': ["'self'", 'https://api.example.com']
 *   }
 * });
 * ```
 */

/**
 * Configure les headers de sécurité pour une réponse
 * 
 * @param {http.ServerResponse} res - Response object
 * @param {Object} options - Options de personnalisation
 * @param {Object} [options.csp] - Personnalisation de la Content-Security-Policy
 * @param {string[]} [options.csp['default-src']] - Sources par défaut
 * @param {string[]} [options.csp['script-src']] - Sources pour les scripts
 * @param {string[]} [options.csp['style-src']] - Sources pour les styles
 * @param {string[]} [options.csp['img-src']] - Sources pour les images
 * @param {string[]} [options.csp['font-src']] - Sources pour les polices
 * @param {string[]} [options.csp['connect-src']] - Sources pour les connexions (fetch, XHR)
 * @param {string[]} [options.csp['frame-src']] - Sources pour les iframes
 * @param {string} [options.frameOptions] - Valeur X-Frame-Options (défaut: 'DENY')
 * @param {string} [options.referrerPolicy] - Valeur Referrer-Policy (défaut: 'strict-origin-when-cross-origin')
 * @param {string} [options.permissionsPolicy] - Valeur Permissions-Policy (défaut: 'geolocation=(), microphone=(), camera=()')
 * 
 * @example
 * // Configuration par défaut
 * setSecurityHeaders(res);
 * 
 * // Configuration personnalisée
 * setSecurityHeaders(res, {
 *   csp: {
 *     'img-src': ["'self'", 'https://example.com', 'data:'],
 *     'connect-src': ["'self'", 'https://api.example.com']
 *   },
 *   frameOptions: 'SAMEORIGIN'
 * });
 */
function setSecurityHeaders(res, options = {}) {
  const {
    csp = {},
    frameOptions = 'DENY',
    referrerPolicy = 'strict-origin-when-cross-origin',
    permissionsPolicy = 'geolocation=(), microphone=(), camera=()'
  } = options;

  // CSP par défaut
  const defaultCSP = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:'],
    'font-src': ["'self'"],
    'connect-src': ["'self'"]
  };

  // Fusionner avec les personnalisations
  const finalCSP = { ...defaultCSP, ...csp };

  // Construire la chaîne CSP
  const cspDirectives = Object.entries(finalCSP)
    .map(([directive, sources]) => {
      const sourcesStr = Array.isArray(sources) ? sources.join(' ') : sources;
      return `${directive} ${sourcesStr}`;
    })
    .join('; ');

  // Définir les headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', frameOptions);
  res.setHeader('Referrer-Policy', referrerPolicy);
  res.setHeader('Permissions-Policy', permissionsPolicy);
  res.setHeader('Content-Security-Policy', cspDirectives);
}

module.exports = { setSecurityHeaders };
