/**
 * @module components/Card
 * 
 * Composant Card réutilisable
 * 
 * Crée une carte conteneur pour organiser le contenu.
 */

/**
 * Crée une carte réutilisable
 * 
 * @param {Object} options - Options de configuration
 * @param {string|Node|Array} [options.children=''] - Contenu de la carte
 * @returns {HTMLDivElement} Élément carte créé
 * @example
 * const card = Card({
 *   children: [
 *     Header({ title: 'Titre', subtitle: 'Sous-titre' }),
 *     'Contenu de la carte'
 *   ]
 * });
 */
export default function Card({ children = '' } = {}) {
  const card = document.createElement('div');
  card.className = 'card';
  if (typeof children === 'string') {
    card.textContent = children;
  } else if (children instanceof Node) {
    card.appendChild(children);
  } else if (Array.isArray(children)) {
    children.forEach(child => {
      if (typeof child === 'string') {
        card.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        card.appendChild(child);
      }
    });
  }
  return card;
}
