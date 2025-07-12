/** @jest-environment jsdom */
import { render, screen } from '@testing-library/react';
import AboutClient from '../app/about/about-client';
import { loadAboutData } from '../lib/aboutData';

describe('AboutClient', () => {
  test('renders dynamic blocks', async () => {
    const data = await loadAboutData();
    render(<AboutClient blocks={data.blocks} />);
    const heading = screen.getByRole('heading', { name: /about gearizen/i });
    expect(heading).toBeInTheDocument();
    const bullets = data.blocks.find(b => b.type === 'bullets');
    if (bullets && 'items' in bullets) {
      bullets.items.forEach(item => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    }
  });
});
