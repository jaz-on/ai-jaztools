/**
 * @module components/Loader
 * 
 * Composant Loader réutilisable
 * 
 * Crée un indicateur de chargement avec spinner et message optionnel.
 */

/**
 * Crée un indicateur de chargement réutilisable
 * 
 * @param {Object} options - Options de configuration
 * @param {string} [options.message='Chargement...'] - Message à afficher
 * @returns {HTMLDivElement} Élément loader créé
 * @example
 * const loader = Loader({
 *   message: 'Chargement des données...'
 * });
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
