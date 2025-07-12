/** @jest-environment jsdom */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactClient from '../app/contact/contact-client';

Object.defineProperty(window, 'location', {
  value: { href: '' },
  writable: true,
});

describe('ContactClient integration', () => {
  test('shows validation errors and success message', async () => {
    const user = userEvent.setup();
    render(<ContactClient />);

    const submit = screen.getByRole('button', { name: /send message/i });
    await user.click(submit);
    expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);

    await user.type(screen.getByLabelText(/name/i), 'Tester');
    await user.type(screen.getByLabelText(/^email/i), 'tester@example.com');
    await user.type(screen.getByLabelText(/message/i), 'hello');

    await user.click(submit);
    expect(screen.getByRole('status')).toHaveTextContent(/thank you/i);
    expect(window.location.href).toMatch('mailto:');
  });
});
