/**
 * @module components/Form/FormGroup
 * 
 * Composant FormGroup réutilisable
 * 
 * Crée un groupe de champs de formulaire pour organiser les labels et inputs.
 */

/**
 * Crée un groupe de formulaire réutilisable
 * 
 * @param {Object} options - Options de configuration
 * @param {string|Node|Array} [options.children=''] - Contenu du groupe (généralement FormLabel et FormInput)
 * @returns {HTMLDivElement} Élément groupe créé
 * @example
 * const group = FormGroup({
 *   children: [
 *     FormLabel({ htmlFor: 'email', children: 'Email' }),
 *     FormInput({ id: 'email', type: 'email' })
 *   ]
 * });
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
