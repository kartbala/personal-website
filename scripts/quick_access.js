// Quick Access Panel - Floating action button with favorite tools and recent pages
// Provides instant access to most-used functionality

class QuickAccessPanel {
  constructor() {
    this.favorites = this.loadFavorites();
    this.recentPages = this.loadRecentPages();
    this.isOpen = false;
    this.shortcuts = this.getDefaultShortcuts();
    
    this.init();
  }

  init() {
    this.createQuickAccessButton();
    this.trackCurrentPage();
    this.setupKeyboardShortcuts();
  }

  getDefaultShortcuts() {
    return [
      { 
        name: 'Enhanced Search', 
        icon: '🔍', 
        action: () => window.EnhancedSiteSearch && new window.EnhancedSiteSearch().openSearch(),
        description: 'Search all tools and content'
      },
      { 
        name: 'World Clock', 
        url: 'world_clock.html', 
        icon: '🌍', 
        description: 'Current time around the world'
      },
      { 
        name: 'Focus Timer', 
        url: 'focus_timer.html', 
        icon: '⏱️', 
        description: 'Pomodoro productivity timer'
      },
      { 
        name: 'Random Generator', 
        url: 'random_generator.html', 
        icon: '🎲', 
        description: 'Generate random numbers, passwords, etc.'
      },
      { 
        name: 'QR Code Generator', 
        url: 'qr_code_generator.html', 
        icon: '📱', 
        description: 'Create QR codes instantly'
      },
      { 
        name: 'Morse Translator', 
        url: 'morse_translator.html', 
        icon: '📡', 
        description: 'Convert text to/from Morse code'
      }
    ];
  }

  createQuickAccessButton() {
    const button = document.createElement('div');
    button.id = 'quick-access-fab';
    button.innerHTML = `
      <button class="fab-main" title="Quick Access" aria-label="Open Quick Access Panel">
        <span class="fab-icon">⚡</span>
      </button>
      
      <div class="fab-panel hidden">
        <div class="fab-header">
          <h3>Quick Access</h3>
          <button class="fab-close" aria-label="Close panel">&times;</button>
        </div>
        
        <div class="fab-content">
          <div class="fab-section">
            <h4>Shortcuts</h4>
            <div id="shortcuts-grid" class="fab-grid"></div>
          </div>
          
          <div class="fab-section">
            <h4>Favorites ⭐</h4>
            <div id="favorites-grid" class="fab-grid"></div>
            <div id="no-favorites" class="fab-empty hidden">
              Click ⭐ on any page to add favorites!
            </div>
          </div>
          
          <div class="fab-section">
            <h4>Recent Pages</h4>
            <div id="recent-grid" class="fab-grid"></div>
          </div>
        </div>
        
        <div class="fab-footer">
          <button class="fab-btn" id="customize-shortcuts">
            <span class="fab-btn-icon">⚙️</span>
            Customize
          </button>
        </div>
      </div>
    `;

    // Add comprehensive styles
    const styles = document.createElement('style');
    styles.textContent = `
      #quick-access-fab {
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 9998;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      .fab-main {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: linear-gradient(135deg, #00246B, #003d82);
        border: none;
        box-shadow: 0 6px 20px rgba(0, 36, 107, 0.4);
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
      }

      .fab-main:hover {
        transform: scale(1.1);
        box-shadow: 0 8px 25px rgba(0, 36, 107, 0.6);
      }

      .fab-main:active {
        transform: scale(0.95);
      }

      .fab-main.open {
        background: #C41E3A;
        transform: rotate(45deg);
      }

      .fab-icon {
        font-size: 28px;
        transition: all 0.3s ease;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
      }

      .fab-main.open .fab-icon {
        transform: rotate(-45deg);
        font-size: 24px;
      }

      .fab-panel {
        position: absolute;
        bottom: 80px;
        left: 0;
        width: 320px;
        max-height: 70vh;
        background: white;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        overflow: hidden;
        transform: translateY(20px) scale(0.8);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid #e5e5e5;
      }

      .fab-panel:not(.hidden) {
        transform: translateY(0) scale(1);
        opacity: 1;
      }

      .fab-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        border-bottom: 1px solid #e5e5e5;
      }

      .fab-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #333;
      }

      .fab-close {
        background: none;
        border: none;
        font-size: 24px;
        color: #666;
        cursor: pointer;
        padding: 4px;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }

      .fab-close:hover {
        background: #e5e5e5;
        color: #333;
      }

      .fab-content {
        max-height: 50vh;
        overflow-y: auto;
        padding: 0;
      }

      .fab-section {
        padding: 16px 20px;
        border-bottom: 1px solid #f0f0f0;
      }

      .fab-section:last-child {
        border-bottom: none;
      }

      .fab-section h4 {
        margin: 0 0 12px 0;
        font-size: 14px;
        font-weight: 600;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .fab-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
        gap: 8px;
      }

      .fab-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 12px 8px;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        background: #f8f9fa;
        border: 1px solid transparent;
        text-decoration: none;
        color: inherit;
        position: relative;
      }

      .fab-item:hover {
        background: #e9ecef;
        border-color: #00246B;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 36, 107, 0.15);
      }

      .fab-item-icon {
        font-size: 24px;
        margin-bottom: 4px;
        filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
      }

      .fab-item-label {
        font-size: 11px;
        font-weight: 500;
        text-align: center;
        color: #333;
        line-height: 1.2;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .fab-item-remove {
        position: absolute;
        top: -4px;
        right: -4px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #ff4757;
        color: white;
        border: none;
        font-size: 12px;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
      }

      .fab-item:hover .fab-item-remove {
        display: flex;
      }

      .fab-empty {
        text-align: center;
        color: #999;
        font-style: italic;
        padding: 20px;
        font-size: 14px;
      }

      .fab-footer {
        padding: 12px 20px;
        background: #f8f9fa;
        border-top: 1px solid #e5e5e5;
      }

      .fab-btn {
        width: 100%;
        padding: 10px 16px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 999px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-size: 14px;
        font-weight: 500;
        color: #333;
      }

      .fab-btn:hover {
        background: #f5f5f5;
        border-color: #00246B;
      }

      .fab-btn-icon {
        font-size: 16px;
      }

      /* Mobile responsive */
      @media (max-width: 768px) {
        #quick-access-fab {
          bottom: 120px; /* Above mobile search button */
        }

        .fab-panel {
          width: calc(100vw - 40px);
          max-width: 300px;
        }

        .fab-main {
          width: 56px;
          height: 56px;
        }

        .fab-icon {
          font-size: 24px;
        }

        .fab-grid {
          grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
        }
      }

      /* Animation for new items */
      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .fab-item.new {
        animation: slideInUp 0.3s ease-out;
      }
    `;

    document.head.appendChild(styles);
    document.body.appendChild(button);

    this.setupEventListeners();
    this.populateContent();
  }

  setupEventListeners() {
    const fabMain = document.querySelector('.fab-main');
    const fabPanel = document.querySelector('.fab-panel');
    const fabClose = document.querySelector('.fab-close');
    const customizeBtn = document.getElementById('customize-shortcuts');

    // Toggle panel
    fabMain.addEventListener('click', () => {
      this.togglePanel();
    });

    fabClose.addEventListener('click', () => {
      this.closePanel();
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#quick-access-fab')) {
        this.closePanel();
      }
    });

    // Customize button
    customizeBtn.addEventListener('click', () => {
      this.showCustomizeDialog();
    });

    // Prevent panel close when clicking inside
    fabPanel.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  togglePanel() {
    this.isOpen = !this.isOpen;
    const fabMain = document.querySelector('.fab-main');
    const fabPanel = document.querySelector('.fab-panel');

    fabMain.classList.toggle('open', this.isOpen);
    fabPanel.classList.toggle('hidden', !this.isOpen);

    if (this.isOpen) {
      this.populateContent();
    }
  }

  closePanel() {
    this.isOpen = false;
    const fabMain = document.querySelector('.fab-main');
    const fabPanel = document.querySelector('.fab-panel');

    fabMain.classList.remove('open');
    fabPanel.classList.add('hidden');
  }

  populateContent() {
    this.populateShortcuts();
    this.populateFavorites();
    this.populateRecentPages();
  }

  populateShortcuts() {
    const container = document.getElementById('shortcuts-grid');
    
    container.innerHTML = this.shortcuts.map(shortcut => {
      const isUrl = shortcut.url;
      const clickHandler = isUrl 
        ? `onclick="window.location.href='${shortcut.url}'"` 
        : `onclick="(${shortcut.action.toString()})()"`;
      
      return `
        <div class="fab-item" ${clickHandler} title="${shortcut.description}">
          <div class="fab-item-icon">${shortcut.icon}</div>
          <div class="fab-item-label">${shortcut.name}</div>
        </div>
      `;
    }).join('');
  }

  populateFavorites() {
    const container = document.getElementById('favorites-grid');
    const emptyMessage = document.getElementById('no-favorites');
    
    if (this.favorites.length === 0) {
      container.innerHTML = '';
      emptyMessage.classList.remove('hidden');
      return;
    }

    emptyMessage.classList.add('hidden');
    
    container.innerHTML = this.favorites.map(fav => `
      <div class="fab-item" onclick="window.location.href='${fav.url}'" title="${fav.title}">
        <div class="fab-item-icon">${this.getIconForUrl(fav.url)}</div>
        <div class="fab-item-label">${fav.title}</div>
        <button class="fab-item-remove" onclick="event.stopPropagation(); this.removeFavorite('${fav.url}')" title="Remove favorite">×</button>
      </div>
    `).join('');

    // Attach remove handlers
    container.querySelectorAll('.fab-item-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const url = e.target.closest('.fab-item').onclick.toString().match(/'([^']+)'/)[1];
        this.removeFavorite(url);
      });
    });
  }

  populateRecentPages() {
    const container = document.getElementById('recent-grid');
    const recent = this.recentPages.slice(-6).reverse();
    
    if (recent.length === 0) {
      container.innerHTML = '<div class="fab-empty">No recent pages</div>';
      return;
    }

    container.innerHTML = recent.map(page => `
      <div class="fab-item" onclick="window.location.href='${page.url}'" title="${page.title}">
        <div class="fab-item-icon">${this.getIconForUrl(page.url)}</div>
        <div class="fab-item-label">${page.title}</div>
      </div>
    `).join('');
  }

  getIconForUrl(url) {
    const urlLower = url.toLowerCase();
    
    if (urlLower.includes('clock')) return '🕐';
    if (urlLower.includes('calculator') || urlLower.includes('math')) return '🔢';
    if (urlLower.includes('timer')) return '⏱️';
    if (urlLower.includes('generator')) return '🎲';
    if (urlLower.includes('qr')) return '📱';
    if (urlLower.includes('morse')) return '📡';
    if (urlLower.includes('tamil')) return '🔤';
    if (urlLower.includes('audio') || urlLower.includes('music')) return '🎵';
    if (urlLower.includes('chart') || urlLower.includes('graph')) return '📊';
    if (urlLower.includes('globe') || urlLower.includes('world')) return '🌍';
    if (urlLower.includes('crypto')) return '₿';
    if (urlLower.includes('bio') || urlLower.includes('about')) return '👤';
    if (urlLower.includes('contact')) return '📧';
    if (urlLower.includes('teaching')) return '🎓';
    if (urlLower.includes('links')) return '🔗';
    if (urlLower.includes('tool')) return '🔧';
    if (urlLower.includes('help')) return '❓';
    
    return '📄';
  }

  addToFavorites(url, title) {
    // Check if already exists
    const exists = this.favorites.find(fav => fav.url === url);
    if (exists) return;

    this.favorites.push({ url, title, timestamp: Date.now() });
    this.saveFavorites();
    
    if (this.isOpen) {
      this.populateFavorites();
    }
  }

  removeFavorite(url) {
    this.favorites = this.favorites.filter(fav => fav.url !== url);
    this.saveFavorites();
    this.populateFavorites();
  }

  trackCurrentPage() {
    const url = window.location.pathname;
    const title = document.title.replace(' - Karthik Balasubramanian', '');
    
    // Don't track the same page twice in a row
    if (this.recentPages.length > 0 && this.recentPages[this.recentPages.length - 1].url === url) {
      return;
    }

    // Remove if already exists
    this.recentPages = this.recentPages.filter(page => page.url !== url);
    
    // Add to end
    this.recentPages.push({
      url,
      title,
      timestamp: Date.now()
    });

    // Keep only last 20 pages
    if (this.recentPages.length > 20) {
      this.recentPages.shift();
    }

    this.saveRecentPages();
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea') {
        return;
      }

      // Alt + Q to toggle quick access
      if (e.altKey && e.key.toLowerCase() === 'q') {
        e.preventDefault();
        this.togglePanel();
      }

      // Quick shortcuts when panel is closed
      if (!this.isOpen && e.altKey) {
        switch(e.key) {
          case '1':
            e.preventDefault();
            if (this.shortcuts[0]) {
              if (this.shortcuts[0].url) {
                window.location.href = this.shortcuts[0].url;
              } else {
                this.shortcuts[0].action();
              }
            }
            break;
          case '2':
            e.preventDefault();
            if (this.shortcuts[1] && this.shortcuts[1].url) {
              window.location.href = this.shortcuts[1].url;
            }
            break;
          case '3':
            e.preventDefault();
            if (this.shortcuts[2] && this.shortcuts[2].url) {
              window.location.href = this.shortcuts[2].url;
            }
            break;
        }
      }
    });
  }

  showCustomizeDialog() {
    // Simple customization for now - could be expanded
    const currentShortcuts = this.shortcuts.map(s => s.name).join('\n');
    const newShortcuts = prompt(
      'Customize your shortcuts (one per line):\n\nNote: This is a basic version. Full customization coming soon!',
      currentShortcuts
    );

    if (newShortcuts !== null) {
      // For now, just show a message
      alert('Customization saved! Full customization features coming in the next update.');
    }
  }

  // Storage methods
  saveFavorites() {
    try {
      localStorage.setItem('quick_access_favorites', JSON.stringify(this.favorites));
    } catch (e) {
      console.warn('Failed to save favorites:', e);
    }
  }

  loadFavorites() {
    try {
      const saved = localStorage.getItem('quick_access_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn('Failed to load favorites:', e);
      return [];
    }
  }

  saveRecentPages() {
    try {
      localStorage.setItem('quick_access_recent', JSON.stringify(this.recentPages));
    } catch (e) {
      console.warn('Failed to save recent pages:', e);
    }
  }

  loadRecentPages() {
    try {
      const saved = localStorage.getItem('quick_access_recent');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn('Failed to load recent pages:', e);
      return [];
    }
  }
}

// Add page favorite functionality
function addPageToFavorites() {
  const quickAccess = window.quickAccessPanel;
  if (quickAccess) {
    const url = window.location.pathname;
    const title = document.title.replace(' - Karthik Balasubramanian', '');
    quickAccess.addToFavorites(url, title);
    
    // Show confirmation
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4caf50;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 10002;
      font-family: sans-serif;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = '⭐ Added to favorites!';
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
      style.remove();
    }, 3000);
  }
}

// Initialize quick access panel
document.addEventListener('DOMContentLoaded', () => {
  window.quickAccessPanel = new QuickAccessPanel();
});

// Export for use in other scripts
window.QuickAccessPanel = QuickAccessPanel;
window.addPageToFavorites = addPageToFavorites;
