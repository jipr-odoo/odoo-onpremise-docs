/**
 * search.js — Client-side full-text search
 * Indexes pages, headings and keywords. No backend, no external services.
 */

(function () {
  'use strict';

  /* ── Search Index ── */
  const INDEX = [
    {
      page: 'index.html',
      title: 'Home — Odoo On-Premise Deployment',
      section: 'Getting Started',
      keywords: ['overview', 'introduction', 'deployment', 'oracle cloud', 'ubuntu'],
      headings: [
        { text: 'Overview', id: 'overview' },
        { text: 'Requirements', id: 'requirements' },
        { text: 'Architecture', id: 'architecture' },
        { text: 'Deployment Roadmap', id: 'deployment' },
        { text: 'Verification Checklist', id: 'verification' },
      ],
    },
    {
      page: 'pages/installation.html',
      title: 'Server Preparation & PostgreSQL',
      section: 'Deployment',
      keywords: ['ubuntu', 'apt', 'install', 'packages', 'postgresql', 'database', 'python', 'venv', 'dependencies'],
      headings: [
        { text: 'Overview', id: 'overview' },
        { text: 'Install Required Packages', id: 'packages' },
        { text: 'Install PostgreSQL', id: 'postgres' },
        { text: 'Create Odoo Database User', id: 'postgres' },
        { text: 'Recommended Directory Layout', id: 'directories' },
        { text: 'Verification', id: 'verify' },
      ],
    },
    {
      page: 'pages/odoo.html',
      title: 'Install Odoo Community & Enterprise',
      section: 'Deployment',
      keywords: ['odoo', 'community', 'enterprise', 'git', 'clone', 'virtual environment', 'pip', 'requirements', 'python'],
      headings: [
        { text: 'Clone the Repositories', id: 'repos' },
        { text: 'Create a Python Virtual Environment', id: 'venv' },
        { text: 'Install Python Dependencies', id: 'deps' },
        { text: 'Project Layout', id: 'layout' },
        { text: 'Verification', id: 'verify' },
      ],
    },
    {
      page: 'pages/configuration.html',
      title: 'Configure Odoo',
      section: 'Deployment',
      keywords: ['odoo.conf', 'configuration', 'admin_passwd', 'proxy_mode', 'workers', 'memory', 'dbfilter', 'addons_path', 'http_interface'],
      headings: [
        { text: 'Create the Configuration File', id: 'conf' },
        { text: 'Important Configuration Options', id: 'options' },
        { text: 'Database Configuration', id: 'db' },
        { text: 'Memory Tuning', id: 'memory' },
        { text: 'Verification', id: 'verify' },
      ],
    },
    {
      page: 'pages/systemd.html',
      title: 'systemd Service',
      section: 'Deployment',
      keywords: ['systemd', 'service', 'odoo.service', 'ExecStart', 'Restart', 'journalctl', 'daemon-reload', 'enable', 'start'],
      headings: [
        { text: 'Why use systemd?', id: 'why' },
        { text: 'Create the Service File', id: 'service' },
        { text: 'Enable the Service', id: 'enable' },
        { text: 'Verification', id: 'verify' },
        { text: 'Common Issues', id: 'troubleshooting' },
      ],
    },
    {
      page: 'pages/nginx.html',
      title: 'Nginx Reverse Proxy',
      section: 'Deployment',
      keywords: ['nginx', 'reverse proxy', 'upstream', 'proxy_pass', 'websocket', 'ssl', 'server_name', 'location', 'proxy_set_header'],
      headings: [
        { text: 'Why Nginx?', id: 'why' },
        { text: 'Nginx Configuration', id: 'config' },
        { text: 'Verification', id: 'verify' },
        { text: 'Common Issues', id: 'issues' },
      ],
    },
    {
      page: 'pages/domain.html',
      title: 'Domain Configuration',
      section: 'Deployment',
      keywords: ['domain', 'dns', 'a record', 'cname', 'propagation', 'registrar', 'dig', 'nslookup', 'host'],
      headings: [
        { text: 'Overview', id: 'overview' },
        { text: 'Create DNS Records', id: 'dns' },
        { text: 'Verify DNS Resolution', id: 'verify' },
        { text: 'DNS Propagation', id: 'propagation' },
        { text: 'Common Issues', id: 'issues' },
      ],
    },
    {
      page: 'pages/https.html',
      title: 'HTTPS with Let\'s Encrypt',
      section: 'Deployment',
      keywords: ['https', 'ssl', 'tls', 'certbot', "let's encrypt", 'certificate', 'renewal', 'certbot --nginx', 'port 443'],
      headings: [
        { text: 'Prerequisites', id: 'prereq' },
        { text: 'Install Certbot', id: 'install' },
        { text: 'Request a Certificate', id: 'certificate' },
        { text: 'Automatic Renewal', id: 'renew' },
        { text: 'Verification', id: 'verify' },
        { text: 'Common Issues', id: 'issues' },
      ],
    },
    {
      page: 'pages/firewall.html',
      title: 'Firewall Configuration',
      section: 'Deployment',
      keywords: ['firewall', 'iptables', 'oracle security list', 'port 22', 'port 80', 'port 443', 'ingress rules', 'ssh', 'ufw'],
      headings: [
        { text: 'Overview', id: 'overview' },
        { text: 'Required Ports', id: 'layers' },
        { text: 'Oracle Security List', id: 'oracle' },
        { text: 'Linux Firewall (iptables)', id: 'iptables' },
        { text: 'Verification', id: 'verify' },
        { text: 'Common Issues', id: 'troubleshooting' },
      ],
    },
    {
      page: 'pages/helper-commands.html',
      title: 'Helper Commands',
      section: 'Administration',
      keywords: ['helper', 'alias', 'odoo-status', 'odoo-restart', 'odoo-log', 'odoo-start', 'odoo-stop', 'scripts', '/usr/local/bin'],
      headings: [
        { text: 'Overview', id: 'overview' },
        { text: 'Recommended Commands', id: 'aliases' },
        { text: 'Create the Scripts', id: 'install' },
        { text: 'Example Usage', id: 'usage' },
        { text: 'Verification', id: 'verify' },
      ],
    },
    {
      page: 'pages/troubleshooting.html',
      title: 'Troubleshooting',
      section: 'Administration',
      keywords: ['troubleshooting', 'debug', 'error', 'dns', 'nginx', 'enterprise', 'https', 'certbot', 'firewall', 'systemd', 'memory', '502', 'bad gateway'],
      headings: [
        { text: 'DNS Problems', id: 'dns' },
        { text: 'Nginx Problems', id: 'nginx' },
        { text: 'Enterprise Modules Missing', id: 'enterprise' },
        { text: 'HTTPS Issues', id: 'certbot' },
        { text: 'Firewall Issues', id: 'firewall' },
        { text: 'Odoo Service Won\'t Start', id: 'systemd' },
        { text: 'Memory Limit Warnings', id: 'memory' },
      ],
    },
    {
      page: 'pages/appendix.html',
      title: 'Appendix & Quick Reference',
      section: 'Reference',
      keywords: ['appendix', 'reference', 'quick reference', 'checklist', 'odoo.conf', 'nginx', 'systemd', 'commands', 'directory layout'],
      headings: [
        { text: 'Recommended Directory Layout', id: 'layout' },
        { text: 'Final odoo.conf', id: 'conf' },
        { text: 'systemd Summary', id: 'service' },
        { text: 'Nginx Summary', id: 'nginx' },
        { text: 'Daily Administration Commands', id: 'commands' },
        { text: 'Deployment Checklist', id: 'checklist' },
      ],
    },
  ];

  /* ── Resolve base URL ── */
  function getBase() {
    const path = location.pathname;
    if (path.endsWith('/pages/') || path.includes('/pages/')) {
      return '../';
    }
    return './';
  }

  /* ── Score a query against an entry ── */
  function score(entry, query) {
    const q = query.toLowerCase().trim();
    if (!q) return 0;
    let s = 0;
    if (entry.title.toLowerCase().includes(q)) s += 10;
    entry.headings.forEach(h => {
      if (h.text.toLowerCase().includes(q)) s += 5;
    });
    entry.keywords.forEach(k => {
      if (k.toLowerCase().includes(q)) s += 3;
    });
    return s;
  }

  /* ── Search ── */
  function search(query) {
    if (!query || query.length < 2) return [];
    const base = getBase();
    const results = [];

    INDEX.forEach(entry => {
      const s = score(entry, query);
      if (s === 0) return;

      const matchingHeadings = entry.headings.filter(h =>
        h.text.toLowerCase().includes(query.toLowerCase())
      );

      if (matchingHeadings.length > 0) {
        matchingHeadings.forEach(h => {
          results.push({
            score: s + 2,
            href: base + entry.page + '#' + h.id,
            pageTitle: entry.title,
            heading: h.text,
            section: entry.section,
          });
        });
      } else {
        results.push({
          score: s,
          href: base + entry.page,
          pageTitle: entry.title,
          heading: null,
          section: entry.section,
        });
      }
    });

    return results.sort((a, b) => b.score - a.score).slice(0, 12);
  }

  /* ── Render results ── */
  function renderResults(results, container) {
    container.innerHTML = '';

    if (results.length === 0) {
      container.innerHTML = '<div class="search-no-results">No results found. Try different keywords.</div>';
      return;
    }

    // Group by section
    const groups = {};
    results.forEach(r => {
      if (!groups[r.section]) groups[r.section] = [];
      groups[r.section].push(r);
    });

    Object.entries(groups).forEach(([section, items]) => {
      const groupTitle = document.createElement('div');
      groupTitle.className = 'search-result-group-title';
      groupTitle.textContent = section;
      container.appendChild(groupTitle);

      items.forEach(item => {
        const a = document.createElement('a');
        a.className = 'search-result-item';
        a.href = item.href;
        a.innerHTML = `
          <div class="result-page-title">${item.pageTitle}</div>
          ${item.heading ? `<div class="result-heading"># ${item.heading}</div>` : ''}
        `;
        container.appendChild(a);
      });
    });
  }

  /* ── Inline search (header) ── */
  function initInlineSearch() {
    const input = document.querySelector('.search-input');
    const resultsEl = document.querySelector('.search-results');
    if (!input || !resultsEl) return;

    let timeout;
    let focusedIndex = -1;

    input.addEventListener('input', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const q = input.value.trim();
        if (q.length < 2) {
          resultsEl.classList.remove('visible');
          return;
        }
        const results = search(q);
        renderResults(results, resultsEl);
        resultsEl.classList.add('visible');
        focusedIndex = -1;
      }, 150);
    });

    input.addEventListener('keydown', e => {
      const items = [...resultsEl.querySelectorAll('.search-result-item')];
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        focusedIndex = Math.min(focusedIndex + 1, items.length - 1);
        items.forEach((el, i) => el.classList.toggle('focused', i === focusedIndex));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        focusedIndex = Math.max(focusedIndex - 1, -1);
        items.forEach((el, i) => el.classList.toggle('focused', i === focusedIndex));
      } else if (e.key === 'Enter' && focusedIndex >= 0) {
        e.preventDefault();
        items[focusedIndex].click();
      } else if (e.key === 'Escape') {
        resultsEl.classList.remove('visible');
        input.blur();
      }
    });

    document.addEventListener('click', e => {
      if (!e.target.closest('.search-box')) {
        resultsEl.classList.remove('visible');
      }
    });

    input.addEventListener('focus', () => {
      if (input.value.trim().length >= 2) {
        resultsEl.classList.add('visible');
      }
    });
  }

  /* ── Keyboard shortcut ── */
  function initKeyboardShortcut() {
    document.addEventListener('keydown', e => {
      if ((e.key === '/' || (e.key === 'k' && (e.ctrlKey || e.metaKey))) && !e.altKey) {
        const tag = document.activeElement.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;
        e.preventDefault();
        const input = document.querySelector('.search-input');
        if (input) {
          input.focus();
          input.select();
        }
      }
    });
  }

  /* ── Init ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initInlineSearch();
      initKeyboardShortcut();
    });
  } else {
    initInlineSearch();
    initKeyboardShortcut();
  }

})();
