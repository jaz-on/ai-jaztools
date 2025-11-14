/**
 * @module components/Header
 * 
 * Composant Header réutilisable
 * 
 * Crée un en-tête avec titre et sous-titre.
 */

/**
 * Crée un en-tête réutilisable
 * 
 * @param {Object} options - Options de configuration
 * @param {string} [options.title=''] - Titre principal
 * @param {string} [options.subtitle=''] - Sous-titre optionnel
 * @returns {HTMLElement} Élément header créé
 * @example
 * const header = Header({
 *   title: 'Mon Application',
 *   subtitle: 'Description de l\'application'
 * });
 */
export default function Header({ title = '', subtitle = '' } = {}) {
  const header = document.createElement('header');
  header.className = 'app-header';
  if (title) {
    const h1 = document.createElement('h1');
    h1.textContent = title;
    header.appendChild(h1);
  }
  if (subtitle) {
    const p = document.createElement('p');
    p.className = 'subtitle';
    p.textContent = subtitle;
    header.appendChild(p);
  }
  return header;
}
