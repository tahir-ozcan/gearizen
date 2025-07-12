# About Page Config & Style Guide

The About page content is defined in `data/about.json`. Blocks can be reordered
or edited without touching code. Supported block types are:

- `hero` – main heading and introductory paragraphs.
- `bullets` – "Why Choose" style lists.
- `team` – team member grid with avatar, name and bio.
- `cta` – call to action paragraph with link.

Each block is rendered by `app/about/about-client.tsx`. To try A/B copy, create
alternate JSON files and swap them during build.

Layout follows the global Tailwind utility classes:

- Mobile: single-column flow.
- `md` breakpoint: text paragraphs split into two columns.
- `lg` breakpoint: centered grid for team members.

Avatars use the `Image` component with `loading="lazy"` and `unoptimized` to
avoid network processing. Icons are from `lucide-react`.

For accessibility, headings use semantic levels and focus styles rely on the
site-wide utilities defined in `globals.css`.
