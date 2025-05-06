document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer for section visibility
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -35% 0px',
        threshold: 0
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Add/remove active class based on visibility
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Update navigation
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('current');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('current');
                    }
                });
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Smooth scrolling for navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                window.scrollTo({
                    top: targetElement.offsetTop - 40,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Accessibility Controls
    const increaseContrastBtn = document.getElementById('increase-contrast');
    const increaseTextBtn = document.getElementById('increase-text');
    
    // Load saved preferences
    if (localStorage.getItem('highContrast') === 'true') {
        document.body.classList.add('high-contrast');
    }
    
    if (localStorage.getItem('largeText') === 'true') {
        document.body.classList.add('large-text');
    }
    
    // Toggle high contrast
    increaseContrastBtn.addEventListener('click', function() {
        document.body.classList.toggle('high-contrast');
        const isHighContrast = document.body.classList.contains('high-contrast');
        localStorage.setItem('highContrast', isHighContrast);
        
        // Announce change to screen readers
        announceChange(isHighContrast ? 'High contrast mode activated' : 'High contrast mode deactivated');
    });
    
    // Toggle large text
    increaseTextBtn.addEventListener('click', function() {
        document.body.classList.toggle('large-text');
        const isLargeText = document.body.classList.contains('large-text');
        localStorage.setItem('largeText', isLargeText);
        
        // Announce change to screen readers
        announceChange(isLargeText ? 'Large text mode activated' : 'Large text mode deactivated');
    });
    
    // Function to announce changes to screen readers
    function announceChange(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.classList.add('sr-only');
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        // Remove after announcement
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 3000);
    }
    
    // Add .sr-only class for screen reader announcements
    const srOnlyStyle = document.createElement('style');
    srOnlyStyle.textContent = `
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
    `;
    document.head.appendChild(srOnlyStyle);
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Skip to main content when pressing Alt+S
        if (e.altKey && e.key === 's') {
            e.preventDefault();
            document.getElementById('main-content').focus();
            document.getElementById('main-content').scrollIntoView();
        }
    });
});
