// components/Tabs/Tab.js
/**
 * Composant Tab réutilisable
 * @param {object} options
 * @param {string} options.label
 * @param {string|Node|Array} options.children
 * @returns {DocumentFragment}
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
