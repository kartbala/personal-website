// Progressive Web App initialization and management
// Handles service worker registration, installation prompts, and PWA features

class PWAManager {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.swRegistration = null;
    
    this.init();
  }

  async init() {
    await this.registerServiceWorker();
    this.setupInstallPrompt();
    this.setupUpdateNotifications();
    this.createInstallButton();
    this.trackUsage();
    this.setupShareTarget();
  }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        console.log('Registering service worker...');
        
        this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });

        console.log('Service Worker registered successfully:', this.swRegistration);

        // Handle updates
        this.swRegistration.addEventListener('updatefound', () => {
          console.log('Service Worker update found');
          const newWorker = this.swRegistration.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.showUpdateNotification();
            }
          });
        });

        // Check if there's a waiting service worker
        if (this.swRegistration.waiting) {
          this.showUpdateNotification();
        }

      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    } else {
      console.warn('Service Workers not supported');
    }
  }

  setupInstallPrompt() {
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('PWA install prompt available');
      
      // Prevent the mini-infobar from appearing
      e.preventDefault();
      
      // Store the event for later use
      this.deferredPrompt = e;
      
      // Show our custom install button
      this.showInstallButton();
    });

    // Listen for app installation
    window.addEventListener('appinstalled', () => {
      console.log('PWA installed successfully');
      this.isInstalled = true;
      this.hideInstallButton();
      this.showInstallSuccessMessage();
      this.trackInstallation();
    });
  }

  setupUpdateNotifications() {
    // Listen for app updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service Worker controller changed');
        // Optionally reload the page for the update
        if (this.shouldAutoReload()) {
          window.location.reload();
        }
      });
    }
  }

  showUpdateNotification() {
    const notification = this.createNotification({
      message: '🔄 App update available!',
      type: 'update',
      actions: [
        {
          text: 'Update Now',
          action: () => this.applyUpdate()
        },
        {
          text: 'Later',
          action: () => this.dismissNotification()
        }
      ]
    });

    document.body.appendChild(notification);
  }

  async applyUpdate() {
    if (this.swRegistration && this.swRegistration.waiting) {
      // Send message to waiting service worker to skip waiting
      this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Reload the page
      window.location.reload();
    }
  }

  createInstallButton() {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || this.isInstalled) {
      return;
    }

    const installButton = document.createElement('button');
    installButton.id = 'pwa-install-btn';
    installButton.innerHTML = '📱 Install App';
    installButton.title = 'Install as app for offline access';
    installButton.setAttribute('aria-label', 'Install app');

    Object.assign(installButton.style, {
      position: 'fixed',
      bottom: '140px', // Above other floating buttons
      right: '20px',
      background: 'linear-gradient(135deg, #00246B, #003d82)',
      color: 'white',
      border: 'none',
      borderRadius: '25px',
      padding: '12px 20px',
      fontSize: '14px',
      fontWeight: 'bold',
      cursor: 'pointer',
      zIndex: '9996',
      boxShadow: '0 4px 12px rgba(0, 36, 107, 0.3)',
      transition: 'all 0.3s ease',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      display: 'none' // Hidden by default
    });

    installButton.addEventListener('click', () => this.promptInstall());
    
    installButton.addEventListener('mouseenter', () => {
      installButton.style.transform = 'scale(1.05)';
      installButton.style.boxShadow = '0 6px 16px rgba(0, 36, 107, 0.4)';
    });

    installButton.addEventListener('mouseleave', () => {
      installButton.style.transform = 'scale(1)';
      installButton.style.boxShadow = '0 4px 12px rgba(0, 36, 107, 0.3)';
    });

    document.body.appendChild(installButton);
  }

  showInstallButton() {
    const button = document.getElementById('pwa-install-btn');
    if (button) {
      button.style.display = 'block';
      
      // Animate in
      setTimeout(() => {
        button.style.opacity = '1';
        button.style.transform = 'translateY(0)';
      }, 100);
    }
  }

  hideInstallButton() {
    const button = document.getElementById('pwa-install-btn');
    if (button) {
      button.style.display = 'none';
    }
  }

  async promptInstall() {
    if (!this.deferredPrompt) {
      this.showManualInstallInstructions();
      return;
    }

    try {
      // Show the install prompt
      this.deferredPrompt.prompt();
      
      // Wait for the user's response
      const { outcome } = await this.deferredPrompt.userChoice;
      
      console.log('Install prompt outcome:', outcome);
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      // Clear the deferredPrompt
      this.deferredPrompt = null;
      this.hideInstallButton();
      
    } catch (error) {
      console.error('Install prompt failed:', error);
      this.showManualInstallInstructions();
    }
  }

  showManualInstallInstructions() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    let instructions = '';
    
    if (isIOS) {
      instructions = 'To install: Tap the Share button in Safari, then "Add to Home Screen"';
    } else if (isAndroid) {
      instructions = 'To install: Tap the menu (⋮) in your browser, then "Add to Home screen" or "Install app"';
    } else {
      instructions = 'To install: Look for the install button (⊕) in your browser\'s address bar, or check the browser menu for "Install" option';
    }

    const notification = this.createNotification({
      message: `📱 Install Instructions: ${instructions}`,
      type: 'info',
      duration: 8000,
      actions: [
        {
          text: 'Got it',
          action: () => this.dismissNotification()
        }
      ]
    });

    document.body.appendChild(notification);
  }

  showInstallSuccessMessage() {
    const notification = this.createNotification({
      message: '🎉 App installed successfully! Enjoy offline access to all tools.',
      type: 'success',
      duration: 5000
    });

    document.body.appendChild(notification);
  }

  createNotification({ message, type = 'info', duration = 5000, actions = [] }) {
    const notification = document.createElement('div');
    notification.className = `pwa-notification pwa-notification-${type}`;
    
    const colors = {
      info: { bg: '#2196F3', border: '#1976D2' },
      success: { bg: '#4CAF50', border: '#388E3C' },
      update: { bg: '#FF9800', border: '#F57C00' },
      error: { bg: '#F44336', border: '#D32F2F' }
    };
    
    const color = colors[type] || colors.info;
    
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: color.bg,
      color: 'white',
      padding: '16px 20px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      zIndex: '10003',
      maxWidth: '350px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontSize: '14px',
      lineHeight: '1.4',
      animation: 'slideInRight 0.3s ease-out'
    });

    let content = `<div>${message}</div>`;
    
    if (actions.length > 0) {
      content += '<div style="margin-top: 12px; display: flex; gap: 10px;">';
      actions.forEach(action => {
        content += `
          <button onclick="(${action.action.toString()})()" 
                  style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); 
                         color: white; padding: 6px 12px; border-radius: 999px; cursor: pointer; 
                         font-size: 12px; transition: all 0.2s ease;">
            ${action.text}
          </button>
        `;
      });
      content += '</div>';
    }

    notification.innerHTML = content;

    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
      position: absolute;
      top: 8px;
      right: 8px;
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    closeBtn.onclick = () => notification.remove();
    notification.appendChild(closeBtn);

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, duration);
    }

    return notification;
  }

  dismissNotification() {
    const notifications = document.querySelectorAll('.pwa-notification');
    notifications.forEach(notification => notification.remove());
  }

  setupShareTarget() {
    // Handle shared content (when PWA is share target)
    const urlParams = new URLSearchParams(window.location.search);
    const sharedText = urlParams.get('text');
    const sharedUrl = urlParams.get('url');
    
    if (sharedText || sharedUrl) {
      console.log('Shared content received:', { sharedText, sharedUrl });
      
      // Redirect to appropriate tool based on content
      if (sharedUrl) {
        window.location.href = `/qr_code_generator.html?text=${encodeURIComponent(sharedUrl)}`;
      } else if (sharedText) {
        window.location.href = `/qr_code_generator.html?text=${encodeURIComponent(sharedText)}`;
      }
    }
  }

  trackUsage() {
    // Track PWA usage for analytics
    const usage = {
      isStandalone: window.matchMedia('(display-mode: standalone)').matches,
      isPWA: this.isInstalled,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    // Store usage data
    try {
      const existingData = JSON.parse(localStorage.getItem('pwa_usage') || '[]');
      existingData.push(usage);
      
      // Keep only last 30 entries
      if (existingData.length > 30) {
        existingData.splice(0, existingData.length - 30);
      }
      
      localStorage.setItem('pwa_usage', JSON.stringify(existingData));
    } catch (error) {
      console.warn('Failed to track PWA usage:', error);
    }
  }

  trackInstallation() {
    try {
      const installData = {
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
      };
      
      localStorage.setItem('pwa_installation', JSON.stringify(installData));
    } catch (error) {
      console.warn('Failed to track PWA installation:', error);
    }
  }

  shouldAutoReload() {
    // Check user preference or page type
    // For now, don't auto-reload to avoid interrupting user work
    return false;
  }

  // Public methods for external use
  async checkForUpdates() {
    if (this.swRegistration) {
      await this.swRegistration.update();
    }
  }

  async clearCache() {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.log('Cache cleared');
    }
  }

  getInstallationStatus() {
    return {
      isInstalled: this.isInstalled,
      isStandalone: window.matchMedia('(display-mode: standalone)').matches,
      canPromptInstall: !!this.deferredPrompt
    };
  }
}

// Initialize PWA Manager
let pwaManager;

document.addEventListener('DOMContentLoaded', () => {
  pwaManager = new PWAManager();
  
  // Add PWA status to page
  window.addEventListener('load', () => {
    const status = pwaManager.getInstallationStatus();
    console.log('PWA Status:', status);
    
    // Add PWA indicator to page if installed
    if (status.isStandalone) {
      document.body.classList.add('pwa-standalone');
      
      // Add a subtle indicator
      const indicator = document.createElement('div');
      indicator.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background: rgba(76, 175, 80, 0.8);
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 10px;
        font-weight: bold;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      `;
      indicator.textContent = 'PWA';
      indicator.title = 'Running as Progressive Web App';
      document.body.appendChild(indicator);
    }
  });
});

// Add CSS for animations
const pwaStyles = document.createElement('style');
pwaStyles.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  .pwa-notification button:hover {
    background: rgba(255,255,255,0.3) !important;
  }
  
  /* PWA-specific styles */
  .pwa-standalone {
    /* Adjust layout for standalone app */
  }
  
  @media (display-mode: standalone) {
    /* Styles for when running as PWA */
    body {
      user-select: none; /* Prevent text selection in app mode */
    }
    
    /* Hide address bar related elements */
    .browser-only {
      display: none !important;
    }
  }
`;

document.head.appendChild(pwaStyles);

// Export for use in other scripts
window.PWAManager = PWAManager;
window.pwaManager = pwaManager;

console.log('PWA Manager initialized');
