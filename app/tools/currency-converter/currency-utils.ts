export interface Rates {
  [currency: string]: number;
}

/** Fetch currency rates from exchangerate.host */
export async function fetchRates(base: string): Promise<Rates> {
  const res = await fetch(
    `https://api.exchangerate.host/latest?base=${encodeURIComponent(base)}`,
  );
  if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
  const json = await res.json();
  if (!json || json.success === false || typeof json.rates !== "object") {
    throw new Error("Invalid response format");
  }
  return json.rates as Rates;
}

export function calcResult(amount: number, rate: number): string {
  return (amount * rate).toFixed(4);
}
