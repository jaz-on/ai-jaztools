// components/Loader/Loader.js
/**
 * Composant Loader réutilisable
 * @param {object} options
 * @param {string} options.message
 * @returns {HTMLDivElement}
 */
export default function Loader({ message = 'Chargement...' } = {}) {
  const loading = document.createElement('div');
  loading.className = 'loading';
  const spinner = document.createElement('div');
  spinner.className = 'loading-spinner';
  loading.appendChild(spinner);
  if (message) {
    const p = document.createElement('p');
    p.textContent = message;
    loading.appendChild(p);
  }
  return loading;
}
