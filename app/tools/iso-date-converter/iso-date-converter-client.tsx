"use client";

import { useState, ChangeEvent } from "react";

export default function IsoDateConverterClient() {
  const [iso, setIso] = useState("");
  const [timestamp, setTimestamp] = useState("");

  const handleIsoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIso(value);
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      setTimestamp(date.getTime().toString());
    } else {
      setTimestamp("");
    }
  };

  const handleTimestampChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTimestamp(value);
    const ms = Number(value);
    if (!isNaN(ms)) {
      setIso(new Date(ms).toISOString());
    } else {
      setIso("");
    }
  };

  return (
    <section className="space-y-6 max-w-xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center mb-6">ISO Date Converter</h1>
      <p className="text-center text-gray-600">
        Convert between ISO 8601 date strings and UNIX milliseconds.
      </p>
      <div className="space-y-4">
        <label className="block">
          <span className="block mb-1 font-medium">ISO Date</span>
          <input
            type="datetime-local"
            value={iso.split(".")[0]}
            onChange={handleIsoChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>
        <label className="block">
          <span className="block mb-1 font-medium">Timestamp (ms)</span>
          <input
            type="text"
            value={timestamp}
            onChange={handleTimestampChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>
      </div>
    </section>
  );
}
