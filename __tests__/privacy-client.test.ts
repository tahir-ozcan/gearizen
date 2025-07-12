import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import PrivacyClient from '../app/privacy/privacy-client';
import { getPrivacySections } from '../lib/privacy';

describe('PrivacyClient', () => {
  test('renders sections from JSON', () => {
    const html = renderToStaticMarkup(React.createElement(PrivacyClient));
    const sections = getPrivacySections();
    sections.forEach((sec) => {
      expect(html).toContain(sec.title);
    });
  });
});
