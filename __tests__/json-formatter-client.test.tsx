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
});
