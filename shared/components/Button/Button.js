/**
 * @module components/Button
 * 
 * Composant bouton réutilisable avec support d'accessibilité complet
 * 
 * Crée des boutons HTML accessibles avec support d'ARIA, styles personnalisables
 * et gestion des états (disabled, loading).
 */

/**
 * Crée un bouton réutilisable avec support d'accessibilité complet
 * 
 * @param {Object} options - Options de configuration
 * @param {string} [options.variant='primary'] - Variante de style (primary, secondary, success, error, warning)
 * @param {string} [options.size='md'] - Taille (sm, md, lg)
 * @param {boolean} [options.disabled=false] - Désactive le bouton
 * @param {Function} [options.onClick] - Callback appelé au clic
 * @param {string|Node|Array} [options.children=''] - Contenu du bouton
 * @param {string} [options.ariaLabel] - Label ARIA pour les boutons sans texte visible
 * @param {string} [options.ariaDescribedBy] - ID de l'élément qui décrit le bouton
 * @param {boolean} [options.ariaBusy=false] - Indique si le bouton est en cours de traitement
 * @param {string} [options.type='button'] - Type de bouton (button, submit, reset)
 * @returns {HTMLButtonElement} Élément bouton créé
 * @example
 * const btn = Button({
 *   variant: 'primary',
 *   children: 'Cliquez-moi',
 *   onClick: () => console.log('Clic!')
 * });
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick = null,
  children = '',
  ariaLabel = null,
  ariaDescribedBy = null,
  ariaBusy = false,
  type = 'button'
} = {}) {
  const btn = document.createElement('button');
  btn.type = type;
  btn.className = `btn btn-${variant} btn-${size}`;
  btn.disabled = !!disabled;
  
  // Attributs ARIA pour accessibilité
  if (ariaLabel) {
    btn.setAttribute('aria-label', ariaLabel);
  }
  if (ariaDescribedBy) {
    btn.setAttribute('aria-describedby', ariaDescribedBy);
  }
  if (ariaBusy) {
    btn.setAttribute('aria-busy', 'true');
    // Si le bouton est en chargement, mettre à jour le label
    if (ariaLabel) {
      btn.setAttribute('aria-label', `${ariaLabel} - Chargement en cours`);
    }
  }
  
  // Gestion de l'état disabled avec aria-disabled
  if (disabled) {
    btn.setAttribute('aria-disabled', 'true');
  }
  
  // Gestion du clic
  if (onClick) {
    btn.addEventListener('click', (e) => {
      if (!disabled && !ariaBusy) {
        onClick(e);
      }
    });
  }
  
  // Contenu du bouton
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
