# Privacy Policy Content & Style Guide

This document describes the structure for privacy policy content used in the Gearizen application.

## JSON Schema

`docs/privacy-policy.json` contains an array of sections:

```json
{
  "title": "Section Heading",
  "markdown": "Markdown content supporting **bold**, lists, and [links](https://example.com)"
}
```

IDs for anchor links are generated from the `title` using the `slugify` utility with stop words removed.

## Styling Guidelines

- Use a single column layout with `prose` typography on mobile.
- Constrain content width on desktop and display a sticky table of contents in the sidebar.
- Headings use brand colors and follow a consistent scale: `text-4xl` for the page title and `text-2xl sm:text-3xl` for section headings.
- Lists use standard disc bullets and `leading-relaxed` line height for readability.
- Links are styled with `text-indigo-600` and underline on hover.
- Provide sufficient color contrast and focus rings for keyboard navigation.
