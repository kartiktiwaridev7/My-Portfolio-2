/* ============================================
   KARTIK TIWARI — PORTFOLIO SCRIPTS
   ============================================ */

// --- 1. CUSTOM CURSOR ---
const cursorDot  = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
});

function animateCursor() {
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .bento-card, .stat-pill, .tl-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
});


// --- 2. NAV SCROLL EFFECT ---
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });


// --- 3. TYPEWRITER EFFECT ---
const typeTarget = document.getElementById('typewriter-text');
if (typeTarget) {
    const phrases = [
        "Frontend Developer & Data Enthusiast",
        "BCA Student building AI interfaces",
        "Bridging UI & Machine Learning"
    ];
    let phraseIdx = 0, charIdx = 0, deleting = false;

    function typeLoop() {
        const phrase = phrases[phraseIdx];
        if (!deleting) {
            typeTarget.textContent = phrase.slice(0, charIdx + 1);
            charIdx++;
            if (charIdx === phrase.length) {
                deleting = true;
                setTimeout(typeLoop, 2200);
                return;
            }
            setTimeout(typeLoop, 42);
        } else {
            typeTarget.textContent = phrase.slice(0, charIdx - 1);
            charIdx--;
            if (charIdx === 0) {
                deleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
            }
            setTimeout(typeLoop, 22);
        }
    }
    setTimeout(typeLoop, 900);
}


// --- 4. SCROLL REVEAL ---
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


// --- 5. SKILL BAR ANIMATION (triggered on scroll) ---
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-fill').forEach(bar => {
                bar.style.width = bar.style.width; // re-trigger
            });
        }
    });
}, { threshold: 0.4 });

const skillBlock = document.querySelector('.skills-block');
if (skillBlock) skillObserver.observe(skillBlock);


// --- 6. SKILLS TABS ---
const tabs  = document.querySelectorAll('.skills-tab');
const panels = document.querySelectorAll('.skills-panel');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t  => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('tab-' + tab.dataset.tab).classList.add('active');

        // Animate bars
        document.querySelectorAll('#tab-' + tab.dataset.tab + ' .skill-fill').forEach(bar => {
            const target = bar.style.width;
            bar.style.width = '0';
            requestAnimationFrame(() => {
                requestAnimationFrame(() => { bar.style.width = target; });
            });
        });
    });
});


// --- 7. MOBILE HAMBURGER ---
const menuToggle = document.querySelector('#mobile-menu');
const navLinks   = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('is-active');
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('is-active');
        navLinks.classList.remove('active');
    });
});


// --- 8. ANIMATED PARTICLE CANVAS BACKGROUND ---
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');

let W = canvas.width  = window.innerWidth;
let H = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
}, { passive: true });

const PARTICLE_COUNT = 60;
const particles = [];

const colors = ['rgba(0,229,195,', 'rgba(139,92,246,', 'rgba(240,180,41,'];

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x    = Math.random() * W;
        this.y    = Math.random() * H;
        this.r    = Math.random() * 1.5 + 0.5;
        this.vx   = (Math.random() - 0.5) * 0.18;
        this.vy   = (Math.random() - 0.5) * 0.18;
        this.col  = colors[Math.floor(Math.random() * colors.length)];
        this.life = Math.random() * 200 + 100;
        this.age  = 0;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.age++;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H || this.age > this.life) this.reset();
    }
    draw() {
        const alpha = Math.sin((this.age / this.life) * Math.PI) * 0.45;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.col + alpha + ')';
        ctx.fill();
    }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function drawConnections() {
    const maxDist = 140;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < maxDist) {
                const alpha = (1 - dist / maxDist) * 0.07;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(0,229,195,${alpha})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
            }
        }
    }
}

function animateCanvas() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateCanvas);
}
animateCanvas();


// --- 9. 3D TILT ON BENTO CARDS (desktop only) ---
if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.bento-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
            const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -8;
            card.style.transition = 'none';
            card.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) translateY(-5px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1), border-color 0.3s, box-shadow 0.3s';
            card.style.transform = '';
        });
    });
}
