import { render, screen } from '@testing-library/react';
import AnalyticsLoader from '@/app/components/AnalyticsLoader';

it('renders AdSense and GA scripts once', () => {
  render(<AnalyticsLoader />);
  const adsScripts = document.querySelectorAll(
    'script[src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]'
  );
  expect(adsScripts.length).toBe(1);
  const gaScripts = document.querySelectorAll(
    'script[src="https://www.googletagmanager.com/gtag/js?id=G-V74SWZ9H8B"]'
  );
  expect(gaScripts.length).toBe(1);
  const initScripts = document.querySelectorAll('script[id="gtag-init"]');
  expect(initScripts.length).toBe(1);
});
