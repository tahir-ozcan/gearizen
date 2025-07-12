/** @jest-environment jsdom */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactClient from '../app/contact/contact-client';
import * as contactModule from '../lib/contactConfig';

jest.mock('../lib/contactConfig', () => {
  const actual = jest.requireActual('../lib/contactConfig');
  return {
    ...actual,
    sendContactForm: jest.fn(() => Promise.resolve()),
  };
});

describe('ContactClient', () => {
  test('submits form successfully', async () => {
    const user = userEvent.setup();
    render(<ContactClient />);
    await user.type(screen.getByLabelText(/name/i), 'A');
    await user.type(screen.getByLabelText(/email/i), 'a@example.com');
    await user.type(screen.getByLabelText(/message/i), 'hello');
    await user.click(screen.getByRole('button', { name: /send message/i }));
    expect(contactModule.sendContactForm).toHaveBeenCalled();
    await screen.findByRole('status');
  });

  test('shows validation errors', async () => {
    const user = userEvent.setup();
    render(<ContactClient />);
    await user.click(screen.getByRole('button', { name: /send message/i }));
    expect(await screen.findAllByText('Required')).toHaveLength(3);
  });
});
