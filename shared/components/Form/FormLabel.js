// components/Form/FormLabel.js
/**
 * Composant FormLabel réutilisable
 * @param {object} options
 * @param {string} options.htmlFor
 * @param {string|Node|Array} options.children
 * @returns {HTMLLabelElement}
 */
export default function FormLabel({ htmlFor = '', children = '' } = {}) {
  const label = document.createElement('label');
  label.className = 'form-label';
  label.htmlFor = htmlFor;
  if (typeof children === 'string') {
    label.textContent = children;
  } else if (children instanceof Node) {
    label.appendChild(children);
  } else if (Array.isArray(children)) {
    children.forEach(child => {
      if (typeof child === 'string') {
        label.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        label.appendChild(child);
      }
    });
  }
  return label;
}
