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

  /* ---------- Stats: auto-derived counts + count-up + live GitHub data ----------
     Milestone count is read straight from the DOM, so this section never
     needs manual updates when the timeline changes. Contributions come from
     a public, unofficial GitHub contributions API (no auth needed). */
  const statsSection = document.getElementById('stats');

  if (statsSection) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const GITHUB_USER = 'kartiktiwaridev7';
    const PROGRAM_START_YEAR = 2023; // BCA 2023–2026

    const milestoneCount = document.querySelectorAll('.timeline-row').length;
    const yearsBuilding   = Math.max(1, new Date().getFullYear() - PROGRAM_START_YEAR);

    const statMilestones = document.getElementById('statMilestones');
    const statYears       = document.getElementById('statYears');
    const statContrib     = document.getElementById('statContrib');
    const githubActivity  = document.getElementById('githubActivity');

    function animateCount(el, target, duration = 1100) {
      if (!el || target == null) return;
      if (prefersReducedMotion || !target) {
        el.textContent = target;
        return;
      }
      const start = performance.now();
      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
    }

    let githubData = null;      // filled once the fetch resolves
    let sectionVisible = false; // filled once scrolled into view
    let githubAnimated = false; // guards against double-triggering

    function tryAnimateGithub() {
      if (!sectionVisible || !githubData || githubAnimated) return;
      githubAnimated = true;
      if (githubData.contributions != null) {
        animateCount(statContrib, githubData.contributions);
      } else {
        statContrib.style.display = 'none';
      }
      githubActivity.textContent = githubData.activityText;
    }

    const currentYear = new Date().getFullYear();

    fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=${currentYear}`)
      .then(res => (res.ok ? res.json() : Promise.reject()))
      .then(data => {
        const total = (data && data.total && data.total[currentYear] != null)
          ? data.total[currentYear]
          : (data && Array.isArray(data.contributions)
              ? data.contributions.reduce((sum, d) => sum + (d.count || 0), 0)
              : null);

        if (total == null) throw new Error('no total available');

        githubData = {
          contributions: total,
          activityText: `In ${currentYear} so far`
        };
        tryAnimateGithub();
      })
      .catch(() => {
        // API rate-limited or offline — degrade gracefully, no broken UI.
        githubData = { contributions: null, activityText: 'View profile →' };
        tryAnimateGithub();
      });

    const statsObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        sectionVisible = true;
        animateCount(statMilestones, milestoneCount);
        animateCount(statYears, yearsBuilding);
        tryAnimateGithub();
        statsObserver.unobserve(entry.target);
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});