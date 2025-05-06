// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.getElementById('menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            menu.classList.toggle('show');
            const expanded = menu.classList.contains('show');
            menuToggle.setAttribute('aria-expanded', expanded);
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Hide mobile menu when a link is clicked
            menu.classList.remove('show');
            menuToggle.setAttribute('aria-expanded', 'false');
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
    
    // Highlight active section in navigation
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-link');
    
    function highlightNavigation() {
        const scrollPosition = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Initial call to highlight the current section
    highlightNavigation();
    
    // Highlight the current section while scrolling
    window.addEventListener('scroll', highlightNavigation);
    
    // Add CSS for the active class
    const style = document.createElement('style');
    style.textContent = `
        .nav-link.active {
            background-color: var(--primary-color);
            color: white !important;
        }
    `;
    document.head.appendChild(style);
    
    // Add keyboard navigation for improved accessibility
    navItems.forEach((navItem, index) => {
        navItem.addEventListener('keydown', function(e) {
            // Arrow Right or Arrow Down
            if (e.keyCode === 39 || e.keyCode === 40) {
                e.preventDefault();
                const nextIndex = (index + 1) % navItems.length;
                navItems[nextIndex].focus();
            }
            
            // Arrow Left or Arrow Up
            if (e.keyCode === 37 || e.keyCode === 38) {
                e.preventDefault();
                const prevIndex = (index - 1 + navItems.length) % navItems.length;
                navItems[prevIndex].focus();
            }
        });
    });
    
    // Add animation for expertise items
    const expertiseItems = document.querySelectorAll('.expertise-item');
    
    function checkIfInView() {
        expertiseItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const isInViewport = rect.top <= window.innerHeight - 100;
            
            if (isInViewport) {
                item.classList.add('fade-in');
            }
        });
    }
    
    // Add CSS for the fade-in animation
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        .expertise-item {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .expertise-item.fade-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        @media (prefers-reduced-motion: reduce) {
            .expertise-item {
                opacity: 1;
                transform: none;
                transition: none;
            }
        }
    `;
    document.head.appendChild(animationStyle);
    
    // Check if expertise items are in viewport on page load and scroll
    checkIfInView();
    window.addEventListener('scroll', checkIfInView);
    
    // Font size adjuster for accessibility
    const fontSizeControls = document.createElement('div');
    fontSizeControls.className = 'font-size-controls';
    fontSizeControls.innerHTML = `
        <button aria-label="Decrease font size" class="font-size-btn" id="decrease-font">A-</button>
        <button aria-label="Reset font size" class="font-size-btn" id="reset-font">A</button>
        <button aria-label="Increase font size" class="font-size-btn" id="increase-font">A+</button>
    `;
    
    // Add CSS for font size controls
    const fontControlsStyle = document.createElement('style');
    fontControlsStyle.textContent = `
        .font-size-controls {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--primary-color);
            padding: 10px;
            border-radius: 5px;
            display: flex;
            gap: 5px;
            z-index: 999;
        }
        
        .font-size-btn {
            background-color: var(--light-color);
            color: var(--primary-color);
            border: none;
            border-radius: 3px;
            padding: 5px 10px;
            cursor: pointer;
            font-weight: bold;
            transition: background-color 0.3s ease;
        }
        
        .font-size-btn:hover, .font-size-btn:focus {
            background-color: var(--accent-color);
        }
    `;
    document.head.appendChild(fontControlsStyle);
    document.body.appendChild(fontSizeControls);
    
    // Font size adjustment functionality
    let currentFontSize = 100; // Base percentage
    
    document.getElementById('increase-font').addEventListener('click', function() {
        currentFontSize += 10;
        updateFontSize();
    });
    
    document.getElementById('decrease-font').addEventListener('click', function() {
        currentFontSize = Math.max(70, currentFontSize - 10); // Don't go below 70%
        updateFontSize();
    });
    
    document.getElementById('reset-font').addEventListener('click', function() {
        currentFontSize = 100;
        updateFontSize();
    });
    
    function updateFontSize() {
        document.body.style.fontSize = `${currentFontSize}%`;
        localStorage.setItem('fontSize', currentFontSize);
    }
    
    // Check if user has a previously set font size
    if (localStorage.getItem('fontSize')) {
        currentFontSize = parseInt(localStorage.getItem('fontSize'));
        updateFontSize();
    }
});
