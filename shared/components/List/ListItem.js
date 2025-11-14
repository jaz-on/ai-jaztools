// components/List/ListItem.js
/**
 * Composant ListItem réutilisable
 * @param {object} options
 * @param {string|Node|Array} options.children
 * @returns {HTMLLIElement}
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
