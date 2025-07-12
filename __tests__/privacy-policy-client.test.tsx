/** @jest-environment jsdom */
import { render, screen } from '@testing-library/react';
import PrivacyClient from '../app/privacy/privacy-client';

it('renders policy sections from JSON', () => {
  render(<PrivacyClient />);
  const heading = screen.getByRole('heading', { name: 'Data We Don\u2019t Collect' });
  expect(heading).toBeInTheDocument();
});
