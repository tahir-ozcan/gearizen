export interface FormValues {
  [key: string]: string;
}

export function validate(values: FormValues, fields: { name: string; label: string; required?: boolean }[]): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const f of fields) {
    const value = values[f.name]?.trim();
    if (f.required && !value) {
      errors[f.name] = `${f.label} is required`;
    }
  }
  return errors;
}

export function buildMailto(email: string, values: FormValues): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(values)) {
    if (v) params.set(k, v);
  }
  return `mailto:${email}?${params.toString()}`;
}

export function obfuscateEmail(email: string): string {
  return email
    .split('')
    .map((ch) => `&#${ch.charCodeAt(0)};`)
    .join('');
}
