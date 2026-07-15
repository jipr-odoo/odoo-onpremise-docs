/**
 * app.js — Main application initializer
 * Orchestrates all modules: sidebar, TOC, search, dark mode, copy buttons, etc.
 */

/* ================================================================
   GLOBAL: copyCode — called via onclick="copyCode(this)" on buttons
   Must be global (window-level) so HTML onclick attributes can reach it.
   Works on file://, HTTP, and HTTPS.
   ================================================================ */
window.copyCode = function (btn) {
  var block = btn.closest('.code-block');
  var pre   = block ? block.querySelector('pre') : null;
  if (!pre) return;

  var text  = pre.innerText || pre.textContent || '';
  text = text.trim();

  var label = btn.querySelector('.copy-label') || btn.querySelector('span');

  function flash(ok) {
    btn.classList.add('copied');
    if (label) label.textContent = ok ? 'Copied!' : 'Failed';
    setTimeout(function () {
      btn.classList.remove('copied');
      if (label) label.textContent = 'Copy';
    }, 2200);
  }

  /* ── Try modern Clipboard API first ── */
  if (window.navigator && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    navigator.clipboard.writeText(text)
      .then(function () { flash(true); })
      .catch(function () { _execCopy(text, flash); });
    return;
  }

  /* ── Fallback: execCommand ── */
  _execCopy(text, flash);
};

function _execCopy(text, flash) {
  var ta = document.createElement('textarea');
  ta.value = text;
  /* Visible enough to receive focus, invisible enough not to show */
  ta.style.cssText = [
    'position:fixed', 'top:0', 'left:0',
    'width:2px', 'height:2px',
    'border:0', 'padding:0', 'margin:0',
    'outline:none', 'box-shadow:none',
    'background:transparent', 'color:transparent',
    'opacity:0.01', 'z-index:9999'
  ].join(';');
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  ta.setSelectionRange(0, ta.value.length); /* iOS */
  var ok = false;
  try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
  document.body.removeChild(ta);
  flash(ok);
}

(function () {
  'use strict';

  /* ── Utilities ── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ── Module loader ── */
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSidebar();
    initTOC();
    initSearch();
    initCodeBlocks();
    initHeaderScroll();
    initImageLightbox();
    highlightActiveSidebar();
    initSmoothNav();
  });

  /* ── Header scroll shadow ── */
  function initHeaderScroll() {
    const header = $('.doc-header');
    if (!header) return;
    const update = () => {
      if (window.scrollY > 4) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ── Mobile sidebar toggle ── */
  function initSidebar() {
    const sidebar  = $('.doc-sidebar');
    const backdrop = $('.sidebar-backdrop');
    const hamburger = $('.hamburger');
    if (!sidebar) return;

    const open  = () => { sidebar.classList.add('open'); backdrop && backdrop.classList.add('visible'); document.body.style.overflow = 'hidden'; };
    const close = () => { sidebar.classList.remove('open'); backdrop && backdrop.classList.remove('visible'); document.body.style.overflow = ''; };

    hamburger && hamburger.addEventListener('click', () => {
      sidebar.classList.contains('open') ? close() : open();
    });

    backdrop && backdrop.addEventListener('click', close);

    // Close on link click (mobile)
    $$('.sidebar-link', sidebar).forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 900) close();
      });
    });

    // Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) close();
    });
  }

  /* ── Highlight active sidebar link ── */
  function highlightActiveSidebar() {
    const current = location.pathname.split('/').pop() || 'index.html';
    $$('.sidebar-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      const linkFile = href.split('/').pop();
      if (linkFile === current || (current === '' && (linkFile === 'index.html' || linkFile === ''))) {
        link.classList.add('active');
        // scroll sidebar to show active link
        link.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  /* ── Smooth scrolling for anchor links ── */
  function initSmoothNav() {
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 60;
          const y = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      });
    });
  }

  /* ── Code blocks: attach copy button handlers ──
     The .code-block wrapper + .copy-btn are already present in the HTML.
     This function only attaches the click listeners and auto-detects
     the language label if it wasn't set explicitly.
  ── */
  function initCodeBlocks() {
    // Attach click handlers to all pre-built copy buttons
    $$('.copy-btn').forEach(function (btn) {
      var block = btn.closest('.code-block');
      var pre   = block ? block.querySelector('pre') : null;
      if (!pre) return;

      // Auto-detect and fill language label if missing / empty
      var langEl = block.querySelector('.code-lang');
      if (langEl && (!langEl.textContent || langEl.textContent === 'code')) {
        langEl.textContent = detectLang(pre.textContent);
      }

      btn.addEventListener('click', function () {
        copyToClipboard(pre.textContent.trim(), btn);
      });
    });

    // Also handle any bare <pre> elements that weren't pre-wrapped
    // (e.g. dynamically injected content)
    $$('pre').forEach(function (pre) {
      if (pre.closest('.code-block')) return; // already wrapped

      var wrapper  = document.createElement('div');
      wrapper.className = 'code-block';

      var header   = document.createElement('div');
      header.className = 'code-header';

      var langEl   = document.createElement('span');
      langEl.className = 'code-lang';
      langEl.textContent = detectLang(pre.textContent);

      var copyBtn  = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'copy-btn';
      copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
      copyBtn.setAttribute('title', 'Copy code');
      copyBtn.innerHTML =
        '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">' +
          '<rect x="5.5" y="5.5" width="9" height="9" rx="1.5"/>' +
          '<path d="M10.5 5.5V3A1.5 1.5 0 009 1.5H3A1.5 1.5 0 001.5 3v6A1.5 1.5 0 003 10.5h2.5"/>' +
        '</svg>' +
        '<span class="copy-label">Copy</span>';

      copyBtn.addEventListener('click', function () {
        copyToClipboard(pre.textContent.trim(), copyBtn);
      });

      header.appendChild(langEl);
      header.appendChild(copyBtn);
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);
    });
  }

  /**
   * Copy text to clipboard.
   *
   * Strategy (most-compatible first):
   * 1. Legacy execCommand — works on file://, HTTP, HTTPS, all browsers
   * 2. Clipboard API     — modern fallback if execCommand is fully removed
   */
  function copyToClipboard(text, btn) {
    var label = btn.querySelector('.copy-label');

    function flash(success) {
      btn.classList.add('copied');
      if (label) label.textContent = success ? 'Copied!' : 'Failed';
      setTimeout(function () {
        btn.classList.remove('copied');
        if (label) label.textContent = 'Copy';
      }, 2000);
    }

    // Try legacy first — reliable across all protocols
    if (legacyCopy(text)) {
      flash(true);
      return;
    }

    // Fallback to modern Clipboard API (HTTPS / localhost)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(function () { flash(true); })
        .catch(function () { flash(false); });
    } else {
      flash(false);
    }
  }

  /**
   * Legacy clipboard copy via a temporary textarea + execCommand.
   * IMPORTANT: Do NOT set readonly on the textarea — readonly elements
   * cannot be copied with execCommand in Chrome/Firefox.
   */
  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    // Position off-screen but keep it interactable (no readonly, no pointer-events:none)
    ta.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0.001;z-index:-1;';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, ta.value.length); // iOS
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }


  function detectLang(text) {
    var t = text.trim();
    if (/^\[/.test(t)) return 'ini';
    if (/^(sudo|apt|apt-get|systemctl|nginx|certbot|iptables|git|cd|pip|python|ufw|adduser|chown|chmod|mkdir|echo)/.test(t)) return 'bash';
    if (/upstream\s+\w+\s*\{|server\s*\{|location\s/.test(t)) return 'nginx';
    if (/^\[Unit\]|^\[Service\]|^\[Install\]/.test(t)) return 'systemd';
    if (/[─├└│]/.test(t)) return 'tree';
    return 'bash';
  }

  /* ── Image lightbox ── */
  function initImageLightbox() {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = '<img src="" alt="enlarged view">';
    document.body.appendChild(overlay);

    const img = overlay.querySelector('img');

    $$('.doc-image img, figure img').forEach(el => {
      el.addEventListener('click', () => {
        img.src = el.src;
        img.alt = el.alt;
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    overlay.addEventListener('click', () => {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

})();