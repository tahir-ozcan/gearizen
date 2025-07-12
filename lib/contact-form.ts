import { ContactFormField, ContactConfig } from './contact-config';

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateForm(
  values: Record<string, string>,
  fields: ContactFormField[],
): ValidationResult {
  const errors: Record<string, string> = {};
  for (const field of fields) {
    const value = values[field.name]?.trim();
    if (field.required && !value) {
      errors[field.name] = 'This field is required';
    } else if (field.type === 'email' && value) {
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(value)) {
        errors[field.name] = 'Enter a valid email';
      }
    }
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export async function submitForm(
  values: Record<string, string>,
  config: ContactConfig,
) {
  const emailChannel = config.channels.find((c) => c.type === 'email');
  const address = emailChannel?.address
    ? atob(emailChannel.address)
    : '';

  if (!address) return;
  const mailto = new URL(`mailto:${address}`);
  const bodyParts = config.form.fields
    .map((f) => `${f.label}: ${values[f.name] || ''}`)
    .join('\n');
  mailto.searchParams.set('subject', `Contact from ${values.name || 'user'}`);
  mailto.searchParams.set('body', bodyParts);
  window.location.href = mailto.toString();
  await new Promise((r) => setTimeout(r, 200));
}
