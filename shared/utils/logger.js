/**
 * @module utils/logger
 * 
 * Module de logging standardisé pour tous les backends Option B
 * 
 * Fournit des fonctions de logging réutilisables avec format standardisé,
 * niveaux configurables et support des environnements de développement et production.
 * 
 * @example
 * ```javascript
 * import { info, warn, error, debug } from '../../shared/utils/logger.js';
 * 
 * info('Server started', { port: 3000 });
 * warn('Rate limit approaching', { remaining: 10 });
 * error('API request failed', { statusCode: 500 });
 * debug('Request details', { url: '/api/data', method: 'GET' });
 * ```
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

/**
 * Détermine le niveau de log actuel basé sur les variables d'environnement
 * - En production (NODE_ENV=production) : ERROR par défaut (sauf si LOG_LEVEL défini)
 * - Sinon : INFO par défaut (ou LOG_LEVEL si défini)
 */
function getCurrentLevel() {
  const envLogLevel = process.env.LOG_LEVEL?.toLowerCase();
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Si LOG_LEVEL est explicitement défini, l'utiliser
  if (envLogLevel === 'debug') return LOG_LEVELS.DEBUG;
  if (envLogLevel === 'info') return LOG_LEVELS.INFO;
  if (envLogLevel === 'warn') return LOG_LEVELS.WARN;
  if (envLogLevel === 'error') return LOG_LEVELS.ERROR;
  
  // Par défaut : ERROR en production, INFO en développement
  return isProduction ? LOG_LEVELS.ERROR : LOG_LEVELS.INFO;
}

const currentLevel = getCurrentLevel();

/**
 * Formate un message de log
 * @param {string} level - Niveau de log
 * @param {string} message - Message
 * @param {Object} data - Données additionnelles (optionnel)
 * @returns {string} Message formaté
 */
function formatLog(level, message, data = null) {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  const dataStr = data ? ` ${JSON.stringify(data)}` : '';
  return `${prefix} ${message}${dataStr}`;
}

/**
 * Log un message de niveau INFO
 * @param {string} message - Message à logger
 * @param {Object} data - Données additionnelles (optionnel)
 */
export function info(message, data = null) {
  if (currentLevel <= LOG_LEVELS.INFO) {
    console.log(formatLog('info', message, data));
  }
}

/**
 * Log un message de niveau WARN
 * @param {string} message - Message à logger
 * @param {Object} data - Données additionnelles (optionnel)
 */
export function warn(message, data = null) {
  if (currentLevel <= LOG_LEVELS.WARN) {
    console.warn(formatLog('warn', message, data));
  }
}

/**
 * Log un message de niveau ERROR
 * @param {string} message - Message à logger
 * @param {Object} data - Données additionnelles (optionnel)
 */
export function error(message, data = null) {
  if (currentLevel <= LOG_LEVELS.ERROR) {
    console.error(formatLog('error', message, data));
  }
}

/**
 * Log un message de niveau DEBUG
 * @param {string} message - Message à logger
 * @param {Object} data - Données additionnelles (optionnel)
 */
export function debug(message, data = null) {
  if (currentLevel <= LOG_LEVELS.DEBUG) {
    console.debug(formatLog('debug', message, data));
  }
}

