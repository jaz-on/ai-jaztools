// components/Tabs/Tabs.js
/**
 * Composant Tabs réutilisable
 * @param {object} options
 * @param {Array<Node>} options.children (doivent être des Tab)
 * @returns {HTMLDivElement}
 */
export default function Tabs({ children = [] } = {}) {
  const tabsContainer = document.createElement('div');
  tabsContainer.className = 'tabs';

  // Navigation (boutons)
  const nav = document.createElement('div');
  nav.className = 'tab-navigation';
  const btns = [];
  const contents = [];

  children.forEach((tab, i) => {
    const btn = tab.querySelector('.tab-btn');
    btn.dataset.index = i;
    btns.push(btn);
    nav.appendChild(btn);
    const content = tab.querySelector('.tab-content');
    contents.push(content);
    if (i === 0) {
      btn.classList.add('active');
      content.classList.add('active');
    } else {
      content.classList.remove('active');
    }
    btn.addEventListener('click', () => {
      btns.forEach((b, j) => {
        b.classList.toggle('active', j === i);
        contents[j].classList.toggle('active', j === i);
      });
    });
  });

  tabsContainer.appendChild(nav);
  contents.forEach(content => tabsContainer.appendChild(content));
  return tabsContainer;
}
