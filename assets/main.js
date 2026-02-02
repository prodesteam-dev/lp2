(() => {
  'use strict';

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Smooth scroll (fallback for browsers without CSS smooth behavior or for consistent offset handling)
  const header = document.querySelector('.site-header');
  const headerOffset = () => (header ? header.getBoundingClientRect().height : 0);

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const href = a.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    const top = window.scrollY + target.getBoundingClientRect().top - headerOffset() - 8;
    window.scrollTo({ top, behavior: 'smooth' });

    // Update URL without jumping
    history.pushState(null, '', href);
  });

  // IntersectionObserver: image lazy loading + reveal
  const lazyImgs = Array.from(document.querySelectorAll('img.is-lazy[data-src]'));

  const loadImg = (img) => {
    const src = img.getAttribute('data-src');
    if (!src) return;

    img.src = src;
    img.removeAttribute('data-src');

    if (img.complete) {
      img.classList.add('is-loaded');
      img.classList.remove('is-lazy');
    } else {
      img.addEventListener(
        'load',
        () => {
          img.classList.add('is-loaded');
          img.classList.remove('is-lazy');
        },
        { once: true }
      );
    }
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const img = entry.target;
          loadImg(img);
          io.unobserve(img);
        });
      },
      { root: null, rootMargin: '200px 0px', threshold: 0.01 }
    );

    lazyImgs.forEach((img) => io.observe(img));
  } else {
    // Fallback: load all
    lazyImgs.forEach(loadImg);
  }

  // Optional: reveal sections (subtle)
  const sections = Array.from(document.querySelectorAll('section.section, section.hero, section.cta'));
  sections.forEach((s) => s.setAttribute('data-reveal', ''));

  const reveal = (el) => {
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  };

  const initHidden = (el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
  };

  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced && 'IntersectionObserver' in window) {
    sections.forEach(initHidden);

    const sio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal(entry.target);
          sio.unobserve(entry.target);
        });
      },
      { root: null, threshold: 0.08 }
    );

    sections.forEach((s) => sio.observe(s));
  }
})();
