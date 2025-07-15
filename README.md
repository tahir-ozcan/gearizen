# Gearizen

> Instant, privacy-first web tools for developers and creators — 100% client-side, free, no signup required, SEO-optimized.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Development](#development)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Configuration & Metadata](#configuration-metadata)
- [Analytics & Ads](#analytics-ads)
- [Build & Deploy](#build-deploy)
- [License](#license)
- [Contact](#contact)

## Overview

Gearizen is a collection of lightweight, privacy-focused utilities built with Next.js and Tailwind CSS. All tools run entirely in the browser—no server calls, no user tracking, and no accounts. Perfect for rapid prototyping or embedding in static sites.

## Installation

```bash
git clone https://github.com/tahir-ozcan/gearizen.git
cd gearizen
npm install
```

## Development

```bash
npm run dev
```

Then open http://localhost:3000 in your browser. Hot-reload is enabled for instant feedback.

### Project Structure

```bash
gearizen/
├─ app/  
│  ├─ layout.tsx          # Global layout & providers  
│  ├─ page.tsx            # Home page  
│  └─ tools/              # Each subfolder is a standalone tool  
│     ├─ pdf-toolkit/  
│     │  ├─ page.tsx      # Tool page wrapper & metadata  
│     │  └─ pdf-toolkit-client.tsx  
│     └─ …  
├─ components/            # Shared UI components  
├─ public/                # Static assets (icons, fonts, sitemap.xml)  
├─ types/                 # Custom TypeScript declaration files  
├─ styles/                # Global CSS (Tailwind config, globals.css)  
├─ tests/                 # Jest & Playwright tests  
├─ next.config.js         # Next.js configuration & custom webpack rules  
├─ tsconfig.json          # TypeScript configuration  
├─ package.json  
└─ README.md  
```

### Testing

## Unit Tests

Written with Jest:

```bash
npm test
```

## End-to-End Tests

Written with Playwright:

```bash
npm run test:e2e
```

Note: Browsers must be installed once via
`npx playwright install`
We skip automatic downloads in CI with `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`.

### Configuration & Metadata

Each tool page under `app/tools/.../page.tsx` exports a `metadata` object:

- **title** & **description** control the `<head>` tags
- **openGraph** & **twitter** fields define social previews
- **alternates** ensure canonical URLs

Follow semantic heading order (H1 → H2 → H3).

### Analytics & Ads

We inject Google Analytics and AdSense via `<AnalyticsLoader />` in app/layout.tsx. The loader uses Next.js `<Script>` components to include:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR_ID');
</script>

<!-- Google AdSense -->
<script async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=CA-PUB-XXXX"
  crossorigin="anonymous"></script>
```

To disable analytics or ads, simply remove the `<AnalyticsLoader />` import from `app/layout.tsx.`

### Build & Deploy

1. Create a production build:

```bash
npm run build
```

2. Preview locally:

```bash
npm start
```

3. Deploy on Vercel (recommended):

```bash
vercel
```

### License

MIT License. See LICENSE for full text.

### Contact
For questions or feedback, email [gearizen.tahir.ozcan@gmail.com](mailto:gearizen.tahir.ozcan@gmail.com) or open an issue on [GitHub](https://github.com/tahir-ozcan/gearizen).
