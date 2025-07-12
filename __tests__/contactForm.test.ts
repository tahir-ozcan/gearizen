import { validateContactForm } from '../lib/contactForm';
import contactConfig from '../lib/contactConfig';

describe('validateContactForm', () => {
  it('returns errors for missing required fields', () => {
    const errors = validateContactForm({}, contactConfig.formFields);
    expect(errors.name).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors.message).toBeDefined();
  });

  it('validates email format', () => {
    const errors = validateContactForm(
      { name: 'A', email: 'bad', message: 'hi' },
      contactConfig.formFields
    );
    expect(errors.email).toBe('Invalid email address');
  });

  it('passes with valid data', () => {
    const errors = validateContactForm(
      { name: 'A', email: 'a@example.com', message: 'hi' },
      contactConfig.formFields
    );
    expect(Object.keys(errors).length).toBe(0);
  });
});
