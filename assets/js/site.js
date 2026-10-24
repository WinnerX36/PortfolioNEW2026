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
  // close the About dropdown after a pick or a click outside it
  document.addEventListener('click', (event) => {
    document.querySelectorAll('.nav-drop[open]').forEach((d) => {
      if(!d.contains(event.target) || event.target.tagName === 'A') d.open = false;
    });
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

  /* ---------------- experience cards: click anywhere to show photos ---------------- */

  Array.prototype.forEach.call(document.querySelectorAll('.exp-item'), (item) => {
    const proj = item.querySelector('.exp-proj');
    if(!proj) return;
    item.classList.add('has-proj');
    item.addEventListener('click', (event) => {
      // links, the summary itself and the photo strip keep their own behaviour
      if(event.target.closest('a, summary, .strip-wrap')) return;
      if(window.getSelection && String(window.getSelection())) return;
      proj.open = !proj.open;
    });
  });

  /* ---------------- photo strips: prev / next buttons ---------------- */

  Array.prototype.forEach.call(document.querySelectorAll('.sport-media--strip'), (strip) => {
    const wrap = document.createElement('div');
    wrap.className = 'strip-wrap';
    strip.parentNode.insertBefore(wrap, strip);
    wrap.appendChild(strip);
    const make = (dir, label, glyph) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'strip-btn strip-btn--' + dir;
      b.setAttribute('aria-label', label);
      b.textContent = glyph;
      b.addEventListener('click', () => {
        strip.scrollBy({ left: (dir === 'next' ? 1 : -1) * strip.clientWidth * 0.8, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
      });
      wrap.appendChild(b);
      return b;
    };
    const prev = make('prev', 'Previous photo', '‹');
    const next = make('next', 'Next photo', '›');
    const sync = () => {
      prev.disabled = strip.scrollLeft < 4;
      next.disabled = strip.scrollLeft + strip.clientWidth > strip.scrollWidth - 4;
    };
    strip.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    if('ResizeObserver' in window) new ResizeObserver(sync).observe(strip);
    sync();
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
  const pageLang = document.documentElement.getAttribute('data-lang');
  const initialLang = pageLang ? pageLang : ((savedLang === 'th' || savedLang === 'en')
    ? savedLang
    : (browserLang.indexOf('th') === 0 ? 'th' : 'en'));
  window.PortfolioI18n.init();
  window.PortfolioI18n.apply(initialLang);
})();
