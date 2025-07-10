// app/tools/currency-converter/currency-converter-client.tsx
"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { calculateConversion } from "./currency-utils";

interface Rates {
  [currency: string]: number;
}

export default function CurrencyConverterClient() {
  const [amount, setAmount] = useState<number>(1);
  const [base, setBase] = useState<string>("USD");
  const [target, setTarget] = useState<string>("EUR");
  const [rates, setRates] = useState<Rates>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load exchange rates when the base currency changes only. Target is
  // intentionally omitted from the dependency array to avoid re-fetching after
  // setting the default target currency.
  useEffect(() => {
    // Load rates whenever the base currency changes
    const controller = new AbortController();

    async function loadRates() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `https://api.exchangerate.host/latest?base=${encodeURIComponent(base)}`,
          { signal: controller.signal }
        );
        if (!res.ok) {
          throw new Error(`HTTP Error ${res.status}`);
        }

        const json = await res.json();

        // API shape: { success: boolean, rates: { USD: 1, ... } }
        if (!json || typeof json !== "object") {
          throw new Error("Invalid response format");
        }

        if (json.success === false) {
          throw new Error("API error");
        }

        if (typeof json.rates !== "object" || json.rates === null) {
          throw new Error("Invalid response format");
        }

        const newRates = json.rates as Rates;
        setRates(newRates);

        // target kodumuz yeni gelen listede yoksa ilkini seç
        const codes = Object.keys(newRates).sort();
        if (!codes.includes(target)) {
          setTarget(codes[0]);
        }
      } catch (e: unknown) {
        // Capture network or parsing errors and surface a friendly message
        setError(e instanceof Error ? e.message : "Failed to load rates");
        setRates({});
      } finally {
        setLoading(false);
      }
    }

    loadRates();

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base]);

  const handleAmount = (e: ChangeEvent<HTMLInputElement>) =>
    setAmount(Number(e.target.value));
  const handleBase = (e: ChangeEvent<HTMLSelectElement>) =>
    setBase(e.target.value);
  const handleTarget = (e: ChangeEvent<HTMLSelectElement>) =>
    setTarget(e.target.value);

  const rate = rates[target];
  const result = typeof rate === "number" ? calculateConversion(amount, rate) : "";

  const copyResult = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      alert("✅ Result copied!");
    } catch {
      alert("❌ Copy failed.");
    }
  };

  const currencyOptions = Object.keys(rates).sort();

  return (
    <section
      id="currency-converter"
      aria-labelledby="currency-converter-heading"
      className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-16 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="currency-converter-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        Currency Converter
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Convert between world currencies in real time. Rates fetched live from
        a free API; 100% client-side, no signup required.
      </p>

      {loading && (
        <p className="text-center text-gray-700 mb-6">Loading rates…</p>
      )}

      {error && (
        <div
          role="alert"
          className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm"
        >
          Error: {error}
        </div>
      )}

      {!loading && !error && (
        <form
          className="max-w-md mx-auto space-y-6"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Amount */}
          <div>
            <label
              htmlFor="amount"
              className="block mb-1 font-medium text-gray-800"
            >
              Amount
            </label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={handleAmount}
              min="0"
              step="any"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Base & Target */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="base-currency"
                className="block mb-1 font-medium text-gray-800"
              >
                From
              </label>
              <select
                id="base-currency"
                value={base}
                onChange={handleBase}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                {currencyOptions.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="target-currency"
                className="block mb-1 font-medium text-gray-800"
              >
                To
              </label>
              <select
                id="target-currency"
                value={target}
                onChange={handleTarget}
                disabled={currencyOptions.length === 0}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition disabled:opacity-50"
              >
                {currencyOptions.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Result */}
          <div>
            <label
              htmlFor="result"
              className="block mb-1 font-medium text-gray-800"
            >
              Result
            </label>
            <div className="flex items-center space-x-3">
              <input
                id="result"
                type="text"
                readOnly
                value={result}
                placeholder="—"
                aria-label="Converted amount"
                className="flex-grow bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              <button
                type="button"
                onClick={copyResult}
                disabled={!result}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm font-medium disabled:opacity-60"
              >
                Copy
              </button>
            </div>
          </div>
        </form>
      )}
    </section>
  );
}