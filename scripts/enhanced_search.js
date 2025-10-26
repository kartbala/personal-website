// Enhanced Site Search with AI-powered suggestions and content indexing
// Improves upon the existing search with better functionality

class EnhancedSiteSearch {
  constructor() {
    this.searchData = [];
    this.searchHistory = this.loadSearchHistory();
    this.favorites = this.loadFavorites();
    this.recentlyViewed = this.loadRecentlyViewed();
    this.isLoading = false;
    
    this.init();
  }

  init() {
    this.loadSearchIndex();
    this.trackPageView();
    this.setupKeyboardShortcuts();
    this.createMobileSearchButton();
  }

  async loadSearchIndex() {
    if (this.isLoading) return;
    this.isLoading = true;
    
    try {
      const response = await fetch('search_index.json');
      this.searchData = await response.json();
      
      // Enhance search data with additional metadata
      this.enhanceSearchData();
      this.isLoading = false;
    } catch (error) {
      console.warn('Failed to load search index:', error);
      this.isLoading = false;
    }
  }

  enhanceSearchData() {
    this.searchData = this.searchData.map(item => ({
      ...item,
      category: this.categorizeItem(item),
      popularity: this.getPopularity(item.url),
      lastViewed: this.getLastViewed(item.url)
    }));
  }

  categorizeItem(item) {
    const url = item.url.toLowerCase();
    const title = item.title.toLowerCase();
    
    if (url.includes('clock') || title.includes('clock') || title.includes('time')) return 'clocks';
    if (url.includes('math') || title.includes('math') || title.includes('fibonacci') || title.includes('prime')) return 'mathematics';
    if (title.includes('tamil') || title.includes('தமிழ்')) return 'language';
    if (url.includes('audio') || title.includes('audio') || title.includes('music')) return 'audio';
    if (url.includes('election') || title.includes('election') || title.includes('voting')) return 'civic';
    if (url.includes('tool') || title.includes('calculator') || title.includes('generator')) return 'tools';
    if (url.includes('visualization') || title.includes('chart') || title.includes('graph')) return 'visualizations';
    if (url.includes('teaching') || url.includes('expertise') || url.includes('publication')) return 'academic';
    if (url.includes('bio') || url.includes('about') || url.includes('contact')) return 'personal';
    
    return 'other';
  }

  getPopularity(url) {
    const visits = this.recentlyViewed.filter(item => item.url === url).length;
    return visits;
  }

  getLastViewed(url) {
    const viewed = this.recentlyViewed.find(item => item.url === url);
    return viewed ? viewed.timestamp : null;
  }

  createSearchOverlay() {
    if (document.getElementById('enhanced-search-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'enhanced-search-overlay';
    overlay.innerHTML = `
      <div class="search-backdrop"></div>
      <div class="search-container">
        <div class="search-header">
          <input type="text" id="search-input" placeholder="Search tools, visualizations, and content..." autocomplete="off">
          <button id="search-close" aria-label="Close search">&times;</button>
        </div>
        
        <div class="search-filters">
          <button class="filter-btn active" data-category="all">All</button>
          <button class="filter-btn" data-category="tools">Tools</button>
          <button class="filter-btn" data-category="visualizations">Visualizations</button>
          <button class="filter-btn" data-category="clocks">Clocks</button>
          <button class="filter-btn" data-category="mathematics">Math</button>
          <button class="filter-btn" data-category="academic">Academic</button>
          <button class="filter-btn" data-category="civic">Civic</button>
        </div>

        <div class="search-content">
          <div id="search-suggestions" class="search-section">
            <h3>Quick Access</h3>
            <div id="suggestions-list"></div>
          </div>
          
          <div id="search-results" class="search-section hidden">
            <h3>Search Results</h3>
            <div id="results-list"></div>
          </div>
          
          <div id="search-history" class="search-section">
            <h3>Recent Searches</h3>
            <div id="history-list"></div>
          </div>
          
          <div id="search-favorites" class="search-section">
            <h3>Favorites ⭐</h3>
            <div id="favorites-list"></div>
          </div>
        </div>
        
        <div class="search-footer">
          <div class="search-tips">
            <span><kbd>/</kbd> to search</span>
            <span><kbd>↑↓</kbd> navigate</span>
            <span><kbd>Enter</kbd> open</span>
            <span><kbd>Esc</kbd> close</span>
          </div>
        </div>
      </div>
    `;

    // Add comprehensive styles
    const styles = document.createElement('style');
    styles.textContent = `
      #enhanced-search-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10001;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding: 5vh 1rem;
        animation: searchFadeIn 0.2s ease-out;
      }

      @keyframes searchFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      .search-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(4px);
      }

      .search-container {
        position: relative;
        background: white;
        border-radius: 16px;
        width: 100%;
        max-width: 700px;
        max-height: 80vh;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        display: flex;
        flex-direction: column;
        animation: searchSlideIn 0.3s ease-out;
      }

      @keyframes searchSlideIn {
        from { transform: translateY(-20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }

      .search-header {
        display: flex;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid #e5e5e5;
        background: #f8f9fa;
      }

      #search-input {
        flex: 1;
        border: none;
        outline: none;
        font-size: 1.2rem;
        padding: 0.75rem;
        background: transparent;
        color: #333;
        font-family: Georgia, serif;
      }

      #search-input::placeholder {
        color: #999;
      }

      #search-close {
        background: none;
        border: none;
        font-size: 2rem;
        color: #666;
        cursor: pointer;
        padding: 0.5rem;
        line-height: 1;
        border-radius: 999px;
        min-width: 48px;
        min-height: 48px;
      }

      #search-close:hover {
        background: #e5e5e5;
        color: #333;
      }

      .search-filters {
        display: flex;
        gap: 0.5rem;
        padding: 1rem;
        background: #f8f9fa;
        border-bottom: 1px solid #e5e5e5;
        flex-wrap: wrap;
      }

      .filter-btn {
        background: white;
        border: 1px solid #ddd;
        border-radius: 999px;
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s ease;
        color: #666;
      }

      .filter-btn:hover, .filter-btn.active {
        background: #00246B;
        color: white;
        border-color: #00246B;
      }

      .search-content {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
      }

      .search-section {
        margin-bottom: 2rem;
      }

      .search-section:last-child {
        margin-bottom: 0;
      }

      .search-section.hidden {
        display: none;
      }

      .search-section h3 {
        font-size: 1rem;
        color: #666;
        margin: 0 0 0.75rem 0;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .search-item {
        display: flex;
        align-items: center;
        padding: 0.75rem;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        border: 1px solid transparent;
        margin-bottom: 0.5rem;
        position: relative;
      }

      .search-item:hover, .search-item.selected {
        background: #f0f7ff;
        border-color: #00246B;
      }

      .search-item-icon {
        width: 40px;
        height: 40px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 0.75rem;
        font-size: 1.2rem;
        background: #f5f5f5;
        color: #666;
      }

      .search-item-content {
        flex: 1;
        min-width: 0;
      }

      .search-item-title {
        font-weight: 600;
        color: #333;
        margin-bottom: 0.25rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .search-item-description {
        font-size: 0.9rem;
        color: #666;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .search-item-meta {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        font-size: 0.8rem;
        color: #999;
        margin-left: 0.5rem;
      }

      .search-item-category {
        background: #e5e5e5;
        color: #666;
        padding: 0.2rem 0.5rem;
        border-radius: 12px;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 0.25rem;
      }

      .search-item-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.25rem;
      }

      .action-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 999px;
        color: #999;
        font-size: 0.9rem;
        transition: all 0.2s ease;
      }

      .action-btn:hover {
        background: #e5e5e5;
        color: #333;
      }

      .action-btn.favorited {
        color: #ffd700;
      }

      .search-footer {
        border-top: 1px solid #e5e5e5;
        padding: 0.75rem 1rem;
        background: #f8f9fa;
      }

      .search-tips {
        display: flex;
        gap: 1rem;
        justify-content: center;
        font-size: 0.8rem;
        color: #666;
      }

      .search-tips kbd {
        background: #e5e5e5;
        border: 1px solid #ccc;
        border-radius: 3px;
        padding: 0.1rem 0.3rem;
        font-family: monospace;
        font-size: 0.75rem;
      }

      mark {
        background: #ffeb3b;
        color: inherit;
        padding: 0;
        border-radius: 2px;
      }

      .category-icons {
        tools: '🔧',
        visualizations: '📊',
        clocks: '🕐',
        mathematics: '🔢',
        academic: '🎓',
        civic: '🏛️',
        language: '🔤',
        audio: '🎵',
        personal: '👤',
        other: '📄'
      }

      /* Mobile responsive */
      @media (max-width: 768px) {
        #enhanced-search-overlay {
          padding: 2vh 0.5rem;
        }

        .search-container {
          max-height: 90vh;
        }

        .search-filters {
          gap: 0.25rem;
        }

        .filter-btn {
          font-size: 0.8rem;
          padding: 0.4rem 0.8rem;
        }

        .search-item {
          padding: 0.5rem;
        }

        .search-item-icon {
          width: 32px;
          height: 32px;
          margin-right: 0.5rem;
        }

        .search-tips {
          gap: 0.5rem;
          font-size: 0.75rem;
        }
      }
    `;

    document.head.appendChild(styles);
    document.body.appendChild(overlay);

    this.setupSearchEventListeners();
    this.loadInitialContent();
    this.focusSearchInput();
  }

  setupSearchEventListeners() {
    const overlay = document.getElementById('enhanced-search-overlay');
    const input = document.getElementById('search-input');
    const closeBtn = document.getElementById('search-close');
    const backdrop = overlay.querySelector('.search-backdrop');
    const filters = overlay.querySelectorAll('.filter-btn');

    let selectedIndex = -1;
    let currentFilter = 'all';

    // Close search
    const closeSearch = () => {
      overlay.remove();
    };

    closeBtn.addEventListener('click', closeSearch);
    backdrop.addEventListener('click', closeSearch);

    // Search input
    input.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      if (query.length > 0) {
        this.performSearch(query, currentFilter);
        this.addToSearchHistory(query);
      } else {
        this.showSuggestions(currentFilter);
      }
      selectedIndex = -1;
    });

    // Filter buttons
    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        filters.forEach(f => f.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.category;
        
        const query = input.value.trim();
        if (query.length > 0) {
          this.performSearch(query, currentFilter);
        } else {
          this.showSuggestions(currentFilter);
        }
      });
    });

    // Keyboard navigation
    input.addEventListener('keydown', (e) => {
      const items = overlay.querySelectorAll('.search-item:not(.hidden)');
      
      switch(e.key) {
        case 'Escape':
          closeSearch();
          break;
        case 'ArrowDown':
          e.preventDefault();
          selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
          this.updateSelection(items, selectedIndex);
          break;
        case 'ArrowUp':
          e.preventDefault();
          selectedIndex = Math.max(selectedIndex - 1, -1);
          this.updateSelection(items, selectedIndex);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && items[selectedIndex]) {
            const link = items[selectedIndex].querySelector('a') || items[selectedIndex];
            if (link.href) {
              window.location.href = link.href;
            }
          }
          break;
      }
    });
  }

  updateSelection(items, index) {
    items.forEach((item, i) => {
      item.classList.toggle('selected', i === index);
    });

    if (index >= 0 && items[index]) {
      items[index].scrollIntoView({ block: 'nearest' });
    }
  }

  loadInitialContent() {
    this.showSuggestions('all');
    this.showSearchHistory();
    this.showFavorites();
  }

  showSuggestions(category = 'all') {
    const container = document.getElementById('suggestions-list');
    const resultsSection = document.getElementById('search-results');
    const suggestionsSection = document.getElementById('search-suggestions');
    
    resultsSection.classList.add('hidden');
    suggestionsSection.classList.remove('hidden');

    // Show popular/recent items as suggestions
    let suggestions = this.searchData
      .filter(item => category === 'all' || item.category === category)
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 6);

    if (suggestions.length === 0) {
      suggestions = this.searchData.slice(0, 6);
    }

    container.innerHTML = suggestions.map(item => this.createSearchItemHTML(item)).join('');
    this.attachItemEventListeners(container);
  }

  performSearch(query, category = 'all') {
    const resultsSection = document.getElementById('search-results');
    const suggestionsSection = document.getElementById('search-suggestions');
    const container = document.getElementById('results-list');
    
    suggestionsSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');

    const results = this.searchInData(query, category);
    
    if (results.length === 0) {
      container.innerHTML = '<div class="no-results">No results found. Try a different search term or category.</div>';
    } else {
      container.innerHTML = results.map(item => this.createSearchItemHTML(item, query)).join('');
      this.attachItemEventListeners(container);
    }
  }

  searchInData(query, category = 'all') {
    const normalizedQuery = query.toLowerCase();
    
    return this.searchData
      .filter(item => {
        const matchesCategory = category === 'all' || item.category === category;
        const matchesText = 
          item.title.toLowerCase().includes(normalizedQuery) ||
          (item.text && item.text.toLowerCase().includes(normalizedQuery)) ||
          (item.description && item.description.toLowerCase().includes(normalizedQuery));
        
        return matchesCategory && matchesText;
      })
      .sort((a, b) => {
        // Prioritize title matches, then popularity, then recency
        const aTitle = a.title.toLowerCase().includes(normalizedQuery) ? 2 : 0;
        const bTitle = b.title.toLowerCase().includes(normalizedQuery) ? 2 : 0;
        const aScore = aTitle + (a.popularity || 0);
        const bScore = bTitle + (b.popularity || 0);
        
        return bScore - aScore;
      })
      .slice(0, 20);
  }

  createSearchItemHTML(item, query = '') {
    const categoryIcons = {
      tools: '🔧',
      visualizations: '📊',
      clocks: '🕐',
      mathematics: '🔢',
      academic: '🎓',
      civic: '🏛️',
      language: '🔤',
      audio: '🎵',
      personal: '👤',
      other: '📄'
    };

    const icon = categoryIcons[item.category] || categoryIcons.other;
    const title = query ? this.highlightText(item.title, query) : item.title;
    const description = item.description || this.getDescriptionFromCategory(item.category);
    const isFavorited = this.favorites.includes(item.url);

    return `
      <div class="search-item" data-url="${item.url}">
        <div class="search-item-icon">${icon}</div>
        <div class="search-item-content">
          <div class="search-item-title">${title}</div>
          <div class="search-item-description">${description}</div>
        </div>
        <div class="search-item-meta">
          <div class="search-item-category">${item.category}</div>
          <div class="search-item-actions">
            <button class="action-btn favorite-btn ${isFavorited ? 'favorited' : ''}" 
                    data-url="${item.url}" title="Toggle favorite">
              ${isFavorited ? '⭐' : '☆'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  getDescriptionFromCategory(category) {
    const descriptions = {
      tools: 'Interactive utility tool',
      visualizations: 'Data visualization or animation',
      clocks: 'Time display or clock interface',
      mathematics: 'Mathematical concept or calculator',
      academic: 'Research, teaching, or academic content',
      civic: 'Civic engagement or transportation',
      language: 'Language learning or translation',
      audio: 'Audio or music related tool',
      personal: 'Personal information or biography',
      other: 'General content'
    };
    return descriptions[category] || descriptions.other;
  }

  highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  attachItemEventListeners(container) {
    // Navigate to item
    container.querySelectorAll('.search-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (!e.target.classList.contains('action-btn')) {
          const url = item.dataset.url;
          this.addToRecentlyViewed(url);
          window.location.href = url;
        }
      });
    });

    // Favorite buttons
    container.querySelectorAll('.favorite-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const url = btn.dataset.url;
        this.toggleFavorite(url);
        btn.classList.toggle('favorited');
        btn.textContent = btn.classList.contains('favorited') ? '⭐' : '☆';
        this.showFavorites(); // Refresh favorites display
      });
    });
  }

  showSearchHistory() {
    const container = document.getElementById('history-list');
    const recent = this.searchHistory.slice(-5).reverse();
    
    if (recent.length === 0) {
      container.innerHTML = '<div class="no-items">No recent searches</div>';
      return;
    }

    container.innerHTML = recent.map(query => `
      <div class="search-item history-item" data-query="${query}">
        <div class="search-item-icon">🔍</div>
        <div class="search-item-content">
          <div class="search-item-title">${query}</div>
          <div class="search-item-description">Recent search</div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.history-item').forEach(item => {
      item.addEventListener('click', () => {
        const query = item.dataset.query;
        document.getElementById('search-input').value = query;
        this.performSearch(query, 'all');
      });
    });
  }

  showFavorites() {
    const container = document.getElementById('favorites-list');
    const favoriteItems = this.searchData.filter(item => this.favorites.includes(item.url));
    
    if (favoriteItems.length === 0) {
      container.innerHTML = '<div class="no-items">No favorites yet. Click ☆ to add favorites!</div>';
      return;
    }

    container.innerHTML = favoriteItems.map(item => this.createSearchItemHTML(item)).join('');
    this.attachItemEventListeners(container);
  }

  toggleFavorite(url) {
    const index = this.favorites.indexOf(url);
    if (index >= 0) {
      this.favorites.splice(index, 1);
    } else {
      this.favorites.push(url);
    }
    this.saveFavorites();
  }

  addToSearchHistory(query) {
    if (query.length < 2) return;
    
    // Remove if already exists
    const index = this.searchHistory.indexOf(query);
    if (index >= 0) {
      this.searchHistory.splice(index, 1);
    }
    
    this.searchHistory.push(query);
    
    // Keep only last 20 searches
    if (this.searchHistory.length > 20) {
      this.searchHistory.shift();
    }
    
    this.saveSearchHistory();
  }

  addToRecentlyViewed(url) {
    const item = { url, timestamp: Date.now() };
    
    // Remove if already exists
    this.recentlyViewed = this.recentlyViewed.filter(item => item.url !== url);
    this.recentlyViewed.push(item);
    
    // Keep only last 50 items
    if (this.recentlyViewed.length > 50) {
      this.recentlyViewed.shift();
    }
    
    this.saveRecentlyViewed();
  }

  trackPageView() {
    const currentUrl = window.location.pathname;
    this.addToRecentlyViewed(currentUrl);
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea') {
        return;
      }

      if (e.key === '/') {
        e.preventDefault();
        this.openSearch();
      }
    });
  }

  createMobileSearchButton() {
    if (document.getElementById('mobile-search-btn-enhanced')) return;

    const btn = document.createElement('button');
    btn.id = 'mobile-search-btn-enhanced';
    btn.innerHTML = '🔍';
    btn.title = 'Search';
    btn.setAttribute('aria-label', 'Open search');

    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '80px', // Above accessibility panel
      right: '20px',
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      border: 'none',
      background: '#C41E3A',
      color: '#fff',
      fontSize: '24px',
      zIndex: '9999',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'none'
    });

    btn.addEventListener('click', () => this.openSearch());
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'scale(1.1)';
      btn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'scale(1)';
      btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    });

    document.body.appendChild(btn);

    // Show/hide based on screen size
    const mq = window.matchMedia('(max-width: 768px)');
    function updateVisibility() {
      btn.style.display = mq.matches ? 'block' : 'none';
    }
    mq.addListener(updateVisibility);
    updateVisibility();
  }

  focusSearchInput() {
    const input = document.getElementById('search-input');
    if (input) {
      input.focus();
    }
  }

  openSearch() {
    if (this.searchData.length === 0 && !this.isLoading) {
      this.loadSearchIndex().then(() => {
        this.createSearchOverlay();
      });
    } else {
      this.createSearchOverlay();
    }
  }

  // Storage methods
  saveSearchHistory() {
    try {
      localStorage.setItem('search_history', JSON.stringify(this.searchHistory));
    } catch (e) {
      console.warn('Failed to save search history:', e);
    }
  }

  loadSearchHistory() {
    try {
      const saved = localStorage.getItem('search_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn('Failed to load search history:', e);
      return [];
    }
  }

  saveFavorites() {
    try {
      localStorage.setItem('search_favorites', JSON.stringify(this.favorites));
    } catch (e) {
      console.warn('Failed to save favorites:', e);
    }
  }

  loadFavorites() {
    try {
      const saved = localStorage.getItem('search_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn('Failed to load favorites:', e);
      return [];
    }
  }

  saveRecentlyViewed() {
    try {
      localStorage.setItem('recently_viewed', JSON.stringify(this.recentlyViewed));
    } catch (e) {
      console.warn('Failed to save recently viewed:', e);
    }
  }

  loadRecentlyViewed() {
    try {
      const saved = localStorage.getItem('recently_viewed');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn('Failed to load recently viewed:', e);
      return [];
    }
  }
}

// Initialize enhanced search
document.addEventListener('DOMContentLoaded', () => {
  new EnhancedSiteSearch();
});

// Export for use in other scripts
window.EnhancedSiteSearch = EnhancedSiteSearch;
