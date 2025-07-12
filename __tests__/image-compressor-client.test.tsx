/** @jest-environment jsdom */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageCompressorClient from '../app/tools/image-compressor/image-compressor-client';

function createFile(name: string) {
  return new File(['dummy'], name, { type: 'image/png' });
}

describe('ImageCompressorClient file handling', () => {
  test('shows previews for selected files', async () => {
    const user = userEvent.setup();
    render(<ImageCompressorClient />);
    const dropzone = screen.getByRole('button', { name: /file upload drop zone/i });
    const fileInput = dropzone.querySelector('input[type="file"]') as HTMLInputElement;
    const files = [createFile('a.png'), createFile('b.png')];
    await user.upload(fileInput, files);
    expect(screen.getAllByText(/Original/i).length).toBe(files.length);
  });
});
