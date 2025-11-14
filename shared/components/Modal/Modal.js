// components/Modal/Modal.js
/**
 * Composant Modal réutilisable
 * @param {object} options
 * @param {boolean} options.open
 * @param {function} options.onClose
 * @param {string} options.title
 * @param {string|Node|Array} options.children
 * @returns {HTMLDivElement}
 */
export default function Modal({ open = false, onClose = null, title = '', children = '' } = {}) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.style.display = open ? 'flex' : 'none';
  const dialog = document.createElement('div');
  dialog.className = 'modal-dialog';
  if (title) {
    const h3 = document.createElement('h3');
    h3.className = 'modal-title';
    h3.textContent = title;
    dialog.appendChild(h3);
  }
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
  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal-close';
  closeBtn.textContent = '×';
  closeBtn.onclick = () => { if (onClose) onClose(); overlay.style.display = 'none'; };
  dialog.appendChild(closeBtn);
  overlay.appendChild(dialog);
  overlay.onclick = (e) => { if (e.target === overlay && onClose) onClose(); };
  return overlay;
}
