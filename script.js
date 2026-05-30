/* ============================================================
   KARTIK TIWARI — PORTFOLIO SCRIPTS (ENHANCED)
   ============================================================ */

/* ─────────────────────────────────────────────
   1. UTILITY — wait for DOM
   ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

    /* ─────────────────────────────────────────────
       2. TYPEWRITER EFFECT
          Improved: loops back after a pause
       ───────────────────────────────────────────── */
    const typeTarget = document.getElementById('typewriter-text');

    if (typeTarget) {
        const phrases = [
            "A BCA student bridging the gap between elegant Frontend Development and powerful Data-Driven Applications.",
            "Building AI Agents · Designing Interfaces · Exploring Machine Learning.",
            "Turning raw data into insightful stories — one line of code at a time."
        ];

        let phraseIndex = 0;
        let charIndex   = 0;
        let isDeleting  = false;
        let loopDelay;

        // Cursor element
        const cursor = document.createElement('span');
        cursor.className = 'typewriter-cursor';
        cursor.innerHTML = '|';
        cursor.style.cssText = 'animation:blink 1s infinite; margin-left:1px; color:var(--cyan);';
        typeTarget.after(cursor);

        function type() {
            const current = phrases[phraseIndex];

            if (!isDeleting) {
                typeTarget.textContent = current.slice(0, charIndex + 1);
                charIndex++;
                if (charIndex === current.length) {
                    // Finished typing — pause then delete
                    isDeleting = true;
                    loopDelay = setTimeout(type, 2200);
                    return;
                }
            } else {
                typeTarget.textContent = current.slice(0, charIndex - 1);
                charIndex--;
                if (charIndex === 0) {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    loopDelay = setTimeout(type, 400);
                    return;
                }
            }

            setTimeout(type, isDeleting ? 22 : 38);
        }

        setTimeout(type, 900);
    }


    /* ─────────────────────────────────────────────
       3. INTERSECTION OBSERVER — SCROLL REVEAL
          Improved: staggered delay for grid items
       ───────────────────────────────────────────── */
    const observerOptions = {
        threshold:  0.08,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Stagger siblings inside grids/timelines automatically
    const grids = document.querySelectorAll('.project-grid, .timeline, .skill-tags');
    grids.forEach(grid => {
        const children = grid.querySelectorAll('.fade-in');
        children.forEach((child, i) => {
            if (!child.style.transitionDelay) {
                child.style.transitionDelay = `${i * 0.1}s`;
            }
        });
    });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));


    /* ─────────────────────────────────────────────
       4. 3D CARD TILT EFFECT
          Improved: smoother interpolation, works on
          desktop only (skips touch devices)
       ───────────────────────────────────────────── */
    const isTouchDevice = window.matchMedia('(hover: none)').matches;

    if (!isTouchDevice) {
        const cards = document.querySelectorAll('.project-card');

        cards.forEach(card => {
            let raf;

            card.addEventListener('mousemove', (e) => {
                cancelAnimationFrame(raf);
                raf = requestAnimationFrame(() => {
                    const rect    = card.getBoundingClientRect();
                    const x       = e.clientX - rect.left;
                    const y       = e.clientY - rect.top;
                    const centerX = rect.width  / 2;
                    const centerY = rect.height / 2;
                    const rotateX = ((y - centerY) / centerY) * -5;
                    const rotateY = ((x - centerX) / centerX) *  5;

                    card.style.transition = 'none';
                    card.style.transform  = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.01)`;
                });
            });

            card.addEventListener('mouseleave', () => {
                cancelAnimationFrame(raf);
                card.style.transition = 'transform 0.55s cubic-bezier(0.2, 0, 0, 1)';
                card.style.transform  = 'perspective(900px) rotateX(0) rotateY(0) translateY(0) scale(1)';
            });

            card.addEventListener('mouseenter', () => {
                card.style.transition = 'none';
            });
        });
    }


    /* ─────────────────────────────────────────────
       5. MOBILE HAMBURGER MENU
          Improved: body scroll lock, keyboard support,
          escape-to-close
       ───────────────────────────────────────────── */
    const menuToggle       = document.querySelector('#mobile-menu');
    const navLinksContainer = document.querySelector('.nav-links');
    const mobileLinks       = document.querySelectorAll('.nav-links li a');

    function openMenu() {
        menuToggle.classList.add('is-active');
        navLinksContainer.classList.add('active');
        document.body.style.overflow = 'hidden';
        menuToggle.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
        menuToggle.classList.remove('is-active');
        navLinksContainer.classList.remove('active');
        document.body.style.overflow = '';
        menuToggle.setAttribute('aria-expanded', 'false');
    }

    if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Toggle navigation');

        menuToggle.addEventListener('click', () => {
            const isOpen = navLinksContainer.classList.contains('active');
            isOpen ? closeMenu() : openMenu();
        });
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinksContainer.classList.contains('active')) {
            closeMenu();
        }
    });

    // Close if user clicks backdrop (outside the nav list)
    navLinksContainer.addEventListener('click', (e) => {
        if (e.target === navLinksContainer) closeMenu();
    });


    /* ─────────────────────────────────────────────
       6. NAV SCROLL BEHAVIOUR
          Adds .scrolled class + highlights active
          section link via IntersectionObserver
       ───────────────────────────────────────────── */
    const nav     = document.querySelector('.glass-nav');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const sections = document.querySelectorAll('section[id], footer[id]');

    // Scroll shadow
    const onScroll = () => {
        if (window.scrollY > 20) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Active link highlight
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.style.color = '';
                    if (link.getAttribute('href') === `#${id}`) {
                        link.style.color = 'var(--text-main)';
                    }
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(section => sectionObserver.observe(section));


    /* ─────────────────────────────────────────────
       7. SKILL TAG RIPPLE ON CLICK
       ───────────────────────────────────────────── */
    document.querySelectorAll('.glass-tag').forEach(tag => {
        tag.addEventListener('click', function(e) {
            const ripple  = document.createElement('span');
            const rect    = this.getBoundingClientRect();
            const size    = Math.max(rect.width, rect.height) * 2;
            ripple.style.cssText = `
                position:absolute; border-radius:50%; pointer-events:none;
                width:${size}px; height:${size}px;
                left:${e.clientX - rect.left - size/2}px;
                top:${e.clientY - rect.top  - size/2}px;
                background:rgba(0,229,255,0.25);
                transform:scale(0); animation:rippleAnim 0.55s ease-out forwards;
            `;
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });

    // Inject ripple keyframes
    if (!document.getElementById('ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            @keyframes rippleAnim {
                to { transform: scale(1); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }


    /* ─────────────────────────────────────────────
       8. SMOOTH FOOTER CTA — staggered social icons
       ───────────────────────────────────────────── */
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach((icon, i) => {
        icon.style.transitionDelay = `${i * 0.05}s`;
    });


    /* ─────────────────────────────────────────────
       9. COPY EMAIL on logo long-press / dblclick
          (small Easter egg UX touch)
       ───────────────────────────────────────────── */
    const logo = document.querySelector('.logo');
    if (logo) {
        let pressTimer;

        const showCopied = () => {
            const original = logo.textContent;
            logo.textContent = '✓ Copied!';
            logo.style.color = '#4ade80';
            setTimeout(() => {
                logo.textContent = original;
                logo.style.color = '';
            }, 1500);
        };

        logo.addEventListener('dblclick', () => {
            navigator.clipboard.writeText('kartiktiwari8790@gmail.com')
                .then(showCopied)
                .catch(() => {});
        });

        logo.addEventListener('mousedown', () => {
            pressTimer = setTimeout(() => {
                navigator.clipboard.writeText('kartiktiwari8790@gmail.com')
                    .then(showCopied)
                    .catch(() => {});
            }, 800);
        });

        logo.addEventListener('mouseup', () => clearTimeout(pressTimer));
        logo.addEventListener('mouseleave', () => clearTimeout(pressTimer));
        logo.title = 'Double-click to copy email';
        logo.style.cursor = 'pointer';
    }


    /* ─────────────────────────────────────────────
       10. PERFORMANCE — prefers-reduced-motion
           Disable heavy animations if user prefers
       ───────────────────────────────────────────── */
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
        // Instantly show all fade-in elements
        document.querySelectorAll('.fade-in').forEach(el => {
            el.style.transition = 'none';
            el.classList.add('show');
        });

        // Stop orb animations
        document.querySelectorAll('.glow-orb').forEach(orb => {
            orb.style.animation = 'none';
        });
    }

    /* ─────────────────────────────────────────────
       11. SCROLL PROGRESS BAR
       ───────────────────────────────────────────── */
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    document.body.prepend(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled  = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = `${scrolled}%`;
    }, { passive: true });


    /* ─────────────────────────────────────────────
       12. ACTIVE NAV LINK — proper CSS class toggle
           (replaces earlier inline colour approach)
       ───────────────────────────────────────────── */
    const allNavLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const allSections = document.querySelectorAll('section[id], footer[id]');

    const activeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                allNavLinks.forEach(link => {
                    link.classList.remove('nav-active');
                    link.style.color = ''; // clear any stale inline colour
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('nav-active');
                    }
                });
            }
        });
    }, { threshold: 0.35, rootMargin: '-60px 0px -35% 0px' });

    allSections.forEach(s => activeObserver.observe(s));


    /* ─────────────────────────────────────────────
       13. CURSOR GLOW TRAIL (desktop only)
           Smooth lerp follow — no harsh snapping
       ───────────────────────────────────────────── */
    if (!isTouchDevice) {
        const cursorGlow = document.createElement('div');
        cursorGlow.id = 'cursor-glow';
        document.body.appendChild(cursorGlow);

        let mouseX = -999, mouseY = -999;
        let currentX = -999, currentY = -999;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        (function lerpGlow() {
            currentX += (mouseX - currentX) * 0.1;
            currentY += (mouseY - currentY) * 0.1;
            cursorGlow.style.left = `${currentX}px`;
            cursorGlow.style.top  = `${currentY}px`;
            requestAnimationFrame(lerpGlow);
        })();

        document.addEventListener('mouseleave', () => { cursorGlow.style.opacity = '0'; });
        document.addEventListener('mouseenter', () => { cursorGlow.style.opacity = '1'; });
    }


    /* ─────────────────────────────────────────────
       14. PAGE LOADER — branded intro, first visit only
       ───────────────────────────────────────────── */
    if (!sessionStorage.getItem('kt_visited')) {
        sessionStorage.setItem('kt_visited', '1');

        const loader = document.createElement('div');
        loader.id = 'page-loader';
        loader.innerHTML = `
            <div class="loader-logo">&lt;Kartik Tiwari/&gt;</div>
            <div class="loader-bar-track">
                <div class="loader-bar-fill"></div>
            </div>
        `;
        document.body.appendChild(loader);

        setTimeout(() => {
            loader.classList.add('hide');
            loader.addEventListener('transitionend', () => loader.remove(), { once: true });
        }, 1050);
    }

}); // end DOMContentLoaded