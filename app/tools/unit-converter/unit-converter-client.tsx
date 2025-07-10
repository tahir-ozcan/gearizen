// app/tools/unit-converter/unit-converter-client.tsx

"use client";

import { useState, ChangeEvent, useEffect } from "react";

type CategoryKey = "length" | "weight" | "temperature" | "volume";

const categories: Record<CategoryKey, {
  label: string;
  units: Record<string, string>;
}> = {
  length: {
    label: "Length",
    units: {
      m: "Meter (m)",
      km: "Kilometer (km)",
      mi: "Mile (mi)",
      ft: "Foot (ft)",
      in: "Inch (in)",
    },
  },
  weight: {
    label: "Weight",
    units: {
      g: "Gram (g)",
      kg: "Kilogram (kg)",
      lb: "Pound (lb)",
      oz: "Ounce (oz)",
    },
  },
  temperature: {
    label: "Temperature",
    units: {
      C: "Celsius (°C)",
      F: "Fahrenheit (°F)",
      K: "Kelvin (K)",
    },
  },
  volume: {
    label: "Volume",
    units: {
      L: "Liter (L)",
      mL: "Milliliter (mL)",
      gal: "Gallon (gal)",
    },
  },
};

const factors: Record<Exclude<CategoryKey, "temperature">, Record<string, number>> = {
  length: {
    m: 1,
    km: 1000,
    mi: 1609.34,
    ft: 0.3048,
    in: 0.0254,
  },
  weight: {
    g: 1,
    kg: 1000,
    lb: 453.592,
    oz: 28.3495,
  },
  volume: {
    L: 1,
    mL: 0.001,
    gal: 3.78541,
  },
};

export function convert(
  category: CategoryKey,
  from: string,
  to: string,
  value: number
): number {
  if (category === "temperature") {
    if (from === to) return value;
    let celsius: number;
    switch (from) {
      case "C":
        celsius = value;
        break;
      case "F":
        celsius = (value - 32) * 5 / 9;
        break;
      case "K":
        celsius = value - 273.15;
        break;
      default:
        celsius = value;
    }
    switch (to) {
      case "C":
        return celsius;
      case "F":
        return celsius * 9 / 5 + 32;
      case "K":
        return celsius + 273.15;
      default:
        return celsius;
    }
  } else {
    const baseValue = value * (factors[category][from] ?? 1);
    const result = baseValue / (factors[category][to] ?? 1);
    return result;
  }
}

export default function UnitConverterClient() {
  const [category, setCategory] = useState<CategoryKey>("length");
  const [fromUnit, setFromUnit] = useState<string>("m");
  const [toUnit, setToUnit] = useState<string>("km");
  const [input, setInput] = useState<string>("1");
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const onCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const cat = e.target.value as CategoryKey;
    setCategory(cat);
    const units = Object.keys(categories[cat].units);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
    setOutput("");
    setError(null);
  };

  useEffect(() => {
    const t = setTimeout(() => {
      const value = parseFloat(input);
      if (isNaN(value)) {
        setError("Please enter a valid number.");
        setOutput("");
        return;
      }
      setError(null);
      const result = convert(category, fromUnit, toUnit, value);
      setOutput(result.toFixed(6).replace(/\.?0+$/, ""));
    }, 300);
    return () => clearTimeout(t);
  }, [category, fromUnit, toUnit, input]);

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setOutput("");
  };

  return (
    <section
      id="unit-converter"
      aria-labelledby="unit-converter-heading"
      className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-16 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="unit-converter-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        Unit Converter
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Convert between units of length, weight, temperature, and volume
        instantly. 100% client-side, no signup required.
      </p>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="max-w-lg mx-auto space-y-6"
        aria-label="Unit converter form"
      >
        <div>
          <label htmlFor="category" className="block mb-1 font-medium text-gray-800">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={onCategoryChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            {Object.entries(categories).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="from-unit" className="block mb-1 font-medium text-gray-800">
              From
            </label>
            <select
              id="from-unit"
              value={fromUnit}
              onChange={e => setFromUnit(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              {Object.entries(categories[category].units).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="to-unit" className="block mb-1 font-medium text-gray-800">
              To
            </label>
            <select
              id="to-unit"
              value={toUnit}
              onChange={e => setToUnit(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              {Object.entries(categories[category].units).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={swapUnits}
          className="block mx-auto text-indigo-600 hover:underline focus:outline-none transition"
        >
          Swap units
        </button>

        <div>
          <label htmlFor="input-value" className="block mb-1 font-medium text-gray-800">
            Value
          </label>
          <input
            id="input-value"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Enter value"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-mono"
          />
        </div>

        {error && (
          <p role="alert" className="text-red-600 text-sm">
            {error}
          </p>
        )}
      </form>

      {output !== "" && (
        <div className="mt-12 max-w-lg mx-auto text-center">
          <p className="text-xl">
            Result:{" "}
            <span className="font-mono text-xl text-indigo-600">
              {output}
            </span>{" "}
            {categories[category].units[toUnit]}
          </p>
        </div>
      )}
    </section>
  );
}