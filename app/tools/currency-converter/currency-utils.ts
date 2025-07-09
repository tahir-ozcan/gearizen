// Utility helpers for the Currency Converter tool.

export function calculateConversion(amount: number, rate: number): string {
  if (!Number.isFinite(amount) || !Number.isFinite(rate)) return '';
  return (amount * rate).toFixed(4);
}
