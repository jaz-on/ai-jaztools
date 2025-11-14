// components/Progress/ProgressContainer.js
/**
 * Composant ProgressContainer réutilisable
 * @param {object} options
 * @param {string|Node|Array} options.children
 * @returns {HTMLDivElement}
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
