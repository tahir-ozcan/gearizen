/**
 * Gearizen sitemap & robots.txt generator.
 * Run: npm run generate-sitemap
 */

const fs = require('fs/promises');
const path = require('path');
const fg = require('fast-glob');
const { create } = require('xmlbuilder2');
const https = require('https');

const SITE_URL = process.env.SITE_URL || 'https://gearizen.com';
const OUTPUT_DIR = path.join(process.cwd(), 'public');
const LOCALES = ['en', 'tr']; // default locale is English

// Example dynamic route config: map glob pattern to async slug loader
const dynamicRoutes = {
  // '/blog/[slug]': async () => {
  //   const posts = JSON.parse(await fs.readFile('./data/blog.json', 'utf8'));
  //   return posts.map((p) => p.slug);
  // },
};

async function getRoutes() {
  const entries = await fg(['app/**/page.@(js|jsx|ts|tsx|mdx)']);
  const routes = [];

  for (const file of entries) {
    let route = file
      .replace(/^app/, '')
      .replace(/\/page\.[^/]+$/, '');

    if (route === '') route = '/';

    if (/\[.+\]/.test(route)) {
      const generator = dynamicRoutes[route];
      if (typeof generator === 'function') {
        const slugs = await generator();
        slugs.forEach((slug) => {
          routes.push({ route: route.replace(/\[.+\]/, slug), file });
        });
      }
      continue;
    }

    routes.push({ route, file });
  }

  return routes;
}

function metadataFor(route) {
  if (route === '/') return { changefreq: 'daily', priority: '1.0' };
  if (route.startsWith('/tools')) return { changefreq: 'weekly', priority: '0.8' };
  return { changefreq: 'monthly', priority: '0.6' };
}

async function buildSitemap() {
  const docs = [];
  const pages = await getRoutes();

  for (const { route, file } of pages) {
    const stats = await fs.stat(file);
    const { changefreq, priority } = metadataFor(route);

    const links = LOCALES.map((loc) => ({
      '@rel': 'alternate',
      '@hreflang': loc,
      '@href': `${SITE_URL}${loc === 'en' ? '' : `/${loc}`}${route}`,
    }));

    docs.push({
      loc: `${SITE_URL}${route}`,
      lastmod: stats.mtime.toISOString(),
      changefreq,
      priority,
      'xhtml:link': links,
    });
  }

  const xmlObj = {
    urlset: {
      '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
      '@xmlns:xhtml': 'http://www.w3.org/1999/xhtml',
      url: docs,
    },
  };

  const xml = create(xmlObj).end({ prettyPrint: true });
  await fs.writeFile(path.join(OUTPUT_DIR, 'sitemap.xml'), xml, 'utf8');
}

async function updateRobots() {
  const content = `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`;
  await fs.writeFile(path.join(OUTPUT_DIR, 'robots.txt'), content, 'utf8');
}

async function pingSearchEngines() {
  const url = `${SITE_URL}/sitemap.xml`;
  const endpoints = [
    `https://www.google.com/ping?sitemap=${url}`,
    `https://www.bing.com/ping?sitemap=${url}`,
  ];

  await Promise.all(
    endpoints.map(
      (endpoint) =>
        new Promise((resolve) => {
          https
            .get(endpoint, (res) => {
              console.log(`Ping ${endpoint} -> ${res.statusCode}`);
              res.resume();
              resolve();
            })
            .on('error', (err) => {
              console.error(`Ping failed for ${endpoint}:`, err.message);
              resolve();
            });
        })
    )
  );
}

async function main() {
  try {
    await buildSitemap();
    await updateRobots();
    if (process.argv.includes('--ping')) {
      await pingSearchEngines();
    }
    console.log('Sitemap and robots.txt generated.');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
