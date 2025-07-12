import { execSync } from 'child_process';
import fs from 'fs';
import { gzipSync } from 'zlib';
import { XMLParser } from 'fast-xml-parser';
import seo from '../seo-config.json' assert { type: 'json' };
import { buildHtmlSitemap } from '../lib/sitemap.js';

const PUBLIC_DIR = 'public';

// Run next-sitemap CLI to generate XML sitemaps
execSync('npx next-sitemap', { stdio: 'inherit' });

// parse all sitemap files to collect URLs
const parser = new XMLParser();
const indexXml = fs.readFileSync(`${PUBLIC_DIR}/sitemap.xml`, 'utf8');
let sitemapFiles = [];
try {
  const indexObj = parser.parse(indexXml);
  if (indexObj.sitemapindex?.sitemap) {
    sitemapFiles = indexObj.sitemapindex.sitemap.map((s) =>
      s.loc.replace(seo.siteUrl + '/', `${PUBLIC_DIR}/`)
    );
  } else if (indexObj.urlset?.url) {
    sitemapFiles = [`${PUBLIC_DIR}/sitemap.xml`];
  }
} catch (err) {
  console.error('Failed to parse sitemap index:', err);
  process.exit(1);
}

const urls = [];
for (const file of sitemapFiles) {
  const xml = fs.readFileSync(file, 'utf8');
  const data = parser.parse(xml);
  const entries = data.urlset?.url || [];
  for (const u of entries) {
    if (typeof u.loc === 'string') urls.push(u.loc);
  }
}

// Build human-readable HTML sitemap
const html = buildHtmlSitemap(urls, seo.siteUrl);
fs.writeFileSync(`${PUBLIC_DIR}/sitemap.html`, html);

// Generate robots.txt and gzipped version
const robots = `User-agent: *\nDisallow: /not-found\nSitemap: ${seo.siteUrl}/sitemap.xml\n`;
fs.writeFileSync(`${PUBLIC_DIR}/robots.txt`, robots);
fs.writeFileSync(`${PUBLIC_DIR}/robots.txt.gz`, gzipSync(robots));

console.log('Generated HTML sitemap and robots.txt');
