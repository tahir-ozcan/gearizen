import fg from 'fast-glob';
import { writeFileSync } from 'fs';
import { SitemapStream, streamToPromise } from 'sitemap';

const baseUrl = 'https://gearizen.com';

export default async function generate() {
  const pageFiles = await fg(['app/**/page.tsx'], { ignore: ['**/not-found/**', '**/error.tsx'] });
  const routes = pageFiles
    .map((p) => p.replace(/^app/, '').replace(/\/page\.tsx$/, ''))
    .filter((r) => !['/not-found', '/error'].includes(r))
    .sort();

  const sitemap = new SitemapStream({ hostname: baseUrl });
  routes.forEach((r) => sitemap.write({ url: r || '/' }));
  sitemap.end();
  const xml = await streamToPromise(sitemap).then((d) => d.toString());
  writeFileSync('public/sitemap.xml', xml);

  const htmlLinks = routes
    .map((r) => `<li><a href="${baseUrl}${r}">${r || '/'}</a></li>`) 
    .join('\n');
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Sitemap</title></head><body><h1>Sitemap</h1><ul>${htmlLinks}</ul></body></html>`;
  writeFileSync('public/sitemap.html', html);

  const robots = `User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml`;
  writeFileSync('public/robots.txt', robots);
}

if (process.argv[1] === new URL('', import.meta.url).pathname) {
  generate();
}
