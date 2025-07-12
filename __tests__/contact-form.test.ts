import { validateForm } from '../lib/contact-form';
import type { ContactFormField } from '../lib/contact-config';

describe('validateForm', () => {
  const fields: ContactFormField[] = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'message', label: 'Message', type: 'textarea', required: true },
  ];

  test('returns errors for missing required fields', () => {
    const result = validateForm({}, fields);
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty('name');
    expect(result.errors).toHaveProperty('email');
    expect(result.errors).toHaveProperty('message');
  });

  test('validates email format', () => {
    const result = validateForm({ name: 'a', email: 'bad', message: 'hi' }, fields);
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBe('Enter a valid email');
  });

  test('passes with correct values', () => {
    const result = validateForm(
      { name: 'Test', email: 'test@example.com', message: 'hi' },
      fields,
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });
});
