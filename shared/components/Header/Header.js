// components/Header/Header.js
/**
 * Composant Header réutilisable
 * @param {object} options
 * @param {string} options.title
 * @param {string} options.subtitle
 * @returns {HTMLElement}
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
