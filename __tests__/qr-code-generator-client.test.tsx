/** @jest-environment jsdom */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QrCodeGeneratorClient from '../app/tools/qr-code-generator/qr-code-generator-client';

describe('QrCodeGeneratorClient advanced options', () => {
  test('toggle advanced section and adjust margin', async () => {
    const user = userEvent.setup();
    render(<QrCodeGeneratorClient />);
    const toggle = screen.getByRole('button', { name: /advanced options/i });
    expect(screen.queryByLabelText('Margin:')).not.toBeInTheDocument();
    await user.click(toggle);
    const marginSlider = screen.getByLabelText('Margin:');
    expect(marginSlider).toBeInTheDocument();
    await user.type(marginSlider, '{arrowup}');
    expect((marginSlider as HTMLInputElement).value).not.toBe('1');
  });
});
