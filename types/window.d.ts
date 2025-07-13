// types/window.d.ts
export {};

declare global {
  interface Window {
    /**
     * Google’s dataLayer array for gtag/analytics pushes.
     */
    dataLayer: unknown[];

    /**
     * Optional shorthand you might use:
     * (you can remove this if you don’t attach gtag to window)
     */
    gtag?: (...args: unknown[]) => void;
  }
}