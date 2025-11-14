// components/Button/Button.js
// Composant bouton réutilisable (vanilla JS, ES module)

/**
 * Crée un bouton réutilisable
 * @param {Object} options
 * @param {string} [options.variant] - Variante de style (primary, secondary, success, error, warning)
 * @param {string} [options.size] - Taille (sm, md, lg)
 * @param {boolean} [options.disabled] - Désactive le bouton
 * @param {function} [options.onClick] - Callback au clic
 * @param {string|Node} [options.children] - Contenu du bouton
 * @returns {HTMLButtonElement}
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick = null,
  children = ''
} = {}) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `btn btn-${variant} btn-${size}`;
  btn.disabled = !!disabled;
  if (onClick) btn.addEventListener('click', onClick);
  if (typeof children === 'string') {
    btn.textContent = children;
  } else if (children instanceof Node) {
    btn.appendChild(children);
  } else if (Array.isArray(children)) {
    children.forEach(child => {
      if (typeof child === 'string') {
        btn.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        btn.appendChild(child);
      }
    });
  }
  return btn;
}
