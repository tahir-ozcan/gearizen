/** @jest-environment jsdom */
import { render, screen } from '@testing-library/react';
import { parsePolicy, getPolicySections } from '../lib/privacy-policy';
import PrivacyClient from '../app/privacy/privacy-client';
import policyData from '../docs/privacy-policy.json';
import '@testing-library/jest-dom';

// simple IntersectionObserver mock for jsdom
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// @ts-ignore
global.IntersectionObserver = MockIntersectionObserver;

// Unit test for JSON parsing
describe('parsePolicy', () => {
  test('parses valid JSON', () => {
    const sections = parsePolicy(policyData as unknown);
    expect(sections.length).toBe(policyData.length);
    expect(sections[0]).toHaveProperty('id');
  });

  test('throws on invalid data', () => {
    expect(() => parsePolicy({} as any)).toThrow();
  });
});

// Integration test to verify sections render

describe('PrivacyClient rendering', () => {
  test('renders all policy sections with headings', () => {
    render(<PrivacyClient />);
    const sections = getPolicySections();
    sections.forEach(({ title, id }) => {
      const heading = screen.getByRole('heading', { name: title });
      expect(heading).toHaveAttribute('id', `${id}-heading`);
    });
  });
});
