/**
 * @module components/Badge
 * 
 * Composant Badge réutilisable
 * 
 * Crée un badge pour afficher des labels ou des statuts.
 */

/**
 * Crée un badge réutilisable
 * 
 * @param {Object} options - Options de configuration
 * @param {string} [options.variant='primary'] - Variante de style (primary, secondary, success, error, warning)
 * @param {string|Node|Array} [options.children=''] - Contenu du badge
 * @returns {HTMLSpanElement} Élément badge créé
 * @example
 * const badge = Badge({
 *   variant: 'success',
 *   children: 'Actif'
 * });
 */
export default function Badge({ variant = 'primary', children = '' } = {}) {
  const badge = document.createElement('span');
  badge.className = `badge badge-${variant}`;
  if (typeof children === 'string') {
    badge.textContent = children;
  } else if (children instanceof Node) {
    badge.appendChild(children);
  } else if (Array.isArray(children)) {
    children.forEach(child => {
      if (typeof child === 'string') {
        badge.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        badge.appendChild(child);
      }
    });
  }
  return badge;
}
