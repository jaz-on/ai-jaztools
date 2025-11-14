// components/Progress/ProgressBar.js
/**
 * Composant ProgressBar réutilisable
 * @param {object} options
 * @param {number} options.value
 * @param {number} options.max
 * @returns {HTMLDivElement}
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
