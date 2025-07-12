import { validate, buildMailto, obfuscateEmail } from '../lib/contactForm';

describe('contact form utils', () => {
  test('validate detects required fields', () => {
    const fields = [
      { name: 'name', label: 'Name', required: true },
      { name: 'email', label: 'Email', required: true },
    ];
    const errors = validate({ name: 'John', email: '' }, fields);
    expect(errors).toEqual({ email: 'Email is required' });
  });

  test('buildMailto encodes params', () => {
    const mail = buildMailto('a@example.com', { name: 'J', message: 'Hi' });
    expect(mail).toBe('mailto:a@example.com?name=J&message=Hi');
  });

  test('obfuscateEmail converts characters to entities', () => {
    expect(obfuscateEmail('a@b.com')).toContain('&#97;');
  });
});
