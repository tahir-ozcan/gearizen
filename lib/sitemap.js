const seo = require('../seo-config.json');

function buildHtmlSitemap(urls, siteUrl = seo.siteUrl) {
  const sections = {};
  const categorize = (url) => {
    const path = url.replace(siteUrl, '');
    if (path === '/' || path === '') return 'Home';
    if (path.startsWith('/tools')) return 'Tools';
    if (['/about', '/contact'].includes(path)) return 'Pages';
    return 'Legal';
  };
  urls.forEach((url) => {
    const section = categorize(url);
    sections[section] ||= [];
    sections[section].push(url);
  });

  let html = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Sitemap</title></head><body>';
  html += '<h1>Sitemap</h1>';
  for (const [section, links] of Object.entries(sections)) {
    html += `<h2>${section}</h2><ul>`;
    links.forEach((link) => {
      const path = link.replace(siteUrl, '') || '/';
      html += `<li><a href="${link}">${path}</a></li>`;
    });
    html += '</ul>';
  }
  html += '</body></html>';
  return html;
}

module.exports = { buildHtmlSitemap };
