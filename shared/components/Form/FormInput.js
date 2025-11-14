// components/Form/FormInput.js
/**
 * Composant FormInput réutilisable
 * @param {object} options
 * @param {string} options.id
 * @param {string} options.type
 * @param {string} options.value
 * @param {function} options.onChange
 * @param {string} options.placeholder
 * @param {boolean} options.required
 * @param {boolean} options.disabled
 * @returns {HTMLInputElement}
 */
export default function FormInput({ id = '', type = 'text', value = '', onChange = null, placeholder = '', required = false, disabled = false } = {}) {
  const input = document.createElement('input');
  input.className = 'form-input';
  input.id = id;
  input.type = type;
  input.value = value;
  input.placeholder = placeholder;
  input.required = !!required;
  input.disabled = !!disabled;
  if (onChange) input.addEventListener('input', onChange);
  return input;
}
