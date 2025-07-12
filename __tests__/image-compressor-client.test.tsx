/** @jest-environment jsdom */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageCompressorClient from '../app/tools/image-compressor/image-compressor-client';

function createFile(name: string) {
  const data = new Uint8Array([137,80,78,71,13,10,26,10]);
  return new File([data], name, { type: 'image/png' });
}

describe('ImageCompressorClient file handling', () => {
  test('shows previews for multiple files', async () => {
    const user = userEvent.setup();
    render(<ImageCompressorClient />);
    const input = screen.getByLabelText(/drag and drop images/i) as HTMLInputElement;
    await user.upload(input, [createFile('a.png'), createFile('b.png')]);
    const previews = await screen.findAllByAltText(/Original image/);
    expect(previews).toHaveLength(2);
  });
});
