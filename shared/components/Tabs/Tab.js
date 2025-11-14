/**
 * @module components/Tabs/Tab
 * 
 * Composant Tab réutilisable
 * 
 * Crée un onglet individuel pour être utilisé dans un composant Tabs.
 */

/**
 * Crée un onglet réutilisable
 * 
 * @param {Object} options - Options de configuration
 * @param {string} [options.label=''] - Label de l'onglet
 * @param {string|Node|Array} [options.children=''] - Contenu de l'onglet
 * @returns {DocumentFragment} Fragment contenant le bouton et le contenu de l'onglet
 * @example
 * const tab = Tab({
 *   label: 'Onglet 1',
 *   children: 'Contenu de l\'onglet'
 * });
 */
export default function Tab({ label = '', children = '' } = {}) {
  const frag = document.createDocumentFragment();
  const btn = document.createElement('button');
  btn.className = 'tab-btn';
  btn.textContent = label;
  frag.appendChild(btn);
  const content = document.createElement('div');
  content.className = 'tab-content';
  if (typeof children === 'string') {
    content.textContent = children;
  } else if (children instanceof Node) {
    content.appendChild(children);
  } else if (Array.isArray(children)) {
    children.forEach(child => {
      if (typeof child === 'string') {
        content.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        content.appendChild(child);
      }
    });
  }
  frag.appendChild(content);
  return frag;
}
