// components/Form/FormError.js
/**
 * Composant FormError réutilisable
 * @param {object} options
 * @param {string|Node|Array} options.children
 * @returns {HTMLDivElement}
 */
export default function FormError({ children = '' } = {}) {
  const error = document.createElement('div');
  error.className = 'form-error';
  if (typeof children === 'string') {
    error.textContent = children;
  } else if (children instanceof Node) {
    error.appendChild(children);
  } else if (Array.isArray(children)) {
    children.forEach(child => {
      if (typeof child === 'string') {
        error.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        error.appendChild(child);
      }
    });
  }
  return error;
}
