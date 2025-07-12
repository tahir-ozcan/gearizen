# Privacy Policy Content & Style Guide

This document explains how to update the Privacy Policy page content and maintain consistent styling across Gearizen.

## Updating Content

Policy sections are defined in `app/privacy/privacy-policy.json`. Each item has an `id`, `title`, and Markdown `content`. To add or modify a section:

1. Edit `privacy-policy.json` and update the array.
2. Keep `id` values URL friendly (lowercase and hyphenated).
3. Use basic Markdown for formatting. Links should be relative when linking internally.
4. Run `npm test` to ensure parsing and rendering tests still pass.

## Styling Conventions

- All policy text is rendered with Tailwind's `prose` class and additional styles from `globals.css`.
- Use the `.policy-list` utility for bullet lists to keep spacing consistent.
- Links automatically adopt brand colors via the `.policy-text a` rule.
- Headings follow a consistent scale: `h2` for section titles.
- The table of contents highlights the active section in indigo as the user scrolls.

Follow these guidelines to keep the Privacy Policy readable, accessible, and visually consistent with the rest of the site.
