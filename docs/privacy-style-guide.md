# Privacy Policy Content & Style Guide

This document outlines how Gearizen structures and styles the Privacy Policy page.

## JSON Schema
Each section of the policy is stored in `lib/privacy-sections.json` using the following fields:

```json
{
  "id": "string",             // unique section anchor
  "title": "string",          // heading text
  "body": "markdown string"   // content in Markdown
}
```

Markdown supports **bold text**, lists, and [links](/contact) which are sanitized before rendering.

## Layout Guidelines
- Mobile: single column, large text with relaxed line height.
- Desktop: content width constrained to `max-w-3xl` with a sticky sidebar table of contents (`lg:w-64`).
- Use Tailwind utility classes for spacing and typography. Headings use the `gradient-text` class and body copy uses `prose` styles.
- Links and legal headings use brand indigo colors for clarity.
- Lists use standard disc bullets.

Follow this guide when updating policy content or adjusting styles to maintain a consistent, accessible design.
