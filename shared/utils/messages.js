/**
 * @module utils/messages
 * 
 * Module standardisé de gestion des messages utilisateur
 * 
 * Fournit des fonctions pour afficher des messages cohérents dans tous les outils
 * avec support de différents types et auto-dismiss.
 */

/**
 * Types de messages disponibles
 * 
 * @typedef {Object} MessageType
 * @property {string} SUCCESS - Message de succès
 * @property {string} ERROR - Message d'erreur
 * @property {string} WARNING - Message d'avertissement
 * @property {string} INFO - Message d'information
 */
export const MessageType = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

/**
 * Affiche un message à l'utilisateur
 * 
 * @param {string} message - Texte du message
 * @param {string} [type=MessageType.INFO] - Type de message (MessageType)
 * @param {HTMLElement} container - Container pour le message
 * @param {number} [duration=5000] - Durée d'affichage en ms (0 = permanent)
 * @returns {HTMLElement|null} L'élément message créé, ou null si le container n'existe pas
 * @example
 * const messageContainer = document.getElementById('message');
 * showMessage('Opération réussie', MessageType.SUCCESS, messageContainer, 3000);
 */
export function showMessage(message, type = MessageType.INFO, container, duration = 5000) {
  // Fallback si le container n'existe pas
  if (!container) {
    console.warn('Message container not provided:', message);
    return null;
  }

  // Créer l'élément message
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;
  messageDiv.setAttribute('role', 'alert');
  
  // Vider le container et ajouter le message
  container.innerHTML = '';
  container.appendChild(messageDiv);
  
  // Afficher le container s'il est caché
  if (container.classList.contains('hidden')) {
    container.classList.remove('hidden');
  }
  
  // Auto-dismiss si duration > 0
  if (duration > 0) {
    setTimeout(() => {
      if (messageDiv.parentNode === container) {
        messageDiv.remove();
        // Cacher le container s'il est vide
        if (container.children.length === 0) {
          container.classList.add('hidden');
        }
      }
    }, duration);
  }
  
  return messageDiv;
}

/**
 * Affiche un message de succès
 * 
 * @param {string} message - Texte du message
 * @param {HTMLElement} container - Container pour le message
 * @param {number} [duration=5000] - Durée d'affichage en ms
 * @returns {HTMLElement|null} L'élément message créé
 * @example
 * showSuccess('Données sauvegardées', messageContainer);
 */
export function showSuccess(message, container, duration = 5000) {
  return showMessage(message, MessageType.SUCCESS, container, duration);
}

/**
 * Affiche un message d'erreur
 * 
 * @param {string} message - Texte du message
 * @param {HTMLElement} container - Container pour le message
 * @param {number} [duration=0] - Durée d'affichage en ms (0 = permanent)
 * @returns {HTMLElement|null} L'élément message créé
 * @example
 * showError('Erreur lors de la sauvegarde', errorContainer);
 */
export function showError(message, container, duration = 0) {
  return showMessage(message, MessageType.ERROR, container, duration);
}

/**
 * Affiche un message d'avertissement
 * 
 * @param {string} message - Texte du message
 * @param {HTMLElement} container - Container pour le message
 * @param {number} [duration=5000] - Durée d'affichage en ms
 * @returns {HTMLElement|null} L'élément message créé
 * @example
 * showWarning('Attention: données non sauvegardées', messageContainer);
 */
export function showWarning(message, container, duration = 5000) {
  return showMessage(message, MessageType.WARNING, container, duration);
}

/**
 * Affiche un message d'information
 * 
 * @param {string} message - Texte du message
 * @param {HTMLElement} container - Container pour le message
 * @param {number} [duration=5000] - Durée d'affichage en ms
 * @returns {HTMLElement|null} L'élément message créé
 * @example
 * showInfo('Chargement en cours...', messageContainer);
 */
export function showInfo(message, container, duration = 5000) {
  return showMessage(message, MessageType.INFO, container, duration);
}

