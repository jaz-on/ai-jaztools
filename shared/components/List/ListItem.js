/**
 * @module components/List/ListItem
 * 
 * Composant ListItem réutilisable
 * 
 * Crée un élément de liste pour être utilisé dans un composant List.
 */

/**
 * Crée un élément de liste réutilisable
 * 
 * @param {Object} options - Options de configuration
 * @param {string|Node|Array} [options.children=''] - Contenu de l'élément de liste
 * @returns {HTMLLIElement} Élément li créé
 * @example
 * const item = ListItem({
 *   children: 'Texte de l\'élément'
 * });
 */
export default function ListItem({ children = '' } = {}) {
  const li = document.createElement('li');
  li.className = 'list-item';
  if (typeof children === 'string') {
    li.textContent = children;
  } else if (children instanceof Node) {
    li.appendChild(children);
  } else if (Array.isArray(children)) {
    children.forEach(child => {
      if (typeof child === 'string') {
        li.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        li.appendChild(child);
      }
    });
  }
  return li;
}
