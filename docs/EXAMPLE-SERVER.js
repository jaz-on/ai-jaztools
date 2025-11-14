/**
 * Exemple de serveur Node.js utilisant le module de logging standardisé
 * 
 * Ce fichier montre comment intégrer le logger dans un backend Option B.
 * Copiez ce code dans votre server.js et adaptez-le selon vos besoins.
 * 
 * @example
 * ```bash
 * # Depuis tools/tool-name/
 * node server.js
 * 
 * # Depuis tools/feed-minitools/tool-name/
 * node server.js
 * ```
 */

import http from 'http';
import { info, warn, error, debug } from '../../shared/utils/logger.js';
// Pour tools/feed-minitools/tool-name/, utilisez :
// import { info, warn, error, debug } from '../../../shared/utils/logger.js';

// Import du module de headers de sécurité
const { setSecurityHeaders } = require('../../shared/utils/security-headers.js');
// Pour tools/feed-minitools/tool-name/, utilisez :
// const { setSecurityHeaders } = require('../../../shared/utils/security-headers.js');

// Import du health check (si nécessaire)
// Note: health-check.js utilise CommonJS, vous devrez peut-être l'adapter
// import { createHealthCheck } from '../../shared/utils/health-check.js';

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Exemple de health check handler (simplifié)
function handleHealthCheck(req, res) {
  const response = {
    ok: true,
    service: 'example-service',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  };
  
  // Utiliser setHeader pour préserver les headers de sécurité définis précédemment
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify(response));
  info('Health check requested');
}

// Handler principal du serveur
const server = http.createServer((req, res) => {
  // Configurer les headers de sécurité pour toutes les réponses
  // Personnaliser la CSP si nécessaire (exemple avec images externes)
  setSecurityHeaders(res, {
    // Exemple de personnalisation CSP pour autoriser des images externes
    // csp: {
    //   'img-src': ["'self'", 'data:', 'https://example.com']
    // }
  });

  // Log de la requête (niveau DEBUG)
  debug('Request received', { 
    method: req.method, 
    url: req.url,
    headers: {
      'user-agent': req.headers['user-agent'],
      'content-type': req.headers['content-type']
    }
  });

  // Route health check
  if (req.url === '/api/health' && req.method === 'GET') {
    handleHealthCheck(req, res);
    return;
  }

  // Route API exemple
  if (req.url === '/api/data' && req.method === 'GET') {
    info('API data requested');
    
    // Simulation d'une opération
    try {
      const data = { message: 'Hello from API', timestamp: new Date().toISOString() };
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify(data));
      info('API data sent successfully');
    } catch (err) {
      error('Error processing API request', { 
        error: err.message,
        stack: err.stack 
      });
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
    return;
  }

  // Route 404
  warn('Route not found', { 
    method: req.method, 
    url: req.url 
  });
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'Not found' }));
});

// Démarrer le serveur
server.listen(PORT, HOST, () => {
  info('Server started', { 
    port: PORT, 
    host: HOST,
    environment: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'default'
  });
});

// Gestion des erreurs du serveur
server.on('error', (err) => {
  error('Server error', { 
    error: err.message,
    code: err.code,
    port: PORT,
    host: HOST
  });
  process.exit(1);
});

// Gestion de l'arrêt propre
process.on('SIGTERM', () => {
  info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  info('SIGINT received, shutting down gracefully');
  server.close(() => {
    info('Server closed');
    process.exit(0);
  });
});

// Gestion des erreurs non capturées
process.on('uncaughtException', (err) => {
  error('Uncaught exception', { 
    error: err.message,
    stack: err.stack 
  });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  error('Unhandled rejection', { 
    reason: reason instanceof Error ? reason.message : String(reason),
    promise: promise
  });
});

