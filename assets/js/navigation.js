/**
 * navigation.js — Shared sidebar HTML injection
 * Injects the full sidebar navigation into every page.
 */

(function () {
  'use strict';

  /* ── Navigation structure ── */
  const NAV = [
    {
      group: 'Getting Started',
      items: [
        { href: 'index.html',       label: 'Home',         icon: 'home',   root: true },
        { href: 'pages/overview.html', label: 'Overview',  icon: 'book' },
      ],
    },
    {
      group: 'Deployment',
      items: [
        { href: 'pages/installation.html',  label: 'Server & PostgreSQL', icon: 'server' },
        { href: 'pages/odoo.html',          label: 'Install Odoo',        icon: 'package' },
        { href: 'pages/configuration.html', label: 'Configure Odoo',      icon: 'settings' },
        { href: 'pages/systemd.html',       label: 'systemd Service',     icon: 'zap' },
        { href: 'pages/nginx.html',         label: 'Nginx',               icon: 'globe' },
        { href: 'pages/domain.html',        label: 'Domain',              icon: 'link' },
        { href: 'pages/https.html',         label: 'HTTPS & TLS',         icon: 'lock' },
        { href: 'pages/firewall.html',      label: 'Firewall',            icon: 'shield' },
      ],
    },
    {
      group: 'Administration',
      items: [
        { href: 'pages/helper-commands.html', label: 'Helper Commands', icon: 'terminal' },
        { href: 'pages/troubleshooting.html', label: 'Troubleshooting', icon: 'alert-circle' },
      ],
    },
    {
      group: 'Reference',
      items: [
        { href: 'pages/appendix.html', label: 'Appendix', icon: 'file-text' },
      ],
    },
  ];

  /* ── SVG Icons ── */
  const ICONS = {
    home:         `<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`,
    book:         `<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>`,
    server:       `<rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>`,
    package:      `<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>`,
    settings:     `<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>`,
    zap:          `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`,
    globe:        `<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>`,
    link:         `<path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>`,
    lock:         `<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>`,
    shield:       `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,
    terminal:     `<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>`,
    'alert-circle': `<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>`,
    'file-text':  `<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>`,
  };

  function svgIcon(name) {
    return `<svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
  }

  /* ── Resolve paths relative to current page ── */
  function resolveHref(href, isRoot) {
    const isInPages = location.pathname.includes('/pages/');
    if (isInPages) {
      if (href === 'index.html') return '../index.html';
      if (href.startsWith('pages/')) return href.replace('pages/', '');
      return href;
    }
    return href;
  }

  /* ── Build sidebar HTML ── */
  function buildSidebar() {
    const sidebar = document.querySelector('.doc-sidebar');
    if (!sidebar) return;

    // Already populated
    if (sidebar.querySelector('.sidebar-nav')) return;

    const nav = document.createElement('nav');
    nav.className = 'sidebar-nav';
    nav.setAttribute('aria-label', 'Documentation navigation');

    const currentFile = location.pathname.split('/').pop() || 'index.html';

    NAV.forEach(group => {
      const groupEl = document.createElement('div');
      groupEl.className = 'sidebar-nav-group';

      const labelEl = document.createElement('span');
      labelEl.className = 'sidebar-group-label';
      labelEl.textContent = group.group;
      groupEl.appendChild(labelEl);

      group.items.forEach(item => {
        const a = document.createElement('a');
        a.className = 'sidebar-link';
        a.href = resolveHref(item.href, item.root);
        a.innerHTML = svgIcon(item.icon) + item.label;

        const hrefFile = item.href.split('/').pop();
        if (hrefFile === currentFile || (currentFile === '' && item.root)) {
          a.classList.add('active');
          a.setAttribute('aria-current', 'page');
        }

        groupEl.appendChild(a);
      });

      nav.appendChild(groupEl);

      // Divider between groups
      const div = document.createElement('div');
      div.className = 'sidebar-divider';
      nav.appendChild(div);
    });

    sidebar.appendChild(nav);
  }

  /* ── Init ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildSidebar);
  } else {
    buildSidebar();
  }

  window._buildSidebar = buildSidebar;

})();
