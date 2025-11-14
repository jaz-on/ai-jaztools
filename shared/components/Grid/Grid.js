// components/Grid/Grid.js
/**
 * Composant Grid réutilisable
 * @param {object} options
 * @param {number} options.columns
 * @param {Array<Node>} options.children
 * @returns {HTMLDivElement}
 */
export default function Grid({ columns = 1, children = [] } = {}) {
  const grid = document.createElement('div');
  grid.className = `grid grid-cols-${columns}`;
  if (Array.isArray(children)) {
    children.forEach(child => {
      if (child instanceof Node) grid.appendChild(child);
    });
  }
  return grid;
}
