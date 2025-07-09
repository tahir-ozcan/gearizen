# Gearizen

> Client-side Next.js tools platform — free, no signup, SEO-optimized.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Ads & Analytics](#ads--analytics)
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

After installation run `npm run dev` and open <http://localhost:3000> in your browser.

### Metadata Guidelines

Each page exports a `metadata` object to define `<title>`, description and social tags. Use semantic headings (H1 → H2…) and keep URLs canonical via the `alternates` field.

### Ads & Analytics

Google AdSense and Google Analytics load once globally using Next.js `next/script`
with the `afterInteractive` strategy. This avoids CORS errors and ensures both
scripts appear in every page's `<head>`.

### Testing

Unit tests are written with [uvu](https://github.com/lukeed/uvu). Execute all tests with:

```bash
npm test
```

Run the production build to ensure pages compile correctly:

```bash
npm run build
```

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
tahir59201@gmail.com
