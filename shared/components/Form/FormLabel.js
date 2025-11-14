/**
 * @module components/Form/FormLabel
 * 
 * Composant FormLabel réutilisable avec support d'accessibilité complet
 * 
 * Crée un label de formulaire accessible avec association correcte
 * à l'input correspondant.
 */

/**
 * Crée un label de formulaire réutilisable avec support d'accessibilité complet
 * 
 * @param {Object} options - Options de configuration
 * @param {string} [options.htmlFor=''] - ID de l'input associé (requis pour l'accessibilité)
 * @param {string|Node|Array} [options.children=''] - Contenu du label
 * @param {boolean} [options.required=false] - Afficher l'indication de champ obligatoire
 * @returns {HTMLLabelElement} Élément label créé
 * @example
 * const label = FormLabel({
 *   htmlFor: 'email',
 *   children: 'Adresse email',
 *   required: true
 * });
 */
export default function FormLabel({ htmlFor = '', children = '', required = false } = {}) {
  const label = document.createElement('label');
  label.className = 'form-label';
  
  // Association avec l'input (requis pour l'accessibilité)
  if (htmlFor) {
    label.htmlFor = htmlFor;
  }
  
  // Contenu du label
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
  
  // Indication de champ obligatoire
  if (required) {
    const requiredSpan = document.createElement('span');
    requiredSpan.className = 'required';
    requiredSpan.textContent = ' *';
    requiredSpan.setAttribute('aria-label', 'obligatoire');
    label.appendChild(requiredSpan);
  }
  
  return label;
}
