/** @type {import('next-sitemap').IConfig} */
const seo = require('./seo-config.json');

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: seo.siteUrl,
  generateRobotsTxt: false,
  outDir: './public',
  trailingSlash: false,
  exclude: ['/not-found', '/error'],
};
