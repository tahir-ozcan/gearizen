# Contact Page Config & UX Guide

This document explains how the contact page derives its data and how to extend it.

## Configuration

All contact related information lives in `lib/contactConfig.ts`.

```ts
export interface ContactConfig {
  email: string; // Base64 encoded email address
  socialLinks: { label: string; href: string; icon: string }[];
  formFields: { name: string; label: string; type: 'text' | 'email' | 'textarea'; required?: boolean }[];
}
```

- **email** – stored in Base64 to deter spam bots. Use the `decodeEmail()` helper from `lib/contactForm.ts`.
- **socialLinks** – list of external profiles. Icons correspond to names from `react-icons/fa` and are lazy loaded on the client. Add new links (e.g. Slack, Discord) by appending to this array—no code changes needed.
- **formFields** – drives the contact form. Fields can be reordered or new optional fields added here.

## Form Handling

`lib/contactForm.ts` provides:

- `validateContactForm(data, fields)` – returns validation errors for the provided data.
- `submitContactForm(data)` – simulated async submission used for progressive enhancement.
- `decodeEmail(encoded)` – utility to decode the email string.

These functions are unit tested in `__tests__/contactForm.test.ts`.

## Accessibility & UX

- Labels are properly associated with inputs and validation errors are announced via `aria-live` regions.
- The form progressively enhances: it has a normal HTML submission action to `mailto:` but uses JavaScript to intercept and display success or error states without leaving the page.
- Layout is mobile first: stacked fields on small screens, inline labels on medium, and a two column grid on large viewports.

## Extending

1. Update `lib/contactConfig.ts` to modify addresses or add new communication channels.
2. Icons must be available in `react-icons/fa`; otherwise include a dynamic import in `app/contact/contact-client.tsx`.
3. Add Playwright tests if new fields alter user flows.
