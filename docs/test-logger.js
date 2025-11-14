/**
 * Script de test du module de logging
 * 
 * Ce script démontre l'utilisation du logger avec différents niveaux
 * et configurations d'environnement.
 * 
 * @example
 * ```bash
 * # Test avec niveau INFO (défaut)
 * node docs/test-logger.js
 * 
 * # Test avec niveau DEBUG
 * LOG_LEVEL=debug node docs/test-logger.js
 * 
 * # Test en production (seulement erreurs)
 * NODE_ENV=production node docs/test-logger.js
 * 
 * # Test avec niveau WARN
 * LOG_LEVEL=warn node docs/test-logger.js
 * ```
 */

import { info, warn, error, debug } from '../shared/utils/logger.js';

console.log('\n=== Test du module de logging ===\n');
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'non défini'}`);
console.log(`LOG_LEVEL: ${process.env.LOG_LEVEL || 'non défini (défaut)'}`);
console.log('\n--- Logs générés ---\n');

// Test des différents niveaux
debug('Message de debug - visible uniquement si LOG_LEVEL=debug');
info('Message d\'information - visible par défaut en développement');
warn('Message d\'avertissement - visible si niveau >= WARN');
error('Message d\'erreur - toujours visible');

console.log('\n--- Logs avec données additionnelles ---\n');

// Test avec données
info('Serveur démarré', { 
  port: 3000, 
  host: '0.0.0.0',
  environment: 'development'
});

warn('Rate limit approchant', { 
  remaining: 10, 
  limit: 100,
  resetIn: '60s'
});

error('Erreur API', { 
  statusCode: 500,
  url: '/api/data',
  method: 'POST',
  error: 'Internal server error',
  timestamp: new Date().toISOString()
});

debug('Détails de requête', { 
  method: 'GET',
  url: '/api/health',
  headers: {
    'user-agent': 'test-client',
    'accept': 'application/json'
  },
  query: { page: 1, limit: 10 }
});

console.log('\n=== Test terminé ===\n');
console.log('Note: En production (NODE_ENV=production), seuls les logs ERROR sont affichés par défaut.');
console.log('Utilisez LOG_LEVEL=debug pour voir tous les logs.\n');

