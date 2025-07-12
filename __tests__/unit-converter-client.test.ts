/** @jest-environment jsdom */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UnitConverterClient from '../app/tools/unit-converter/unit-converter-client';

describe('UnitConverterClient', () => {
  test('updates units when category changes', async () => {
    const user = userEvent.setup();
    render(React.createElement(UnitConverterClient));
    const input = screen.getByLabelText('Value') as HTMLInputElement;
    await user.clear(input);
    await user.type(input, '2');
    const categorySelect = screen.getByLabelText('Category');
    await user.selectOptions(categorySelect, 'weight');
    const from = screen.getByLabelText('From') as HTMLSelectElement;
    const to = screen.getByLabelText('To') as HTMLSelectElement;
    expect(from.value).toBe('g');
    expect(to.value).toBe('kg');
    expect(input.value).toBe('2');
  });

  test('swap units keeps focus on input', async () => {
    const user = userEvent.setup();
    render(React.createElement(UnitConverterClient));
    const input = screen.getByLabelText('Value') as HTMLInputElement;
    input.focus();
    const from = screen.getByLabelText('From') as HTMLSelectElement;
    const to = screen.getByLabelText('To') as HTMLSelectElement;
    const swap = screen.getByRole('button', { name: 'Swap units' });
    const beforeFrom = from.value;
    const beforeTo = to.value;
    await user.click(swap);
    expect(from.value).toBe(beforeTo);
    expect(to.value).toBe(beforeFrom);
    expect(document.activeElement).toBe(input);
  });
});
