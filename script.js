// --- 1. TYPING EFFECT FOR HERO SECTION ---
document.addEventListener('DOMContentLoaded', () => {
    const typeTarget = document.getElementById('typewriter-text');

    if (typeTarget) {
        const textToType = "A BCA student bridging the gap between elegant Frontend Development and powerful Data-Driven Applications.";
        let i = 0;
        
        function typeWriter() {
            if (i < textToType.length) {
                typeTarget.textContent += textToType.charAt(i);
                i++;
                setTimeout(typeWriter, 35); // Typing speed
            }
            // Note: Cursor blinking is now efficiently handled purely via CSS ::after
        }
        
        setTimeout(typeWriter, 800); // Initial delay
    }

    // --- 2. SCROLL REVEAL (INTERSECTION OBSERVER) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observerInstance.unobserve(entry.target); // Unobserve to improve performance after reveal
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.fade-in');
    hiddenElements.forEach((el) => observer.observe(el));

    // --- 3. 3D PROJECT CARD TILT EFFECT (Performance Optimized) ---
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        let isTicking = false; // Prevents overwhelming the main thread

        card.addEventListener('mousemove', (e) => {
            if (!isTicking) {
                window.requestAnimationFrame(() => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left; 
                    const y = e.clientY - rect.top;  
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = ((y - centerY) / centerY) * -4; 
                    const rotateY = ((x - centerX) / centerX) * 4;
                    
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
                    isTicking = false;
                });
                isTicking = true;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)'; 
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none'; // Remove transition during hover for instant mouse tracking
        });
    });

    // --- 4. MOBILE HAMBURGER MENU ---
    const menuToggle = document.querySelector('#mobile-menu');
    const navLinksContainer = document.querySelector('.nav-links');
    const mobileLinks = document.querySelectorAll('.nav-links li a');

    if (menuToggle && navLinksContainer) {
        // Toggle the menu open and closed
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('is-active');
            navLinksContainer.classList.toggle('active');
        });

        // Close the menu automatically when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('is-active');
                navLinksContainer.classList.remove('active');
            });
        });
    }
});