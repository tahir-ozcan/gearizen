// app/tools/time-converter/time-converter-client.tsx
"use client";

import { useState, useEffect, ChangeEvent, useRef } from "react";
import { ClipboardCopy } from "lucide-react";

/**
 * Time Converter Tool
 *
 * Convert a date/time from your local zone to another time zone instantly.
 * Paste or pick a date/time, choose a target zone, and copy the result—
 * all in your browser, no backend required.
 */
export default function TimeConverterClient() {
  // List of common time zones
  const timeZones = [
    "UTC",
    "Europe/London",
    "Europe/Paris",
    "America/New_York",
    "America/Chicago",
    "America/Los_Angeles",
    "Asia/Tokyo",
    "Australia/Sydney",
  ];

  // Build default datetime-local value: YYYY-MM-DDTHH:MM
  const now = new Date();
  const pad2 = (n: number) => n.toString().padStart(2, "0");
  const defaultInput = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(
    now.getDate()
  )}T${pad2(now.getHours())}:${pad2(now.getMinutes())}`;

  // State
  const [inputDateTime, setInputDateTime] = useState<string>(defaultInput);
  const [toZone, setToZone] = useState<string>(
    Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
  );
  const [output, setOutput] = useState<string>("");

  const outputRef = useRef<HTMLTextAreaElement>(null);

  // Whenever the input datetime or target zone changes, recalc
  useEffect(() => {
    if (!inputDateTime) {
      setOutput("");
      return;
    }

    const dt = new Date(inputDateTime);
    if (isNaN(dt.getTime())) {
      setOutput("Invalid date/time");
      return;
    }

    // Format using Intl in the chosen zone
    const fmt = new Intl.DateTimeFormat(undefined, {
      timeZone: toZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    setOutput(fmt.format(dt));
  }, [inputDateTime, toZone]);

  // Handlers
  const handleDateTimeChange = (e: ChangeEvent<HTMLInputElement>) =>
    setInputDateTime(e.target.value);

  const handleZoneChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setToZone(e.target.value);

  const copyOutput = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      alert("✅ Converted time copied!");
    } catch {
      alert("❌ Copy failed.");
    }
  };

  return (
    <section
      id="time-converter"
      aria-labelledby="time-converter-heading"
      className="space-y-16 text-gray-900 antialiased px-4 sm:px-6 lg:px-8"
    >
      {/* Heading & Description */}
      <div className="text-center space-y-4">
        <h1
          id="time-converter-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          Time Converter
        </h1>
        <div className="mx-auto mt-2 h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mx-auto max-w-2xl text-lg text-gray-700 leading-relaxed">
          Pick or paste a local date/time, choose a target time zone, and instantly see
          the converted result. Copy it with one click—100% client-side.
        </p>
      </div>

      {/* Controls */}
      <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <label
            htmlFor="dt-input"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            Local Date &amp; Time
          </label>
          <input
            id="dt-input"
            type="datetime-local"
            value={inputDateTime}
            onChange={handleDateTimeChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7c3aed] transition"
          />
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="zone-select"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            Convert to Time Zone
          </label>
          <select
            id="zone-select"
            value={toZone}
            onChange={handleZoneChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7c3aed] transition"
          >
            {timeZones.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Output */}
      <div className="max-w-3xl mx-auto space-y-4">
        <label
          htmlFor="converted-output"
          className="block text-sm font-medium text-gray-800 mb-1"
        >
          Converted Time
        </label>
        <div className="relative">
          <textarea
            id="converted-output"
            ref={outputRef}
            readOnly
            value={output}
            rows={2}
            className="
              w-full p-3 border border-gray-300 rounded-md bg-gray-50
              focus:ring-2 focus:ring-[#7c3aed] font-mono resize-none transition
            "
          />
          <button
            onClick={copyOutput}
            aria-label="Copy converted time"
            className="absolute top-2 right-2 p-2 text-gray-500 hover:text-[#7c3aed] transition"
          >
            <ClipboardCopy className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}