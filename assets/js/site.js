/* ---------------------------------------------------------------------------
   site.js — page behaviour and boot
   Scroll reveals, the mobile menu, the work accordion, the scroll progress
   bar and the language boot.
--------------------------------------------------------------------------- */
(() => {
  'use strict';

  const reduceMotion = window.PortfolioCore.reduceMotion;
  const store = window.PortfolioCore.store;
  const LANG_KEY = 'wb.lang';
  const progressBar = document.getElementById('progressBar');

  /* ---------------- reveals ---------------- */

  const revealTargets = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  if('IntersectionObserver' in window && !reduceMotion.matches){
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if(entry.isIntersecting){
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------------- mobile menu ---------------- */

  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  function closeMenu(){
    navLinks.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  menuBtn.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navLinks.addEventListener('click', (event) => {
    if(event.target.tagName === 'A') closeMenu();
  });
  window.addEventListener('resize', () => {
    if(window.innerWidth > 720) closeMenu();
  });

  /* ---------------- work accordion ---------------- */

  Array.prototype.forEach.call(document.querySelectorAll('.work-item'), (item) => {
    const btn = item.querySelector('.work-btn');
    const panel = item.querySelector('.work-panel');
    const panelId = 'panel-' + (item.dataset.odId || Math.random().toString(36).slice(2, 8));
    panel.id = panelId;
    btn.setAttribute('aria-controls', panelId);
    btn.addEventListener('click', () => {
      const open = item.dataset.open === 'true';
      item.dataset.open = open ? 'false' : 'true';
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  });

  /* ---------------- scroll progress ---------------- */

  let ticking = false;
  function updateProgress(){
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    progressBar.style.transform = 'scaleX(' + ratio.toFixed(4) + ')';
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if(!ticking){
      ticking = true;
      requestAnimationFrame(updateProgress);
    }
  }, { passive: true });
  updateProgress();

  /* ---------------- language boot ---------------- */

  const savedLang = store.get(LANG_KEY);
  const browserLang = String(navigator.language || navigator.userLanguage || '').toLowerCase();
  const initialLang = (savedLang === 'th' || savedLang === 'en')
    ? savedLang
    : (browserLang.indexOf('th') === 0 ? 'th' : 'en');
  window.PortfolioI18n.init();
  window.PortfolioI18n.apply(initialLang);
})();

// FAQPage JSON-LD, built from the visible FAQ so the answers live in one place.
(function(){
  const items = document.querySelectorAll('#faq .faq-item');
  if(!items.length) return;
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: Array.prototype.map.call(items, (el) => ({
      '@type': 'Question',
      name: el.querySelector('summary').textContent.trim(),
      acceptedAnswer: { '@type': 'Answer', text: el.querySelector('p').textContent.trim() }
    }))
  });
  document.head.appendChild(ld);
})();
