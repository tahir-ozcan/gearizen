// app/tools/unit-converter/unit-converter-client.tsx
"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";

// ─── Types and Data Definitions ──────────────────────────────────────────────
type LengthUnits = "m" | "km" | "cm" | "mm" | "mi" | "yd" | "ft" | "in";
type MassUnits = "kg" | "g" | "mg" | "lb" | "oz";
type VolumeUnits = "L" | "mL" | "m3" | "gal" | "qt" | "pt" | "cup";
type TemperatureUnits = "C" | "F" | "K";
type TimeUnits = "s" | "min" | "h" | "d";
type DataUnits =
  | "B"
  | "KB"
  | "MB"
  | "GB"
  | "TB"
  | "bit"
  | "kb"
  | "mb"
  | "gb"
  | "tb";

interface CategoryDef<U extends string> {
  label: string;
  units: Record<U, string>;
  factors?: Record<U, number>;
}

const CATEGORIES = {
  length: {
    label: "Length",
    units: {
      m: "Meter",
      km: "Kilometer",
      cm: "Centimeter",
      mm: "Millimeter",
      mi: "Mile",
      yd: "Yard",
      ft: "Foot",
      in: "Inch",
    },
    factors: {
      m: 1,
      km: 1000,
      cm: 0.01,
      mm: 0.001,
      mi: 1609.344,
      yd: 0.9144,
      ft: 0.3048,
      in: 0.0254,
    },
  } as CategoryDef<LengthUnits>,
  mass: {
    label: "Weight",
    units: {
      kg: "Kilogram",
      g: "Gram",
      mg: "Milligram",
      lb: "Pound",
      oz: "Ounce",
    },
    factors: {
      kg: 1,
      g: 0.001,
      mg: 0.000001,
      lb: 0.45359237,
      oz: 0.0283495231,
    },
  } as CategoryDef<MassUnits>,
  volume: {
    label: "Volume",
    units: {
      L: "Liter",
      mL: "Milliliter",
      m3: "Cubic Meter",
      gal: "Gallon",
      qt: "Quart",
      pt: "Pint",
      cup: "Cup",
    },
    factors: {
      L: 1,
      mL: 0.001,
      m3: 1000,
      gal: 3.78541178,
      qt: 0.946352946,
      pt: 0.473176473,
      cup: 0.24,
    },
  } as CategoryDef<VolumeUnits>,
  temperature: {
    label: "Temperature",
    units: {
      C: "°C",
      F: "°F",
      K: "K",
    },
  } as CategoryDef<TemperatureUnits>,
  time: {
    label: "Time",
    units: {
      s: "Second",
      min: "Minute",
      h: "Hour",
      d: "Day",
    },
    factors: {
      s: 1,
      min: 60,
      h: 3600,
      d: 86400,
    },
  } as CategoryDef<TimeUnits>,
  data: {
    label: "Data",
    units: {
      B: "Byte",
      KB: "Kilobyte",
      MB: "Megabyte",
      GB: "Gigabyte",
      TB: "Terabyte",
      bit: "Bit",
      kb: "Kilobit",
      mb: "Megabit",
      gb: "Gigabit",
      tb: "Terabit",
    },
    factors: {
      B: 1,
      KB: 1024,
      MB: 1024 ** 2,
      GB: 1024 ** 3,
      TB: 1024 ** 4,
      bit: 1 / 8,
      kb: 1024 / 8,
      mb: (1024 ** 2) / 8,
      gb: (1024 ** 3) / 8,
      tb: (1024 ** 4) / 8,
    },
  } as CategoryDef<DataUnits>,
};
type CategoryKey = keyof typeof CATEGORIES;

// ─── Conversion Logic ─────────────────────────────────────────────────────────
function convert(
  category: CategoryKey,
  from: string,
  to: string,
  value: number
): number {
  if (category === "temperature") {
    // Celsius ←→ Fahrenheit ←→ Kelvin
    let celsius: number;
    switch (from as TemperatureUnits) {
      case "C":
        celsius = value;
        break;
      case "F":
        celsius = ((value - 32) * 5) / 9;
        break;
      default:
        celsius = value - 273.15;
    }
    switch (to as TemperatureUnits) {
      case "C":
        return celsius;
      case "F":
        return (celsius * 9) / 5 + 32;
      default:
        return celsius + 273.15;
    }
  }

  const def = CATEGORIES[category];
  if (!def.factors) {
    throw new Error(`No conversion factors for ${def.label}.`);
  }
  const fromFactor = def.factors[from as keyof typeof def.factors];
  const toFactor = def.factors[to as keyof typeof def.factors];
  const baseValue = value * fromFactor;
  return baseValue / toFactor;
}

// ─── React Component ─────────────────────────────────────────────────────────
export default function UnitConverterClient() {
  const categoryKeys = Object.keys(CATEGORIES) as CategoryKey[];
  const [category, setCategory] = useState<CategoryKey>(
    categoryKeys[0]
  );

  const units = CATEGORIES[category].units;
  const unitKeys = Object.keys(units);

  const [fromUnit, setFromUnit] = useState<string>(unitKeys[0]);
  const [toUnit, setToUnit] = useState<string>(unitKeys[1] || unitKeys[0]);
  const [inputValue, setInputValue] = useState("1");
  const [outputValue, setOutputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // On category change, reset units & values
  function handleCategoryChange(e: ChangeEvent<HTMLSelectElement>) {
    const cat = e.target.value as CategoryKey;
    setCategory(cat);
    const newUnits = Object.keys(CATEGORIES[cat].units);
    setFromUnit(newUnits[0]);
    setToUnit(newUnits[1] || newUnits[0]);
    setInputValue("1");
    setOutputValue("");
    setError(null);
    inputRef.current?.focus();
  }

  // Swap “from” and “to” units
  function swapUnits() {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setOutputValue("");
    inputRef.current?.focus();
  }

  // Perform conversion with debounce
  useEffect(() => {
    const id = setTimeout(() => {
      const num = parseFloat(inputValue);
      if (Number.isNaN(num)) {
        setError("Please enter a valid number.");
        setOutputValue("");
        return;
      }
      if (num < 0 && category !== "temperature") {
        setError("Negative values are not allowed here.");
        setOutputValue("");
        return;
      }
      try {
        setError(null);
        const result = convert(category, fromUnit, toUnit, num);
        setOutputValue(
          result.toFixed(6).replace(/\.?0+$/, "")
        );
      } catch (err) {
        setError((err as Error).message);
        setOutputValue("");
      }
    }, 300);
    return () => clearTimeout(id);
  }, [category, fromUnit, toUnit, inputValue]);

  return (
    <section
      id="unit-converter"
      aria-labelledby="unit-converter-heading"
      className="space-y-16 text-gray-900 antialiased"
    >
      {/* Heading & Description */}
      <div className="text-center space-y-6 sm:px-0">
        <h1
          id="unit-converter-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          Unit Converter
        </h1>
        <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mx-auto max-w-3xl text-lg sm:text-xl text-gray-700 leading-relaxed">
          Convert length, weight, temperature, volume, time and more between
          metric & imperial units instantly.
        </p>
      </div>

      {/* Controls */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="max-w-3xl mx-auto space-y-8 sm:px-0"
      >
        {/* Category */}
        <div>
          <label
            htmlFor="category-select"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            Category
          </label>
          <select
            id="category-select"
            value={category}
            onChange={handleCategoryChange}
            className="
              w-full p-3 border border-gray-300 rounded-md
              focus:ring-2 focus:ring-[#7c3aed] transition
            "
          >
            {categoryKeys.map((key) => (
              <option key={key} value={key}>
                {CATEGORIES[key].label}
              </option>
            ))}
          </select>
        </div>

        {/* Unit Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="from-unit"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              From
            </label>
            <select
              id="from-unit"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="
                w-full p-3 border border-gray-300 rounded-md
                focus:ring-2 focus:ring-[#7c3aed] transition
              "
            >
              {unitKeys.map((u) => (
                <option key={u} value={u}>
                  {units[u as keyof typeof units]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="to-unit"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              To
            </label>
            <select
              id="to-unit"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="
                w-full p-3 border border-gray-300 rounded-md
                focus:ring-2 focus:ring-[#7c3aed] transition
              "
            >
              {unitKeys.map((u) => (
                <option key={u} value={u}>
                  {units[u as keyof typeof units]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="text-center">
          <button
            type="button"
            onClick={swapUnits}
            className="
              inline-flex items-center px-4 py-2 text-indigo-600 hover:underline
              focus:outline-none transition
            "
          >
            ↔ Swap Units
          </button>
        </div>

        {/* Input Value */}
        <div>
          <label
            htmlFor="value-input"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            Amount
          </label>
          <div className="flex">
            <input
              id="value-input"
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter a number"
              className="
                flex-grow p-3 font-mono border border-gray-300 rounded-l-md
                focus:ring-2 focus:ring-[#7c3aed] transition
              "
            />
            <span className="inline-flex items-center px-3 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700">
              {units[fromUnit as keyof typeof units]}
            </span>
          </div>
          {error && (
            <p role="alert" className="mt-1 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>
      </form>

      {/* Output */}
      {outputValue !== "" && (
        <div className="mt-12 max-w-3xl mx-auto text-center">
          <p className="text-xl font-medium">
            Result:{" "}
            <span className="font-mono text-indigo-600">
              {outputValue}
            </span>{" "}
            {units[toUnit as keyof typeof units]}
          </p>
        </div>
      )}
    </section>
  );
}