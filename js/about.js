// SPDX-FileCopyrightText: 2026 Keresztes Zsolt <https://kereszteszsolt.hu>
// SPDX-License-Identifier: MIT

(function () {
"use strict";

const shapes = {"globe": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M3 12h18M12 3a17 17 0 0 1 0 18 17 17 0 0 1 0-18Z\"/>", "code": "<path d=\"m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18\"/>", "user": "<circle cx=\"12\" cy=\"7\" r=\"4\"/><path d=\"M4 21v-3a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v3Z\"/>", "heart": "<path d=\"M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z\"/>", "coffee": "<path d=\"M4 8h13v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Zm13 1h2a3 3 0 0 1 0 6h-2M7 3v2m4-2v2m4-2v2\"/>", "info": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 7v6m0 4h.01\"/>"};
const licenseUrl = 'https://opensource.org/license/mit';
let nextId = 0;
function node(tag, className, text) {
  const value = document.createElement(tag);
  value.className = className;
  if (text) value.textContent = text;
  return value;
}
function icon(kind) {
  const holder = node('span', '');
  holder.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shapes[kind]}</svg>`;
  return holder.firstElementChild;
}
function href(value) {
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : ''; } catch { return ''; }
}
function anchor(url, label, className = '') {
  const link = node('a', className, label);
  link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
  return link;
}
function positionTooltip(link) {
  const tip = link.querySelector('[role="tooltip"]');
  const row = link.parentElement.getBoundingClientRect(); const box = link.getBoundingClientRect();
  const center = box.left - row.left + box.width / 2;
  const left = Math.max(0, Math.min(center - tip.offsetWidth / 2, row.width - tip.offsetWidth));
  tip.style.left = `${left}px`; tip.style.bottom = `${row.bottom - box.top + 10}px`;
  tip.style.setProperty('--tooltip-arrow', `${center - left}px`);
}
function aboutLink(url, label, description, kind) {
  const link = anchor(url, '', 'about-link' + (kind === 'coffee' ? ' coffee-link' : ''));
  link.setAttribute('aria-label', label);
  link.append(icon(kind), document.createTextNode(label));
  const tip = node('span', 'link-tooltip'); tip.id = `about-tip-${++nextId}`; tip.role = 'tooltip';
  tip.append(node('span', '', description), node('span', 'tooltip-url', url));
  link.setAttribute('aria-describedby', tip.id); link.append(tip);
  link.addEventListener('pointerenter', () => positionTooltip(link)); link.addEventListener('focus', () => positionTooltip(link));
  return link;
}
function attribution(info, website = true) {
  const footer = node('div', 'author-attribution');
  const line = node('span', 'copyright-line', `© ${new Date().getFullYear()} ${info.authorName}, `);
  line.append(anchor(licenseUrl, 'MIT')); footer.append(line);
  if (website) {
    const sites = node('span', 'author-websites');
    for (const [field, className] of [['authorWebsite', 'author-website'], ['extraWebsite', 'extra-website']]) {
      const url = href(info[field]);
      if (!url) continue;
      if (sites.children.length) {
        const separator = node('span', '', '|'); separator.setAttribute('aria-hidden', 'true'); sites.append(separator);
      }
      sites.append(anchor(url, new URL(url).hostname, className));
    }
    if (sites.children.length) footer.append(sites);
  }
  return footer;
}
async function initializeAbout() {
  const { loadAppInfo, appAsset } = await import('./app-info.js');
  const info = await loadAppInfo();
  document.title = info.appName; document.querySelector('.app-name').textContent = info.appName;
  document.querySelector('.site-header__tagline').textContent = info.appTagline;
  document.querySelector('[data-home-link]').setAttribute('aria-label', `${info.appName} home`);
  const mark = appAsset(info.appIcon);
  if (mark) { const image = node('img', 'app-icon'); image.src = mark; image.alt = ''; image.width = 36; image.height = 36; document.querySelector('.app-icon').replaceWith(image); } else { document.querySelector('.app-icon')?.remove(); }
  const favicon = appAsset(info.appFavicon); if (favicon) document.querySelector('link[rel="icon"]').href = favicon;
  document.getElementById('about-title').textContent = `About ${info.appName}`;
  const content = document.createDocumentFragment(); const poster = appAsset(info.appPoster);
  if (poster) { const image = node('img', 'about-poster'); image.src = poster; image.alt = `${info.appName} project poster`; image.width = 780; image.height = 480; content.append(image); }
  const description = node('p', 'about-description', info.appDescription); description.id = 'about-description'; content.append(description);
  const project = node('nav', 'about-links'); project.setAttribute('aria-label', 'Project and author links');
  const support = node('nav', 'about-links about-support-links'); support.setAttribute('aria-label', 'Support the author');
  const languages = Array.isArray(info.authorWebsiteLanguages) ? info.authorWebsiteLanguages : [];
  const availability = languages.length ? ` Available in ${languages.join(' | ')}.` : '';
  const links = [
    ['authorWebsite', href(info.authorWebsite) ? new URL(info.authorWebsite).hostname : 'Author website', `About ${info.authorName}, projects and contact.${availability}`, 'globe'],
    ['appWebsite', 'Project website', 'Visit the project website.', 'globe'],
    ['appGithubUrl', 'Source', `Source code for ${info.appName}.`, 'code'],
    ['authorGithub', 'GitHub profile', `Explore ${info.authorName}'s projects.`, 'user'],
    ['authorBuyMeACoffeeUrl', 'Buy me a Coffee', `Support ${info.authorName} on Buy Me a Coffee.`, 'coffee'],
    ['authorWaysToSupportUrl', 'Ways to support', `Ways to support ${info.authorName}'s work.`, 'heart'],
  ];
  for (const [field, label, detail, kind] of links) if (href(info[field])) (kind === 'coffee' || kind === 'heart' ? support : project).append(aboutLink(info[field], label, detail, kind));
  content.append(project);
  if (support.children.length) {
    content.append(support);
    if (info.supportRemarkText) { const note = node('div', 'about-support-note'); note.setAttribute('role', 'note'); note.append(icon('info'), node('p', '', info.supportRemarkText)); content.append(note); }
  }
  content.append(attribution(info, false));
  document.getElementById('about-content').replaceChildren(content);
  document.getElementById('app-attribution').replaceChildren(attribution(info));
}

const dialog = document.getElementById('about-dialog');
dialog.querySelectorAll('[data-about-link]').forEach((link) => {
  link.replaceWith(aboutLink(link.href, link.textContent.trim(), link.dataset.description, link.dataset.aboutLink));
});
dialog.querySelectorAll('[data-about-icon]').forEach((element) => { element.replaceWith(icon(element.dataset.aboutIcon)); });
document.getElementById('about-button').addEventListener('click', () => dialog.showModal());
dialog.querySelector('.about-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target !== dialog) return; const b = dialog.getBoundingClientRect(); if (event.clientX < b.left || event.clientX > b.right || event.clientY < b.top || event.clientY > b.bottom) dialog.close(); });
document.querySelectorAll('[data-current-year]').forEach((element) => { element.textContent = new Date().getFullYear(); });

// Keep the complete default dialog usable without a metadata server.
if (window.location.protocol !== 'file:') {
  void initializeAbout().catch(() => { /* Preserve the HTML fallback. */ });
}
})();
