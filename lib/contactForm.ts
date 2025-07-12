import { FormField } from './contactConfig';

export interface ValidationErrors {
  [key: string]: string;
}

export function decodeEmail(encoded: string): string {
  try {
    return atob(encoded);
  } catch {
    return encoded;
  }
}

export function validateContactForm(
  data: Record<string, string>,
  fields: FormField[]
): ValidationErrors {
  const errors: ValidationErrors = {};
  for (const field of fields) {
    if (field.required && !data[field.name]?.trim()) {
      errors[field.name] = `${field.label} is required`;
    }
    if (field.type === 'email' && data[field.name]) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data[field.name])) {
        errors[field.name] = 'Invalid email address';
      }
    }
  }
  return errors;
}

export async function submitContactForm(
  data: Record<string, string>
): Promise<{ success: boolean }> {
  // Simulated async submission
  return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 300));
}
