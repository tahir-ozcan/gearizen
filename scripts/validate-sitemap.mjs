import fs from 'fs';
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser();
const xml = fs.readFileSync('public/sitemap.xml', 'utf8');
let urls = [];
try {
  const obj = parser.parse(xml);
  const sitemaps = obj.sitemapindex?.sitemap;
  if (sitemaps) {
    for (const sm of sitemaps) {
      const path = sm.loc.replace('https://gearizen.com/', 'public/');
      const data = parser.parse(fs.readFileSync(path, 'utf8'));
      urls.push(...(data.urlset?.url || []).map(u => u.loc));
    }
  } else {
    urls = (obj.urlset?.url || []).map(u => u.loc);
  }
} catch (e) {
  console.error('Invalid sitemap', e);
  process.exit(1);
}
if (urls.length === 0) {
  console.error('No URLs found in sitemap');
  process.exit(1);
}
console.log(`Validated sitemap with ${urls.length} URLs.`);
