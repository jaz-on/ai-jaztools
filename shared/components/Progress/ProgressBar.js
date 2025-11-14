/**
 * @module components/Progress/ProgressBar
 * 
 * Composant ProgressBar réutilisable
 * 
 * Crée une barre de progression pour afficher l'avancement d'une tâche.
 */

/**
 * Crée une barre de progression réutilisable
 * 
 * @param {Object} options - Options de configuration
 * @param {number} [options.value=0] - Valeur actuelle de la progression
 * @param {number} [options.max=100] - Valeur maximale
 * @returns {HTMLDivElement} Élément barre de progression créé
 * @example
 * const progress = ProgressBar({
 *   value: 50,
 *   max: 100
 * });
 */
export default function ProgressBar({ value = 0, max = 100 } = {}) {
  const bar = document.createElement('div');
  bar.className = 'progress-bar';
  const fill = document.createElement('div');
  fill.className = 'progress-fill';
  fill.style.width = `${Math.min(100, Math.max(0, (value / max) * 100))}%`;
  bar.appendChild(fill);
  return bar;
}
