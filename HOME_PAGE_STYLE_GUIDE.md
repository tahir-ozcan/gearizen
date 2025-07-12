# Home Page Style & Config Guide

This document outlines how the Gearizen Home page pulls its content and the recommended styling conventions.

## Configuration

- **data/home.json** – Contains the hero section text and the list of feature cards. It can be edited or replaced by a CMS in the future.
- **lib/home-data.ts** – Provides TypeScript types and a helper `getHomeData()` used by the client component.

Modifying the JSON allows you to change the hero headline, sub‑headline, CTA label/link and the order or content of the feature cards without touching the React code.

## Styling

- Uses the global Tailwind utility classes defined in `app/globals.css`.
- Layout is mobile‑first: single column by default, two columns on small screens, grid on larger breakpoints.
- Feature icons are rendered via the dynamic `ToolCard` component which loads Lucide icons on demand.
- Maintain accessible focus styles for links and buttons using the `.focus-visible` utilities.
- To add a new tool card, append an entry in the JSON and it will automatically render.

## Components

- **app/home-client.tsx** – Renders the hero section and feature grid using data from `getHomeData()`.
- **components/ToolCard.tsx** – Shared card component handling icon loading and link semantics.

Keep all imagery optimized (SVG where possible) and ensure any new interactive elements meet keyboard and screen‑reader accessibility standards.
