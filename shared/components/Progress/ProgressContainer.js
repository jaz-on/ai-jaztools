/**
 * @module components/Progress/ProgressContainer
 * 
 * Composant ProgressContainer réutilisable
 * 
 * Crée un conteneur pour organiser les barres de progression et leurs labels.
 */

/**
 * Crée un conteneur de progression réutilisable
 * 
 * @param {Object} options - Options de configuration
 * @param {string|Node|Array} [options.children=''] - Contenu du conteneur (généralement ProgressBar)
 * @returns {HTMLDivElement} Élément conteneur créé
 * @example
 * const container = ProgressContainer({
 *   children: [
 *     ProgressBar({ value: 50, max: 100 }),
 *     '50%'
 *   ]
 * });
 */
export default function ProgressContainer({ children = '' } = {}) {
  const container = document.createElement('div');
  container.className = 'progress-container';
  if (typeof children === 'string') {
    container.textContent = children;
  } else if (children instanceof Node) {
    container.appendChild(children);
  } else if (Array.isArray(children)) {
    children.forEach(child => {
      if (typeof child === 'string') {
        container.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        container.appendChild(child);
      }
    });
  }
  return container;
}
