/**
 * @module components/Grid
 * 
 * Composant Grid réutilisable
 * 
 * Crée une grille responsive pour organiser le contenu en colonnes.
 */

/**
 * Crée une grille réutilisable
 * 
 * @param {Object} options - Options de configuration
 * @param {number} [options.columns=1] - Nombre de colonnes
 * @param {Array<Node>} [options.children=[]] - Éléments enfants à placer dans la grille
 * @returns {HTMLDivElement} Élément grille créé
 * @example
 * const grid = Grid({
 *   columns: 3,
 *   children: [card1, card2, card3]
 * });
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
