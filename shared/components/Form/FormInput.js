/**
 * @module components/Form/FormInput
 * 
 * Composant FormInput réutilisable avec support d'accessibilité complet
 * 
 * Crée un champ de formulaire accessible avec gestion des erreurs,
 * validation et support complet des attributs ARIA.
 */

/**
 * Crée un champ de formulaire réutilisable avec support d'accessibilité complet
 * 
 * @param {Object} options - Options de configuration
 * @param {string} [options.id=''] - ID unique de l'input (requis pour l'association avec le label)
 * @param {string} [options.type='text'] - Type d'input (text, email, password, etc.)
 * @param {string} [options.value=''] - Valeur initiale
 * @param {Function} [options.onChange] - Callback appelé lors du changement de valeur
 * @param {string} [options.placeholder=''] - Texte de placeholder
 * @param {boolean} [options.required=false] - Champ obligatoire
 * @param {boolean} [options.disabled=false] - Champ désactivé
 * @param {boolean} [options.invalid=false] - État d'erreur de validation
 * @param {string} [options.ariaDescribedBy] - ID de l'élément qui décrit l'input (instructions ou erreur)
 * @param {string} [options.ariaErrorMessage] - ID de l'élément contenant le message d'erreur
 * @param {string} [options.autocomplete] - Valeur pour l'attribut autocomplete
 * @returns {HTMLInputElement} Élément input créé
 * @example
 * const input = FormInput({
 *   id: 'email',
 *   type: 'email',
 *   placeholder: 'votre@email.com',
 *   required: true,
 *   onChange: (e) => console.log(e.target.value)
 * });
 */
export default function FormInput({ 
  id = '', 
  type = 'text', 
  value = '', 
  onChange = null, 
  placeholder = '', 
  required = false, 
  disabled = false,
  invalid = false,
  ariaDescribedBy = null,
  ariaErrorMessage = null,
  autocomplete = null
} = {}) {
  const input = document.createElement('input');
  input.className = 'form-input';
  input.id = id;
  input.type = type;
  input.value = value;
  input.placeholder = placeholder;
  input.required = !!required;
  input.disabled = !!disabled;
  
  // Attributs ARIA pour accessibilité
  if (required) {
    input.setAttribute('aria-required', 'true');
  }
  
  if (invalid) {
    input.setAttribute('aria-invalid', 'true');
    input.classList.add('input-error');
  } else {
    input.setAttribute('aria-invalid', 'false');
  }
  
  if (ariaDescribedBy) {
    input.setAttribute('aria-describedby', ariaDescribedBy);
  }
  
  if (ariaErrorMessage) {
    input.setAttribute('aria-errormessage', ariaErrorMessage);
    // aria-describedby doit inclure l'erreur aussi
    const describedBy = ariaDescribedBy 
      ? `${ariaDescribedBy} ${ariaErrorMessage}`
      : ariaErrorMessage;
    input.setAttribute('aria-describedby', describedBy);
  }
  
  if (autocomplete) {
    input.setAttribute('autocomplete', autocomplete);
  }
  
  // Gestion du changement
  if (onChange) {
    input.addEventListener('input', (e) => {
      // Réinitialiser l'état d'erreur lors de la saisie
      if (invalid && e.target.value.trim() !== '') {
        input.setAttribute('aria-invalid', 'false');
        input.classList.remove('input-error');
      }
      onChange(e);
    });
  }
  
  return input;
}
