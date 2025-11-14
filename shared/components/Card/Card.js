// components/Card/Card.js
/**
 * Composant Card réutilisable
 * @param {object} options
 * @param {string|Node|Array} options.children
 * @returns {HTMLDivElement}
 */
export default function Card({ children = '' } = {}) {
  const card = document.createElement('div');
  card.className = 'card';
  if (typeof children === 'string') {
    card.textContent = children;
  } else if (children instanceof Node) {
    card.appendChild(children);
  } else if (Array.isArray(children)) {
    children.forEach(child => {
      if (typeof child === 'string') {
        card.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        card.appendChild(child);
      }
    });
  }
  return card;
}
