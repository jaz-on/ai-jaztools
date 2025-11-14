// components/Badge/Badge.js
/**
 * Composant Badge réutilisable
 * @param {object} options
 * @param {string} options.variant
 * @param {string|Node|Array} options.children
 * @returns {HTMLSpanElement}
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
