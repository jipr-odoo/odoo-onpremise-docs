/**
 * toc.js — Table of Contents generator with IntersectionObserver
 * Generates a sticky TOC from page headings and highlights active section
 */

(function () {
  'use strict';

  function initTOC() {
    const tocColumn = document.querySelector('.doc-toc-column');
    if (!tocColumn) return;

    const article = document.querySelector('.doc-article');
    if (!article) return;

    const headings = [...article.querySelectorAll('h2, h3')];
    if (headings.length < 2) {
      tocColumn.style.display = 'none';
      return;
    }

    // Build TOC container
    const container = document.createElement('div');
    container.className = 'toc-container';

    const title = document.createElement('div');
    title.className = 'toc-title';
    title.textContent = 'On this page';
    container.appendChild(title);

    const list = document.createElement('ul');
    list.className = 'toc-list';
    list.setAttribute('aria-label', 'Page sections');

    headings.forEach(heading => {
      // Ensure heading has an id
      if (!heading.id) {
        heading.id = heading.textContent
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
      }

      // Add anchor icon to heading
      if (!heading.querySelector('.anchor')) {
        const anchor = document.createElement('a');
        anchor.className = 'anchor';
        anchor.href = '#' + heading.id;
        anchor.setAttribute('aria-hidden', 'true');
        anchor.textContent = '#';
        heading.appendChild(anchor);
      }

      const li = document.createElement('li');
      li.className = `toc-item toc-${heading.tagName.toLowerCase()}`;

      const a = document.createElement('a');
      a.href = '#' + heading.id;
      a.textContent = heading.textContent.replace('#', '').trim();
      a.addEventListener('click', e => {
        e.preventDefault();
        const headerHeight = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--header-height')
        ) || 60;
        const y = heading.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        window.scrollTo({ top: y, behavior: 'smooth' });
      });

      li.appendChild(a);
      list.appendChild(li);
    });

    container.appendChild(list);
    tocColumn.appendChild(container);

    // IntersectionObserver for active heading
    const tocLinks = [...list.querySelectorAll('a')];
    const headerHeight = 60;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const id = entry.target.id;
          const link = tocLinks.find(a => a.getAttribute('href') === '#' + id);
          if (!link) return;
          if (entry.isIntersecting) {
            tocLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        });
      },
      {
        rootMargin: `-${headerHeight + 20}px 0px -70% 0px`,
        threshold: 0,
      }
    );

    headings.forEach(h => observer.observe(h));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTOC);
  } else {
    initTOC();
  }

})();
