// app/tools/unit-converter/unit-converter-client.tsx

"use client";

import { useState, ChangeEvent, useEffect, useRef } from "react";
import { CategoryKey, convert, getUnitCategories } from "../../../lib/unit-convert";
import { motion } from "framer-motion";

const categories = getUnitCategories();

export default function UnitConverterClient() {
  const firstCat = Object.keys(categories)[0] as CategoryKey;
  const [category, setCategory] = useState<CategoryKey>(firstCat);
  const initUnits = Object.keys(categories[firstCat].units);
  const [fromUnit, setFromUnit] = useState<string>(initUnits[0]);
  const [toUnit, setToUnit] = useState<string>(initUnits[1] || initUnits[0]);
  const [input, setInput] = useState<string>("1");
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [swapped, setSwapped] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
      if (!Number.isFinite(value)) {
        setError("Please enter a valid number.");
        setOutput("");
        return;
      }
      if (value < 0 && category !== "temperature") {
        setError("Value must be non-negative.");
        setOutput("");
        return;
      }
      if (Math.abs(value) > Number.MAX_SAFE_INTEGER) {
        setError("Value is too large.");
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
    setSwapped((s) => !s);
    inputRef.current?.focus();
  };

  return (
    <section
      id="unit-converter"
      aria-labelledby="unit-converter-heading"
      className="container-responsive py-20 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="unit-converter-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        Unit Converter
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Convert between units of length, weight, volume, temperature, time and data
        instantly. 100% client-side, no signup required.
      </p>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="max-w-xl mx-auto grid gap-6 sm:grid-cols-2"
        aria-label="Unit converter form"
      >
        <div className="sm:col-span-2">
          <label htmlFor="category" className="block mb-1 font-medium text-gray-800">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={onCategoryChange}
            className="input-base"
          >
            {Object.entries(categories).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="from-unit" className="block mb-1 font-medium text-gray-800">
            From
          </label>
          <select
            id="from-unit"
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="input-base"
          >
            {Object.entries((categories[category].units as Record<string, string>)).map(([value, label]) => (
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
            onChange={(e) => setToUnit(e.target.value)}
            className="input-base"
          >
            {Object.entries((categories[category].units as Record<string, string>)).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <motion.button
          type="button"
          onClick={swapUnits}
          animate={{ rotate: swapped ? 180 : 0 }}
          className="sm:col-span-2 mx-auto text-indigo-600 hover:underline focus:outline-none transition-transform"
        >
          Swap units
        </motion.button>

        <div className="sm:col-span-2">
          <label htmlFor="input-value" className="block mb-1 font-medium text-gray-800">
            Value
          </label>
          <input
            id="input-value"
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter value"
            className="input-base font-mono"
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
            {(categories[category].units as Record<string, string>)[toUnit]}
          </p>
        </div>
      )}
    </section>
  );
}