export interface Rates {
  [currency: string]: number;
}

/**
 * Format conversion result with four decimal places.
 */
export function calculateConversion(amount: number, rate: number): string {
  return (amount * rate).toFixed(4);
}

/**
 * Fetch conversion rates for the given base currency.
 */
export async function fetchRates(base: string): Promise<Rates> {
  const res = await fetch(
    `https://api.exchangerate.host/latest?base=${encodeURIComponent(base)}`
  );
  if (!res.ok) {
    throw new Error(`HTTP Error ${res.status}`);
  }
  const json = await res.json();
  if (!json || typeof json !== 'object' || typeof json.rates !== 'object') {
    throw new Error('Invalid response format');
  }
  return json.rates as Rates;
}
