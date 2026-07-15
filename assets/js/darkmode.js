/**
 * darkmode.js — Theme toggle with localStorage persistence
 */

(function () {
  'use strict';

  const KEY = 'odoo-docs-theme';

  function getPreferred() {
    const stored = localStorage.getItem(KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
  }

  function initTheme() {
    // Apply immediately (before DOMContentLoaded to prevent flash)
    applyTheme(getPreferred());
  }

  function initToggle() {
    const btn = document.querySelector('.theme-toggle');
    if (!btn) return;

    btn.setAttribute('aria-label', 'Toggle dark mode');
    btn.setAttribute('title', 'Toggle dark mode (D)');

    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });

    // Keyboard shortcut: D
    document.addEventListener('keydown', e => {
      if (e.key === 'd' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const tag = document.activeElement.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;
        const current = document.documentElement.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
      }
    });

    // Sync across tabs
    window.addEventListener('storage', e => {
      if (e.key === KEY && e.newValue) applyTheme(e.newValue);
    });

    // Follow OS preference change
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem(KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // Apply theme immediately to avoid flash
  initTheme();

  // Wire up toggle after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToggle);
  } else {
    initToggle();
  }

  // Expose for app.js
  window.initTheme = initTheme;

})();
