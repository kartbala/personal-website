// Minimal JavaScript for oldschool website
document.addEventListener('DOMContentLoaded', function() {
    // Text size controls
    var currentSize = 18; // Default size
    var minSize = 14;
    var maxSize = 24;
    var sizeIncrement = 2;
    
    // Initialize from localStorage if available
    if (localStorage.getItem('fontSize')) {
        currentSize = parseInt(localStorage.getItem('fontSize'));
        document.body.style.fontSize = currentSize + 'px';
    }
    
    // Increase text size
    document.getElementById('increase-text').addEventListener('click', function(e) {
        e.preventDefault();
        if (currentSize < maxSize) {
            currentSize += sizeIncrement;
            document.body.style.fontSize = currentSize + 'px';
            localStorage.setItem('fontSize', currentSize);
        }
    });
    
    // Decrease text size
    document.getElementById('decrease-text').addEventListener('click', function(e) {
        e.preventDefault();
        if (currentSize > minSize) {
            currentSize -= sizeIncrement;
            document.body.style.fontSize = currentSize + 'px';
            localStorage.setItem('fontSize', currentSize);
        }
    });
    
    // High contrast toggle
    document.getElementById('toggle-contrast').addEventListener('click', function(e) {
        e.preventDefault();
        document.body.classList.toggle('high-contrast');
        
        // Save preference
        if (document.body.classList.contains('high-contrast')) {
            localStorage.setItem('highContrast', 'true');
        } else {
            localStorage.setItem('highContrast', 'false');
        }
    });
    
    // Load high contrast setting
    if (localStorage.getItem('highContrast') === 'true') {
        document.body.classList.add('high-contrast');
    }
    
    // Mobile navigation toggle
    if (window.innerWidth <= 768) {
        var navHeadings = document.querySelectorAll('.navigation h3');
        
        navHeadings.forEach(function(heading) {
            heading.addEventListener('click', function() {
                var ul = this.nextElementSibling;
                if (ul && ul.tagName === 'UL') {
                    ul.classList.toggle('open');
                }
            });
        });
    }
    
    // Smooth scrolling for in-page links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's an action link (like toggle-contrast)
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Simple smooth scroll
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without reload
                history.pushState(null, null, targetId);
            }
        });
    });
});
