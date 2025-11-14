// components/Footer/Footer.js
/**
 * Composant Footer réutilisable
 * @param {object} options
 * @param {string|Node|Array} options.children
 * @returns {HTMLElement}
 */
export default function Footer({ children = '' } = {}) {
  const footer = document.createElement('footer');
  footer.className = 'app-footer';
  if (typeof children === 'string') {
    footer.textContent = children;
  } else if (children instanceof Node) {
    footer.appendChild(children);
  } else if (Array.isArray(children)) {
    children.forEach(child => {
      if (typeof child === 'string') {
        footer.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        footer.appendChild(child);
      }
    });
  }
  return footer;
}
