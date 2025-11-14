/**
 * @module utils/error-handler
 * 
 * Module partagé de gestion d'erreurs
 * 
 * Fournit des fonctions standardisées pour la gestion d'erreurs côté client
 * avec types d'erreurs standardisés et affichage cohérent.
 */

/**
 * Types d'erreurs standardisés
 * 
 * @typedef {Object} ErrorType
 * @property {string} NETWORK - Erreur réseau
 * @property {string} VALIDATION - Erreur de validation
 * @property {string} API - Erreur API
 * @property {string} UNKNOWN - Erreur inconnue
 */
export const ErrorType = {
    NETWORK: 'network',
    VALIDATION: 'validation',
    API: 'api',
    UNKNOWN: 'unknown'
};

/**
 * Crée un objet d'erreur standardisé
 * 
 * @param {string} message - Message d'erreur
 * @param {string} [type=ErrorType.UNKNOWN] - Type d'erreur (ErrorType)
 * @param {Error} [originalError] - Erreur originale (optionnel)
 * @returns {Object} Objet d'erreur standardisé avec message, type, timestamp et originalError
 * @example
 * const error = createError('Connexion échouée', ErrorType.NETWORK, originalErr);
 */
export function createError(message, type = ErrorType.UNKNOWN, originalError = null) {
    return {
        message,
        type,
        timestamp: new Date().toISOString(),
        originalError: originalError ? {
            message: originalError.message,
            stack: originalError.stack
        } : null
    };
}

/**
 * Affiche une erreur à l'utilisateur (côté client)
 * 
 * @param {Object|string} error - Objet d'erreur ou message d'erreur
 * @param {HTMLElement} container - Container pour afficher l'erreur
 * @returns {void}
 * @example
 * const errorContainer = document.getElementById('error-message');
 * displayError('Une erreur est survenue', errorContainer);
 */
export function displayError(error, container) {
    if (!container) {
        console.error('Container not provided for error display:', error);
        return;
    }

    // Si error est une string, créer un objet d'erreur
    const errorObj = typeof error === 'string' 
        ? createError(error, ErrorType.UNKNOWN)
        : error;

    // Créer l'élément d'erreur
    const errorDiv = document.createElement('div');
    errorDiv.className = 'message error';
    errorDiv.textContent = errorObj.message || 'Une erreur est survenue';
    
    // Vider le container et ajouter l'erreur
    container.innerHTML = '';
    container.appendChild(errorDiv);
    
    // Afficher le container s'il est caché
    if (container.classList.contains('hidden')) {
        container.classList.remove('hidden');
    }

    // Logger l'erreur complète pour le debugging
    logError(errorObj);
}

/**
 * Log une erreur complète dans la console pour le debugging
 * 
 * @param {Object|string} error - Objet d'erreur ou message d'erreur
 * @returns {void}
 * @example
 * logError(createError('Erreur de validation', ErrorType.VALIDATION));
 */
export function logError(error) {
    const errorObj = typeof error === 'string' 
        ? createError(error, ErrorType.UNKNOWN)
        : error;

    console.error('Error occurred:', {
        message: errorObj.message,
        type: errorObj.type,
        timestamp: errorObj.timestamp,
        originalError: errorObj.originalError
    });
}

