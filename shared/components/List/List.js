/**
 * @module components/List
 * 
 * Composant List réutilisable
 * 
 * Crée une liste non ordonnée pour afficher des éléments.
 */

/**
 * Crée une liste réutilisable
 * 
 * @param {Object} options - Options de configuration
 * @param {Array<Node>} [options.children=[]] - Éléments de la liste (doivent être des ListItem)
 * @returns {HTMLUListElement} Élément liste créé
 * @example
 * const list = List({
 *   children: [
 *     ListItem({ children: 'Élément 1' }),
 *     ListItem({ children: 'Élément 2' })
 *   ]
 * });
 */
export default function List({ children = [] } = {}) {
  const ul = document.createElement('ul');
  ul.className = 'list';
  if (Array.isArray(children)) {
    children.forEach(child => {
      if (child instanceof Node) ul.appendChild(child);
    });
  }
  return ul;
}
