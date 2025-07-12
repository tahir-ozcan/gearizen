# Site Map & SEO Implementation Guide

This project uses a custom postbuild script to generate XML and HTML sitemaps and to create a compressed robots.txt. The sitemap generation runs automatically after `next build` through the `postbuild` npm script.

## Updating the Sitemap
1. Run `npm run build`.
2. The `scripts/seo-postbuild.js` script will:
   - Execute `next-sitemap` to create `public/sitemap.xml` and related files.
   - Build a human friendly `public/sitemap.html` using URLs from the XML sitemap.
   - Write `public/robots.txt` and a gzipped version pointing to the sitemap.

Generated files are ignored by Git and served from the `public/` folder at runtime.

## Continuous Monitoring
A GitHub Actions workflow (`.github/workflows/seo.yml`) runs every night to build the project, validate the sitemap structure and collect Lighthouse SEO metrics. Failures will surface in the Actions tab.

## SEO Data
Global SEO settings such as `siteUrl` and organization details reside in `seo-config.json`. Individual pages reference these values when setting metadata and canonical URLs.

Use the provided Playwright and Jest tests (`e2e/seo.spec.ts` and `__tests__/sitemap.test.ts`) to ensure SEO assets render correctly.
