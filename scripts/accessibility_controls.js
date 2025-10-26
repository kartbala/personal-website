// Enhanced Accessibility Controls for Low Vision Users
// Font scaling, high contrast, focus modes, and reading preferences

class AccessibilityController {
  constructor() {
    this.fontSizes = {
      'xs': 0.8,
      'sm': 0.9, 
      'md': 1.0,   // default
      'lg': 1.2,
      'xl': 1.4,
      'xxl': 1.6,
      'xxxl': 2.0
    };
    
    this.currentFontSize = this.loadPreference('fontSize', 'lg'); // Default to large for low vision
    this.highContrast = this.loadPreference('highContrast', false);
    this.focusMode = this.loadPreference('focusMode', false);
    this.reducedMotion = this.loadPreference('reducedMotion', false);
    
    this.init();
  }

  init() {
    this.createControlsPanel();
    this.applyPreferences();
    this.setupKeyboardShortcuts();
    this.setupMobileGestures();
  }

  createControlsPanel() {
    // Create floating accessibility panel
    const panel = document.createElement('div');
    panel.id = 'accessibility-panel';
    panel.innerHTML = `
      <button id="a11y-toggle" class="a11y-btn" title="Open Accessibility Controls" aria-label="Open Accessibility Controls">
        <span class="a11y-icon">♿</span>
      </button>
      <div id="a11y-controls" class="a11y-controls hidden">
        <h3>Accessibility Controls</h3>
        
        <div class="a11y-group">
          <label>Text Size:</label>
          <div class="font-controls">
            <button class="a11y-btn" id="font-decrease" title="Decrease font size" aria-label="Decrease font size">A-</button>
            <span id="font-display">Large</span>
            <button class="a11y-btn" id="font-increase" title="Increase font size" aria-label="Increase font size">A+</button>
          </div>
        </div>

        <div class="a11y-group">
          <label>
            <input type="checkbox" id="high-contrast-toggle"> 
            High Contrast Mode
          </label>
        </div>

        <div class="a11y-group">
          <label>
            <input type="checkbox" id="focus-mode-toggle"> 
            Focus Mode (Reduce Clutter)
          </label>
        </div>

        <div class="a11y-group">
          <label>
            <input type="checkbox" id="reduced-motion-toggle"> 
            Reduce Motion
          </label>
        </div>

        <div class="a11y-group">
          <button class="a11y-btn" id="reset-preferences">Reset to Defaults</button>
        </div>

        <div class="a11y-group keyboard-help">
          <small>
            <strong>Keyboard Shortcuts:</strong><br>
            Ctrl/Cmd + Plus: Increase text<br>
            Ctrl/Cmd + Minus: Decrease text<br>
            Ctrl/Cmd + 0: Reset text size<br>
            Alt + C: Toggle contrast<br>
            / : Search
          </small>
        </div>
      </div>
    `;

    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
      #accessibility-panel {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      .a11y-btn {
        background: #00246B;
        color: white;
        border: 2px solid #00246B;
        border-radius: 999px;
        padding: 12px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s ease;
        min-width: 48px;
        min-height: 48px;
      }

      .a11y-btn:hover, .a11y-btn:focus {
        background: #C41E3A;
        border-color: #C41E3A;
        transform: scale(1.05);
      }

      .a11y-controls {
        position: absolute;
        top: 60px;
        right: 0;
        background: white;
        border: 2px solid #00246B;
        border-radius: 12px;
        padding: 20px;
        width: 280px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        color: #333;
      }

      .a11y-controls.hidden {
        display: none;
      }

      .a11y-controls h3 {
        margin: 0 0 16px 0;
        color: #00246B;
        font-size: 18px;
        text-align: center;
      }

      .a11y-group {
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid #eee;
      }

      .a11y-group:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }

      .a11y-group label {
        display: block;
        font-weight: 600;
        margin-bottom: 8px;
        color: #333;
      }

      .font-controls {
        display: flex;
        align-items: center;
        gap: 12px;
        justify-content: center;
      }

      .font-controls .a11y-btn {
        padding: 8px 12px;
        min-width: 40px;
        min-height: 40px;
        font-size: 14px;
      }

      #font-display {
        font-weight: bold;
        min-width: 60px;
        text-align: center;
        color: #00246B;
      }

      .a11y-group input[type="checkbox"] {
        margin-right: 8px;
        transform: scale(1.2);
      }

      .keyboard-help {
        background: #f5f5f5;
        padding: 12px;
        border-radius: 6px;
        font-size: 12px;
        line-height: 1.4;
      }

      /* High contrast mode styles */
      body.high-contrast-mode {
        background: #000 !important;
        color: #ffff00 !important;
      }

      body.high-contrast-mode * {
        background: #000 !important;
        color: #ffff00 !important;
        border-color: #ffff00 !important;
      }

      body.high-contrast-mode a, 
      body.high-contrast-mode .a11y-btn {
        background: #ffff00 !important;
        color: #000 !important;
        font-weight: bold !important;
      }

      body.high-contrast-mode .a11y-controls {
        background: #000 !important;
        border-color: #ffff00 !important;
      }

      /* Focus mode styles */
      body.focus-mode .navigation-cell,
      body.focus-mode .footer,
      body.focus-mode .decorative {
        display: none !important;
      }

      body.focus-mode .layout-table {
        width: 100% !important;
        max-width: 800px !important;
        margin: 0 auto !important;
      }

      body.focus-mode .content-cell {
        padding: 40px !important;
      }

      /* Reduced motion styles */
      body.reduced-motion * {
        animation: none !important;
        transition: none !important;
      }

      /* Mobile responsive */
      @media (max-width: 768px) {
        #accessibility-panel {
          top: 10px;
          right: 10px;
        }

        .a11y-controls {
          width: 260px;
          right: -10px;
        }
      }
    `;

    document.head.appendChild(styles);
    document.body.appendChild(panel);

    this.setupEventListeners();
  }

  setupEventListeners() {
    const toggle = document.getElementById('a11y-toggle');
    const controls = document.getElementById('a11y-controls');
    const fontIncrease = document.getElementById('font-increase');
    const fontDecrease = document.getElementById('font-decrease');
    const highContrastToggle = document.getElementById('high-contrast-toggle');
    const focusModeToggle = document.getElementById('focus-mode-toggle');
    const reducedMotionToggle = document.getElementById('reduced-motion-toggle');
    const resetBtn = document.getElementById('reset-preferences');

    // Toggle controls panel
    toggle.addEventListener('click', () => {
      controls.classList.toggle('hidden');
    });

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#accessibility-panel')) {
        controls.classList.add('hidden');
      }
    });

    // Font size controls
    fontIncrease.addEventListener('click', () => this.increaseFontSize());
    fontDecrease.addEventListener('click', () => this.decreaseFontSize());

    // Toggle controls
    highContrastToggle.addEventListener('change', (e) => {
      this.setHighContrast(e.target.checked);
    });

    focusModeToggle.addEventListener('change', (e) => {
      this.setFocusMode(e.target.checked);
    });

    reducedMotionToggle.addEventListener('change', (e) => {
      this.setReducedMotion(e.target.checked);
    });

    // Reset button
    resetBtn.addEventListener('click', () => this.resetPreferences());

    // Set initial checkbox states
    highContrastToggle.checked = this.highContrast;
    focusModeToggle.checked = this.focusMode;
    reducedMotionToggle.checked = this.reducedMotion;
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Don't interfere with typing in inputs
      if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea') {
        return;
      }

      if ((e.ctrlKey || e.metaKey)) {
        switch(e.key) {
          case '+':
          case '=':
            e.preventDefault();
            this.increaseFontSize();
            break;
          case '-':
            e.preventDefault();
            this.decreaseFontSize();
            break;
          case '0':
            e.preventDefault();
            this.resetFontSize();
            break;
        }
      }

      if (e.altKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        this.toggleHighContrast();
      }
    });
  }

  setupMobileGestures() {
    if ('ontouchstart' in window) {
      let startX = 0;
      let startY = 0;

      document.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) { // Two finger gesture
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
        }
      });

      document.addEventListener('touchend', (e) => {
        if (e.changedTouches.length === 2) {
          const endX = e.changedTouches[0].clientX;
          const endY = e.changedTouches[0].clientY;
          const deltaY = startY - endY;

          if (Math.abs(deltaY) > 50) { // Threshold for gesture
            if (deltaY > 0) {
              this.increaseFontSize(); // Swipe up = larger text
            } else {
              this.decreaseFontSize(); // Swipe down = smaller text
            }
          }
        }
      });
    }
  }

  getFontSizeKey() {
    return Object.keys(this.fontSizes).find(key => this.fontSizes[key] === this.currentFontSize) || 'md';
  }

  getFontSizeNames() {
    return {
      'xs': 'Tiny',
      'sm': 'Small', 
      'md': 'Normal',
      'lg': 'Large',
      'xl': 'Extra Large',
      'xxl': 'Huge',
      'xxxl': 'Maximum'
    };
  }

  updateFontDisplay() {
    const display = document.getElementById('font-display');
    if (display) {
      const key = this.getFontSizeKey();
      display.textContent = this.getFontSizeNames()[key];
    }
  }

  increaseFontSize() {
    const keys = Object.keys(this.fontSizes);
    const currentKey = this.getFontSizeKey();
    const currentIndex = keys.indexOf(currentKey);
    
    if (currentIndex < keys.length - 1) {
      const newKey = keys[currentIndex + 1];
      this.currentFontSize = this.fontSizes[newKey];
      this.applyFontSize();
      this.savePreference('fontSize', newKey);
      this.updateFontDisplay();
      this.announceChange(`Font size increased to ${this.getFontSizeNames()[newKey]}`);
    }
  }

  decreaseFontSize() {
    const keys = Object.keys(this.fontSizes);
    const currentKey = this.getFontSizeKey();
    const currentIndex = keys.indexOf(currentKey);
    
    if (currentIndex > 0) {
      const newKey = keys[currentIndex - 1];
      this.currentFontSize = this.fontSizes[newKey];
      this.applyFontSize();
      this.savePreference('fontSize', newKey);
      this.updateFontDisplay();
      this.announceChange(`Font size decreased to ${this.getFontSizeNames()[newKey]}`);
    }
  }

  resetFontSize() {
    this.currentFontSize = this.fontSizes['md'];
    this.applyFontSize();
    this.savePreference('fontSize', 'md');
    this.updateFontDisplay();
    this.announceChange('Font size reset to normal');
  }

  applyFontSize() {
    document.documentElement.style.fontSize = `${this.currentFontSize}rem`;
  }

  setHighContrast(enabled) {
    this.highContrast = enabled;
    document.body.classList.toggle('high-contrast-mode', enabled);
    this.savePreference('highContrast', enabled);
    this.announceChange(`High contrast mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  toggleHighContrast() {
    this.setHighContrast(!this.highContrast);
    const checkbox = document.getElementById('high-contrast-toggle');
    if (checkbox) checkbox.checked = this.highContrast;
  }

  setFocusMode(enabled) {
    this.focusMode = enabled;
    document.body.classList.toggle('focus-mode', enabled);
    this.savePreference('focusMode', enabled);
    this.announceChange(`Focus mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  setReducedMotion(enabled) {
    this.reducedMotion = enabled;
    document.body.classList.toggle('reduced-motion', enabled);
    this.savePreference('reducedMotion', enabled);
    this.announceChange(`Reduced motion ${enabled ? 'enabled' : 'disabled'}`);
  }

  resetPreferences() {
    this.currentFontSize = this.fontSizes['md'];
    this.highContrast = false;
    this.focusMode = false;
    this.reducedMotion = false;
    
    this.applyPreferences();
    
    // Update checkboxes
    document.getElementById('high-contrast-toggle').checked = false;
    document.getElementById('focus-mode-toggle').checked = false;
    document.getElementById('reduced-motion-toggle').checked = false;
    
    // Clear localStorage
    ['fontSize', 'highContrast', 'focusMode', 'reducedMotion'].forEach(key => {
      localStorage.removeItem(`a11y_${key}`);
    });
    
    this.announceChange('All accessibility preferences reset to defaults');
  }

  applyPreferences() {
    this.applyFontSize();
    this.updateFontDisplay();
    document.body.classList.toggle('high-contrast-mode', this.highContrast);
    document.body.classList.toggle('focus-mode', this.focusMode);
    document.body.classList.toggle('reduced-motion', this.reducedMotion);
  }

  savePreference(key, value) {
    try {
      localStorage.setItem(`a11y_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn('Failed to save accessibility preference:', e);
    }
  }

  loadPreference(key, defaultValue) {
    try {
      const saved = localStorage.getItem(`a11y_${key}`);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (e) {
      console.warn('Failed to load accessibility preference:', e);
      return defaultValue;
    }
  }

  announceChange(message) {
    // Create temporary announcement for screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
}

// Initialize accessibility controls when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new AccessibilityController();
});
