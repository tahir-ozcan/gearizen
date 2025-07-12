import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import JsonFormatterClient from '../app/tools/json-formatter/json-formatter-client';

/** @jest-environment jsdom */

describe('JsonFormatterClient', () => {
  test('shows formatted output on input', async () => {
    const user = userEvent.setup();
    render(<JsonFormatterClient />);
    const input = screen.getByLabelText('JSON input');
    await user.type(input, '{"a":1}');
    const output = await screen.findByLabelText('Formatted JSON output');
    expect(output.innerHTML).toContain('"a"');
  });

  test('displays error message on invalid JSON', async () => {
    const user = userEvent.setup();
    render(<JsonFormatterClient />);
    const input = screen.getByLabelText('JSON input');
    await user.type(input, '{');
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/invalid/i);
  });

  test('copy button disabled without output', () => {
    render(<JsonFormatterClient />);
    const copyBtn = screen.getByRole('button', { name: 'Copy' });
    expect(copyBtn).toBeDisabled();
  });
});
