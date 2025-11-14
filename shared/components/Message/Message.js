// components/Message/Message.js
/**
 * Composant Message réutilisable
 * @param {object} options
 * @param {string} options.type
 * @param {string|Node|Array} options.children
 * @returns {HTMLDivElement}
 */
export default function Message({ type = 'info', children = '' } = {}) {
  const msg = document.createElement('div');
  msg.className = `message ${type}`;
  if (typeof children === 'string') {
    msg.textContent = children;
  } else if (children instanceof Node) {
    msg.appendChild(children);
  } else if (Array.isArray(children)) {
    children.forEach(child => {
      if (typeof child === 'string') {
        msg.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        msg.appendChild(child);
      }
    });
  }
  return msg;
}
