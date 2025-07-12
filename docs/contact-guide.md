# Contact Page Config & UX Guide

This document outlines how the Gearizen contact page is configured and how the form behaves.

## Configuration

The contact page reads its options from `lib/contact-config.json`. This file defines:

- **emails** – array of email addresses used for `mailto:` links
- **social** – list of social or chat channels with an icon name and URL
- **formFields** – ordered fields rendered in the contact form

Adding or removing entries updates the page automatically without code changes. Icons use names from `react-icons/fa`.

## Form Behaviour

The form progressively enhances:

1. **HTML fallback** – without JavaScript the form posts to the first email address via `mailto:`.
2. **JavaScript enabled** – submission is intercepted to validate required fields and then open the user’s mail client using a composed `mailto:` link. Success and error feedback is shown inside the page using ARIA live regions.

Validation logic lives in `lib/contactForm.ts` and is covered by unit tests.

## Responsive Layout

- Fields stack vertically on small screens.
- Labels and inputs align inline from the `sm` breakpoint.
- On `lg` screens the page uses a two‑column layout with the form alongside the contact methods list.

All interactive elements meet keyboard and touch target guidelines and follow the site’s global styling utilities.
