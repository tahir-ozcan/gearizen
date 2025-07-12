/** @jest-environment jsdom */
import { render, screen } from '@testing-library/react';
import PrivacyClient from '../app/privacy/privacy-client';
import { getPrivacySections } from '../lib/privacy';

describe('PrivacyClient', () => {
  test('renders headings for each section', () => {
    render(<PrivacyClient />);
    const sections = getPrivacySections().filter(s => s.id !== 'intro');
    sections.forEach(sec => {
      const heading = screen.getByRole('heading', { name: sec.title });
      expect(heading).toBeInTheDocument();
    });
  });
});
