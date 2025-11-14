/**
 * @module components/Footer
 * 
 * Composant Footer réutilisable
 * 
 * Crée un pied de page pour l'application.
 */

/**
 * Crée un pied de page réutilisable
 * 
 * @param {Object} options - Options de configuration
 * @param {string|Node|Array} [options.children=''] - Contenu du footer
 * @returns {HTMLElement} Élément footer créé
 * @example
 * const footer = Footer({
 *   children: '© 2024 Mon Application'
 * });
 */
export default function Footer({ children = '' } = {}) {
  const footer = document.createElement('footer');
  footer.className = 'app-footer';
  if (typeof children === 'string') {
    footer.textContent = children;
  } else if (children instanceof Node) {
    footer.appendChild(children);
  } else if (Array.isArray(children)) {
    children.forEach(child => {
      if (typeof child === 'string') {
        footer.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        footer.appendChild(child);
      }
    });
  }
  return footer;
}
