/** @jest-environment jsdom */
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageCompressorClient from '../app/tools/image-compressor/image-compressor-client';

describe('ImageCompressorClient file handling', () => {
  function createFile() {
    return new File([new Uint8Array([137,80,78,71,13,10,26,10])], 'test.png', {
      type: 'image/png',
    });
  }

  test('handles multiple file uploads', async () => {
    const user = userEvent.setup();
    render(<ImageCompressorClient />);
    const dropzone = screen.getByRole('button', { name: /upload images/i });
    const input = dropzone.querySelector('input') as HTMLInputElement;
    const files = [createFile(), createFile()];
    await user.upload(input, files);
    expect(await screen.findAllByAltText('Original')).toHaveLength(2);
  });

  test('drop event adds files', async () => {
    render(<ImageCompressorClient />);
    const dropzone = screen.getByRole('button', { name: /upload images/i });
    const file = createFile();
    const data = new DataTransfer();
    data.items.add(file);
    fireEvent.drop(dropzone, { dataTransfer: data });
    expect(await screen.findByAltText('Original')).toBeInTheDocument();
  });
});
