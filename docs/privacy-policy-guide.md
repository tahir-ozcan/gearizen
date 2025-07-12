# Privacy Policy Content & Style Guide

This guide outlines how to update the privacy policy sections and keep the page consistent with Gearizen's design language.

## Editing Policy Content

- All policy sections are stored in `docs/privacy-policy.json`.
- Each entry has an `id`, `title`, and Markdown `content` field.
- Use simple Markdown for formatting: lists, **bold text**, and [links](/contact).
- Keep language concise and focused on client-side privacy.
- Ensure IDs are lowercase with hyphens so links remain stable.

## Layout & Styling

- The policy page displays a sticky table of contents on desktop.
- Section headings use `h2` elements with IDs from the JSON file.
- Rich text is rendered using the shared `renderMarkdown` utility and styled with Tailwind's `prose` classes.
- Avoid inline styles or additional classes—let the utility classes handle spacing and typography.

## Accessibility Tips

- Include descriptive link text and avoid "click here" phrases.
- Verify color contrast when adjusting colors.
- Test keyboard navigation through the TOC and policy sections.

Following these guidelines ensures the privacy policy stays maintainable and accessible while matching the rest of the Gearizen platform.
