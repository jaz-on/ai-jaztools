// components/List/List.js
/**
 * Composant List réutilisable
 * @param {object} options
 * @param {Array<Node>} options.children
 * @returns {HTMLUListElement}
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
