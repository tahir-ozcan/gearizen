# Contact Page Config & UX Guide

The contact page pulls its email address, social links and form fields from
`lib/contact-config.json`. Editing this file allows you to add or remove
channels without touching React code.

## contact-config.json

```json
{
  "channels": [
    { "type": "email", "label": "Email", "address": "<base64>", "icon": "Mail" },
    { "type": "link", "label": "GitHub", "href": "https://...", "icon": "Github" }
  ],
  "form": {
    "fields": [
      { "name": "name", "label": "Name", "type": "text", "required": true },
      { "name": "email", "label": "Email", "type": "email", "required": true },
      { "name": "message", "label": "Message", "type": "textarea", "required": true }
    ]
  }
}
```

- **`address`** values are base64 encoded to hide raw emails from bots.
- Icons are loaded lazily from `lucide-react` using the `icon` name.
- Add new objects under `channels` for services like Slack or Discord to expose
them automatically.

## UX Notes

- The form stacks fields on small screens, shows inline labels on medium and
  switches to two columns on large displays.
- Submission is intercepted with JavaScript to create a `mailto:` link so no data
  ever leaves the browser. Users without JavaScript still get a working mail
  client via the form `action` attribute.
- Validation errors and success messages are announced via ARIA live regions.
- Footer contact info uses semantic `<address>` markup and scales gracefully at
  all viewport sizes.
