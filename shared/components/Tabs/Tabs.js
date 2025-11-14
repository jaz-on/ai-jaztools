/**
 * @module components/Tabs
 * 
 * Composant Tabs réutilisable avec support d'accessibilité complet
 * 
 * Crée un système d'onglets accessible avec navigation clavier
 * (flèches, Home, End) et support complet des attributs ARIA.
 */

/**
 * Crée un système d'onglets réutilisable avec support d'accessibilité complet
 * 
 * @param {Object} options - Options de configuration
 * @param {Array<Node>} [options.children=[]] - Tableau d'éléments Tab (doivent être des Tab)
 * @param {string} [options.ariaLabel='Onglets'] - Label ARIA pour le groupe d'onglets
 * @returns {HTMLDivElement} Conteneur des onglets
 * @example
 * const tab1 = Tab({ label: 'Onglet 1', children: 'Contenu 1' });
 * const tab2 = Tab({ label: 'Onglet 2', children: 'Contenu 2' });
 * const tabs = Tabs({ children: [tab1, tab2], ariaLabel: 'Navigation principale' });
 */
export default function Tabs({ children = [], ariaLabel = 'Onglets' } = {}) {
  const tabsContainer = document.createElement('div');
  tabsContainer.className = 'tabs';

  // Navigation (boutons) avec attributs ARIA
  const nav = document.createElement('div');
  nav.className = 'tab-navigation';
  nav.setAttribute('role', 'tablist');
  nav.setAttribute('aria-label', ariaLabel);
  
  const btns = [];
  const contents = [];
  const tabIds = [];

  children.forEach((tab, i) => {
    const btn = tab.querySelector('.tab-btn');
    const content = tab.querySelector('.tab-content');
    
    // Générer des IDs uniques
    const tabId = `tab-${i}-${Math.random().toString(36).substr(2, 9)}`;
    const panelId = `tabpanel-${i}-${Math.random().toString(36).substr(2, 9)}`;
    tabIds.push({ tabId, panelId });
    
    // Configurer le bouton avec attributs ARIA
    btn.setAttribute('role', 'tab');
    btn.setAttribute('id', tabId);
    btn.setAttribute('aria-controls', panelId);
    btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    btn.setAttribute('tabindex', i === 0 ? '0' : '-1');
    btn.dataset.index = i;
    
    // Configurer le contenu avec attributs ARIA
    content.setAttribute('role', 'tabpanel');
    content.setAttribute('id', panelId);
    content.setAttribute('aria-labelledby', tabId);
    content.setAttribute('tabindex', '0');
    
    btns.push(btn);
    contents.push(content);
    nav.appendChild(btn);
    
    // État initial
    if (i === 0) {
      btn.classList.add('active');
      content.classList.add('active');
      content.setAttribute('aria-hidden', 'false');
    } else {
      content.classList.remove('active');
      content.setAttribute('aria-hidden', 'true');
    }
    
    // Gestion du clic
    btn.addEventListener('click', () => {
      switchTab(i);
    });
    
    // Navigation clavier
    btn.addEventListener('keydown', (e) => {
      handleKeyDown(e, i);
    });
  });

  // Fonction pour changer d'onglet
  function switchTab(index) {
    btns.forEach((b, j) => {
      const isActive = j === index;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-selected', isActive ? 'true' : 'false');
      b.setAttribute('tabindex', isActive ? '0' : '-1');
      
      contents[j].classList.toggle('active', isActive);
      contents[j].setAttribute('aria-hidden', isActive ? 'false' : 'true');
    });
    
    // Focuser le nouvel onglet actif
    btns[index].focus();
  }

  // Gestion de la navigation clavier
  function handleKeyDown(e, currentIndex) {
    let targetIndex = currentIndex;
    
    switch(e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        targetIndex = (currentIndex + 1) % btns.length;
        switchTab(targetIndex);
        break;
        
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        targetIndex = (currentIndex - 1 + btns.length) % btns.length;
        switchTab(targetIndex);
        break;
        
      case 'Home':
        e.preventDefault();
        switchTab(0);
        break;
        
      case 'End':
        e.preventDefault();
        switchTab(btns.length - 1);
        break;
    }
  }

  tabsContainer.appendChild(nav);
  contents.forEach(content => tabsContainer.appendChild(content));
  return tabsContainer;
}
