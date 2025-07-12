/** @jest-environment jsdom */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ColorConverterClient from '../app/tools/color-converter/color-converter-client';

describe('ColorConverterClient', () => {
  test('updates fields when hex changes', async () => {
    const user = userEvent.setup();
    render(<ColorConverterClient />);
    const hex = screen.getByLabelText('HEX');
    await user.clear(hex);
    await user.type(hex, '#00ff00');
    expect(screen.getByLabelText('RGB(A)')).toHaveValue('rgb(0, 255, 0)');
    expect(screen.getByLabelText('HSL(A)')).toHaveValue('hsl(120, 100%, 50%)');
    expect(screen.getByLabelText('CMYK')).toHaveValue('cmyk(100%, 0%, 100%, 0%)');
  });

  test('two-way binding from rgb', async () => {
    const user = userEvent.setup();
    render(<ColorConverterClient />);
    const rgb = screen.getByLabelText('RGB(A)');
    await user.clear(rgb);
    await user.type(rgb, 'rgb(0, 0, 255)');
    expect(screen.getByLabelText('HEX')).toHaveValue('#0000ff');
  });
});
