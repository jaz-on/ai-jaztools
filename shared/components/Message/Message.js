/**
 * @module components/Message
 * 
 * Composant Message réutilisable
 * 
 * Crée un message pour afficher des informations, avertissements ou erreurs.
 */

/**
 * Crée un message réutilisable
 * 
 * @param {Object} options - Options de configuration
 * @param {string} [options.type='info'] - Type de message (info, success, warning, error)
 * @param {string|Node|Array} [options.children=''] - Contenu du message
 * @returns {HTMLDivElement} Élément message créé
 * @example
 * const message = Message({
 *   type: 'success',
 *   children: 'Opération réussie !'
 * });
 */
export default function Message({ type = 'info', children = '' } = {}) {
  const msg = document.createElement('div');
  msg.className = `message ${type}`;
  if (typeof children === 'string') {
    msg.textContent = children;
  } else if (children instanceof Node) {
    msg.appendChild(children);
  } else if (Array.isArray(children)) {
    children.forEach(child => {
      if (typeof child === 'string') {
        msg.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        msg.appendChild(child);
      }
    });
  }
  return msg;
}
