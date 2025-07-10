// app/tools/currency-converter/currency-converter-client.tsx
"use client";

import { useState, ChangeEvent } from "react";
import { calculateConversion } from "./currency-utils";
import { rates as baseRates } from "./exchange-rates";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function CurrencyConverterClient() {
  const [amount, setAmount] = useState<number>(1);
  const [base, setBase] = useState<string>("USD");
  const [target, setTarget] = useState<string>("EUR");

  const rates = baseRates;

  const handleAmount = (e: ChangeEvent<HTMLInputElement>) =>
    setAmount(Number(e.target.value));
  const handleBase = (e: ChangeEvent<HTMLSelectElement>) =>
    setBase(e.target.value);
  const handleTarget = (e: ChangeEvent<HTMLSelectElement>) =>
    setTarget(e.target.value);

  const rate =
    baseRates[base] && baseRates[target]
      ? baseRates[target] / baseRates[base]
      : undefined;
  const result =
    typeof rate === "number" ? calculateConversion(amount, rate) : "";

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
        Convert between common world currencies using offline rates. Everything
        runs client-side—no network requests or signup required.
      </p>

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
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={handleAmount}
              min="0"
              step="any"
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
              <Input
                id="result"
                type="text"
                readOnly
                value={result}
                placeholder="—"
                aria-label="Converted amount"
                className="flex-grow bg-gray-50 font-mono"
              />
              <Button
                type="button"
                onClick={copyResult}
                disabled={!result}
                className="bg-green-600 hover:bg-green-700 focus:ring-green-500 text-sm disabled:opacity-60"
              >
                Copy
              </Button>
            </div>
          </div>
        </form>
      </section>
  );
}
