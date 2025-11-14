/**
 * @module components/Modal
 * 
 * Composant Modal réutilisable avec support d'accessibilité complet
 * 
 * Crée une modale accessible avec gestion du focus, piège au clavier,
 * et support complet des attributs ARIA.
 */

/**
 * Crée une modale réutilisable avec support d'accessibilité complet
 * 
 * @param {Object} options - Options de configuration
 * @param {boolean} [options.open=false] - État d'ouverture de la modale
 * @param {Function} [options.onClose] - Callback appelé lors de la fermeture
 * @param {string} [options.title=''] - Titre de la modale (requis pour l'accessibilité)
 * @param {string|Node|Array} [options.children=''] - Contenu de la modale
 * @param {string} [options.ariaLabel] - Label ARIA alternatif si pas de titre
 * @returns {HTMLDivElement} Élément overlay de la modale
 * @example
 * const modal = Modal({
 *   open: true,
 *   title: 'Confirmation',
 *   children: 'Êtes-vous sûr ?',
 *   onClose: () => console.log('Fermé')
 * });
 * document.body.appendChild(modal);
 */
export default function Modal({ open = false, onClose = null, title = '', children = '', ariaLabel = null } = {}) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.style.display = open ? 'flex' : 'none';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
  
  const dialog = document.createElement('div');
  dialog.className = 'modal-dialog';
  
  // Titre de la modale (requis pour l'accessibilité)
  let titleId = null;
  if (title) {
    titleId = `modal-title-${Math.random().toString(36).substr(2, 9)}`;
    const h3 = document.createElement('h3');
    h3.id = titleId;
    h3.className = 'modal-title';
    h3.textContent = title;
    dialog.appendChild(h3);
    overlay.setAttribute('aria-labelledby', titleId);
  } else if (ariaLabel) {
    overlay.setAttribute('aria-label', ariaLabel);
  }
  
  // Contenu de la modale
  if (typeof children === 'string') {
    dialog.appendChild(document.createTextNode(children));
  } else if (children instanceof Node) {
    dialog.appendChild(children);
  } else if (Array.isArray(children)) {
    children.forEach(child => {
      if (typeof child === 'string') {
        dialog.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        dialog.appendChild(child);
      }
    });
  }
  
  // Bouton de fermeture
  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal-close';
  closeBtn.textContent = '×';
  closeBtn.setAttribute('aria-label', 'Fermer la modale');
  closeBtn.onclick = () => {
    if (onClose) onClose();
    closeModal();
  };
  dialog.appendChild(closeBtn);
  overlay.appendChild(dialog);
  
  // Fermeture au clic sur l'overlay
  overlay.onclick = (e) => {
    if (e.target === overlay && onClose) {
      onClose();
      closeModal();
    }
  };
  
  // Sauvegarder l'élément qui avait le focus avant l'ouverture
  let previousActiveElement = null;
  
  // Fonction de fermeture avec gestion du focus
  function closeModal() {
    overlay.style.display = 'none';
    overlay.setAttribute('aria-hidden', 'true');
    
    // Retourner le focus à l'élément précédent
    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus();
    }
  }
  
  // Gestion du focus et piège au clavier
  if (open) {
    previousActiveElement = document.activeElement;
    overlay.setAttribute('aria-hidden', 'false');
    
    // Focuser le premier élément focusable
    const focusableElements = dialog.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    if (firstFocusable) {
      setTimeout(() => firstFocusable.focus(), 100);
    }
    
    // Piège au clavier
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (onClose) onClose();
        closeModal();
        overlay.removeEventListener('keydown', handleKeyDown);
      } else if (e.key === 'Tab') {
        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }
        
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    };
    
    overlay.addEventListener('keydown', handleKeyDown);
  }
  
  return overlay;
}
