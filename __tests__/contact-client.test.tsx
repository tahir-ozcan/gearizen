/** @jest-environment jsdom */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactClient from '../app/contact/contact-client';
import * as formUtils from '../lib/contactForm';

jest.spyOn(formUtils, 'submitContactForm').mockResolvedValue({ success: true });

describe('ContactClient', () => {
  test('shows success message on valid submit', async () => {
    const user = userEvent.setup();
    render(<ContactClient />);
    await user.type(screen.getByLabelText('Name'), 'John');
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.type(screen.getByLabelText('Message'), 'Hi');
    await user.click(screen.getByRole('button', { name: /send message/i }));
    expect(await screen.findByRole('status')).toHaveTextContent(/thank you/i);
  });

  test('shows validation errors', async () => {
    const user = userEvent.setup();
    render(<ContactClient />);
    await user.click(screen.getByRole('button', { name: /send message/i }));
    expect(await screen.findAllByRole('alert')).toHaveLength(3);
  });
});
