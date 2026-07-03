/* ==================================================================
   KARTIK TIWARI — PORTFOLIO SCRIPTS (minimal, no decorative gimmicks)
   ================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Nav: scrolled state + mobile toggle ---------- */
  const nav = document.querySelector('.nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  function closeMobileNav() {
    navLinks.classList.remove('active');
    navToggle.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('active');
      navToggle.classList.toggle('is-active', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });

    /* Escape closes the mobile menu and returns focus to the toggle */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        closeMobileNav();
        navToggle.focus();
      }
    });
  }

  /* ---------- Scroll reveal (single, calm) ---------- */
  const revealItems = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  revealItems.forEach(el => revealObserver.observe(el));

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('section[id], header[id], footer[id]');
  const links = document.querySelectorAll('.nav-links a[href^="#"]');

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        links.forEach(l => l.classList.toggle('nav-active', l.getAttribute('href') === `#${id}`));
      }
    });
  }, { threshold: 0.4, rootMargin: '-70px 0px -40% 0px' });

  sections.forEach(s => activeObserver.observe(s));

  /* ---------- Scroll-driven UI: nav shadow + progress line ----------
     Combined into one listener, throttled with requestAnimationFrame,
     so scroll work happens at most once per frame instead of twice
     per scroll event. */
  const line = document.getElementById('scroll-line');
  let scrollTicking = false;

  function updateOnScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 12);

    const height = document.documentElement.scrollHeight - window.innerHeight;
    line.style.width = height > 0 ? `${(window.scrollY / height) * 100}%` : '0%';

    scrollTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(updateOnScroll);
      scrollTicking = true;
    }
  }, { passive: true });

  updateOnScroll();

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});