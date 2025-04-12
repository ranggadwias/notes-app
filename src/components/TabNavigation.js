class TabNavigation extends HTMLElement {
  constructor() {
    super();
    this.selectedTab = 'notes';
  }

  connectedCallback() {
    this.render();

    const notesTab = this.querySelector('[data-tab="notes"]');
    const archiveTab = this.querySelector('[data-tab="archive"]');

    notesTab.addEventListener('click', () => this.activateTab('notes'));
    archiveTab.addEventListener('click', () => this.activateTab('archive'));

    this.activateTab(this.selectedTab);
  }

  render() {
    this.innerHTML = `
      <div class="tabs-container">
        <div data-tab="notes"><p>Notes</p></div>
        <div data-tab="archive"><p>Archive</p></div>
      </div>
    `;
  }

  activateTab(tabName) {
    const notesTab = this.querySelector('[data-tab="notes"]');
    const archiveTab = this.querySelector('[data-tab="archive"]');

    notesTab.classList.remove('active');
    archiveTab.classList.remove('active');

    if (tabName === 'notes') {
      notesTab.classList.add('active');
    } else {
      archiveTab.classList.add('active');
    }

    this.selectedTab = tabName;

    this.dispatchEvent(
      new CustomEvent('tab-changed', {
        detail: { selectedTab: tabName },
        bubbles: true,
      }),
    );
  }
}

customElements.define('tab-navigation', TabNavigation);
