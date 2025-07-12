# Site Map & SEO Implementation Guide

## Sitemap Generation
- `scripts/generate-sitemap.mjs` scans `app/**/page.tsx` and outputs `public/sitemap.xml` and `public/sitemap.html`.
- Run automatically after `npm run build` via the `postbuild` script.
- `public/robots.txt` is also regenerated pointing to the sitemap.

## Canonical Routing
- `middleware.ts` normalizes URLs to lowercase and removes trailing slashes.
- `next.config.ts` sets `trailingSlash: false` and adds redirects for trailing slashes.

## Central SEO Config
- `seo-config.json` holds metadata for common pages. Pages import this JSON to populate exported `metadata` objects.

## Testing
- Unit: `__tests__/sitemap-generator.test.ts` ensures the generator lists the home page.
- Integration: `__tests__/metadata.test.ts` verifies canonical URLs.
- E2E: `e2e/sitemap.spec.ts` checks that `sitemap.xml` and `robots.txt` return 200.

## CI
- `.github/workflows/seo.yml` runs nightly, builds the project, regenerates the sitemap, validates against the XSD, and executes Lighthouse CI.

