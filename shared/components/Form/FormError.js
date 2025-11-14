/**
 * @module components/Form/FormError
 * 
 * Composant FormError réutilisable
 * 
 * Crée un message d'erreur pour les champs de formulaire.
 */

/**
 * Crée un message d'erreur de formulaire réutilisable
 * 
 * @param {Object} options - Options de configuration
 * @param {string|Node|Array} [options.children=''] - Message d'erreur
 * @returns {HTMLDivElement} Élément message d'erreur créé
 * @example
 * const error = FormError({
 *   children: 'Ce champ est obligatoire'
 * });
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
