// app/tools/unix-timestamp-converter/unix-timestamp-converter-client.tsx

"use client";

import { useState, ChangeEvent, FormEvent } from "react";

export default function UnixTimestampConverterClient() {
  const [timestampInput, setTimestampInput] = useState("");
  const [dateOutput, setDateOutput] = useState("");
  const [tsError, setTsError] = useState<string | null>(null);

  const [dateInput, setDateInput] = useState("");
  const [timestampOutput, setTimestampOutput] = useState("");
  const [dateError, setDateError] = useState<string | null>(null);

  const handleTimestampChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTimestampInput(e.target.value);
    setDateOutput("");
    setTsError(null);
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDateInput(e.target.value);
    setTimestampOutput("");
    setDateError(null);
  };

  const convertTimestamp = (e: FormEvent) => {
    e.preventDefault();
    setDateOutput("");
    setTsError(null);
    const ts = Number(timestampInput);
    if (isNaN(ts)) {
      setTsError("Please enter a valid number.");
      return;
    }
    // Determine seconds vs milliseconds
    const ms = timestampInput.trim().length > 10 ? ts : ts * 1000;
    const d = new Date(ms);
    if (isNaN(d.getTime())) {
      setTsError("Invalid timestamp.");
      return;
    }
    setDateOutput(`${d.toISOString()} (UTC) — ${d.toLocaleString()}`);
  };

  const convertDate = (e: FormEvent) => {
    e.preventDefault();
    setTimestampOutput("");
    setDateError(null);
    const ms = Date.parse(dateInput);
    if (isNaN(ms)) {
      setDateError("Please enter a valid date string or ISO format.");
      return;
    }
    const seconds = Math.floor(ms / 1000);
    setTimestampOutput(`${seconds} (seconds) — ${ms} (ms)`);
  };

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("✅ Copied to clipboard!");
    } catch {
      alert("❌ Copy failed.");
    }
  };

  return (
    <section
      id="unix-timestamp-converter"
      aria-labelledby="utc-heading"
      className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-16 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="utc-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        UNIX Timestamp Converter
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Convert UNIX timestamps to human-readable dates and back. Enter a  
        timestamp (seconds or milliseconds) or a date string/ISO format  
        to get instant, client-side conversions—no signup required.
      </p>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Timestamp → Date */}
        <form onSubmit={convertTimestamp} className="space-y-4">
          <label htmlFor="timestamp-input" className="block mb-1 font-medium text-gray-800">
            Timestamp
          </label>
          <input
            id="timestamp-input"
            type="text"
            value={timestampInput}
            onChange={handleTimestampChange}
            placeholder="e.g. 1657286400 or 1657286400000"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-mono"
          />
          {tsError && (
            <p role="alert" className="text-red-600 text-sm">
              {tsError}
            </p>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium"
          >
            Convert to Date
          </button>
          {dateOutput && (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="font-mono text-sm mb-2">{dateOutput}</p>
              <button
                onClick={() => copyText(dateOutput)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm font-medium"
              >
                Copy Result
              </button>
            </div>
          )}
        </form>

        {/* Date → Timestamp */}
        <form onSubmit={convertDate} className="space-y-4">
          <label htmlFor="date-input" className="block mb-1 font-medium text-gray-800">
            Date String / ISO
          </label>
          <input
            id="date-input"
            type="text"
            value={dateInput}
            onChange={handleDateChange}
            placeholder="e.g. 2023-07-08T00:00:00Z"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          {dateError && (
            <p role="alert" className="text-red-600 text-sm">
              {dateError}
            </p>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium"
          >
            Convert to Timestamp
          </button>
          {timestampOutput && (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="font-mono text-sm mb-2">{timestampOutput}</p>
              <button
                onClick={() => copyText(timestampOutput)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm font-medium"
              >
                Copy Result
              </button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}