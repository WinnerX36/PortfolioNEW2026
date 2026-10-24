/* ---------------------------------------------------------------------------
   core.js — shared runtime
   Storage access and the motion preference are needed by every other module,
   so they live here and are read through window.PortfolioCore.
--------------------------------------------------------------------------- */
window.PortfolioCore = (() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const store = {
    get(key){ try { return localStorage.getItem(key); } catch(e){ return null; } },
    set(key, value){ try { localStorage.setItem(key, value); } catch(e){} }
  };

  return { reduceMotion, store };
})();
