import { validateContact } from '../lib/contactConfig';

describe('validateContact', () => {
  test('requires required fields', () => {
    const errors = validateContact({});
    expect(errors.name).toBe('Required');
    expect(errors.email).toBe('Required');
    expect(errors.message).toBe('Required');
  });

  test('validates email format', () => {
    const errors = validateContact({ name: 'a', email: 'bad', message: 'x' });
    expect(errors.email).toBe('Invalid email');
  });

  test('returns empty object when valid', () => {
    const errors = validateContact({
      name: 'a',
      email: 'a@example.com',
      message: 'hi',
    });
    expect(errors).toEqual({});
  });
});
