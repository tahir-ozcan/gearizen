# Contact Page Config & UX Guide

The contact page pulls all email addresses, social links, and form fields from `lib/contactConfig.ts`.
New channels or fields can be added by editing this single file without touching the React component.

## contactConfig.ts structure

```ts
export interface ContactField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'textarea';
  required?: boolean;
}

export interface ContactChannel {
  label: string;
  href: string;
  icon: string; // React Icons name
}

export interface ContactConfig {
  encodedEmail: string; // Base64 encoded email address
  channels: ContactChannel[];
  fields: ContactField[];
}
```

### Adding a new channel

1. Import the appropriate icon name from `react-icons/fa`.
2. Append an entry to the `channels` array:

```ts
channels: [
  // ...existing channels
  { label: 'Slack', href: 'https://slack.com/your', icon: 'FaSlack' },
];
```

### Adding form fields

Simply push a new field descriptor to the `fields` array. Supported types are
`text`, `email` and `textarea`.

```ts
fields: [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'team', label: 'Team', type: 'text' },
  // etc
];
```

## UX Notes

- The form progressively enhances: without JavaScript it falls back to a native
  `mailto:` action.
- With JavaScript enabled it intercepts submission, validates input and launches
the user's email client via an encoded `mailto:` link. Success and error
messages announce via ARIA live regions.
- Layout adapts from stacked fields on small screens to a two-column grid on
large displays. Labels align inline from medium widths upward.
- Social links and contact info in the footer remain legible at all viewport
sizes.
