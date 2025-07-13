// app/tools/base-converter-client.tsx
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  ClipboardCopy,
  RefreshCcw,
} from "lucide-react";

export default function BaseConverterClient() {
  // ————————————————————————————————————————————————————————————————————
  // State
  // ————————————————————————————————————————————————————————————————————
  const [inputValue, setInputValue] = useState("");
  const [fromBase, setFromBase] = useState(10);
  const [toBase, setToBase] = useState(2);
  const [outputValue, setOutputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Advanced options
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [uppercaseHex, setUppercaseHex] = useState(true);
  const [fixedWidth, setFixedWidth] = useState<number | "">("");
  const [groupDigits, setGroupDigits] = useState(false);
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");

  // Auto-focus on input
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Supported bases 2–36
  const baseOptions = useMemo(
    () => Array.from({ length: 35 }, (_, i) => i + 2),
    []
  );

  // ————————————————————————————————————————————————————————————————————
  // Conversion & Formatting Effect
  // ————————————————————————————————————————————————————————————————————
  useEffect(() => {
    setErrorMessage(null);

    const trimmed = inputValue.trim();
    if (!trimmed) {
      setOutputValue("");
      return;
    }

    // Validate characters
    const validChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".slice(
      0,
      fromBase
    );
    for (const ch of trimmed.toUpperCase()) {
      if (!validChars.includes(ch)) {
        setErrorMessage(`Invalid “${ch}” for base ${fromBase}.`);
        setOutputValue("");
        return;
      }
    }

    // Parse to BigInt
    let decimalValue = BigInt(0);
    const bigBase = BigInt(fromBase);
    for (const ch of trimmed.toUpperCase()) {
      decimalValue =
        decimalValue * bigBase + BigInt(validChars.indexOf(ch));
    }

    // Zero shortcut
    let core: string;
    if (decimalValue === 0n) {
      core = "0";
    } else {
      // Convert to target base
      const bigTarget = BigInt(toBase);
      let current = decimalValue < 0n ? -decimalValue : decimalValue;
      const outChars: string[] = [];
      while (current > 0n) {
        const rem = Number(current % bigTarget);
        outChars.push(validChars[rem]);
        current = current / bigTarget;
      }
      if (decimalValue < 0n) outChars.push("-");
      core = outChars.reverse().join("");
      if (toBase === 16 && !uppercaseHex) {
        core = core.toLowerCase();
      }
    }

    // Fixed-width padding
    if (fixedWidth && typeof fixedWidth === "number") {
      core = core.padStart(fixedWidth, "0");
    }

    // Inline formatting: grouping, prefix, suffix
    let formatted = core;
    if (groupDigits) {
      const sign = formatted.startsWith("-") ? "-" : "";
      const body = sign ? formatted.slice(1) : formatted;
      formatted =
        sign +
        body.replace(/\B(?=(\w{3})+(?!\w))/g, "_");
    }
    if (prefix) {
      formatted = prefix + formatted;
    }
    if (suffix) {
      formatted = formatted + suffix;
    }

    setOutputValue(formatted);
  }, [
    inputValue,
    fromBase,
    toBase,
    uppercaseHex,
    fixedWidth,
    groupDigits,
    prefix,
    suffix,
  ]);

  // ————————————————————————————————————————————————————————————————————
  // Handlers
  // ————————————————————————————————————————————————————————————————————
  const copyToClipboard = async () => {
    if (!outputValue) return;
    try {
      await navigator.clipboard.writeText(outputValue);
      alert("✅ Copied!");
    } catch {
      alert("❌ Copy failed");
    }
  };

  const resetAll = () => {
    setInputValue("");
    setFromBase(10);
    setToBase(2);
    setUppercaseHex(true);
    setFixedWidth("");
    setGroupDigits(false);
    setPrefix("");
    setSuffix("");
    setErrorMessage(null);
    setOutputValue("");
    setShowAdvanced(false);
    inputRef.current?.focus();
  };

  return (
    <section
      id="base-converter"
      aria-labelledby="base-converter-heading"
      className="space-y-16 text-gray-900 antialiased"
    >
      {/* Hero / Title */}
      <div className="text-center space-y-4 px-4 sm:px-0">
        <h1
          id="base-converter-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl
            font-extrabold tracking-tight
          "
        >
          Base Converter
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
          Convert numbers between bases (2–36) right here in your browser — no
          servers, no tracking, instant.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/tools"
            className="text-indigo-600 hover:text-indigo-800 font-medium transition"
          >
            ← All Tools
          </Link>
          <button
            onClick={resetAll}
            aria-label="Reset converter"
            className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition"
          >
            <RefreshCcw className="w-5 h-5" aria-hidden="true" /> Reset
          </button>
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-xl mx-auto space-y-8 px-4 sm:px-0">
        {/* Input Field */}
        <div>
          <label
            htmlFor="input-value"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            Input Value
          </label>
          <input
            id="input-value"
            type="text"
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="e.g. FF, 1010, 123"
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 font-mono transition"
          />
        </div>

        {/* Base Selectors */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[120px]">
            <label
              htmlFor="from-base"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              From Base
            </label>
            <select
              id="from-base"
              value={fromBase}
              onChange={(e) => setFromBase(Number(e.target.value))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              {baseOptions.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[120px]">
            <label
              htmlFor="to-base"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              To Base
            </label>
            <select
              id="to-base"
              value={toBase}
              onChange={(e) => setToBase(Number(e.target.value))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              {baseOptions.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Output Field */}
        <div>
          <label
            htmlFor="output-value"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            Output Value
          </label>
          <div className="relative">
            <input
              id="output-value"
              type="text"
              readOnly
              value={outputValue}
              placeholder="—"
              className="block w-full pr-12 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-gray-900"
            />
            <button
              onClick={copyToClipboard}
              aria-label="Copy result"
              disabled={!outputValue}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none transition disabled:opacity-50"
            >
              <ClipboardCopy className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Error */}
        {errorMessage && (
          <p role="alert" className="text-red-600 text-sm">
            {errorMessage}
          </p>
        )}

        {/* Advanced Options */}
        <div>
          <button
            onClick={() => setShowAdvanced((v) => !v)}
            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition"
          >
            Advanced
            {showAdvanced ? (
              <ChevronUp className="w-4 h-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          {showAdvanced && (
            <div className="mt-4 space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              {/* Uppercase Hex */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={uppercaseHex}
                  onChange={(e) => setUppercaseHex(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-gray-700 text-sm">
                  Uppercase Hex (A–F)
                </span>
              </label>

              {/* Fixed Width */}
              <div>
                <label
                  htmlFor="fixed-width"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Fixed Width
                </label>
                <input
                  id="fixed-width"
                  type="number"
                  min={0}
                  placeholder="Auto"
                  value={fixedWidth}
                  onChange={(e) =>
                    setFixedWidth(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  className="block w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              {/* Group Digits */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={groupDigits}
                  onChange={(e) => setGroupDigits(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-gray-700 text-sm">
                  Group digits with “_”
                </span>
              </label>

              {/* Prefix */}
              <div>
                <label
                  htmlFor="prefix"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Prefix
                </label>
                <input
                  id="prefix"
                  type="text"
                  placeholder="e.g. 0x"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              {/* Suffix */}
              <div>
                <label
                  htmlFor="suffix"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Suffix
                </label>
                <input
                  id="suffix"
                  type="text"
                  placeholder="e.g. h"
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}