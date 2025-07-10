# Gearizen

> Client-side Next.js tools platform — free, no signup, SEO-optimized.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [License](#license)
- [Contact](#contact)

## Installation

```bash
git clone https://github.com/tahir-ozcan/gearizen.git
cd gearizen
npm install
npm run dev
```

## Usage

After installation run `npm run dev` and open <http://localhost:3000> in your browser. All tools run entirely client-side with no external APIs.

### Metadata Guidelines

Each page exports a `metadata` object to define `<title>`, description and social tags. Use semantic headings (H1 → H2…) and keep URLs canonical via the `alternates` field.

### Testing

Unit tests are written with [Jest](https://jestjs.io/). Execute all tests with:

```bash
npm test
```

Run the production build to ensure pages compile correctly:

```bash
npm run build
```

### Ads & Analytics

Google AdSense and Google Analytics are injected into the `<head>` of every
page through `app/components/AnalyticsLoader.tsx`.  Replace the IDs below with
your own if deploying a fork. The loader renders the following snippets exactly
as provided by Google using Next.js `Script` components:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-V74SWZ9H8B"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-V74SWZ9H8B');
</script>

<script async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2108375251131552"
        crossorigin="anonymous"></script>
```

To disable analytics or ads, remove `AnalyticsLoader` from `app/layout.tsx`.

### Build & Deploy

Create a production build and start the server:

```bash
npm run build
npm start
```

### Running Tests

Unit tests use [Jest](https://jestjs.io/):

```bash
npm test
```

End-to-end tests are written with [Playwright](https://playwright.dev/):

```bash
npm run test:e2e
```

Install browsers once with `npx playwright install`.

## Project Structure

```bash
gearizen/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ tools/
│  │  ├─ password-generator/
│  │  └─ …
│  └─ …
├─ components/
├─ public/
├─ types/
├─ README.md
├─ LICENSE
└─ package.json
```

## License

MIT — see LICENSE

## Contact
gearizen.tahir.ozcan@gmail.com
