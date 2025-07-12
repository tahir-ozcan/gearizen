/** @jest-environment jsdom */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QrCodeGeneratorClient from '../app/tools/qr-code-generator/qr-code-generator-client';

describe('QrCodeGeneratorClient', () => {
  test('updates canvas when size slider changes', async () => {
    const user = userEvent.setup();
    render(<QrCodeGeneratorClient />);
    await user.type(screen.getByLabelText(/text or url/i), 'hello');
    const slider = screen.getByRole('slider');
    await user.clear(slider);
    await user.type(slider, '300');
    const canvas = await screen.findByLabelText(/qr code preview/i);
    expect(canvas).toHaveAttribute('width', '300');
  });

  test('allows changing advanced options', async () => {
    const user = userEvent.setup();
    render(<QrCodeGeneratorClient />);
    await user.type(screen.getByLabelText(/text or url/i), 'hello');
    const select = screen.getByLabelText(/error correction/i);
    await user.selectOptions(select, 'H');
    expect((select as HTMLSelectElement).value).toBe('H');
    const marginInput = screen.getByLabelText(/margin/i);
    await user.clear(marginInput);
    await user.type(marginInput, '4');
    expect((marginInput as HTMLInputElement).value).toBe('4');
  });
});
