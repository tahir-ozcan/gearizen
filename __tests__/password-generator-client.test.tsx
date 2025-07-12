import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PasswordGeneratorClient from '../app/tools/password-generator/password-generator-client';

/** @jest-environment jsdom */

describe('PasswordGeneratorClient', () => {
  test('generates a new password when button is clicked', async () => {
    const user = userEvent.setup();
    render(<PasswordGeneratorClient />);
    const input = screen.getByLabelText('Generated password') as HTMLInputElement;
    const before = input.value;
    const button = screen.getByRole('button', { name: /generate password/i });
    await user.click(button);
    expect(input.value).not.toBe(before);
  });
});
