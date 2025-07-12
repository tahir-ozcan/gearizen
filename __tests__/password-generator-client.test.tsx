/** @jest-environment jsdom */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PasswordGeneratorClient from '../app/tools/password-generator/password-generator-client';

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

  test('pattern field disables length slider', async () => {
    const user = userEvent.setup();
    render(<PasswordGeneratorClient />);
    const slider = screen.getByRole('slider');
    expect(slider).not.toBeDisabled();
    const patternInput = screen.getByLabelText(/pattern/i);
    await user.type(patternInput, 'Aa0');
    expect(slider).toBeDisabled();
    await user.clear(patternInput);
    expect(slider).not.toBeDisabled();
  });
});
