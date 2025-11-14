// components/Form/FormGroup.js
/**
 * Composant FormGroup réutilisable
 * @param {object} options
 * @param {string|Node|Array} options.children
 * @returns {HTMLDivElement}
 */
export default function FormGroup({ children = '' } = {}) {
  const group = document.createElement('div');
  group.className = 'form-group';
  if (typeof children === 'string') {
    group.textContent = children;
  } else if (children instanceof Node) {
    group.appendChild(children);
  } else if (Array.isArray(children)) {
    children.forEach(child => {
      if (typeof child === 'string') {
        group.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        group.appendChild(child);
      }
    });
  }
  return group;
}
